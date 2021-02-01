import React , {useState,useEffect} from 'react';
import {View, ImageBackground,Dimensions,Text,StyleSheet,TouchableOpacity,ScrollView,Image,Modal}  from 'react-native';
import {Button, Icon, Input}    from 'react-native-elements';
import { colors, sizes }        from '../../config/styles.js';
import commonStyle              from '../../config/commonStyle.js';
import {HeaderBar}              from '../../layouts/Header/Header.js';
import {useNavigation}          from '../../config/useNavigation.js';
import {connect, useSelector,useDispatch}   from 'react-redux';
import {CurrentTime}                 from './CurrentTime.js';
import { request,check,PERMISSIONS,RESULTS }  from 'react-native-permissions';
import {SET_STARTING_COORDINATES} from '../../redux/attendance/types';
import Geolocation                from 'react-native-geolocation-service';
import MapView, 
        { PROVIDER_GOOGLE, 
          Polyline, 
          Marker, 
          AnimatedRegion, 
          Animated 
        } from 'react-native-maps';
import axios from 'axios';
import Loading                      from '../../layouts/Loading/Loading.js';
import Dialog                       from "react-native-dialog";
import moment from 'moment';
import {FromLocation}               from './FromLocation.js';
import {FormButton}                 from '../../components/FormButton/FormButton.js';
import {withCustomerToaster}        from '../../redux/AppState.js';
import * as Yup                     from 'yup';
import {Formik, ErrorMessage}       from 'formik';
import {FormInput}                  from '../../components/FormInput/FormInput.js';
import {FormDropDown}               from '../../components/FormDropDown/FormDropDown.js';
import ImagePicker                  from 'react-native-image-crop-picker';
import { RNS3 }                     from 'react-native-aws3';
import ImageView                    from 'react-native-image-view';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const haversine = require('haversine')
const window = Dimensions.get('window');

const AttendanceSchema = Yup.object().shape({
  odometerReading    : Yup.string().required('This field is required'),
});

export const StartLocationDetails         = withCustomerToaster((props) => {
  const navigation                        = useNavigation();
  const dispatch                          = useDispatch();
  const {setToast}                        = props;
  const [btnLoading, setLoading]          = useState(false);
  const [startDetails, setStartDetails]   = useState('');
  const [showMap, setShowMap]             = useState(false);
 

  const store = useSelector(store => ({
    userDetails     : store.userDetails,
    attendance      : store.attendance,
  }));
  console.log("store,store",store);

   const [prevLatLng, setPrevLatLng] = useState({
      latitude          : store.attendance.latitude,
      longitude         : store.attendance.longitude,
      distanceTravelled : 0
    });

    const [routeCoordinates, setRoutecoordinates] = useState([]);
    const [idVar, setIdVar] = useState(0);


    useEffect(() => {
       axios.get('/api/attendance/get/startDetails/'+store.attendance.attendance_id)
          .then((startDetails)=>{
            setStartDetails(startDetails.data)
            watchPosition();
          })
        .catch(error=>{
          console.log("error=>",error)
        })
    }, [])
  


    const watchPosition = (props) => {
       watchID = Geolocation.watchPosition(position => {
        console.log("position",position);
        const newCoordinate = {
          latitude          : position.coords.latitude,
          longitude         : position.coords.longitude,
          createdAt         : new Date(),
        };
        // if(prevLatLng.longitude !== newCoordinate.longitude &&  prevLatLng.latitude !== newCoordinate.latitude){
            // routeCoordinates.push(newCoordinate);
            var locValues = {
              tracking_id       : store.attendance.attendance_id,
              routeCoordinates  : newCoordinate,
            }
            console.log("locValues",locValues);
            axios
              .patch("/api/attendance/patch/routeCoordinates",locValues)
              .then((locResponse)=>{
                console.log("locResponse",locResponse);
                if(locResponse.data.tracking_status){
                  setRoutecoordinates([]);
                }else{
                  if(watchID !== null) {
                    Geolocation.clearWatch(watchID);
                  }
                }
              })
              .catch((error)=>{
                console.log("error = ",error.message);
              });
        // }else{
        //   console.log("same coordinate");
        // }
      },
      (error) => {console.log(error.code, error.message)},
        { 
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval:5000,
          fastestInterval:2000,
          forceRequestLocation:true,
          showLocationDialog:true,
          useSignificantChanges:true
        }
      );
    };

    const calcDistance = (prevLatLng, newLatLng) =>{
      var distTravelled = haversine(prevLatLng, newLatLng);
      return distTravelled;
    }
    return (
      <React.Fragment>
        <Formik
            onSubmit={(values,fun) => {
              console.log("values",values);
              fun.resetForm(values);
              setLoading(true);
              if(values.odometerProof !== ""){
               if(watchID !== null) {
                  Geolocation.clearWatch(watchID);
                }
                const endTrackingValues={
                    endDateAndTime : new Date(),
                    tracking_id    : store.attendance.attendance_id,
                    endOdometer:{
                      Reading:values.odometerReading,
                      Proof:values.odometerProof
                    },
                  }
                   axios
                    .patch("/api/attendance/patch/endDetails",endTrackingValues)
                    .then((locResponse)=>{
                      if(locResponse){
                          navigation.navigate('LocationDetails',{attendance_id:store.attendance.attendance_id})
                      }
                    })
                    .catch((error)=>{
                      console.log("error = ",error.message);
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
              <React.Fragment>
              <HeaderBar navigation={navigation} showBackBtn={true} title="Start Details"/>
              {startDetails.startLocation? 
                <ScrollView contentContainerStyle={[commonStyle.container,{alignItems:'center',justifyContent:'center'}]}>
                  <CurrentTime />
                  <View style={{height:60,width:"100%",paddingHorizontal:50}}>
                      <View style={{flexDirection:"row"}}>
                        <Icon size={25} name='map-marker' type='font-awesome' color={colors.theme} />
                        <Text style={{fontSize:20,color:colors.theme,paddingHorizontal:5}}>Started At</Text>
                      </View>
                     <View style={{flexDirection:"row"}}>
                        <Text style={{fontSize:18}}>{moment(startDetails.startDateAndTime).format('LTS')+" From Location"}</Text>
                        <Icon name= "location" size= {20} color= {colors.theme} type="entypo" iconStyle={{paddingHorizontal:5}} onPress={()=>setShowMap(true)}/>
                     </View>  
                  </View> 
                    <FormBody 
                    btnLoading    = {btnLoading} 
                    navigation    =   {navigation} 
                    setToast      =   {setToast}
                    startDetails   = {startDetails}
                    {...formProps} 
                    />
                   </ScrollView> 
                  :
                  <Loading />
                }
                <Modal
                  visible={showMap}
                  animationType={'slide'}
                  onDismiss={() => setShowMap(false)}
                  onRequestClose={() => setShowMap(false)}>
                  <View Style={commonStyle.container}>
                        <FromLocation coordinates={startDetails.startLocation} />
                    </View>
                </Modal>
              </React.Fragment>    
            }
          </Formik>
        
      </React.Fragment>
    );
});


 const FormBody = (props) => {
   const {
    handleChange,
    handleSubmit,
    errors,
    touched,
    btnLoading,
    setFieldValue,
    navigation,
    setToast,
    values
  } = props;
    const [modal, setModal] = useState(false);
  const [image, setImage]         = useState();
  const [imageView, setImageView]         = useState();
  const [imageVisible, setImageVisible]   = useState(false);
  const [deleteDialogImg,setDeleteDialogImg]      = useState(false);
  const store = useSelector(store => ({
    s3Details         : store.s3Details.data,
  }));
  const {s3Details} = store;

    const dispatch = useDispatch();
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
    return (
      <React.Fragment>
        
             {/* <View style={{marginBottom:50}}>
                <FromLocation coordinates={startDetails.startLocation} />
              </View>*/}
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
                <TouchableOpacity style={styles.imageView}  onPress={() => chooseFromLibrary('openCamera')}>
                    <Icon name="camera" size={30} color="white" type="font-awesome"/>
                </TouchableOpacity>    
              }
              <Button
                title       = {"End"}
                onPress     = {handleSubmit}
                buttonStyle ={styles.startButton}
                titleStyle  ={{fontSize:25}}
                icon={{
                  name: "stop-circle",
                  size: 40,
                  color: colors.white,
                  type: "font-awesome"
                }}
                iconContainerStyle={{marginLeft:30}}
                iconRight
              />
            
           <Dialog.Container
            visible={modal}
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
const mapStateToProps = (store)=>{
  return {
    userDetails : store.userDetails,
  }
  
};
export default connect(mapStateToProps,{})(StartLocationDetails);
