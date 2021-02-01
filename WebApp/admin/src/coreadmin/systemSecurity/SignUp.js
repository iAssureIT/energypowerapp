import React, { Component } from 'react';
import $ from "jquery";
import jQuery from 'jquery';
import 'jquery-validation';
import PhoneInput from 'react-phone-input-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import 'bootstrap/js/tab.js';
import 'font-awesome/css/font-awesome.min.css';
import './SignUp.css';
import swal from 'sweetalert';
import axios from 'axios';

class SignUp extends Component {

	constructor() {
		super();
		this.state = {
			checkUserExists: 0,
			loggedIn: false,
			auth: {
				firstname: '',
				lastname: '',
				mobNumber: '',
				email: '',
				pwd: '',
				signupPassword: '',
				role: ''
			},
			formerrors: {
				firstNameV: "",
				lastNameV: "",
				mobileV: "",
				emailIDV: "",
			},
			termsCondition: ["The price of products  is as quoted on the site from time to time.",
				"Price and delivery costs are liable to change at any time, but changes will not affect orders in respect of which we have already sent you a Despatch Confirmation.",
				"Products marked as 'non-returnable' on the product detail page cannot be returned.",
				"Products may not be eligible for return in some cases, including cases of buyer's remorse such as incorrect model or color of product ordered or incorrect product ordered."]
		}
		this.handleChange = this.handleChange.bind(this);
	}
	componentWillMount() {

	}
	validation() {
        $.validator.addMethod("regxfirstname", function (value, element, regexpr) {
            return regexpr.test(value);
        }, "Name should only contain letters.");
        $.validator.addMethod("regxEmail", function (value, element, regexpr) {
            return regexpr.test(value);
		}, "Please enter a valid email address.");
		
        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });

        $("#signUpUser").validate({
            rules: {
                firstname: {
                    required: true,
                    regxfirstname : /^[A-Za-z]*$/,
				},
				lastname: {
                    required: true,
                    regxfirstname : /^[A-Za-z]*$/,
                },
                signupEmail: {
					required: true,
					regxEmail: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
                },
                signupPassword: {
                    required: true,
				},
				signupConfirmPassword: {
					required: true,
					equalTo : "#signupPassword"
				},
				idacceptcondition: {
					required: true,
				}
			},
			messages:{
				signupConfirmPassword:"Password do not match"
			},
            errorPlacement: function (error, element) {
                if (element.attr("name") === "firstname") {
                    error.insertAfter("#firstname");
				}
				if (element.attr("name") === "lastname") {
                    error.insertAfter("#lastname");
                }
                if (element.attr("name") === "signupEmail") {
                    error.insertAfter("#signupEmail");
                }
                if (element.attr("name") === "signupPassword") {
                    error.insertAfter("#signupPassword");
				}
				if (element.attr("name") === "signupConfirmPassword") {
                    error.insertAfter("#signupConfirmPassword");
                }
                if (element.attr("name") === "idacceptcondition") {
                    error.insertAfter("#idacceptcondition");
                }
            }
        });
    }
	usersignup(event) {
		event.preventDefault();
		if($("#signUpUser").valid()){
			var auth = {
				firstname		: this.state.firstname,
				lastname		: this.state.lastname,
				mobNumber		: (this.state.mobNumber).replace("-", ""),
				email			: this.state.signupEmail,
				pwd				: this.state.signupPassword,
				role			: 'user',
				status			: 'unverified',
				"emailSubject"	: "Email Verification", 
				"emailContent"  : "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
			}
			document.getElementById("signUpBtn").innerHTML = 'Please Wait...';

			var passwordVar = this.refs.signupPassword.value;
			var signupConfirmPasswordVar = this.refs.signupConfirmPassword.value;

				if (passwordVar === signupConfirmPasswordVar) {
					return (passwordVar.length >= 6) ?
						(true,
							document.getElementById("signUpBtn").innerHTML = 'Sign Up',
							axios.post('/api/auth/post/signup/user/emailotp', auth)
							.then((response) => {
								if(response.data.message === 'USER_CREATED'){
									swal('Great, Information submitted successfully and OTP is sent to your registered Email.');
									localStorage.setItem('previousUrl' ,'signup');
									this.props.history.push("/confirm-otp/" + response.data.ID);
								}else{
									swal(response.data.message);
								}	
							})
							.catch((error) => {
								
							})
						)
						:
						(
							document.getElementById("signUpBtn").innerHTML = 'Sign Up',
							
							swal("Password should be at least 6 Characters Long, Please try again or create an Account.")
							
						)


				} else {
					document.getElementById("signUpBtn").innerHTML = 'Sign Up';
					
					swal("Passwords does not match, Please Try Again.");
				}
		}

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

	checkUserExists(event) {
		if (event.target.value !== '') {
			axios.get('/get/checkUserExists/' + event.target.value)
				.then((response) => {

					if (response.data.length > 0) {
						$(".checkUserExistsError").show();
						$('.button3').attr('disabled', 'disabled');
						this.setState({ checkUserExists: 1 })

					} else {
						$(".checkUserExistsError").hide();
						$('.button3').removeAttr('disabled');
						this.setState({ checkUserExists: 0 })
					}
				})
				.catch(function (error) {
				})
		} else {
			$(".checkUserExistsError").hide();
		}
	}

	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}
	acceptcondition(event) {
		var conditionaccept = event.target.value;
		if (conditionaccept === "acceptedconditions") {
			$(".acceptinput").removeAttr('disabled');
		} else {
			$(".acceptinput").addAttr('disabled');
		}
	}

	showModal() {
		$(".modalbg").css("display", "block");
	}
	hideModal() {
		$(".modalbg").css("display", "none");
	}
	componentDidMount() {
		this.validation();
		$(".checkUserExistsError").hide();
	}

	showSignPass() {
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('.inputTextPass').attr('type', 'text');
	}
	hideSignPass() {
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('.inputTextPass').attr('type', 'password');
	}
	proceed() {

	}
	render() {
		return (
			<div style={{'height': window.innerHeight+'px', 'width': window.innerWidth+'px'}} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 LoginWrapper">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div className="col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7  col-sm-12 col-xs-12 formShadow">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innloginwrap">
							<h3>Sign Up</h3>
						</div>
						<form id="signUpUser">
							<div className="form-group textAlignLeft col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<label>First Name</label><label className="astricsign">*</label>
								<input type="text" maxLength="25" className="form-control" id="firstname" ref="firstname" name="firstname" placeholder="" onChange={this.handleChange} data-text="firstNameV" />
							</div>
							<div className="form-group textAlignLeft col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<label>Last Name</label><label className="astricsign">*</label>
								<input type="text" maxLength="25" className="form-control" id="lastname" ref="lastname" name="lastname" placeholder="" onChange={this.handleChange} data-text="lastNameV" />
							</div>
							<div className="form-group textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12 mt15">
								<label>Email ID</label><label className="astricsign">*</label>
								<input type="email" className="form-control" id="signupEmail" ref="signupEmail" name="signupEmail" placeholder="" onChange={this.handleChange} data-text="emailIDV" />
								<label className="checkUserExistsError">User already exists!!!</label>
								
							</div>
							<div className="form-group textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12 mt15">
								<label>Mobile Number</label><label className="astricsign">*</label>
								
								<PhoneInput
									country={'in'}
									value={this.state.mobNumber} 
									name="mobNumber"
									inputProps={{
									name: 'mobNumber',
									required: true
									}}
									onChange={mobNumber=>{this.setState({mobNumber})}}
								/>
							</div>
							
							<div className="form-group textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12 mt15">
								<label>Password</label><label className="astricsign">*</label>
								<input minLength="6" type="password" className="form-control" id="signupPassword" ref="signupPassword" placeholder="" name="signupPassword" onChange={this.handleChange} />
							</div>
							<div className="form-group textAlignLeft col-lg-12 col-md-12 col-sm-12 col-xs-12 mt15">
								<label>Confirm Password</label><label className="astricsign">*</label>
								<input minLength="6" type="password" className="form-control" id="signupConfirmPassword" ref="signupConfirmPassword" placeholder="" name="signupConfirmPassword" />
							</div>
							<div className="col-lg-4 col-lg-offset-3 col-md-12 col-sm-12 col-xs-12 mt15">
								<button id="signUpBtn" onClick={this.usersignup.bind(this)} className="col-lg-12 col-md-12 col-md-offset-3 col-sm-12 col-xs-12  btn loginBtn">Sign Up</button>
							</div>
							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 text-center loginforgotpass mt25">
								<label>Already have an account?</label> &nbsp; <a href='/login' className="">Sign In <b>&#8702;</b></a>
							</div>
						</form>
						<div className="modal" id="myModal" role="dialog">
							<div className="modal-dialog">
								<div className="modal-content">
									<div className="modal-header">
										<img src="/images/Icon.png" />
										<button type="button" className="close modalclosebut" data-dismiss="modal">&times;</button>
										<h2 className="modaltext modalheadingcont">TERMS AND CONDITIONS</h2>
									</div>
									<div className="modal-body">
										<ul>
											{
												this.state.termsCondition && this.state.termsCondition.length > 0 ?
													this.state.termsCondition.map((data, index) => {
														return (
															<li>{data}</li>
														);
													})
													:
													null
											}
										</ul>
									</div>
									<div className="modal-footer">
										<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default SignUp;
