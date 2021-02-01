import React, {Component} from 'react';
import {
  ScrollView,
  Text,
  View,
  BackHandler,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,TextInput,
  Alert
} from 'react-native';
import { Button, Icon }       from "react-native-elements";
import { TextField }          from "react-native-material-textfield";
import ValidationComponent    from "react-native-form-validator";
import axios                  from "axios";
import styles                 from './styles.js';
import {colors,sizes}         from '../../../config/styles.js';
import Modal                  from "../../Modal/OpenModal.js";
import { Fumi }               from 'react-native-textinput-effects';
import FontAwesomeIcon        from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect }            from 'react-redux';


const window = Dimensions.get('window');

class RootResetPassword extends ValidationComponent{
  constructor(props){
    super(props);
    this.state={
      inputFocusColor : colors.textLight,
      password : '',
      confirmPassword : '',
      passwordMatch         : '',
      showPassword          : false,
      showConfirmPassword   : false,
    };
  }
  validInput = () => {
    const {
      password,
      confirmPassword,
    } = this.state;
    let valid = true;

    this.validate({
      password: { 
        required: true, 
        minlength: 5 
      },
      confirmPassword: { 
        required: true 
      }
    });

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

    if(this.state.passwordMatch!='matched'){
      valid = false;
    }
// console.log((!this.isFieldInError("password")), (!this.isFieldInError("confirmPassword")),(!this.isFieldInError("email")), (!this.isFieldInError("mobileNumber") ) , (!this.isFieldInError("firstName")) , (!this.isFieldInError("lastName")) , (this.state.isChecked) , (this.state.passwordMatch=='matched') );

// return valid;
return ((!this.isFieldInError("password"))&& (!this.isFieldInError("confirmPassword")))
// return !this.isFieldInError("email");
};


validInputField = (stateName,stateErr) => {
  const {
    password,
    confirmPassword,
  } = this.state;
  let valid = true;

  this.validate({
    password: { 
      required: true,
      minlength: 5 
    },
    confirmPassword: { 
      required: true, 
    },
  });

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

componentDidMount() {

}

handleReset = ()=>{
  const { password, confirmPassword} = this.state;
  if(this.validInputField()){
    if(password == confirmPassword){
      var formValues = {
        pwd: password,
      };
      axios.patch('/api/auth//patch/change_password_withoutotp/id/'+this.props.user_id,formValues)
      .then((response)=>{  
        console.log("response",response);
        if(response.data === "PASSWORD_RESET"){
          var messageHead = "Password changed!";
          var messagesSubHead = "";
          this.props.openModal(true,messageHead, messagesSubHead,"success");
          this.props.navigation('Login');
        }else{
          var messageHead = "Passwords not matching!";
          var messagesSubHead = "";
          this.props.openModal(true,messageHead, messagesSubHead,"warning");
        }       
      })
      .catch((error)=>{
        console.log('error',error)
        if(error.message === "Request failed with status code 401")
        {

        }
      })
    }else{
      this.setState({invalid:true})
    }
  }
}

displayValidationError = (errorField) =>{
  let error = null;
  if(this.state[errorField]){
    error = <View style={styles.errorWrapper}>
    <Text style={styles.errorText}>{this.state[errorField][0]}</Text>
    </View> ;
  }
  return error;
}

passwordChange = (value,key)=>{
  this.setState({
    [key] : value,
  },()=>{
    if(this.state.password && this.state.confirmPassword){
      if(this.state.password === this.state.confirmPassword)
        this.setState({passwordMatch: 'matched'});
      else
        this.setState({passwordMatch: 'not matched'});
    }

  });
}

handleShowPassword = ()=>{
  this.setState({showPassword:!this.state.showPassword});
}

handleShowConfirmPassword = ()=>{
  this.setState({showConfirmPassword:!this.state.showConfirmPassword});
}

render(){

  const { navigate,dispatch } = this.props.navigation;
  const { navigation } = this.props;
  return (
    <View>
      <View style={styles.textTitleWrapper}><Text style={styles.loginTitleTxt}>Reset Password</Text></View>
      <View style={styles.textTitleWrapper}><Text style={{fontSize:17,fontFamily:'Montserrat-Regular'}}>Please enter your new password</Text></View>
      <View style={styles.formWrapper}>
        <View style={[styles.formInputView,styles.marginBottom20]}>
          <Fumi
            label           = {'New Password'}
            onChangeText    = {(password) => {this.setState({ password },()=>{this.validInputField('password', 'passwordError');}),this.passwordChange(password,"password")}}
            value           = {this.state.password}
            keyboardType    = "default"
            autoCapitalize  = 'none'
            secureTextEntry = {this.state.showPassword ? false : true}
            iconClass       = {MaterialCommunityIcons}
            iconName        = {'lock-open-outline'}
            iconColor       = {colors.inputText}
            iconSize        = {22}
            iconWidth       = {40}
            inputPadding    = {16}
            style={{borderWidth:1,borderColor:"#f1f1f1"}}
          />
        <View style={[styles.eyeWrapper,{position:'absolute',left:'80%',top:22}]}>
          <TouchableOpacity onPress={this.handleShowPassword}>
            <Icon name={this.state.showPassword?"eye-with-line":"eye"} type="entypo" size={22}  color="#aaa" style={{}}/>
          </TouchableOpacity>
        </View>

        {this.displayValidationError('passwordError')}
        </View>

        <View style={[styles.formInputView,styles.marginBottom20]}>
          <Fumi
            label           = {'Confirm Password'}
            onChangeText    = {(confirmPassword) => {this.setState({ confirmPassword },()=>{this.validInputField('confirmPassword', 'confirmPasswordError');}),this.passwordChange(confirmPassword,"confirmPassword")}}
            value           = {this.state.confirmPassword}
            keyboardType    = "default"
            autoCapitalize  = "none"
            secureTextEntry = {this.state.showConfirmPassword?false:true}
            iconClass       = {MaterialCommunityIcons}
            iconName        = {'lock-open-outline'}
            iconColor       = {colors.inputText}
            iconSize        = {22}
            iconWidth       = {40}
            inputPadding    = {16}
            style={{borderWidth:1,borderColor:"#f1f1f1"}}
          />
        <View style={[styles.eyeWrapper,{position:'absolute',left:'80%',top:22}]}>
          <TouchableOpacity onPress={this.handleShowConfirmPassword}>
            <Icon name={this.state.showConfirmPassword?"eye-with-line":"eye"} type="entypo" size={22}  color="#aaa" style={{}}/>
          </TouchableOpacity>
        </View>

        {this.displayValidationError('confirmPasswordError')}
        {this.state.passwordMatch == '' 
          ?
          null

          :
          this.state.passwordMatch=='matched'
          ?
          <View style={{width:'100%'}}>
            <Text style={styles.successText}>Passwords matched</Text>
          </View> 
          :
          <View style={{width:'100%'}}>
            <Text style={styles.errorText}>Passwords not matching</Text>
          </View>
        }
      </View>

      <View style={[styles.formInputView,styles.marginBottom20,{flexDirection:'row'}]}>
        <Button
          onPress         = {this.handleReset.bind(this)}
          titleStyle      = {styles.buttonText}
          title           = "Reset Password"
          buttonStyle     = {styles.button}
          containerStyle  = {styles.button1Container}
        />
        <Button
          onPress         = {() => this.props.navigation("Login")}
          titleStyle      = {styles.buttonSignInText}
          title           = "Sign In"
          buttonStyle     = {styles.button2}
          containerStyle  = {styles.button1Container}
        />
      </View>
    </View>
    {this.props.openModal ?
      <Modal navigation={navigation}/>
      :
      null
    }
    </View>
    );
  }
}

RootResetPassword.defaultProps = {
  messages: {
    en: {
      numbers: 'This field must be a number.',
      email: 'Enter a valid email address',
      required: 'This field is required.',
      letters: 'It should only contain letters.',
      mobileNo: 'Enter a valid mobile number.',
      lettersOrEmpty: 'It should only contain letters.',
      minlength: 'Password should be greater than {1} characters',
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
      if (length === void(0)) {
        throw 'ERROR: It is not a valid length, checkout your minlength settings.';
      } else if(value.length > length) {
        return true;
      }
      return false;
    },
  },
}
const mapStateToProps = (state)=>{
  return {
    user_id             : state.user_id,
    openModal           : state.openModal,
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
  }
};
export default connect(mapStateToProps,mapDispatchToProps)(RootResetPassword);