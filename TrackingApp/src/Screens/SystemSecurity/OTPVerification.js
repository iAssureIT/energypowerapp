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
import OTPInputView                     from '@twotalltotems/react-native-otp-input';
import styles               from './styles.js';
const window = Dimensions.get('window');
const LoginSchema = Yup.object().shape({
  
});

//wrap component with withCustomerToaster hoc
export const OTPVerification = withCustomerToaster((props) => {
  const [btnLoading, setLoading] = useState(false);
  const {setToast} = props; //setToast function bhetta
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user_id = navigation.getParam('user_id');
  console.log("user_id",user_id);
  return (
    <React.Fragment>
      <Formik
        onSubmit={(data) => {
            setLoading(true);
            let { otp } = data;
            console.log("otp",otp);
            axios.get('/api/auth/get/checkemailotp/usingID/'+user_id+"/"+otp)
            .then(response => {
                console.log("response",response);
                setLoading(false);
                if (response.data.message == 'SUCCESS') {
                   navigation.navigate('ChangePassword',{user_id:user_id});
                }else{
                    setToast({text: 'Please enter correct OTP.', color: colors.warning});
                }
            })
            .catch(error => {
                console.log("errr",error);
                setToast({text: 'Something went wrong.', color: 'red'});
                setLoading(false);
                if (error.response.status == 401) {
                }
            })
        }}
        validationSchema={LoginSchema}
        initialValues={{
          otp: '',
        }}>
        {(formProps) => (
          <FormBody
            btnLoading={btnLoading}
            navigation={navigation}
            user_id={user_id}
            setToast={setToast}
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
    values,
    user_id,
    setToast
  } = props;
  console.log("props",props);
  const [openModal, setModal] = useState(false);
  const [showPassword, togglePassword] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [image, setImage] = useState({profile_photo: '', image: ''});
  const handleResend = () => {
    setResendLoading(true);
    setFieldValue('otp','')
    var formValues = {
      username : "email",
      "emailSubject"	: "Email Verification", 
      "emailContent"  : "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
    }
    axios.patch('/api/auth/patch/setsendemailotpusingID/'+user_id,formValues)
    .then(response => {
        console.log("response",response)
        setResendLoading(false)
        if(response.data.message == 'OTP_UPDATED') {
          navigation.navigate('OTPVerification');
          setToast({text: 'OTP Resent successfully!', color: 'green'});
        }else if(response.data.message == 'NOT_REGISTER'){
            setToast({text: "This Email Id is not registered.", color: colors.warning});
        }else if(response.data.message == 'OTP_NOT_UPDATED'){
            setToast({text: 'Something went wrong.', color: 'red'});
        }
    })
    .catch(error => {
    console.log(error);
      if (error.response.status == 401) {
        setResendLoading(false)
      }
    })

}
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
          <Text style={[commonStyle.subHeaderText,{paddingVertical:15}]}>OTP Verification</Text>
          <Text style={[commonStyle.label,{alignSelf:"center"}]}>Please Enter Verification Code</Text>
         <OTPInputView
            style={{width: '60%', height: 100,alignSelf:"center"}}
            pinCount={4}
            placeholderTextColor={'#333'}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled = {handleChange('otp')}
            onCodeChanged = {handleChange('otp')}
            />
            <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                <FormButton
                    title       = {'Verify'}
                    onPress     = {handleSubmit}
                    background  = {btnLoading}
                    loading     = {btnLoading}
                />
                <FormButton
                    title       = {'Resend OTP'}
                    onPress     = {handleResend}
                    background  = {resendLoading}
                    loading     = {resendLoading}
                />
            </View>    
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