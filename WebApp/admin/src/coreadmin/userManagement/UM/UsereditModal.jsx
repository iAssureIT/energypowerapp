import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import swal from 'sweetalert';
import $ from 'jquery';
import axios from 'axios';
import InputMask from 'react-input-mask';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';


class UsereditModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
			'firstname': props.data ? props.data.firstname : '',
			'lastname': props.data ? props.data.lastname : '',
			'email': props.data ? props.data.email : '',
			'mobNumber': props.data ? props.data.mobNumber : '',
			'optionA': '',
			'messageError': '',
		};

		this.handleChange = this.handleChange.bind(this);
		this.onChange = this.onChange.bind(this);
	}
	componentDidMount(){
		this.validation();
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			'firstname': nextProps.data.firstname,
			'lastname': nextProps.data.lastname,
			'email': nextProps.data.email,
			'mobNumber': nextProps.data.mobNumber,
		});

	}

	handleChange(event) {
		const target = event.target;
		const name = target.name;
		this.setState({
			[name]: event.target.value,
		});
	}


	deleteEmailTemplate(event) {

	}

	updateNotificationEmail(event) {
		event.preventDefault();
		if($('#signUpUser').valid()){
		if (this.state.content) {
			var editId = this.props.userNot;
			var firstname = this.state.firstname;
			var lastname = this.state.lastname;
			var email = this.state.email;
			var mobNumber = this.state.mobNumber;
			if (firstname === '' || lastname === '') {
				swal({
					title: 'Please fill in all the required fields',
					text: "Please fill in all the required fields",
					type: 'success',
					showCancelButton: false,
					confirmButtonColor: '#666',
					confirmButtonText: 'Ok'
				});
			} else {
				var formValues = {
					"usermasterID": "5cfbfc2eb1514e2ec11f20fd",
					"firstname": "abc",
					"lastname": "pqr",
					"email": "abc@gmail.com",
					"mobNumber": "9898989898"
				}

				axios.patch('/api/masternotifications/' + editId, formValues)
					.then((response) => {

					})
					.catch(function (error) {
					})
					.finally(function () {
						// always executed
					});
			}
		} else {
			this.setState({
				contentError: 'This field is required.',
			});
		}
		}
	}
	selectType(event) {
		event.preventDefault();
		const target = event.target;
		const name = target.name;
		this.setState({
			[name]: event.target.value,
		});

	}

	updateContent(newContent) {
		this.setState({
			firstname: newContent
		})
	}
	onChange(evt) {
		var newContent = evt.editor.getData();
		this.setState({
			firstname: newContent
		}, () => {
			if (this.state.content) {
				this.setState({
					messageError: ''
				});
			} else {
				this.setState({
					messageError: 'This field is required'
				});
			}
		});
	}
	validation(){
		$.validator.addMethod("regxA1", function (value, element, regexpr) {
		  return regexpr.test(value);
		}, "Please enter valid company name");
	
		$.validator.addMethod("regxA5", function (value, element, regexpr) {
		  return regexpr.test(value);
		}, "Please enter valid group name");
	
		$.validator.addMethod("regxA2", function (value, element, regexpr) {
		  return regexpr.test(value);
		}, "Please enter a valid TAN Number.");
	
		$.validator.addMethod("regxA4", function (value, element, regexpr) {
		  return regexpr.test(value);
		}, "It should be www.abcd.com");
	
		$.validator.addMethod("regxA8", function (value, element, regexpr) {
		  return regexpr.test(value);
		}, "Please enter the valid CIN");
	
		jQuery.validator.setDefaults({
		  debug: true,
		  success: "valid"
		});
		$("#userInfo").validate({
		  rules: {
			firstname: {
			  required: true,
			  regxA1: /^[A-Za-z][A-Za-z0-9\-\s]/,
			},
			groupName: {
			  required: true,
			  regxA5: /^[A-Za-z][A-Za-z0-9\-\s]/,
			},
			TAN: {
			  required: true,
			  regxA2: /^[A-Za-z]{4}[0-9]{5}[A-Za-z]$/,
			},
			website: {
			  required: true,
			  regxA4: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/,
			},
			companyEmail: {
			  required: true
			},
			CIN: {
			  required: true,
			  regxA8: /^([L|U]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/,
			},
		  },
		  errorPlacement: function (error, element) {
			if (element.attr("name") === "firstname") {
			  error.insertAfter("#firstname");
			}
			if (element.attr("name") === "groupName") {
			  error.insertAfter("#groupName");
			}
			if (element.attr("name") === "companyEmail") {
			  error.insertAfter("#companyEmail");
			}
			if (element.attr("name") === "TAN") {
			  error.insertAfter("#TAN");
			}
			if (element.attr("name") === "website") {
			  error.insertAfter("#website");
			}
			if (element.attr("name") === "CIN") {
			  error.insertAfter("#CIN");
			}
		  }
		});
	  }

	render() {
		if (this.props.userNot) {
			return (
				<div>
					<div className="modal modalHide" id={"editNotifyModal-" + this.props.userNot} role="dialog" >
						<div className="modal-dialog modal-lg " role="document">
							<div className="modal-content modalContent ummodallftmg ummodalmfdrt col-lg-12 ">
								<div className="modal-header userHeader">
									<button type="button" className="close" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
									<h4 className="modal-title " id="exampleModalLabel">Add New User</h4>
								</div>
								<div className="modal-body">
									<div className="hideModal">
										<div className="">
											<div className="">
												<div className="">
													<section className="">
														<div className="box-body textAlignLeft">
															<div className="">

																<form id="signUpUser">
																	<div className="signuppp col-lg-12 col-md-12 col-sm-12 col-xs-12 createusr ">

																		<div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
																			<label className="formLable ">First Name <label className="requiredsign">*</label></label>
																			<span className="blocking-span">
																				<div className="input-group inputBox-main  new_inputbx " >
																					<div className="input-group-addon remove_brdr inputIcon">
																						<i className="fa fa-user-circle fa "></i>
																					</div>
																					<input type="text" style={{ textTransform: 'capitalize' }}
																						className="form-control UMname inputText form-control  has-content"
																						id="firstname" ref="firstname" name="firstname" placeholder="First Name" />
																				</div>
																			</span>
																		</div>
																		<div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
																			<label className="formLable">Last Name <label className="requiredsign">*</label></label>
																			<span className="blocking-span row">
																				<div className="input-group inputBox-main  new_inputbx " >
																					<div className="input-group-addon remove_brdr inputIcon">
																						<i className="fa fa-user-circle fa "></i>
																					</div>
																					<input type="text" className="form-control UMname inputText form-control  has-content"
																						id="lastname" ref="lastname" name="lastname" placeholder="Last Name" />
																				</div>
																			</span>
																		</div>
																	</div>
																	<div className="signuppp col-lg-12 col-md-12 col-sm-12 col-xs-12 createusr">
																		<div className=" col-lg-6 col-md-6 col-xs-12 col-sm-12 inputContent">
																			<label className="formLable">Email ID <label className="requiredsign">*</label></label>
																			<span className="blocking-span col-lg-12 col-md-12 col-xs-12 col-sm-12 emailfixdomain">
																				<div className="input-group inputBox-main   " >
																					<div className="input-group-addon remove_brdr inputIcon">
																						<i className="fa fa-envelope-square"></i>
																					</div>

																					<input type="text" className="formFloatingLabels form-control  newinputbox"
																						ref="signupEmail" name="signupEmail" id="signupEmail" placeholder="Email" />
																				</div>
																			</span>
																		</div>

																		<div className=" col-lg-6 col-md-6 col-xs-12 col-sm-6 inputContent">
																			<label className="formLable">Mobile Number <label className="requiredsign">*</label></label>
																			<span className="blocking-span row">
																				<div className="input-group inputBox-main  new_inputbx " >
																					<div className="input-group-addon remove_brdr inputIcon">
																						<i className="fa fa-mobile"></i>
																					</div>
																					<InputMask mask="99999-99999" pattern="^(0|[1-9][0-9-]*)$"
																						className="form-control UMname inputText form-control  has-content"
																						ref="mobNumber" name="mobNumber" id="mobNumber" placeholder="Mobile No" />
																				</div>
																			</span>
																		</div>
																	</div>
																	<div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
																		<input className="col-lg-2 col-md-2 col-xs-12 col-sm-12 col-xs-12 pull-right btn btnSubmit topMargin outlinebox" type="submit" value="Register" />
																	</div>
																</form>

															</div>
														</div>

													</section>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

						</div>
					</div>

				</div>
			);
		} else {
			return (<div></div>);
		}
	}

}
export default UsereditModal;