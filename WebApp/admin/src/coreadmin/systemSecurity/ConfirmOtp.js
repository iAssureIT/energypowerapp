import React, { Component } from 'react';
import swal from 'sweetalert';
import $ from "jquery";
import jQuery from 'jquery';
import axios from 'axios';
import './SignUp.css';

class ConfirmOtp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessage: false
    }
  }
  componentDidMount() {
    $.validator.addMethod("regxemailotp", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter a valid OTP.");

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });

    $("#OTPMobMail").validate({
      rules: {
        emailotp: {
          required: true,
          regxemailotp: /^[1-9][0-9]{3}$/,
        },
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") === "emailotp") {
          error.insertAfter("#emailotp");
        }
      }
    });
  }
  confirmOTP(event) {
    event.preventDefault();
    var url = this.props.match.params;
    var formValues = {
      "user_ID": this.props.match.params.userID,
      "emailOTP": parseInt(this.refs.emailotp.value),
      "status": "Active"
    }
    if ($("#OTPMobMail").valid()) {
      axios.get('/api/auth/get/checkemailotp/usingID/' + this.props.match.params.userID + '/' + this.refs.emailotp.value)
        .then((response) => {

          if (response.data.message === 'SUCCESS') {
            swal('OTP Verified Successfully.');
            var url = localStorage.getItem('previousUrl');
            if (url === 'forgotpassword') {
              localStorage.removeItem("previousUrl");
              this.props.history.push('/reset-pwd/' + this.props.match.params.userID);
            } else {
              localStorage.removeItem("previousUrl");
              this.props.history.push('/login');
            }
          } else {
            swal('Please enter valid OTP.');
          }
        })
        .catch((error) => {
          swal(error.response.data.message);
        })
    }

  }
  inputEffect(event) {
    event.preventDefault();
    if ($(event.target).val() !== "") {
      $(event.target).addClass("has-content");
    } else {
      $(event.target).removeClass("has-content");
    }
  }
  resendOtp(event) {
    const userid = this.props.match.params.userID;
    document.getElementById("resendOtpBtn").innerHTML = 'Please wait...';
      var formValues = {
        "emailSubject": "Email Verification",
        "emailContent": "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
      }
      axios.patch('/api/auth/patch/setsendemailotpusingID/' + userid, formValues)
        .then((response) => {
          document.getElementById("resendOtpBtn").innerHTML = 'Resend OTP';
          swal("OTP resend to your registered Email ID.");
        })
      .catch((error) => {
          swal(" Failed to resent OTP");
          document.getElementById("resendOtpBtn").innerHTML = 'Resend OTP';
     })
  }
  Closepagealert(event) {
    event.preventDefault();
    $(".toast-error").html('');
    $(".toast-success").html('');
    $(".toast-info").html('');
    $(".toast-warning").html('');
    $(".toast-error").removeClass('toast');
    $(".toast-success").removeClass('toast');
    $(".toast-info").removeClass('toast');
    $(".toast-warning").removeClass('toast');

  }
  render() {

    var resendOtpWrap = "resendOtpWrap resendOtpWrapcss";
    var mobileEmail = 'Mobile Number';
    var resendOtp = "";

    return (
      <div style={{ 'height': window.innerHeight + 'px', 'width': window.innerWidth + 'px' }} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 LoginWrapper">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innloginwrap">
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt100 mb100">
          <div className="col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-12 col-xs-12 formShadow">

            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">

              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innloginwrap mb25">
                <h3>Confirm OTP</h3>
              </div>
              {
                this.state.showMessage === false ?
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <p>We've sent you an OTP to your registered Email ID.</p>
                    <div className="">
                      <span> Please enter your OTP below.<br /></span>
                    </div>
                    <form id="OTPMobMail" className="textAlignLeft">
                      <div className="">

                        <br />
                        <div className="input-group " id="emailotp">
                          <input type="number" className="form-control" ref="emailotp" name="emailotp" placeholder="Enter OTP" onBlur={this.inputEffect.bind(this)}  required />
                          <span className="input-group-addon glyphi-custommm"><i className="fa fa-key" aria-hidden="true"></i></span>
                        </div>
                      </div>
                      <div className="loginforgotpass mt25">
                        <lable>Forget your Password?</lable>&nbsp;<a href='/login' className="">Sign In <b>&#8702;</b></a>
                      </div>
                      <div className="mt30 col-lg-12 mb25">
                        <div className="col-lg-6">
                          <div id="resendOtpBtn" onClick={this.resendOtp.bind(this)} className="col-lg-12 btn  systemsecBtn">
                            Resend OTP
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <button type="submit" onClick={this.confirmOTP.bind(this)} className="col-lg-12 btn loginBtn systemsecBtn">Submit</button>
                        </div>
                      </div>
                    </form>
                  </div>
                  :
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <p className="textAlignCenter">Your Account is verified successfully! Please Sign In to access your account.<br /></p>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt15">
                      <a href="/login" className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-xs-12 button3  btn btn-warning  signupbtn">Sign In</a>
                    </div>
                  </div>
              }

            </div>
          </div>

        </div>
      </div>
    );
  }
}
export default ConfirmOtp;