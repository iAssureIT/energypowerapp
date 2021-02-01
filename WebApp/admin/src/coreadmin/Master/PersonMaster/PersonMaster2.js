
import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import S3FileUpload from 'react-s3';
import moment from 'moment';
import PhoneInput from 'react-phone-input-2';
import _ from 'underscore';
import { withRouter } from 'react-router-dom';
import BulkUpload from "../BulkUpload/BulkUpload.js";
// import SelectCorporate from "../SelectCorporate/SelectCorporate.js";
import "bootstrap-toggle/css/bootstrap2-toggle.min.css";
import "bootstrap-toggle/js/bootstrap2-toggle.min.js";
import "./PersonMaster.css";
import ImageLoader from 'react-load-image';


class PersonMaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "pathname": this.props.entity ? this.props.entity : "",
            "personID": this.props.match.params ? this.props.match.params.fieldID : '',
            "companyLogo": [],
            "districtArray": [],
            "designationArray": [],
            "departmentArray": [],
            "corporateLocationArray": "",
            'toggleButtonValue': "Male",
            'getSelectedTrip': "Yes",
            'loginCredential': "Yes",
            'country': "",
            'workLocation': "",
            'workLocationId': "",
            'documentindex': 0,
            'userId': "",
            'pincodeExists': true,
            "stateArray": [],
            "licenseProof": [],
            "panProof": [],
            "docproofimg": [],
            "showdocimg" : false,
            "voterIDProof": [],
            "profilePhoto": "",
            "companyId": "",
            "passportProof": [],
            "company_id": "",
            "addressProof": [],
            "identityProof": [],
            "verificationProof": [],
            "COI": [],
            "Docarray": [],
            "Documentarray": [],
            "loading": false,
            fileDetailUrl: "/api/personmaster/get/filedetails/",
            goodRecordsHeading: {
                firstName: "First Name",
                middleName: "Middle Name",
                lastName: "Last Name",
                DOB: "DOB",
                gender: "Gender",
                contactNo: "Contact No",
                altContactNo: "Alt Contact No",
                email: "Email",
                whatsappNo: "Whats App No",
                department: "Department",
                designation: "Designation",
                employeeId: "Employee Id",
                bookingApprovalRequired: "Booking Approval Required",
                approvingAuthorityId: "Approving Authority Id"
            },
            failedtableHeading: {
                firstName: "First Name",
                middleName: "Middle Name",
                lastName: "Last Name",
                DOB: "DOB",
                gender: "Gender",
                contactNo: "Contact No",
                altContactNo: "Alt Contact No",
                email: "Email",
                whatsappNo: "Whats App No",
                department: "Department",
                designation: "Designation",
                employeeId: "Employee Id",
                bookingApprovalRequired: "Booking Approval Required",
                approvingAuthorityId: "Approving Authority Id",
                failedRemark: "Failed Data Remark"
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.keyPress = this.keyPress.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.submitPerson = this.submitPerson.bind(this);
        this.camelCase = this.camelCase.bind(this)
        this.handleChangeCountry = this.handleChangeCountry.bind(this);
        this.handleChangeState = this.handleChangeState.bind(this);
        this.handleChangeDesignation = this.handleChangeDesignation.bind(this);
        this.handleChangeDepartment = this.handleChangeDepartment.bind(this);
        this.handleworklocationChange = this.handleworklocationChange.bind(this);
    }

    Preloader(props) {
        return <img src="spinner.gif" />;
    }

    componentDidMount() {
        var userId = localStorage.getItem("user_ID")
        console.log("userId==>",userId);
        this.getEntity();
        this.getDesignation();
        this.getDepartment();
        this.getCompany();
        this.getDriverData();
        this.dynamicvalidation();
        console.log('CDM this.state.DocumentsDetails==>>', this.state.DocumentsDetails);
        this.setState({
            personID: this.props.match.params.fieldID,
            userId : userId
        }, () => {
            this.edit();
        })
        

    }
    dynamicvalidation(){
        if (this.state.pathname === "driver") {
            $(".person").hide();
            $(".driver").show();
            $.validator.addMethod("regxEmail", function (value, element, regexpr) {
                return regexpr.test(value);
            }, "Please enter valid Email Id");
            $.validator.addMethod("regxLicenseNumber", function (value, element, regexpr) {
                return regexpr.test(value);
            }, "Please enter valid License Number");
            

            jQuery.validator.setDefaults({
                debug: true,
                success: "valid"
            });
            $("#BasicInfo").validate({
                rules: {

                    corporate: {
                        required: true
                    },
                    workLocation: {
                        required: true
                    },
                    firstName: {
                        required: true
                    },
                    middleName: {
                        required: true
                    },
                    lastName: {
                        required: true
                    },
                    DOB: {
                        required: true
                    },
                    contactNumber: {
                        required: true,
                    },
                    email: {
                        regxEmail: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$|^$)/,
                    },
                    addressLine1: {
                        required: true,
                    },
                    country: {
                        required: true,
                    },
                    states: {
                        required: true,
                    },
                    district: {
                        required: true,
                    },
                    area: {
                        required: true,
                    },
                    city: {
                        required: true,
                    },
                    pincode: {
                        required: true,
                    },
                    
                    documentNumber0: {
                        required: true,
                    },
                    documentNumber1: {
                        required: true,
                    },
                    documentNumber2: {
                        required: true,
                    },
                    documentNumber3: {
                        required: true,
                    },
                    documentNumber4: {
                        required: true,
                    },
                    documentNumber5: {
                        required: true,
                    },
                    documentNumber6: {
                        required: true,
                    },
                    documentNumber7: {
                        required: true,
                    },
                    documentNumber8: {
                        required: true,
                    },

                },
                errorPlacement: function (error, element) {
                    if (element.attr("name") === "corporate") {
                        error.insertAfter("#corporate");
                    }
                    if (element.attr("name") === "workLocation") {
                        error.insertAfter("#workLocation");
                    }
                    if (element.attr("name") === "firstName") {
                        error.insertAfter("#firstName");
                    }
                    if (element.attr("name") === "lastName") {
                        error.insertAfter("#lastName");
                    }
                    if (element.attr("name") === "middleName") {
                        error.insertAfter("#middleName");
                    }
                    if (element.attr("name") === "DOB") {
                        error.insertAfter("#DOB");
                    }
                    
                    if (element.attr("name") === "documentNumber0") {
                        error.insertAfter("#documentNumber0");
                    }
                    if (element.attr("name") === "documentNumber1") {
                        error.insertAfter("#documentNumber1");
                    }
                    if (element.attr("name") === "documentNumber2") {
                        error.insertAfter("#documentNumber2");
                    }
                    if (element.attr("name") === "documentNumber3") {
                        error.insertAfter("#documentNumber3");
                    }
                    if (element.attr("name") === "documentNumber4") {
                        error.insertAfter("#documentNumber4");
                    }
                    if (element.attr("name") === "documentNumber5") {
                        error.insertAfter("#documentNumber5");
                    }
                    if (element.attr("name") === "documentNumber6") {
                        error.insertAfter("#documentNumber6");
                    }
                    if (element.attr("name") === "documentNumber7") {
                        error.insertAfter("#documentNumber7");
                    }
                    if (element.attr("name") === "documentNumber8") {
                        error.insertAfter("#documentNumber8");
                    }

                    if (element.attr("name") === "contactNumber") {
                        error.insertAfter("#contactNumber");
                    }
                    if (element.attr("name") === "alternateNumber") {
                        error.insertAfter("#alternateNumber");
                    }
                    if (element.attr("name") === "email") {
                        error.insertAfter("#email");
                    }
                    if (element.attr("name") === "addressLine1") {
                        error.insertAfter("#addressLine1");
                    }
                    if (element.attr("name") === "country") {
                        error.insertAfter("#country");
                    }
                    if (element.attr("name") === "states") {
                        error.insertAfter("#states");
                    }
                    if (element.attr("name") === "district") {
                        error.insertAfter("#district");
                    }
                    if (element.attr("name") === "area") {
                        error.insertAfter("#area");
                    }
                    if (element.attr("name") === "city") {
                        error.insertAfter("#city");
                    }
                    if (element.attr("name") === "pincode") {
                        error.insertAfter("#pincode");
                    }
                    // if (element.attr("name") === "effectiveUpto") {
                    //     error.insertAfter("#effectiveUpto");
                    // }
                    // if (element.attr("name") === "documentNumber") {
                    //     error.insertAfter("#documentNumber");
                    // }
                    // if (element.attr("name") === "aadharNumber") {
                    //     error.insertAfter("#aadharNumber");
                    // }
                    // if (element.attr("name") === "badgeNumber") {
                    //     error.insertAfter("#badgeNumber");
                    // }
                    // if (element.attr("name") === "verificationNumber") {
                    //     error.insertAfter("#verificationNumber");
                    // }

                }
            });
        }
        if (this.state.pathname === "employee") {
            $(".person").hide();
            $(".employee").show();
            $.validator.addMethod("regxEmail", function (value, element, regexpr) {
                return regexpr.test(value);
            }, "Please enter valid Email Id");

            jQuery.validator.setDefaults({
                debug: true,
                success: "valid"
            });
            $("#BasicInfo").validate({
                rules: {

                    firstName: {
                        required: true
                    },
                    middleName: {
                        required: true
                    },
                    lastName: {
                        required: true
                    },
                    DOB: {
                        required: true
                    },
                    workLocation: {
                        required: true,
                    },
                    corporate: {
                        required: true,
                    },
                    contactNumber: {
                        required: true,
                    },
                    alternateNumber: {
                        required: true,
                    },

                    email: {
                        required: true,
                        regxEmail: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$|^$)/,
                    },
                    department: {
                        required: true,
                    },
                    designation: {
                        required: true,
                    },
                    addressLine1: {
                        required: true,
                    },
                    country: {
                        required: true,
                    },
                    states: {
                        required: true,
                    },
                    documentNumber0: {
                        required: true,
                    },
                    district: {
                        required: true,
                    },
                    area: {
                        required: true,
                    },
                    city: {
                        required: true,
                    },
                    pincode: {
                        required: true,
                    },
                    employeeID: {
                        required: true,
                    },
                    preApprovedParameter: {
                        required: true,
                    },
                    preApprovedParameterValue: {
                        required: true,
                    },
                    approvingAuthorityId1: {
                        required: true,
                    },
                    approvingAuthorityId2: {
                        required: true,
                    },
                    approvingAuthorityId3: {
                        required: true,
                    },

                },
                errorPlacement: function (error, element) {
                    if (element.attr("name") === "firstName") {
                        error.insertAfter("#firstName");
                    }
                    if (element.attr("name") === "lastName") {
                        error.insertAfter("#lastName");
                    }
                    if (element.attr("name") === "middleName") {
                        error.insertAfter("#middleName");
                    }
                    if (element.attr("name") === "DOB") {
                        error.insertAfter("#DOB");
                    }
                    if (element.attr("name") === "contactNumber") {
                        error.insertAfter("#contactNumber");
                    }
                    if (element.attr("name") === "email") {
                        error.insertAfter("#email");
                    }
                    if (element.attr("name") === "department") {
                        error.insertAfter("#department");
                    }
                    if (element.attr("name") === "designation") {
                        error.insertAfter("#designation");
                    }
                    if (element.attr("name") === "workLocation") {
                        error.insertAfter("#workLocation");
                    }
                    if (element.attr("name") === "corporate") {
                        error.insertAfter("#corporate");
                    }
                    if (element.attr("name") === "addressLine1") {
                        error.insertAfter("#addressLine1");
                    }
                    if (element.attr("name") === "country") {
                        error.insertAfter("#country");
                    }
                    if (element.attr("name") === "states") {
                        error.insertAfter("#states");
                    }
                    if (element.attr("name") === "district") {
                        error.insertAfter("#district");
                    }
                    if (element.attr("name") === "area") {
                        error.insertAfter("#area");
                    }
                    if (element.attr("name") === "city") {
                        error.insertAfter("#city");
                    }
                    if (element.attr("name") === "pincode") {
                        error.insertAfter("#pincode");
                    }
                    
                    if (element.attr("name") === "documentNumber0") {
                        error.insertAfter("#documentNumber0");
                    }

                    if (element.attr("name") === "employeeID") {
                        error.insertAfter("#employeeID");
                    }
                    if (element.attr("name") === "preApprovedParameter") {
                        error.insertAfter("#preApprovedParameter");
                    }
                    if (element.attr("name") === "preApprovedParameterValue") {
                        error.insertAfter("#preApprovedParameterValue");
                    }
                    if (element.attr("name") === "approvingAuthorityId1") {
                        error.insertAfter("#approvingAuthorityId1");
                    }
                    if (element.attr("name") === "approvingAuthorityId2") {
                        error.insertAfter("#approvingAuthorityId2");
                    }
                    if (element.attr("name") === "approvingAuthorityId3") {
                        error.insertAfter("#approvingAuthorityId3");
                    }

                }
            });
        }
        if (this.state.pathname === "guest") {
            $(".person").hide();
            $(".guest").show();
            $.validator.addMethod("regxEmail", function (value, element, regexpr) {
                return regexpr.test(value);
            }, "Please enter valid Email Id");
            $.validator.addMethod("regxdistrict", function (value, element, arg) {
                return arg !== value;
            }, "Please select the workLocation");
            jQuery.validator.setDefaults({
                debug: true,
                success: "valid"
            });
            $("#BasicInfo").validate({
                rules: {

                    firstName: {
                        required: true
                    },
                    middleName: {
                        required: true
                    },
                    workLocation: {
                        required: true,
                        regxdistrict: "--Select Work Location--"
                    },
                    lastName: {
                        required: true
                    },

                    corporate: {
                        required: true,
                    },
                    contactNumber: {
                        required: true,
                    },

                    email: {
                        required: true,
                        regxEmail: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$|^$)/,
                    },
                },
                errorPlacement: function (error, element) {
                    if (element.attr("name") === "firstName") {
                        error.insertAfter("#firstName");
                    }
                    if (element.attr("name") === "lastName") {
                        error.insertAfter("#lastName");
                    }
                    if (element.attr("name") === "middleName") {
                        error.insertAfter("#middleName");
                    }
                    if (element.attr("name") === "contactNumber") {
                        error.insertAfter("#contactNumber");
                    }
                    if (element.attr("name") === "email") {
                        error.insertAfter("#email");
                    }
                    if (element.attr("name") === "workLocation") {
                        error.insertAfter("#workLocation");
                    }
                    if (element.attr("name") === "corporate") {
                        error.insertAfter("#corporate");
                    }
                }
            });
        }
    }
    getDriverData() {
        var entityname =this.state.pathname;
        console.log('driver entityname==>>', entityname);
        axios.get('/api/documentlistmaster/get/list/'+entityname)
            .then((response) => {
                var DocumentsDetails = response.data
                console.log('response of driver data==>>', DocumentsDetails);
                // responseArray
                this.setState({
                    DocumentsDetails : DocumentsDetails,
                    documentindex : DocumentsDetails.length,
                },()=>{
                    this.dynamicvalidation();
                })
            })
            .catch((error) => {
            })
    }
    componentWillUnmount() {
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }
    camelCase(str) {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    getCompany() {
        axios.get('/api/companysettings')
            .then((response) => {
                this.setState({
                    companyId: response.data._id,
                    companyDetails: response.data,
                    company: response.data.companyName,
                    companyLocationArray: response.data.companyLocationsInfo
                })
            })
            .catch((error) => {
            })
    }
    getUploadFileAttachPercentage() {
        var uploadProgressPercent = localStorage.getItem("uploadUserImageProgressPercent");
        if (uploadProgressPercent) {
            var percentVal = parseInt(uploadProgressPercent);
            if (percentVal) {
                var styleC = {
                    width: percentVal + "%",
                    display: "block",
                    height: "8px",
                }
                var styleCBar = {
                    display: "block",
                    marginTop: 10,
                    height: "8px",
                }
            }
            if (!percentVal) {
                var percentVal = 0;

                var styleC = {
                    width: 0 + "%",
                    display: "none",
                    height: "8px",
                }
                var styleCBar = {
                    display: "none",
                    marginTop: 10,
                    height: "8px",
                }
            }
            if (percentVal === 100) {
                var percentVal = 0;

                var styleC = {
                    width: 0 + "%",
                    display: "none",
                    height: "8px",
                }
                var styleCBar = {
                    display: "none",
                    marginTop: 10,
                    height: "8px",
                }

            }
            return (
                <div>
                    <div className="progress col-lg-12" style={styleCBar}>
                        <div className="progress-bar progress-bar-striped active" role="progressbar"
                            aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={styleC}>
                        </div>
                    </div>
                </div>
            );
        }
    }
    getUploadLogoPercentage() {
        var uploadProgressPercent = localStorage.getItem("imageprogress");
        if (uploadProgressPercent) {
            var percentVal = parseInt(uploadProgressPercent);
            if (percentVal) {
                var styleC = {
                    width: percentVal + "%",
                    display: "block",
                    height: "8px",
                }
                var styleCBar = {
                    display: "block",
                    marginTop: 10,
                    height: "8px",
                    padding: "0px",
                }
            }
            if (!percentVal) {
                var percentVal = 0;

                var styleC = {
                    width: 0 + "%",
                    display: "none",
                    height: "8px",
                }
                var styleCBar = {
                    display: "none",
                    marginTop: 10,
                    height: "8px",
                    padding: "0px",
                }

            }
            if (percentVal === 100) {
                var percentVal = 0;

                var styleC = {
                    width: 0 + "%",
                    display: "none",
                    height: "8px",
                }
                var styleCBar = {
                    display: "none",
                    marginTop: 10,
                    height: "8px",
                    padding: "0px",
                }
            }
            return (
                <div>
                    <div className="progress col-lg-12" style={styleCBar}>
                        <div className="progress-bar progress-bar-striped active" role="progressbar"
                            aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={styleC}>
                        </div>
                    </div>
                </div>
            );
        }
    }
    handleChange(event) {
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        const token = $(event.target).attr('token');
        const indexof = $(event.target).attr('index');
        console.log("token==>",token);
        if(name == ['documentNumber'+indexof]){
        this.setState({
            ['documentName'+indexof] : token
            })
        }
        this.setState({
            [name]: event.target.value,
        }, () => {});
    }
    handleOptionChange(event) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: event.target.value
        });

    }
    submitPerson(event) {
        event.preventDefault();
        var index = this.state.documentindex;
        console.log("index in submit==>",index);
        console.log("this.state[`documentNumber${i}`]==>",this.state.documentNumber0);
        var docarr =[]
        for(var i=0; i<index; i++){
            var docvalue = 
            {
                documentName : this.state[`documentName${i}`],
                documentNumber:this.state[`documentNumber${i}`],
                documentValidFrom:this.state[`documentValidFrom${i}`],
                documentValidTo:this.state[`documentValidTo${i}`],
                documentProof:{
                                    imgUrl      : this.state["DocProof"+i],
                                    status      : "New",
                                    remark      : "",
                                    createdBy   : localStorage.getItem("user_ID"),
                                    createdAt   : new Date(),
                            }
            }
            docarr.push(docvalue)
        } 
        this.setState({
            Documentarray : docarr,
        }, () => {
            console.log("this.state.Documentarray==>",this.state.Documentarray);
        });
        
        console.log("docarr==>",docarr);

        if ($('#BasicInfo').valid() && this.state.pincodeExists) {
            if (this.state.pathname === 'employee') {
                var userDetails = {
                    company_Id: this.state.corporate_Id,
                    companyID: this.state.companyID,
                    companyName: this.state.corporate,
                    type: this.state.pathname,
                    firstName: this.state.firstName,
                    middleName: this.state.middleName,
                    lastName: this.state.lastName,
                    DOB: this.state.DOB,
                    gender: this.state.toggleButtonValue,
                    contactNo: this.state.contactNumber,
                    altContactNo: this.state.alternateNumber,
                    email: this.state.email,
                    whatsappNo: this.state.whatsappNumber ? this.state.whatsappNumber : '-',
                    departmentId: this.state.department,
                    designationId: this.state.designation,
                    profilePhoto: this.state.profilePhoto,
                    employeeId: this.state.employeeID,
                    bookingApprovalRequired: this.state.getSelectedTrip,
                    approvingAuthorityId1: this.state.approvingAuthorityId1,
                    approvingAuthorityId2: this.state.approvingAuthorityId2,
                    approvingAuthorityId3: this.state.approvingAuthorityId3,
                    preApprovedParameter: this.state.preApprovedParameter,
                    preApprovedParameterValue: this.state.preApprovedParameterValue,
                    loginCredential: this.state.loginCredential,
                    workLocation: this.state.workLocation,
                    workLocationId: this.state.workLocationId,
                    status: "Active",
                    Documentarray: docarr,

                    address: {
                        addressLine1: this.state.addressLine1,
                        addressLine2: this.state.addressLine2,
                        landmark: this.state.landmark ? this.state.landmark : "",
                        area: this.state.area,
                        city: this.state.city,
                        district: this.state.district,
                        state: this.state.states.split('|')[1],
                        stateCode: this.state.states.split('|')[0],
                        country: this.state.country.split('|')[1],
                        countryCode: this.state.country.split('|')[0],
                        pincode: this.state.pincode,
                        latitude: "",
                        longitude: "",
                        addressProof: this.state.addressProof,
                    },


                }
                if (this.state.loginCredential === "Yes") {
                    this.createLogin(this.state.loginCredential);
                    userDetails.userId = this.state.userId;
                }
            } else if (this.state.pathname === 'driver') {
                console.log("In driver==>",this.state.pathname);
                var userDetails = {
                    type: this.state.pathname,
                    firstName: this.state.firstName,
                    company_Id: this.state.corporate_Id,
                    companyID: this.state.companyID,
                    companyName: this.state.corporate,
                    middleName: this.state.middleName,
                    lastName: this.state.lastName,
                    DOB: this.state.DOB,
                    email: this.state.email ? this.state.email : "",
                    gender: this.state.toggleButtonValue,
                    contactNo: this.state.contactNumber,
                    altContactNo: this.state.alternateNumber,
                    whatsappNo: this.state.whatsappNumber ? this.state.whatsappNumber : 'Not Specified',
                    profilePhoto: this.state.profilePhoto,
                    Documentarray: docarr,
                    address: {
                        addressLine1: this.state.addressLine1,
                        addressLine2: this.state.addressLine2,
                        landmark: this.state.landmark ? this.state.landmark : "",
                        area: this.state.area,
                        city: this.state.city,
                        district: this.state.district,
                        state: this.state.states.split('|')[1],
                        stateCode: this.state.states.split('|')[0],
                        country: this.state.country.split('|')[1],
                        countryCode: this.state.country.split('|')[0],
                        pincode: this.state.pincode,
                        addressProof: this.state.addressProof,
                    },
                    workLocation: this.state.workLocation,
                    workLocationId: this.state.workLocationId,
                    status: "Active",
                    username: "MOBILE"

                }
                console.log("Before Post userDetails===>", userDetails);
                this.createLogin("Yes");
                userDetails.userId = this.state.userId;
                console.log("Before Post userDetails.userId===>", userDetails.userId);
            } else {
                var userDetails = {
                    company_Id: this.state.corporate_Id,
                    companyID: this.state.companyID,
                    companyName: this.state.corporate,
                    firstName: this.state.firstName,
                    middleName: this.state.middleName,
                    lastName: this.state.lastName,
                    gender: this.state.toggleButtonValue,
                    contactNo: this.state.contactNumber,
                    altContactNo: this.state.alternateNumber,
                    workLocation: this.state.workLocation,
                    workLocationId: this.state.workLocationId,
                    type: this.state.pathname,
                    email: this.state.email,
                    profilePhoto: this.state.profilePhoto,
                    status: "Active",

                }
            }
            
            axios.post('/api/personmaster/post', userDetails)
                .then((response) => {
                    console.log('response', response, "userDetails", userDetails);
                    swal(this.Capitalize(this.state.pathname) + " Added Successfully");

                    this.setState({
                        firstName: "",
                        middleName: "",
                        lastName: "",
                        DOB: "",
                        gender: "",
                        contactNumber: "",
                        alternateNumber: "",
                        whatsappNumber: "",
                        department: "-- Select --",
                        designation: "-- Select --",

                        addressLine1: "",
                        addressLine2: "",
                        landmark: "",
                        area: "",
                        city: "",
                        district: "-- Select --",
                        states: "-- Select --",
                        country: "-- Select --",
                        pincode: "",
                        email: "",
                        licenseNumber: "",
                        effectiveUpto: "",
                        panNumber: "",
                        aadharNumber: "",
                        voterId: "",
                        preApprovedAmount: "",
                        passportNumber: "",
                        licenseProof: [],
                        panProof: [],
                        profilePhoto: "",
                        aadharProof: [],
                        voterIDProof: [],
                        passportProof: [],

                    }, () => {
                        this.props.history.push("/" + this.state.pathname + "/lists")
                    })

                })
                .catch((error) => {

                })
        }else{
            $('select.error:first').focus();
            $('input.error:first').focus();
        }
    }
    // createLogin(loginCredential) {

    //     if (loginCredential === "Yes") {
    //         var userDetails = {
    //             firstname: this.state.firstName,
    //             lastname: this.state.lastName,
    //             mobNumber: this.state.contactNumber,
    //             email: this.state.email,
    //             companyID: this.state.companyID,
    //             pwd: "fivebees123",
    //             role: this.state.pathname,
    //             status: 'active',
    //             "emailSubject": "Email Verification",
    //             "emailContent": "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
    //         }
    //         console.log("userDetails==>",userDetails);
    //         axios.post('/api/auth/post/signup/user', userDetails)
    //             .then((response) => {
    //                 this.setState({
    //                     userId: response.data.ID
    //                 })
    //                 if (response.data.message == 'USER_CREATED') {

    //                 } else {
    //                     swal(response.data.message);
    //                 }
    //             })
    //     }

    // }
    createLogin = ()=>{

        if(this.state.pathname === 'driver' ){
            var userDetails = {
                firstname     : this.state.firstName,
                lastname      : this.state.lastName,
                mobNumber     : this.state.contactNumber,
                email         : this.state.email,
                companyID     : this.state.companyID,
                companyName     : this.state.corporate,
                pwd           : "fivebees123",
                role          : this.state.pathname,
                status        : 'active',
                username      : "MOBILE",
                "emailSubject"    : "Email Verification",
                "emailContent"    : "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
            }
        }else{
            var userDetails = {
                firstname     : this.state.firstName,
                lastname      : this.state.lastName,
                mobNumber     : this.state.contactNumber,
                email         : this.state.email,
                companyID     : this.state.companyID,
                companyName     : this.state.corporate,
                pwd           : "fivebees123",
                role          : this.state.pathname,
                status        : 'active',
                "emailSubject"    : "Email Verification",
                "emailContent"    : "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
            }
        }
         console.log("userDetails",userDetails);
         return new Promise(function(resolve, reject){
           axios.post('/api/auth/post/signup/user', userDetails)
           .then((response)=>{
             console.log("response.data.ID===>>>>",response.data.ID)
             resolve(response.data.ID);
             if(response.data.message =='USER_CREATED'){
               var sendData = {
                 "event": "Contact Created", //Event Name
                 "toUserId": response.data.ID, //To user_id(ref:users)
                 "company": this.props.match.params.entityID, //company_id(ref:entitymaster)
                 "variables": {
                  'EmployeeName': this.state.firstName+' '+this.state.lastName,
                  'Password': "Welcome@123",
                  'mobileNo': this.state.phone,
                  'email': this.state.email
                   }
                 }
                 axios.post('/api/masternotifications/post/sendNotification', sendData)
                 .then((res) => {
                 console.log('sendDataToUser in result==>>>', res.data)
                 })
                 .catch((error) => { console.log('notification error: ',error)})
             }else{
               swal(response.data.message);
             }
             
           })
           .catch((error)=>{})
         })
    }
    updatePerson(event) {
        event.preventDefault();
        var index = this.state.documentindex;
        console.log("index in submit==>",index);
        console.log("this.state[`documentNumber${i}`]==>",this.state.documentNumber0);
        var docarr =[]
        var imgarr =[]
        for(var i=0; i<index; i++){
            if(this.state["docproofimg"+i]) {
                imgarr = (this.state["docproofimg"+i]).concat(this.state["DocProof"+i]);
            }else{
                imgarr =(this.state["DocProof"+i]);
            }
            var docvalue = 
            {
                documentName        : this.state[`documentName${i}`],
                documentNumber      : this.state[`documentNumber${i}`],
                documentValidFrom   : this.state[`documentValidFrom${i}`],
                documentValidTo     : this.state[`documentValidTo${i}`],
                documentProof       : {
                                        imgUrl      : imgarr != null ? imgarr : [],
                                        status      : "Updated",
                                        remark      : "",
                                        createdBy   : localStorage.getItem("user_ID"),
                                        createdAt   : new Date(),
                                    }
                
            }
            docarr.push(docvalue)
            console.log("docvalue in Update==>",docvalue);
        } 
        this.setState({
            Documentarray : docarr,
        }, () => {
            console.log("this.state.Documentarray in Update==>",this.state.Documentarray);
        });

        if ($('#BasicInfo').valid() && this.state.pincodeExists) {
            if (this.state.personID) {
                if (this.state.pathname === 'employee') {
                    var userDetails = {
                        company_Id: this.state.corporate_Id,
                        companyID: this.state.companyID,
                        companyName: this.state.corporate,
                        personID: this.state.personID,
                        firstName: this.state.firstName,
                        middleName: this.state.middleName,
                        lastName: this.state.lastName,
                        DOB: this.state.DOB,
                        gender: this.state.toggleButtonValue,
                        contactNo: this.state.contactNumber,
                        altContactNo: this.state.alternateNumber ? this.state.alternateNumber : "",
                        whatsappNo: this.state.whatsappNumber ? this.state.whatsappNumber : "",
                        email: this.state.email,
                        departmentId: this.state.department,
                        designationId: this.state.designation,
                        preApprovedParameter: this.state.preApprovedParameter,
                        preApprovedParameterValue: this.state.preApprovedParameterValue,
                        profilePhoto: this.state.profilePhoto,
                        employeeId: this.state.employeeID,
                        bookingApprovalRequired: this.state.getSelectedTrip,
                        approvingAuthorityId1: this.state.approvingAuthorityId1,
                        approvingAuthorityId2: this.state.approvingAuthorityId2,
                        approvingAuthorityId3: this.state.approvingAuthorityId3,
                        loginCredential: this.state.loginCredential,
                        workLocation: this.state.workLocation,
                        workLocationId: this.state.workLocationId,
                        status: "Active",
                        address: [{
                            addressLine1: this.state.addressLine1,
                            addressLine2: this.state.addressLine2,
                            landmark: this.state.landmark,
                            area: this.state.area,
                            city: this.state.city,
                            district: this.state.district,
                            state: this.state.states.split('|')[1],
                            stateCode: this.state.states.split('|')[0],
                            country: this.state.country.split('|')[1],
                            countryCode: this.state.country.split('|')[0],
                            pincode: this.state.pincode,
                            addressProof: this.state.addressProof,

                        }],

                        updatedBy: localStorage.getItem("user_ID")
                    }
                    
                } else if (this.state.pathname === 'driver') {
                    console.log(" In Driver ==>", this.state.pathname);
                    var userDetails = {
                        personID: this.state.personID,
                        company_Id: this.state.corporate_Id,
                        companyID: this.state.companyID,
                        companyName: this.state.corporate,
                        workLocation: this.state.workLocation,
                        workLocationId: this.state.workLocationId,
                        firstName: this.state.firstName,
                        middleName: this.state.middleName,
                        lastName: this.state.lastName,
                        DOB: this.state.DOB,
                        gender: this.state.toggleButtonValue,
                        contactNo: this.state.contactNumber,
                        altContactNo: this.state.alternateNumber ? this.state.alternateNumber : "",
                        whatsappNo: this.state.whatsappNumber ? this.state.whatsappNumber : "",
                        profilePhoto: this.state.profilePhoto,
                        identityProof: this.state.identityProof,
                        badgeNumber: this.state.badgeNumber,
                        email: this.state.email ? this.state.email : "",
                        Documentarray: docarr,
                        address: {
                            addressLine1: this.state.addressLine1,
                            addressLine2: this.state.addressLine2,
                            landmark: this.state.landmark,
                            area: this.state.area,
                            city: this.state.city,
                            district: this.state.district,
                            state: this.state.states.split('|')[1],
                            stateCode: this.state.states.split('|')[0],
                            country: this.state.country.split('|')[1],
                            countryCode: this.state.country.split('|')[0],
                            pincode: this.state.pincode,
                            addressProof: this.state.addressProof,
                        },
                        updatedBy: localStorage.getItem("user_ID"),
                        status: "Active",
                        username: "MOBILE"
                    }

                } else {
                    var userDetails = {
                        company_Id: this.state.corporate_Id,
                        companyID: this.state.companyID,
                        companyName: this.state.corporate,
                        personID: this.state.personID,
                        firstName: this.state.firstName,
                        middleName: this.state.middleName,
                        lastName: this.state.lastName,
                        gender: this.state.toggleButtonValue,
                        contactNo: this.state.contactNumber,
                        altContactNo: this.state.alternateNumber ? this.state.alternateNumber : "",
                        whatsappNo: this.state.whatsappNumber ? this.state.whatsappNumber : "",
                        email: this.state.email,
                        status: "Active",
                        profilePhoto: this.state.profilePhoto,
                        workLocation: this.state.workLocation,
                        workLocationId: this.state.workLocationId,
                        updatedBy: localStorage.getItem("user_ID")
                    }
                    console.log("userDetails in Update==>", userDetails);
                }
                axios.patch('/api/personmaster/patch', userDetails)
                    .then((response) => {
                        this.setState({
                            personID: "",
                            firstName: "",
                            middleName: "",
                            lastName: "",
                            DOB: "",
                            gender: "",
                            contactNumber: "",
                            alternateNumber: "",
                            whatsappNumber: "",
                            department: "-- Select --",
                            designation: "-- Select --",
                            preApprovedParameterValue: "-- Select --",
                            preApprovedParameterValue: "",
                            profilePhoto: "",
                            approvingAuthorityId3: "",
                            approvingAuthorityId2: "",
                            approvingAuthorityId1: "",
                            addressLine1: "",
                            addressLine2: "",
                            landmark: "",
                            area: "",
                            city: "",
                            district: "-- Select --",
                            states: "-- Select --",
                            country: "-- Select --",
                            pincode: "",
                            email: "",
                            licenseNumber: "",
                            preApprovedAmount: "",
                            approvingAuthorityId: "",
                            effectiveUpto: "",
                            panNumber: "",
                            aadharNumber: "",
                            voterId: "",
                            passportNumber: "",
                            licenseProof: [],
                            panProof: [],
                            aadharProof: [],
                            identityProof: [],
                            verificationProof: [],
                            addressProof: [],

                        }, () => {
                            this.props.history.push("/" + this.state.pathname + "/lists")
                        })
                        swal(this.Capitalize(this.state.pathname) + " Details Updated Successfully");
                    })
                    .catch((error) => {
                        console.log("error", error)
                    })
            }
            }else{
                $('select.error:first').focus();
                $('input.error:first').focus();
            }
        // } else {
        //     window.scrollTo(0, 0);
        // }
    }
    imgBrowse(event) {
        event.preventDefault();
        var companyLogo = [];
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            for (var i = 0; i < event.currentTarget.files.length; i++) {
                var file = event.currentTarget.files[i];

                if (file) {
                    var fileName = file.name;
                    var ext = fileName.split('.').pop();
                    if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "JPG" || ext === "PNG" || ext === "JPEG") {
                        if (file) {
                            var objTitle = { fileInfo: file }
                            companyLogo.push(objTitle);

                        } else {
                            swal("Images not uploaded");
                        }//file
                    } else {
                        swal("Allowed images formats are (jpg,png,jpeg)");
                    }//file types
                }//file
            }//for 

            if (event.currentTarget.files) {
                main().then(formValues => {
                    var companyLogo = this.state.companyLogo;
                    for (var k = 0; k < formValues.length; k++) {
                        companyLogo.push(formValues[k].companyLogo)
                    }

                    this.setState({
                        companyLogo: companyLogo
                    })
                });

                async function main() {
                    var formValues = [];
                    for (var j = 0; j < companyLogo.length; j++) {
                        var config = await getConfig();
                        var s3url = await s3upload(companyLogo[j].fileInfo, config, this);
                        const formValue = {
                            "companyLogo": s3url,
                            "status": "New"
                        };
                        formValues.push(formValue);
                    }
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
                            .catch(function (error) {
                            })

                    })
                }
            }
        }
    }
    docBrowse(event) {
        event.preventDefault();
        $('#loader_img').show();
        // $('.fullpageloader').show();
        var name = event.target.name;
        var uploadedfiles = [];
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            for (var i = 0; i < event.currentTarget.files.length; i++) {
                var file = event.currentTarget.files[i];
                if (file) {
                    var fileName = file.name;
                    console.log("fileName==>",fileName)
                    var ext = fileName.split('.').pop();
                    if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "pdf" || ext === "JPG" || ext === "PNG" || ext === "JPEG" || ext === "PDF") {
                        var objTitle = { fileInfo: file }
                        uploadedfiles.push(objTitle);
                        console.log("uploadedfiles 1==>",uploadedfiles)
                    } else {
                        swal("Allowed file formats are jpg, png, jpeg, pdf");
                    }//file types
                }//file
                else {
                    swal("Files not uploaded");
                }//file
            }//for 

            
                
            if (event.currentTarget.files) {
                console.log("formValues==>",event.currentTarget.files)
                this.setState({
                    ["gotImage"+name]: true
                })
                main().then(formValues => {
                    console.log("formValues 1==>",formValues)
                    var docBrowsearr = [];
                    // var docBrowsearr = this.state[name];
                    console.log("formValues docBrowsearr==>",docBrowsearr)
                    for (var k = 0; k < formValues.length; k++) {
                        console.log("before Push formValues==>",formValues[k])
                        docBrowsearr.push(formValues[k].imgUrl)
                        // console.log("Only docBrowsearr==>",docBrowsearr)
                    }
                    console.log("[docBrowsearr]=>",docBrowsearr);
                    this.setState({
                        [name]: docBrowsearr
                    }, () => {
                        console.log("this.state.name==>",this.state[name])
                    })
                });
    
                async function main() {
                    var formValues = [];
                    for (var j = 0; j < uploadedfiles.length; j++) {
                        var config = await getConfig();
                        var s3url = await s3upload(uploadedfiles[j].fileInfo, config, this);
                        const documentProof = {
                            "imgUrl"    : s3url,
                            "status"    : "New",
							"remark"    : "",
							"createdBy" : localStorage.getItem("user_ID"),
							"createdAt" : new Date(),
                        };
                        console.log("documentProof 2==>",documentProof)
                        formValues.push(documentProof);
                    }
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
                                $('#loader_img').hide();

                                const config = {
                                    bucketName: response.data.bucket,
                                    dirName: 'propertiesImages',
                                    region: response.data.region,
                                    accessKeyId: response.data.key,
                                    secretAccessKey: response.data.secret,
                                }
                                resolve(config);
                            })
                            .catch(function (error) {
                            })
                    })
                }
            }
        }
    }

    keyPressWeb = (e) => {

        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190, 110, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 190 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 110 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode === 189 || e.keyCode === 32) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 90)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    }
    /*======== alphanumeric  =========*/
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
        if (((e.keyCode < 48 || e.keyCode > 90)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode === 190 || e.keyCode === 46)) {
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
    isTextKey(evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode != 189 && charCode > 32 && (charCode < 65 || charCode > 90)) {
            evt.preventDefault();
            return false;
        }
        else {
            return true;
        }
    }
    componentWillReceiveProps(nextProps, prevProps) {
        console.log("nextProps", nextProps)
        if (this.state.pathname === "driver") {
            $(".person").hide();
            $(".driver").show();
        }
        if (this.state.pathname === "employee") {
            $(".person").hide();
            $(".employee").show();
        }
        if (this.state.pathname === "guest") {
            $(".person").hide();
            $(".guest").show();
        }
        this.edit();
        this.handleChange = this.handleChange.bind(this);
    }
    admin(event) {
        event.preventDefault();
        this.props.history.push('/adminDashboard');
    }
    edit() {
        var personID = this.state.personID;
        if (personID) {
            axios.get('/api/personmaster/get/one/' + personID)
                .then((response) => {
                    console.log("response:=>", response.data)
                    var docarray = response.data.Documentarray;
                    var index = docarray;
                    console.log("index in update==>",index);
                    console.log("response docarray:=>", docarray)
                    var docarr =[]
                    for(var i=0; i<index.length; i++){
                        const docvalue = {
                            "documentName"          :docarray[i].documentName,
                            "documentNumber"        :docarray[i].documentNumber,
                            "documentValidFrom"     :docarray[i].documentValidFrom,
                            "documentValidTo"       :docarray[i].documentValidTo,
                            "documentProof"         :docarray[i].documentProof.imgUrl,
                                                    
                        }
                        docarr.push(docvalue)
                        this.setState({
                            ['documentName'+i]      : docarray[i].documentName,
                            ['documentNumber'+i]    : docarray[i].documentNumber,
                            ['documentValidFrom'+i] : docarray[i].documentValidFrom,
                            ['documentValidTo'+i]   : docarray[i].documentValidTo,
                            ["docproofimg"+i]       : docarray[i].documentProof.imgUrl,
                            docimgarray             : docarray[i].documentProof.imgUrl,
                            showdocimg              : true,
                        })
                        console.log("docarr after push:=>", docarr)
                    } 
                    this.setState({
                        DocumentsDetails : docarr,
                    }, () => {
                        console.log("this.state.Documentarray In edit==>",this.state.DocumentsDetails);
                    });
                    if (this.state.pathname === 'driver' || this.state.pathname === 'employee') {
                        console.log("response.data.bookingApprovalRequired==>",response.data.bookingApprovalRequired);
                        this.setState({
                            companyID: response.data.companyID,
                            corporate_Id: response.data.company_Id,
                            corporate: response.data.companyName,
                            firstName: response.data.firstName,
                            middleName: response.data.middleName,
                            lastName: response.data.lastName,
                            DOB: moment(response.data.DOB).format("YYYY-MM-DD"),
                            toggleButtonValue: response.data.gender ? response.data.gender : "Male",
                            contactNumber: response.data.contactNo,
                            alternateNumber: response.data.altContactNo,
                            bookingApprovalRequired: response.data.bookingApprovalRequired && response.data.bookingApprovalRequired === true ? "Yes" : "No",
                            // getSelectedTrip: response.data.bookingApprovalRequired && response.data.bookingApprovalRequired === true ? "Yes" : "No",
                            getSelectedTrip :   response.data.bookingApprovalRequired && (response.data.bookingApprovalRequired === "Yes" || response.data.bookingApprovalRequired === true) ? "Yes" : "No",
                            loginCredential: response.data.loginCredential ? response.data.loginCredential : "Yes",
                            approvingAuthorityId1: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId1 : "",
                            approvingAuthorityId2: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId2 : "",
                            approvingAuthorityId3: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId3 : "",
                            whatsappNumber: response.data.whatsappNo,
                            department: response.data.departmentId,
                            designation: response.data.designationId,
                            employeeID: response.data.employeeId,
                            workLocation: response.data.workLocation,
                            workLocationId: response.data.workLocationId,
                            badgeNumber: response.data.badgeNumber,
                            verificationNumber: response.data.verification ? response.data.verification.verificationNumber : "",
                            type: response.data.pathname,
                            addressLine1: response.data.address[0] ? response.data.address[0].addressLine1 : "",
                            addressLine2: response.data.address[0] ? response.data.address[0].addressLine2 : "",
                            landmark: response.data.address[0] ? response.data.address[0].landmark : "",
                            area: response.data.address[0] ? response.data.address[0].area : "",
                            city: response.data.address[0] ? response.data.address[0].city : "",
                            district: response.data.address[0] ? response.data.address[0].district : "",
                            states: response.data.address[0] ? response.data.address[0].stateCode + "|" + response.data.address[0].state : "",
                            country: response.data.address[0] ? response.data.address[0].countryCode + "|" + response.data.address[0].country : "",
                            pincode: response.data.address[0] ? response.data.address[0].pincode : "",
                            email: response.data.email,
                            preApprovedParameter: response.data.bookingApprovalRequired == "Yes" ? response.data.preApprovedParameter : "",
                            preApprovedParameterValue: response.data.bookingApprovalRequired == "Yes" ? response.data.preApprovedParameterValue : "",
                            createdBy: localStorage.getItem("user_ID")
                        }, () => {
                            this.getEntityLocation(this.state.corporate_Id);
                            
                            if (response.data.address.length > 0) {
                                this.getStates(response.data.address[0].countryCode);
                                this.getDistrict(response.data.address[0].stateCode, response.data.address[0].countryCode);
                            }


                        })
                    } else {
                        console.log("response.data=>", response.data);

                        this.setState({
                            companyID: response.data.companyID,
                            corporate_Id: response.data.company_Id,
                            workLocation: response.data.workLocation,
                            workLocationId: response.data.workLocationId,
                            corporate: response.data.companyName,
                            firstName: response.data.firstName,
                            middleName: response.data.middleName,
                            lastName: response.data.lastName,
                            DOB: moment(response.data.DOB).format("YYYY-MM-DD"),
                            toggleButtonValue: response.data.gender,
                            contactNumber: response.data.contactNo ? response.data.contactNo : "",
                            type: response.data.pathname,
                            email: response.data.email,
                            profilePhoto: response.data.profilePhoto,
                            createdBy: localStorage.getItem("user_ID")
                        }, () => {
                            this.getEntityLocation(this.state.corporate_Id);

                        })

                    }


                    // this.getBlocks(response.data.address[0].district, response.data.address[0].stateCode, response.data.address[0].countryCode);


                })
                .catch((error) => {
                })
        }
    }
    changeMobile(event) {
        this.setState({
            companyPhone: event
        }, () => {
            if (this.state.companyPhone) {
                this.setState({
                    companyPhoneError: this.state.companyPhone === "+" ? 'Please enter valid mobile number.' : ""
                })
            }
        })
    }
    deleteLogo(event) {
        event.preventDefault();
        var companyLogo = this.state.companyLogo;
        const index = companyLogo.indexOf(event.target.id);
        if (index > -1) {
            companyLogo.splice(index, 1);
        }
        this.setState({
            companyLogo: companyLogo
        })
    }
    deleteDoc(i,event) {
        event.preventDefault();
        console.log("deleteDoc i==>>",i)
        console.log("deleteDoc event==>>",event)
        const token = $(event.target).attr('token');
        const documentIndex = $(event.target).attr('index');
        const {index , documentArray } = this.state;
        console.log("documentArray indexof==>>",documentIndex)
        console.log("documentArray token==>>",token)
        
        
        console.log("documentArray img ==>>",this.state["docproofimg"+i]);
        this.setState({
            // DocumentsDetails:this.state.docimgarray[0].splice(documentIndex, 1),
        })
    }
    deleteDocSingle(event) {
        event.preventDefault();
        var name = event.target.getAttribute("name");
        var deleteDoc = this.state[name];
        const index = deleteDoc.indexOf(event.target.getAttribute("id"));
        if (index > -1) {
            deleteDoc.splice(index, 1);
        }
        this.setState({
            [name]: deleteDoc
        })
    }
    changeMobile(event) {
        this.setState({
            contactNumber: event
        })
    }
    changeMobileAlternate(event) {
        this.setState({
            alternateNumber: event
        })
    }
    changeMobileWhatsapp(event) {
        this.setState({
            whatsappNumber: event
        })
    }
    handleChangeCountry(event) {
        const target = event.target;
        this.setState({
            [event.target.name]: event.target.value
        });
        this.getStates(event.target.value.split('|')[0])
    }
    handleChangeDesignation(event) {
        const target = event.target;
        this.setState({
            [event.target.name]: event.target.value
        }, () => {
        });
    }
    handleChangeDepartment(event) {
        const target = event.target;
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    handleChangeState(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
        const target = event.target;
        const stateCode = $(target).val();
        const countryCode = $("#countryVal").val();
        this.getDistrict(stateCode, countryCode);
    }
    getStates(StateCode) {
        axios.get("http://locations2.iassureit.com/api/states/get/list/" + StateCode)
            .then((response) => {
                this.setState({
                    stateArray: response.data
                })
                $('#state').val(this.state.states);
            })
            .catch((error) => {
            })
    }
    getDistrict(stateCode, countryCode) {
        axios.get("http://locations2.iassureit.com/api/districts/get/list/" + countryCode + "/" + stateCode)
            .then((response) => {
                this.setState({
                    districtArray: response.data
                }, () => {
                })

                $('#Citydata').val(this.state.city);
            })
            .catch((error) => {
            })
    }
    getDesignation() {
        axios.get("/api/designationmaster/get/list")
            .then((response) => {
                this.setState({
                    designationArray: response.data
                })
            })
            .catch((error) => {
            })
    }
    getDepartment() {
        axios.get("/api/departmentmaster/get/list")
            .then((response) => {
                this.setState({
                    departmentArray: response.data
                })
            })
            .catch((error) => {
            })
    }
    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    getSelectedGender(val, event) {
        this.setState({
            toggleButtonValue: val
        })
    }
    getSelectedTrip(val, event) {

        this.setState({
            getSelectedTrip: val
        })
    }
    getSelectedLoginValue(val, event) {

        this.setState({
            loginCredential: val
        })

    }
    getFileDetails(fileName) {

        axios
            .get(this.state.fileDetailUrl + this.state.pathname + "/" + fileName)
            .then((response) => {
                $('.fullpageloader').hide();
                if (response) {
                    this.setState({
                        fileDetails: response.data,
                        failedRecordsCount: response.data.failedRecords.length,
                        goodDataCount: response.data.goodrecords.length
                    });
                    if (this.state.pathname === "employee") {
                        var tableData = response.data.goodrecords.map((a, i) => {
                            return {
                                "firstName": a.firstName ? a.firstName : '-',
                                "middleName": a.middleName ? a.middleName : '-',
                                "lastName": a.lastName ? a.lastName : '-',
                                "DOB": a.DOB ? a.DOB : '-',
                                "gender": a.gender ? a.gender : '-',
                                "contactNo": a.contactNo ? a.contactNo : '-',
                                "altContactNo": a.altContactNo ? a.altContactNo : '-',
                                "email": a.email ? a.email : '-',
                                "whatsappNo": a.whatsappNo ? a.whatsappNo : '-',
                                "department": a.block ? a.block : '-',
                                "designation": a.village ? a.village : '-',
                                "employeeId": a.employeeId ? a.employeeId : "-",
                                "bookingApprovalRequired": a.bookingApprovalRequired ? a.bookingApprovalRequired : "-",
                                "approvingAuthorityId": a.approvingAuthorityId ? a.approvingAuthorityId : "-"
                            }
                        })

                        var failedRecordsTable = response.data.failedRecords.map((a, i) => {
                            return {
                                "firstName": a.firstName ? a.firstName : '-',
                                "middleName": a.middleName ? a.middleName : '-',
                                "lastName": a.lastName ? a.lastName : '-',
                                "DOB": a.DOB ? a.DOB : '-',
                                "gender": a.gender ? a.gender : '-',
                                "contactNo": a.contactNo ? a.contactNo : '-',
                                "altContactNo": a.altContactNo ? a.altContactNo : '-',
                                "email": a.email ? a.email : '-',
                                "whatsappNo": a.whatsappNo ? a.whatsappNo : '-',
                                "department": a.block ? a.block : '-',
                                "designation": a.village ? a.village : '-',
                                "employeeId": a.employeeId ? a.employeeId : "-",
                                "bookingApprovalRequired": a.bookingApprovalRequired ? a.bookingApprovalRequired : "-",
                                "approvingAuthorityId": a.approvingAuthorityId ? a.approvingAuthorityId : "-",
                                "failedRemark": a.failedRemark ? a.failedRemark : '-'
                            }
                        })
                    }

                    this.setState({
                        goodRecordsTable: tableData,
                        failedRecordsTable: failedRecordsTable
                    })
                }
            })
            .catch((error) => {
                console.log('error', error);
            })
    }
    docBrowseSingle(event) {
        event.preventDefault();
        var name = event.target.name
        
        
        var docBrowse = [];
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            for (var i = 0; i < event.currentTarget.files.length; i++) {
                var file = event.currentTarget.files[i];
                if (file) {
                    console.log("file==>",file)
                    var fileName = file.name;
                    var ext = fileName.split('.').pop();
                    if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "pdf" || ext === "JPG" || ext === "PNG" || ext === "JPEG" || ext === "PDF") {
                        if (file) {
                            var objTitle = { fileInfo: file }
                            docBrowse.push(objTitle);

                        } else {
                            swal("Files not uploaded");
                        }//file
                    } else {
                        swal("Allowed images formats are (jpg,png,jpeg, pdf)");
                    }//file types
                }//file
            }//for 

            if (event.currentTarget.files) {
                main().then(formValues => {
                    var docBrowse = this.state[name];
                    this.setState({
                        [name]: formValues[0].docBrowse
                    }, () => {
                    })
                });

                async function main() {
                    var formValues = [];
                    for (var j = 0; j < docBrowse.length; j++) {
                        var config = await getConfig();
                        var s3url = await s3upload(docBrowse[j].fileInfo, config, this);
                        const formValue = {
                            "docBrowse": s3url,
                            "status": "New"
                        };
                        formValues.push(formValue);
                    }
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
                            .catch(function (error) {
                            })
                    })
                }
            }
        }
    }
    deleteDocSingle(event) {
        event.preventDefault();
        var name = event.target.getAttribute("name");

        this.setState({
            [name]: ""
        })
    }
    handlePincode(event) {
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        })
        if (event.target.value !== '') {
            axios.get("https://api.postalpincode.in/pincode/" + event.target.value)
                .then((response) => {
                    if ($("[name='pincode']").valid()) {

                        if (response.data[0].Status === 'Success') {
                            this.setState({ pincodeExists: true })
                        } else {
                            this.setState({ pincodeExists: false })
                        }
                    } else {
                        this.setState({ pincodeExists: true })
                    }

                })
                .catch((error) => {
                })
        } else {
            this.setState({ pincodeExists: true })
        }
    }
    handleworklocationChange(event) {
        event.preventDefault();
        const target = event.target;
        const name = target.name;

        var e = document.getElementById("entity");
        var comp_Id = e.options[e.selectedIndex].getAttribute("comp_Id");
        var compID = e.options[e.selectedIndex].getAttribute("compID");
        // console.log("companyID..",compID);
        var vendorLocation = document.getElementById("vendorLocation");
        var locationID = vendorLocation.options[vendorLocation.selectedIndex].getAttribute("locationID");
        var value = event.target.value;
        this.setState({
            [name]: event.target.value,
            workLocationId: locationID,
            corporateID: compID,
            companyID: compID,
            corporate_Id: comp_Id

        }, () => {
            this.getEntityLocation(this.state.corporate_Id);
        })
    }
    getEntity(entityCode) {
        if (this.state.pathname == "employee") {
            var entity = "corporate"
        } else if (this.state.pathname == "driver") {
            var entity = "vendor"
        } else {
            var entity = "corporate"
        }

        axios.get('/api/entitymaster/get/' + entity)
            .then((response) => {
                this.setState({
                    entityArray: response.data,
                    entity: entity
                }, () => {
                    if (this.state.entityArray && this.state.entityArray.lenght > 0) {
                        var EntityCode = this.state.entityArray.filter((a) => a.entityCode == entityCode);
                    }
                })

            })
            .catch((error) => {

            })
    }
    getEntityLocation(companyId) {
        // console.log("vendorId",companyId)
        axios.get('/api/entitymaster/get/one/' + companyId)
            .then((response) => {
                this.setState({
                    corporateLocationArray: response.data[0]
                })
            })
            .catch((error) => {

            })
    }
    render() {
        console.log("this.state.documentindex==>", this.state.documentindex);
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                {
                    this.state.pathname ?
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                                <section className="content">
                                    <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                            <h4 className="weighttitle col-lg-9 col-md-6 col-xs-6 col-sm-6 NOpadding-right">{"Add  " + (this.state.pathname ? this.Capitalize(this.state.pathname) : "")}</h4>
                                            <ul className="nav tabNav nav-pills col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                                <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill" href="#manual">Manual</a></li>
                                                <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center"><a data-toggle="pill" href="#bulk">Bulk Upload</a></li>
                                            </ul>
                                        </div>
                                        <form className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12" id="SelectVendor">
                                            <div className="form-margin col-lg-4 col-md-6 col-sm-12 col-xs-12 driver employee" >
                                                <div id="corporate">
                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">{this.state.pathname == "driver" ? "Vendor" : "Corporate"} <sup className="astrick">*</sup></label>
                                                    <select id="entity" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.corporate} ref="corporate" name="corporate" onChange={this.handleworklocationChange.bind(this)}>
                                                        <option>{"--Select " + (this.state.pathname == "driver" ? "Vendor" : "Corporate") + " --"}</option>
                                                        {
                                                            this.state.entityArray && this.state.entityArray.length > 0 ?
                                                                this.state.entityArray.map((data, i) => {
                                                                    return (
                                                                        <option key={i} compID={data.companyID} comp_Id={data._id} value={data.companyName}>{data.companyName}</option>
                                                                    );
                                                                })
                                                                :
                                                                null
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-margin col-lg-4 col-md-6 col-sm-12 col-xs-12 marbtm30 driver employee" >
                                                <div id="workLocation">
                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Work Location <sup className="astrick">*</sup></label>
                                                    <select id="vendorLocation" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.workLocation} ref="workLocation" name="workLocation" onChange={this.handleworklocationChange.bind(this)}>
                                                        <option>--Select Work Location--</option>
                                                        {
                                                            this.state.corporateLocationArray && this.state.corporateLocationArray.locations.length > 0 ?
                                                                this.state.corporateLocationArray.locations.map((data, i) => {
                                                                    // console.log("data",data)
                                                                    return (
                                                                        <option key={i} locationID={data._id} value={((data.locationType).match(/\b(\w)/g)).join('') + "-" + data.area + " " + data.city + " " + data.stateCode + "-" + data.countryCode}>{((data.locationType).match(/\b(\w)/g)).join('')} - {data.area} {data.city}, {data.stateCode} - {data.countryCode}  </option>
                                                                    );
                                                                })
                                                                :
                                                                null
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </form>
                                        <section className="Content" >
                                            <div className="row tab-content">
                                                <div id="manual" className="tab-pane fade in active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
                                                    <form id="BasicInfo">
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding ">
                                                            <div className="col-lg-12 col-md-12 col-sm-12 supplierForm">
                                                                <div className="col-lg-12 col-md-12 col-sm-12">
                                                                    <br />
                                                                </div>
                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
                                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls NOpadding-left driver guest employee person NOpadding-right">
                                                                        <label className="subHead col-lg-12 col-md-12 col-sm-12 col-xs-12 person "> Basic Details</label>

                                                                        <div className="form-margin col-lg-9 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12  driver employee guest person" >
                                                                                <div id="firstName">
                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">First Name <i className="astrick">*</i></label>
                                                                                    <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.firstName} ref="firstName" name="firstName" onChange={this.handleChange} onKeyDown={this.isTextKey.bind(this)} />
                                                                                </div>
                                                                            </div>
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12  driver employee guest person" >
                                                                                <div id="middleName">
                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Middle Name <i className="astrick">*</i></label>
                                                                                    <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.middleName} ref="middleName" name="middleName" onChange={this.handleChange} onKeyDown={this.isTextKey.bind(this)} />
                                                                                </div>
                                                                            </div>
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee guest person">
                                                                                <div id="lastName">
                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Last Name <i className="astrick">*</i></label>
                                                                                    <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.lastName} ref="lastName" name="lastName" onChange={this.handleChange} onKeyDown={this.isTextKey.bind(this)} />
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="form-margin col-lg-9 col-md-12 col-sm-12 col-xs-12 driver guest employee person NOpadding-left NOpadding-right">
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">
                                                                                <div id="DOB">
                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">DOB <i className="astrick">*</i></label>
                                                                                    <input type="date" id="DOB" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.DOB} max={moment(new Date).format("YYYY-MM-DD")} ref="DOB" name="DOB" onChange={this.handleChange} />
                                                                                </div>
                                                                            </div>
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee guest person">
                                                                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Gender</label>
                                                                                <div className="btn-group btn-group-toggle col-lg-12 nopadding" data-toggle="buttons">
                                                                                    <label className={this.state.toggleButtonValue === "Male" ? "btn toggleButton customToggleButton col-lg-3 btn-secondary active" : "btn toggleButton customToggleButton col-lg-3 btn-secondary "} value="Male" onClick={this.getSelectedGender.bind(this, "Male")}  >
                                                                                        <input type="radio"
                                                                                            name="options"
                                                                                            id="Male"
                                                                                            value="male"
                                                                                            autoComplete="off"
                                                                                            checked={this.state.toggleButtonValue === "Male" ? "checked" : "unchecked"}
                                                                                        /> Male
                                                                                    </label>
                                                                                    <label className={this.state.toggleButtonValue === "Female" ? "btn toggleButton customToggleButton col-lg-3 btn-secondary active" : "btn toggleButton customToggleButton col-lg-3 btn-secondary "} value="Female" onClick={this.getSelectedGender.bind(this, "Female")}>
                                                                                        <input type="radio" name="options" id="Female" value="Female" autoComplete="off" checked={this.state.toggleButtonValue === "Female" ? "checked" : "unchecked"} /> Female
                                                                                    </label>
                                                                                    <label className={this.state.toggleButtonValue === "Transgender" ? "btn toggleButton customToggleButton col-lg-5 noRightMargin btn-secondary active" : "btn toggleButton customToggleButton noRightMargin col-lg-5 btn-secondary "} value="Transgender" onClick={this.getSelectedGender.bind(this, "Transgender")}>
                                                                                        <input type="radio" name="options" id="Transgender" autoComplete="off" checked={this.state.toggleButtonValue === "Transgender" ? "checked" : "unchecked"} /> Transgender
                                                                                    </label>
                                                                                </div>

                                                                            </div>
                                                                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 driver guest employee person" >
                                                                                <div id="email">
                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Email {this.state.pathname == "driver" ? "" : <i className="astrick">*</i>}
                                                                                        <a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="testemail@gmail.com" className="fa fa-question-circle"></i> </a>

                                                                                    </label>
                                                                                    <input type="email" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" value={this.state.email} ref="email" name="email" onChange={this.handleChange} placeholder="testemail@gmail.com" />
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                        <div className=" col-lg-3 col-md-12 col-sm-12 col-xs-12 ">
                                                                            <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 uploadImage nopadding ">
                                                                                <div className="col-lg-12 col-md-2 col-sm-12 col-xs-12 driver employee guest person nopadding ">
                                                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileImageDiv" id="LogoImageUpEmployee">
                                                                                            <div><i className="fa fa-camera"></i> <br /><p>UPLOAD PHOTO</p></div>
                                                                                            <input onChange={this.docBrowseSingle.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="profilePhoto" />
                                                                                        </div>

                                                                                        {
                                                                                            this.state.profilePhoto ?
                                                                                                <div className="col-lg-12 col-md-2 col-sm-12 col-xs-12 nopadding CustomImageUpload">
                                                                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                                                                        <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={this.state.profilePhoto} name="profilePhoto" data-toggle="tooltip" title="Delete Image" onClick={this.deleteDocSingle.bind(this)}>x</label>
                                                                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogosPM" id="profilePhoto">

                                                                                                            {
                                                                                                                this.state.profilePhoto ?
                                                                                                                    <img src={this.state.profilePhoto} className="img-responsive profileImageDivlogoStyle2" />
                                                                                                                    :
                                                                                                                    <img src="/images/login.png" className="img-responsive profileImageDivlogoStyle2" />
                                                                                                            }

                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                :
                                                                                                null

                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                        <div className="form-margin col-lg-9 col-md-12 col-sm-12 col-xs-12 driver guest employee person NOpadding-left NOpadding-right">
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver guest employee person">
                                                                                <div id="contactNumber">
                                                                                    <label className="labelform  NOpadding-left">Contact Number <i className="astrick">*</i></label>
                                                                                    <PhoneInput
                                                                                        country={'in'}
                                                                                        value={this.state.contactNumber}
                                                                                        name="contactNumber"
                                                                                        inputProps={{
                                                                                            name: 'contactNumber',
                                                                                            required: true
                                                                                        }}
                                                                                        onChange={this.changeMobile.bind(this)}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">
                                                                                <label className="labelform  NOpadding-left">Alternate Number </label>
                                                                                <PhoneInput
                                                                                    country={'in'}
                                                                                    value={this.state.alternateNumber}
                                                                                    name="alternateNumber"
                                                                                    inputProps={{
                                                                                        name: 'alternateNumber',
                                                                                        required: true
                                                                                    }}
                                                                                    onChange={this.changeMobileAlternate.bind(this)}
                                                                                />
                                                                            </div>

                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">

                                                                                <label className="labelform  NOpadding-left">WhatsApp Number</label>
                                                                                <PhoneInput
                                                                                    country={'in'}
                                                                                    value={this.state.whatsappNumber}
                                                                                    name="whatsappNumber"
                                                                                    inputProps={{
                                                                                        name: 'whatsappNumber',
                                                                                        required: true
                                                                                    }}
                                                                                    onChange={this.changeMobileWhatsapp.bind(this)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="form-margin col-lg-9 col-md-12 col-sm-12 col-xs-12  employee person NOpadding-left NOpadding-right">
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">
                                                                                <div id="department">
                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Department <i className="astrick">*</i></label>
                                                                                    <select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                                                                        ref="department" value={this.state.department} name="department" onChange={this.handleChangeDepartment} >
                                                                                        <option selected={true} disabled={true} >-- Select --</option>
                                                                                        {
                                                                                            this.state.departmentArray && this.state.departmentArray.length > 0 ?
                                                                                                this.state.departmentArray.map((deptData, index) => {
                                                                                                    return (
                                                                                                        <option key={index} value={deptData._id}>{(deptData.department)}</option>
                                                                                                    );
                                                                                                }
                                                                                                ) : ''
                                                                                        }
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee person">
                                                                                <div id="designation">
                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Designation <i className="astrick">*</i></label>
                                                                                    <select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" ref="designation" value={this.state.designation} name="designation" onChange={this.handleChangeDesignation}>
                                                                                        <option selected={true} disabled={true} >-- Select --</option>
                                                                                        {
                                                                                            this.state.designationArray && this.state.designationArray.length > 0 ?
                                                                                                this.state.designationArray.map((desData, index) => {
                                                                                                    return (
                                                                                                        <option key={index} value={desData._id}>{(desData.designation)}</option>
                                                                                                    );
                                                                                                }) : ''
                                                                                        }
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee person">
                                                                                <div id="employeeID">
                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Employee ID <i className="astrick">*</i></label>
                                                                                    <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.employeeID} ref="employeeID" name="employeeID" onChange={this.handleChange} />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="form-margin col-lg-9 col-md-12 col-sm-12 col-xs-12  employee person NOpadding-left NOpadding-right">
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee  person">
                                                                                <label className="subHeadingPM col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Create Login Credential</label>
                                                                                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                                                                    <label className={this.state.loginCredential === "Yes" ? "btn toggleButton customToggleButtonPermission btn-secondary active" : "btn toggleButton customToggleButtonPermission btn-secondary"} value="Yes" onClick={this.getSelectedLoginValue.bind(this, "Yes")}>
                                                                                        <input type="radio"
                                                                                            name="options"
                                                                                            id="yes"
                                                                                            value="yes"
                                                                                            autocomplete="off"
                                                                                            checked
                                                                                        />Yes
                                                                                    </label>
                                                                                    <label className={this.state.loginCredential === "No" ? "btn toggleButton customToggleButtonPermission btn-secondary active" : "btn toggleButton customToggleButtonPermission btn-secondary"} value="One Way" onClick={this.getSelectedLoginValue.bind(this, "No")} >
                                                                                        <input type="radio" name="options" id="no" value="no" autocomplete="off" /> No
                                                                                    </label>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                        <div className="form-margin col-lg-9 col-md-12 col-sm-12 col-xs-12  employee person NOpadding-left NOpadding-right">
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee  person">
                                                                                <label className="subHeadingPM col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Booking Approval Required</label>
                                                                                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                                                                    <label className={this.state.getSelectedTrip  && this.state.preApprovedParameterValue=== "Yes" ? "btn toggleButton customToggleButtonPermission btn-secondary active" : "btn toggleButton customToggleButtonPermission btn-secondary"} value="Yes" onClick={this.getSelectedTrip.bind(this, "Yes")}>
                                                                                        <input type="radio"
                                                                                            name="options"
                                                                                            id="yes"
                                                                                            value="yes"
                                                                                            autocomplete="off"
                                                                                            checked
                                                                                        />Yes
                                                                                    </label>
                                                                                    <label className={this.state.getSelectedTrip === "No" ? "btn toggleButton customToggleButtonPermission btn-secondary active" : "btn toggleButton customToggleButtonPermission btn-secondary"} value="One Way" onClick={this.getSelectedTrip.bind(this, "No")} >
                                                                                        <input type="radio" name="options" id="no" value="no" autocomplete="off" /> No
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                            {
                                                                                this.state.getSelectedTrip === "Yes" ?
                                                                                    <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee  person">
                                                                                        <div id="approvingAuthorityId1">
                                                                                            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Approving Authority Id1<i className="astrick">*</i></label>
                                                                                            <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.approvingAuthorityId1} ref="approvingAuthorityId1" name="approvingAuthorityId1" onChange={this.handleChange} />
                                                                                        </div>
                                                                                    </div>

                                                                                    :
                                                                                    null
                                                                            }
                                                                            {
                                                                                this.state.getSelectedTrip === "Yes" ?
                                                                                    <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee  person">
                                                                                        <div id="approvingAuthorityId2">
                                                                                            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Approving Authority Id2<i className="astrick">*</i></label>
                                                                                            <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.approvingAuthorityId2} ref="approvingAuthorityId2" name="approvingAuthorityId2" onChange={this.handleChange} />
                                                                                        </div>
                                                                                    </div>
                                                                                    :
                                                                                    null
                                                                            }
                                                                        </div>
                                                                        <div className="form-margin col-lg-9 col-md-12 col-sm-12 col-xs-12  employee person NOpadding-left NOpadding-right">
                                                                            {
                                                                                this.state.getSelectedTrip === "Yes" ?
                                                                                    <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee  person">
                                                                                        <div id="approvingAuthorityId3">
                                                                                            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Approving Authority Id3<i className="astrick">*</i></label>
                                                                                            <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.approvingAuthorityId3} ref="approvingAuthorityId3" name="approvingAuthorityId3" onChange={this.handleChange} />
                                                                                        </div>
                                                                                    </div>
                                                                                    :
                                                                                    null
                                                                            }
                                                                            {
                                                                                this.state.getSelectedTrip === "Yes" ?
                                                                                    <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee  person">
                                                                                        <div id="preApprovedParameter">
                                                                                            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Pre Approved Parameter <i className="astrick">*</i></label>
                                                                                            <select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                                                                                ref="preApprovedParameter" name="preApprovedParameter" value={this.state.preApprovedParameter} onChange={this.handleChange}>
                                                                                                <option selected={true} disabled={true}>-- Select --</option>
                                                                                                <option>Amount</option>
                                                                                                <option>Number Of Ride</option>
                                                                                                <option>Kilometer</option>
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                    :
                                                                                    null
                                                                            }
                                                                            {
                                                                                this.state.getSelectedTrip === "Yes" ?
                                                                                    <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee  person">
                                                                                        <div id="preApprovedParameterValue">
                                                                                            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Pre Approved {this.state.preApprovedParameter}<i className="astrick">*</i></label>
                                                                                            <input type="number" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.preApprovedParameterValue} ref="preApprovedParameterValue" name="preApprovedParameterValue" onKeyDown={this.keyPressNumber.bind(this)} onChange={this.handleChange} />
                                                                                        </div>
                                                                                    </div>
                                                                                    :
                                                                                    null
                                                                            }
                                                                        </div>


                                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 driver employee  person borderBottom">
                                                                        </div>
                                                                        <label className="subHead col-lg-12 col-md-12 col-sm-12 col-xs-12 driver person employee">Home Address Details</label>
                                                                        <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
                                                                                <div id="addressLine1">
                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Address Line 1 <i className="astrick">*</i></label>
                                                                                    <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.addressLine1} ref="addressLine1" name="addressLine1" onChange={this.handleChange} />
                                                                                </div>
                                                                            </div>
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
                                                                                <div id="addressLine2">
                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Address Line 2 </label>
                                                                                    <input type="text" id="addressLine2" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.addressLine2} ref="addressLine2" name="addressLine2" onChange={this.handleChange} />
                                                                                </div>
                                                                            </div>
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
                                                                                <div id="landmark">
                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Landmark </label>
                                                                                    <input type="text" id="landmark" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.landmark} ref="landmark" name="landmark" onChange={this.handleChange} />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12  driver employee person NOpadding-left NOpadding-right">
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
                                                                                <div id="country">
                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Country <i className="astrick">*</i></label>
                                                                                    <select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                                                                        ref="country" name="country" id="countryVal" value={this.state.country} onChange={this.handleChangeCountry} >
                                                                                        <option selected={true}>-- Select --</option>
                                                                                        <option value="IN|India">India</option>
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
                                                                                <div id="states">
                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">State <i className="astrick">*</i></label>
                                                                                    <select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                                                                        ref="states" value={this.state.states} name="states" onChange={this.handleChangeState} >
                                                                                        <option selected={true} disabled={true}>-- Select --</option>
                                                                                        {
                                                                                            this.state.stateArray && this.state.stateArray.length > 0 ?
                                                                                                this.state.stateArray.map((stateData, index) => {
                                                                                                    return (
                                                                                                        <option key={index} value={stateData.stateCode + "|" + stateData.stateName}>{this.camelCase(stateData.stateName)}</option>
                                                                                                    );
                                                                                                }) : ''
                                                                                        }
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
                                                                                <div id="district">
                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">District <i className="astrick">*</i></label>
                                                                                    <select id="district" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                                                                        ref="district" name="district" value={this.state.district} onChange={this.handleChange} >
                                                                                        <option selected={true} disabled={true}>-- Select --</option>
                                                                                        {
                                                                                            this.state.districtArray && this.state.districtArray.length > 0 ?
                                                                                                this.state.districtArray.map((districtdata, index) => {
                                                                                                    return (
                                                                                                        <option key={index} value={districtdata.districtName}>{this.camelCase(districtdata.districtName)}</option>
                                                                                                    );
                                                                                                }
                                                                                                ) : ''
                                                                                        }
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12   driver employee person NOpadding-left NOpadding-right">
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12  driver person employee">
                                                                                <div id="area">
                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Area <i className="astrick">*</i></label>
                                                                                    <input type="text" id="area" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.area} ref="area" name="area" onChange={this.handleChange} />
                                                                                </div>
                                                                            </div>
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12  driver person employee">
                                                                                <div id="city">
                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">City <i className="astrick">*</i></label>
                                                                                    <input type="text" id="city" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.city} ref="city" name="city" onChange={this.handleChange} required />
                                                                                </div>
                                                                            </div>
                                                                            <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">
                                                                                <div id="pincode">
                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Pincode <i className="astrick">*</i></label>
                                                                                    <input maxLength="6" onChange={this.handlePincode.bind(this)} type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.pincode} ref="pincode" name="pincode" onKeyDown={this.keyPressNumber.bind(this)} />
                                                                                    {this.state.pincodeExists ? null : <label style={{ color: "red", fontWeight: "100" }}>This Pin Code doesn't exist!</label>}

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 person driver borderBottom"></div>


                                                                        {
                                                                            this.state.DocumentsDetails && this.state.DocumentsDetails.length > 0 ?
                                                                                this.state.DocumentsDetails.map((doc, i) => {
                                                                                    return (
                                                                                        <div key={i} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">
                                                                                            <label className="subHead col-lg-12 col-md-12 col-sm-12 col-xs-12 driver  person">{doc.documentName} Details</label>
                                                                                            <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                                                                                                <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver  person">
                                                                                                    <div id="documentNumber" name="documentNumber">
                                                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">{doc.documentName} Number <i className="astrick">*</i>
                                                                                                            {/* <a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="GJ1220190000001" className="fa fa-question-circle"></i> </a> */}
                                                                                                        </label>
                                                                                                        <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"  ref={"documentNumber"+i} name={"documentNumber"+i} id={"documentNumber"+i} value={this.state[`documentNumber${i}`]}  index={i} token={doc.documentName}  placeholder={"Enter " +doc.documentName +" Number"}  onChange={this.handleChange} required/>
                                                                                                        {/* {this.state[`documentNumber${i}`] ? <label style={{ color: "red", fontWeight: "100" }}>This field is required!</label> : null } */}
                                                                                                    </div>
                                                                                                </div>
                                
                                                                                                <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver  person">
                                                                                                    <div id="documentValidFrom">
                                                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Valid From Date
                                                                                                        </label>
                                                                                                        <input type="date" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" name={"documentValidFrom"+i} id={"documentValidFrom"+i} value={moment(this.state[`documentValidFrom${i}`]).format("YYYY-MM-DD")}   index={i} token={doc.documentName} max={moment(new Date).format("YYYY-MM-DD")} ref={"documentValidFrom"+i} onChange={this.handleChange}/>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver  person">
                                                                                                    <div id="effectiveUpto">
                                                                                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Valid To Date
                                                                                                        </label>
                                                                                                        <input type="date" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" index={i} token={doc.documentName} name={"documentValidTo"+i} id={"documentValidTo"+i} value={moment(this.state[`documentValidTo${i}`]).format("YYYY-MM-DD")} ref={"documentValidTo"+i}  min={moment(new Date).format("YYYY-MM-DD")} onChange={this.handleChange}/>
                                                                                                    </div>
                                                                                                </div>

                                                                                            </div>
                                                                                            <div className="form-margin col-lg-8 col-md-12 col-sm-12 col-xs-12  driver person NOpadding-left NOpadding-right">
                                                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  driver person ">
                                                                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">{doc.documentName} Proof (jpg, jpeg, png, pdf)  <i className="astrick">*</i></label>
                                                                                                    <div className="col-lg-1 col-md-2 col-sm-12 col-xs-12 driver person nopadding">
                                                                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                                                                                            <div className="padtop"><i className="fa fa-upload"></i><br/></div>
                                                                                                            <input multiple onChange={this.docBrowse.bind(this)} name={"DocProof"+i} id={"ImgProof"+i} value={this.state[`ImgProof${i}`]}  type="file" token={doc.documentName} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"  />
                                                                                                            {/* {this.state["DocProof"+i] !== "" ?
                                                                                                                <input multiple onChange={this.docBrowse.bind(this)} name={"DocProof"+i} id={"ImgProof"+i} value={this.state[`ImgProof${i}`]}  type="file" token={doc.documentName} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"  />
                                                                                                                :
                                                                                                                <img src="⁨../../../public⁩/images⁩/loading.gif" alt="Logo_img" height="21%" width="21%" className="imgHt"/>
                                                                                                            } */}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    
                                                                                                    {
                                                                                                        this.state["DocProof"+i] && this.state["DocProof"+i].length > 0 ?
                                                                                                            this.state["DocProof"+i].map((data, i) => {
                                                                                                                
                                                                                                                console.log("data DocProof==>",data);
                                                                                                                return (
                                                                                                                    <div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                                                                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                                                                                            <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={data} index={i} token={doc.documentName} data-toggle="tooltip" title="Delete Image" name={"DocProof"+i}  onClick={this.deleteDoc.bind(this)}>x</label>
                                                                                                                            {
                                                                                                                                (data ? data.split('.').pop() : "") === "pdf" || (data ? data.split('.').pop() : "") === "PDF" ?
                                                                                                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdfContainerPM" id="LogoImageUpOne">
                                                                                                                                        <img src="/images/pdfImg.png" />
                                                                                                                                        <span>{(data ? data.split('.').pop() : "")}</span>
                                                                                                                                    </div>
                                                                                                                                    :
                                                                                                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos2" id="licenseProof">
                                                                                                                                        <img src={data} className="img-responsive logoStyle2" />
                                                                                                                                    </div>
                                                                                                                            }
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                );
                                                                                                            })
                                                                                                            :
                                                                                                            ( this.state.gotImagecategoryImage  ?
                                                                                                                <div className="col-lg-12 col-md-2 col-sm-12 col-xs-12 nopadding CustomImageUploadOF">
                                                                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                                                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogosOF" id="categoryImage">
                                                                                                                            <img src="/images/loading.gif" className="img-responsive profileImageDivlogoStyleOF"/>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            :
                                                                                                            null)
                                                                                                    }
                                                                                                    {
                                                                                                        this.state.showdocimg ?
                                                                                                            this.state["docproofimg"+i] && this.state["docproofimg"+i].length > 0 ?
                                                                                                                this.state["docproofimg"+i].map((data, i) => {
                                                                                                                    console.log("data DocProof==>",data);
                                                                                                                    return (
                                                                                                                        <div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                                                                                                        {
                                                                                                                            data !== null ?
                                                                                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                                                                                                <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" data-toggle="tooltip" title="Delete Image" id={data} index={i} token={doc.documentName} name={"docproofimg"+i} onClick={this.deleteDoc.bind(this,i)}>x</label>
                                                                                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos2" id={data}>
                                                                                                                                    <img src={data} className="img-responsive logoStyle2" />
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            : 
                                                                                                                            null
                                                                                                                        }
                                                                                                                        </div>
                                                                                                                    );
                                                                                                                })
                                                                                                            :
                                                                                                            null
                                                                                                        :
                                                                                                        null
                                                                                                    }
                                                                                                </div>

                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })
                                                                                :
                                                                                null
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                                                                    {
                                                                        this.state.personID ?
                                                                            <button className="btn button3 pull-right" onClick={this.updatePerson.bind(this)} >Update&nbsp;</button>
                                                                            :
                                                                            <button type="submit" className="btn button3 pull-right" onClick={this.submitPerson.bind(this)} >Submit&nbsp;</button>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>

                                                <div id="bulk" className="tab-pane fade in col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerForm">
                                                        <BulkUpload url="/api/personMaster/bulkUploadEmployee"
                                                            data={{ "type": "employee", "createdBy": localStorage.getItem("user_ID"), "corporateId": localStorage.getItem("corporate_ID") }}
                                                            uploadedData={this.uploadedData}
                                                            fileurl="https://fivebees.s3.ap-south-1.amazonaws.com/prod/master/personMaster.xlsx"
                                                            getFileDetails={this.getFileDetails.bind(this)}
                                                            fileDetails={this.state.fileDetails}
                                                            goodRecordsHeading={this.state.goodRecordsHeading}
                                                            failedtableHeading={this.state.failedtableHeading}
                                                            failedRecordsTable={this.state.failedRecordsTable}
                                                            failedRecordsCount={this.state.failedRecordsCount}
                                                            goodRecordsTable={this.state.goodRecordsTable}
                                                            goodDataCount={this.state.goodDataCount}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </section>
                            </div>
                        </div>
                        :
                        null
                }
            </div>
        );
    }
}
export default withRouter(PersonMaster);

