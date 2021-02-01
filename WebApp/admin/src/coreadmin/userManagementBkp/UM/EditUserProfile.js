import React, { Component } from 'react';
import PhoneInput from 'react-phone-input-2';
import axios from 'axios';
import swal from 'sweetalert';
import $ from 'jquery';
import jQuery from 'jquery';
import "./userManagement.css";
// import PlacesAutocomplete, {
// 	geocodeByAddress,
// 	getLatLng
// } from "react-places-autocomplete";
import PersonMaster from '../../Master/PersonMaster/PersonMaster.js';
var entity = ""
class EditUserProfile extends Component {
	constructor(props) {
		super(props);
		var UserId = this.props.match.params.id;

		this.state = {
			UserId: UserId,
			fullname: "",
			username: "",
			mobNumber: "",
			userProfile: "",
			firstName: "",
			lastName: "",
			entity : entity,
			centerName: "",
			user: "user",
			// gmapsLoaded: false,
		}
		this.handleChange = this.handleChange.bind(this);
	}

	// initMap = () => {
 //      this.setState({
 //        gmapsLoaded: true,
 //      })
 //    }
	componentDidMount() {
	// window.initMap = this.initMap
 //    const gmapScriptEl = document.createElement(`script`)
 //    gmapScriptEl.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCrzFPcpBm_YD5DfBl9zJ2KwOjiRpOQ1lE&libraries=places&callback=initMap`
 //    document.querySelector(`body`).insertAdjacentElement(`beforeend`, gmapScriptEl)

		this.getDepartment();
		this.userdata();
		this.getDesignation();
		var role = [];
			var getCompany_Id = localStorage.getItem("company_Id")
			var getcompanyID = localStorage.getItem("companyID")
			var companyName = localStorage.getItem("companyName")
			role.push(localStorage.getItem("roles"));
			this.setState({
			listOfRoles: role,
			})
			if (role.indexOf("admin") == -1) {
				this.setState({
					companyID: getcompanyID,
					corporate_Id: getCompany_Id,
					corporate: companyName
				}, () => {
					this.getEntityLocation(getCompany_Id);
				})
			}

			
		const firstnameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
		const lastnameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
		const mobileRegex = RegExp(/^[0-9][0-9]{9}$|^$/);
		const emailRegex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/);
		$.validator.addMethod("regxCenter", function (value, element, regexpr) {
			return value !== regexpr;
		}, "This field is required.");
		$.validator.addMethod("regxEmail", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter a valid email address.");
		$.validator.addMethod("regxMobile", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter a valid mobile number.");
		$.validator.addMethod("regxName", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "It should only contain alphabets.");
		$("#editUser").validate({
			rules: {
				firstName: {
					required: true,
					regxName: firstnameRegex
				},
				lastName: {
					required: true,
					regxName: lastnameRegex
				},
				username: {
					required: true,
					regxEmail: emailRegex
				}
			},
			errorPlacement: function (error, element) {
				if (element.attr("name") === "firstName") {
					error.insertAfter("#firstNameErr");
				}
				if (element.attr("name") === "lastName") {
					error.insertAfter("#lastNameErr");
				}
				if (element.attr("name") === "username") {
					error.insertAfter("#usernameErr");
				}
			}
		});

	}
	componentWillReceiveProps(nextProps){
		this.userdata();
	}
	userdata(){
		var userid = this.state.UserId;
		axios.get('/api/users/get/' + userid)
			.then((res) => {
				this.setState({
					firstName: res.data.firstname,
					lastName: res.data.lastname,
					username: res.data.email,
					mobNumber: res.data.mobile,
					department: res.data.department,
					designation: res.data.designation,
					cityName: res.data.city,
					role: res.data.role,
					states: res.data.states,
					companyID: res.data.companyID,
					companyName: res.data.companyName,
				},()=>{
					if(this.state.role.indexOf("driver") >= 0){
							var entity = "driver";
							var myJSON = JSON.stringify(entity);
							this.setState({
								entity: myJSON,
								userdetails : res.data
							},()=>{
								console.log("this.state.entity driver===>",this.state.entity);
							})
					}else{
						var entity = "employee";
						var myJSON = JSON.stringify(entity);
						this.setState({
							entity: myJSON,
							userdetails : res.data
						},()=>{
							console.log("this.state.entity emp===>",this.state.entity);
						})
					}
				})
			})
			.catch((error) => {});
		
	}
	handleSubmit(event) {
		if ($('#editUser').valid()) {
			var userid = this.state.UserId;
			var formvalues = {
				"firstname": this.refs.firstName.value,
				"lastname": this.refs.lastName.value,
				"mobNumber": (this.state.mobNumber).replace("-", ""),
				"department": this.state.department,
				"designation": this.state.designation,
				"cityName": this.state.cityName,
				"states": this.state.states,
				"companyID": this.state.companyID,
				"companyName": this.state.companyName,
			}
			axios.patch('/api/users/patch/' + userid, formvalues)
				.then((response) => {
						this.updatePerson();
				})
				.catch((error) => {
					// window.location = '/dashboard';
				});
		}
	}
	backtoum() {
		this.props.history.push("/umlistofusers")
	}
	getDepartment() {
		axios.get("/api/departmentmaster/get/list")
			.then((response) => {
				// console.log("departmentArray==>",response.data)
				this.setState({
					departmentArray: response.data
				})
			})
			.catch((error) => {
			})
	}
	getDesignation() {
		axios.get("/api/designationmaster/get/list")
			.then((response) => {
				// console.log("designationArray==>",response.data)
				this.setState({
					designationArray: response.data
				})
			})
			.catch((error) => {
			})
	}
	handleChange(event) {
		const target = event.target.value;
		const name = event.target.name;
		this.setState({
			[name]: target,
		}, () => {
		})
	}

	render() {
		const searchOptions = {
			types: ['(cities)'],
			componentRestrictions: { country: "in" }
		}
		console.log("this.state.entity===>",this.state.entity);
		console.log("this.state.entity===>",this.state.userdetails);
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="formWrapper">
						<section className="content">
							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
								<div className="col-lg-10 col-md-10 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
									Edit User Data
								</div>
								<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 " id="rolemodalcl">
									<button type="button" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 addexamform userbtn clickforhideshow"
										onClick={this.backtoum.bind(this)}>
										<i className="fa fa-undo" aria-hidden="true"></i>
										<b>&nbsp;&nbsp; Back To UM List</b>
									</button>
								</div>
								<hr className="hr-head container-fluid row" />
								<div className="box-body">
									<div className="row">
										<form id="editUser">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<PersonMaster userdetails={this.state.userdetails} userdets={this.state.user} entity="employee" />
											</div>

											{/* <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
												<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">
													<div className="form-margin col-lg-6 col-md-6 col-xs-6 col-sm-6">
														<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">First Name <label className="requiredsign">*</label></label>
														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="firstNameErr">
															<input type="text" style={{ textTransform: 'capitalize' }}
																className="form-control"
																id="firstName" ref="firstName" name="firstName" value={this.state.firstName} onChange={this.handleChange} placeholder="First Name" />
														</div>
													</div>
													<div className="form-margin col-lg-6 col-md-6 col-xs-6 col-sm-6">
														<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">Last Name <label className="requiredsign">*</label></label>
														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="lastNameErr">
															<input type="text" className="form-control"
																id="lastName" ref="lastName" name="lastName" value={this.state.lastName} onChange={this.handleChange} placeholder="Last Name" />
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
													<div className="form-margin col-lg-6 col-sm-6 col-xs-6 col-md-6">
														<label className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding">Mobile Number <label className="requiredsign">*</label></label>
														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 NOpadding" id="mobNumberErr">
															<PhoneInput
																country={'in'}
																value={this.state.mobNumber}
																name="mobNumber"
																inputProps={{
																	name: 'mobNumber',
																	required: true
																}}
																onChange={mobNumber => { this.setState({ mobNumber }) }}
															/>
														</div>

													</div>
													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
														<label>Company ID <span className="requiredsign">*</span></label>
														<input type="text" className="form-control UMname  has-content"
															id="companyID" ref="companyID" name="companyID" data-text="companyID" onChange={this.handleChange}
															value={this.state.companyID} placeholder="company ID" />
													</div>
													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
														<label>Company Name <span className="requiredsign">*</span></label>
														<input type="text"
															className="form-control UMname  has-content"
															id="companyName" ref="companyName"
															name="companyName" data-text="companyName"
															onChange={this.handleChange} disabled
															value={this.state.companyName} placeholder="company Name"
														/>
													</div>
													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box " >
														<label >Department <span className="requiredsign">*</span></label>
														<div className="input-group col-lg-12 col-md-12 col-xs-12 col-sm-12" id="department">
															<select className="form-control " value={this.state.department} onChange={this.handleChange} ref="department" id="department" name="department" data-text="department">
																<option hidden> --Select-- </option>
																{
																	this.state.departmentArray && this.state.departmentArray.length > 0 ?
																		this.state.departmentArray.map((data, index) => {
																			return (
																				<option key={index} value={data.department}>{data.department}</option>
																			);
																		})
																		:
																		<option value='user'>User</option>
																}
															</select>
														</div>
													</div>
													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box " >
														<label > Designation <span className="requiredsign">*</span></label>
														<div className="input-group col-lg-12 col-md-12 col-xs-12 col-sm-12" id="designation">
															<select className="form-control " value={this.state.designation} onChange={this.handleChange} ref="designation" id="designation" name="designation" data-text="designation">
																<option hidden> --Select-- </option>
																{
																	this.state.designationArray && this.state.designationArray.length > 0 ?
																		this.state.designationArray.map((data, index) => {
																			return (
																				<option key={index} value={data.designation}>{data.designation}</option>
																			);
																		})
																		:
																		<option value='user'>User</option>
																}
															</select>
														</div>
													</div>
													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box " >
														<label >City</label>
														<PlacesAutocomplete
															value={this.state.cityName}
															onChange={this.handleChangePlaces}
															onSelect={this.handleSelectLocation}
															searchOptions={searchOptions}>
															{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
																<div>
																	<input
																		{...getInputProps({
																			placeholder: 'Search Cities ...',
																			className: 'location-search-input col-lg-12 form-control',
																		})}
																	/>
																	<div className="autocomplete-dropdown-container">
																		{loading && <div>Loading...</div>}
																		{suggestions.map(suggestion => {
																			const className = suggestion.active
																				? 'suggestion-item--active'
																				: 'suggestion-item';
																			const style = suggestion.active
																				? { backgroundColor: '#fafafa', cursor: 'pointer' }
																				: { backgroundColor: '#ffffff', cursor: 'pointer' };
																			return (
																				<div
																					{...getSuggestionItemProps(suggestion, {
																						className,
																						style,
																					})}
																				>
																					<span>{(suggestion.description ? suggestion.description.split(",")[0] : "")}</span>

																				</div>
																			);
																		})}
																	</div>
																</div>
															)}
														</PlacesAutocomplete>
													</div>
													<div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
														<label>State </label>
														<input type="text"
															className="form-control"
															id="states" ref="states"
															name="states" data-text="states"
															onChange={this.handleChange} disabled
															value={this.state.states} placeholder="State Name"
														/>
													</div>
												</div>
												<div className="form-margin col-lg-12 col-sm-12 col-xs-12 col-md-12 pull-right">
													<button onClick={this.handleSubmit.bind(this)} className="col-lg-2 col-sm-2 col-xs-2 col-md-2 btn resetBtn pull-right">Update</button>
												</div>
											</div> */}

										</form>

									</div>

								</div>
							</div>
						</section>
					</div>
				</div>
			</div>
		);
	}
}

export default EditUserProfile;
















// import React, { Component } from 'react';
// import PhoneInput from 'react-phone-input-2';
// import axios from 'axios';
// import swal from 'sweetalert';
// import $ from 'jquery';
// import jQuery from 'jquery';
// import S3FileUpload from 'react-s3';
// import moment from 'moment';
// import "./userManagement.css";
// import PlacesAutocomplete, {
// 	geocodeByAddress,
// 	getLatLng
// } from "react-places-autocomplete";
// import PersonMaster from '../../Master/PersonMaster/PersonMaster.js';
// class EditUserProfile extends Component {
// 	constructor(props) {
// 		super(props);
// 		var UserId = this.props.match.params.id;

// 		this.state = {
// 			UserId: UserId,
// 			fullname: "",
// 			username: "",
// 			mobNumber: "",
// 			userProfile: "",
// 			firstName: "",
// 			lastName: "",
// 			// role : "employee",
// 			centerName: "",
// 			user: "user",
// 		}
// 		this.handleChange = this.handleChange.bind(this);
// 	}
// 	// componentDidMount() {
// 	// 	this.getEntity();
// 	// 	this.getElementByIds();
// 	// 	this.getDesignation();
// 	// 	this.getDepartment();
// 	// 	this.getCompany();
// 	// 	this.getDriverData();
// 	// 	this.dynamicvalidation();
// 	// 	this.setState({
// 	// 	  personID: this.props.match.params.fieldID,
// 	// 	}, () => {
// 	// 	  this.edit();
// 	// 	})
// 	// 	var role = [];
// 	// 	var getCompany_Id = localStorage.getItem("company_Id")
// 	// 	var getcompanyID = localStorage.getItem("companyID")
// 	// 	var companyName = localStorage.getItem("companyName")
// 	// 	role.push(localStorage.getItem("roles"));
// 	// 	this.setState({
// 	// 		listOfRoles: role,
// 	// 	})
// 	// 	if (role.indexOf("admin") == -1) {
// 	// 		this.setState({
// 	// 			companyID: getcompanyID,
// 	// 			corporate_Id: getCompany_Id,
// 	// 			corporate: companyName
// 	// 		}, () => {
// 	// 			this.getEntityLocation(getCompany_Id);
// 	// 		})
// 	// 	}


// 	// 	const firstnameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
// 	// 	const lastnameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
// 	// 	const mobileRegex = RegExp(/^[0-9][0-9]{9}$|^$/);
// 	// 	const emailRegex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/);
// 	// 	$.validator.addMethod("regxCenter", function (value, element, regexpr) {
// 	// 		return value !== regexpr;
// 	// 	}, "This field is required.");
// 	// 	$.validator.addMethod("regxEmail", function (value, element, regexpr) {
// 	// 		return regexpr.test(value);
// 	// 	}, "Please enter a valid email address.");
// 	// 	$.validator.addMethod("regxMobile", function (value, element, regexpr) {
// 	// 		return regexpr.test(value);
// 	// 	}, "Please enter a valid mobile number.");
// 	// 	$.validator.addMethod("regxName", function (value, element, regexpr) {
// 	// 		return regexpr.test(value);
// 	// 	}, "It should only contain alphabets.");
// 	// 	$("#editUser").validate({
// 	// 		rules: {
// 	// 			firstName: {
// 	// 				required: true,
// 	// 				regxName: firstnameRegex
// 	// 			},
// 	// 			lastName: {
// 	// 				required: true,
// 	// 				regxName: lastnameRegex
// 	// 			},
// 	// 			username: {
// 	// 				required: true,
// 	// 				regxEmail: emailRegex
// 	// 			}
// 	// 		},
// 	// 		errorPlacement: function (error, element) {
// 	// 			if (element.attr("name") === "firstName") {
// 	// 				error.insertAfter("#firstNameErr");
// 	// 			}
// 	// 			if (element.attr("name") === "lastName") {
// 	// 				error.insertAfter("#lastNameErr");
// 	// 			}
// 	// 			if (element.attr("name") === "username") {
// 	// 				error.insertAfter("#usernameErr");
// 	// 			}
// 	// 		}
			
// 	// 	});
// 	// 	if (this.state.entity === "driver") {
// 	// 		$(".person").hide();
// 	// 		$(".driver").show();
// 	// 	  }
// 	// 	  if (this.state.entity === "employee") {
// 	// 		$(".person").hide();
// 	// 		$(".employee").show();
// 	// 	  }
// 	// 	  this.edit();
// 	// 	  this.handleChange = this.handleChange.bind(this);

		

// 	// }
// 	componentWillReceiveProps(next) {
// 		this.userdata();
// 	}

// 	userdata() {
// 		var userid = this.state.UserId;
// 		axios.get('/api/users/get/' + userid)
// 			.then((res) => {
// 				this.setState({
// 					firstName: res.data.firstname,
// 					lastName: res.data.lastname,
// 					username: res.data.email,
// 					mobNumber: res.data.mobile,
// 					department: res.data.department,
// 					designation: res.data.designation,
// 					cityName: res.data.city,
// 					role: res.data.role,
// 					states: res.data.states,
// 					companyID: res.data.companyID,
// 					companyName: res.data.companyName,
// 				}, () => {
// 					if (this.state.role.indexOf("driver") >= 0) {
// 						var entity = "driver";
// 						// var myJSON = JSON.stringify(entity);
// 						this.setState({
// 							entity: entity,
// 							userdetails: res.data
// 						})
// 					} else {
// 						var entity = "corporate";
// 						// var myJSON = JSON.stringify(entity);
// 						this.setState({
// 							entity: entity,
// 							userdetails: res.data
// 						})
// 					}
// 				})
// 			})
// 			.catch((error) => { });
// 	}
// 	handleSubmit(event) {
// 		if ($('#editUser').valid()) {
// 			var userid = this.state.UserId;
// 			var formvalues = {
// 				"firstname": this.refs.firstName.value,
// 				"lastname": this.refs.lastName.value,
// 				"mobNumber": (this.state.mobNumber).replace("-", ""),
// 				"department": this.state.department,
// 				"designation": this.state.designation,
// 				"cityName": this.state.cityName,
// 				"states": this.state.states,
// 				"companyID": this.state.companyID,
// 				"companyName": this.state.companyName,
// 			}
// 			axios.patch('/api/users/patch/' + userid, formvalues)
// 				.then((response) => {
// 					this.updatePerson();
// 				})
// 				.catch((error) => {
// 					// window.location = '/dashboard';
// 				});
// 		}
// 	}
// 	backtoum() {
// 		this.props.history.push("/umlistofusers")
// 	}



// 	componentDidMount() {
// 		this.userdata();
// 		var role = [];
// 		var getCompany_Id = localStorage.getItem("company_Id")
// 		var getcompanyID = localStorage.getItem("companyID")
// 		var companyName = localStorage.getItem("companyName")
// 		role.push(localStorage.getItem("roles"));
// 		this.setState({
// 		  listOfRoles: role,
// 		})
// 		if (role.indexOf("admin") == -1) {
// 		  this.setState({
// 			companyID: getcompanyID,
// 			corporate_Id: getCompany_Id,
// 			corporate: companyName
// 		  }, () => {
// 			this.getEntityLocation(getCompany_Id);
// 		  })
// 		}
	
// 		this.getEntity();
// 		this.getElementByIds();
// 		this.getDesignation();
// 		this.getDepartment();
// 		this.getCompany();
// 		this.getDriverData();
// 		this.dynamicvalidation();
// 		this.setState({
// 		  personID: this.props.match.params.fieldID,
// 		}, () => {
// 		  this.edit();
// 		})
// 	  }





	
// 	  getElementByIds(){
// 		var listOfEmpID = [];
// 		var listOfEmpEmail = [];
// 		var formvalues = { type :this.state.entity}
// 		axios.post("/api/personmaster/get/list",formvalues)
// 			.then((response) => {
// 				this.setState({
// 					personListID   : response.data,
// 				})
// 				for(let i=0;i<this.state.personListID.length;i++)
// 				{
// 					listOfEmpID.push(this.state.personListID[i].employeeId)
// 					listOfEmpEmail.push(this.state.personListID[i].email)
// 				}
// 				this.setState({
// 					listOfEmpID:listOfEmpID,
// 					listOfEmpEmail:listOfEmpEmail
// 				},()=>{
// 				})
// 			})
// 			.catch((error) => {
// 			})
// 	  }
// 	  dynamicvalidation(){
// 		if (this.state.entity === "driver") {
// 			$(".person").hide();
// 			$(".driver").show();
// 			$.validator.addMethod("regxEmail", function (value, element, regexpr) {
// 				return regexpr.test(value);
// 			}, "Please enter valid Email Id");
// 			$.validator.addMethod("regxLicenseNumber", function (value, element, regexpr) {
// 				return regexpr.test(value);
// 			}, "Please enter valid License Number");
// 			$.validator.addMethod("regxvendor", function (value, element, arg) {
// 				return arg !== value;
// 			}, "Please select the corporate");
// 			$.validator.addMethod("regxcontry", function (value, element, arg) {
// 				return arg !== value;
// 			}, "Please select the country");
	
// 			jQuery.validator.setDefaults({
// 				debug: true,
// 				success: "valid"
// 			});
// 			$("#BasicInfo").validate({
// 				rules: {
	
// 					corporate: {
// 						required: true,
// 						regxvendor: "-- Select --"
// 					},
// 					workLocation: {
// 						required: true
// 					},
// 					firstName: {
// 						required: true
// 					},
// 					middleName: {
// 						required: true
// 					},
// 					lastName: {
// 						required: true
// 					},
// 					DOB: {
// 						required: true
// 					},
// 					contactNumber: {
// 						required: true,
// 					},
// 					email: {
// 						regxEmail: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$|^$)/,
// 					},
// 					addressLine1: {
// 						required: true,
// 					},
// 					country: {
// 						required: true,
// 						regxcontry: "-- Select --"
// 					},
// 					states: {
// 						required: true,
// 					},
// 					district: {
// 						required: true,
// 					},
// 					area: {
// 						required: true,
// 					},
// 					city: {
// 						required: true,
// 					},
// 					pincode: {
// 						required: true,
// 					},
					
// 					documentNumber0: {
// 						required: true,
// 					},
// 					documentNumber1: {
// 						required: true,
// 					},
// 					documentNumber2: {
// 						required: true,
// 					},
// 					documentNumber3: {
// 						required: true,
// 					},
// 					documentNumber4: {
// 						required: true,
// 					},
// 					documentNumber5: {
// 						required: true,
// 					},
// 					documentNumber6: {
// 						required: true,
// 					},
// 					documentNumber7: {
// 						required: true,
// 					},
// 					documentNumber8: {
// 						required: true,
// 					},
	
// 				},
// 				errorPlacement: function (error, element) {
// 					if (element.attr("name") === "corporate") {
// 						error.insertAfter("#corporate");
// 					}
// 					if (element.attr("name") === "workLocation") {
// 						error.insertAfter("#workLocation");
// 					}
// 					if (element.attr("name") === "firstName") {
// 						error.insertAfter("#firstName");
// 					}
// 					if (element.attr("name") === "lastName") {
// 						error.insertAfter("#lastName");
// 					}
// 					if (element.attr("name") === "middleName") {
// 						error.insertAfter("#middleName");
// 					}
// 					if (element.attr("name") === "DOB") {
// 						error.insertAfter("#DOB");
// 					}
					
// 					if (element.attr("name") === "documentNumber0") {
// 						error.insertAfter("#documentNumber0");
// 					}
// 					if (element.attr("name") === "documentNumber1") {
// 						error.insertAfter("#documentNumber1");
// 					}
// 					if (element.attr("name") === "documentNumber2") {
// 						error.insertAfter("#documentNumber2");
// 					}
// 					if (element.attr("name") === "documentNumber3") {
// 						error.insertAfter("#documentNumber3");
// 					}
// 					if (element.attr("name") === "documentNumber4") {
// 						error.insertAfter("#documentNumber4");
// 					}
// 					if (element.attr("name") === "documentNumber5") {
// 						error.insertAfter("#documentNumber5");
// 					}
// 					if (element.attr("name") === "documentNumber6") {
// 						error.insertAfter("#documentNumber6");
// 					}
// 					if (element.attr("name") === "documentNumber7") {
// 						error.insertAfter("#documentNumber7");
// 					}
// 					if (element.attr("name") === "documentNumber8") {
// 						error.insertAfter("#documentNumber8");
// 					}
	
// 					if (element.attr("name") === "contactNumber") {
// 						error.insertAfter("#contactNumber");
// 					}
// 					if (element.attr("name") === "alternateNumber") {
// 						error.insertAfter("#alternateNumber");
// 					}
// 					if (element.attr("name") === "email") {
// 						error.insertAfter("#email");
// 					}
// 					if (element.attr("name") === "addressLine1") {
// 						error.insertAfter("#addressLine1");
// 					}
// 					if (element.attr("name") === "country") {
// 						error.insertAfter("#country");
// 					}
// 					if (element.attr("name") === "states") {
// 						error.insertAfter("#states");
// 					}
// 					if (element.attr("name") === "district") {
// 						error.insertAfter("#district");
// 					}
// 					if (element.attr("name") === "area") {
// 						error.insertAfter("#area");
// 					}
// 					if (element.attr("name") === "city") {
// 						error.insertAfter("#city");
// 					}
// 					if (element.attr("name") === "pincode") {
// 						error.insertAfter("#pincode");
// 					}
// 				}
// 			});
// 		}
// 		if (this.state.entity === "employee") {
// 			$(".person").hide();
// 			$(".employee").show();
// 			$.validator.addMethod("regxEmail", function (value, element, regexpr) {
// 				return regexpr.test(value);
// 			}, "Please enter valid Email Id");
// 			 $.validator.addMethod("regxvendor", function (value, element, arg) {
// 				return arg !== value;
// 			}, "Please select the corporate");
// 			// $.validator.addMethod("regxcontry", function (value, element, arg) {
// 			//     return arg !== value;
// 			// }, "Please select the country");
	
	
// 			jQuery.validator.setDefaults({
// 				debug: true,
// 				success: "valid"
// 			});
// 			$("#BasicInfo").validate({
// 				rules: {
	
// 					firstName: {
// 						required: true
// 					},
	
// 					empCategory: {
// 						required: true
// 					},
// 					empPriority: {
// 						required: true
// 					},
// 					// middleName: {
// 					//     required: true
// 					// },
// 					lastName: {
// 						required: true
// 					},
// 					DOB: {
// 						required: true
// 					},
// 					workLocation: {
// 						required: true,
// 					},
// 					corporate: {
// 						required: true,
// 						regxvendor: "-- Select --"
	
// 					},
// 					contactNumber: {
// 						required: true,
// 					},
// 					alternateNumber: {
// 						required: true,
// 					},
	
// 					email: {
// 						required: true,
// 						regxEmail: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$|^$)/,
// 					},
// 					department: {
// 						required: true,
// 					},
// 					designation: {
// 						required: true,
// 					},
// 					documentNumber0: {
// 						required: true,
// 					},
// 					employeeID: {
// 						required: true,
// 					},
// 					preApprovedAmount: {
// 						required: true,
// 					},
// 					preApprovedKilometer: {
// 						required: true,
// 					},
// 					 preApprovedRides: {
// 						required: true,
// 					},
// 					approvingAuthorityId1: {
// 						required: true,
// 					},
// 					approvingAuthorityId2: {
// 						required: true,
// 					},
// 					approvingAuthorityId3: {
// 						required: true,
// 					},
	
// 				},
// 				errorPlacement: function (error, element) {
// 					if (element.attr("name") === "firstName") {
// 						error.insertAfter("#firstName");
// 					}
// 					if (element.attr("name") === "lastName") {
// 						error.insertAfter("#lastName");
// 					}
// 					if (element.attr("name") === "empPriority") {
// 						error.insertAfter("#empPriority");
// 					}
// 					if (element.attr("name") === "empCategory") {
// 						error.insertAfter("#empCategory");
// 					}
// 					if (element.attr("name") === "DOB") {
// 						error.insertAfter("#DOB");
// 					}
// 					if (element.attr("name") === "contactNumber") {
// 						error.insertAfter("#contactNumber");
// 					}
// 					if (element.attr("name") === "email") {
// 						error.insertAfter("#email");
// 					}
// 					if (element.attr("name") === "department") {
// 						error.insertAfter("#department");
// 					}
// 					if (element.attr("name") === "designation") {
// 						error.insertAfter("#designation");
// 					}
// 					if (element.attr("name") === "workLocation") {
// 						error.insertAfter("#workLocation");
// 					}
// 					if (element.attr("name") === "corporate") {
// 						error.insertAfter("#corporate");
// 					}
// 					if (element.attr("name") === "documentNumber0") {
// 						error.insertAfter("#documentNumber0");
// 					}
// 					if (element.attr("name") === "employeeID") {
// 						error.insertAfter("#employeeID");
// 					}
// 					if (element.attr("name") === "preApprovedKilometer") {
// 						error.insertAfter("#preApprovedKilometer");
// 					}
// 					if (element.attr("name") === "preApprovedAmount") {
// 						error.insertAfter("#preApprovedAmount");
// 					}
// 					if (element.attr("name") === "preApprovedRides") {
// 						error.insertAfter("#preApprovedRides");
// 					}
// 					if (element.attr("name") === "approvingAuthorityId1") {
// 						error.insertAfter("#approvingAuthorityId1");
// 					}
// 					if (element.attr("name") === "approvingAuthorityId2") {
// 						error.insertAfter("#approvingAuthorityId2");
// 					}
// 					if (element.attr("name") === "approvingAuthorityId3") {
// 						error.insertAfter("#approvingAuthorityId3");
// 					}
	
// 				}
// 			});
// 		}
// 		if (this.state.entity === "guest") {
// 			$(".person").hide();
// 			$(".guest").show();
// 			$.validator.addMethod("regxEmail", function (value, element, regexpr) {
// 				return regexpr.test(value);
// 			}, "Please enter valid Email Id");
// 			$.validator.addMethod("regxdistrict", function (value, element, arg) {
// 				return arg !== value;
// 			}, "Please select the office location");
// 			jQuery.validator.setDefaults({
// 				debug: true,
// 				success: "valid"
// 			});
// 			$("#BasicInfo").validate({
// 				rules: {
// 					preApprovedAmount: {
// 						required: true,
// 					},
// 					preApprovedKilometer: {
// 						required: true,
// 					},
// 					 preApprovedRides: {
// 						required: true,
// 					},
// 					approvingAuthorityId1: {
// 						required: true,
// 					},
// 					approvingAuthorityId2: {
// 						required: true,
// 					},
// 					approvingAuthorityId3: {
// 						required: true,
// 					},
	
// 					firstName: {
// 						required: true
// 					},
// 					middleName: {
// 						required: true
// 					},
// 					workLocation: {
// 						required: true,
// 						regxdistrict: "--Select Office Location--"
// 					},
// 					lastName: {
// 						required: true
// 					},
	
// 					corporate: {
// 						required: true,
// 					},
// 					contactNumber: {
// 						required: true,
// 					},
	
// 					email: {
// 						required: true,
// 						regxEmail: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$|^$)/,
// 					},
// 				},
// 				errorPlacement: function (error, element) {
// 					if (element.attr("name") === "firstName") {
// 						error.insertAfter("#firstName");
// 					}
// 					if (element.attr("name") === "lastName") {
// 						error.insertAfter("#lastName");
// 					}
// 					if (element.attr("name") === "middleName") {
// 						error.insertAfter("#middleName");
// 					}
// 					if (element.attr("name") === "contactNumber") {
// 						error.insertAfter("#contactNumber");
// 					}
// 					if (element.attr("name") === "email") {
// 						error.insertAfter("#email");
// 					}
// 					if (element.attr("name") === "workLocation") {
// 						error.insertAfter("#workLocation");
// 					}
// 					if (element.attr("name") === "corporate") {
// 						error.insertAfter("#corporate");
// 					}
// 					if (element.attr("name") === "preApprovedKilometer") {
// 						error.insertAfter("#preApprovedKilometer");
// 					}
// 					if (element.attr("name") === "preApprovedAmount") {
// 						error.insertAfter("#preApprovedAmount");
// 					}
// 					if (element.attr("name") === "preApprovedRides") {
// 						error.insertAfter("#preApprovedRides");
// 					}
// 					if (element.attr("name") === "approvingAuthorityId1") {
// 						error.insertAfter("#approvingAuthorityId1");
// 					}
// 					if (element.attr("name") === "approvingAuthorityId2") {
// 						error.insertAfter("#approvingAuthorityId2");
// 					}
// 					if (element.attr("name") === "approvingAuthorityId3") {
// 						error.insertAfter("#approvingAuthorityId3");
// 					}
	
// 				}
// 			});
// 		}
// 	}
// 	  getDriverData() {
// 		var entityname =this.state.entity;
// 		axios.get('/api/documentlistmaster/get/list/'+entityname)
// 			.then((response) => {
// 				var DocumentsDetails = response.data
// 				// responseArray
// 				this.setState({
// 					DocumentsDetails : DocumentsDetails,
// 					documentindex : DocumentsDetails.length,
// 				},()=>{
// 					this.dynamicvalidation();
// 				})
// 			})
// 			.catch((error) => {
// 			})
// 	}
// 	  componentWillUnmount() {
// 		$("script[src='/js/adminLte.js']").remove();
// 		$("link[href='/css/dashboard.css']").remove();
// 	  }
// 	  camelCase(str) {
// 		return str
// 		  .toLowerCase()
// 		  .split(' ')
// 		  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
// 		  .join(' ');
// 	  }
// 	  getCompany() {
// 		axios.get('/api/companysettings')
// 		  .then((response) => {
// 			this.setState({
// 			  companyId: response.data._id,
// 			  companyDetails: response.data,
// 			  company: response.data.companyName,
// 			  companyLocationArray: response.data.companyLocationsInfo
// 			})
// 		  })
// 		  .catch((error) => {
// 		  })
// 	  }
// 	  getUploadFileAttachPercentage() {
// 		var uploadProgressPercent = localStorage.getItem("uploadUserImageProgressPercent");
// 		if (uploadProgressPercent) {
// 		  var percentVal = parseInt(uploadProgressPercent);
// 		  if (percentVal) {
// 			var styleC = {
// 			  width: percentVal + "%",
// 			  display: "block",
// 			  height: "8px",
// 			}
// 			var styleCBar = {
// 			  display: "block",
// 			  marginTop: 10,
// 			  height: "8px",
// 			}
// 		  }
// 		  if (!percentVal) {
// 			var percentVal = 0;
	
// 			var styleC = {
// 			  width: 0 + "%",
// 			  display: "none",
// 			  height: "8px",
// 			}
// 			var styleCBar = {
// 			  display: "none",
// 			  marginTop: 10,
// 			  height: "8px",
// 			}
// 		  }
// 		  if (percentVal === 100) {
// 			var percentVal = 0;
	
// 			var styleC = {
// 			  width: 0 + "%",
// 			  display: "none",
// 			  height: "8px",
// 			}
// 			var styleCBar = {
// 			  display: "none",
// 			  marginTop: 10,
// 			  height: "8px",
// 			}
	
// 		  }
// 		  return (
// 			<div>
// 			  <div className="progress col-lg-12" style={styleCBar}>
// 				<div className="progress-bar progress-bar-striped active" role="progressbar"
// 				  aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={styleC}>
// 				</div>
// 			  </div>
// 			</div>
// 		  );
// 		}
// 	  }
// 	  getUploadLogoPercentage() {
// 		var uploadProgressPercent = localStorage.getItem("imageprogress");
// 		if (uploadProgressPercent) {
// 		  var percentVal = parseInt(uploadProgressPercent);
// 		  if (percentVal) {
// 			var styleC = {
// 			  width: percentVal + "%",
// 			  display: "block",
// 			  height: "8px",
// 			}
// 			var styleCBar = {
// 			  display: "block",
// 			  marginTop: 10,
// 			  height: "8px",
// 			  padding: "0px",
// 			}
// 		  }
// 		  if (!percentVal) {
// 			var percentVal = 0;
	
// 			var styleC = {
// 			  width: 0 + "%",
// 			  display: "none",
// 			  height: "8px",
// 			}
// 			var styleCBar = {
// 			  display: "none",
// 			  marginTop: 10,
// 			  height: "8px",
// 			  padding: "0px",
// 			}
	
// 		  }
// 		  if (percentVal === 100) {
// 			var percentVal = 0;
	
// 			var styleC = {
// 			  width: 0 + "%",
// 			  display: "none",
// 			  height: "8px",
// 			}
// 			var styleCBar = {
// 			  display: "none",
// 			  marginTop: 10,
// 			  height: "8px",
// 			  padding: "0px",
// 			}
// 		  }
// 		  return (
// 			<div>
// 			  <div className="progress col-lg-12" style={styleCBar}>
// 				<div className="progress-bar progress-bar-striped active" role="progressbar"
// 				  aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={styleC}>
// 				</div>
// 			  </div>
// 			</div>
// 		  );
// 		}
// 	  }
// 	  handleChange(event) {
// 		event.preventDefault();
// 		const target = event.target;
// 		const name = target.name;
// 		const token = $(event.target).attr('token');
// 		const indexof = $(event.target).attr('index');
// 		if(name == ['documentNumber'+indexof]){
// 		this.setState({
// 			['documentName'+indexof] : token
// 			})
// 		}
// 		this.setState({
// 			[name]: event.target.value,
// 		}, () => {});
// 	}
// 	  handleOptionChange(event) {
// 		const target = event.target;
// 		const name = target.name;
	
// 		this.setState({
// 		  [name]: event.target.value
// 		});
	
// 	  }
// 	  submitPerson(event) {
// 		event.preventDefault();
// 		var index = this.state.documentindex;
// 			var docarr =[]
// 			for(var i=0; i<index; i++){
// 				var docvalue = 
// 				{
// 					documentName : this.state[`documentName${i}`],
// 					documentNumber:this.state[`documentNumber${i}`],
// 					documentValidFrom:this.state[`documentValidFrom${i}`],
// 					documentValidTo:this.state[`documentValidTo${i}`],
// 					documentProof:{
// 										imgUrl      : this.state["DocProof"+i],
// 										status      : "New",
// 										remark      : "",
// 										createdBy   : localStorage.getItem("user_ID"),
// 										createdAt   : new Date(),
// 								}
// 				}
// 				docarr.push(docvalue)
// 			} 
// 			this.setState({
// 				Documentarray : docarr,
// 			}, () => {
// 				console.log("this.state.Documentarray==>",this.state.Documentarray);
// 			});
			
// 			console.log("docarr==>",docarr);
// 		if (this.state.contactNumber == "" || this.state.contactNumber == undefined) {
// 		  this.setState({
// 			contactNumberAvailable: false
// 		  })
// 		}
// 		else {
// 		  this.setState({
// 			contactNumberAvailable: true
// 		  })
// 		}
// 		if (this.state.entity === 'employee') {
// 			var userDetails = {
// 				company_Id: this.state.corporate_Id,
// 				companyID: this.state.companyID,
// 				companyName: this.state.corporate,
// 				type: this.state.entity,
// 				firstName: this.state.firstName,
// 				middleName: this.state.middleName,
// 				lastName: this.state.lastName,
// 				DOB: this.state.DOB,
// 				gender: this.state.toggleButtonValue,
// 				contactNo: this.state.contactNumber,
// 				altContactNo: this.state.alternateNumber,
// 				email: this.state.email,
// 				whatsappNo: this.state.whatsappNumber ? this.state.whatsappNumber : '-',
// 				departmentId: this.state.department,
// 				designationId: this.state.designation,
// 				profilePhoto: this.state.profilePhoto,
// 				employeeId: this.state.employeeID,
// 				empCategory: this.state.empCategory,
// 				empPriority: this.state.empPriority,
// 				bookingApprovalRequired: this.state.getSelectedTrip,
// 				approvingAuthorityId1: this.state.approvingAuthorityId1,
// 				approvingAuthorityId2: this.state.approvingAuthorityId2,
// 				approvingAuthorityId3: this.state.approvingAuthorityId3,
// 				preApprovedKilometer: this.state.preApprovedKilometer,
// 				preApprovedAmount: this.state.preApprovedAmount,
// 				preApprovedRides: this.state.preApprovedRides,
// 				loginCredential: this.state.loginCredential,
// 				workLocation: this.state.workLocation,
// 				workLocationId: this.state.workLocationId,
// 				branchCode: this.state.branchCode,
// 				status: "Active",
// 				Documentarray: docarr,
// 				address: this.state.country !== "-- Select --" ? {
// 				  addressLine1: this.state.addressLine1 ? this.state.addressLine1 : "",
// 				  addressLine2: this.state.addressLine2 ? this.state.addressLine2 : "",
// 				  landmark: this.state.landmark ? this.state.landmark : "",
// 				  area: this.state.area ? this.state.area  : "",
// 				  city: this.state.city ? this.state.city : "",
// 				  district: this.state.district ? this.state.district : "",
// 				  state: this.state.states ? this.state.states.split('|')[1] : "",
// 				  stateCode: this.state.states ? this.state.states.split('|')[0] :"",
// 				  country: this.state.country ? this.state.country.split('|')[1] : "",
// 				  countryCode: this.state.country ? this.state.country.split('|')[0] : "",
// 				  pincode: this.state.pincode ? this.state.pincode:"" ,
// 				  latitude: "",
// 				  longitude: "",
// 				  addressProof: this.state.addressProof,
// 				}:[],
// 			}
	
// 		} else if (this.state.entity === 'driver') {
	
// 		  var userDetails = {
// 			type: this.state.entity,
// 			firstName: this.state.firstName,
// 			company_Id: this.state.corporate_Id,
// 			companyID: this.state.companyID,
// 			companyName: this.state.corporate,
// 			middleName: this.state.middleName,
// 			lastName: this.state.lastName,
// 			DOB: this.state.DOB,
// 			email: this.state.email ? this.state.email : "",
// 			gender: this.state.toggleButtonValue,
// 			contactNo: this.state.contactNumber,
// 			altContactNo: this.state.alternateNumber,
// 			whatsappNo: this.state.whatsappNumber ? this.state.whatsappNumber : '',
// 			profilePhoto: this.state.profilePhoto,
// 			identityProof: this.state.identityProof,
// 			loginCredential: "Yes",
// 			Documentarray: docarr,
// 			badgeNumber: this.state.badgeNumber,
// 			address: {
// 			  addressLine1: this.state.addressLine1,
// 			  addressLine2: this.state.addressLine2,
// 			  landmark: this.state.landmark ? this.state.landmark : "",
// 			  area: this.state.area,
// 			  city: this.state.city,
// 			  district: this.state.district,
// 			  state: this.state.states ? this.state.states.split('|')[1] : this.state.states,
// 			  stateCode: this.state.states ? this.state.states.split('|')[0] : this.state.states,
// 			  country: this.state.country ? this.state.country.split('|')[1] : this.state.country,
// 			  countryCode: this.state.country ? this.state.country.split('|')[0] : this.state.country,
	
// 			  pincode: this.state.pincode,
// 			  addressProof: this.state.addressProof,
// 			},
// 			workLocation: this.state.workLocation,
// 			workLocationId: this.state.workLocationId,
// 			status: "Active",
// 			username: "MOBILE"
// 		  }
	
// 		} else {
// 		  var userDetails = {
// 			company_Id: this.state.corporate_Id,
// 			companyID: this.state.companyID,
// 			companyName: this.state.corporate,
// 			loginCredential: "No",
// 			firstName: this.state.firstName,
// 			middleName: this.state.middleName,
// 			lastName: this.state.lastName,
// 			gender: this.state.toggleButtonValue,
// 			contactNo: this.state.contactNumber,
// 			altContactNo: this.state.alternateNumber,
// 			workLocation: this.state.workLocation,
// 			workLocationId: this.state.workLocationId,
// 			type: this.state.entity,
// 			email: this.state.email,
// 			bookingApprovalRequired: "Yes",
// 			approvingAuthorityId1: this.state.approvingAuthorityId1,
// 			approvingAuthorityId2: this.state.approvingAuthorityId2,
// 			approvingAuthorityId3: this.state.approvingAuthorityId3,
// 			preApprovedKilometer: this.state.preApprovedKilometer,
// 			preApprovedAmount: this.state.preApprovedAmount,
// 			preApprovedRides: this.state.preApprovedRides,
// 			profilePhoto: this.state.profilePhoto,
// 			status: "Active",
// 		  }
// 		}
// 		console.log("userDetails", userDetails,$('#BasicInfo').valid() && this.state.pincodeExists && this.state.contactNumberAvailable && this.state.listOfEmpEmail.indexOf(this.state.email) === -1)
// 		const main = async () => {
// 		  if ($('#BasicInfo').valid() && this.state.pincodeExists && this.state.contactNumberAvailable && this.state.listOfEmpEmail.indexOf(this.state.email) === -1) {
// 			if (userDetails.loginCredential === "Yes") {
// 			  userDetails.userId = await this.createLogin();
// 			  this.setState({
// 				getUserId : userDetails.userId
// 			  })
// 			 var sendData = {
// 				  "event": "Contact Created", //Event Name
// 				  "toUserId": userDetails.userId, //To user_id(ref:users)
// 				  "company": this.state.corporate_Id, //company_id(ref:entitymaster)
// 				  "variables": {
// 					'EmployeeName': this.state.firstName + ' ' + this.state.lastName,
// 					'Password': this.state.firstName + "123",
// 					'mobileNo': this.state.contactNumber,
// 					'email': this.state.email
// 				  }
// 				}
// 				console.log("sendData",sendData)
// 				axios.post('/api/masternotifications/post/sendNotification', sendData)
// 				  .then((res) => {
// 				  })
// 				  .catch((error) => { console.log('notification error: ', error) })
	
// 			}
// 			console.log("-->",userDetails)
// 			this.savePerson(userDetails);
// 		  } else {
// 			if(this.state.listOfEmpEmail.indexOf(this.state.email) > -1)
// 			{
	
// 				swal("Email Already Exists")
// 			}
// 			$('select.error:first').focus();
// 			$('input.error:first').focus();
// 		  }
// 		}
// 		main()
// 	  }
// 	  createLogin = () => {
// 		var userDetails = {
// 		  firstname: this.state.firstName,
// 		  //username: this.state.entity =="driver" ? "MOBILE" : "EMAIL",
// 		  lastname: this.state.lastName,
// 		  mobNumber: this.state.contactNumber,
// 		  email:  this.state.email,
// 		  companyID: this.state.companyID,
// 		  companyName: this.state.corporate,
// 		  pwd: this.state.firstName + "123",
// 		  role: [this.state.entity],
// 		  status: 'active',
// 		  "emailSubject": "Email Verification",
// 		  "emailContent": "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
// 		}
// 		console.log("userDetails", userDetails);
// 		return new Promise(function (resolve, reject) {
// 		  axios.post('/api/auth/post/signup/user', userDetails)
// 			.then((response) => {
// 			  console.log("response.data.ID===>>>>", response.data.ID)
// 			  resolve(response.data.ID);
// 			  if (response.data.message == 'USER_CREATED') {
				
// 			  } else {
// 				swal(response.data.message);
// 			  }
	
// 			})
// 			.catch((error) => { })
// 		})
// 	  }
// 	  savePerson(userDetails) {
	
// 		axios.post('/api/personmaster/post', userDetails)
// 		  .then((response) => {
// 			console.log("-->",response)
// 			if(response.data.duplicated)
// 			{
// 				swal(this.Capitalize(this.state.entity) + " Already Exists");
	
// 			}else{
// 			var userDetailsContact = {
// 				'entityID'                      : this.state.corporate_Id,
// 				'contactDetails'                : {
// 					'branchCode'                : this.state.branchCode, 
// 					'branchName'                : this.state.workLocation,
// 					'workLocationId'            : this.state.workLocationId,
// 					'firstName'                 : this.state.firstName,
// 					'empCategory'               : this.state.empCategory,
// 					'empPriority'               : this.state.empPriority,
// 					'middleName'                : this.state.middleName,
// 					'lastName'                  : this.state.lastName,
// 					'gender'                    : this.state.toggleButtonValue,
// 					'phone'                     : this.state.contactNumber,
// 					'altPhone'                  : this.state.alternateNumber?this.state.alternateNumber:"",
// 					'whatsappNo'                : this.state.whatsappNumber?this.state.whatsappNumber:"",
// 					'email'                     : this.state.email,
// 					'DOB'                       : this.state.DOB,
// 					'department'                : this.state.department,
// 					'departmentName'            : this.state.departmentName, 
// 					'designationName'           : this.state.designationName,
// 					'designation'               : this.state.designation,
// 					'employeeID'                : this.state.employeeID,
// 					'userID'                    : this.state.getUserId,
// 					'personID'                  : response.data.PersonId,
// 					'bookingApprovalRequired'   : this.state.getSelectedTrip,
// 					'approvingAuthorityId1'     : this.state.getSelectedTrip ? this.state.approvingAuthorityId1 : "",
// 					'approvingAuthorityId2'     : this.state.getSelectedTrip ? this.state.approvingAuthorityId2 : "",
// 					'approvingAuthorityId3'     : this.state.getSelectedTrip ? this.state.approvingAuthorityId3 : "",
// 					'preApprovedAmount'         : this.state.getSelectedTrip ? this.state.preApprovedAmount : "",
// 					'preApprovedRides'          : this.state.getSelectedTrip ? this.state.preApprovedRides : "",
// 					'preApprovedKilometers'     : this.state.getSelectedTrip ? this.state.preApprovedKilometers : "",
// 					'createUser'                : this.state.loginCredential == "Yes" ? true : false,
// 					'role'                      : this.state.entity,
// 					'addEmployee'               : this.state.addEmployee,
// 					'address': this.state.country == "-- Select --" ? [{
// 						addressLine1                : this.state.addressLine1,
// 						addressLine2                : this.state.addressLine2,
// 						landmark                    : this.state.landmark,
// 						area                        : this.state.area,
// 						city                        : this.state.city,
// 						district                    : this.state.district,
// 						state                       : this.state.states.split('|')[1],
// 						stateCode                   : this.state.states.split('|')[0],
// 						country                     : this.state.country.split('|')[1],
// 						countryCode                 : this.state.country.split('|')[0],
// 						pincode                     : this.state.pincode,
// 						addressProof                : this.state.addressProof,
// 					}]:[],
// 				}
// 			}
// 			console.log("userDetailsContact",userDetailsContact,this.state.getSelectedTrip);
		
// 			this.saveContact(userDetailsContact);
// 			this.setState({
// 			  firstName: "",
// 			  middleName: "",
// 			  lastName: "",
// 			  DOB: "",
// 			  gender: "",
// 			  contactNumber: "",
// 			  alternateNumber: "",
// 			  whatsappNumber: "",
// 			  department: "-- Select --",
// 			  designation: "-- Select --",
	
// 			  addressLine1: "",
// 			  addressLine2: "",
// 			  landmark: "",
// 			  area: "",
// 			  city: "",
// 			  district: "-- Select --",
// 			  states: "-- Select --",
// 			  country: "-- Select --",
// 			  pincode: "",
// 			  email: "",
// 			  licenseNumber: "",
// 			  effectiveUpto: "",
// 			  panNumber: "",
// 			  aadharNumber: "",
// 			  voterId: "",
// 			  preApprovedKilometer: "",
// 			  preApprovedAmount: "",
// 			  preApprovedRides: "",          
// 			  passportNumber: "",
// 			  licenseProof: [],
// 			  panProof: [],
// 			  profilePhoto: "",
// 			  aadharProof: [],
// 			  voterIDProof: [],
// 			  passportProof: [],
	
// 			}, () => {
// 			swal(this.Capitalize(this.state.entity) + " Added Successfully");
// 			  this.props.history.push("/" + this.state.entity + "/lists")
// 			  this.getElementByIds();
// 			})
	
	
// 			}
	
// 		  })
// 		  .catch((error) => {
	
// 		  })
// 	  }
// 	  saveContact(userDetails){
	
// 		axios.patch('/api/entitymaster/patch/addContact' ,userDetails)
// 			.then((response) => {
// 					console.log("response",response)
// 					if(response.data.duplicated)
// 					{
// 						swal({
// 							title : "Contact already exists.",
// 						});
	
// 					}else{
// 						console.log("contact Added")
						
// 					}
					
// 			})
// 			.catch((error) => {
			
// 			})
// 	  }
// 	  updateContact(userDetailsContact){
// 		  console.log("userDetailsContactupdate->",userDetailsContact)
// 		  axios.patch('/api/entitymaster/patch/updateSingleContact', userDetailsContact)
// 			  .then((response) => {
// 					  console.log("response",response)
// 					  if(response.data.duplicated)
// 					  {
// 						  swal({
// 							  title : "Contact already exists.",
// 						  });
	
// 					  }else{
// 						  console.log("contact Updated")
						  
// 					  }
					  
// 			  })
// 			  .catch((error) => {
			  
// 		  })
// 	  }
	
// 	  updatePerson(event) {
// 		event.preventDefault();
// 		var index = this.state.documentindex;
// 		var docarr =[]
// 		var imgarr =[]
// 		for(var i=0; i<index; i++){
// 			if(this.state["docproofimg"+i]) {
// 				imgarr = (this.state["docproofimg"+i]).concat(this.state["DocProof"+i]);
// 			}else{
// 				imgarr =(this.state["DocProof"+i]);
// 			}
// 			var docvalue = 
// 			{
// 				documentName        : this.state[`documentName${i}`],
// 				documentNumber      : this.state[`documentNumber${i}`],
// 				documentValidFrom   : this.state[`documentValidFrom${i}`],
// 				documentValidTo     : this.state[`documentValidTo${i}`],
// 				documentProof       : {
// 										imgUrl      : imgarr != null ? imgarr : [],
// 										status      : "Updated",
// 										remark      : "",
// 										createdBy   : localStorage.getItem("user_ID"),
// 										createdAt   : new Date(),
// 									}
				
// 			}
// 			docarr.push(docvalue)
// 		} 
// 		this.setState({
// 			Documentarray : docarr,
// 		}, () => {
// 		});
	
// 		if (this.state.personID) {
// 		  if (this.state.entity === 'employee') {
// 			var userDetails = {
// 			  company_Id: this.state.corporate_Id,
// 			  companyID: this.state.companyID,
// 			  companyName: this.state.corporate,
// 			  personID: this.state.personID,
// 			  firstName: this.state.firstName,
// 			  empPriority: this.state.empPriority,
// 			  middleName: this.state.middleName,
// 			  lastName: this.state.lastName,
// 			  DOB: this.state.DOB,
// 			  gender: this.state.toggleButtonValue,
// 			  contactNo: this.state.contactNumber ? this.state.contactNumber : "",
// 			  altContactNo: this.state.alternateNumber ? this.state.alternateNumber : "",
// 			  whatsappNo: this.state.whatsappNumber ? this.state.whatsappNumber : "",
// 			  email: this.state.email,
// 			  departmentId: this.state.department,
// 			  designationId: this.state.designation,
// 			  preApprovedKilometer: this.state.preApprovedKilometer,
// 			  preApprovedAmount: this.state.preApprovedAmount,
// 			  preApprovedRides: this.state.preApprovedRides,
// 			  profilePhoto: this.state.profilePhoto,
// 			  employeeId: this.state.employeeID,
// 			  empCategory: this.state.empCategory,
// 			  bookingApprovalRequired: this.state.getSelectedTrip,
// 			  approvingAuthorityId1: this.state.approvingAuthorityId1,
// 			  approvingAuthorityId2: this.state.approvingAuthorityId2,
// 			  approvingAuthorityId3: this.state.approvingAuthorityId3,
// 			  loginCredential: this.state.loginCredential,
// 			  workLocation: this.state.workLocation,
// 			  workLocationId: this.state.workLocationId,
// 			  branchCode: this.state.branchCode,
// 			  status: "Active",
// 			  Documentarray : docarr,
// 			  address: this.state.country !== "-- Select --" ? [{
// 				addressLine1: this.state.addressLine1,
// 				addressLine2: this.state.addressLine2,
// 				landmark: this.state.landmark,
// 				area: this.state.area,
// 				city: this.state.city,
// 				district: this.state.district,
// 				state: this.state.states.split('|')[1],
// 				stateCode: this.state.states.split('|')[0],
// 				country: this.state.country.split('|')[1],
// 				countryCode: this.state.country.split('|')[0],
// 				pincode: this.state.pincode,
// 				addressProof: this.state.addressProof,
	
// 			  }]:[],
	
// 			  updatedBy: localStorage.getItem("user_ID")
// 			}
// 		  } else if (this.state.entity === 'driver') {
// 			var userDetails = {
// 			  personID: this.state.personID,
// 			  company_Id: this.state.corporate_Id,
// 			  companyID: this.state.companyID,
// 			  companyName: this.state.corporate,
// 			  workLocation: this.state.workLocation,
// 			  workLocationId: this.state.workLocationId,
// 			  firstName: this.state.firstName,
// 			  middleName: this.state.middleName,
// 			  lastName: this.state.lastName,
// 			  DOB: this.state.DOB,
// 			  gender: this.state.toggleButtonValue,
// 			  contactNo: this.state.contactNumber,
// 			  altContactNo: this.state.alternateNumber ? this.state.alternateNumber : "",
// 			  whatsappNo: this.state.whatsappNumber ? this.state.whatsappNumber : "",
// 			  profilePhoto: this.state.profilePhoto,
// 			  identityProof: this.state.identityProof,
// 			  badgeNumber: this.state.badgeNumber,
// 			  email: this.state.email ? this.state.email : "",
// 			  Documentarray : docarr,
// 			  address: {
// 				addressLine1: this.state.addressLine1,
// 				addressLine2: this.state.addressLine2,
// 				landmark: this.state.landmark,
// 				area: this.state.area,
// 				city: this.state.city,
// 				district: this.state.district,
// 				state: this.state.states.split('|')[1],
// 				stateCode: this.state.states.split('|')[0],
// 				country: this.state.country.split('|')[1],
// 				countryCode: this.state.country.split('|')[0],
// 				pincode: this.state.pincode,
// 				addressProof: this.state.addressProof,
// 			  },
// 			  drivingLicense: {
// 				licenseNo: this.state.licenseNumber,
// 				effectiveTo: this.state.effectiveUpto,
// 				licenseProof: this.state.licenseProof
// 			  },
// 			  aadhar: {
// 				aadharNo: this.state.aadharNumber,
// 				aadharProof: this.state.aadharProof
// 			  },
// 			  verification: {
// 				verificationNumber: this.state.verificationNumber,
// 				verificationProof: this.state.verificationProof
// 			  },
	
// 			  updatedBy: localStorage.getItem("user_ID"),
// 			  status: "Active",
// 			  username: "MOBILE"
// 			}
	
// 		  } else {
// 			var userDetails = {
// 			  company_Id: this.state.corporate_Id,
// 			  companyID: this.state.companyID,
// 			  companyName: this.state.corporate,
// 			  personID: this.state.personID,
// 			  firstName: this.state.firstName,
// 			  middleName: this.state.middleName,
// 			  lastName: this.state.lastName,
// 			  gender: this.state.toggleButtonValue,
// 			  contactNo: this.state.contactNumber,
// 			  altContactNo: this.state.alternateNumber ? this.state.alternateNumber : "",
// 			  whatsappNo: this.state.whatsappNumber ? this.state.whatsappNumber : "",
// 			  email: this.state.email,
// 				bookingApprovalRequired: "Yes",
// 				approvingAuthorityId1: this.state.approvingAuthorityId1,
// 				approvingAuthorityId2: this.state.approvingAuthorityId2,
// 				approvingAuthorityId3: this.state.approvingAuthorityId3,
// 				preApprovedKilometer: this.state.preApprovedKilometer,
// 				preApprovedAmount: this.state.preApprovedAmount,
// 				preApprovedRides: this.state.preApprovedRides,
// 			  status: "Active",
// 			  profilePhoto: this.state.profilePhoto,
// 			  workLocation: this.state.workLocation,
// 			  workLocationId: this.state.workLocationId,
// 			  updatedBy: localStorage.getItem("user_ID")
// 			}
// 		  }
	
// 		  if ($('#BasicInfo').valid() && this.state.pincodeExists) {
	
// 			this.update(userDetails);
	
// 		  } else {
// 			$('select.error:first').focus();
// 			$('input.error:first').focus();
// 			window.scrollTo(0, 0);
// 		  }
// 		}
// 	  }
// 	  update(userDetails) {
// 		if ($('#BasicInfo').valid() && this.state.pincodeExists ) {
// 		axios.patch('/api/personmaster/patch', userDetails)
// 		  .then((response) => {
// 			console.log("response response",response)
		   
// 			axios.get('/api/entitymaster/get/one/' + this.state.corporate_Id)
// 				.then((response) => {
// 						var contactarray  =  response.data.contactPersons;
// 						var contactID = contactarray.filter(contact=>contact.personID == userDetails.personID)
// 						console.log("contactID",contactID,contactarray,this.state.personID);
// 						console.log("this.state.personID",this.state.personID,userDetails.personID);
	
// 						var userDetailsContact = {
// 							'entityID'                      : this.state.corporate_Id,
// 							'contactID'                    : contactID[0]._id,
// 							'contactDetails'                : {
// 							'branchCode'                : this.state.branchCode, 
// 							'branchName'                : this.state.workLocation,
// 							'firstName'                 : this.state.firstName,
// 							'middleName'                : this.state.middleName,
// 							'lastName'                  : this.state.lastName,
// 							'phone'                     : this.state.contactNumber,
// 							'DOB'                       : this.state.DOB,
// 							'altPhone'                  : this.state.alternateNumber,
// 							'empCategory'               : this.state.empCategory,
// 							'empPriority'               : this.state.empPriority,
// 							'gender'                    : this.state.gender ? this.state.gender : "Male",
// 							'whatsappNumber'            : this.state.whatsappNumber ? this.state.whatsappNumber : "",
// 							'email'                     : this.state.email,
// 							'department'                : this.state.department,
// 							'departmentName'            : this.state.departmentName, 
// 							'designationName'           : this.state.designationName,
// 							'designation'               : this.state.designation,
// 							'employeeID'                : this.state.employeeID,
// 							'userID'                    : this.state.userId,
// 							'personID'                  : userDetails.personID,
// 							'bookingApprovalRequired'   : this.state.getSelectedTrip,
// 							'approvingAuthorityId1'     : this.state.getSelectedTrip ? this.state.approvingAuthorityId1 : "",
// 							'approvingAuthorityId2'     : this.state.getSelectedTrip ? this.state.approvingAuthorityId2 : "",
// 							'approvingAuthorityId3'     : this.state.getSelectedTrip ? this.state.approvingAuthorityId3 : "",
// 							'preApprovedAmount'         : this.state.getSelectedTrip ? this.state.preApprovedAmount : "",
// 							'preApprovedRides'          : this.state.getSelectedTrip ? this.state.preApprovedRides : "",
// 							'preApprovedKilometers'     : this.state.getSelectedTrip ? this.state.preApprovedKilometers : "",
// 							'createUser'                : this.state.loginCredential == "Yes" ? true : false,
// 							'role'                      : this.state.entity,
// 							'addEmployee'               : this.state.addEmployee,
// 							'address': this.state.country !== "-- Select --" ? [{
// 								addressLine1: this.state.addressLine1,
// 								addressLine2: this.state.addressLine2,
// 								landmark: this.state.landmark,
// 								area: this.state.area,
// 								city: this.state.city,
// 								district: this.state.district,
// 								state: this.state.states.split('|')[1],
// 								stateCode: this.state.states.split('|')[0],
// 								country: this.state.country.split('|')[1],
// 								countryCode: this.state.country.split('|')[0],
// 								pincode: this.state.pincode,
// 								addressProof: this.state.addressProof,
	
// 							  }]:[],
// 							}
// 						}
// 						console.log("userDetailsContact",userDetailsContact,this.state.loginCredential);
// 					   this.updateContact(userDetailsContact);
// 				})
// 				.catch((error) => {                
// 				})
// 			if(this.state.role == '/my-profile/'+this.state.personID){
// 				this.setState({
// 					personID: "",
// 				})
// 				this.props.history.push("/my-profile")
// 			  }else{
// 				this.setState({
// 					personID: "",
// 				})
// 			   this.props.history.push("/" + this.state.role + "/lists")
// 			  }
// 			swal(this.Capitalize(this.state.role) + " Details Updated Successfully");
// 		  })
// 		  .catch((error) => {
// 			console.log("error", error)
// 		  })
// 		}
// 	  }
// 	  imgBrowse(event) {
// 		event.preventDefault();
// 		var companyLogo = [];
// 		if (event.currentTarget.files && event.currentTarget.files[0]) {
// 		  for (var i = 0; i < event.currentTarget.files.length; i++) {
// 			var file = event.currentTarget.files[i];
// 			if (file) {
// 			  var fileName = file.name;
// 			  var ext = fileName.split('.').pop();
// 			  if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "JPG" || ext === "PNG" || ext === "JPEG") {
// 				if (file) {
// 				  var objTitle = { fileInfo: file }
// 				  companyLogo.push(objTitle);
	
// 				} else {
// 				  swal("Images not uploaded");
// 				}//file
// 			  } else {
// 				swal("Allowed images formats are (jpg,png,jpeg)");
// 			  }//file types
// 			}//file
// 		  }//for 
	
// 		  if (event.currentTarget.files) {
// 			main().then(formValues => {
// 			  var companyLogo = this.state.companyLogo;
// 			  for (var k = 0; k < formValues.length; k++) {
// 				companyLogo.push(formValues[k].companyLogo)
// 			  }
	
// 			  this.setState({
// 				companyLogo: companyLogo
// 			  })
// 			});
	
// 			async function main() {
// 			  var formValues = [];
// 			  for (var j = 0; j < companyLogo.length; j++) {
// 				var config = await getConfig();
// 				var s3url = await s3upload(companyLogo[j].fileInfo, config, this);
// 				const formValue = {
// 				  "companyLogo": s3url,
// 				  "status": "New"
// 				};
// 				formValues.push(formValue);
// 			  }
// 			  return Promise.resolve(formValues);
// 			}
	
	
// 			function s3upload(image, configuration) {
	
// 			  return new Promise(function (resolve, reject) {
// 				S3FileUpload
// 				  .uploadFile(image, configuration)
// 				  .then((Data) => {
// 					resolve(Data.location);
// 				  })
// 				  .catch((error) => {
// 				  })
// 			  })
// 			}
// 			function getConfig() {
// 			  return new Promise(function (resolve, reject) {
// 				axios
// 				  .get('/api/projectsettings/get/S3')
// 				  .then((response) => {
// 					const config = {
// 					  bucketName: response.data.bucket,
// 					  dirName: 'propertiesImages',
// 					  region: response.data.region,
// 					  accessKeyId: response.data.key,
// 					  secretAccessKey: response.data.secret,
// 					}
// 					resolve(config);
// 				  })
// 				  .catch(function (error) {
// 				  })
	
// 			  })
// 			}
// 		  }
// 		}
// 	  }
	 
// 	  docBrowse(event) {
// 		event.preventDefault();
// 		$('#loader_img').show();
// 		// $('.fullpageloader').show();
// 		var name = event.target.name;
// 		var uploadedfiles = [];
// 		if (event.currentTarget.files && event.currentTarget.files[0]) {
// 			for (var i = 0; i < event.currentTarget.files.length; i++) {
// 				var file = event.currentTarget.files[i];
// 				if (file) {
// 					var fileName = file.name;
// 					var ext = fileName.split('.').pop();
// 					if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "pdf" || ext === "JPG" || ext === "PNG" || ext === "JPEG" || ext === "PDF") {
// 						var objTitle = { fileInfo: file }
// 						uploadedfiles.push(objTitle);
// 					} else {
// 						swal("Allowed file formats are jpg, png, jpeg, pdf");
// 					}//file types
// 				}//file
// 				else {
// 					swal("Files not uploaded");
// 				}//file
// 			}//for 
				
// 			if (event.currentTarget.files) {
// 				this.setState({
// 					["gotImage"+name]: true
// 				})
// 				main().then(formValues => {
// 					var docBrowsearr = [];
// 					// var docBrowsearr = this.state[name];
// 					for (var k = 0; k < formValues.length; k++) {
// 						docBrowsearr.push(formValues[k].imgUrl)
// 					}
// 					console.log("docBrowsearr==>",docBrowsearr);
// 					console.log("formValues Img==>",formValues[0].imgUrl);
// 					this.setState({
// 						[name]: docBrowsearr,
// 						documentArray : docBrowsearr,
	
// 					}, () => {
// 					})
// 				});
	
// 				async function main() {
// 					var formValues = [];
// 					for (var j = 0; j < uploadedfiles.length; j++) {
// 						var config = await getConfig();
// 						var s3url = await s3upload(uploadedfiles[j].fileInfo, config, this);
// 						const documentProof = {
// 							"imgUrl"    : s3url,
// 							"status"    : "New",
// 							"remark"    : "",
// 							"createdBy" : localStorage.getItem("user_ID"),
// 							"createdAt" : new Date(),
// 						};
// 						formValues.push(documentProof);
// 					}
// 					return Promise.resolve(formValues);
// 				}
// 				function s3upload(image, configuration) {
	
// 					return new Promise(function (resolve, reject) {
// 						S3FileUpload
// 							.uploadFile(image, configuration)
// 							.then((Data) => {
// 								resolve(Data.location);
// 							})
// 							.catch((error) => {
// 							})
// 					})
// 				}
// 				function getConfig() {
// 					return new Promise(function (resolve, reject) {
// 						axios
// 							.get('/api/projectsettings/get/S3')
// 							.then((response) => {
// 								$('#loader_img').hide();
// 								// console.log("response.data Img==>",response.data);
	
// 								const config = {
// 									bucketName: response.data.bucket,
// 									dirName: 'propertiesImages',
// 									region: response.data.region,
// 									accessKeyId: response.data.key,
// 									secretAccessKey: response.data.secret,
// 								}
// 								resolve(config);
// 							})
// 							.catch(function (error) {
// 							})
// 					})
// 				}
// 			}
// 		}
// 	}
// 	  keyPressWeb = (e) => {
	
// 		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190, 110, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]) !== -1 ||
// 		  // Allow: Ctrl+A, Command+A
// 		  (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
// 		  (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
// 		  (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
// 		  (e.keyCode === 190 && (e.ctrlKey === true || e.metaKey === true)) ||
// 		  (e.keyCode === 110 && (e.ctrlKey === true || e.metaKey === true)) ||
// 		  // Allow: home, end, left, right, down, up
// 		  (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode === 189 || e.keyCode === 32) {
// 		  // let it happen, don't do anything
// 		  return;
// 		}
// 		// Ensure that it is a number and stop the keypress
// 		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 90)) && (e.keyCode < 96 || e.keyCode > 105)) {
// 		  e.preventDefault();
// 		}
// 	  }
// 	  /*======== alphanumeric  =========*/
// 	  keyPress = (e) => {
// 		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
// 		  // Allow: Ctrl+A, Command+A
// 		  (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
// 		  (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
// 		  (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
// 		  // Allow: home, end, left, right, down, up
// 		  (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode === 189 || e.keyCode === 32) {
// 		  // let it happen, don't do anything
// 		  return;
// 		}
// 		// Ensure that it is a number and stop the keypress
// 		if (((e.keyCode < 48 || e.keyCode > 90)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode === 190 || e.keyCode === 46)) {
// 		  e.preventDefault();
// 		}
// 	  }
// 	  keyPressNumber = (e) => {
// 		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 189]) !== -1 ||
// 		  // Allow: Ctrl+A, Command+A
// 		  (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
// 		  (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
// 		  (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
// 		  // Allow: home, end, left, right, down, up
// 		  (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode === 189 || e.keyCode === 32) {
// 		  // let it happen, don't do anything
// 		  return;
// 		}
// 		// Ensure that it is a number and stop the keypress
// 		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 58)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode === 190 || e.keyCode === 46)) {
// 		  e.preventDefault();
// 		}
// 	  }
// 	  isTextKey(evt) {
// 		var charCode = (evt.which) ? evt.which : evt.keyCode;
// 		if (charCode != 189 && charCode > 32 && (charCode < 65 || charCode > 90)) {
// 		  evt.preventDefault();
// 		  return false;
// 		}
// 		else {
// 		  return true;
// 		}
// 	  }
// 	  componentWillReceiveProps(nextProps, prevProps) {
// 		if (this.state.entity === "driver") {
// 		  $(".person").hide();
// 		  $(".driver").show();
// 		}
// 		if (this.state.entity === "employee") {
// 		  $(".person").hide();
// 		  $(".employee").show();
// 		}
// 		if (this.state.entity === "guest") {
// 		  $(".person").hide();
// 		  $(".guest").show();
// 		}
// 		this.edit();
// 		this.handleChange = this.handleChange.bind(this);
// 	  }
// 	  admin(event) {
// 		event.preventDefault();
// 		this.props.history.push('/adminDashboard');
// 	  }
// 	  edit() {
// 		var personID = this.state.personID;
// 		if (personID) {
// 			axios.get('/api/personmaster/get/one/' + personID)
// 				.then((response) => {
// 			 console.log("response edit",response)
// 			  if (this.state.entity === 'driver') {
// 				var docarray = response.data.Documentarray;
// 					var index = docarray;
// 					var docarr =[]
// 					for(var i=0; i<index.length; i++){
// 						const docvalue = {
// 							"documentName"          :docarray[i].documentName,
// 							"documentNumber"        :docarray[i].documentNumber,
// 							"documentValidFrom"     :docarray[i].documentValidFrom,
// 							"documentValidTo"       :docarray[i].documentValidTo,
// 							"documentProof"         :docarray[i].documentProof.imgUrl,
													
// 						}
// 						docarr.push(docvalue)
// 						this.setState({
// 							['documentName'+i]      : docarray[i].documentName,
// 							['documentNumber'+i]    : docarray[i].documentNumber,
// 							['documentValidFrom'+i] : docarray[i].documentValidFrom,
// 							['documentValidTo'+i]   : docarray[i].documentValidTo,
// 							["docproofimg"+i]       : docarray[i].documentProof.imgUrl,
// 							docimgarray             : docarray[i].documentProof.imgUrl,
// 							showdocimg              : true,
// 						})
// 					} 
// 					this.setState({
// 						DocumentsDetails : docarr,
// 					}, () => {
// 					});
// 				this.setState({companyID: response.data.companyID,
// 				  corporate_Id: response.data.company_Id,
// 				  corporate: response.data.companyName,
// 				  firstName: response.data.firstName,
// 				  middleName: response.data.middleName,
// 				  lastName: response.data.lastName,
// 				  DOB: moment(response.data.DOB).format("YYYY-MM-DD"),
// 				  toggleButtonValue: response.data.gender ? response.data.gender : "Male",
// 				  contactNumber: response.data.contactNo ? response.data.contactNo : "",
// 				  alternateNumber: response.data.altContactNo ? response.data.altContactNo : "",
// 				  bookingApprovalRequired: response.data.bookingApprovalRequired && response.data.bookingApprovalRequired === true ? "Yes" : "No",
// 				  getSelectedTrip :   response.data.bookingApprovalRequired && response.data.bookingApprovalRequired === "true" ? "Yes" : "No",
// 				  getSelectedTrip: response.data.bookingApprovalRequired && (response.data.bookingApprovalRequired === "Yes" || response.data.bookingApprovalRequired === true) ? "Yes" : "No",
// 				  loginCredential: response.data.loginCredential ? response.data.loginCredential : "Yes",
// 				  approvingAuthorityId1: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId1 : "",
// 				  approvingAuthorityId2: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId2 : "",
// 				  approvingAuthorityId3: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId3 : "",
// 				  whatsappNumber: response.data.whatsappNo ? response.data.whatsappNo : "",
// 				  department: response.data.departmentId,
// 				  designation: response.data.designationId,
// 				  employeeID: response.data.employeeId,
// 				  workLocation: response.data.workLocation,
// 				  workLocationId: response.data.workLocationId,
// 				  badgeNumber: response.data.badgeNumber,
// 				  verificationNumber: response.data.verification ? response.data.verification.verificationNumber : "",
// 				  type: response.data.entity,
// 				  addressLine1: response.data.address[0] ? response.data.address[0].addressLine1 : "",
// 				  addressLine2: response.data.address[0] ? response.data.address[0].addressLine2 : "",
// 				  landmark: response.data.address[0] ? response.data.address[0].landmark : "",
// 				  area: response.data.address[0] ? response.data.address[0].area : "",
// 				  city: response.data.address[0] ? response.data.address[0].city : "",
// 				  district: response.data.address[0] ? response.data.address[0].district : "",
// 				  states: response.data.address[0] ? response.data.address[0].stateCode + "|" + response.data.address[0].state : "",
// 				  country: response.data.address[0] ? response.data.address[0].countryCode + "|" + response.data.address[0].country : "-- Select --",
// 				  pincode: response.data.address[0] ? response.data.address[0].pincode : "",
// 				  email: response.data.email,
				  
// 				  licenseNumber: response.data.drivingLicense ? response.data.drivingLicense.licenseNo : "",
// 				  effectiveUpto: moment(response.data.effectiveTo).format("YYYY-MM-DD"),
// 				  //panNumber       : response.data.pan[0] ? response.data.pan[0].PAN : "",
// 				  aadharNumber: response.data.aadhar ? response.data.aadhar.aadharNo : "",
// 				  //voterId         : response.data.voterID[0] ? response.data.voterID[0].voterID : "", 
// 				  //passportNumber  : response.data.passport[0] ? response.data.passport[0].passportNo : [],
// 				  licenseProof: response.data.drivingLicense ? response.data.drivingLicense.licenseProof : [],
// 				  addressProof: response.data.address[0] ? response.data.address[0].addressProof : [],
// 				  //panProof        : response.data.pan[0] ? response.data.pan[0].PANProof : [],
// 				  aadharProof: response.data.aadhar ? response.data.aadhar.aadharProof : [],
// 				  verificationProof: response.data.verification ? response.data.verification.verificationProof : [],
// 				  //voterIDProof    : response.data.voterID[0] ? response.data.voterID[0].voterIDProof : [],
// 				  identityProof: response.data.identityProof ? response.data.identityProof : [],
// 				  profilePhoto: response.data.profilePhoto,
// 				  createdBy: localStorage.getItem("user_ID")
// 				}, () => {
// 				  this.getEntityLocation(this.state.corporate_Id);
	
// 				  if (response.data.address.length > 0) {
// 					this.getStates(response.data.address[0].countryCode);
// 					this.getDistrict(response.data.address[0].stateCode, response.data.address[0].countryCode);
// 				  }
	
	
// 				})
// 			  } else if(this.state.entity === 'employee')
// 			  {
// 			  this.setState({
// 				  companyID: response.data.companyID,
// 				  corporate_Id: response.data.company_Id,
// 				  corporate: response.data.companyName,
// 				  firstName: response.data.firstName,
// 				  middleName: response.data.middleName?response.data.middleName:"",
// 				  lastName: response.data.lastName,
// 				  branchCode:response.data.branchCode?response.data.branchCode:"",
// 				  DOB: moment(response.data.DOB).format("YYYY-MM-DD"),
// 				  toggleButtonValue: response.data.gender !=="" ? response.data.gender : "Male",
// 				  contactNumber: response.data.contactNo ? response.data.contactNo : "",
// 				  alternateNumber: response.data.altContactNo ? response.data.altContactNo : "",
// 				  loginCredential: response.data.loginCredential ? response.data.loginCredential : "Yes",
// 				  getSelectedTrip: response.data.bookingApprovalRequired && (response.data.bookingApprovalRequired === "Yes" || response.data.bookingApprovalRequired === true) ? "Yes" : "No",
// 				  bookingApprovalRequired: response.data.bookingApprovalRequired && response.data.bookingApprovalRequired === true ? "Yes" : "No",
// 				  approvingAuthorityId1: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId1 : "",
// 				  approvingAuthorityId2: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId2 : "",
// 				  approvingAuthorityId3: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId3 : "",
// 				  preApprovedKilometer: response.data.bookingApprovalRequired == "Yes" ? response.data.preApprovedKilometer:"",
// 				  preApprovedAmount: response.data.bookingApprovalRequired == "Yes" ? response.data.preApprovedAmount:"",
// 				  preApprovedRides: response.data.bookingApprovalRequired == "Yes" ? response.data.preApprovedRides:"",
// 				  whatsappNumber: response.data.whatsappNo ? response.data.whatsappNo : "",
// 				  department: response.data.departmentId,
// 				  designation: response.data.designationId,
// 				  employeeID: response.data.employeeId,
// 				  workLocation: response.data.workLocation,
// 				  empPriority: response.data.empPriority,
// 				  empCategory: response.data.empCategory,
// 				  workLocationId: response.data.workLocationId,
// 				  userId:response.data.userId ? response.data.userId : "",
// 				  departmentName : response.data.department[0].department,
// 				  designationName : response.data.designation[0].designation,
// 				  // badgeNumber: response.data.badgeNumber,
// 				  //verificationNumber: response.data.verification ? response.data.verification.verificationNumber : "",
// 				  type: response.data.entity,
// 				   addressLine1: response.data.address[0] ? response.data.address[0].addressLine1 : "",
// 				  addressLine2: response.data.address[0] ? response.data.address[0].addressLine2 : "",
// 				  landmark: response.data.address[0] ? response.data.address[0].landmark : "",
// 				  area: response.data.address[0] ? response.data.address[0].area : "",
// 				  city: response.data.address[0] ? response.data.address[0].city : "",
// 				  district: response.data.address[0] ? response.data.address[0].district : "",
// 				  states: response.data.address[0] ? response.data.address[0].stateCode + "|" + response.data.address[0].state : "",
// 				  country: response.data.address[0] ? response.data.address[0].countryCode + "|" + response.data.address[0].country : "-- Select --",
// 				  pincode: response.data.address[0] ? response.data.address[0].pincode : "",
// 				  email: response.data.email,
// 				  profilePhoto: response.data.profilePhoto,
// 				  createdBy: localStorage.getItem("user_ID")
// 				}, () => {
// 				  this.getEntityLocation(this.state.corporate_Id);
// 				  if(response.data.address!==null)
// 				  {
// 					  if (response.data.address.length > 0) {
// 						this.getStates(response.data.address[0].countryCode);
// 						this.getDistrict(response.data.address[0].stateCode, response.data.address[0].countryCode);
// 					  }
// 				  }
	
// 				})
			  
// 			  }else {
// 				console.log("response.data=>", response.data);
	
// 				this.setState({
// 				  companyID: response.data.companyID,
// 				  corporate_Id: response.data.company_Id,
// 				  workLocation: response.data.workLocation,
// 				  workLocationId: response.data.workLocationId,
// 				  corporate: response.data.companyName,
// 				  firstName: response.data.firstName,
// 				  middleName: response.data.middleName,
// 				  lastName: response.data.lastName,
// 				  DOB: moment(response.data.DOB).format("YYYY-MM-DD"),
// 				  toggleButtonValue: response.data.gender,
// 				  contactNumber: response.data.contactNo ? response.data.contactNo : "",
// 				  type: response.data.entity,
// 				  email: response.data.email,
// 				  profilePhoto: response.data.profilePhoto,
// 				  getSelectedTrip: response.data.bookingApprovalRequired && (response.data.bookingApprovalRequired === "Yes" || response.data.bookingApprovalRequired === true) ? "Yes" : "No",
// 				  bookingApprovalRequired: response.data.bookingApprovalRequired && response.data.bookingApprovalRequired === true ? "Yes" : "No",
// 				  approvingAuthorityId1: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId1 : "",
// 				  approvingAuthorityId2: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId2 : "",
// 				  approvingAuthorityId3: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId3 : "",
// 				  preApprovedKilometer: response.data.bookingApprovalRequired == "Yes" ? response.data.preApprovedKilometer:"",
// 				  preApprovedAmount: response.data.bookingApprovalRequired == "Yes" ? response.data.preApprovedAmount:"",
// 				  preApprovedRides: response.data.bookingApprovalRequired == "Yes" ? response.data.preApprovedRides:"",
// 				  createdBy: localStorage.getItem("user_ID")
// 				}, () => {
// 				  this.getEntityLocation(this.state.corporate_Id);
	
// 				})
	
// 			  }
// 			})
// 			.catch((error) => {
// 			})
// 		}
// 	  }
// 	  changeMobile(event) {
// 		this.setState({
// 		  companyPhone: event
// 		}, () => {
// 		  if (this.state.companyPhone) {
// 			this.setState({
// 			  companyPhoneAvailable: this.state.companyPhone == "+" || this.state.companyPhone.length < 15 ? false : true
// 			}, () => {
// 			})
// 		  }
// 		})
// 	  }
// 	  deleteLogo(event) {
// 		event.preventDefault();
// 		var companyLogo = this.state.companyLogo;
// 		const index = companyLogo.indexOf(event.target.id);
// 		if (index > -1) {
// 		  companyLogo.splice(index, 1);
// 		}
// 		this.setState({
// 		  companyLogo: companyLogo
// 		})
// 	  }
// 	  docdeletetobe(inx) {
// 		const {documentArray } = this.state;
// 		console.log("[IndexOF]==>",inx);
// 		console.log("[documentArray]==>",documentArray);
// 		documentArray.splice(inx,1)
// 		// this.setState((prevState)=>{images:prevState.images.splice(index,1)})
// 		this.setState({
// 		  // DocumentsDetails:documentArray,
// 		  // [name] : documentArray,
// 		});
// 	  }
// 	  deleteDocSingle(event) {
// 		  event.preventDefault();
// 		  var name = event.target.getAttribute("name");
// 		  var deleteDoc = this.state[name];
// 		  const index = deleteDoc.indexOf(event.target.getAttribute("id"));
// 		  if (index > -1) {
// 			deleteDoc.splice(index, 1);
// 		  }
// 		  this.setState({
// 			[name]: deleteDoc
// 		  })
// 	  }
// 	  changeMobile(event) {
// 		  this.setState({
// 			contactNumber: event
// 		  }, () => {
// 			if (this.state.contactNumber) {
// 			  this.setState({
// 				contactNumberAvailable: this.state.contactNumber == "+" || this.state.contactNumber.length < 15 ? false : true
// 			  }, () => {
// 			  })
// 			}
// 		  })
// 	  }
// 	  changeMobileAlternate(event) {
// 		  this.setState({
// 			alternateNumber: event
// 		  })
// 	  }
// 	  changeMobileWhatsapp(event) {
// 		this.setState({
// 		  whatsappNumber: event
// 		})
// 	  }
// 	  handleChangeCountry(event) {
// 		const target = event.target;
// 		this.setState({
// 		  [event.target.name]: event.target.value
// 		});
// 		{/*if(event.target.name == "country")
// 		{
// 			this.setState({
// 				states: "--  Select --",
// 			})
// 		}*/}
// 		this.getStates(event.target.value.split('|')[0])
// 	  }
// 	  handleChangeDesignation(event) {
// 		const target = event.target;
// 		var designation = document.getElementById("desig");
// 		var designationName = designation.options[designation.selectedIndex].getAttribute("desig-name");
// 		this.setState({
// 		  [event.target.name]: event.target.value,
// 		  designationName: designationName
// 		}, () => {
// 		});
// 	  }
// 	  handleChangeDepartment(event) {
// 		const target = event.target;
// 		var department = document.getElementById("dept");
// 		var departmentName = department.options[department.selectedIndex].getAttribute("dept-name");
// 		this.setState({
// 		  [event.target.name]: event.target.value,
// 		  departmentName:departmentName
// 		});
// 	  }
// 	  handleChangeState(event) {
// 		this.setState({
// 		  [event.target.name]: event.target.value
// 		});
// 		const target = event.target;
// 		const stateCode = $(target).val();
// 		const countryCode = $("#countryVal").val();
// 		this.getDistrict(stateCode, countryCode);
// 	  }
// 	  getStates(StateCode) {
// 		axios.get("http://locations2.iassureit.com/api/states/get/list/" + StateCode)
// 		  .then((response) => {
// 			this.setState({
// 			  stateArray: response.data
// 			})
// 			$('#state').val(this.state.states);
// 		  })
// 		  .catch((error) => {
// 		  })
// 	  }
// 	  getDistrict(stateCode, countryCode) {
// 		axios.get("http://locations2.iassureit.com/api/districts/get/list/" + countryCode + "/" + stateCode)
// 		  .then((response) => {
// 			this.setState({
// 			  districtArray: response.data
// 			}, () => {
// 			})
	
// 			//$('#Citydata').val(this.state.city);
// 		  })
// 		  .catch((error) => {
// 		  })
// 	  }
// 	  getDesignation() {
// 		axios.get("/api/designationmaster/get/list")
// 		  .then((response) => {
// 			this.setState({
// 			  designationArray: response.data
// 			})
// 		  })
// 		  .catch((error) => {
// 		  })
// 	  }
// 	  getDepartment() {
// 		axios.get("/api/departmentmaster/get/list")
// 		  .then((response) => {
// 			this.setState({
// 			  departmentArray: response.data
// 			})
// 		  })
// 		  .catch((error) => {
// 		  })
// 	  }
// 	  Capitalize(str) {
// 		return str.charAt(0).toUpperCase() + str.slice(1);
// 	  }
// 	  getSelectedGender(val, event) {
// 		this.setState({
// 		  toggleButtonValue: val
// 		})
// 	  }
// 	  getSelectedTrip(val, event) {
	
// 		this.setState({
// 		  getSelectedTrip: val
// 		})
// 	  }
// 	  getSelectedLoginValue(val, event) {
	
// 		this.setState({
// 		  loginCredential: val
// 		})
	
// 	  }
// 	  getFileDetails(fileName) {
	
// 		axios
// 		  .get(this.state.fileDetailUrl + this.state.entity + "/" + fileName)
// 		  .then((response) => {
// 			$('.fullpageloader').hide();
// 			if (response) {
// 			  this.setState({
// 				fileDetails: response.data,
// 				failedRecordsCount: response.data.failedRecords.length,
// 				goodDataCount: response.data.goodrecords.length
// 			  });
// 			  if (this.state.entity === "employee") {
// 				var tableData = response.data.goodrecords.map((a, i) => {
// 				  return {
// 					"firstName": a.firstName ? a.firstName : '-',
// 					"middleName": a.middleName ? a.middleName : '-',
// 					"lastName": a.lastName ? a.lastName : '-',
// 					"DOB": a.DOB ? a.DOB : '-',
// 					"gender": a.gender ? a.gender : '-',
// 					"contactNo": a.contactNo ? a.contactNo : '-',
// 					"altContactNo": a.altContactNo ? a.altContactNo : '-',
// 					"email": a.email ? a.email : '-',
// 					"whatsappNo": a.whatsappNo ? a.whatsappNo : '-',
// 					"department": a.block ? a.block : '-',
// 					"designation": a.village ? a.village : '-',
// 					"employeeId": a.employeeId ? a.employeeId : "-",
// 					"bookingApprovalRequired": a.bookingApprovalRequired ? a.bookingApprovalRequired : "-",
// 					"approvingAuthorityId": a.approvingAuthorityId ? a.approvingAuthorityId : "-"
// 				  }
// 				})
	
// 				var failedRecordsTable = response.data.failedRecords.map((a, i) => {
// 				  return {
// 					"firstName": a.firstName ? a.firstName : '-',
// 					"middleName": a.middleName ? a.middleName : '-',
// 					"lastName": a.lastName ? a.lastName : '-',
// 					"DOB": a.DOB ? a.DOB : '-',
// 					"gender": a.gender ? a.gender : '-',
// 					"contactNo": a.contactNo ? a.contactNo : '-',
// 					"altContactNo": a.altContactNo ? a.altContactNo : '-',
// 					"email": a.email ? a.email : '-',
// 					"whatsappNo": a.whatsappNo ? a.whatsappNo : '-',
// 					"department": a.block ? a.block : '-',
// 					"designation": a.village ? a.village : '-',
// 					"employeeId": a.employeeId ? a.employeeId : "-",
// 					"bookingApprovalRequired": a.bookingApprovalRequired ? a.bookingApprovalRequired : "-",
// 					"approvingAuthorityId": a.approvingAuthorityId ? a.approvingAuthorityId : "-",
// 					"failedRemark": a.failedRemark ? a.failedRemark : '-'
// 				  }
// 				})
// 			  }
	
// 			  this.setState({
// 				goodRecordsTable: tableData,
// 				failedRecordsTable: failedRecordsTable
// 			  })
// 			}
// 		  })
// 		  .catch((error) => {
// 			console.log('error', error);
// 		  })
// 	  }
// 	  docBrowseSingle(event) {
// 		event.preventDefault();
// 		var name = event.target.name
// 		var docBrowse = [];
// 		if (event.currentTarget.files && event.currentTarget.files[0]) {
// 		  for (var i = 0; i < event.currentTarget.files.length; i++) {
// 			var file = event.currentTarget.files[i];
// 			if (file) {
// 			  var fileName = file.name;
// 			  var ext = fileName.split('.').pop();
// 			  if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "pdf" || ext === "JPG" || ext === "PNG" || ext === "JPEG" || ext === "PDF") {
// 				if (file) {
// 				  var objTitle = { fileInfo: file }
// 				  docBrowse.push(objTitle);
	
// 				} else {
// 				  swal("Photo not uploaded");
// 				}//file
// 			  } else {
// 				swal("Allowed images formats are (jpg,png,jpeg, pdf)");
// 			  }//file types
// 			}//file
// 		  }//for 
	
// 		  if (event.currentTarget.files) {
// 			 this.setState({
// 						["gotImage"+name]: true
	
// 					})
// 			main().then(formValues => {
// 			  var docBrowse = this.state[name];
// 			  this.setState({
// 				[name]: formValues[0].docBrowse
// 			  }, () => {
// 			  })
// 			});
	
// 			async function main() {
// 			  var formValues = [];
// 			  for (var j = 0; j < docBrowse.length; j++) {
// 				var config = await getConfig();
// 				var s3url = await s3upload(docBrowse[j].fileInfo, config, this);
// 				const formValue = {
// 				  "docBrowse": s3url,
// 				  "status": "New"
// 				};
// 				formValues.push(formValue);
// 			  }
// 			  return Promise.resolve(formValues);
// 			}
	
	
// 			function s3upload(image, configuration) {
	
// 			  return new Promise(function (resolve, reject) {
// 				S3FileUpload
// 				  .uploadFile(image, configuration)
// 				  .then((Data) => {
// 					resolve(Data.location);
// 				  })
// 				  .catch((error) => {
// 				  })
// 			  })
// 			}
// 			function getConfig() {
// 			  return new Promise(function (resolve, reject) {
// 				axios
// 				  .get('/api/projectsettings/get/S3')
// 				  .then((response) => {
// 					const config = {
// 					  bucketName: response.data.bucket,
// 					  dirName: 'propertiesImages',
// 					  region: response.data.region,
// 					  accessKeyId: response.data.key,
// 					  secretAccessKey: response.data.secret,
// 					}
// 					resolve(config);
// 				  })
// 				  .catch(function (error) {
// 				  })
// 			  })
// 			}
// 		  }
// 		}
// 	  }
// 	  deleteDocSingle(event) {
// 		event.preventDefault();
// 		var name = event.target.getAttribute("name");
	
// 		this.setState({
// 		  [name]: "",
// 		  ["gotImage"+name]: false
	
	
// 		})
// 	  }
// 	  handlePincode(event) {
// 		event.preventDefault();
// 		this.setState({
// 		  [event.target.name]: event.target.value
// 		})
// 		if (event.target.value !== '') {
// 		  axios.get("https://api.postalpincode.in/pincode/" + event.target.value)
// 			.then((response) => {
// 			  if ($("[name='pincode']").valid()) {
	
// 				if (response.data[0].Status === 'Success') {
// 				  this.setState({ pincodeExists: true })
// 				} else {
// 				  this.setState({ pincodeExists: false })
// 				}
// 			  } else {
// 				this.setState({ pincodeExists: true })
// 			  }
	
// 			})
// 			.catch((error) => {
// 			  this.setState({ pincodeExists: true })
	
// 			})
// 		} else {
// 		  this.setState({ pincodeExists: true })
// 		}
// 	  }
// 	  handleworklocationChange(event) {
// 		event.preventDefault();
// 		const target = event.target;
// 		const name = target.name;
	
// 		var e = document.getElementById("corporate");
// 		if (e != null) {
// 		  var comp_Id = e.options[e.selectedIndex].getAttribute("comp_Id");
// 		  var compID = e.options[e.selectedIndex].getAttribute("compID");
// 		  this.setState({
// 		  [name]: event.target.value,
// 		  corporateID: compID,
// 		  companyID: compID,
// 		  corporate_Id: comp_Id
	
// 		})
// 		}
// 		// console.log("companyID..",compID);
// 		var vendorLocation = document.getElementById("workLocation");
// 		var locationID = vendorLocation.options[vendorLocation.selectedIndex].getAttribute("locationID");
// 		var branchCode = vendorLocation.options[vendorLocation.selectedIndex].getAttribute("branch-code");
// 		var value = event.target.value;
// 		this.setState({
// 		  [name]: event.target.value,
// 		  workLocationId: locationID,
// 		  branchCode: branchCode
// 		 }, () => {
// 			console.log("branchCode",this.state.branchCode);
// 		  if(name == "corporate")
// 		  {
// 			this.setState({
// 				workLocation : "--Select Office Location--"
// 			})
// 		  }
// 		  this.getEntityLocation(this.state.corporate_Id);
// 		})
	
// 	  }
// 	  getEntity(entityCode) {
// 		if (this.state.entity == "employee") {
// 		  var entity = "corporate"
// 		} else if (this.state.entity == "driver") {
// 		  var entity = "vendor"
// 		} else {
// 		  var entity = "corporate"
// 		}
	
// 		axios.get('/api/entitymaster/get/' + entity)
// 		  .then((response) => {
// 			this.setState({
// 			  entityArray: response.data,
// 			  entity: entity
// 			}, () => {
// 			  if (this.state.entityArray && this.state.entityArray.lenght > 0) {
// 				var EntityCode = this.state.entityArray.filter((a) => a.entityCode == entityCode);
// 			  }
// 			})
	
// 		  })
// 		  .catch((error) => {
	
// 		  })
// 	  }
// 	  getEntityLocation(companyId) {
// 		// console.log("vendorId",companyId)
// 		axios.get('/api/entitymaster/get/one/' + companyId)
// 		  .then((response) => {
// 			this.setState({
// 			  corporateLocationArray: response.data
// 			},()=>{
// 			})
// 		  })
// 		  .catch((error) => {
	
// 		  })
// 	  }

// 	render() {
// 		const searchOptions = {
// 			types: ['(cities)'],
// 			componentRestrictions: { country: "in" }
// 		}
// 		console.log("this.state.entity===>", this.state.entity);
// 		return (
// 			<div className="container-fluid">
// 				<div className="row">
// 					<div className="formWrapper">
// 						<section className="content">
// 							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
// 								<div className="col-lg-10 col-md-10 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
// 									Edit User Data
// 								</div>
// 								<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 " id="rolemodalcl">
// 									<button type="button" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 addexamform userbtn clickforhideshow"
// 										onClick={this.backtoum.bind(this)}>
// 										<i className="fa fa-undo" aria-hidden="true"></i>
// 										<b>&nbsp;&nbsp; Back To UM List</b>
// 									</button>
// 								</div>
// 								<hr className="hr-head container-fluid row" />
// 								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
// 									{
// 										this.state.entity ?
// 											<div className="row">
// 												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
// 													<section className="content">
// 														<div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
															
// 															<form className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12" id="SelectVendor">
// 																{this.state.listOfRoles.indexOf("admin") > -1 ?

// 																	<div className="form-margin col-lg-4 col-md-6 col-sm-12 col-xs-12 driver employee" >
// 																		<div>
// 																			<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">{this.state.entity == "driver" ? "Vendor" : "Corporate"} <sup className="astrick">*</sup></label>
// 																			<select id="corporate" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.corporate} ref="corporate" name="corporate" onChange={this.handleworklocationChange.bind(this)}>
// 																				<option selected={true} disabled={true}>{"-- Select --"}</option>
// 																				{
// 																					this.state.entityArray && this.state.entityArray.length > 0 ?
// 																						this.state.entityArray.map((data, i) => {
// 																							return (
// 																								<option key={i} compID={data.companyID} comp_Id={data._id} value={data.companyName}>{data.companyName}</option>
// 																							);
// 																						})
// 																						:
// 																						null
// 																				}
// 																			</select>
// 																		</div>
// 																	</div>
// 																	:
// 																	null
// 																}
// 																<div className="form-margin col-lg-4 col-md-6 col-sm-12 col-xs-12 marbtm30 driver employee" >
// 																	<div>
// 																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Office Location <sup className="astrick">*</sup></label>
// 																		<select id="workLocation" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.workLocation} ref="workLocation" name="workLocation" onChange={this.handleworklocationChange.bind(this)}>
// 																			<option selected={true} disabled={true}>--Select Office Location--</option>
// 																			{
// 																				this.state.corporateLocationArray && this.state.corporateLocationArray.locations.length > 0 ?
// 																					this.state.corporateLocationArray.locations.map((data, i) => {
// 																						return (
// 																							<option key={i} locationID={data._id} branch-code={data.branchCode} value={((data.locationType).match(/\b(\w)/g)).join('') + "-" + data.city + " " + data.stateCode + "-" + data.countryCode}>{((data.locationType).match(/\b(\w)/g)).join('')} - {data.area} {data.city}, {data.stateCode} - {data.countryCode}  </option>
// 																						);
// 																					})
// 																					:
// 																					null
// 																			}
// 																		</select>
// 																	</div>
// 																</div>
// 															</form>
// 															<section className="Content" >
// 																<div className="row tab-content">
// 																	<div id="manual" className="tab-pane fade in active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
// 																		<form id="BasicInfo">
// 																			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding ">
// 																				<div className="col-lg-12 col-md-12 col-sm-12 supplierForm">
// 																					<div className="col-lg-12 col-md-12 col-sm-12">
// 																						<br />
// 																					</div>
// 																					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
// 																						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls NOpadding-left driver guest employee person NOpadding-right">
// 																							<label className="subHead col-lg-12 col-md-12 col-sm-12 col-xs-12 person "> Basic Details</label>

// 																							<div className="form-margin col-lg-9 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12  driver employee guest person" >
// 																									<div id="firstName">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">First Name <i className="astrick">*</i></label>
// 																										<input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.firstName} ref="firstName" name="firstName" onChange={this.handleChange} onKeyDown={this.isTextKey.bind(this)} />
// 																									</div>
// 																								</div>
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12  driver employee guest person" >
// 																									<div id="middleName">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Middle Name {this.state.entity !== "employee" ? <i className="astrick">*</i> : ""}</label>
// 																										<input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.middleName} ref="middleName" name="middleName" onChange={this.handleChange} onKeyDown={this.isTextKey.bind(this)} />
// 																									</div>
// 																								</div>
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee guest person">
// 																									<div id="lastName">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Last Name <i className="astrick">*</i></label>
// 																										<input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.lastName} ref="lastName" name="lastName" onChange={this.handleChange} onKeyDown={this.isTextKey.bind(this)} />
// 																									</div>
// 																								</div>
// 																							</div>

// 																							<div className="form-margin col-lg-9 col-md-12 col-sm-12 col-xs-12 driver guest employee person NOpadding-left NOpadding-right">
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">
// 																									<div id="DOB">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">DOB <i className="astrick">*</i></label>
// 																										<input type="date" id="DOB" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.DOB} max={moment(new Date).format("YYYY-MM-DD")} ref="DOB" name="DOB" onChange={this.handleChange} />
// 																									</div>
// 																								</div>
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee guest person">
// 																									<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Gender</label>
// 																									<div className="btn-group btn-group-toggle col-lg-12 nopadding" data-toggle="buttons">
// 																										<label className={this.state.toggleButtonValue === "Male" ? "btn toggleButton customToggleButton col-lg-3 btn-secondary active" : "btn toggleButton customToggleButton col-lg-3 btn-secondary "} value="Male" onClick={this.getSelectedGender.bind(this, "Male")}  >
// 																											<input type="radio"
// 																												name="options"
// 																												id="Male"
// 																												value="male"
// 																												autoComplete="off"
// 																												checked={this.state.toggleButtonValue === "Male" ? "checked" : "unchecked"}
// 																											/> Male
//                                         																</label>
// 																										<label className={this.state.toggleButtonValue === "Female" ? "btn toggleButton customToggleButton col-lg-3 btn-secondary active" : "btn toggleButton customToggleButton col-lg-3 btn-secondary "} value="Female" onClick={this.getSelectedGender.bind(this, "Female")}>
// 																											<input type="radio" name="options" id="Female" value="Female" autoComplete="off" checked={this.state.toggleButtonValue === "Female" ? "checked" : "unchecked"} /> Female
//                                         																</label>	
// 																										<label className={this.state.toggleButtonValue === "Transgender" ? "btn toggleButton customToggleButton col-lg-5 noRightMargin btn-secondary active" : "btn toggleButton customToggleButton noRightMargin col-lg-5 btn-secondary "} value="Transgender" onClick={this.getSelectedGender.bind(this, "Transgender")}>
// 																											<input type="radio" name="options" id="Transgender" autoComplete="off" checked={this.state.toggleButtonValue === "Transgender" ? "checked" : "unchecked"} /> Transgender
//                                         																</label>
// 																									</div>

// 																								</div>
// 																								<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 driver guest employee person" >
// 																									<div id="email">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Email {this.state.entity == "driver" ? "" : <i className="astrick">*</i>}
// 																											<a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="testemail@gmail.com" className="fa fa-question-circle"></i> </a>

// 																										</label>
// 																										<input type="email" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" value={this.state.email} ref="email" name="email" onChange={this.handleChange} placeholder="testemail@gmail.com" />
// 																									</div>
// 																								</div>

// 																							</div>
// 																							<div className=" col-lg-3 col-md-12 col-sm-12 col-xs-12 ">
// 																								<div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 uploadImage nopadding ">
// 																									<div className="col-lg-12 col-md-2 col-sm-12 col-xs-12 driver employee guest person nopadding ">
// 																										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
// 																											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileImageDiv" id="LogoImageUpEmployee">
// 																												<div><i className="fa fa-camera"></i> <br /><p>UPLOAD PHOTO</p></div>
// 																												<input onChange={this.docBrowseSingle.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="profilePhoto" />
// 																											</div>

// 																											{
// 																												this.state.profilePhoto ?
// 																													<div className="col-lg-12 col-md-2 col-sm-12 col-xs-12 nopadding CustomImageUpload">
// 																														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
// 																															<label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={this.state.profilePhoto} data-toggle="tooltip" title="Delete Image" name="profilePhoto" onClick={this.deleteDocSingle.bind(this)}>x</label>
// 																															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogosPM" id="profilePhoto">

// 																																{
// 																																	this.state.profilePhoto ?
// 																																		<img src={this.state.profilePhoto} className="img-responsive profileImageDivlogoStyle2" />
// 																																		:
// 																																		<img src="/images/login.png" className="img-responsive profileImageDivlogoStyle2" />
// 																																}

// 																															</div>
// 																														</div>
// 																													</div>
// 																													:
// 																													(
// 																														this.state.gotImageprofilePhoto ?
// 																														<div className="col-lg-12 col-md-2 col-sm-12 col-xs-12 nopadding CustomImageUpload">
// 																															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
// 																																<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogosPM" id="profilePhoto">
// 																																	<img src="/images/loading.gif" className="img-responsive profileImageDivlogoStyle2" />
// 																																</div>
// 																															</div>
// 																														</div>
// 																														:
// 																														null
// 																													)
// 																											}
// 																										</div>
// 																									</div>
// 																								</div>

// 																							</div>
// 																							<div className="form-margin col-lg-9 col-md-12 col-sm-12 col-xs-12 driver guest employee person NOpadding-left NOpadding-right">
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver guest employee person">
// 																									<div id="contactNumber">
// 																										<label className="labelform  NOpadding-left">Contact Number <i className="astrick">*</i></label>
// 																										<PhoneInput
// 																											country={'in'}
// 																											value={this.state.contactNumber}
// 																											name="contactNumber"
// 																											inputProps={{
// 																												name: 'contactNumber',
// 																											}}
// 																											onChange={this.changeMobile.bind(this)}
// 																										/>
// 																									</div>
// 																									{this.state.contactNumberAvailable == true ? null : <label className="error">Please enter valid number</label>}

// 																								</div>
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">
// 																									<label className="labelform  NOpadding-left">Alternate Number </label>
// 																									<PhoneInput
// 																										country={'in'}
// 																										value={this.state.alternateNumber}
// 																										name="alternateNumber"
// 																										inputProps={{
// 																											name: 'alternateNumber',
// 																										}}
// 																										onChange={this.changeMobileAlternate.bind(this)}
// 																									/>
// 																								</div>

// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">

// 																									<label className="labelform  NOpadding-left">WhatsApp Number</label>
// 																									<PhoneInput
// 																										country={'in'}
// 																										value={this.state.whatsappNumber}
// 																										name="whatsappNumber"
// 																										inputProps={{
// 																											name: 'whatsappNumber',
// 																										}}
// 																										onChange={this.changeMobileWhatsapp.bind(this)}
// 																									/>
// 																								</div>
// 																							</div>
// 																							<div className="form-margin col-lg-9 col-md-12 col-sm-12 col-xs-12  employee person NOpadding-left NOpadding-right">
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">
// 																									<div id="department">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Department <i className="astrick">*</i></label>
// 																										<select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
// 																											id="dept" ref="department" value={this.state.department} name="department" onChange={this.handleChangeDepartment} >
// 																											<option selected={true} disabled={true} >-- Select --</option>
// 																											{
// 																												this.state.departmentArray && this.state.departmentArray.length > 0 ?
// 																													this.state.departmentArray.map((deptData, index) => {
// 																														return (
// 																															<option key={index} dept-name={deptData.department} value={deptData._id}>{(deptData.department)}</option>
// 																														);
// 																													}
// 																													) : ''
// 																											}
// 																										</select>
// 																									</div>
// 																								</div>
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee person">
// 																									<div id="designation">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Designation <i className="astrick">*</i></label>
// 																										<select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" id="desig" ref="designation" value={this.state.designation} name="designation" onChange={this.handleChangeDesignation}>
// 																											<option selected={true} disabled={true} >-- Select --</option>
// 																											{
// 																												this.state.designationArray && this.state.designationArray.length > 0 ?
// 																													this.state.designationArray.map((desData, index) => {
// 																														return (
// 																															<option key={index} desig-name={desData.designation} value={desData._id}>{(desData.designation)}</option>
// 																														);
// 																													}) : ''
// 																											}
// 																										</select>
// 																									</div>
// 																								</div>
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee person">
// 																									<div id="employeeID">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Employee ID <i className="astrick">*</i></label>
// 																										<input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.employeeID} ref="employeeID" name="employeeID" onChange={this.handleChange} />
// 																									</div>
// 																								</div>
// 																							</div>

// 																							<div className="form-margin col-lg-9 col-md-12 col-sm-12 col-xs-12  employee person NOpadding-left NOpadding-right">
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
// 																									<div id="empCategory">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Employee Category <i className="astrick">*</i> </label>
// 																										<select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
// 																											ref="empCategory" value={this.state.empCategory} name="empCategory" onChange={this.handleChange} >
// 																											<option selected={true} disabled={true}>-- Select --</option>
// 																											<option value="1">1</option>
// 																											<option value="2">2</option>
// 																											<option value="3">3</option>

// 																										</select>
// 																									</div>
// 																								</div>
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
// 																									<div id="empPriority">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Employee Priority <i className="astrick">*</i> </label>
// 																										<select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
// 																											ref="empPriority" value={this.state.empPriority} name="empPriority" onChange={this.handleChange} >
// 																											<option selected={true} disabled={true}>-- Select --</option>
// 																											<option value="1">*</option>
// 																											<option value="2">**</option>
// 																											<option value="3">***</option>


// 																										</select>
// 																									</div>
// 																								</div>
// 																								{
// 																									this.state.entity == '/my-profile/' + this.state.personID ?
// 																										null
// 																										:
// 																										<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee  person">
// 																											<label className="subHeadingPM col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Create Login Credential</label>
// 																											<div className="btn-group btn-group-toggle" data-toggle="buttons">
// 																												<label className={this.state.loginCredential === "Yes" ? "btn toggleButton customToggleButtonPermission btn-secondary active" : "btn toggleButton customToggleButtonPermission btn-secondary"} value="Yes" onClick={this.getSelectedLoginValue.bind(this, "Yes")}>
// 																													<input type="radio"
// 																														name="options"
// 																														id="yes"
// 																														value="yes"
// 																														autocomplete="off"
// 																														checked
// 																													/>Yes
//                                         																		</label>
// 																												<label className={this.state.loginCredential === "No" ? "btn toggleButton customToggleButtonPermission btn-secondary active" : "btn toggleButton customToggleButtonPermission btn-secondary"} value="One Way" onClick={this.getSelectedLoginValue.bind(this, "No")} >
// 																													<input type="radio" name="options" id="no" value="no" autocomplete="off" /> No
//                                         																		</label>
// 																											</div>
// 																										</div>
// 																								}


// 																							</div>
// 																							{this.state.entity == '/my-profile/' + this.state.personID ?
// 																								null
// 																								:
// 																								<div className=" form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 employee  person">
// 																									<label className="subHeadingPM col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Booking Approval Required</label>
// 																									<div className="btn-group btn-group-toggle" data-toggle="buttons">
// 																										<label className={this.state.getSelectedTrip === "Yes" ? "btn toggleButton customToggleButtonPermission btn-secondary active" : "btn toggleButton customToggleButtonPermission btn-secondary"} value="Yes" onClick={this.getSelectedTrip.bind(this, "Yes")}>
// 																											<input type="radio"
// 																												name="options"
// 																												id="yes"
// 																												value="yes"
// 																												autocomplete="off"
// 																												checked
// 																											/>Yes
//                                         																</label>
// 																										<label className={this.state.getSelectedTrip === "No" ? "btn toggleButton customToggleButtonPermission btn-secondary active" : "btn toggleButton customToggleButtonPermission btn-secondary"} value="One Way" onClick={this.getSelectedTrip.bind(this, "No")} >
// 																											<input type="radio" name="options" id="no" value="no" autocomplete="off" /> No
//                                         																</label>
// 																									</div>
// 																								</div>
// 																							}
// 																							{this.state.entity == '/my-profile/' + this.state.personID ?
// 																								null
// 																								:
// 																								<div>
// 																									{
// 																										this.state.getSelectedTrip === "Yes" ?
// 																											<div className="form-margin col-lg-9 col-md-12 col-sm-12 col-xs-12  employee guest person NOpadding-left NOpadding-right">
// 																												<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee guest person">
// 																													<div id="approvingAuthorityId1">
// 																														<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">EmpID of Approving Authority #1<i className="astrick">*</i></label>
// 																														<input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.approvingAuthorityId1} ref="approvingAuthorityId1" name="approvingAuthorityId1" onChange={this.handleChange} />
// 																													</div>
// 																												</div>

// 																												<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee guest person">
// 																													<div id="approvingAuthorityId2">
// 																														<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">EmpID of Approving Authority #2<i className="astrick">*</i></label>
// 																														<input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.approvingAuthorityId2} ref="approvingAuthorityId2" name="approvingAuthorityId2" onChange={this.handleChange} />
// 																													</div>
// 																												</div>
// 																												<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee guest person">
// 																													<div id="approvingAuthorityId3">
// 																														<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">EmpID of Approving Authority #2<i className="astrick">*</i></label>
// 																														<input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.approvingAuthorityId3} ref="approvingAuthorityId3" name="approvingAuthorityId3" onChange={this.handleChange} />
// 																													</div>
// 																												</div>
// 																											</div>
// 																											:
// 																											null
// 																									}
// 																								</div>
// 																							}
// 																							{this.state.entity == '/my-profile/' + this.state.personID ?
// 																								null
// 																								:
// 																								<div>
// 																									{
// 																										this.state.getSelectedTrip === "Yes" ?
// 																											<div className="form-margin col-lg-9 col-md-12 col-sm-12 col-xs-12  employee guest person NOpadding-left NOpadding-right">
// 																												<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee guest person">
// 																													<div id="preApprovedAmount">
// 																														<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Pre Approved Amout<i className="astrick">*</i></label>
// 																														<input type="number" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" min="0" value={this.state.preApprovedAmount} ref="preApprovedAmount" name="preApprovedAmount" onKeyDown={this.keyPressNumber.bind(this)} onChange={this.handleChange} />
// 																													</div>
// 																												</div>
// 																												<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee guest person">
// 																													<div id="preApprovedRides">
// 																														<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Pre Approved Rides<i className="astrick">*</i></label>
// 																														<input type="number" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" min="0" value={this.state.preApprovedRides} ref="preApprovedRides" name="preApprovedRides" onKeyDown={this.keyPressNumber.bind(this)} onChange={this.handleChange} />
// 																													</div>
// 																												</div>
// 																												<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee guest person">
// 																													<div id="preApprovedKilometer">
// 																														<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Pre Approved Kilometer<i className="astrick">*</i></label>
// 																														<input type="number" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" min="0" value={this.state.preApprovedKilometer} ref="preApprovedKilometer" name="preApprovedKilometer" onKeyDown={this.keyPressNumber.bind(this)} onChange={this.handleChange} />
// 																													</div>
// 																												</div>
// 																											</div>
// 																											:
// 																											null
// 																									}
// 																								</div>
// 																							}
// 																							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 driver employee  person borderBottom">
// 																							</div>
// 																							<label className="subHead col-lg-12 col-md-12 col-sm-12 col-xs-12 driver person employee">Home Address Details</label>
// 																							<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
// 																									<div id="addressLine1">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Address Line 1 {this.state.entity !== "employee" ? <i className="astrick">*</i> : ""}</label>
// 																										<input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.addressLine1} ref="addressLine1" name="addressLine1" onChange={this.handleChange} />
// 																									</div>
// 																								</div>
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
// 																									<div id="addressLine2">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Address Line 2 </label>
// 																										<input type="text" id="addressLine2" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.addressLine2} ref="addressLine2" name="addressLine2" onChange={this.handleChange} />
// 																									</div>
// 																								</div>
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
// 																									<div id="landmark">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Landmark </label>
// 																										<input type="text" id="landmark" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.landmark} ref="landmark" name="landmark" onChange={this.handleChange} />
// 																									</div>
// 																								</div>
// 																							</div>
// 																							<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12  driver employee person NOpadding-left NOpadding-right">
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
// 																									<div id="country">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Country {this.state.entity !== "employee" ? <i className="astrick">*</i> : ""}</label>
// 																										<select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
// 																											ref="country" name="country" id="countryVal" value={this.state.country} onChange={this.handleChangeCountry} >
// 																											<option selected={true} disabled={true}>-- Select --</option>
// 																											<option value="IN|India">India</option>
// 																										</select>
// 																									</div>
// 																								</div>
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
// 																									<div id="states">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">State {this.state.entity !== "employee" ? <i className="astrick">*</i> : ""}</label>
// 																										<select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
// 																											ref="states" value={this.state.states} name="states" onChange={this.handleChangeState} >
// 																											<option selected={true} disabled={true}>-- Select --</option>
// 																											{
// 																												this.state.stateArray && this.state.stateArray.length > 0 ?
// 																													this.state.stateArray.map((stateData, index) => {
// 																														return (
// 																															<option key={index} value={stateData.stateCode + "|" + stateData.stateName}>{this.camelCase(stateData.stateName)}</option>
// 																														);
// 																													}) : ''
// 																											}
// 																										</select>
// 																									</div>
// 																								</div>
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
// 																									<div id="district">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">District{this.state.entity !== "employee" ? <i className="astrick">*</i> : ""}</label>
// 																										<select id="district" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
// 																											ref="district" name="district" value={this.state.district} onChange={this.handleChange} >
// 																											<option selected={true} disabled={true}>-- Select --</option>
// 																											{
// 																												this.state.districtArray && this.state.districtArray.length > 0 ?
// 																													this.state.districtArray.map((districtdata, index) => {
// 																														return (
// 																															<option key={index} value={districtdata.districtName}>{this.camelCase(districtdata.districtName)}</option>
// 																														);
// 																													}
// 																													) : ''
// 																											}
// 																										</select>
// 																									</div>
// 																								</div>
// 																							</div>
// 																							<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12   driver employee person NOpadding-left NOpadding-right">
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12  driver person employee">
// 																									<div id="area">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Area {this.state.entity !== "employee" ? <i className="astrick">*</i> : ""}</label>
// 																										<input type="text" id="area" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.area} ref="area" name="area" onChange={this.handleChange} />
// 																									</div>
// 																								</div>
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12  driver person employee">
// 																									<div id="city">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">City {this.state.entity !== "employee" ? <i className="astrick">*</i> : ""}</label>
// 																										<input type="text" id="city" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.city} ref="city" name="city" onChange={this.handleChange} />
// 																									</div>
// 																								</div>
// 																								<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">
// 																									<div id="pincode">
// 																										<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Pincode {this.state.entity !== "employee" ? <i className="astrick">*</i> : ""}</label>
// 																										<input maxLength="6" onChange={this.handlePincode.bind(this)} type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.pincode} ref="pincode" name="pincode" onKeyDown={this.keyPressNumber.bind(this)} />
// 																										{this.state.pincodeExists ? null : <label style={{ color: "red", fontWeight: "100" }}>This pincode does not exists!</label>}

// 																									</div>
// 																								</div>
// 																							</div>
// 																							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 person driver borderBottom"></div>

// 																							{
// 																								this.state.DocumentsDetails && this.state.DocumentsDetails.length > 0 ?
// 																									this.state.DocumentsDetails.map((doc, i) => {
// 																										return (
// 																											<div key={i} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">
// 																												<label className="subHead col-lg-12 col-md-12 col-sm-12 col-xs-12 driver  person">{doc.documentName} Details</label>
// 																												<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
// 																													<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver  person">
// 																														<div id="documentNumber" name="documentNumber">
// 																															<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">{doc.documentName} Number <i className="astrick">*</i>
// 																															</label>
// 																															<input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" ref={"documentNumber" + i} name={"documentNumber" + i} id={"documentNumber" + i} value={this.state[`documentNumber${i}`]} index={i} token={doc.documentName} placeholder={"Enter " + doc.documentName + " Number"} onChange={this.handleChange} required />
// 																														</div>
// 																													</div>

// 																													<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver  person">
// 																														<div id="documentValidFrom">
// 																															<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Valid From Date
//                                                                                                         					</label>
// 																															<input type="date" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" name={"documentValidFrom" + i} id={"documentValidFrom" + i} value={moment(this.state[`documentValidFrom${i}`]).format("YYYY-MM-DD")} index={i} token={doc.documentName} max={moment(new Date).format("YYYY-MM-DD")} ref={"documentValidFrom" + i} onChange={this.handleChange} />
// 																														</div>
// 																													</div>
// 																													<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver  person">
// 																														<div id="effectiveUpto">
// 																															<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Valid To Date
//                                                                                                         					</label>
// 																															<input type="date" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" index={i} token={doc.documentName} name={"documentValidTo" + i} id={"documentValidTo" + i} value={moment(this.state[`documentValidTo${i}`]).format("YYYY-MM-DD")} ref={"documentValidTo" + i} min={moment(new Date).format("YYYY-MM-DD")} onChange={this.handleChange} />
// 																														</div>
// 																													</div>

// 																												</div>
// 																												<div className="form-margin col-lg-8 col-md-12 col-sm-12 col-xs-12  driver person NOpadding-left NOpadding-right">
// 																													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  driver person ">
// 																														<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">{doc.documentName} Proof (jpg, jpeg, png, pdf)  <i className="astrick">*</i></label>
// 																														<div className="col-lg-1 col-md-2 col-sm-12 col-xs-12 driver person nopadding">
// 																															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
// 																																<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
// 																																	<div className="cursorPointer"><i className="fa fa-upload"></i><br /></div>
// 																																	<input multiple onChange={this.docBrowse.bind(this)} name={"DocProof" + i} id={"ImgProof" + i} value={this.state[`ImgProof${i}`]} type="file" token={doc.documentName} className="form-control fileManage col-lg-12 col-md-12 col-sm-12 col-xs-12" />
// 																																</div>
// 																															</div>
// 																														</div>

// 																														{
// 																															this.state["DocProof" + i] && this.state["DocProof" + i].length > 0 ?
// 																																this.state["DocProof" + i].map((data, i) => {

// 																																	return (
// 																																		<div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
// 																																			<div classNamDocProofe="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
// 																																				<label className="labelform deletelogoPersonMaster col-lg-12 col-md-12 col-sm-12 col-xs-12" id={data} index={i} token={doc.documentName} data-toggle="tooltip" title="Delete Image" name={"DocProof" + i} onClick={this.docdeletetobe.bind(this, i)}>x</label>
// 																																				{
// 																																					(data ? data.split('.').pop() : "") === "pdf" || (data ? data.split('.').pop() : "") === "PDF" ?
// 																																						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdfContainerPM" id="LogoImageUpOne">
// 																																							<img src="/images/pdfImg.png" />
// 																																							<span>{(data ? data.split('.').pop() : "")}</span>
// 																																						</div>
// 																																						:
// 																																						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogosPersonmaster" id="licenseProof">
// 																																							<img src={data} className="img-responsive logoStyle2" />
// 																																						</div>
// 																																				}
// 																																			</div>
// 																																		</div>
// 																																	);
// 																																})
// 																																:
// 																																(this.state["gotImageDocProof" + i] ?

// 																																	<div className="col-lg-12 col-md-2 col-sm-12 col-xs-12 nopadding CustomImageUploadOF margin-top">

// 																																		<div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
// 																																			<div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 brdlogosPersonmaster" id="licenseProof">
// 																																				<img src="/images/loading.gif" className="img-responsive logoStyle2 " />
// 																																			</div>
// 																																		</div>
// 																																	</div>
// 																																	:
// 																																	null)
// 																														}
// 																														{
// 																															this.state.showdocimg ?
// 																																this.state["docproofimg" + i] && this.state["docproofimg" + i].length > 0 ?
// 																																	this.state["docproofimg" + i].map((data, i) => {
// 																																		return (
// 																																			<div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
// 																																				{
// 																																					data !== null ?
// 																																						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
// 																																							<label className="labelform deletelogoPersonMaster col-lg-12 col-md-12 col-sm-12 col-xs-12" data-toggle="tooltip" title="Delete Image" id={data} index={i} token={doc.documentName} name={"docproofimg" + i} onClick={this.deleteDoc.bind(this, i)}>x</label>
// 																																							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos2" id={data}>
// 																																								<img src={data} className="img-responsive logoStyle2" />
// 																																							</div>
// 																																						</div>
// 																																						:
// 																																						null
// 																																				}
// 																																			</div>
// 																																		);
// 																																	})
// 																																	:
// 																																	null
// 																																:
// 																																null
// 																														}
// 																													</div>

// 																												</div>
// 																											</div>
// 																										);
// 																									})
// 																									:
// 																									null
// 																							}
// 																						</div>
// 																					</div>
// 																				</div>
// 																				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
// 																					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
// 																						{
// 																							this.state.personID ?
// 																								<button className="btn button3 pull-right" onClick={this.updatePerson.bind(this)} >Update&nbsp;</button>
// 																								:
// 																								<button className="btn button3 pull-right" onClick={this.submitPerson.bind(this)} >Submit&nbsp;</button>
// 																						}
// 																					</div>
// 																				</div>
// 																			</div>
// 																		</form>
// 																	</div>
// 																</div>
// 															</section>
// 														</div>
// 													</section>
// 												</div>
// 											</div>
// 											:
// 											null
// 									}
// 								</div>
// 							</div>
// 						</section>
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	}
// }

// export default EditUserProfile;


