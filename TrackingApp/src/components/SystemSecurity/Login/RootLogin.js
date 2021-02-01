import React from 'react';
import {
  ScrollView,
  Text,
  View,
  BackHandler,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image, TextInput,
  Platform,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Modal from "react-native-modal";
import ValidationComponent from "react-native-form-validator";
import { Button, Icon } from "react-native-elements";
import { TextField } from "react-native-material-textfield";
import { ifIphoneX } from 'react-native-iphone-x-helper';
import axios from "axios";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles.js';
import { colors, sizes } from '../../../config/styles.js';
import { Fumi } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const window = Dimensions.get('window');

export default class RootLogIn extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputFocusColor: colors.textLight,
      email: '',
      password: '',
      emailError: [],
      showPassword: false,
      btnLoading: false,
      incorrectPwModal: false,
      test: ''
    };
  }

  validInput = () => {
    const {
      email,
      password,
    } = this.state;
    let valid = true;

    this.validate({

      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        minlength: 5
      },

    });

    if (this.isFieldInError("email")) {
      this.setState({ emailError: this.getErrorsInField("email") });
      valid = false;
    } else {
      this.setState({ emailError: "" });
    }
    if (this.isFieldInError("password")) {
      this.setState({ passwordError: this.getErrorsInField("password") });
      valid = false;
    } else {
      this.setState({ passwordError: "" });
    }

    return valid;
  };

  login = () => {
    let { email, password } = this.state;
    email = email.toLowerCase();
    // console.log('email',email,password)
    var loginValues = { email: email, password: password, role:'user' }
    // console.log('this.validInput',this.validInput())

    if (this.validInput()) {
      console.log("Inside")
      this.setState({ btnLoading: true })
      axios.post('/api/auth/post/login', loginValues)
        .then(response => {
          console.log('response Login',response.data)
          if (response.data.message == 'INVALID_PASSWORD') {
            Alert.alert("", "User Not found")
            this.setState({ btnLoading: false })
          } else {
            this.setState({ btnLoading: false })
            AsyncStorage.multiSet([
              ['user_id', response.data.ID],
              ['token', response.data.token],
            ])
            this.props.navigation('Home')
          }
        })
        .catch(error => {

          if (error.response.status == 401) {
            this.setState({ incorrectPwModal: true, btnLoading: false })
          }

        })
    } else {
      console.log('error')
      this.setState({ btnLoading: false })
    }
  }


  validInputField = (stateName, stateErr) => {
    const {
      email,
      password,
    } = this.state;
    let valid = true;

    this.validate({
      [stateName]: {
        required: true,
      }
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


  displayValidationError = (errorField) => {
    let error = null;
    if (this.state[errorField]) {
      error = <View style={styles.errorWrapper}>
        <Text style={styles.errorText}>{this.state[errorField][0]}</Text>
      </View>;
    }
    return error;
  }

  handleShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  }

  render() {

    const messages = {
      en: {
        email: "Please enter a valid Email / Mobile number.",
        numbers: 'Please enter a valid Email / Mobile number.',
        required: '\nThis Field is mandatory.',
        minlength: '\nPassword length must be greater than {1}.',
        maxlength: '\nPassword length must be lower than {1}.'
      }
    };

    const { navigate } = this.props.navigation;
    return (

          <View style={{}}>
            <View style={styles.textTitleWrapper}><Text style={{ fontSize: 25, fontFamily: 'Montserrat-Regular',textAlign:'center' }}>Sign In</Text></View>
              <View style={styles.formWrapper}>
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
                    onChangeText={(password) => { this.setState({ password }, () => { this.validInputField('password', 'passwordError'); }) }}
                    value={this.state.password}
                    keyboardType="default"
                    autoCapitalize='none'
                    secureTextEntry={this.state.showPassword ? false : true}
                    iconClass={MaterialCommunityIcons}
                    iconName={'lock-open-outline'}
                    iconColor={colors.inputText}
                    iconSize={22}
                    iconWidth={40}
                    inputPadding={16}
                    style={{borderWidth:1,borderColor:"#f1f1f1"}}
                  />
                  <View style={[styles.eyeWrapper, {position:'absolute',left:'80%',top:22}]}>
                    <TouchableOpacity onPress={this.handleShowPassword}>
                      <Icon name={this.state.showPassword ? "eye-with-line" : "eye"} type="entypo" size={22} color="#aaa" style={{}} />
                    </TouchableOpacity>
                  </View>
                {this.displayValidationError('passwordError')}
                </View>

                <View style={[styles.formInputView, { backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }]}>
                  <TouchableOpacity onPress={() => this.props.navigation("ForgotPassword")}>
                    <Text style={[styles.linkText, { color: colors.textLight }]}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>

                {this.state.btnLoading
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
                    onPress={this.login.bind(this)}
                    // onPress={() => this.login.bind(this)}
                    titleStyle={styles.buttonText}
                    title="Sign In"
                    buttonStyle={styles.button}
                    containerStyle={styles.buttonContainer}
                  />
                }

                <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '3%',marginBottom:25 }]}>

                  <Text style={[styles.linkLightText]}>Don't have an account?  </Text>
                  <TouchableOpacity onPress={() => this.props.navigation("Signup")}>
                    <Text style={[styles.linkText, {}]}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
                <Modal isVisible={this.state.incorrectPwModal}
                  onBackdropPress={() => this.setState({ incorrectPwModal: false })}
                  coverScreen={true}
                  hideModalContentWhileAnimating={true}
                  style={{ paddingHorizontal: '5%', zIndex: 999 }}
                  animationOutTiming={500}>
                  <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10 }}>
                    <View style={{ justifyContent: 'center', backgroundColor: "#dc3545", width: 50, height: 50, borderRadius: 25, overflow: 'hidden' }}>
                      <Icon size={30} name='x' type='feather' color='#fff' style={{}} />
                    </View>
                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 15, textAlign: 'center', marginTop: 20 }}>
                      Oops!
                    </Text>
                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 15, textAlign: 'center' }}>
                      You've entered wrong Email or Password
                    </Text>
                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginVertical: 15 }}>
                      Please check and try again
                    </Text>

                    <View style={{ borderBottomRightRadius: 500, marginTop: 15, flexDirection: 'row' }}>
                      <Button
                        onPress={() => this.setState({ incorrectPwModal: true })}
                        titleStyle={styles.buttonText}
                        title="OK"
                        buttonStyle={{ width: '100%', height: 45, alignItems: 'center', justifyContent: 'center', borderRadius: 50 }}
                        containerStyle={styles.buttonContainer}
                      />
                    </View>
                  </View>
                </Modal>
              </View>
          </View>
    );

  }
}

RootLogIn.defaultProps = {
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
    mobileNo: /^\d{5}([- ]*)\d{6}$|^(\+91?)?[0]?(91)?[789]\d{9}$|^$/,
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