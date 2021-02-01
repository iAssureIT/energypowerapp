import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import swal from 'sweetalert';
import axios from 'axios';

class ResetPassword extends Component {
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
    resetPassword(event) {
        event.preventDefault();
        var userID = this.props.match.params.user_ID;
        var formValues = {
            "pwd" : this.refs.newPassword.value
        }
        if($('#resetPassword').valid()){
            $('.fullpageloader').show();
            axios.patch('/api/auth/patch/change_password_withoutotp/id/'+userID, formValues)
            .then((response)=>{
                $('.fullpageloader').hide();
                this.setState({
                    "showMessage" : true,
                })
                swal(response.data.message);
                this.props.history.push('/login');
            })
            .catch((error)=>{
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

    validation(){
        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });

        $("#resetPassword").validate({
            rules: {
                newPassword: {
                    required: true,
                },
                confirmPassword: {
                    required: true,
                    equalTo : "#newPassword"
                },
            },
            messages:{
                confirmPassword:"Passwords do not match"
            },
            errorPlacement: function (error, element) {
                if (element.attr("name") === "newPassword") {
                    error.insertAfter("#newPasswordmsg");
                }
                if (element.attr("name") === "confirmPassword") {
                    error.insertAfter("#confirmPass");
                }
            }
        });
    }
    showNewPass(){
        $('.showPwd').toggleClass('showPwd1');
        $('.hidePwd').toggleClass('hidePwd1');
        return $('#newPassword').attr('type', 'text');
    }
    hideNewPass(){
        $('.showPwd').toggleClass('showPwd1');
        $('.hidePwd').toggleClass('hidePwd1');
        return $('#newPassword').attr('type', 'password');
    }
    showConfirmPass(){
        $('.showPwd2').toggleClass('showPwd3');
        $('.hidePwd2').toggleClass('hidePwd3');
        return $('#confirmPassword').attr('type', 'text');
    }
    hideConfirmPass(){
        $('.showPwd2').toggleClass('showPwd3');
        $('.hidePwd2').toggleClass('hidePwd3');
        return $('#confirmPassword').attr('type', 'password');
    }
    render() {
        return (
            <div style={{'height': window.innerHeight+'px', 'width': window.innerWidth+'px'}} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 LoginWrapper">
                <div className="col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-12 col-xs-12 formShadow mb100 mt100">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innloginwrap">
                        <h3>Reset Password</h3>
                    </div>
                    {
                        this.state.showMessage === false ? 
                        <div>
                            <form id="resetPassword">
                            <div className="form-group textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <label>New Password </label><label className="astricsign">*</label>
                                <input type="password" id="newPassword" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" ref="newPassword" name="newPassword" />
                                <div className="showHideSignDiv">
                                    <i className="fa fa-eye showPwd showEyeupSign" aria-hidden="true" onClick={this.showNewPass.bind(this)}></i>
                                    <i className="fa fa-eye-slash hidePwd hideEyeSignup " aria-hidden="true" onClick={this.hideNewPass.bind(this)}></i>
                                </div> 
                                <br/>
                                <div  id="newPasswordmsg"></div>
                            </div>
                            <div className="form-group textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12" >
                                <label>Confirm Password</label><label className="astricsign">*</label>
                                <input type="password" id="confirmPassword" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" ref="confirmPassword" name="confirmPassword" />
                                <div className="showHideSignDiv">
                                    <i className="fa fa-eye showPwd2 showEyeupSign" aria-hidden="true" onClick={this.showConfirmPass.bind(this)}></i>
                                    <i className="fa fa-eye-slash hidePwd2 hideEyeSignup" aria-hidden="true" onClick={this.hideConfirmPass.bind(this)}></i>
                                </div> 
                                <br/>
                                <div id="confirmPass"></div>
                            </div>
                            <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-xs-12 mt25 mb25">
                                <button className="btn resetBtn" onClick={this.resetPassword.bind(this)}>Reset Password</button>
                            </div>
                        </form>
                        </div>
                        :
                        <div>
                            <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25 textAlignCenter">Your password has been reset successfully!</p>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt10">
                                <div className="row loginforgotpass textAlignCenter"> Please &nbsp;
                                    <a href='/login' className=""><b>Click here</b></a> to Sign In.
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default ResetPassword;