import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import _ from 'underscore';
import 'bootstrap/js/tab.js';
import PhoneInput from 'react-phone-input-2';
class ContactDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			'branchCode'        : '',
			'name'              : '',
			'phone'             : '',
			'altPhone'          : '',
			'email'             : '',
			'department'        : '',
			'designation'       : '',
			'employeeID'        : '',
			'openForm'			: false,
			'pathname' 			: this.props.match.params.entity,
			'entityID'			: this.props.match.params ? this.props.match.params.entityID : '',
			'contactID'			: this.props.match.params ? this.props.match.params.contactID : '',
		};
		this.handleChange = this.handleChange.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		this.edit();
	}
	openForm() {
		this.setState({
			openForm: this.state.openForm == false ? true : false
		},()=>{
			if(this.state.openForm == true){
				this.validation();
			}
		})
		
	}
	componentDidMount() {
		window.scrollTo(0, 0);
		this.getBranchCode();
		this.contactDetails();
		this.edit();
	}
	validation(){
		$.validator.addMethod("depRegx", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter valid department name");
		$.validator.addMethod("desRegx", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter valid designation");
		$.validator.addMethod("nameRegx", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter valid name");
		$.validator.addMethod("regxEmail", function (value, element, regexpr) {
			return regexpr.test(value);
	  }   , "Please enter a valid email address.");
		$.validator.addMethod("regxBranchCode", function (value, element, arg) {
			return arg !== value;
		}, "Please select the branch code");
		jQuery.validator.setDefaults({
			debug: true,
			success: "valid"
		});
		$("#ContactDetail").validate({
			rules: {
				branchCode: {
					required: true,
					regxBranchCode: "--Select Branch Code--"
				},
				department: {
					required: true,
					depRegx: /^[A-Za-z][A-Za-z0-9\-\s]/,
				},
				designation: {
					required: true,
					desRegx: /^[A-Za-z][A-Za-z0-9\-\s]/,
				},
				email: {
					required: true,
					regxEmail: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
				},
				name: {
					required: true,
					nameRegx: /^[a-zA-Z\s]+$/,
				},
			},
			errorPlacement: function (error, element) {
				if (element.attr("name") == "branchCode") {
					error.insertAfter("#branchCode");
				}
				if (element.attr("name") == "department") {
					error.insertAfter("#department");
				}
				if (element.attr("name") == "designation") {
					error.insertAfter("#designation");
				}
				if (element.attr("name") == "email") {
					error.insertAfter("#email");
				}
				if (element.attr("name") == "name") {
					error.insertAfter("#name");
				}
			}
		});
	}
	keyPress = (e) => {
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
			// Allow: Ctrl+A, Command+A
			(e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
			(e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
			(e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
			// Allow: home, end, left, right, down, up
			(e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode === 189 || e.keyCode === 32) {
			// let it happen, don't do anything
			return;
		}
		// Ensure that it is a number and stop the keypress
		if (((e.keyCode < 65 || e.keyCode > 91)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode === 190 || e.keyCode === 46)) {
			e.preventDefault();
		}
	}
	keyPressNumber = (e) => {
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 189]) !== -1 ||
			// Allow: Ctrl+A, Command+A
			(e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
			(e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
			(e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
			// Allow: home, end, left, right, down, up
			(e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode === 189 || e.keyCode === 32) {
			// let it happen, don't do anything
			return;
		}
		// Ensure that it is a number and stop the keypress
		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 58)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode === 190 || e.keyCode === 46)) {
			e.preventDefault();
		}
	}
	handleChange(event) {
		const target = event.target;
		const name = target.name;

		this.setState({
			[name]: event.target.value
		});
	}
	locationdetailBack(event) {
		event.preventDefault();
		var entityID = this.props.match.params.entityID;
		if (this.state.openForm == true) {
			swal({
				// title: "abc",
				text: "It seem that you are trying to enter a contact details. Click 'Cancel' to continue entering contact details. Click 'Ok' to go to next page. But you may lose values already entered in the contact detail form",
				// type: "warning",
				buttons: {
					cancel: {
						text: "Cancel",
						value: false,
						visible: true,
						className: "CancelButtonSwal"
					},
					confirm: {
						text: "OK",
						value: true,
						visible: true,
						className: "OkButtonSwal",
						closeModal: true
					}
				},
			})
			.then((value) => {
				if(value){
					this.props.history.push("/"+this.state.pathname+"/location-details/" + entityID);
				}else{
					this.props.history.push("/"+this.state.pathname+"/contact-details/" + entityID);
				}
			})
			$(".OkButtonSwal").parents('.swal-button-container').addClass('postionSwalRight');
			$(".CancelButtonSwal").parents('.swal-button-container').addClass('postionSwalLeft');
		} else {
			this.props.history.push("/"+this.state.pathname+"/list");
		}
	}
	contactdetailBtn(event) {
		event.preventDefault();
		var entityID = this.props.match.params.entityID;
		if (this.state.openForm == true) {
			swal({
				// title: "abc",
				text: "It seem that you are trying to enter a contact details. Click 'Cancel' to continue entering contact details. Click 'Ok' to go to next page. But you may lose values already entered in the contact detail form",
				// type: "warning",
				buttons: {
					cancel: {
						text: "Cancel",
						value: false,
						visible: true,
						className: "CancelButtonSwal"
					},
					confirm: {
						text: "OK",
						value: true,
						visible: true,
						className: "OkButtonSwal",
						closeModal: true
					}
				},
			})
				.then((value) => {
					if(value){
						this.props.history.push("/"+this.state.pathname+"/list");
					}else{
						this.props.history.push("/"+this.state.pathname+"/contact-details/" + entityID);
					}
				})
			$(".OkButtonSwal").parents('.swal-button-container').addClass('postionSwalRight');
			$(".CancelButtonSwal").parents('.swal-button-container').addClass('postionSwalLeft');
		} else {
			this.props.history.push("/"+this.state.pathname+"/list");
		}
	}
	contactdetailAddBtn(event) {
		event.preventDefault();
		var entityID = this.props.match.params.entityID;
		if ($('#ContactDetail').valid()) {
			var formValues = {
				'entityID' 			: entityID,
				'contactDetails' 	: {
					'branchCode'        : this.state.branchCode,
					'name'              : this.state.name,
					'phone'             : this.state.phone,
					'altPhone'          : this.state.altPhone,
					'email'             : this.state.email,
					'department'        : this.state.department,
					'designation'       : this.state.designation,
					'employeeID'        : this.state.employeeID,
				}
			}
			axios.patch('/api/entitymaster/patch/addContact' ,formValues)
				.then((response) => {
					this.setState({
						'branchCode'        : '',
						'name'              : '',
						'phone'             : '',
						'altPhone'          : '',
						'email'             : '',
						'department'        : '',
						'designation'       : '',
						'employeeID'        : '',
						'openForm'			: false,
					})
					this.contactDetails();
					swal("Contact added successfully.");
				})
				.catch((error) => {
					
				})
		} else {
			$(event.target).parent().parent().find('.inputText.error:first').focus();
		}
	}
	getBranchCode() {
		var entityID = this.state.entityID;
		axios.get('/api/entitymaster/get/one/' + entityID)
			.then((response) => {
				this.setState({
					branchCodeArry: response.data.locations
				})
			})
			.catch((error) => {
				
			})
	}
	updatecontactdetailAddBtn(event) {
		event.preventDefault();
		var entityID = this.state.entityID;
		var contactID = this.state.contactID;

		if ($('#ContactDetail').valid()) {
			var formValues = {
				'entityID' 			: entityID,
				'contactID' 		: contactID,
				'contactDetails' 	: {
					'branchCode'        : this.state.branchCode,
					'name'              : this.state.name,
					'phone'             : this.state.phone,
					'altPhone'          : this.state.altPhone,
					'email'             : this.state.email,
					'department'        : this.state.department,
					'designation'       : this.state.designation,
					'employeeID'        : this.state.employeeID,
				}
			}
			axios.patch('/api/entitymaster/patch/updateSingleContact', formValues)
				.then((response) => {
					this.setState({
						'openForm'			: false,
						'contactID' 		: '',
						'branchCode'        : '',
						'name'              : '',
						'phone'             : '',
						'altPhone'          : '',
						'email'             : '',
						'department'        : '',
						'designation'       : '',
						'employeeID'        : '',
					})
					this.props.history.push('/'+this.state.pathname+'/contact-details/' + this.props.match.params.entityID);
					this.contactDetails();
					swal("Contact updated successfully.");
					$("#ContactDetail").validate().resetForm();
				})
				.catch((error) => {
					
				})
		}
	}
	edit() {
		var entityID = this.state.entityID;
		var contactID = this.state.contactID;
		var formValues = {
			entityID : entityID,
			contactID :  contactID
		}
		if (entityID && contactID) {
			
			axios.post('/api/entitymaster/post/singleContact', formValues)
				.then((response) => {
					var x = response.data.contactPersons;
					var contactDetails = x.filter(a => a._id == contactID);
					this.setState({
						'openForm'			: true,
						'branchCode'        : contactDetails[0].branchCode,
						'name'              : contactDetails[0].name,
						'phone'             : contactDetails[0].phone,
						'altPhone'          : contactDetails[0].altPhone,
						'email'             : contactDetails[0].email,
						'department'        : contactDetails[0].department,
						'designation'       : contactDetails[0].designation,
						'employeeID'        : contactDetails[0].employeeID,
					},()=>{
						if(this.state.openForm == true){
							this.validation();
						}
					})
				})
				.catch((error) => {
					
				})
		}
	}
	contactDelete(event) {
		event.preventDefault();
		var entityID = this.state.entityID;
		var locationID = event.target.id;

		var formValues = {
			entityID: entityID,
			location_ID: locationID
		}
		axios.delete('/api/entitymaster/deleteContact/' + entityID + "/" + locationID, formValues)
			.then((response) => {
				this.setState({
					'openForm'			: false,
					'contactID' 		: '',
					'branchCode'        : '',
					'name'              : '',
					'phone'             : '',
					'altPhone'          : '',
					'email'             : '',
					'department'        : '',
					'designation'       : '',
					'employeeID'        : '',
				})
				this.contactDetails();
				this.props.history.push('/'+this.state.pathname+'/contact-details/' + entityID);
				swal("Contact deleted successfully.");
			})
			.catch((error) => {
				
			})
	}
	contactDetails() {
		axios.get('/api/entitymaster/get/one/' + this.props.match.params.entityID)
			.then((response) => {

				this.setState({
					contactarray: response.data.contactPersons
				})
			})
			.catch((error) => {
				
			})
	}
	render() {
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
						<section className="content">
							<div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
									<h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">{this.state.pathname ? this.state.pathname : "Entity"} Master</h4>
									<div title="Go to Admin" className="col-lg-1 col-md-1 col-xs-1 col-sm-1 NOpadding-right">
										{this.props.vendorData ? <div onClick={this.admin.bind(this)} className="redirectToAdmin col-lg-5 col-lg-offset-7 col-md-10 col-xs-10 col-sm-10 fa fa-arrow-right"></div> : null}
									</div>
								</div>
								<div className="nav-center OnboardingTabs col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<ul className="nav nav-pills vendorpills col-lg-10 col-lg-offset-1 col-md-8 col-md-offset-3 col-sm-12 col-xs-12">
										<li className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn1 disabled">
											<a href="/client/basic-details" className="basic-info-pillss pills backcolor">
												<i className="fa fa-info-circle" aria-hidden="true"></i> &nbsp;
												Basic Info
											</a>
											<div className="triangleone " id="triangle-right"></div>
										</li>
										<li className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn1 disabled">
										  <div className="triangletwo" id="triangle-right1"></div>
											<a href="/client/department" className="basic-info-pillss pills backcolor">
												<i className="fa fa-info-circle" aria-hidden="true"></i> &nbsp;
												Department
											</a>
											<div className="triangleone " id="triangle-right"></div>
										</li>
										<li className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn2 disabled">
											<div className="triangletwo" id="triangle-right1"></div>
											<a href="/client/location-details" className="basic-info-pillss backcolor">
												<i className="fa fa-map-marker iconMarginLeft" aria-hidden="true"></i> &nbsp;
												Location
											</a>
											<div className="trianglethree forActive" id="triangle-right"></div>
										</li>
										<li className="active col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab noRightPadding pdcls btn4 ">
											<div className="trianglesix" id="triangle-right2"></div>
											<a href="" className="basic-info-pillss backcolor">
												<i className="fa fa-phone phoneIcon" aria-hidden="true"></i> &nbsp;
												Contact
											</a>
										</li>
									</ul>
								</div>
								<section className="Content">
									<div className="row">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12">
												<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12">
													<div className="col-lg-3 col-md-6 col-sm-6 col-sm-6 contactDetailTitle">
														<h4 className="MasterBudgetTitle"><i className="fa fa-phone" aria-hidden="true"></i> Contact Details</h4>
													</div>
													<div className="col-lg-6 col-md-6 col-sm-6 col-sm-6 ">
														{/* <h4 className="noteSupplier">Note: Please start adding contacts from 1st point of contact to higher authority.</h4> */}
													</div>
													<div className="col-lg-3 col-md-6 col-sm-6 col-sm-6 contactDetailTitle">
														<div className="button4  pull-right" onClick={this.openForm.bind(this)}>
															<i className="fa fa-plus" aria-hidden="true"></i>&nbsp;Add Contact
														</div>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formHrTag"></div>
												</div>
												{
													this.state.openForm == true ?
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
															<form id="ContactDetail">
																<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12">
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Branch Code <sup className="astrick">*</sup></label>
																		<select id="branchCode" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.branchCode} ref="branchCode" name="branchCode" onChange={this.handleChange} required>
																			<option defaultValue>--Select Branch Code--</option>
																			{
																				this.state.branchCodeArry && this.state.branchCodeArry.length > 0 ?
																					this.state.branchCodeArry.map((data, index) => {
																						console.log('data.branchCode', data);
																						if(data.branchCode){
																							return (
																								<option key={index} value={data.branchCode}>{data.city} {data.district} {data.state} - {data.country}</option>
																							);
																						}
																					}
																					)
																					:
																					null
																			}
																		</select>
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Department <sup className="astrick">*</sup></label>
																		<input id="department" type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.department} ref="department" name="department" onChange={this.handleChange} required/>
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Designation <sup className="astrick">*</sup></label>
																		<input id="designation" type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.designation} ref="designation" name="designation" onChange={this.handleChange} required />
																	</div>
																	
																</div>
																<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12">
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Employee ID</label>
																		<input id="employeeID" name="employeeID" type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.employeeID} ref="employeeID" name="employeeID" onChange={this.handleChange} />
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Name <sup className="astrick">*</sup></label>
																		<input id="name" type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.name} ref="name" name="name" onChange={this.handleChange} required />
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Email <sup className="astrick">*</sup></label>
																		<input id="email" type="email" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.email} ref="email" name="email" onChange={this.handleChange} required />
																	</div>
																</div>
																<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12">
																    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
														                <div className="form-group">
														                  <label className="labelform" >Contact Number</label>
														                    <PhoneInput
														                      country={'in'}
														                      value={this.state.phone} 
														                      name="phone"
														                      inputProps={{
														                        name: 'phone',
														                        required: true
														                      }}
																			  onChange={phone=>{this.setState({phone})}}
														                  />
														                </div> 
													              	</div>
													              	 <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
														                <div className="form-group">
														                  <label className="labelform" >Alternate Contact Number</label>
														                    <PhoneInput
														                      country={'in'}
														                      value={this.state.altPhone} 
														                      name="altPhone"
														                      inputProps={{
														                        name: 'altPhone',
														                        required: true
														                      }}
																			  onChange={altPhone=>{this.setState({altPhone})}}
														                  />
														                </div> 
													              	</div>
																
																</div>
																<div className="col-lg-7 col-md-7 col-sm-7 col-xs-7 contactSubmit pull-right">
																	{
																		this.state.contactID ?
																			<button className="button3 pull-right" onClick={this.updatecontactdetailAddBtn.bind(this)} data-id={this.state.contactValue}>Update Contact</button>
																			:
																			<button className="button3 pull-right" onClick={this.contactdetailAddBtn.bind(this)}>Submit</button>
																	}
																</div>
															</form>
														</div>
														:
														null
												}
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
													<button className="button2" onClick={this.locationdetailBack.bind(this)}><i className="fa fa-angle-double-left" aria-hidden="true"></i>&nbsp;Location Details</button>
													<button className="button1 pull-right" onClick={this.contactdetailBtn.bind(this)}>Finish&nbsp;</button>
												</div>
											</div>
										</div>
										{this.state.contactarray && this.state.contactarray.length > 0 ?
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 foothd">
													<h4 className="MasterBudgetTitle">Contact Details</h4>
												</div>
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
													{this.state.contactarray && this.state.contactarray.length > 0 ?
														this.state.contactarray.map((data, index) => {

															return (
																<div className="col-lg-6 col-lg-offset-2 col-md-6 col-md-offset-2 col-sm-6 col-sm-offset-2 col-xs-12 boxul1" key={index}>
																	<div className="liheader1 col-lg-1 col-md-1 col-sm-1 col-xs-1">
																		<i className="fa fa-phone" aria-hidden="true"></i>
																	</div>
																	<ul className="col-lg-10 col-md-10 col-sm-10 col-xs-10 palfclr addrbox">
																		<li>Branch Code :{data.branchCode}</li>
																		<li>{data.name}</li>
																		<li>{data.email} , {data.phone}</li>
																		<li>{data.department}, {data.designation}</li>
																	</ul>
																	<div className="liheader1 dropdown col-lg-1 col-md-1 col-sm-1 col-xs-1">
																		<i className="fa fa-ellipsis-h dropbtn" aria-hidden="true"></i>
																		<div className="dropdown-content dropdown-contentLocation">
																			<ul className="pdcls ulbtm">
																				<li name={index}>
																					<a href={"/"+this.state.pathname+"/contact-details/" + this.props.match.params.entityID + "/" + data._id}><i className="fa fa-pencil penmrleft" aria-hidden="true"></i>&nbsp;&nbsp;Edit</a>
																				</li>
																				<li name={index}>
																					<span onClick={this.contactDelete.bind(this)} id={data._id}><i className="fa fa-trash-o" aria-hidden="true"></i> &nbsp; Delete</span>
																				</li>
																			</ul>
																		</div>
																	</div>
																</div>
															);
														})
														:
														<div className="textAlign">Contacts will be shown here.</div>
													}
												</div>
											</div>
										</div>
										:
										null
												}
									</div>
								</section>
							</div>
						</section>
					</div>
				</div>
			</div>
		);
	}
}

export default ContactDetails;
