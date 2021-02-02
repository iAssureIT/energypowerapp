import axios from 'axios';
import {Formik} from 'formik';
import React, {useState,useEffect,useRef} from 'react';
import {Text, TouchableOpacity, View, ImageBackground,StyleSheet,Dimensions,Modal} from 'react-native';
import {Icon,ButtonGroup} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import * as Yup from 'yup';
import {FormButton} from '../../components/FormButton/FormButton.js';
import {FormInput} from '../../components/FormInput/FormInput.js';
import commonStyle from '../../config/commonStyle.js';
import {useNavigation} from '../../config/useNavigation.js';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
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
import DatePicker from 'react-native-datepicker';
import moment from 'moment';                 
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import styles from './styles.js';
import MapView, {PROVIDER_GOOGLE,Marker} from 'react-native-maps';
import { KeyboardAwareScrollView }      from 'react-native-keyboard-aware-scroll-view';
import Geocoder from 'react-native-geocoding';
const window = Dimensions.get('window');


export const EditWorkImages = withCustomerToaster((props) => {
const store = useSelector((store) => ({
    personDetails: store.personDetails.data,
    userDetails  : store.userDetails,
    loading:store.loading,
    s3Details       	: store.s3Details.data,
}));
  const [btnLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {setToast} = props;
  const [imageVisible, setImageVisible]       = useState(false);
  const [image, setImage]                     = useState();
  const [gallery, setGallery]       = useState(store.personDetails.workImages ? store.personDetails.workImages :[]);
  const [deleteDialogImg,setDeleteDialogImg]  = useState(false);
  const [deleteIndex,setDeleteIndex]          = useState(false);
  const [openModal, setModal]                 = useState(false);
  const [imageLoading, setImageLoading]       = useState(false);

  const navigation = useNavigation();
 
  console.log("store",store);

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
                setImageLoading(true);
                  response =  props === 'openCamera' ? [response] : response;
                  for (var i = 0; i<response.length; i++) {
                      if(response[i].path){
                const file = {
                  uri  : response[i].path,
                  name : response[i].path.split('/').pop().split('#')[0].split('?')[0],
                  type : 'image/jpeg',
                }
                  if(file) {
                        var fileName = file.name; 
                        var ext = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2); 
                        if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){  
                          if(file){
                              RNS3
                              .put(file,store.s3Details)
                              .then((Data)=>{
                                 setGallery([
                              ...gallery,
                              Data.body.postResponse.location,
                            ]);
                            // gallery.push(Data.body.postResponse.location) ; 
                            // setFieldValue('images', gallery);
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

  const handleSubmit=()=>{
      var formValues ={
        person_id : store.personDetails._id,
        workImages : gallery
      }
      console.log("formValues",formValues)
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
}
 
  console.log("store",store.personDetails);
  return (
    <React.Fragment>
      <KeyboardAwareScrollView  behavior="padding"  keyboardShouldPersistTaps='always'  getTextInputRefs={() => { return [this._textInputRef];}}>
            <View style={commonStyle.modalView}>
            <Text style={styles.label}>Work Images</Text>
             <ScrollView contentContainerStyle={{flexDirection:"row",paddingVertical:25}} horizontal={true}>
                  <TouchableOpacity style={{height:60,width:80,backgroundColor:"#999",justifyContent:"center",borderRadius:10,margin:15}} onPress={() => setModal(true)}>
                    <Icon name="camera" size={30} color="white" type="font-awesome"/>
                  </TouchableOpacity>
                  {gallery && gallery.length > 0 ?
                    gallery.map((item,index)=>{
                      return(
                        <TouchableOpacity key={index} style={commonStyle.image} 
                        onPress={() => {
                            setImage([
                              {
                                source: {
                                  uri: item,
                                },
                                title: 'Photos',
                                width: window.width,
                                height: window.height,
                              },
                            ]);
                            setImageVisible(true);
                          }}>
                          <ImageBackground
                            style={{height: 60, width: 60}}
                            source={{uri:item}}
                            resizeMode={'contain'}
                          >
                          <View style={{alignItems:'flex-end'}}>
                              <Icon size={15} name='close' type='font-awesome' color='#f00'  onPress = {()=>{setDeleteDialogImg(true),setDeleteIndex(index)}} />
                          </View>
                          </ImageBackground>
                        </TouchableOpacity>
                      );
                    })
                  :
                  []
                }
              </ScrollView> 
              <FormButton
                title={'Save Changes'}
                onPress={handleSubmit}
                background={true}
                loading={btnLoading}
                style={{zIndex:1,}}
                />
            </View>
       </KeyboardAwareScrollView>   
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
         
       {imageVisible ? (
          <ImageView
            images={image}
            imageIndex={0}
            isVisible={imageVisible}
            onClose={() => setImageVisible(false)}
          />
        ) : null}   
    </React.Fragment>
  );
});
