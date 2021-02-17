import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import 'bootstrap/js/tab.js';
import PhoneInput from 'react-phone-input-2';
import { withRouter } from 'react-router-dom';
import IAssureTable   from "../../../../../coreadmin/IAssureTable/IAssureTable.jsx";
import Department from  '../../../../../coreadmin/Master/Department/DepartmentMaster-GlobalMaster.js';
import Designation from  '../../../../../coreadmin/Master/Designation/DesignationMaster-GlobalMaster.js';


class ContactDetails extends Component {
	
	constructor(props) {
		super(props);
		console.log("this.props.match.params",this.props.match);
			this.state = {
			'firstName'         		: '',
			'lastName'          		: '',
			'phone'             		: '',
			'altPhone'         	 		: '',
			'email'             		: '',
			'employeeID'        		: '',
			'openForm'					: this.props.modal ?this.props.modal: false,
			'openFormIcon'              : this.props.modal ?this.props.modal: false,
			'bookingApprovalRequired' 	: "No",
			'createUser' 				: false,
			'showBookingApprovalRequired' : true,
			'branchCode'  				:"",
			'departmentVal'  			:"",
			'designationVal'  				:"",
			'editData' 					: null,
			'role'  				    :"",
			'url'                       : "http://uatadmin.fivebees.in",
			tableHeading:{
	            empName              :"Emp Name & ID",
	            contactDetails       :"Contact Details",
	             actions:"Action"
	          },
	           tableObjects : {
	          paginationApply : false,
	          searchApply     : false,
	          editUrl         : '/'+this.props.entity+'/contact-details/'+this.props.match.params.entityID,
	          listUrl         : '/' + this.props.entity + "/contact-details/" + this.props.match.params.entityID,
	          deleteMethod    : 'delete',
        	  apiLink         : '/api/entitymaster/contact',
	          downloadApply   : true
	      },

	        startRange        : 0,
            limitRange        : 100000,
		
            "editId": this.props.match.params ? this.props.match.params.fieldID : '',
            "IdToDelete" : "",
			'listOfEmpID'               : [],
			"pathname"					: this.props.entity,
			'entityID'					: this.props.entityID ? this.props.entityID : this.props.match.params ? this.props.match.params.entityID : '',
			'contactID'					: this.props.match.params ? this.props.match.params.contactID : '',
		};
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillReceiveProps(nextProps,prevProps) {
		console.log("nextProps",nextProps);
		console.log("prevProps",prevProps);
		if(nextProps.match.params && nextProps.match.params.contactID){  
			this.edit();
			this.getBranchCode();
			this.setState({
				'entityID': nextProps.entityID ? nextProps.entityID : nextProps.match.params ? nextProps.match.params.entityID : '',
				'contactID':nextProps.match.params&& nextProps.match.params.contactID ? nextProps.match.params.contactID : '',
			})
		}
	}
	openForm() {
		this.setState({
			openForm     : this.state.openForm     === false ? true : false,
			openFormIcon : this.state.openFormIcon === false ? true : false
		},()=>{
			if(this.state.openForm === true){
				this.validation();
			}
		})
		
	}
	componentDidMount() {
		window.scrollTo(0, 0);
		var role = localStorage.getItem("roles");
		this.setState({
			getCurrentRole : role
		})
		this.getRoles();
		this.getAllEntites();
		this.getDesignation();
		this.getDepartment();
		this.getBranchCode();
		this.contactDetails();
		this.edit();
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
	}


	getAllEntites() {
		var formvalues = {};
		if(this.state.pathname === "corporate"){
			formvalues = { type : "employee"}
		}else{
			formvalues = { type : "driver"}
		}
		var listOfEmpID = [];
		if(this.props.match.params.entityID){
			axios.get('/api/entitymaster/get/one/'+this.props.match.params.entityID)
			.then((response) => {
				this.setState({
					contactarray: response.data[0].contactData

				},()=>{
					if(response.data[0].contactData){
						for(let j=0;j<this.state.contactarray.length;j++)
						{
							listOfEmpID.push(this.state.contactarray[j].employeeID)
						}
					}

				})
			})
			.catch((error) => {})
		}		
		axios.post("/api/personmaster/get/list",formvalues)
		.then((response) => {
	        
			this.setState({
				personList   : response.data,
			})
			for(let i=0;i<this.state.personList.length;i++)
			{
				listOfEmpID.push(this.state.personList[i].employeeId)
			}
			this.setState({
				listOfEmpID:listOfEmpID
			})
		})
		.catch((error) => {
		})
	}
	getDesignation() {
		var getcompanyID = localStorage.getItem("companyID")
		axios.get("/api/designationmaster/get/list")
		  .then((response) => {
			this.setState({
			  designationArray: response.data
			})
		  })
		  .catch((error) => {
		  })
	}
	getRoles() {
		axios.post("/api/roles/get/list")
		  .then((response) => {
			var rolesArray = response.data.filter(a=>a.rolesentity === this.props.entity)
			this.setState({
			  rolesArray: rolesArray
			})
		  })
		  .catch((error) => {})
	}
	getDepartment() {
	var getcompanyID = localStorage.getItem("companyID")

	axios.get("/api/departmentmaster/get/list")
		.then((response) => {
		this.setState({
			departmentArray: response.data		})
		})
		.catch((error) => {
		})
	}
	validation(){
		$.validator.addMethod("depRegx", function (value, element, arg) {
			return arg !== value;
		}, "Role is mandatory");
		/*$.validator.addMethod("desRegx", function (value, element, arg) {
			return arg !== value;
		}, "Please enter valid designation");
		*/$.validator.addMethod("firstRegx", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter valid first name");
		$.validator.addMethod("lastRegx", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter valid last name");
		$.validator.addMethod("approvingRegx", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter valid approving authority ID");
		$.validator.addMethod("regxEmail", function (value, element, regexpr) {
			return regexpr.test(value);
	    }   , "Please enter a valid email address.");
		$.validator.addMethod("regxBranchCode", function (value, element, arg) {
			return arg !== value;
		}, "Please select the company branch ");
		$.validator.addMethod("amtRegex", function (value, element, arg) {
			return arg !== value;
		}, "Please enter amount ");
		
		jQuery.validator.setDefaults({
			debug: true,
			success: "valid"
		});
		$("#ContactDetail").validate({
			rules: {
				branchCode: {
					required: true,
					regxBranchCode: ""
				},
				role: {
					required: true,
					depRegx: ""
				},/*
				designationVal: {
					required: true,
					desRegx: "--Select Designation--"
				},*/
				email: {
					required: true,
					regxEmail: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
				},
				firstName: {
					required: true,
					firstRegx: /^[a-zA-Z\s]+$/,
				},
				lastName: {
					required: true,
					lastRegx: /^[a-zA-Z\s]+$/,
				},
			
				// preApprovedAmount: {
				// 	required: true,
				// 	// amtRegex : /^[0-9]+(,[0-9]+)*$/,
				// },
				// preApprovedRides: {
				// 	required: true,
				// },
				// preApprovedKilometer: {
				// 	required: true,
				// },
				// employeeID: {
				// 	required: true,
				// 	//regexpremployeeID :/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/,

				// },
			},
			errorPlacement: function (error, element) {
				if (element.attr("name") === "branchCode") {
					error.insertAfter("#branchCode");
				}

				if (element.attr("name") === "role") {
					error.insertAfter("#role");
				}
				if (element.attr("name") === "departmentVal") {
					error.insertAfter("#departmentVal");
				}
				if (element.attr("name") === "designationVal") {
					error.insertAfter("#designationVal");
				}
				if (element.attr("name") === "email") {
					error.insertAfter("#email");
				}
				if (element.attr("name") === "firstName") {
					error.insertAfter("#firstName");
				}
				if (element.attr("name") === "lastName") {
					error.insertAfter("#lastName");
				}
				
				// if (element.attr("name") === "employeeID") {
				// 	error.insertAfter("#employeeID");
				// }
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

	numberWithCommas(value) {
    	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	handleComma(event){
		// var value = event.target.value;
		// var valuewithComa = this.numberWithCommas(value);
	}
	
	handleChange(event) {
		const target = event.target;
		const name = target.name;
		var value = event.target.value;	
		 var vendorLocation = document.getElementById("branchCode");
		 var department = document.getElementById("deptName");
		 var designation = document.getElementById("desgName");
   		 var departmentName = department.options[department.selectedIndex].getAttribute("deptname");
   		 var designationName = designation.options[designation.selectedIndex].getAttribute("desgname");
   		 var locationname = vendorLocation.options[vendorLocation.selectedIndex].getAttribute("branch_location");
   		 var locationId = vendorLocation.options[vendorLocation.selectedIndex].getAttribute("branch_location_id");
   
		if(name === "roless"){
			if(value === "manager" || value === "corporateadmin" ){
				this.setState({
					[name]: ["employee", event.target.value]
				});	
			}else{
				this.setState({
					[name]: [event.target.value]
				});
			}
			this.setState({
				[name]: [event.target.value]
			});
		}else{
			this.setState({
				[name]: event.target.value,
				"workLocation" : locationname,
				"workLocationId" :locationId,
				"departmentName" :departmentName,
				"designationName" :designationName
			},()=>{
			});
		}		
					
	}
	locationdetailBack(event) {
		event.preventDefault();
		var entityID = this.props.match.params.entityID;
		if (this.state.branchCode || this.state.firstName || this.state.lastName || this.state.email || this.state.departmentVal || this.state.designationVal || this.state.employeeID) {
			swal({
				// title: "abc",
				text: "It seems that you are trying to enter contact details. Click 'Cancel' to continue entering contact details. Click 'Ok' to go to next page. But you may lose values already entered in the contact details form.",
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
					if(entityID === undefined){
					this.props.history.push("/"+this.state.pathname+"/location-details");
					}else{
					this.props.history.push("/"+this.state.pathname+"/location-details/" + entityID);
					}
				}else{
					if(entityID === undefined){
					this.props.history.push("/"+this.state.pathname+"/contact-details");
					}else{
					this.props.history.push("/"+this.state.pathname+"/contact-details/" + entityID);
					}
				}
			})
			$(".OkButtonSwal").parents('.swal-button-container').addClass('postionSwalRight');
			$(".CancelButtonSwal").parents('.swal-button-container').addClass('postionSwalLeft');
		} else {
			if(entityID === undefined){
			this.props.history.push("/"+this.state.pathname+"/location-details");
			}else{
			this.props.history.push("/"+this.state.pathname+"/location-details/" + entityID);
			}
		}
	}
	contactdetailBtn(event) {
		event.preventDefault();
		var entityID = this.props.match.params.entityID;
		if (this.state.branchCode || this.state.firstName || this.state.lastName || this.state.email || this.state.departmentVal || this.state.designationVal || this.state.employeeID) {
			swal({
				// title: "abc",
				text: "It seems that you are trying to enter contact details. Click 'Cancel' to continue entering contact details. Click 'Ok' to go to next page. But you may lose values already entered in the contact details form.",
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
						if(entityID === undefined){
						this.props.history.push("/"+(this.state.pathname === "appCompany" ? "appCompany/basic-details" :this.state.pathname+"/list"));
						}else{
						this.props.history.push("/"+(this.state.pathname === "appCompany" ? "org-profile" :this.state.pathname+"/list"));
						}
					}else{
						if(entityID === undefined){
						this.props.history.push("/"+this.state.pathname+"/contact-details");
						}else{
						this.props.history.push("/"+this.state.pathname+"/contact-details/" + entityID);
						}
					}
				})
			$(".OkButtonSwal").parents('.swal-button-container').addClass('postionSwalRight');
			$(".CancelButtonSwal").parents('.swal-button-container').addClass('postionSwalLeft');
		} else {
			if(entityID === undefined){
			this.props.history.push("/"+(this.state.pathname === "appCompany" ? "appCompany/basic-details" :this.state.pathname+"/list"));
			}else{
			this.props.history.push("/"+(this.state.pathname === "appCompany" ? "org-profile" :this.state.pathname+"/list"));
			}
		}
	}
	contactdetailAddBtn(event) {
		event.preventDefault();
		
		var entityID = this.props.entityID ? this.props.entityID : this.props.match.params.entityID;
		//var entityID = this.props.match.params.companyID;
			var formValues = {
				'entityID' 						: entityID,
				'contactDetails' 				: {
					'branchCode'        		: this.state.branchCode,
					'branchName'        		: this.state.workLocation,
					'firstName'               	: this.state.firstName,
					'middleName'               	: this.state.middleName,
					'lastName'                	: this.state.lastName,
					'phone'             		: this.state.phone,
					'altPhone'          		: this.state.altPhone,
					'DOB'          				: this.state.DOB,
					'gender'          			: this.state.gender,
					'whatsappNo'          		: this.state.whatsappNo ? this.state.whatsappNo : "",
					'email'             		: this.state.email,
					'department'        		: this.state.departmentVal,
					'departmentName'        	: this.state.departmentName,
					'designationName'       	: this.state.designationName,
					'designation'       		: this.state.designationVal,
					'employeeID'        		: this.state.employeeID,
					'createUser'        		: this.state.createUser,
					'role' 						: this.state.createUser ? this.state.role : "",
          			'addEmployee'       		: this.state.addEmployee,
				}
			}
			const main = async()=>{
				if ($('#ContactDetail').valid()) {
					if(this.state.createUser === true && this.state.listOfEmpID.indexOf(this.state.employeeID) === -1){
						formValues.contactDetails.userID = await this.createUser();
						formValues.contactDetails.personID = await this.savePerson(formValues.contactDetails.userID);
						var formValues1 = {
							userID: formValues.contactDetails.userID,
							role: "employee",
						}
						if(this.state.pathname === "corporate" && (this.state.role === "manager" || this.state.role === "corporateadmin" ))
						{
							axios
							.patch('/api/users/patch/role/assign/' + formValues1.userID, formValues1)
							.then(
							(res) => {})
							.catch((error) => {});
						}
						var sendData = {
							"event": "Event3", //Event Name
							"toUser_id": formValues.contactDetails.userID, //To user_id(ref:users)
							"toUserRole":this.state.role,
							"company_id": this.state.entityID, //company_id(ref:entitymaster)
							"otherAdminRole":'client',
							"variables": {
							  'EmployeeName': this.state.firstName + ' ' + this.state.lastName,
							  'CompanyName': this.state.companyName,
							  'Password': "welcome123",
							  'mobileNo': this.state.phone,
							  'email': this.state.email,
							  'sendUrl': this.state.url+"/login",
							}
						  }
						axios.post('/api/masternotifications/post/sendNotification', sendData)
						.then((res) => {
						//console.log('sendDataToUser in result==>>>', res.data)
						})
						.catch((error) => { console.log('notification error: ',error)})
					}
					this.saveContact(formValues);
				} else {
					$(event.target).parent().parent().parent().find('.errorinputText .error:first').focus();
				}
			}
			
			main();
	}
	createUser = ()=>{
		var userDetails = {
			firstname				: this.state.firstName,
			lastname				: this.state.lastName,
			mobNumber				: this.state.phone,
			email					: this.state.email,
			companyID				: this.state.companyID,
			companyName				: this.state.companyName,
			pwd						: "welcome123",
			company_id				: this.state.entityID,
			role					: this.state.pathname === "appCompany"  ? "admin" : [ this.state.role ],
			status					: 'active',
			"emailSubject"	: "Email Verification",
			"emailContent"	: "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
		}
		console.log("userDetails",userDetails);
		return new Promise(function(resolve, reject){
			axios.post('/api/auth/post/signup/user', userDetails)
			.then((response)=>{
				resolve(response.data.ID);
				if(response.data.message === 'USER_CREATED'){
					
				}else{
					swal(response.data.message);
				}
				
			})
			.catch((error)=>{})
		})
	}

	savePerson = (userID)=>{
		if(userID){
		var userDetails = {
			type                    : "employee",
			companyID				: this.state.companyID,
			company_Id				: this.state.entityID,
			companyName 		    : this.state.companyName,
			workLocation            : this.state.workLocation,
			workLocationId          : this.state.workLocationId,
			branchCode              : this.state.branchCode,
			firstName               : this.state.firstName,
			middleName              : this.state.middleName ? this.state.middleName : "",
			lastName                : this.state.lastName,
			DOB                     : this.state.DOB ? this.state.DOB : "",
			gender                  : this.state.gender ? this.state.gender : "",
			contactNo               : this.state.phone,
			altContactNo            : this.state.altPhone,
			email                   : this.state.email,
			whatsappNo              : this.state.whatsappNo ? this.state.whatsappNo : "",
			departmentId            : this.state.departmentVal,
			designationId           : this.state.designationVal,
			profilePhoto            : this.state.profilePhoto,
			empCategory             : this.state.empCategory ? this.state.empCategory : "",
            empPriority             : this.state.empPriority ? this.state.empPriority : "",
			employeeId              : this.state.employeeID,
			userId 					: userID,
			status					: "Active",
		  }
		  return new Promise(function(resolve, reject){
			axios.post('/api/personmaster/post' ,userDetails)
			.then((response) => {
				resolve(response.data.PersonId);
			})
			.catch((error) => {})
		  })
		}
	}

	saveContact = (formValues)=>{
		if(this.state.listOfEmpID.indexOf(this.state.employeeID)>-1)
		{
			swal("Employee ID already exists..!")
		}else{
		axios.patch('/api/entitymaster/patch/addContact' ,formValues)
		.then((response) => {
				if(response.data.duplicated)
				{
					swal({
						title : "Contact already exists.",
					});

				}else{
					this.contactDetails();
					this.getAllEntites()

					swal({
						title : "Contact added successfully.",
						text : this.state.createUser ? "Login credentials created and emailed to user. \n LoginID : "+this.state.email+" \n Default Password :"+"welcome123 \n Contact also added in client master." : ""
					});

					this.setState({
						'firstName'               	: '',
						'lastName'                	: '',
						'phone'            		 	: '',
						'altPhone'          		: '',
						'email'             		: '',
						'branchCode'        		: '',
						'departmentVal'        		: '',
						'designationVal'       		: '',
						'employeeID'        		: '',
						'createUser' 				: false,
						'addEmployee'				: false,
						'role' 		 				: '',
						'openForm'					: this.props.modal ? true : false,
					})
				}
				
			})
			.catch((error) => {
			
			})
		}
	}
	getBranchCode() {
		var entityID = this.props.entityID ? this.props.entityID  : this.state.entityID;
		if(entityID && entityID !== ''){
			axios.get('/api/entitymaster/get/one/' + entityID)
			.then((response) => {
				console.log("response for getbranchc",response);
				this.setState({
					companyID: response.data[0].companyID,
					companyName: response.data[0].companyName,
					branchCodeArry: response.data[0].locations
				})
			})
			.catch((error) => {})
		}
	}
	updatecontactdetailAddBtn(event) {
		event.preventDefault();
		var entityID = this.state.entityID;
		var contactID = this.state.contactID;

		
			var formValues = {
				'entityID' 			: entityID,
				'contactID' 		: contactID,
				'contactDetails' 				: {
					'branchCode'        		: this.state.branchCode,
					'branchName'        		: this.state.workLocation,
					'firstName'               	: this.state.firstName,
					'middleName'                : this.state.middleName,
					'lastName'                	: this.state.lastName,
					'phone'             		: this.state.phone,
					'altPhone'          		: this.state.altPhone,
					'whatsappNo'          		: this.state.whatsappNo ? this.state.whatsappNo:"",
					'email'             		: this.state.email,
					'DOB'             			: this.state.DOB,
					'gender'             		: this.state.gender,
					// 'department'        		: this.state.departmentVal,
					// 'designation'       		: this.state.designationVal,
					'departmentName'        	: this.state.departmentName,
					'designationName'       	: this.state.designationName,
					'empCategory'               : this.state.empCategory ? this.state.empCategory :"",
                	'empPriority'               : this.state.empPriority ? this.state.empPriority : "",
					'employeeID'        		: this.state.employeeID,
				    'role' 						: this.state.createUser ? this.state.role : "", 
                    'addEmployee'       		: this.state.addEmployee,
                    address: this.state.addressLine1 !=="" ? [{
                    addressLine1                : this.state.addressLine1,
                    addressLine2                : this.state.addressLine2,
                    landmark                    : this.state.landmark,
                    area                        : this.state.area,
                    city                        : this.state.city,
                    district                    : this.state.district,
                    state                       : this.state.states.split('|')[1],
                    stateCode                   : this.state.states.split('|')[0],
                    country                     : this.state.country.split('|')[1],
                    countryCode                 : this.state.country.split('|')[0],
                    pincode                     : this.state.pincode,
                    addressProof                : this.state.addressProof,
                }] : [],
       

				}
			}
			const main = async()=>{
				if ($('#ContactDetail').valid()) {
					if(this.state.alreadyHasUser === true){
						this.updateUser();
						this.updatePerson();
					}else if(this.state.createUser === true){
						formValues.contactDetails.userID = await this.createUser();
						formValues.contactDetails.personID = await this.savePerson(formValues.contactDetails.userID);
					}
					
					this.updateContact(formValues);
				}else{
					$(event.target).parent().parent().parent().find('.errorinputText.error:first').focus();
				}
			}
			main();
		
	}
	updateUser = ()=>{
		if(this.state.alreadyHasUser && this.state.createUser === false)
		{
			
			var id = this.state.userID;
			const token = '';
			const url = '/api/users/delete/' + id;
			const headers = {
				"Authorization": token,
				"Content-Type": "application/json",
			};
			axios({
				method: "DELETE",
				url: url,
				headers: headers,
				timeout: 3000,
				data: null,
			})
				.then((response) => {
				}).catch((error) => {
				});
			
		}else{
		var userDetails = {
			firstname			: this.state.firstName,
			lastname			: this.state.lastName,
			mobNumber			: this.state.phone,
			companyID			: this.state.companyID,
			email					: this.state.email,
			companyName			: this.state.companyName,
			pwd						: "welcome123",
			role					: this.state.pathname === "appCompany"  ? "admin" : [this.state.role],
			status				: 'active',
			"emailSubject"		: "Email Verification",
			"emailContent"		: "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
		}
		console.log("userDetails",userDetails);
		var userid = this.state.userID;
		axios.patch('/api/users/patch/' + userid, userDetails)
		.then((response)=>{
			if(response.data.message  === 'USER_CREATED'){
			}else{
				swal(response.data.message);
			}
			
		})
		.catch((error)=>{})
    	}
	}
	updatePerson = ()=>{
		if(this.state.alreadyHasUser && this.state.createUser === false)
		{
		   axios.delete("/api/personmaster/delete/"+this.state.personID)
			.then((response) => {
				
			})
			.catch((error) => {})
		}
		else{
		var userDetails = {
			personID        		: this.state.personID,
			companyID				: this.state.companyID,
			company_Id				: this.state.entityID,
			companyName 		    : this.state.companyName,
			branchCode              : this.state.branchCode,
			workLocation            : this.state.workLocation,
			workLocationId          : this.state.workLocationId,
			type                    : 'employee',
			firstName               : this.state.firstName,
		    middleName              : this.state.middleName,
			lastName                : this.state.lastName,
			DOB                     : this.state.DOB,
			gender                  : this.state.gender,
			contactNo               : this.state.phone,
			altContactNo            : this.state.altPhone,
			empCategory             : this.state.empCategory ? this.state.empCategory : "",
            empPriority             : this.state.empPriority ? this.state.empPriority : "",
			email                   : this.state.email,
			whatsappNo              : this.state.whatsappNo ? this.state.whatsappNo : "",
			departmentId            : this.state.departmentVal,
			designationId           : this.state.designationVal,
			profilePhoto            : this.state.profilePhoto,
			employeeId              : this.state.employeeID,
            address: this.state.country !=="-- Select --" ? [{
                    addressLine1                : this.state.addressLine1,
                    addressLine2                : this.state.addressLine2,
                    landmark                    : this.state.landmark,
                    area                        : this.state.area,
                    city                        : this.state.city,
                    district                    : this.state.district,
                    state                       : this.state.states.split('|')[1],
                    stateCode                   : this.state.states.split('|')[0],
                    country                     : this.state.country.split('|')[1],
                    countryCode                 : this.state.country.split('|')[0],
                    pincode                     : this.state.pincode,
                    addressProof                : this.state.addressProof,
                }] : [],
       
		  }
			axios.patch('/api/personmaster/patch',userDetails)
			.then((response) => {
				
			})
			.catch((error) => {})
		}
		  
	}
	updateContact = (formValues)=>{
		axios.patch('/api/entitymaster/patch/updateSingleContact', formValues)
		.then((response) => {
			this.contactDetails();
			this.setState({
				'contactID' 				: '',
				'firstName'               	: '',
				'lastName'                	: '',
				'phone'            		 	: '',
				'altPhone'          		: '',
				'email'             		: '',
				'branchCode'        		: '',
				'departmentVal'        		: '',
				'designationVal'       		: '',
				
				'employeeID'        		: '',
				'role'        				: '',
				'bookingApprovalRequired' 	: "No",
				'createUser' 				: false,
				'addEmployee'				: false,
				'openForm'					: false,
				editData                    : null
			})
			this.props.history.push("/"+this.state.pathname+'/contact-details/'+this.props.match.params.entityID);
			swal("Contact updated successfully.");
		})
		.catch((error) => {
			
		})
	}
	edit() {
		var entityID = this.state.entityID;
		var contactID = this.state.contactID;

		var formValues = {
			entityID : entityID,
			contactID :  contactID
		}
		console.log("formValues",formValues);
		if (entityID && contactID) {
			
			axios.post('/api/entitymaster/post/singleContact', formValues)
				.then((response) => {
					console.log("response for contactttttt",response);
					
					var contactDetails = response.data.contactPersons;
					console.log("response for contactDetails[0].departmentName",contactDetails[0].departmentName);
					this.setState({
						'openForm'					: true,
						'branchCode'        		: contactDetails[0].branchCode,
						'workLocation'        		: contactDetails[0].branchName,
						"workLocationId"			: contactDetails[0].workLocationId,
						'firstName'               	: contactDetails[0].firstName,
						'lastName'                	: contactDetails[0].lastName,
						'middleName'               	: contactDetails[0].middleName ? contactDetails[0].middleName : "",
						'whatsappNo'          		: contactDetails[0].whatsappNumber ? contactDetails[0].whatsappNumber: "", 
						'DOB'          				: contactDetails[0].DOB ? contactDetails[0].DOB : "",
						'gender'          		    : contactDetails[0].gender ? contactDetails[0].gender: "", 
						'profilePhoto'          	: contactDetails[0].profilePhoto ? contactDetails[0].profilePhoto: "",
						'addressLine1'				: contactDetails[0].address[0] ? contactDetails[0].address[0].addressLine1 : "",
			            'addressLine2'				: contactDetails[0].address[0] ? contactDetails[0].address[0].addressLine2 : "",
			            'landmark'					: contactDetails[0].address[0] ? contactDetails[0].address[0].landmark : "",
			            'area' 						: contactDetails[0].address[0] ? contactDetails[0].address[0].area : "",
			            'city' 						: contactDetails[0].address[0] ? contactDetails[0].address[0].city : "",
			            'district'					: contactDetails[0].address[0] ? contactDetails[0].address[0].district : "",
			            'states'					: contactDetails[0].address[0] ? contactDetails[0].address[0].stateCode + "|" + contactDetails[0].address[0].state : "",
			            'country'					: contactDetails[0].address[0] ? contactDetails[0].address[0].countryCode + "|" + contactDetails[0].address[0].country : "-- Select --",
			            'pincode'					: contactDetails[0].address[0] ? contactDetails[0].address[0].pincode : "",
			               
						'phone'             		: contactDetails[0].phone,
						'altPhone'          		: contactDetails[0].altPhone,
						'email'             		: contactDetails[0].email,
						'departmentVal'        		: contactDetails[0].department,
						'departmentName'        	: contactDetails[0].departmentName,
						'designationName'       	: contactDetails[0].designationName,
						'designationVal'       		: contactDetails[0].designation,
						'employeeID'        		: contactDetails[0].employeeID,
						'empCategory'        		: contactDetails[0].empCategory,
						'empPriority'        		: contactDetails[0].empPriority,

						'role'        				: contactDetails[0].role,
						'createUser'        		: contactDetails[0].createUser ? contactDetails[0].createUser : false,
						'addEmployee'       		: contactDetails[0].addEmployee,
						'userID' 					: contactDetails[0].userID,
						'personID' 					: contactDetails[0].personID,
						'alreadyHasUser' 			: contactDetails[0].createUser,
						'alreadyHasEmployee' 		: contactDetails[0].addEmployee,
						
					},()=>{
						if(this.state.openForm === true){
							this.validation();
							$('#email').attr('disabled','true');
							$('#employeeID').attr('disabled','true');
						}
						if(this.state.createUser === true){
							$('#createUser').attr('disabled','true');
						}
						if(this.state.addEmployee === true){
							$('#addEmployee').attr('disabled','true');
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
		var contactID = event.target.id;
		var email = event.currentTarget.getAttribute("email_ID");
		axios.delete('/api/entitymaster/contact/delete/'+contactID)
			.then((response) => {

				this.setState({
					'openForm'			: false,
					'contactID' 		: '',
					'firstName'         : '',
					'lastName'          : '',
					'phone'             : '',
					'altPhone'          : '',
					'email'             : '',
					'createUser' 		: false,
					'employeeID'        : '',
					'role'				: '',
					'branchCode'        		: '',
					'departmentVal'        		: '',
					'designationVal'       		: '',
				})
				axios.get('/api/personmaster/get/emailID/' + email)
					.then((response) => {
						this.setState({
							personID: response.data.data[0]._id,
							userId: response.data.data[0].userId,
							username: response.data.data[0].firstName + " " + response.data.data[0].lastName

						},()=>{
							axios.delete("/api/personmaster/delete/"+this.state.personID)
					            .then((response)=>{
					            	/*var formValues = {
										selectedUser: this.state.userId,
										status: 'deleted',
										username: this.state.username,
									}*/
									var id = this.state.userId;
									const token = '';
									const url = '/api/users/delete/' + id;
									const headers = {
										"Authorization": token,
										"Content-Type": "application/json",
									};
									axios({
										method: "DELETE",
										url: url,
										headers: headers,
										timeout: 3000,
										data: null,
									})
									.then((response) => {})
									.catch((error) => {});
											           		
				            })

						})
					})
					.catch((error) => {
						
					})
	            .catch((error)=>{
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
					contactarray: response.data[0].contactData

				})
			})
			.catch((error) => {
				
			})
	}
	toggle(event){
		this.setState({
		  [event.target.name] : event.target.checked
		})
	}
	// bookingApproval(val,event) {
	// 	this.setState({
	// 		bookingApprovalRequired : val
	// 	})
	// }
	loginCredentials(val,event) {
		event.preventDefault();
		this.setState({
			createUser : val,
			//rolesArray : this.props.roles
		})
	}
	getDataTable(){
		axios.get('/api/entitymaster/get/one/' +this.props.match.params.entityID)
		.then((response)=>{
			console.log("response",response);
			var data = response.data && response.data.length > 0 && response.data[0].contactData && response.data[0].contactData.length > 0 ? response.data[0].contactData.reverse() : []
			var tableData = data.map((a, i)=>{
	        return{
	        	_id         :a._id,
	            empName:"<b>Name :</b> "+"<a  title='View profile' target='_blank' href='/employee-profile/"+(a.personID)+"'>"+a.firstName + " " + a.lastName+"</a>" + " <br><b>Emp ID :</b> " + (a.employeeID? a.employeeID :"- NA -" ),
	            contactDetails:"<b>Mob Number :</b> "+(a.phone ? a.phone :"- NA -") + (a.whatsupNumber ? " | " + a.whatsupNumber : "" ) + "<br><b> Email : </b> " +a.email,
	            approvingAuthorityId1:a.bookingApprovalRequired="Yes" ? ("<b>Emp ID : </b>"+(a.approvingAuthorityId1 ? a.approvingAuthorityId1 :"- NA -")+ "<br><b>Name : </b>" +a.approvingAuthorityName ) : "- NA -",
	            approvingAuthorityId2:a.bookingApprovalRequired="Yes" ? ("<b>Emp ID : </b>"+(a.approvingAuthorityId2 ? a.approvingAuthorityId2 :"- NA -")+ "<br><b>Name : </b>" +a.approvingAuthorityName ) : "- NA -",
	            approvingAuthorityId3:a.bookingApprovalRequired="Yes" ? ("<b>Emp ID : </b>"+(a.approvingAuthorityId3 ? a.approvingAuthorityId3 :"- NA -")+ "<br><b>Name : </b>" +a.approvingAuthorityName ) : "- NA -",
	            preApprovedLimits :a.bookingApprovalRequired="Yes"  ? ("<b>Amount :</b> " + (a.preApprovedAmount ? a.preApprovedAmount :"- NA -") + "<br><b>Kilometer :</b> " + (a.preApprovedKilometer ? a.preApprovedKilometer :"- NA -") + "<br><b>Rides : </b>" + (a.preApprovedRides ? a.preApprovedRides :"- NA -")):"- NA -",
	        }
	      })
          this.setState({RecordsTable:tableData})
			
		})
		.catch((error)=>{})
	}
	getData(data){
		this.setState({
			'preApprovedAmount'      : data.preApprovedAmount,
            'preApprovedRides'       : data.preApprovedRides,
            'preApprovedKilometer'  : data.preApprovedKilometer,
            // 'approvingAuthorityId1'     : data.approvingAuthorityId1,
            // 'approvingAuthorityId2'     : data.approvingAuthorityId2,
            // 'approvingAuthorityId3'     : data.approvingAuthorityId3,
            'bookingApprovalRequired'   : data.bookingApprovalRequired,
		})
	}
	showView(value,event){
    	this.contactDetails()    
		$('.viewBtn').removeClass('btnactive');
        $(event.target).addClass('btnactive');
    	this.setState({
    		view : value
    	})
    }

    departmentModalClickEvent(){
	    $('#departmentModalId').addClass('in');
	    $('#departmentModalId').css('display','block');
	    $('body').removeClass('modal-open');
	    $('.modal-backdrop').remove();
	  }  

	  designationModalClickEvent(){
	    $('#designationModalId').addClass('in');
	    $('#designationModalId').css('display','block');
	    $('body').removeClass('modal-open');
	    $('.modal-backdrop').remove();
	  }


	render() {
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
						<section className="content OrgSettingFormWrapper">
							<div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
									 {
										 this.state.pathname !="appCompany" ?
						                  <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">{this.state.pathname ? this.state.pathname : "Entity"} Master</h4>
						                  :
						                  <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Organizational Settings</h4>
					  
					                }
									<div title="Go to Admin" className="col-lg-1 col-md-1 col-xs-1 col-sm-1 NOpadding-right">
										{this.props.vendorData ? <div onClick={this.admin.bind(this)} className="redirectToAdmin col-lg-5 col-lg-offset-7 col-md-10 col-xs-10 col-sm-10 fa fa-arrow-right"></div> : null}
									</div>
								</div>
								{!this.props.modal ?
									<div className="nav-center OnboardingTabs col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<ul className="nav nav-pills vendorpills col-lg-10 col-lg-offset-1 col-md-8 col-md-offset-3 col-sm-12 col-xs-12">
											<li className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne NOpadding-left btn1 disabled">
												<a href={this.props.match.params.entityID ? "/"+this.props.entity+"/basic-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/basic-details"} className="basic-info-pillss pills backcolor">
													<i className="fa fa-info-circle" aria-hidden="true"></i> &nbsp;
													Basic Info
												</a>
												<div className="triangleone " id="triangle-right"></div>
											</li>
											<li className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn2 disabled">
												<div className="triangletwo" id="triangle-right1"></div>
												<a href={this.props.match.params.entityID ? "/"+this.props.entity+"/department-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/department-details" } className="basic-info-pillss backcolor">
													<i className="fa fa-map-marker iconMarginLeft" aria-hidden="true"></i> &nbsp;
													Departments
												</a>
												<div className="trianglethree forActive" id="triangle-right"></div>
											</li>
											<li className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn2 disabled">
												<div className="triangletwo" id="triangle-right1"></div>
												<a href={this.props.match.params.entityID ? "/"+this.props.entity+"/location-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/location-details" } className="basic-info-pillss backcolor">
													<i className="fa fa-map-marker iconMarginLeft" aria-hidden="true"></i> &nbsp;
													Locations
												</a>
												<div className="trianglethree forActive" id="triangle-right"></div>
											</li>
											<li className="active col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab noRightPadding pdcls btn4 ">
												<div className="trianglesix" id="triangle-right2"></div>
												<a href={this.props.match.params.entityID ? "/"+this.props.entity+"/contact-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/contact-details"} className="basic-info-pillss backcolor">
													<i className="fa fa-phone phoneIcon" aria-hidden="true"></i> &nbsp;
													Contacts
												</a>
											</li>
										</ul>
									</div>
									:
									null
								}
								<section className="Content contactSection">
									<div className="row">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 NOpadding">
												<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12">
													<div className="col-lg-3 col-md-6 col-sm-6 col-sm-6 contactDetailTitle">
														<h4 className="MasterBudgetTitle"><i className="fa fa-phone" aria-hidden="true"></i> Contact Details</h4>
													</div>
													<div className="col-lg-6 col-md-6 col-sm-6 col-sm-6 ">
														{/* <h4 className="noteSupplier">Note: Please start adding contacts from 1st point of contact to higher authority.</h4> */}
													</div>
													{!this.props.modal&&<div className="col-lg-3 col-md-6 col-sm-6 col-sm-6 contactDetailTitle">
														<div className="button4 col-lg-6 pull-right" onClick={this.openForm.bind(this)}>
														{
															this.state.openForm === true ?
															<i className="fa fa-minus-circle" aria-hidden="true"></i>
															:
															<i className="fa fa-plus-circle" aria-hidden="true"></i>
														}   &nbsp;Add Contact
															
														</div>
													</div>}
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formHrTag"></div>
												</div>
												{
													this.state.openForm === true ?
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
															<form id="ContactDetail" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
																		{
																			this.state.branchCodeArry && this.state.branchCodeArry.length > 0
																			?
																			<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Company Branch <sup className="astrick">*</sup></label>																		
																			:
																			<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Company Branch <sup className="astrick">*</sup><span className="anyQuestion" title="In Location form, if you add Office location, then only it will show up here.">Any ?</span></label>
																		}
																		
																		<select id="branchCode" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 errorinputText" value={this.state.branchCode} ref="branchCode" name="branchCode" onChange={this.handleChange.bind(this)} required>
																			<option value="" disabled={true}>--Select Company Branch--</option>
																			{console.log("this.state.branchCodeArry>>>>",this.state.branchCodeArry)}
																			{
																				this.state.branchCodeArry && this.state.branchCodeArry.length > 0 ?
																					this.state.branchCodeArry.map((data, index) => {
																						// if(data.branchCode){
																							return (
																								<option key={index} branch_location_id={data._id} branch_location={(data.addressLine2 ? data.addressLine2 : "") +" "+(data.addressLine1)} value={data.branchCode}>{((data.locationType).match(/\b(\w)/g)).join('')} - {data.area} {data.city}, {data.stateCode} - {data.countryCode}</option>
																							);
																						// }
																					}
																					)
																					:
																					null
																			}
																		</select>
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
																		<div id="departmentVal">
																			<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Department </label>
																			<div className={!this.props.modal&& "input-group"} id="selectField" > 
																				<select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
																					ref="departmentVal" value={this.state.departmentName} name="departmentVal" onChange={this.handleChange.bind(this)} id="deptName">
																					<option value="" disabled={true}>--Select Department--</option>
																					{
																					this.state.departmentArray && this.state.departmentArray.length > 0 ?
																						this.state.departmentArray.map((deptData, index) => {
																						return (
																							<option key={index} value={deptData.departmentName} deptname={deptData.department}>{(deptData.department)}</option>
																						);
																						}
																						) : ''
																					}
																				</select>
																				{!this.props.modal&&<div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#departmentModalId"  onClick={this.departmentModalClickEvent.bind(this)} title="Add Department" ><i className="fa fa-plus "></i>
	                                      										</div>}
																			</div>
																		</div>
																	</div>	
																	<div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
																		<div id="designationVal">
																			<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Designation</label>
																			<div className={!this.props.modal&& "input-group"} i id="selectField" > 		
																					<select  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" ref="designationVal" value={this.state.designationName} name="designationVal" onChange={this.handleChange.bind(this)} id="desgName">
																						<option value="" disabled={true}>--Select Designation--</option>
																						{
																						this.state.designationArray && this.state.designationArray.length > 0 ?
																							this.state.designationArray.map((desData, index) => {
																							return (
																								<option key={index} value={desData.designationName} desgname={desData.designation}>{(desData.designation)}</option>
																							);
																							}) : ''
																						}
																				</select>
																				{!this.props.modal&&<div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#designationModalId"  onClick={this.designationModalClickEvent.bind(this)} title="Add Designation" ><i className="fa fa-plus "></i>
		                                      									</div>}
																			</div>
																		</div>
																	</div>
																</div>
																<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 "  >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Employee ID </label>
																		<input type="text" id="employeeID" className="errorinputText form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.employeeID} ref="employeeID" name="employeeID" onChange={this.handleChange.bind(this)} />
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">First Name <sup className="astrick">*</sup></label>
																		<input id="firstName" maxLength="25" type="text" className="errorinputText form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.firstName} ref="firstName" name="firstName" onChange={this.handleChange.bind(this)} required />
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Last Name <sup className="astrick">*</sup></label>
																		<input id="lastName" maxLength="25" type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.lastName} ref="lastName" name="lastName" onChange={this.handleChange.bind(this)} required />
																	</div>
																	
																</div>
																<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Email <sup className="astrick">*</sup></label>
																		<input id="email" type="email" maxLength="30" className="errorinputText form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.email} ref="email" name="email" onChange={this.handleChange.bind(this)} required />
																	</div>
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
																<div className="height40 form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 ">
																			<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Create Login Credentials</label>
																			<div className="btn-group btn-group-toggle" data-toggle="buttons">
																				<label className={this.state.createUser === true ? "btn toggleButton customToggleButtonPermission btn-secondary active":"btn toggleButton customToggleButtonPermission btn-secondary"} value={true} onClick={this.loginCredentials.bind(this,true)}>
																				<input type="radio"
																					name="options" 
																					id="yes"
																					value={true}
																					autoComplete="off"
																					checked
																					/>Yes
																				</label>
																				<label className={this.state.createUser === false ? "btn toggleButton customToggleButtonPermission btn-secondary active":"btn toggleButton customToggleButtonPermission btn-secondary"} value={false} onClick={this.loginCredentials.bind(this,false)} >
																				<input type="radio" name="options" id="no"  value="no" autoComplete="off" /> No
																				</label>
																			</div>
																	</div>
																	{
																	this.state.createUser ? 

																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" > 
																		<div>
							                                            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Role <i className="astrick">*</i></label>
							                                            <select className="errorinputText form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
							                                              ref="role" name="role" id="role" value={this.state.role} onChange={this.handleChange}>
							                                              <option value="" disabled={true}>-- Select Role --</option>
							                                              {this.state.rolesArray && this.state.rolesArray.length > 0 ?
																				this.state.rolesArray.map((rolesArray, index) => {
																				return (
																					<option key={index} value={rolesArray.role}>{rolesArray.role}</option>
																				);
																				}) : ''
																			}
							                                            </select>
							                                       		</div>
							                                        </div>
							                                        :
							                                        null
							                                    }
																		
																	
																</div>

																<div className="col-lg-7 col-md-7 col-sm-7 col-xs-7 contactSubmit pull-right">
																	{this.props.match.params.entityID || this.props.entityID?
																		this.state.contactID ?
																			<button className="button3 btn pull-right" onClick={this.updatecontactdetailAddBtn.bind(this)} data-id={this.state.contactValue}>Update Contact</button>
																			:
																			<button className="button3 btn pull-right" onClick={this.contactdetailAddBtn.bind(this)}>Submit</button>
																		:
																		null
																		}
																</div>
															</form>
														</div>
														:
														null
												}
											{!this.props.modal&&<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<button className="button2" onClick={this.locationdetailBack.bind(this)}><i className="fa fa-angle-double-left" aria-hidden="true"></i>&nbsp;Location Details</button>
												<button className="button1 pull-right" onClick={this.contactdetailBtn.bind(this)}>Finish&nbsp;</button>
											</div>}
											{!this.props.modal&& this.state.contactarray && this.state.contactarray.length > 0  &&
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<div className="col-lg-2 col-md-2 col-sm-6 col-xs-12 pull-right NOPadding">
													<i className="fa fa-th-list fa-lg btn viewBtn  pull-right"  title="List View" name="view" ref="view" value={this.state.view} onClick={this.showView.bind(this,'List')} onChange={this.handleChange} aria-hidden="true"></i>
													<i className="fa fa-th fa-lg btn viewBtn pull-right btnactive" name="view"  title="Grid View" ref="view" value={this.state.view} onClick={this.showView.bind(this,'Grid')} onChange={this.handleChange} aria-hidden="true"></i>&nbsp;&nbsp;
												</div>
											</div>}
											{this.state.view === 'List' ?
											<IAssureTable 
						                      tableHeading={this.state.tableHeading}
						                      dataCount={this.state.entityCount}
						                      tableData={this.state.RecordsTable}
						                      tableObjects={this.state.tableObjects}
						                      getData={this.getDataTable.bind(this)}
						                      id={"id"}
											  tableName={"Contact"}
											  refresh={true}
						                      />
											:
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
										 	{this.state.contactarray && this.state.contactarray.length > 0 ?
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
													<h4 className=" col-lg-12 col-md-12 col-sm-12 col-sm-12 ">List of Contacts</h4>
													{console.log("this.state.contactarray  for entity",this.state.contactarray )}
													{this.state.contactarray && this.state.contactarray.length > 0 ?
														this.state.contactarray.map((data, index) => {
															return (
																<div className="col-lg-6  col-md-6  col-sm-6 col-xs-12 " key={index}>
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxul1">
																		<div className=" col-lg-1 col-md-1 col-sm-1 col-xs-1">
																			{/*<i className="fa fa-phone" aria-hidden="true"></i>*/}
																		</div>
																		<ul className="col-lg-10 col-md-10 col-sm-10 col-xs-10 palfclr addrbox">
																			<li className="fz16"><b>{data.firstName} {data.lastName} </b><span className="fz12">( Emp ID : {data.employeeID ? data.employeeID : "NA"} )</span></li>
																			<li>{data.email}, {data.phone}, {data.altPhone}</li>
																			<li>Branch Code: {data.branchCode  + ( data.locationType ? " ("+ data.locationType+ ")":"")}</li>
																			{/*<li>Branch Code: {data.branchCode +" ("+data.branchName+")"}</li>*/}
																			<li>Company Branch: {data.branchName?data.branchName :" -NA- "}</li>
																			<li>Department &  Designation : {data.departmentName && data.designationName ? data.departmentName+" , "+data.designationName : "-"}</li>
																			{/*<li>Designation: {data.designationName ? data.designationName : " -NA- "}</li>*/}

																			{data.approvingAuthorityId1 ?
																				<li>Approving Authority Employee ID 1: {data.approvingAuthorityId1}</li>	
																			:
																			null
																			}
																			{data.approvingAuthorityId2 ?
																				<li>Approving Authority Employee ID 2: {data.approvingAuthorityId2}</li>	
																			:
																			null
																			}																	
																			{data.approvingAuthorityId3 ?
																				<li>Approving Authority Employee ID 3: {data.approvingAuthorityId3}</li>	
																			:
																			null
																			}
																			{data.bookingApprovalRequired === 'Yes'?
																				<li>Booking Approval Required: Yes</li>	
																			:
																				null
																			}																		

																			{data.preApprovedAmount ?
																				<li>Pre Approved Amount:  &#8377; {data.preApprovedAmount}</li>	
																				:
																				null
																			}

																			{data.preApprovedRides?
																				<li>Pre Approved Rides : {data.preApprovedRides}</li>	
																				:
																				null
																			}
																			{data.preApprovedKilometer?
																				<li>Pre Approved Kilometer : {data.preApprovedKilometer}</li>	
																				:
																				null
																			}					
																											
																																				
																			{data.createUser?
																				<li><i className="fa fa-sign-in" aria-hidden="true"></i>&nbsp;Created Login Credentials: Yes <br/> Role: {data.role}</li>	
																			:
																			<li><i className="fa fa-sign-in" aria-hidden="true"></i>&nbsp;Created Login Credentials: No</li>
																			}																			
																		</ul>
																		<div className="liheader1 dropdown col-lg-1 col-md-1 col-sm-1 col-xs-1">
																			<i className="fa fa-ellipsis-h dropbtn" aria-hidden="true"></i>
																			<div className="dropdown-content dropdown-contentLocation">
																				<ul className="pdcls ulbtm">
																					<li name={index}>
																						<a href={"/"+this.state.pathname+"/contact-details/" + this.props.match.params.entityID + "/" + data._id}><i className="fa fa-pencil penmrleft" aria-hidden="true"></i>&nbsp;&nbsp;Edit</a>
																					</li>
																					<li name={index}>
																						<span onClick={this.contactDelete.bind(this)} email_ID={data.email} id={data._id}><i className="fa fa-trash-o" aria-hidden="true"></i> &nbsp; Delete</span>
																					</li>
																				</ul>
																			</div>
																		</div>
																	</div>
																</div>
															);
														})
													:
													<div className="textAlign">Contacts will be shown here.</div>
													}
												</div>
												:
												!this.props.modal&&<div className="textAlign">No Contacts Found.</div>
											}
									      	</div>
								 		}
											</div>
										</div>
									
									</div>
								</section>
							</div>
						</section>
					</div>
				</div>
				 <div className="modal" id="departmentModalId" role="dialog">
		            <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
		              <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
		                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
		                      <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getDepartment.bind(this)}>&times;</button>
		                 </div>
		                </div>
		                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                  	<Department  
			                  	editId  = 	{this.props.match.params.fieldID} 
			                  	editUrl = 	{
			                  					this.props.match.params.entityID && this.props.match.params.contactID ?
			                  				 	'/'+this.props.url+'/contact-details-modal/'+this.props.match.params.entityID+"/"+this.props.match.params.contactID 
			                  				 	:this.props.match.params.entityID ?
			                  				 	'/'+this.props.url+'/contact-details-modal/'+this.props.match.params.entityID
			                  				 	:!this.props.modal ?
			                  				 	'/'+this.props.url+'/contact-details-modal'
			                  				 	:
			                  				 	'/'+this.props.url
			                  				} 
		                  	/>
		                </div>  
		             </div>
		            </div>
		          </div>
		           <div className="modal" id="designationModalId" role="dialog">
		            <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
		              <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
		                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
		                      <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getDesignation.bind(this)}>&times;</button>
		                 </div>
		                </div>
		                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                  	<Designation  
			                  	editId  = 	{this.props.match.params.fieldID} 
			                  	editUrl = 	{
			                  					this.props.match.params.entityID && this.props.match.params.contactID ?
			                  				 	'/'+this.props.url+'/contact-details-modal/'+this.props.match.params.entityID+"/"+this.props.match.params.contactID 
			                  				 	:this.props.match.params.entityID ?
			                  				 	'/'+this.props.url+'/contact-details-modal/'+this.props.match.params.entityID
			                  				 	:!this.props.modal ?
			                  				 	'/'+this.props.url+'/contact-details-modal'
			                  				 	:
			                  				 	'/'+this.props.url
			                  				} 
		                  	/>
		                </div>  
		             </div>
		            </div>
		          </div>
			</div>
		);
	}
}

export default withRouter(ContactDetails);