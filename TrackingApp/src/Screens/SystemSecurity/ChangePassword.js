import React, {useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  Platform,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';

import axios                          from 'axios';
import Dialog                         from 'react-native-dialog';
import {Button, Icon, Input}          from 'react-native-elements';
import ValidationComponent            from 'react-native-form-validator';
import ImagePicker                    from 'react-native-image-crop-picker';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {withNavigation}               from 'react-navigation';
import {connect, useDispatch}         from 'react-redux';
import commonStyle                    from '../../config/commonStyle.js';
import {Formik, ErrorMessage}         from 'formik';
import {
  specialCharacterValidator,
  passwordValidator,
  emailValidator,
  mobileValidator,
} from '../../config/validators.js';
import * as Yup                       from 'yup';
import {FormInput}                    from '../../components/FormInput/FormInput.js';
import {SET_BASIC_DETAILS}            from '../../redux/user/types.js';
import {useNavigation}                from '../../config/useNavigation.js';
import {setToken, setUserDetails}     from '../../redux/user/actions';
import AsyncStorage                   from '@react-native-community/async-storage';
import { colors, sizes }              from '../../config/styles.js';
import MaterialCommunityIcon          from 'react-native-vector-icons/MaterialCommunityIcons';
import {FormButton}                   from '../../components/FormButton/FormButton.js';
import {withCustomerToaster} from '../../redux/AppState.js';

        
const window = Dimensions.get('window');
const ChanegPasswordSchema = Yup.object().shape({

  confirm_password: Yup.string().required('This field is required'),
  password: Yup.string().required('This field is required'),
});

const ChangePassword = withCustomerToaster((props) => {
  const [btnLoading, setLoading] = useState(false);
  const {setToast} = props; //setToast function bhetta
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user_id = navigation.getParam('user_id');
  
  return (
    <React.Fragment>
      <Formik
        onSubmit={data => {
          setLoading(true);
          if(data.password == data.confirm_password){
            setLoading(true)
            var formValues = {
              pwd: data.password,
            };
            axios.patch('/api/auth/patch/change_password_withoutotp/id/'+user_id,formValues)
            .then((response)=>{  
              if(response.data === "PASSWORD_RESET"){
                setToast({
                  text: "Password Changed",
                  color: 'green',
                });
                setLoading(false);
                navigation.navigate('Login');
              }else{
                setToast({
                  text: "Password not changed",
                  color: colors.warning,
                });
                setLoading(false);
              }       
            })
            .catch((error)=>{
              setToast({text: "Something Went Wrong", color: 'red'});
              setLoading(false);
            })
          }else{
            setToast({
              text: "Password not matched",
              color: colors.warning,
            });
            setLoading(false);
          }
        }}
        validationSchema={ChanegPasswordSchema}
        initialValues={{
          password: '',
          confirm_password:'',
          token:'',
          user_id:''
        }}>
        {formProps => <FormBody btnLoading={btnLoading} {...formProps} />}
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
  } = props;
  const [openModal, setModal] = useState(false);
  const [showPassword, togglePassword] = useState(false);
  const [showConfPassword, toggleConfPassword] = useState(false);
  const [image, setImage] = useState({profile_photo: '', image: ''});

  return (
     <ImageBackground  style={[commonStyle.container,{justifyContent:'center'}]} source={require('../../images/Background.png')}>
        <View style={commonStyle.overlay} />
        <View style={commonStyle.modalView}>
          <Text style={commonStyle.subHeaderText}>Change Password</Text>
          <FormInput
            labelName     = "Password"
            placeholder   = "Password"
            onChangeText  = {handleChange('password')}
            errors        = {errors}
            name          = "password"
            required      = {true}
            touched       = {touched}
            iconName      = {'lock'}
            iconType      = {'font-awesome'}
            rightIcon={
                <TouchableOpacity  style={{paddingHorizontal:'5%'}} onPress={() => togglePassword(!showPassword)}>
                  {showPassword ? (
                    <Icon name="eye" type="entypo" size={18} />
                  ) : (
                    <Icon name="eye-with-line" type="entypo" size={18} />
                  )}
                </TouchableOpacity>
              }
            secureTextEntry={!showPassword}
          />
          <FormInput
            labelName     = "Confirm Password"
            placeholder   = "Confirm Password"
            onChangeText  = {handleChange('confirm_password')}
            errors        = {errors}
            name          = "confirm_password"
            required      = {true}
            touched       = {touched}
            iconName      = {'lock'}
            iconType      = {'font-awesome'}
            rightIcon={
                <TouchableOpacity  style={{paddingHorizontal:'5%'}} onPress={() => toggleConfPassword(!showConfPassword)}>
                  {showConfPassword ? (
                    <Icon name="eye" type="entypo" size={18} />
                  ) : (
                    <Icon name="eye-with-line" type="entypo" size={18} />
                  )}
                </TouchableOpacity>
              }
              secureTextEntry={!showConfPassword}
          />
          <FormButton
            title       = {"Change"}
            onPress     = {handleSubmit}
            background  = {true}
            loading     = {btnLoading}
          />
      </View>  
   </ImageBackground> 
  );
};
const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#fff',
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    marginLeft: 25,
    borderWidth: 1,
    borderColor: '#f1f1f1',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
});
const mapStateToProps = (state)=>{
  return {
    userDetails : state.userDetails,
  }
  
};
export default connect(mapStateToProps,{})(ChangePassword);