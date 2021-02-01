import AsyncStorage       from '@react-native-community/async-storage';
import axios              from 'axios';
import {Formik}           from 'formik';
import React, {useState}  from 'react';
import {ImageBackground}  from 'react-native'
import {Dimensions, Text, TouchableOpacity, View,Image} from 'react-native';
import {Icon}             from 'react-native-elements';
import {useDispatch}      from 'react-redux';
import * as Yup           from 'yup';
import {FormButton}       from '../../components/FormButton/FormButton.js';
import {FormInput}        from '../../components/FormInput/FormInput.js';
import commonStyle        from '../../config/commonStyle.js';
import {useNavigation}    from '../../config/useNavigation.js';
import {setUserDetails}   from '../../redux/user/actions';
import {SET_PERSON_DETAILS}   from '../../redux/personDetails/types';
import {emailValidator}   from '../../config/validators.js';
import {withCustomerToaster} from '../../redux/AppState.js';
import {colors, sizes}    from '../../config/styles.js';
import {getClientDetails} from '../../redux/clientDetails/actions';
import {getDasboardCount} from '../../redux/technicianDashboardCount/actions';
import {getClientDasboardCount} from '../../redux/clientDashboardCount/actions';
import { getS3Details }     from '../../redux/s3Details/actions';
import {getPersonDetails}             from '../../redux/personDetails/actions';

const window = Dimensions.get('window');
const LoginSchema = Yup.object().shape({
  email_id: Yup.string()
    .required('This field is required')
    .test(
      'email validation test',
      'Enter a valid email address',
      emailValidator,
    ),
});

//wrap component with withCustomerToaster hoc
export const ForgotPassword = withCustomerToaster((props) => {
  const [btnLoading, setLoading] = useState(false);
  const {setToast} = props; //setToast function bhetta
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (
    <React.Fragment>
      <Formik
        onSubmit={(data) => {
          setLoading(true);
          let {email_id} = data;
          var formValues = {
            username : "email",
            "emailSubject"	: "Email Verification", 
			      "emailContent"  : "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
        }
          axios.patch('/api/auth/patch/setsendemailotpusingEmail/'+email_id,formValues)
            .then(response => {
                console.log("response",response);
                setLoading(false);
                if(response.data.message == 'OTP_UPDATED') {
                    navigation.navigate('OTPVerification');
                    setToast({text: 'OTP sent successfully!', color: 'green'});
                    navigation.navigate('OTPVerification',{user_id:response.data.ID})
                }else if(response.data.message == 'NOT_REGISTER'){
                    setToast({text: "This Email Id is not registered.", color: colors.warning});
                }else if(response.data.message == 'OTP_NOT_UPDATED'){
                    setToast({text: 'Something went wrong.', color: 'red'});
                }
            })
            .catch(error => {
                console.log("error",error);
                setToast({text: 'Something went wrong.', color: 'red'});
                setLoading(false)
                if (error.response.status == 401) {
                }
            })
         
        }}
        validationSchema={LoginSchema}
        initialValues={{
          email_id: '',
        }}>
        {(formProps) => (
          <FormBody
            btnLoading={btnLoading}
            navigation={navigation}
            {...formProps}
          />
        )}
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
  } = props;
  const [openModal, setModal] = useState(false);
  const [showPassword, togglePassword] = useState(false);
  const [image, setImage] = useState({profile_photo: '', image: ''});

  return (
    <React.Fragment>
     <View style={[commonStyle.container,{justifyContent:'center'}]}>
        <View style={commonStyle.overlay} />
        
        <View style={commonStyle.modalView}>
          <Image
            style={{height: 120, width: 150, alignSelf: 'center'}}
            source={require('../../images/iSecure.png')}
            resizeMode="contain"
          />
          <Text style={commonStyle.subHeaderText}>Forgot Password</Text>
          <FormInput
            labelName       = "Email Id"
            placeholder     = "Email Id"
            onChangeText    = {handleChange('email_id')}
            required        = {true}
            name            = "email_id"
            errors          = {errors}
            touched         = {touched}
            iconName        = {'email'}
            iconType        = {'material-community'}
            autoCapitalize  = "none"
            keyboardType    = "email-address"
          />
          <FormButton
            title       = {'Forgot Password'}
            onPress     = {handleSubmit}
            background  = {true}
            loading     = {btnLoading}
          />
          <View
            style={[
              {
                flexDirection   : 'row',
                alignItems      : 'center',
                justifyContent  : 'center',
                marginTop       : '3%',
                marginBottom    : 25,
              },
            ]}>
            <Text style={commonStyle.linkLightText}>
              Version 1.0.3
            </Text>
          </View>
        </View>
      </View>
    </React.Fragment>
  );
};