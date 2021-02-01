import React, {Component} from 'react';
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
import { Button, Icon }             from "react-native-elements";
import CheckBox                     from 'react-native-check-box'
import { KeyboardAwareScrollView }  from 'react-native-keyboard-aware-scroll-view';
import axios                        from "axios";
import styles                       from './styles.js';
import { colors, sizes }            from '../../../config/styles.js';
import HeaderBar                    from '../../../layouts/Header/Header.js';
import { Fumi }                     from 'react-native-textinput-effects';
import FontAwesomeIcon              from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons       from 'react-native-vector-icons/MaterialCommunityIcons';
import UploadPic                    from '../UploadPic/UploadPic.js';
import Dialog                       from "react-native-dialog";
import AsyncStorage                 from '@react-native-community/async-storage';
import ValidationComponent          from "react-native-form-validator";
import Loading                      from '../../../layouts/Loading/Loading.js';

const window = Dimensions.get('window');

export default class EmployeeProfileEdit extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputFocusColor: colors.textLight,
      firstName      : "",
      lastName       : "",
      mobileNumber   : "",
      email          : "",
    };
  }

  componentDidMount(){
  AsyncStorage.getItem('user_id')
    .then((userId)=>{
      axios.get('/api/users/get/'+userId)
      .then((user)=>{
        console.log('user',user);
        this.setState({
          firstName      : user.data.firstname,
          lastName       : user.data.lastname,
          mobileNumber   : user.data.mobile,
          email          : user.data.email,
          user_id        : userId,  
        })
      })
      .catch((error)=>{
        console.log("error=>",error)
      })
    })
  }

  validInput = () => {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
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
    return ((!this.isFieldInError("email")) && (!this.isFieldInError("mobileNumber")) && (!this.isFieldInError("firstName")) && (!this.isFieldInError("lastName")) && (this.state.isChecked) && (this.state.passwordMatch == 'matched'));
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

    displayValidationError = (errorField) => {
    let error = null;
    if (this.state[errorField]) {
      error = <View style={styles.errorWrapper}>
        <Text style={styles.errorText}>{this.state[errorField][0]}</Text>
      </View>;
    }
    return error;
  }


  handleCancel = () => {
    this.setState({
     openModal      : false,
   });
  };

  openModal(){
    console.log("Inside")
    this.setState({
     openModal      : true,
   });
  };

  handleMobileChange(value) {
    if (value.startsWith && value.startsWith('+')) {
      value = value.substr(3);
    }
    let x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    console.log("x value = ", x);
    let y = x.input ? (!x[2] && !x[3]) ? '+91 ' + x[1] : (!x[3] ? '+91 ' + x[1] + '-' + x[2] : '+91 ' + x[1] + '-' + x[2] + '-' + x[3]) : '';
    this.setState({
      mobileNumber: y,
    });
  }

  handleSubmitProfileEdit(){
    var formValues = {
      firstname      : this.state.firstName,
      lastname       : this.state.lastName,
      mobNumber      : this.state.mobileNumber,
      email          : this.state.email,
    }
    console.log("formValues",formValues);
     axios.patch('/api/users/patch/'+this.state.user_id,formValues)
      .then((user)=>{
        Alert.alert("Profile updated successfully")

      })
      .catch((error)=>{
        console.log("error=>",error)
      })
  }

  render() {
    const { navigate } = this.props.navigation;
    const { navigation } = this.props;
    const { firstName, lastName, mobileNumber, email } = this.state;

    return (
      <React.Fragment>
        <HeaderBar navigation={navigation} showBackBtn={true} headerName={"My Profile"}/>
        <ImageBackground source={{}}  style={styles.container} resizeMode="cover" >
        {firstName, lastName, mobileNumber, email ?
          <View style={{paddingHorizontal:20,justifyContent:"center"}}>
            <View style={{paddingVertical:10,backgroundColor:'#fff', borderBottomWidth: 0,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 1,borderRadius:10}}>
               <View style={{alignItems:'center',justifyContent:"center"}}>
                <UploadPic />
              </View>
              <View style={[styles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label         = {'First Name'}
                  onChangeText  = {(firstName) => { this.setState({ firstName }, () => { this.validInputField('firstName', 'firstNameError'); }) }}
                  value         = {this.state.firstName}
                  keyboardType  = "default"
                  iconClass     = {FontAwesomeIcon}
                  iconName      = {'user-circle-o'}
                  iconColor     = {colors.inputText}
                  iconSize      = {20}
                  iconWidth     = {40}
                  inputPadding  = {16}
                  style         = {{borderWidth:1,borderColor:"#f1f1f1",flex:0}}
                />
                {this.displayValidationError('firstNameError')}
              </View>

              <View style={[styles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label         = {'Last Name'}
                  onChangeText  = {(lastName) => { this.setState({ lastName }, () => { this.validInputField('lastName', 'lastNameError'); }) }}
                  value         = {this.state.lastName}
                  keyboardType  = "default"
                  iconClass     = {FontAwesomeIcon}
                  iconName      = {'user-circle-o'}
                  iconColor     = {colors.inputText}
                  iconSize      = {20}
                  iconWidth     = {40}
                  inputPadding  = {16}
                  style         = {{borderWidth:1,borderColor:"#f1f1f1"}}
                />
                {this.displayValidationError('lastNameError')}
              </View>

              <View style={[styles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label         = {'Phone Number'}
                  onChangeText  = {(mobileNumber) => { this.setState({ mobileNumber }, () => { this.validInputField('mobileNumber', 'mobileNumberError'); }), this.handleMobileChange(mobileNumber) }}
                  value         = {this.state.mobileNumber}
                  keyboardType  = "numeric"
                  iconClass     = {FontAwesomeIcon}
                  iconName      = {'phone-square'}
                  iconColor     = {colors.inputText}
                  iconSize      = {20}
                  iconWidth     = {40}
                  inputPadding  = {16}
                  style         = {{borderWidth:1,borderColor:"#f1f1f1"}}
                />
                {this.displayValidationError('mobileNumberError')}
              </View>

              <View style={[styles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label           ={'Email'}
                  onChangeText    ={(email) => { this.setState({ email }, () => { this.validInputField('email', 'emailError'); }) }}
                  value           ={this.state.email}
                  keyboardType    ="email-address"
                  autoCapitalize  ='none'
                  iconClass       ={MaterialCommunityIcons}
                  iconName        ={'email-variant'}
                  iconColor       ={colors.inputText}
                  iconSize        ={20}
                  iconWidth       ={40}
                  inputPadding    ={16}
                  style           ={{borderWidth:1,borderColor:"#f1f1f1"}}
                  editable        ={false}
                />
                {this.displayValidationError('emailError')}
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
                    // onPress={this.handleSubmit.bind(this)}
                    onPress={this.handleSubmitProfileEdit.bind(this)}
                    titleStyle={styles.buttonText}
                    title="Save"
                    buttonStyle={styles.button}
                    containerStyle={styles.buttonContainer}
                  />
              }
            </View>
          </View>
          :
          <Loading />
        }   
        </ImageBackground>
      </React.Fragment>
    );

  }
}

EmployeeProfileEdit.defaultProps = {
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
