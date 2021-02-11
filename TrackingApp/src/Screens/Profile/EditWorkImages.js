import axios from 'axios';
import {Formik} from 'formik';
import React, {useState,useEffect} from 'react';
import {Text, TouchableOpacity, View, ImageBackground,StyleSheet,Dimensions, Alert, Linking} from 'react-native';
import {Icon,ButtonGroup} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import * as Yup from 'yup';
import {FormButton} from '../../components/FormButton/FormButton.js';
import {FormInput} from '../../components/FormInput/FormInput.js';
import commonStyle from '../../config/commonStyle.js';
import {useNavigation} from '../../config/useNavigation.js';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import ImageView                  from 'react-native-image-view';
import {setUserDetails} from '../../redux/user/actions';
import {HeaderBar}                    from '../../layouts/Header/Header.js';
import {
  emailValidator,
  mobileValidator,
  passwordValidator,
  specialCharacterValidator,
} from '../../config/validators.js';
import Dialog from 'react-native-dialog';
import {withCustomerToaster} from '../../redux/AppState.js';
import { ScrollView } from '@react-navigation/native';
import {SET_PERSON_DETAILS}   from '../../redux/personDetails/types';
import { RNS3 }                 		from 'react-native-aws3';
import DateTimePickerModal          from "react-native-modal-datetime-picker";
import {FormDropDown}           from '../../components/FormDropDown/FormDropDown.js';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';        
import styles from './styles.js';    
import Loading                 	 		from '../../layouts/Loading/Loading.js';     
const window = Dimensions.get('window');

export const EditWorkImages = withCustomerToaster((props) => {
  const [btnLoading, setLoading] = useState(false);
  const [socialMediaArray, setSocialMediaArray] = useState([]);
  const dispatch = useDispatch();
  const {setToast} = props;

  const navigation = useNavigation();
  const store = useSelector((store) => ({
    personDetails: store.personDetails.data,
    userDetails  : store.userDetails,
    loading:store.loading,
    s3Details       	: store.s3Details.data,
  }));
  console.log("store",store.personDetails);



  return (
    <React.Fragment>
      <Formik
        onSubmit={(values,fun) => {
          setLoading(true);
          let {gallery,socialMediaArray} = values;
          var formValues ={
            person_id : store.personDetails._id,
            workImages : gallery,
            socialMediaArray: socialMediaArray
          }
          console.log("formValues",formValues);
            axios
            .patch('/api/personmaster/patch/workImages', formValues)
            .then((response) => {
              setLoading(false);
              if(response.data.updated){
                axios.get('/api/personmaster/get/one/'+store.personDetails._id)
                .then(personInfo => {
                  dispatch({
                    type: SET_PERSON_DETAILS,
                    payload: personInfo.data
                  });
                  setToast({text: "Updated Successfully", color: 'green'});
                })  
                .catch((error) => {
                  setLoading(false);
                  setToast({text: "Something went wrong.", color: 'red'});
                });
              }
                // navigation.goBack();
            })
            .catch((error) => {
              setLoading(false);
              setToast({text: "Something went wrong.", color: 'red'});
            });
        }}
        initialValues={{
          gallery    : store.personDetails.workImages && store.personDetails.workImages ? store.personDetails.workImages : [],
          socialMedia   : '',
          socialMediaUrl: '',
          socialMediaArray : store.personDetails.socialMediaArray && store.personDetails.socialMediaArray.length >0 ? store.personDetails.socialMediaArray:[]
        }}>
        {(formProps) => <FormBody btnLoading={btnLoading} setToast={setToast} store={store} {...formProps} />}
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
    values,
    setToast,
    store,
  } = props;
  console.log("values",values);
  const [openModal, setModal] = useState(false);
  const [showPassword, togglePassword] = useState(false);
  const navigation = useNavigation();
  const [gallery, setGallery] = useState(values.gallery ? values.gallery :[]);
  const [imageVisible, setImageVisible] = useState(false);
  const [image, setImage] = useState([]);
  const [imageLoading, setImageLoading] 	= useState(false);
  const [isDatePickerVisible, setDatePIcker] 	= useState(true);
  const [deleteDialogImg,setDeleteDialogImg]  = useState(false);
  const [deleteIndex,setDeleteIndex]          = useState(-1);
  const [deleteDialogIcon,setDeleteDialogIcon]  = useState(false);
  const [btnLoading1, setLoading1] = useState(false);

  const [socialMediaOptions, setSocialMediaOptions]       = useState([]);

console.log("gallery",gallery);
  useEffect(() => {
    axios.post("/api/socialmediamaster/get/list")
    .then((response) => {
      console.log("response",response);
      var socialMediaOptions = response.data.map(a=>{return{label:a.socialMedia,value:a._id+"^"+a.socialMedia+"^"+a.iconUrl}});
      console.log("socialMediaOptions",socialMediaOptions);
      setSocialMediaOptions(socialMediaOptions)
    })
    .catch((error) => {
       console.log("error12",error);
    })
  }, []);

  const dispatch = useDispatch();
  const buttons = ['Male', 'Female', 'Transgender']
  const genderFun =(e)=>{
    updateIndex(e);
    setFieldValue('gender',e);
  }

  const chooseFromLibrary = (props) => {
    var openType = props === 'openCamera' ? ImagePicker.openCamera : ImagePicker.openPicker;
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
                  multiple      : true,
                  waitAnimationEnd: false,
                  includeExif: true,
                  forceJpg: true,
                }).then(response => {
                  console.log("response",response);
                  response =  props === 'openCamera' ? [response] : response;
                  for (var i = 0; i<response.length; i++) {
                    if(response[i].path){
                      setImageLoading(true)
                    const file = {
                      uri  : response[i].path,
                      name : response[i].path.split('/').pop().split('#')[0].split('?')[0],
                      type : 'image/jpeg',
                    }
                    console.log("file",file);
                    if(file) {
                        var fileName = file.name; 
                        var ext = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2); 
                        if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){  
                          if(file){
                              RNS3
                              .put(file,store.s3Details)
                              .then((Data)=>{
                                console.log("data",Data);
                                setGallery([...gallery,Data.body.postResponse.location]);
                                setFieldValue('gallery',[...gallery,Data.body.postResponse.location ])
                                setImageLoading(false);
                              })
                              .catch((error)=>{
                                console.log("err",error)
                                setToast({text: 'Something went wrong.', color: 'red'});
                                setImageLoading(false);
                              });
                          }else{       
                              setToast({text: 'File not uploaded.', color: 'red'});
                              setImageLoading(false);
                          }
                        }else{
                            setToast({text: 'Only Upload  images format (jpg,png,jpeg).', color: 'red'});
                            setImageLoading(false);
                        }
                      }
                   }    
                 }   
                 setImageLoading(false);
                });
                break;
                case RESULTS.UNAVAILABLE:
              console.log(
                'This feature is not available (on this device / in this context)',
              );
              break;
            case RESULTS.DENIED:
              console.log(
                'The permission has not been requested / is denied but requestable',
              );
              break;
              case RESULTS.BLOCKED:
              console.log('The permission is denied and not requestable anymore');
              break;
            }
      })
      .catch(error => {
        setImageLoading(false);
        setToast({text: 'Something went wrong.', color: 'red'});
      });
  };

  const updateProfile=(profilePhoto)=>{
    var formValues = {
      person_id: store.personDetails._id,
      profilePhoto,
      updateBy:store.userDetails._id,
    }
      axios
        .patch('/api/personmaster/patch/personProfilePhoto', formValues)
        .then((response) => {
          setImageLoading(false);
          if(response.data.updated){
            axios.get('/api/personmaster/get/one/'+store.personDetails._id)
            .then(personInfo => {
              dispatch({
                type: SET_PERSON_DETAILS,
                payload: personInfo.data
              });
              setToast({text: "Updated Successfully", color: 'green'});
            })  
            .catch((error) => {
              setImageLoading(false);
              setToast({text: "Something went wrong.", color: 'red'});
              console.log('err', error);
            });
          }
            // navigation.goBack();
        })
        .catch((error) => {
          setImageLoading(false);
          setToast({text: "Something went wrong.", color: 'red'});
        });
    }
  
  handleMobileChange=(value)=> {
    handleChange('contactNo');
    if (value.startsWith && value.startsWith('+')) {
      value = value.substr(3);
    }
    let x = value.replace(/\D/g, '').match(/(\d{0,5})(\d{0,5})/);
    let y = x.input ? (!x[2] && !x[3]) ? '+91' + x[1] : (!x[3] ? '+91' + x[1] + '' + x[2] : '+91' + x[1] + '' + x[2] + '' + x[3]) : '';
    setFieldValue("contactNo",y)
  }

  addSocialMedia=()=>{
    if(values.socialMedia && values.socialMediaUrl){
      setLoading1(true);
      var socialMediaArray = values.socialMediaArray;
     socialMediaArray.push({
          social_id   : values.socialMedia.split("^")[0],
          name        : values.socialMedia.split("^")[1],
          icon        : values.socialMedia.split("^")[2],
          url         : values.socialMediaUrl
      })
      setFieldValue("socialMediaArray",socialMediaArray)
      setFieldValue("socialMedia",'')
      setFieldValue("socialMediaUrl",'')
      setLoading1(false);
    }else{
      setLoading1(false);
      Alert.alert('Please select option and add URL')
    }
  }
  console.log("values",values);
  return (
    <React.Fragment>
      <ScrollView style={commonStyle.modalView}>
          <FormDropDown
              data            = {socialMediaOptions}
              labelName       = "Social Media"
              placeholder 	  = "Select social media..."
              onChangeText 	  = {handleChange('socialMedia')}
              errors 		    	= {errors}
              name 			      = "socialMedia"
              value           = {values.socialMedia}
              required  		  = {true}
              touched 		    = {touched}
              iconName     	  = "building"
              iconType     	  = "font-awesome"
          />
          <FormInput
            onChangeText={handleChange('socialMediaUrl')}
            required={true}
            placeholder="Enter URL..."
            labelName="URL"
            name="socialMediaUrl"
            errors={errors}
            touched={touched}
            value={values.socialMediaUrl}
            iconName={'web'}
            iconType={'material-community'}
          />
           <FormButton
              title={'Add'}
              onPress={()=>addSocialMedia()}
              background={true}
              loading={btnLoading1}
              style={{zIndex:1,}}
          />

          <View style={{flexDirection:"row",flexWrap:"wrap",paddingHorizontal:15}} >  
              {values.socialMediaArray && values.socialMediaArray.length > 0 ?
                values.socialMediaArray.map((item,index)=>{
                  return(
                    <TouchableOpacity key={index} style={{padding:5}} 
                    onPress={() => {Linking.openURL(item.url)}}>
                      <ImageBackground
                        style={{height:50, width:50}}
                        source={{uri:item.icon}}
                        resizeMode={'cover'}
                      >
                        <View style={{alignItems:'flex-end'}}>
                              <TouchableOpacity onPress = {()=>{setDeleteDialogIcon(true),setDeleteIndex(index)}} style={styles.deleteIcon}>
                                <Icon size={15} name='close' type='font-awesome' color='#f00'/>
                              </TouchableOpacity>
                          </View>
                      </ImageBackground>
                    </TouchableOpacity>
                  );
                })
              :
             []
            }
           </View> 
            <Text style={[styles.label,{marginTop:25,paddingHorizontal:15}]}>Work Images</Text>
             <View style={{pmarginTop:15}}>
             {imageLoading ?
                <TouchableOpacity style={{height:60,width:80,backgroundColor:"#999",justifyContent:"center",borderRadius:10,margin:15}}>
					    		<Loading />
					    	</TouchableOpacity>
                :
                  <TouchableOpacity style={{height:60,width:80,backgroundColor:"#999",justifyContent:"center",borderRadius:10,margin:15}} onPress={() => setModal(true)}>
                    <Icon name="camera" size={30} color="white" type="font-awesome"/>
                  </TouchableOpacity>
                } 
              </View>
                 <View style={{flexDirection:"row",flexWrap:"wrap"}} >  
                  {gallery && gallery.length > 0 ?
                    gallery.map((item,index)=>{
                      return(
                        <TouchableOpacity key={index} style={{padding:15}} 
                        onPress={() => {
                            setImage([
                              {
                                source: {
                                  uri: item,
                                },
                                title: 'Photos',
                                // width: window.width,
                                // height: window.height,
                              },
                            ]),
                            setImageVisible(true);
                          }}>
                          <ImageBackground
                            style={{height:100, width: (window.width-120)/2}}
                            source={{uri:item}}
                            resizeMode={'cover'}
                          >
                          <View style={{alignItems:'flex-end'}}>
                              <TouchableOpacity onPress = {()=>{setDeleteDialogImg(true),setDeleteIndex(index)}} style={styles.deleteIcon}>
                                <Icon size={15} name='close' type='font-awesome' color='#f00'/>
                              </TouchableOpacity>
                          </View>
                          </ImageBackground>
                        </TouchableOpacity>
                      );
                    })
                  :
                  []
                }
              </View> 
              <FormButton
                title={'Save Changes'}
                onPress={handleSubmit}
                background={true}
                loading={btnLoading}
                style={{zIndex:1,}}
                />
        </ScrollView>
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
                onPress={() => chooseFromLibrary('openPicker')}>
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
            <Dialog.Button label="Delete" onPress={()=>{setDeleteDialogImg(false),gallery.splice(deleteIndex, 1)}}/>
          </Dialog.Container>
          <Dialog.Container visible={deleteDialogIcon}>
            <Dialog.Title>Are you sure?</Dialog.Title>
            <Dialog.Description>
              Once deleted, you will not be able to recover this Image!
            </Dialog.Description>
            <Dialog.Button label="Cancel" onPress={()=>setDeleteDialogIcon(false)} />
            <Dialog.Button label="Delete" onPress={()=>{setDeleteDialogIcon(false),values.socialMediaArray.splice(deleteIndex, 1)}}/>
          </Dialog.Container>
          <ImageView
            images={image}
            imageIndex={0}
            isVisible={imageVisible}
            onClose={() => setImageVisible(false)}
          />
    </React.Fragment>
  );
};
