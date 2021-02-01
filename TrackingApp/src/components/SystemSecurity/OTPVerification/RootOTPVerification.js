import React from 'react';
import {
    ScrollView,
    Text,
    View,
    BackHandler,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    Image,
    TextInput,
    Alert,
} from 'react-native';
import { TextField } from "react-native-material-textfield";
import { Button, Icon } from "react-native-elements";
import ValidationComponent from "react-native-form-validator";
import axios from "axios";
import Modal from "react-native-modal";
import styles from './styles.js';
import { colors, sizes } from '../../../config/styles.js';
import Loading from '../../../layouts/Loading/Loading.js';
import { connect }        from 'react-redux';

const window = Dimensions.get('window');

class RootOTPVerification extends ValidationComponent {

    constructor(props) {
        super(props);
        this.state = {
            inputFocusColor: colors.textLight,
            email: '',
            Password: '',
            resend: false,
            resendMobOtp: '',
            resendEmailOtp: '',
            otpMobInputError: '',
            otpEmailInputError: '',
            otpMobInput: ["", "", "", ""],
            mobInputs: ["m1", "m2", "m3", "m4"],
            otpEmailInput: ["", "", "", "", "", ""],
            emailInputs: ["e1", "e2", "e3", "e4"],
            btnLoading: false,
            resendLoading: false,
            userId: "",
            openModal: false,
        };
    }

    componentDidMount() {
        AsyncStorage.multiGet(['token', 'user_id'])
            .then((data) => {
                token = data[0][1]
                user_id = data[1][1]
                this.setState({ userId: user_id })
            })

    }

    focusNext(index, value, otpType, length) {

        if (otpType == "mobile") {
            var { mobInputs, otpMobInput } = this.state;
            otpMobInput[index] = value;
            this.setState({ otpMobInput });
        } else if (otpType == "email") {
            var { emailInputs, otpEmailInput } = this.state;
            otpEmailInput[index] = value;
            this.setState({ otpEmailInput });
        }

        if (index < length - 1 && value) {
            let next = (otpType == "mobile") ? mobInputs[index + 1] : emailInputs[index + 1];
            // console.log("next = ",next);
            this.refs[next].focus();
        }
        if (this.state.otpEmailInput.length == 6) {
            this.setState({
                otpEmail: this.state.otpEmailInput.map(data => {
                    return data
                }).join("")
            })
        }
        if (this.state.otpMobInput.length == 6) {
            var otp = this.state.otpMobInput.map(data => {
                return data
            }).join("")
            this.setState({ otpMob: otp })
        }
    }
    focusPrevious(key, index, otpType) {
        if (key === 'Backspace' && index !== 0) {
            if (otpType == "mobile") {
                let { mobInputs } = this.state;
                var prev = mobInputs[index - 1];
            } else {
                let { emailInputs } = this.state;
                var prev = emailInputs[index - 1];
            }

            this.refs[prev].focus();
        }
    }

    handleError = (error, name) => {
        console.log("name = ", name, "error = ", error);
        this.setState({
            [name]: error,
        });
    }

    handleSubmit = () => {
        let { otpEmail } = this.state;
        this.setState({ btnLoading: true })
        axios.get('/api/auth/get/checkemailotp/usingID/'+this.props.user_id+"/"+otpEmail)
        .then(response => {
          this.setState({ btnLoading: false })
          if (response.data.message == 'SUCCESS') {
            this.props.navigation('Login');
          }else{
            var messageHead = "Please enter correct OTP.";
            var messagesSubHead = "";
            this.props.openModal(true,messageHead, messagesSubHead,"warning");
          }
        })
        .catch(error => {
          if (error.response.status == 401) {
            this.setState({ incorrectPwModal: true, btnLoading: false })
          }
        })
    }

    handleResend = () => {
        this.setState({ resendLoading: true, otpEmailInput: ['', '', '', '', '', ''], otpMobInput: ['', '', '', ''], otpEmail: '', otpMob: '' })
        var formValues = {
          "emailSubject" : "Email Verification",
          "emailContent"  : "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
        }
        axios.patch('/api/auth//patch/setsendemailotpusingID/'+this.props.user_id,formValues)
        .then(response => {
          this.setState({ resendLoading: false })
          if (response.data.message == 'OTP_UPDATED') {
            var messageHead = "OTP Resend successfully!";
            var messagesSubHead = "Please enter New OTP to verify";
            this.props.openModal(true,messageHead, messagesSubHead,"success");
          }else{
            var messageHead = response.data.message;
            var messagesSubHead = "";
            this.props.openModal(true,messageHead, messagesSubHead,"warning");
          }
        })
        .catch(error => {
          if (error.response.status == 401) {
            this.setState({resendLoading: false })
          }
        })

    }

    render() {
        const { navigate, dispatch, goBack } = this.props.navigation;
        const { navigation } = this.props;
        return (
            <View>
                <View style={{ width: '100%',}}>
                    <View style={styles.textTitleWrapper}><Text style={{ fontSize: 25, fontFamily: 'Montserrat-Regular',textAlign:'center' }}>OTP Verification</Text></View>
                    <View style={styles.textTitleWrapper}><Text style={{ fontSize: 17, fontFamily: 'Montserrat-Regular' }}>Please Enter Verification Code</Text></View>

                    <View style={styles.formWrapper}>
                        {/*<View style={[styles.formInputView, styles.otpWrap]}>
                            <Text style={styles.otpText}>Phone Number</Text>
                            <View style={styles.otpInputWrap}>
                                {
                                    this.state.mobInputs.map((data, index) => {
                                        return (
                                            <View key={index} style={styles.otpInput}>
                                            {    <TextInput
                                                    label=""
                                                    onChangeText={(v) => this.focusNext(index, v, "mobile", 4)}
                                                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, index, "mobile")}
                                                    lineWidth={1}
                                                    tintColor={colors.button}
                                                    inputContainerPadding={0}
                                                    labelHeight={15}
                                                    labelFontSize={sizes.label}
                                                    titleFontSize={15}
                                                    baseColor={'#666'}
                                                    textColor={'#333'}
                                                    // value                 = {this.state.email}
                                                    containerStyle={styles.textContainer}
                                                    inputContainerStyle={styles.textInputContainer}
                                                    titleTextStyle={styles.textTitle}
                                                    style={styles.textStyle}
                                                    labelTextStyle={styles.textLabel}
                                                    keyboardType="numeric"
                                                    maxLength={1}
                                                    ref={data}
                                                    selectTextOnFocus
                                                    selectionColor={colors.primary}
                                                />}
                                            </View>
                                        );
                                    })
                                }
                            </View>
                        </View>*/}
                        <View style={[styles.formInputView, styles.otpWrap]}>
                            <Text style={styles.otpText}>Email</Text>
                            <View style={styles.otpInputWrap}>
                                {
                                    this.state.emailInputs.map((data, index) => {
                                        return (
                                            <View key={index} style={styles.otpInput}>
                                                <TextInput
                                                    label=""
                                                    onChangeText={(v) => this.focusNext(index, v, "email", 4)}
                                                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, index, "email")}
                                                    lineWidth={1}
                                                    tintColor={colors.button}
                                                    inputContainerPadding={0}
                                                    labelHeight={15}
                                                    labelFontSize={sizes.label}
                                                    titleFontSize={15}
                                                    baseColor={'#666'}
                                                    textColor={'#333'}
                                                    // value = {this.state.otpEmail}
                                                    containerStyle={styles.textContainer}
                                                    inputContainerStyle={styles.textInputContainer}
                                                    titleTextStyle={styles.textTitle}
                                                    style={styles.textStyle}
                                                    labelTextStyle={styles.textLabel}
                                                    keyboardType="numeric"
                                                    maxLength={1}
                                                    ref={data}
                                                    selectTextOnFocus
                                                    selectionColor={colors.primary}
                                                />
                                            </View>
                                        );
                                    })
                                }
                            </View>
                        </View>
                        <View style={[{ flexDirection: 'row', }]}>
                           {this.state.btnLoading ?
                             <Button
                                // onPress={this.handleSubmit.bind(this)}
                                titleStyle={styles.buttonText}
                                title="Verify"
                                loading
                                buttonStyle={styles.button}
                                containerStyle={styles.button1Container}
                            />
                            :
                             <Button
                                onPress={this.handleSubmit.bind(this)}
                                titleStyle={styles.buttonText}
                                title="Verify"
                                buttonStyle={styles.button}
                                containerStyle={styles.button1Container}
                            />
                          }
                          {this.state.resendLoading ?
                             <Button
                                // onPress={this.handleResend.bind(this)}
                                titleStyle={styles.buttonSignInText}
                                title="Resend OTP"
                                loading
                                loadingStyle={{color:"#333"}}
                                buttonStyle={styles.buttonSignUp}
                                containerStyle={styles.button1Container}
                            />
                            :
                             <Button
                                onPress={this.handleResend.bind(this)}
                                titleStyle={styles.buttonSignInText}
                                title="Resend OTP"
                                buttonStyle={styles.buttonSignUp}
                                containerStyle={styles.button1Container}
                            />
                          }
                            
                        </View>
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
export default connect(mapStateToProps,mapDispatchToProps)(RootOTPVerification);