import axios from 'axios';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View, ImageBackground,StyleSheet} from 'react-native';
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
const EditProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('This field is required')
    .test(
      'special character test',
      'This field cannot contain only special characters or numbers',
      specialCharacterValidator,
    ),
    lastName: Yup.string()
    .required('This field is required')
    .test(
      'special character test',
      'This field cannot contain only special characters or numbers',
      specialCharacterValidator,
    ),
  email: Yup.string()
    .required('This field is required')
    .test(
      'email validation test',
      'Enter a valid email address',
      emailValidator,
    ),
  contactNo: Yup.string()
    .required('This field is required')
    .test(
      'mobile validation test',
      'Enter a valid mobile number',
      mobileValidator,
    ),
    DOB: Yup.string()
    .required('This field is required'),
    gender: Yup.string()
    .required('This field is required')
});

export const EditProfile = withCustomerToaster((props) => {
  const [btnLoading, setLoading] = useState(false);
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
        onSubmit={(data) => {
          console.log("DAta",data);
          setLoading(true);
          let {firstName,middleName,lastName,email, contactNo, altContactNo,whatsappNo,gender,DOB,workLocationId,workLocation} = data;
          var formValues = {
            person_id: store.personDetails._id,
            firstName,
            middleName,
            lastName,
            DOB,
            gender:gender === 0 ? "Male" : gender === 1 ? "Female" : gender === 2 ? "Transgender" : "",
            contactNo,
            altContactNo,
            email,
            whatsappNo,
            workLocationId,
            workLocation,
          };
          console.log("formValues",formValues);
          axios
            .patch('/api/personmaster/patch/basicInfo', formValues)
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
        validationSchema={EditProfileSchema}
        initialValues={{
          firstName       : store.personDetails.firstName,
          middleName      : store.personDetails.middleName,
          lastName        : store.personDetails.lastName,
          email           : store.personDetails.email,
          contactNo       : store.personDetails.contactNo,
          altContactNo    : store.personDetails.altContactNo,
          whatsappNo      : store.personDetails.whatsappNo,
          gender          : store.personDetails.gender === "Male" ? 0 : store.personDetails.gender === "Female" ? 1 : store.personDetails.gender === "Transgender"? 2 :"" ,
          DOB             : store.personDetails.DOB ? new Date(store.personDetails.DOB) : null,
          workLocationId  : store.personDetails.workLocationId,
          workLocation    : store.personDetails.workLocation,
          profilePhoto    : store.personDetails.profilePhoto,
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
  const [openModal, setModal] = useState(false);
  const [showPassword, togglePassword] = useState(false);
  const navigation = useNavigation();
  const [gallery, setGallery] = useState([]);
  const [imageVisible, setImageVisible] = useState(false);
  const [image, setImage] = useState('');
  const [imageLoading, setImageLoading] 	= useState(false);
  const [isDatePickerVisible, setDatePIcker] 	= useState(true);
  const [selectedIndex, updateIndex] 	= useState(values.gender);

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
              waitAnimationEnd: false,
              includeExif: true,
              forceJpg: true,
            }).then(response => {
              setImageLoading(true);
                if(response.path){
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
                            .put(file,store.s3Details)
                            .then((Data)=>{
                              setFieldValue('profilePhoto', Data.body.postResponse.location);
                              updateProfile(Data.body.postResponse.location)
                              setImageLoading(false);
                            })
                            .catch((error)=>{
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
  
  return (
    <React.Fragment>
      <ScrollView style={commonStyle.modalView}>
        <ImageBackground
          source={
            values.profilePhoto && values.profilePhoto !== ''
              ? {uri: values.profilePhoto}
              : require('../../images/user.jpg')
          }
          style={{
            width: 100,
            height: 100,
            borderRadius: 100,
            alignSelf: 'center',
          }}
          imageStyle={{borderRadius: 100}}>
          <TouchableOpacity
            style={{
              width: 30,
              height: 30,
              backgroundColor: '#283593',
              justifyContent: 'center',
              marginTop: 60,
              marginLeft: 60,
              borderRadius: 100,
            }}
            onPress={() => setModal(true)}>
            <Icon size={15} name="camera" type="font-awesome" color="#fff" />
          </TouchableOpacity>
        </ImageBackground>
        <FormInput
          onChangeText={handleChange('firstName')}
          required={true}
          placeholder="Enter first name..."
          labelName="First Name"
          name="firstName"
          errors={errors}
          touched={touched}
          value={values.firstName}
          iconName={'account'}
          iconType={'material-community'}
        />
        <FormInput
          onChangeText={handleChange('middleName')}
          placeholder="Enter middle name..."
          labelName="Middle Name"
          name="middleName"
          value={values.middleName}
          errors={errors}
          touched={touched}
          iconName={'account'}
          iconType={'material-community'}
        />
        <FormInput
          onChangeText={handleChange('lastName')}
          required={true}
          placeholder="Enter last name..."
          labelName="Last Name"
          name="lastName"
          errors={errors}
          touched={touched}
          value={values.lastName}
          iconName={'account'}
          iconType={'material-community'}
        />
        <FormInput
          labelName="Email Id"
          placeholder="Email Id"
          onChangeText={handleChange('email')}
          required={true}
          name="email"
          value={values.email}
          errors={errors}
          touched={touched}
          iconName={'email'}
          iconType={'material-community'}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={false}
          multiline={true}
        />
        <FormInput
          labelName="Mobile Number"
          placeholder="Mobile Number"
          onChangeText={handleMobileChange}
          errors={errors}
          touched={touched}
          value={values.contactNo}
          name="contactNo"
          required={true}
          iconName={'phone'}
          iconType={'material-community'}
          keyboardType="numeric"
        />
        <FormInput
          labelName="Alternative Mobile Number"
          placeholder="Alternative Mobile Number"
          onChangeText={handleChange('altContactNo')}
          errors={errors}
          touched={touched}
          value={values.altContactNo}
          name="altContactNo"
          iconName={'phone'}
          iconType={'material-community'}
          keyboardType="numeric"
        />
        <FormInput
          labelName="WhatsApp Number"
          placeholder="WhatsApp Number"
          onChangeText={handleChange('whatsappNo')}
          errors={errors}
          touched={touched}
          value={values.whatsappNo}
          name="whatsappNo"
          iconName={'phone'}
          iconType={'material-community'}
          keyboardType="numeric"
        />
        <View style={{ marginHorizontal: 10,}}>
        <Text style={{fontFamily:'Montserrat-SemiBold', fontSize: 14,}}>
          <Text>Date of birth</Text>{' '}
          <Text style={{color: 'red', fontSize: 12}}>*</Text>
        </Text>
          <View style={{paddingVertical:10}}>
            <DatePicker
              style={{width: window.width}}
              date={values.DOB ? values.DOB : ""} //initial date from state
              mode="date" //The enum of date, datetime and time
              placeholder="Select date of birth"
              // format="DD-MM-YYYY"
              maxDate={new Date(moment().subtract(18, "years"))}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 25,
                  top: 4,
                  marginLeft: 0,
                  borderRightWidth:1,
                  borderColor:"#333"
                },
                dateInput: {
                  height:50,
                  borderColor:"#ccc",
                  borderRadius:5,
                  paddingVertical:10
                }
              }}
              onDateChange={handleChange('DOB')}
            />
          </View>
          <Text style={{fontFamily:'Montserrat-SemiBold', fontSize: 12,color:"red"}}>{touched['DOB'] && errors['DOB'] ? errors['DOB'] : ''}</Text>
        </View>
        <View style={{marginTop:15}}>
          <Text style={{fontFamily:'Montserrat-SemiBold', fontSize: 14,marginHorizontal:10}}>
            <Text>Gender</Text>{' '}
            <Text style={{color: 'red', fontSize: 12}}>*</Text>
          </Text>
            <ButtonGroup
              onPress={genderFun}
              selectedIndex={selectedIndex}
              buttons={buttons}
              containerStyle={{height: 40}}
            /> 
            <Text style={{fontFamily:'Montserrat-SemiBold', fontSize: 12,color:"red",marginHorizontal:10}}>{touched['gender'] && errors['gender'] ? errors['gender'] : ''}</Text>
        </View>   
        <FormButton
          title={'Save Changes'}
          onPress={handleSubmit}
          background={true}
          loading={btnLoading}
        />
      </ScrollView>
      <Dialog.Container
        visible={openModal}
        container={{borderRadius: 30}}
        onDismiss={() => setModal(false)}>
        <Dialog.Title style={{alignSelf: 'center'}}>
          Select an image
        </Dialog.Title>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={commonStyle.block1} 
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
    </React.Fragment>
  );
};
