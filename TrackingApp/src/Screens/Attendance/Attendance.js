import React, {useState,useEffect}         from 'react';
import {View, ImageBackground,Dimensions,Text,StyleSheet,TouchableOpacity,ScrollView,Image}   from 'react-native';
import {Button, Icon, Input}    from 'react-native-elements';
import { colors, sizes }        from '../../config/styles.js';
import commonStyle              from '../../config/commonStyle.js';
import {HeaderBar}              from '../../layouts/Header/Header.js';
import {useNavigation}          from '../../config/useNavigation.js';
import {FormInput}              from '../../components/FormInput/FormInput.js';
import {FormButton}             from '../../components/FormButton/FormButton.js';
import {FormDropDown}           from '../../components/FormDropDown/FormDropDown.js';
import {Formik, ErrorMessage}   from 'formik';
import {
  specialCharacterValidator,
  passwordValidator,
  emailValidator,
  mobileValidator,
}                                 from '../../config/validators.js';
import * as Yup                   from 'yup';
import {useSelector, useDispatch} from 'react-redux';
import Dialog                     from 'react-native-dialog';
import ImagePicker                from 'react-native-image-crop-picker';
import {PERMISSIONS, request, RESULTS}  from 'react-native-permissions';
import ImageView                  from 'react-native-image-view';
import {withCustomerToaster}      from '../../redux/AppState.js';
import axios                      from 'axios';
import { getClientTicketsList }   from '../../redux/ticketList/actions';
import { RNS3 }                   from 'react-native-aws3';
import { KeyboardAwareScrollView }from 'react-native-keyboard-aware-scroll-view';
import HTML                       from 'react-native-render-html';
// import CKEditor from 'react-native-ckeditor';
import { WebView }                from 'react-native-webview';
import Video                      from 'react-native-video';
import {
    SET_CAMERA_LOCATIONS}         from '../../redux/list/types';
import {CurrentTime}              from './CurrentTime.js';
import Geolocation                from 'react-native-geolocation-service';
import {SET_STARTING_COORDINATES} from '../../redux/attendance/types';
import Loading                      from '../../layouts/Loading/Loading.js';

const window = Dimensions.get('window');

const AttendanceSchema = Yup.object().shape({
  odometerReading    : Yup.string().required('This field is required'),
});

export const Attendance = withCustomerToaster((props) => {
  const navigation  = useNavigation();
  const dispatch    = useDispatch();
  const {setToast}  = props;
  const [btnLoading, setLoading]  = useState(false);
  const [pageLoading, setPageLoading]        = useState(true);
  const store = useSelector(store => ({
    userDetails     : store.userDetails,
    attendance      : store.attendance,
  }));
   useEffect(() => {
     axios
      .get('/api/attendance/get/get_tracking_status/'+store.userDetails.user_id)
      .then((attendance)=>{
        if(attendance.data && attendance.data.tracking_status){
           dispatch({
              type:SET_STARTING_COORDINATES,
              payload:{
                attendance_id:attendance.data._id,
                longitude:attendance.data.startLocation.longitude,
                latitude:attendance.data.startLocation.latitude,
              }
            })
          setPageLoading(false);
          navigation.navigate('StartLocationDetails')
        }else{
          setPageLoading(false);
        }
      })
      .catch(error=>{
        setPageLoading(false);   
      })
    }, [store.userDetails.user_id])  

    return (
      <React.Fragment>
        <Formik
            onSubmit={(values,fun) => {
              setLoading(true);
              if(values.odometerProof !== ""){
                Geolocation.getCurrentPosition(position => {
                 const formValues = {
                    startDateTime: new Date(),
                    startLocation :{
                        longitude : position.coords.longitude,
                        latitude  : position.coords.latitude
                    },
                    startOdometer:{
                      Reading:values.odometerReading,
                      Proof:values.odometerProof
                    },
                    user_id : store.userDetails.user_id,
                    locationAt: new Date(),
                  };

                  axios
                  .post('/api/attendance/post/startDetails',formValues)
                    .then((attendance)=>{
                      fun.resetForm(values);
                      dispatch({
                        type:SET_STARTING_COORDINATES,
                        payload:{
                          attendance_id:attendance.data.attendance_id,
                          longitude:position.coords.longitude,
                          latitude:position.coords.latitude
                        }
                      })
                      navigation.navigate('StartLocationDetails')
                    })
                    .catch(error=>{
                    })
                      error => console.log(error)
                  });
              }else{
                setToast({text: 'Please attach odometer proof', color: colors.warning});
              }
            }}
            validationSchema={AttendanceSchema}
            initialValues={{
              odometerReading : '',
              odometerProof:'',
            }}>
            {formProps => 
              <FormBody 
              btnLoading    = {btnLoading} 
              pageLoading   = {pageLoading}
              navigation    =   {navigation} 
              setToast      =   {setToast}
              {...formProps} 
              />
            }
          </Formik>
        
      </React.Fragment>
    );
});

const FormBody = props => {
  const {
    handleChange,
    handleSubmit,
    errors,
    touched,
    btnLoading,
    setFieldValue,
    navigation,
    pageLoading,
    setToast,
    values
  } = props;
  const [openModal, setModal]       = useState(false);
  const [image, setImage]              = useState();
  const [imageView, setImageView]         = useState();
  const [imageVisible, setImageVisible]   = useState(false);
  const [deleteDialogImg,setDeleteDialogImg]      = useState(false);
  const backButton = navigation.getParam('backButton');
  const store = useSelector(store => ({
    s3Details         : store.s3Details.data,
  }));
  const {list,clientDetails,s3Details} = store;
  const chooseFromLibrary = (openType) => {
      var openType = openType === 'openCamera' ? ImagePicker.openCamera : ImagePicker.openPicker;
      request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      )
        .then(result => {
      setModal(false);
          switch (result) {
            case RESULTS.GRANTED:
              openType({
                width     : window.width,
                height    : window.height,
                cropping    : true,
                multiple      : true,
              }).then(response => {
                const file = {
                  uri  : response.path,
                  name : response.path.split('/').pop().split('#')[0].split('?')[0],
                  type : 'image/jpeg',
                }
                if(file) {
                  var fileName = file.name; 
                  var ext = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2); 
                  if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){  
                    if(file){
                        RNS3
                        .put(file,s3Details)
                        .then((Data)=>{
                          setImage(Data.body.postResponse.location);
                          setFieldValue('odometerProof', Data.body.postResponse.location);
                       })
                      .catch((error)=>{
                        setToast({text: 'Something went wrong.', color: 'red'});
                      });
                    }else{       
                        setToast({text: 'File not uploaded.', color: 'red'});
                    }
                  }else{
                      setToast({text: 'Only Upload  images format (jpg,png,jpeg).', color: 'red'});
                  }
                }
            });
            break;
          }
        })
        .catch(error => {
        setToast({text: 'Something went wrong.', color: 'red'});
        });
    };


  return(
     <React.Fragment>
        <HeaderBar navigation={navigation} showBackBtn={true} title="Attendance"/>
        {!pageLoading ?
            <ScrollView contentContainerStyle={[commonStyle.container,{justifyContent:'center'}]}>
            <View style={{alignItems:"center",marginTop:55}}>
              <CurrentTime />
              <View style={{width:320}}>
                <FormInput
                  labelName     = "Odometer Reading"
                  placeholder   = "Odometer reading..."
                  onChangeText  = {handleChange('odometerReading')}
                  required      = {true}
                  name          = "odometerReading"
                  keyboardType  = "numeric"
                  errors        = {errors}
                  touched       = {touched}
                  iconName      = {'tachometer'}
                  iconType      = {'font-awesome'}
                />
              </View>
              {image ?
                  <TouchableOpacity style={styles.imageView} 
                    onPress={() => {
                            setImageView([
                              {
                                source: {
                                  uri: image,
                                },
                                title: 'Photos',
                                width: window.width-20,
                                height: window.height-20,
                              },
                            ]);
                            setImageVisible(true);
                          }}>
                        <ImageBackground
                          style={{width:"100%",height:"100%"}}
                          source={{uri:image}}
                          resizeMode={'contain'}
                        >
                        <View style={{alignItems:'flex-end'}}>
                            <Icon size={15} name='close' type='font-awesome' color='#f00'  onPress = {()=>setDeleteDialogImg(true)} />
                        </View>
                        </ImageBackground>
                    </TouchableOpacity>
                  :
                  <TouchableOpacity style={styles.imageView} onPress={() => chooseFromLibrary('openCamera')}>
                      <Icon name="camera" size={30} color="white" type="font-awesome"/>
                  </TouchableOpacity>    
                }
              
                <Button
                  title       = {"Start"}
                  onPress     = {handleSubmit}
                  buttonStyle ={styles.startButton}
                  titleStyle  ={{fontSize:25}}
                  icon={{
                    name: "play-circle",
                    size: 40,
                    color: colors.white,
                    type: "font-awesome"
                  }}
                  iconContainerStyle={{marginLeft:30}}
                  iconRight
                />
            </View> 
          </ScrollView>
          :
          <Loading />
        }
        <Dialog.Container
            visible={openModal}
            container={{borderRadius: 30}}
            onDismiss={() => setModal(!openModal)}>
            <Dialog.Title style={{alignSelf: 'center'}}>
              Select an image
            </Dialog.Title>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={commonStyle.block1}
                onPress={() => chooseFromLibrary('openCamera')}>
                <Icon
                  name="camera"
                  type="material-community"
                  size={50}
                  color={'#aaa'}
                  style={{}}
                />
                <Text>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={commonStyle.block1}
                onPress={() => chooseFromLibrary('openPicker',)}>
                <Icon
                  name="upload"
                  type="font-awesome"
                  size={50}
                  color="#aaa"
                  style={{}}
                />
                <Text>Gallery</Text>
              </TouchableOpacity>
            </View>
     
            <Dialog.Button label="Cancel" onPress={() => setModal(false)} />
          </Dialog.Container>

          <Dialog.Container visible={deleteDialogImg}>
            <Dialog.Title>Are you sure?</Dialog.Title>
            <Dialog.Description>
              Once deleted, you will not be able to recover this Image!
            </Dialog.Description>
            <Dialog.Button label="Cancel" onPress={()=>setDeleteDialogImg(false)} />
            <Dialog.Button label="Delete" onPress={()=>{setDeleteDialogImg(false),setImage()}}/>
          </Dialog.Container>
          {imageVisible ? (
          <ImageView
            images={imageView}
            imageIndex={0}
            isVisible={imageVisible}
            onClose={() => setImageVisible(false)}
          />
        ) : null} 
      </React.Fragment>    
  );
};

const styles = StyleSheet.create({
  startButton:{
    height:70,
    width:200,
    backgroundColor:colors.theme,
    alignItems:"center",
    justifyContent:"center",
    borderRadius:100,
    flexDirection:"row"
  },
  imageView:{
    height:100,
    width:100,
    backgroundColor:"#999",
    justifyContent:"center",
    marginBottom:25
  }
});