import React, { Component } from 'react';
import PhoneInput from 'react-phone-input-2';
import axios from 'axios';
import swal from 'sweetalert';
import $ from "jquery";
import { withRouter ,Link} from 'react-router-dom';
import S3FileUpload from 'react-s3';
import "./userManagement.css";
class EditUserProfile extends Component {
	constructor(props) {
		super(props);
		var UserId = this.props.match.params.id;
		this.state = {
			UserId: UserId,
			fullname: "",
			username: "",
			mobNumber: "",
			profileImage: "",
			firstName: "",
			lastName: "",
			centerName: "",
			"resetPassword": "",
			"resetPasswordConfirm": "",
		}
		this.handleChange = this.handleChange.bind(this);
	}

	isNumberKey(event)
	   {

	   var charCode = (event.which) ? event.which : event.keyCode

	   if (charCode > 31 && (charCode < 48 || charCode > 57)  && (charCode < 96 || charCode > 105))
	   {
	    event.preventDefault();
	      return false;
	    }
	    else{
	      return true;
	    }
	  }

	handleSubmit(event) {
		event.preventDefault();
		if ($('#editUser').valid()) {
			var userid = this.state.UserId;
			var formvalues = {
				"firstname": this.refs.firstName.value,
				"lastname": this.refs.lastName.value,
				"mobNumber": this.state.mobNumber,
				"image": this.state.profileImage,
				// "companyID" :"1"
			}
			var fullname = this.refs.firstName.value+' '+this.refs.lastName.value
			var profileImg = this.state.profileImage

            localStorage.setItem("fullname", fullname);
            localStorage.setItem("profileImg", profileImg);

			console.log("image formvalues==>", formvalues)
			axios.patch('/api/users/patch/profile/' + userid, formvalues)
				.then((response) => {
						console.log('response',response);
					if (response.data="USER_UPDATED") {
						swal({
							title: " ",
							text: "User updated successfully",
						});
						this.props.history.push('/dashboard');
						window.location.reload();
                    }else{
					// updated : false
					swal({
							title: " ",
							text: "User not modified",
						});

                    }
				})
				.catch((error) => {});
		}
	}

	changepassword(event) {
		event.preventDefault();
		var id = this.state.UserId;
		var password = this.state.resetPassword;
		var conPassword = this.state.resetPasswordConfirm;
		var formValues = {
			"pwd": conPassword,
		}
		console.log('password', password, 'conPassword', conPassword);
		var newID = $(event.currentTarget).attr('data-email');
		if (newID) {
			var resetPassword = newID;
		}
		console.log('valid');
		if (password && conPassword) {
			if (password === conPassword) {
				if (password.length >= 6) {
				axios.patch('/api/auth/patch/change_password_withoutotp/id/' + id, formValues)
					.then((res) => {
						axios.get('/api/users/get/' + id)
						.then((res) => {
							swal({
								title: " ",
								text: res.data.firstname+"'s"+" password has been changed successfully!!",
							}).then((success) => {
								if (success) {
									 window.location.reload();
								}
							})
							var modalid = "RestpwdModal";
							var modal = document.getElementById(modalid);
							modal.style.display = "none";
							$('.modal-backdrop').remove();
						})
						.catch((error) => {});
					
					})
					.catch((error) => {
						swal({
							title: "",
							text: "Sorry! Something went wrong",
						});
						var modalid = "RestpwdModal";
						var modal = document.getElementById(modalid);
						modal.style.display = "none";
						$('.modal-backdrop').remove();

					});
				} else {
					swal(" ", "Password should be at least 6 characters long");
				}
			} else {

				swal({
					title: " ",
					text: "Passwords don't match",
				});
			}
		} else {
			this.setState({
				"resetPasswordError": "This field is required.",
				"resetPasswordConfirmError": "This field is required.",
			})
		}

	}

	resetPasswordField(event) {
		event.preventDefault()
		var id = $(event.currentTarget).attr('data-id');
		this.setState({
			'resetPassword': '',
			'resetPasswordConfirm': '',
		})
		$("#RestpwdModal").validate().resetForm();
	}
	resetPasswordChange(event) {
		var name = event.target.name;
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			if (this.state[name]) {
				this.setState({
					[name + "Error"]: ""
				})
			} else {
				this.setState({
					[name + "Error"]: "This field is required."
				})
			}
		})
	}

	showSignPass() {
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('.eye').attr('type', 'text');
	}
	hideSignPass() {
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('.eye').attr('type', 'password');
	}
	showSignPassC() {
		$('.showPwdC').toggleClass('showPwd1C');
		$('.hidePwdC').toggleClass('hidePwd1C');
		return $('.eye').attr('type', 'text');
	}
	hideSignPassC() {
		$('.showPwdC').toggleClass('showPwd1C');
		$('.hidePwdC').toggleClass('hidePwd1C');
		return $('.eye').attr('type', 'password');
	}

	handleChange(event) {
		const target = event.target.value;
		const name = event.target.name;
		this.setState({
			[name]: target,
		}, () => {
		})
	}

	componentDidMount() {
		var userid = this.state.UserId;
		axios.get('/api/users/get/' + userid)
			.then((res) => {
				console.log("res.data.image==>", res);
				this.setState({
					firstName: res.data.firstname,
					lastName: res.data.lastname,
					username: res.data.email,
					mobNumber: res.data.mobile,
					profileImage: res.data.image,
					companyID: res.data.companyID
				})
			})
			.catch((error) => {
			});
	}
	imgBrowse(event) {
		event.preventDefault();
		var profileImage = "";
		if (event.currentTarget.files && event.currentTarget.files[0]) {
			var file = event.currentTarget.files[0];
			console.log("file==>", file);
			if (file) {
				var fileName = file.name;
				console.log("fileName==>", fileName);
				var ext = fileName.split('.').pop();
				if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "JPG" || ext === "PNG" || ext === "JPEG") {
					if (file) {
						var objTitle = { fileInfo: file }
						profileImage = objTitle;

					} else {
						console.log("not==>");
						swal("Images not uploaded");
					}//file
				} else {
					console.log("format==>");
					swal("Allowed images formats are (jpg,png,jpeg)");
				}//file types
			}//file
			if (event.currentTarget.files) {
				main().then(formValues => {
					var profileImage = this.state.profileImage;
					//   for(var k = 0; k < formValues.length; k++){
					profileImage = formValues.profileImage
					//   }

					this.setState({
						profileImage: profileImage
					})
				});
				async function main() {
					var formValues = [];
					// for(var j = 0; j < profileImage.length; j++){
					var config = await getConfig();
					var s3url = await s3upload(profileImage.fileInfo, config, this);
					const formValue = {
						"profileImage": s3url,
						"status": "New"
					};
					formValues = formValue;
					// }
					return Promise.resolve(formValues);
				}
				function s3upload(image, configuration) {
					return new Promise(function (resolve, reject) {
						S3FileUpload
							.uploadFile(image, configuration)
							.then((Data) => {
								resolve(Data.location);
							})
							.catch((error) => {
							})
					})
				}
				function getConfig() {
					return new Promise(function (resolve, reject) {
						axios
							.get('/api/projectsettings/get/S3')
							.then((response) => {
								const config = {
									bucketName: response.data.bucket,
									dirName: 'propertiesImages',
									region: response.data.region,
									accessKeyId: response.data.key,
									secretAccessKey: response.data.secret,
								}
								resolve(config);
							})
							.catch(function (error) {})
					})
				}
			}
		}
	}
	render() {
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="formWrapper">
						<section className="content">
							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
									<div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
										My Profile
									</div>
									<div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
									{/* <button onClick={this.handleSubmit.bind(this)} className="col-lg-4 col-sm-4 col-xs-2 col-md-2 btn resetBtn resetBtncss pull-right">Reset Password</button> */}
										<div className="pull-right" data-toggle="modal" aria-labelledby="myModals" data-target="#myModals" aria-hidden="true">
											<div data-toggle="modal" data-target="#RestpwdModal"aria-expanded="false">
												<p className="btn btnhvr btn-Profile ">Reset Password</p>
											</div>
										</div>
									</div>
								</div>
								<hr className="hr-head container-fluid row" />
								<div className="box-body">
									<div className="row">
										<form id="editUser">
											<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
												<div className="col-lg-2 col-sm-2 col-xs-12 col-md-12 form-margin">
													<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">Profile Photo <label className="requiredsign">&nbsp;</label></label>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profilelogos" id="ProfileImageUpOne">
															{/* <div className="" style={{"backgroundImage":`url(`+ (this.state.profileImage ? this.state.profileImage : "/images/person.png")+`)`, "height": "100%", "backgroundSize":"100% 100%"}}></div> */}
															<img className="profileimg" src={this.state.profileImage ? this.state.profileImage : "/images/person.png"} ></img>
															<input multiple onChange={this.imgBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="Upload/Change Image for SuperAdmin profile picture." name="profileImage" />
														</div>
													</div>
												</div>
												<div className="col-lg-9 col-sm-9 col-xs-12 col-md-12 NOpadding">
													<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">
														<div className="form-margin col-lg-6 col-md-6 col-xs-6 col-sm-6">
															<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">First Name <label className="requiredsign">*</label></label>
															<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="firstNameErr">
																<input type="text" style={{ textTransform: 'capitalize' }}
																	className="form-control"
																	id="firstName" ref="firstName" name="firstName" value={this.state.firstName} onChange={this.handleChange} placeholder="First Name" required/>
															</div>
														</div>
														<div className="form-margin col-lg-6 col-md-6 col-xs-6 col-sm-6">
															<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">Last Name <label className="requiredsign">*</label></label>
															<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="lastNameErr">
																<input type="text" className="form-control"
																	id="lastName" ref="lastName" name="lastName" value={this.state.lastName} onChange={this.handleChange} placeholder="Last Name" required/>
															</div>
														</div>
													</div>
													<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">
														<div className="form-margin col-lg-6 col-md-6 col-xs-6 col-sm-6">
															<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">Username/Email <label className="requiredsign">*</label></label>
															<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="usernameErr">
																<input type="text" disabled value={this.state.username} onChange={this.handleChange} className="form-control" ref="username" name="username" required />
															</div>
														</div>
														<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
															<label >Mobile Number <span className="requiredsign">*</span></label>
															<input type="tel" minlength="10" maxlength="11" required pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" onKeyDown={this.isNumberKey.bind(this)} className="formFloatingLabels form-control  newinputbox" ref="mobNumber" name="mobNumber" id="mobNumber" data-text="mobNumber" onChange={this.handleChange} value={this.state.mobNumber}
																placeholder="Mobile Number" />
														</div>
														<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
															<label>Company ID <span className="requiredsign">*</span></label>
															<input type="text" disabled className="formFloatingLabels form-control  newinputbox" ref="companyID" name="companyID" id="companyID" data-text="companyID" onChange={this.handleChange} value={this.state.companyID}
																placeholder="Company ID" />
														</div>
													</div>
												</div>
												<div className="form-margin col-lg-12 col-sm-12 col-xs-12 col-md-12 pull-right">
													<button onClick={this.handleSubmit.bind(this)} className="col-lg-2 col-sm-2 col-xs-2 col-md-2 btn resetBtn pull-right">Update</button>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</section>
					</div>
				</div>
				<div className="modal modalHide passwordModal" id="RestpwdModal" role="dialog" aria-labelledby="exampleModalLabel1" aria-hidden="true">
					<div className="modal-dialog" role="document">
						<div className="modal-content  ummodallftmg">
							<div className="modal-header adminModal-header userHeader">
								<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.resetPasswordField.bind(this)} >&times;</button>
								<h4 className="modal-title" id="exampleModalLabel1">Reset Password</h4>
							</div>
							<div className="modal-body row">
								<div className="">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
										<div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<form id='resetPassword' >
												<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
													<div className="col-lg-6 col-md-6  col-xs-12 col-sm-12 ">
														<div className="form-group textAlignLeft col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
															<label className="">New Password <span className="requiredsign">&nbsp;*</span></label>
															<input type="password" value={this.state.resetPassword} onChange={this.resetPasswordChange.bind(this)} className="form-control marBtm eye" ref="resetPassword" name="resetPassword" id="resetPassword" autoComplete="off" />
															<div className="showHideSignDiv showHideEye">
																<i className="fa fa-eye showPwd showEyeupSign" aria-hidden="true" onClick={this.showSignPass.bind(this)}></i>
																<i className="fa fa-eye-slash hidePwd hideEyeSignup " aria-hidden="true" onClick={this.hideSignPass.bind(this)}></i>
															</div>
															<label className="error">{this.state.resetPasswordError}</label>
														</div>
													</div>
													<div className="col-lg-6 col-md-6  col-xs-12 col-sm-12 ">
														<div className="form-group textAlignLeft  col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
															<label className=""> Confirm Password <span className="requiredsign">&nbsp;*</span></label>
															<input type="password" value={this.state.resetPasswordConfirm} onChange={this.resetPasswordChange.bind(this)} className="form-control marBtm eye" ref="resetPasswordConfirm" name="resetPasswordConfirm" id="resetPasswordConfirm" autoComplete="off" />
															<div className="showHideSignDiv showHideEye">
																<i className="fa fa-eye showPwd showEyeupSign" aria-hidden="true" onClick={this.showSignPass.bind(this)}></i>
																<i className="fa fa-eye-slash hidePwd hideEyeSignup " aria-hidden="true" onClick={this.hideSignPass.bind(this)}></i>
															</div>
															<label className="error">{this.state.resetPasswordConfirmError}</label>
														</div>
													</div>
													<div className="submitButtonWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<button className="btn  resetBtn pull-right  col-lg-4 col-lg-offset-3 col-md-6 col-sm-12 col-xs-12" onClick={this.changepassword.bind(this)} >Reset Password</button>
													</div>
												</div>
											</form>
										</div>
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

export default EditUserProfile;


