import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  ScrollView,
  Text,
  View,
  BackHandler,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  Image,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Button, Icon }       from "react-native-elements";
import CheckBox               from 'react-native-check-box'
import ValidationComponent    from "react-native-form-validator";
import axios                  from "axios";
import styles                 from './styles.js';
import { colors, sizes }      from '../../../config/styles.js';
import Modal                  from "../../Modal/OpenModal.js";
import { Fumi }               from 'react-native-textinput-effects';
import FontAwesomeIcon        from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect }            from 'react-redux';
import AsyncStorage           from '@react-native-community/async-storage';

const window = Dimensions.get('window');

class RootSignup extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputFocusColor: colors.textLight,
      isChecked: false,
      firstName: '',
      lastName: '',
      mobileNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstNameError: [],
      lastNameError: [],
      mobileNumberError: [],
      emailError: [],
      passwordError: [],
      confirmPasswordError: [],
      isCheckedError: [],
      passwordMatch: '',
      showPassword: false,
      showConfirmPassword: false,
      btnLoading: false,
      openModal: false,

    };
  }

  handleOnChange = () => {
    let isChecked = !this.state.isChecked;
    this.setState({ isChecked }, () => {
      if (isChecked) {
        this.setState({ isCheckedError: [] });
      } else {
        this.setState({
          isCheckedError: ["Please accept the terms & conditions."]
        });
      }
    });
  }

  validInput = () => {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      password,
      confirmPassword,
    } = this.state;
    let valid = true;
    this.validate({
      firstName: {
        required: true,
        letters: true,
      },
      lastName: {
        required: true,
        letters: true,
      },
      email: {
        required: true,
        email: true,
      },
      mobileNumber: {
        required: true,
        mobileNo: true,
        // numbers: true, 
        minlength: 9,
        maxlength: 10
      },
      password: {
        required: true,
        minlength: 5,
      },
      confirmPassword: {
        required: true
      }
    });

    if (this.isFieldInError("firstName")) {
      let firstNameError = this.getErrorsInField("firstName");
      this.setState({ firstNameError });
      valid = false;
    } else {
      this.setState({ firstNameError: "" });
      valid = true;
    }
    if (this.isFieldInError("lastName")) {
      this.setState({ lastNameError: this.getErrorsInField("lastName") });
      valid = false;
    } else {
      this.setState({ lastNameError: "" });
      valid = true;
    }
    if (this.isFieldInError("mobileNumber")) {
      this.setState({ mobileNumberError: this.getErrorsInField("mobileNumber") });
      valid = false;
    } else {
      this.setState({ mobileNumberError: "" });
      valid = true;
    }
    if (this.isFieldInError("email")) {
      this.setState({ emailError: this.getErrorsInField("email") });
      valid = false;
    } else {
      this.setState({ emailError: "" });
      valid = true;
    }
    if (this.isFieldInError("password")) {
      this.setState({ passwordError: this.getErrorsInField("password") });
      valid = false;
    } else {
      this.setState({ passwordError: "" });
      valid = true;
    }
    if (this.isFieldInError("confirmPassword")) {
      this.setState({
        confirmPasswordError: this.getErrorsInField("confirmPassword")
      });
      valid = false;
    } else {
      this.setState({ confirmPasswordError: "" });
      valid = true;
    }

    if (!this.state.isChecked) {
      this.setState({
        isCheckedError: ["Please accept the terms & conditions."]
      });
      valid = false;
    } else {
      this.setState({ isCheckedError: "" });
      valid = true;
    }

    if (this.state.passwordMatch != 'matched') {
      valid = false;
    }
    // console.log((!this.isFieldInError("password")), (!this.isFieldInError("confirmPassword")),(!this.isFieldInError("email")), (!this.isFieldInError("mobileNumber") ) , (!this.isFieldInError("firstName")) , (!this.isFieldInError("lastName")) , (this.state.isChecked) , (this.state.passwordMatch=='matched') );

    // return valid;
    return ((!this.isFieldInError("password")) && (!this.isFieldInError("confirmPassword")) && (!this.isFieldInError("email")) && (!this.isFieldInError("mobileNumber")) && (!this.isFieldInError("firstName")) && (!this.isFieldInError("lastName")) && (this.state.isChecked) && (this.state.passwordMatch == 'matched'));
    // return !this.isFieldInError("email");
  };

  validInputField = (stateName, stateErr) => {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      password,
      confirmPassword,
    } = this.state;
    let valid = true;

    this.validate({
      [stateName]: {
        required: true,
      },
    });

    if (this.isFieldInError(stateName)) {
      let validinptError = this.getErrorsInField(stateName);
      this.setState({ validinptError });
      valid = false;
    } else {
      this.setState({ [stateErr]: "" });
    }

    return valid;
  };

  handleSubmit = () => {
    // console.log("this.isFormValid()===>",this.validInput());
    if (this.validInput()) {

      // if(this.isFieldInError(this.state.email)|| this.isFieldInError(this.state.mobileNumber) || this.isFieldInError(this.state.firstName) || this.isFieldInError(this.state.lastName) ){ 
      let {
        firstName,
        lastName,
        mobileNumber,
        email,
        password
      } = this.state;
      var emailId = email.toLowerCase();
      // console.log(mobileNumber)
      var mobileNo = '+91' + mobileNumber.split(' ')[1].split('-').join('')
      // console.log(mobileNo)
      var roles = 'user';
      // let emailOTP    = Math.floor(100000 + Math.random() * 900000);
      let mobileOTP = Math.floor(1000 + Math.random() * 9000);
      // console.log("roles = ",roles);

      var formValues = {
        firstname:firstName,
        lastname:lastName,
        mobNumber: mobileNo,
        email:email,
        pwd: password,
        role:'user',
        status: 'unverified',
        "emailSubject" : "Email Verification",
        "emailContent"  : "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
      }

      console.log('formValues',formValues);

      this.setState({ btnLoading: true })
      if(this.state.isChecked){

        axios.post('/api/auth/post/signup/user/emailotp', formValues)
        .then((response) => {
          this.setState({ btnLoading: false});
          if(response.data.message == 'USER_CREATED'){            
            var messageHead = "Great, Information submitted successfully";
            var messagesSubHead = "and OTP is sent to your registered Email.";
            this.props.openModal(true,messageHead,messagesSubHead,"success");
            this.props.setUserID(response.data.ID);
            this.props.navigation('OTPVerification');
          }else{
            var messageHead = response.data.message;
            var messagesSubHead = "";
            this.props.openModal(true,messageHead,messagesSubHead,"warning");
          }
        })
        .catch((error) => {
          console.log(error);
        })

      }else {
          this.setState({
            isCheckedError: ["Please accept the terms & conditions."]
          });
        }
    }
  }

  checkboxClick = () => {
    let isChecked = !this.state.isChecked;

    this.setState({ isChecked }, () => {
      if (isChecked) {
        this.setState({
          isCheckedError: []
        });
      } else {
        this.setState({
          isCheckedError: ["Please accept the terms & conditions."]
        });
      }
    });
  }

  displayValidationError = (errorField) => {
    let error = null;
    if (this.state[errorField]) {
      error = <View style={styles.errorWrapper}>
        <Text style={styles.errorText}>{this.state[errorField][0]}</Text>
      </View>;
    }
    return error;
  }

  displayTermsError = (errorField) => {
    let error = null;
    if (this.state[errorField].length > 0) {
      error = <View style={{ marginTop: -8, marginBottom: 5 }}>
        <Text style={styles.errorText}>{this.state[errorField][0]}</Text>
      </View>;
    }
    return error;
  }

  passwordChange = (value, key) => {
    this.setState({
      [key]: value,
    }, () => {
      if (this.state.password && this.state.confirmPassword) {
        if (this.state.password === this.state.confirmPassword)
          this.setState({ passwordMatch: 'matched' });
        else
          this.setState({ passwordMatch: 'not matched' });
      }

    });
  }

  handleMobileChange(value) {
    // console.log("value = ",value);
    if (value.startsWith && value.startsWith('+')) {
      value = value.substr(3);
    }
    let x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    // let x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    console.log("x value = ", x);
    // let y = !x[2] ? x[1] : x[1]+'-'+x[2];
    let y = x.input ? (!x[2] && !x[3]) ? '+91 ' + x[1] : (!x[3] ? '+91 ' + x[1] + '-' + x[2] : '+91 ' + x[1] + '-' + x[2] + '-' + x[3]) : '';
    // let y = '+1 '+x[1]+'-'+x[2]+'-'+x[3];
    // console.log("y value = ",y)
    this.setState({
      mobileNumber: y,
    });
  }

  handleShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  }

  handleShowConfirmPassword = () => {
    this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
  }

  handleTerms = () => {
    this.props.navigation.navigate('TermsOfUse');
  }

  render() {
    const { navigate, dispatch } = this.props.navigation;
    const { navigation } = this.props;
    return (
        <React.Fragment>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
            <Text style={{ fontSize: 25, fontFamily: 'Montserrat-Regular',textAlign:'center',paddingVertical:10 }}>Sign Up</Text>
              <View style={[styles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label={'First Name'}
                  onChangeText={(firstName) => { this.setState({ firstName }, () => { this.validInputField('firstName', 'firstNameError'); }) }}
                  value={this.state.firstName}
                  keyboardType="default"
                  iconClass={FontAwesomeIcon}
                  iconName={'user-circle-o'}
                  iconColor={colors.inputText}
                  iconSize={20}
                  iconWidth={40}
                  inputPadding={16}
                  style={{borderWidth:1,borderColor:"#f1f1f1",flex:0}}
                />
                {this.displayValidationError('firstNameError')}
              </View>

              <View style={[styles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label={'Last Name'}
                  onChangeText={(lastName) => { this.setState({ lastName }, () => { this.validInputField('lastName', 'lastNameError'); }) }}
                  value={this.state.lastName}
                  keyboardType="default"
                  iconClass={FontAwesomeIcon}
                  iconName={'user-circle-o'}
                  iconColor={colors.inputText}
                  iconSize={20}
                  iconWidth={40}
                  inputPadding={16}
                  style={{borderWidth:1,borderColor:"#f1f1f1"}}
                  containerStyle={{height:20}}
                />
                {this.displayValidationError('lastNameError')}
              </View>

              <View style={[styles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label={'Phone Number'}
                  onChangeText={(mobileNumber) => { this.setState({ mobileNumber }, () => { this.validInputField('mobileNumber', 'mobileNumberError'); }), this.handleMobileChange(mobileNumber) }}
                  value={this.state.mobileNumber}
                  keyboardType="numeric"
                  iconClass={FontAwesomeIcon}
                  iconName={'phone-square'}
                  iconColor={colors.inputText}
                  iconSize={20}
                  iconWidth={40}
                  inputPadding={16}
                  style={{borderWidth:1,borderColor:"#f1f1f1"}}
                />
                {this.displayValidationError('mobileNumberError')}
              </View>

              <View style={[styles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label={'Email'}
                  onChangeText={(email) => { this.setState({ email }, () => { this.validInputField('email', 'emailError'); }) }}
                  value={this.state.email}
                  keyboardType="email-address"
                  autoCapitalize='none'
                  iconClass={MaterialCommunityIcons}
                  iconName={'email-variant'}
                  iconColor={colors.inputText}
                  iconSize={20}
                  iconWidth={40}
                  inputPadding={16}
                  style={{borderWidth:1,borderColor:"#f1f1f1"}}
                />
                {this.displayValidationError('emailError')}
              </View>

              <View style={[styles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label={'Password'}
                  onChangeText={(password) => { this.setState({ password }, () => { this.validInputField('password', 'passwordError'); }), this.passwordChange(password, "password") }}
                  value={this.state.password}
                  keyboardType="default"
                  secureTextEntry={this.state.showPassword ? false : true}
                  autoCapitalize='none'
                  iconClass={MaterialCommunityIcons}
                  iconName={'lock'}
                  iconColor={colors.inputText}
                  iconSize={22}
                  iconWidth={40}
                  inputPadding={16}
                  style={{borderWidth:1,borderColor:"#f1f1f1"}}
                />
                <View style={[styles.eyeWrapper, { position: 'absolute', left: '80%', top: 22 }]}>
                  <TouchableOpacity onPress={this.handleShowPassword}>
                    <Icon name={this.state.showPassword ? "eye-with-line" : "eye"} type="entypo" size={22} color="#aaa" style={{}} />
                  </TouchableOpacity>
                </View>
                {this.displayValidationError('passwordError')}
              </View>

              <View style={[styles.formInputView]}>
                <Fumi
                  label={'Confirm Password'}
                  onChangeText={(confirmPassword) => { this.setState({ confirmPassword }, () => { this.validInputField('confirmPassword', 'confirmPasswordError'); }), this.passwordChange(confirmPassword, "confirmPassword") }}
                  value={this.state.confirmPassword}
                  keyboardType="default"
                  secureTextEntry={this.state.showConfirmPassword ? false : true}
                  autoCapitalize='none'
                  iconClass={MaterialCommunityIcons}
                  iconName={'lock'}
                  iconColor={colors.inputText}
                  iconSize={22}
                  iconWidth={40}
                  inputPadding={16}
                  style={{borderWidth:1,borderColor:"#f1f1f1"}}
                />
                <View style={[styles.eyeWrapper, { position: 'absolute', left: '80%', top: 22 }]}>
                  <TouchableOpacity onPress={this.handleShowConfirmPassword}>
                    <Icon name={this.state.showConfirmPassword ? "eye-with-line" : "eye"} type="entypo" size={22} color="#aaa" style={{}} />
                  </TouchableOpacity>
                </View>
                {this.displayValidationError('confirmPasswordError')}
                {this.state.passwordMatch == ''
                  ?
                  null
                  :
                  this.state.passwordMatch == 'matched'
                    ?
                    <View style={{ width: '100%', marginTop: 5 }}>
                      <Text style={styles.successText}>Passwords matched</Text>
                    </View>
                    :
                    <View style={{ width: '100%', marginTop: 5 }}>
                      <Text style={styles.errorText}>Passwords not matching</Text>
                    </View>
                }
              </View>

              <View style={{ flexDirection: 'row', marginVertical: 15,justifyContent:"center" }}>
                <View style={[{ paddingLeft: 5, paddingRight: 15 }]}>
                  <CheckBox
                    style={{ flex: 1, padding: 0 }}
                    checkBoxColor={colors.textLight}
                    onClick={this.checkboxClick}
                    isChecked={this.state.isChecked}
                    // rightText       = {"I agree to the terms & conditions"}
                    rightTextStyle={{ fontFamily: "Montserrat-Regular" }}
                  />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                  <Text style={{ fontFamily: "Montserrat-Regular" }}>I agree to the </Text>
                  <TouchableOpacity>
                    <Text style={{ fontFamily: "Montserrat-Regular", textDecorationLine: 'underline' }}>
                      terms & conditions
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.formInputView,{marginTop:15}]}>
                {this.displayTermsError('isCheckedError')}
              </View>
              {
                this.state.btnLoading
                  ?
                  <Button
                    titleStyle={styles.buttonText}
                    title="Processing"
                    loading
                    buttonStyle={styles.button}
                    containerStyle={styles.buttonContainer}
                  />
                  :
                  <Button
                    onPress={this.handleSubmit.bind(this)}
                    // onPress={() => this.login.bind(this)}
                    titleStyle={styles.buttonText}
                    title="Sign In"
                    buttonStyle={styles.button}
                    containerStyle={styles.buttonContainer}
                  />
              }
              <View style={[{ alignItems: 'center', justifyContent: 'center', marginTop: '5%' }]}>
                <Text style={[styles.linkLightText]}>Already have an account?  </Text>
                <TouchableOpacity onPress={() => this.props.navigation("Login")}>
                  <Text style={{ fontFamily: "Montserrat-Bold", color: '#666666', marginTop: '2%' }}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
          </KeyboardAwareScrollView>
          {this.props.openModal ?
            <Modal navigation={navigation}/>
            :
            null
          }
        </React.Fragment>
    );

  }
}

RootSignup.defaultProps = {
  messages: {
    en: {
      numbers: 'This field must be a number.',
      email: 'Enter a valid email address',
      required: 'This field is required.',
      letters: 'It should only contain letters.',
      mobileNo: 'Enter a valid mobile number.',
      lettersOrEmpty: 'It should only contain letters.',
      minlength: 'Length should be greater than 5',
    }
  },

  rules: {
    numbers: /^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/,
    email: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$|^$/,
    required: /\S+/,
    letters: /^[a-zA-Z ]+$/,
    lettersOrEmpty: /^[a-zA-Z ]+$|^$/,
    // mobileNo: /^\d{5}([- ]*)\d{6}$|^(\+91?)?[0]?(91)?[789]\d{9}$|^$/,
    mobileNo: /^(\+91\s)?[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/,
    minlength(length, value) {
      if (length === void (0)) {
        throw 'ERROR: It is not a valid length, checkout your minlength settings.';
      } else if (value.length > length) {
        return true;
      }
      return false;
    },
  },
}

const mapStateToProps = (state)=>{
  // console.log("bState===",state);
  return {
    openModal             : state.openModal,
  }
  
};

const mapDispatchToProps = (dispatch)=>{
  return {
    openModal  : (openModal,messageHead,messagesSubHead,messageType)=> dispatch({type: "MODAL",
                            openModal:openModal,
                            messageHead:messageHead,
                            messagesSubHead:messagesSubHead,
                            messageType:messageType,
                  }),
    setUserID  : (user_id)=> dispatch({type: "SET_USER_ID",
                            user_id:user_id,
                  }),
  }
};
export default connect(mapStateToProps,mapDispatchToProps)(RootSignup);