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
  password: Yup.string().required('This field is required'),
});

//wrap component with withCustomerToaster hoc
export const Login = withCustomerToaster((props) => {
  const [btnLoading, setLoading] = useState(false);
  const {setToast} = props; //setToast function bhetta
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (
    <React.Fragment>
      <Formik
        onSubmit={(data) => {
          setLoading(true);
          let {email_id, password} = data;
          const payload = {
            email     : email_id,
            password  : password,
            role:['technician','client'],
          };
          axios
            .post('/api/auth/post/login', payload)
            .then((res) => {
              setLoading(false);
              if(res.data.message === "Login Auth Successful"){
                if(res.data.passwordreset === false  ){
                  navigation.navigate('ChangePassword',{user_id:res.data.ID})
                }else{  
                  axios.get('/api/personmaster/get/details/'+res.data.ID)
                  .then(personInfo => {
                    dispatch(
                      setUserDetails({
                        user_id     : res.data.ID,
                        token       : res.data.token,
                        firstName   : res.data.userDetails.firstName,
                        lastName    : res.data.userDetails.lastName,
                        email       : res.data.userDetails.email,
                        mobile      : res.data.userDetails.mobile,
                        fullName    : res.data.userDetails.fullName,
                        company_id  : res.data.userDetails.company_id,
                        companyID   : res.data.userDetails.companyID,
                        companyName : res.data.userDetails.companyName,
                        status      : res.data.userDetails.status,
                        person_id   : personInfo.data[0]._id,
                        role        : res.data.roles
                      }),
                    );
                    dispatch({
                      type: SET_PERSON_DETAILS,
                      payload: personInfo.data[0]
                    });
                    dispatch(getS3Details())
                    AsyncStorage.multiSet([
                      ['user_id', res.data.ID],
                      ['role', JSON.stringify(res.data.roles)],
                      ['token', res.data.token],
                      ['person_id', personInfo.data[0]._id],
                      ['client_id', res.data.userDetails.company_id],
                    ])
                    if(res.data.roles.includes('technician')){
                     axios
                      .get('/api/attendance/get/get_tracking_status/'+res.data.ID)
                      .then((attendance)=>{
                        if(attendance.data && attendance.data.startDateAndTime){
                          dispatch(getDasboardCount(personInfo.data[0]._id));
                          navigation.navigate('TechnicianApp');
                        }else{
                          dispatch(getDasboardCount(personInfo.data[0]._id));
                          navigation.navigate('Attendance',{'backButton':false});
                        }
                      })
                      .catch(error=>{
                        console.log("error=>",error)
                      })
                      
                    }else if(res.data.roles.includes('client')){
                       dispatch(getClientDetails(res.data.userDetails.company_id));
                       dispatch(getClientDasboardCount(res.data.userDetails.company_id));
                      navigation.navigate('ClientApp');
                    }
                  })
                  .catch((error) => {
                    console.log("error",error);
                    setLoading(false);
                    setToast({text: 'Something went wrong.', color: 'red'});
                  });
                }
              }else if(res.data.message === 'INVALID_PASSWORD'){
                setToast({text: "Please enter correct password", color: colors.warning});
                setLoading(false);
              }else if(res.data.message === 'NOT_REGISTER'){
                setToast({text: "This Email Id is not registered.", color: colors.warning});
                setLoading(false);
              }else if(res.data.message === 'USER_BLOCK'){
                setToast({text: "Please contact to admin", color: colors.warning});
                setLoading(false);
              }
            })
            .catch((error) => {
              console.log("error",error);
              setLoading(false);
              setToast({text: 'Something went wrong.', color: 'red'});
            });
        }}
        validationSchema={LoginSchema}
        initialValues={{
          email_id: '',
          password: '',
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
          <Text style={commonStyle.subHeaderText}>Login</Text>
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
          <FormInput
            labelName     = "Password"
            placeholder   = "Password"
            onChangeText  = {handleChange('password')}
            errors        = {errors}
            name          = "password"
            required      = {true}
            touched       = {touched}
            iconName      = {'lock'}
            iconType      = {'material-community'}
            rightIcon ={
              <TouchableOpacity
                style={{paddingHorizontal: '5%'}}
                onPress={() => togglePassword(!showPassword)}>
                {showPassword ? (
                  <Icon name="eye-with-line" type="entypo" size={18} />
                ) : (
                  <Icon name="eye" type="entypo" size={18} />
                )}
              </TouchableOpacity>
            }
            secureTextEntry={!showPassword}
          />
          <FormButton
            title       = {'Login'}
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
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={commonStyle.linkText}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
        {/*  <View
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
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('RegisterStack')}>
              <Text style={commonStyle.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>*/}
          
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
              Version 1.0.5
            </Text>
          </View>
        </View>
      </View>
    </React.Fragment>
  );
};