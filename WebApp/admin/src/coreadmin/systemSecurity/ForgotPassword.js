import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bannerData: {
                title: "MY SHOPPING CART",
                breadcrumb: 'My Shopping Cart',
                backgroungImage: '/images/cartBanner.png',
            },
            showMessage : false
        }
    }
    componentDidMount(){
        this.validation();
    }
    sendLink(event) {
        event.preventDefault();
        
        var email = this.refs.emailLink.value;
        var formValues = {
            username : email,
            "emailSubject"	: "Password Reset Request", 
			"emailContent"  : "It appears that you have requested for your password to be reset.",
        }
        if($('#resetPass').valid()){
            document.getElementById("sendlink").innerHTML = 'Please wait...';
            $('.fullpageloader').show();
            axios.patch('/api/auth/patch/setsendemailotpusingEmail/'+email, formValues)
            .then((response)=>{
                console.log("response",response);
                if(response.data.message === "OTP_UPDATED"){
                    document.getElementById("sendlink").innerHTML = 'Reset Password';
                    localStorage.setItem('previousUrl' ,'forgotpassword');
                    $('.fullpageloader').hide();
                    swal("OTP send to your registered email ID.");
                    this.props.history.push('/confirm-otp/'+response.data.ID);
                }else if(response.data.message === "NOT_REGISTER"){
                    document.getElementById("sendlink").innerHTML = 'Send OTP';
                    swal("This Email Id is not registered.");
                }else if(response.data.message === 'OTP_NOT_UPDATED'){
                    document.getElementById("sendlink").innerHTML = 'Send OTP';
                    swal("Something went wrong. Please contact admin");
                }else if(response.data.message === "USER_BLOCK"){
                    document.getElementById("sendlink").innerHTML = 'Send OTP';
                    swal("Your account is blocked. Please contact admin");
                }else{
                    document.getElementById("sendlink").innerHTML = 'Send OTP';
                    swal("Something went wrong. Please contact admin");
                }
            })
            .catch((error)=>{
                document.getElementById("sendlink").innerHTML = 'Send OTP';
                swal("This Email ID is not registered");
                $('.fullpageloader').hide();
            })
        }
    }
      Closepagealert(event){
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

    validation() {
        $.validator.addMethod("regxemail", function (value, element, regexpr) {
            return regexpr.test(value);
        }, "Please enter valid email address.");


        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });

        $("#resetPass").validate({
            rules: {
                emailLink: {
                    required: true,
                    regxemail: /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
                },
            },
            errorPlacement: function (error, element) {

                if (element.attr("name") === "emailLink") {
                    error.insertAfter("#emailLink");
                }
            }
        });
    }
    render() {
        return (
            <div style={{'height': window.innerHeight+'px', 'width': window.innerWidth+'px'}} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 LoginWrapper">
                <div  className="col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-12 col-xs-12 formShadow">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innloginwrap">
                        <h3>Forgot Password</h3>
                    </div>
                    {
                        this.state.showMessage === false ? 
                        <div>
                            <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25">Please enter your registered email address below to receive an OTP.</p>
                            <form id="resetPass">
                                <div className="textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25" >
                                    <label className="">Email ID</label><label className="astricsign">*</label>
                                    <input className="form-control col-lg-12 col-md-12 col-sm-12  col-xs-12" placeholder="Email ID" ref="emailLink" name="emailLink" type="text" />
                                    <div id="emailLink"></div>
                                </div>
                                <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-xs-12 mt25 mb25">
                                    <button id="sendlink" className="btn resetBtn" onClick={this.sendLink.bind(this)}>Send OTP</button>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt10">
                                    <div className="row loginforgotpass textAlignCenter">
                                        <a href='/login' className="">Sign In</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                        :
                        <div>
                            <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25">We have sent a reset password link to your email account.</p>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt10">
                                <div className="row loginforgotpass textAlignCenter">
                                    <a href='/login' className="">Sign In</a>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default ForgotPassword;