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
import Geocoder                                                 from 'react-native-geocoding';

const window = Dimensions.get('window');

export default class EmployeeAddress  extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputFocusColor: colors.textLight,
      firstName      : "",
      lastName       : "",
      mobileNumber   : "",
      email          : "",
      pincode        : "",
      googleApiKey    :""
    };
  }

  componentDidMount(){
    this.getS3config();
  AsyncStorage.getItem('user_id')
    .then((userId)=>{
      axios.get('/api/users/get/'+userId)
      .then((user)=>{
        // console.log('user',user);
        var userData = this.props.userData;
        // console.log("userData=>",userData);
        this.setState({
          addressLine     : userData.address.addressLine, 
          area            : userData.address.area, 
          city            : userData.address.city, 
          state           : userData.address.state, 
          pincode         : userData.address.pincode, 
          coordinates     : userData.address.coordinates, 
          user_id         : userId,  
        })
      })
      .catch((error)=>{
        console.log("error=>",error)
      })
    })
  }

  getS3config(){
    axios
      .get('/api/projectsettings/get/GOOGLE')
      .then((response)=>{
        this.setState({
          googleApiKey : response.data.key
        })
      })
     .catch((error)=>{
              console.log(error);
        });
  }

  validInput = () => {
    const {
      addressLine,
      area,
      city,
      state,
      pincode
    } = this.state;
    let valid = true;
    this.validate({
      addressLine: {
        required: true,
        letters: true,
      },
      area: {
        required: true,
        letters: true,
      },
      city: {
        required: true,
        letters: true,
      },
      state: {
        required: true,
        letters: true,
      },
      pincode: {
        required: true, 
        minlength: 6,
        maxlength: 6
      },
    });

    if (this.isFieldInError("addressLine")) {
      let firstNameError = this.getErrorsInField("addressLine");
      this.setState({ firstNameError });
      valid = false;
    } else {
      this.setState({ addressLineError: "" });
      valid = true;
    }
    if (this.isFieldInError("area")) {
      this.setState({ areaError: this.getErrorsInField("area") });
      valid = false;
    } else {
      this.setState({ areaError: "" });
      valid = true;
    }
    if (this.isFieldInError("city")) {
      this.setState({ cityError: this.getErrorsInField("city") });
      valid = false;
    } else {
      this.setState({ cityError: "" });
      valid = true;
    }
    if (this.isFieldInError("state")) {
      this.setState({ stateError: this.getErrorsInField("state") });
      valid = false;
    } else {
      this.setState({ stateError: "" });
      valid = true;
    }
    if (this.isFieldInError("pincode")) {
      this.setState({ pincodeError: this.getErrorsInField("pincode") });
      valid = false;
    } else {
      this.setState({ pincodeError: "" });
      valid = true;
    }
    return ((!this.isFieldInError("addressLine")) && (!this.isFieldInError("area")) && (!this.isFieldInError("city")) && (!this.isFieldInError("state")) && (!this.isFieldInError("pincode")));
  };

  validInputField = (stateName, stateErr) => {
    const {
       addressLine,
      area,
      city,
      state,
      pincode
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
    this.setState({
     openModal      : true,
   });
  };

  handleMobileChange(value) {
    if (value.startsWith && value.startsWith('+')) {
      value = value.substr(3);
    }
    let x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    // console.log("x value = ", x);
    let y = x.input ? (!x[2] && !x[3]) ? '+91 ' + x[1] : (!x[3] ? '+91 ' + x[1] + '-' + x[2] : '+91 ' + x[1] + '-' + x[2] + '-' + x[3]) : '';
    this.setState({
      mobileNumber: y,
    });
  }

  handleSubmitAddress(){
    // Geocoder.init(this.state.googleApiKey);
    //    var address = this.state.addressLine+", "+this.state.area+", "+ this.state.city+", "+this.state.state+", "+this.state.pincode;
    //    // console.log("address",address)
    //    Geocoder.from(address)
    //     .then(json => {
    //       var location = json.results[0].geometry.location;
    //       console.log("location",location);
          var formValues = {
            addressLine : this.state.addressLine,
            area        : this.state.area,
            city        : this.state.city,
            state       : this.state.state,
            pincode     : this.state.pincode,
            // latitude    : location.lat,
            // longitude   : location.lng,
          }
          console.log("formValues",formValues);
           axios.patch('/api/users/patch/address/'+this.state.user_id,formValues)
            .then((user)=>{
              console.log("user")
              Alert.alert("Profile updated successfully")

            })
            .catch((error)=>{
              console.log("error=>",error)
            })
        // })
        // .catch((error)=>{
        //   console.log("error",error);
        // })  
    
  }

  render() {
    const { navigation } = this.props;
    console.log("googleApiKey",this.state.googleApiKey);
    return (
      <React.Fragment>
          <View style={{paddingVertical:20}}>
              <View style={[styles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label         = {'Address Line'}
                  onChangeText  = {(addressLine) => { this.setState({ addressLine }, () => { this.validInputField('addressLine', 'addressLineError'); }) }}
                  value         = {this.state.addressLine}
                  keyboardType  = "default"
                  iconClass     = {FontAwesomeIcon}
                  iconName      = {'user-circle-o'}
                  iconColor     = {colors.inputText}
                  iconSize      = {20}
                  iconWidth     = {40}
                  inputPadding  = {16}
                  style         = {{borderWidth:1,borderColor:"#f1f1f1",flex:0}}
                />
                {this.displayValidationError('addressLineError')}
              </View>

              <View style={[styles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label         = {'Area'}
                  onChangeText  = {(area) => { this.setState({ area }, () => { this.validInputField('area', 'areaError'); }) }}
                  value         = {this.state.area}
                  keyboardType  = "default"
                  iconClass     = {FontAwesomeIcon}
                  iconName      = {'user-circle-o'}
                  iconColor     = {colors.inputText}
                  iconSize      = {20}
                  iconWidth     = {40}
                  inputPadding  = {16}
                  style         = {{borderWidth:1,borderColor:"#f1f1f1"}}
                />
                {this.displayValidationError('areaError')}
              </View>

              <View style={[styles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label         = {'City'}
                  onChangeText  = {(city) => { this.setState({ city }, () => { this.validInputField('city', 'cityError'); })}}
                  value         = {this.state.city}
                  keyboardType  = "default"
                  iconClass     = {FontAwesomeIcon}
                  iconName      = {'phone-square'}
                  iconColor     = {colors.inputText}
                  iconSize      = {20}
                  iconWidth     = {40}
                  inputPadding  = {16}
                  style         = {{borderWidth:1,borderColor:"#f1f1f1"}}
                />
                {this.displayValidationError('cityError')}
              </View>

              <View style={[styles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label           ={'State'}
                  onChangeText    ={(state) => { this.setState({ state }, () => { this.validInputField('state', 'stateError'); }) }}
                  value           ={this.state.state}
                  keyboardType    ="default"
                  autoCapitalize  ='none'
                  iconClass       ={MaterialCommunityIcons}
                  iconName        ={'email-variant'}
                  iconColor       ={colors.inputText}
                  iconSize        ={20}
                  iconWidth       ={40}
                  inputPadding    ={16}
                  style           ={{borderWidth:1,borderColor:"#f1f1f1"}}
                />
                {this.displayValidationError('stateError')}
              </View>
              <View style={[styles.formInputView, styles.marginBottom20]}>
                <Fumi
                  label           ={'Pincode'}
                  onChangeText    ={(pincode) => { this.setState({ pincode }, () => { this.validInputField('pincode', 'pincodeError'); }) }}
                  value           ={this.state.pincode.toString()}
                  keyboardType    ="enumeric"
                  autoCapitalize  ='none'
                  iconClass       ={MaterialCommunityIcons}
                  iconName        ={'email-variant'}
                  iconColor       ={colors.inputText}
                  iconSize        ={20}
                  iconWidth       ={40}
                  inputPadding    ={16}
                  style           ={{borderWidth:1,borderColor:"#f1f1f1"}}
                />
                {this.displayValidationError('pincodeError')}
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
                    onPress={this.handleSubmitAddress.bind(this)}
                    titleStyle={styles.buttonText}
                    title="Save"
                    buttonStyle={styles.button}
                    containerStyle={styles.buttonContainer}
                  />
              }
            </View>
      </React.Fragment>
    );

  }
}

EmployeeAddress.defaultProps = {
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
