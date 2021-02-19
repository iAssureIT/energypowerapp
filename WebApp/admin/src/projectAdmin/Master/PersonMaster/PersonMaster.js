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
import BulkUpload from "../../../coreadmin/Master/BulkUpload/BulkUpload.js";
// import SelectCorporate from "../SelectCorporate/SelectCorporate.js";
import "bootstrap-toggle/css/bootstrap2-toggle.min.css";
import "bootstrap-toggle/js/bootstrap2-toggle.min.js";
import "./PersonMaster.css";
import ImageLoader from 'react-load-image';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import MapContainer from '../../Map/MapContainer.js';
import Geocode from "react-geocode";

import Department from  '../../../coreadmin/Master/Department/DepartmentMaster-GlobalMaster.js';
import Designation from  '../../../coreadmin/Master/Designation/DesignationMaster-GlobalMaster.js';
import ReimbursementMaster from '../Reimbursement/ReimbursementList.js';
import IAssureTable         from "../../../coreadmin/IAssureTable/IAssureTable.jsx";

var contactarray = [];
var personIDOF = "";
class PersonMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "pathname": this.props.entity ? this.props.entity : this.props.match.params.type ? this.props.match.params.type : "",
      "personID": this.props.match.params ? this.props.match.params.personID : '',
      "listOfRoles": [],
      "companyLogo": [],
      "contactarray": [],
      "districtArray": [],
      "designationArray": [],
      "departmentArray": [],
      vehicleArray:[],
      "corporateLocationArray": [],
      "manager1Name": "",
      'toggleButtonValue': "Male",
      'getSelectedTrip': "Yes",
      'loginCredential': "Yes",
      'workLocationId': "",
      'changeAppAuth': false,
      gmapsLoaded: false,
      vehicle:'',
      fuelreimbursement_id:'',
      latLng:{lat:null,lng:null},
      // 'gotImageprofileImage': false,
      'userId': "",
      'pincodeExists': true,
      'contactNumberAvailable': true,
      "stateArray": [],
      "licenseProof": [],
      "panProof": [],
      "aadharProof": [],
      "voterIDProof": [],
      "profilePhoto": "",
      "companyId": "",
      "passportProof": [],
      "company_id": "",
      "addressProof": [],
      "identityProof": [],
      "verificationProof": [],
      socialMediaArray:[],
      imagesArray:[],
      "COI": [],
      "loading": false,
      fileDetailUrl: "/api/personmaster/get/filedetails/",
      'url': "http://uatadmin.fivebees.in",
      goodRecordsHeading: {

        firstName: "First Name",
        // middleName: "Middle Name",
        lastName: "Last Name",
        companyName: "Company Name",

        // DOB: "DOB",
        // gender: "Gender",
        contactNo: "Contact No",
        // altContactNo: "Alt Contact No",
        email: "Email",
        whatsappNo: "Whats App No",
        // department: "Department",
        // designation: "Designation",
        // employeeId: "Employee Id",
        
      },
      failedtableHeading: {
        firstName: "First Name",
        // middleName: "Middle Name",
        lastName: "Last Name",
        companyName: "Company Name",
        // DOB: "DOB",
        // gender: "Gender",
        contactNo: "Contact No",
        // altContactNo: "Alt Contact No",
        email: "Email",
        whatsappNo: "Whats App No",
        // department: "Department",
        // designation: "Designation",
        // employeeId: "Employee Id",
        failedRemark: "Failed Data Remark"
      },
   
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
    var role = [];
    var getCompany_Id = localStorage.getItem("company_Id")
    var getcompanyID = localStorage.getItem("companyID");
    console.log("company_Id",getcompanyID);
    var companyName = localStorage.getItem("companyName");
    role.push(localStorage.getItem("roles"));
    this.setState({
      listOfRoles: role,
    })
    if (role.indexOf("admin") === 0) {
      this.setState({
        companyID: getcompanyID,
        corporate_Id: getCompany_Id,
        corporate: companyName
      }, () => {
        this.getEntityLocation(getCompany_Id);
      })
    }

    this.getEntity();
    this.getElementByIds();
    this.getDesignation();
    this.getDepartment();
    this.getCompany();
    this.getDriverData();
    this.dynamicvalidation();
    this.getRoles();
    this.getVehicles();
    this.getSocialMedia();
    console.log("this.props.match.params.personID===>",this.props.match.params.personID);
    console.log("this.pathname===>",this.state.pathname);
    this.setState({
      personID: this.props.match.params.personID,
    }, () => {
      this.edit();
    })
  }

  getSocialMedia(){
    axios.post("/api/socialmediamaster/get/list")
      .then((response) => {
        console.log("response",response);
      var socialMediaOptions = response.data;
      this.setState({
        socialMediaOptions: socialMediaOptions
      },()=>{

      })
      })
      .catch((error) => {
         console.log("error",error);

      })
  }


  getRoles() {
    axios.post("/api/roles/get/list")
      .then((response) => {
        console.log("response",response);
      var rolesArray = response.data.filter(a=>a.rolesentity == 'appCompany')
      this.setState({
        rolesArray: rolesArray
      },()=>{

      })
      })
      .catch((error) => {
         console.log("error",error);

      })
  }

  getVehicles(){
     axios.post("/api/fuelReimbursement/get/list")
      .then((response) => {
        this.setState({
          vehicleArray: response.data
        })
      })
      .catch((error) => {
         console.log("error",error);

      })
  }

  getElementByIds()
  {
    var listOfEmpID = [];
    var listOfEmpEmail = [];
    var formvalues = { type :this.state.pathname}
    axios.post("/api/personmaster/get/list",formvalues)
        .then((response) => {
            this.setState({
                personListID   : response.data,
            })
            for(let i=0;i<this.state.personListID.length;i++)
            {
                listOfEmpID.push(this.state.personListID[i].employeeId)
                listOfEmpEmail.push(this.state.personListID[i].email)
            }
            this.setState({
                listOfEmpID:listOfEmpID,
                listOfEmpEmail:listOfEmpEmail
            },()=>{
            })
        })
        .catch((error) => {
        })
  }

    edit() {
    var personID = this.state.personID;
    if (personID) {
        axios.get('/api/personmaster/get/one/' + personID)
        .then((response) => {
            console.log("response for vehicle",response);
          if(this.state.pathname === 'employee') {
            var docarray = response.data.Documentarray;
                var index = docarray;
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
                        ["DocProof"+i]          : docarray[i].documentProof.imgUrl,
                        docimgarray             : docarray[i].documentProof.imgUrl,
                        showdocimg              : true,
                    })
                } 
                this.setState({
                    DocumentsDetails : docarr,
                }, () => {
                });
            this.setState({companyID: response.data.companyID,
              corporate_Id: response.data.company_Id,
              corporate: response.data.companyName,
              firstName: response.data.firstName,
              middleName: response.data.middleName,
              lastName: response.data.lastName,
              DOB: moment(response.data.DOB).format("YYYY-MM-DD"),
              toggleButtonValue: response.data.gender ? response.data.gender : "Male",
              contactNumber: response.data.contactNo ? response.data.contactNo : "",
              alternateNumber: response.data.altContactNo ? response.data.altContactNo : "",
              bookingApprovalRequired: response.data.bookingApprovalRequired && response.data.bookingApprovalRequired === true ? "Yes" : "No",
              getSelectedTrip :   response.data.bookingApprovalRequired && response.data.bookingApprovalRequired === "true" ? "Yes" : "No",
              getSelectedTrip: response.data.bookingApprovalRequired && (response.data.bookingApprovalRequired === "Yes" || response.data.bookingApprovalRequired === true) ? "Yes" : "No",
              loginCredential: response.data.loginCredential ? response.data.loginCredential : "Yes",
              whatsappNumber: response.data.whatsappNo ? response.data.whatsappNo : "",
              departmentVal : response.data.departmentId,
              designationVal :response.data.designationId,
              employeeID: response.data.employeeId,
              workLocationLatLng : response.data.workLocationLatLng,
              workLocation: response.data.workLocation,
              vehicle: response.data.vehicle,
              fuelreimbursement_id: response.data.fuelreimbursement_id,
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
              states: response.data.address[0] ? response.data.address[0].state : "",
              country: response.data.address[0] ? response.data.address[0].country : "-- Select --",
              pincode: response.data.address[0] ? response.data.address[0].pincode : "",
              email: response.data.email,
              latLng:response.data.address[0] ? {lat:response.data.address[0].latitude,lng:response.data.address[0].longitude}:"",
              profilePhoto: response.data.profilePhoto,
              userId:response.data.userId,
              imagesArray:response.data.workImages,
              socialMediaArray:response.data.socialMediaArray ? response.data.socialMediaArray : [],
              createdBy: localStorage.getItem("user_ID")
            }, () => {
              this.getEntityLocation(this.state.corporate_Id);
              axios.get('/api/users/get/user_details/'+response.data.userId)
              .then(res=>{
                  if(res.data.roles.length > 0){
                    if(res.data.roles.length>1){
                      this.setState({role:res.data.roles[1]})
                    }else{
                      this.setState({role:res.data.roles[0]})
                    }
                  }else{
                    this.setState({role:'employee'})
                  }
              })
              .catch(err=>{
                console.log("err=>",err);
              })
              if (response.data.address.length > 0) {
                this.getStates(response.data.address[0].countryCode);
                this.getDistrict(response.data.address[0].stateCode, response.data.address[0].countryCode);
              }


            })
          }
        })
        .catch((error) => {
        })
    }
  }

  dynamicvalidation(){
    if (this.state.pathname === "employee") {
        $(".person").hide();
        $(".employee").show();
        $.validator.addMethod("regxEmail", function (value, element, regexpr) {
            return regexpr.test(value);
        }, "Please enter valid Email Id");
         $.validator.addMethod("regxvendor", function (value, element, arg) {
            return arg !== value;
        }, "Please select the corporate");
        // $.validator.addMethod("regxcontry", function (value, element, arg) {
        //     return arg !== value;
        // }, "Please select the country");


        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });
        $("#BasicInfo").validate({
            rules: {

                firstName: {
                    required: true
                },

                empCategory: {
                    required: true
                },
                empPriority: {
                    required: true
                },
                // middleName: {
                //     required: true
                // },
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
                    regxvendor: "-- Select --"

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
                departmentVal: {
                    required: true,
                },
                designationVal: {
                    required: true,
                },
                documentNumber0: {
                    required: true,
                },
                employeeID: {
                    // required: true,
                },
                vehicle:{
                  required:true,
                }

            },
            errorPlacement: function (error, element) {
                if (element.attr("name") === "firstName") {
                    error.insertAfter("#firstName");
                }
                if (element.attr("name") === "lastName") {
                    error.insertAfter("#lastName");
                }
                if (element.attr("name") === "empPriority") {
                    error.insertAfter("#empPriority");
                }
                // if (element.attr("name") === "middleName") {
                //     error.insertAfter("#middleName");
                // }
                if (element.attr("name") === "empCategory") {
                    error.insertAfter("#empCategory");
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
                if (element.attr("name") === "departmentVal") {
                    error.insertAfter("#departmentVal");
                }
                if (element.attr("name") === "designationVal") {
                    error.insertAfter("#designationVal");
                }
                if (element.attr("name") === "workLocation") {
                    error.insertAfter("#workLocation");
                }
                if (element.attr("name") === "corporate") {
                    error.insertAfter("#corporate");
                }
                if (element.attr("name") === "documentNumber0") {
                    error.insertAfter("#documentNumber0");
                }
                if (element.attr("name") === "employeeID") {
                    error.insertAfter("#employeeID");
                }
                if (element.attr("name") === "vehicle") {
                    error.insertAfter("#vehicleVal");
                }

            }
        });
    }
 }
  getDriverData() {
    var entityname =this.state.pathname;
    axios.get('/api/documentlistmaster/get/list/'+entityname)
        .then((response) => {
          console.log("response=====>",response);
            var DocumentsDetails = response.data
            // responseArray
            this.setState({
                DocumentsDetails : DocumentsDetails,
                documentindex : DocumentsDetails.length,
            },()=>{
                this.dynamicvalidation();
            })
        })
        .catch((error) => {
          console.log("error",error);
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
  // handleChange(event) {
  //   event.preventDefault();
  //   const target = event.target;
  //   const name = target.name;

  //   this.setState({
  //     [name]: event.target.value
  //   }, () => {
  //   });
  // }
  handleChange(event) {
    event.preventDefault();
    const target = event.target;
    const name = target.name;
    const token = $(event.target).attr('token');
    const indexof = $(event.target).attr('index');
    if(name == ['documentNumber'+indexof]){
    this.setState({
        ['documentName'+indexof] : token
        })
    }
    if(name==='vehicle'){
      var e = document.getElementById("vehicle");
      var fuelreimbursement_id = e.options[e.selectedIndex].id;
      this.setState({fuelreimbursement_id})
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
        });
        
    if (this.state.contactNumber == "" || this.state.contactNumber == undefined) {
      this.setState({
        contactNumberAvailable: false
      })
    }
    else {
      this.setState({
        contactNumberAvailable: true
      })
    }
    if(this.state.pathname === 'employee') {
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
        whatsappNo: this.state.whatsappNumber ? this.state.whatsappNumber : '',
        profilePhoto: this.state.profilePhoto,
        identityProof: this.state.identityProof,
        loginCredential: this.state.loginCredential,
        departmentId: this.state.departmentVal,
        designationId: this.state.designationVal,
        Documentarray: docarr,
        badgeNumber: this.state.badgeNumber,
        vehicle:this.state.vehicle,
        fuelreimbursement_id:this.state.fuelreimbursement_id,
        'employeeId' : this.state.employeeID,
        workImages : this.state.imagesArray, 
        socialMediaArray : this.state.socialMediaArray,
        address: {
          addressLine1: this.state.addressLine1,
          addressLine2: this.state.addressLine2,
          landmark: this.state.landmark ? this.state.landmark : "",
          area: this.state.area,
          city: this.state.city,
          district: this.state.district,
          state: this.state.states,
          stateCode: this.state.stateCode,
          country: this.state.country,
          countryCode: this.state.countryCode,
          latitude: this.state.latLng ? this.state.latLng.lat : "",
          longitude: this.state.latLng ? this.state.latLng.lng : "",
          pincode: this.state.pincode,
          addressProof: this.state.addressProof,
        },
        workLocation: this.state.workLocation,
        workLocationId: this.state.workLocationId,
        status: "Active",
        username: "MOBILE",
      }

    } else {
      var userDetails = {
        company_Id: this.state.corporate_Id,
        companyID: this.state.companyID,
        companyName: this.state.corporate,
        loginCredential: "No",
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
        bookingApprovalRequired: "Yes",
        approvingAuthorityId1: this.state.approvingAuthorityId1,
        approvingAuthorityId2: this.state.approvingAuthorityId2,
        approvingAuthorityId3: this.state.approvingAuthorityId3,
        preApprovedKilometer: this.state.preApprovedKilometer,
        preApprovedAmount: this.state.preApprovedAmount,
        preApprovedRides: this.state.preApprovedRides,
        profilePhoto: this.state.profilePhoto,
        status: "Active",
      }
    }
    console.log("userDetails",userDetails);
    const main = async () => {
      if ($('#BasicInfo').valid() && this.state.pincodeExists && this.state.contactNumberAvailable && this.state.listOfEmpEmail.indexOf(this.state.email) === -1) {
        if (userDetails.loginCredential === "Yes") {
          userDetails.userId = await this.createLogin();
          console.log("check userDetails=>",userDetails);
          this.setState({
            getUserId : userDetails.userId
          })
         var sendData = {
              "event": "Event11", //Event Name
              "toUser_id": userDetails.userId, //To user_id(ref:users)
              "toUserRole":"employee",
              "variables": {
                'EmployeeName': this.state.firstName + ' ' + this.state.lastName,
                'Password': "welcome123",
                'MobileNo': this.state.contactNumber,
                'Email': this.state.email,
                'SendUrl' : 'http://qasta.iassureit.com'
              }
            }
            console.log("sendData",sendData);
            axios.post('/api/masternotifications/post/sendNotification', sendData)
              .then((res) => {
                console.log("res",res);
              })
              .catch((error) => { console.log('notification error: ', error) })
          }
         userDetails.workLocationLatLng = this.state.workLocationLatLng;
         this.savePerson(userDetails);

          var sendData = {
            "event": "Event4", //Event Name
            "toUser_id": userDetails.userId, //To user_id(ref:users)
            "toUserRole":"employee",
            "variables": {
              'EmployeeName': this.state.firstName + ' ' + this.state.lastName,
              'CompanyName': this.state.corporate,
              'Password': "welcome123",
              'mobileNo': this.state.contactNumber,
              'email': this.state.email,
              'sendUrl': this.state.url+"/login",
            }
          }
          axios.post('/api/masternotifications/post/sendNotification', sendData)
          .then((res) => {
          })
          .catch((error) => { console.log('notification error: ',error)})
      } else {
        if(this.state.listOfEmpEmail.indexOf(this.state.email) > -1)
        {

            swal("Email Already Exists")
        }
        $('select.error:first').focus();
        $('input.error:first').focus();
      }
    }
    main()
  }
  createLogin = () => {
    var userDetails = {
        firstname         : this.state.firstName,
        lastname          : this.state.lastName,
        mobNumber         : this.state.contactNumber,
        email             : this.state.email,
        companyID         : this.state.companyID,
        company_id        : this.state.corporate_Id,
        companyName       : this.state.corporate,
        pwd               : "welcome123",
        role              : this.state.loginCredential === "Yes" && this.state.role ? [this.state.pathname, this.state.role] : [this.state.pathname],
        status            : 'active',
        "emailSubject"    : "Email Verification",
        "emailContent"    : "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
    }
    console.log("userDetails",userDetails);
    return new Promise(function (resolve, reject) {
      axios.post('/api/auth/post/signup/user', userDetails)
        .then((response) => {
          resolve(response.data.ID);
          if (response.data.message == 'USER_CREATED') {
            
          } else {
            swal(response.data.message);
          }

        })
        .catch((error) => { })
    })
  }
  savePerson(userDetails) {
    axios.post('/api/personmaster/post', userDetails)
      .then((response) => {
        if(response.data.duplicated)
        {
            swal(this.Capitalize(this.state.pathname) + " Already Exists");

        }else{
          swal({
            title : this.Capitalize(this.state.pathname) + " Added Successfully",
            text  : "Login credentials created and emailed to user. \n LoginID : "+this.state.email+" \n Default Password :"+"welcome123 \n Employee also added in employee list."
          });
          this.props.history.push("/" + this.state.pathname + "/lists")
          this.getElementByIds();
          /*var userDetailsContact = {
              'entityID'                      : this.state.corporate_Id,
              'contactDetails'                : {
                  'branchCode'                : this.state.branchCode, 
                  'branchName'                : this.state.workLocation,
                  'workLocationId'            : this.state.workLocationId,
                  'firstName'                 : this.state.firstName,
                  'middleName'                : this.state.middleName,
                  'lastName'                  : this.state.lastName,
                  'gender'                    : this.state.toggleButtonValue,
                  'phone'                     : this.state.contactNumber,
                  'altPhone'                  : this.state.alternateNumber?this.state.alternateNumber:"",
                  'whatsappNo'                : this.state.whatsappNumber?this.state.whatsappNumber:"",
                  'email'                     : this.state.email,
                  'DOB'                       : this.state.DOB,
                  'departmentId'              : this.state.departmentVal,
                  'designationId'             : this.state.designationVal,
                  'employeeId'                : this.state.employeeID,
                  'vehicle'                   : this.state.vehicle,  
                  'fuelreimbursement_id'                   : this.state.fuelreimbursement_id,  
                  'userID'                    : this.state.getUserId,
                  'personID'                  : response.data.PersonId,
                  'createUser'                : this.state.loginCredential == "Yes" ? true : false,
                  'role'                      : this.state.pathname,
                  'addEmployee'               : this.state.addEmployee,
                  'address': this.state.addressLine1 !== "" ? [{
                      addressLine1                : this.state.addressLine1,
                      addressLine2                : this.state.addressLine2,
                      latitude: this.state.latLng ? this.state.latLng.lat : "",
                      longitude: this.state.latLng ? this.state.latLng.lng : "",
                      landmark                    : this.state.landmark,
                      area                        : this.state.area,
                      city                        : this.state.city,
                      district                    : this.state.district,
                      state                       : this.state.states,
                      stateCode                   : this.state.stateCode,
                      country                     : this.state.country,
                      countryCode                 : this.state.countryCode,
                      pincode                     : this.state.pincode,
                      addressProof                : this.state.addressProof,
                  }]:[],
              }
          }*/
    
        // this.saveContact(userDetailsContact);
        this.setState({
          firstName: "",
          middleName: "",
          lastName: "",
          DOB: "",
          gender: "",
          contactNumber: "",
          alternateNumber: "",
          whatsappNumber: "",
          departmentVal: "-- Select --",
          designationVal: "-- Select --",
          vehicle:'',
          fuelreimbursement_id:'',
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
          preApprovedKilometer: "",
          preApprovedAmount: "",
          preApprovedRides: "",          
          passportNumber: "",
          licenseProof: [],
          panProof: [],
          profilePhoto: "",
          aadharProof: [],
          voterIDProof: [],
          passportProof: [],

        }, () => {

        })


        }

      })
      .catch((error) => {
        console.log("error",error);
      })
  }
  saveContact(userDetails){

    axios.patch('/api/entitymaster/patch/addContact' ,userDetails)
        .then((response) => {
                if(response.data.duplicated)
                {
                    swal({
                        title : "Contact already exists.",
                    });

                }else{
                    console.log("conftact Added")
                    
                }
                
        })
        .catch((error) => {
        
        })
  }
  updateContact(userDetailsContact){
      axios.patch('/api/entitymaster/patch/updateSingleContact', userDetailsContact)
          .then((response) => {
                  if(response.data.duplicated)
                  {
                      swal({
                          title : "Contact already exists.",
                      });

                  }else{
                      console.log("contact Updated")
                      
                  }
                  
          })
          .catch((error) => {
          
      })
  }

  updatePerson(event) {
    event.preventDefault();
    var index = this.state.documentindex;
    var docarr =[]
    var imgarr =[]
    for(var i=0; i<index; i++){
        var docvalue = 
        {
            documentName        : this.state[`documentName${i}`],
            documentNumber      : this.state[`documentNumber${i}`],
            documentValidFrom   : this.state[`documentValidFrom${i}`],
            documentValidTo     : this.state[`documentValidTo${i}`],
            documentProof       : {
                                    imgUrl      : this.state["DocProof"+i],
                                    status      : "Updated",
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
    });

    if(this.state.personID){
    if(this.state.pathname === 'employee') {
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
          departmentId: this.state.departmentVal,
          designationId: this.state.designationVal,
          employeeId:this.state.employeeID,
          vehicle:this.state.vehicle,
          fuelreimbursement_id:this.state.fuelreimbursement_id,
          Documentarray : docarr,
          workImages:this.state.workImages,
          socialMediaArray:this.state.socialMediaArray,
          address: {
            addressLine1: this.state.addressLine1,
            addressLine2: this.state.addressLine2,
            landmark: this.state.landmark,
            latitude: this.state.latLng ? this.state.latLng.lat : "",
           longitude: this.state.latLng ? this.state.latLng.lng : "",
            area: this.state.area,
            city: this.state.city,
            district: this.state.district,
            state: this.state.states,
            stateCode: this.state.stateCode,
            country: this.state.country,
            countryCode: this.state.countryCode,
            pincode: this.state.pincode,
            addressProof: this.state.addressProof,
          },
          workImages : this.state.imagesArray, 
          updatedBy: localStorage.getItem("user_ID"),
          status: "Active",
          username: "MOBILE"
        }

      }

      if ($('#BasicInfo').valid() && this.state.pincodeExists) {
            userDetails.workLocationLatLng = this.state.workLocationLatLng;
            console.log("userDetails=>>>>>>",userDetails)
            this.update(userDetails);
      } else {
        $('select.error:first').focus();
        $('input.error:first').focus();
        window.scrollTo(0, 0);
      }
    }
  }
  update(userDetails) {
    if ($('#BasicInfo').valid() && this.state.pincodeExists ) {
    axios.patch('/api/personmaster/patch', userDetails)
      .then((response) => {
        this.updateUserData();
        if(this.state.changeAppAuth == true)
        {
            var sendData = {
              "event": "Approving Authority Change", //Event Name
              "toUser_id": userDetails.userId, //To user_id(ref:users)
              "toUserRole":"employee",
              "company_id": this.state.corporate_Id, //company_id(ref:entitymaster)
              "otherAdminRole":'corporateadmin',
              "variables": {
                'EmployeeName': this.state.firstName + ' ' + this.state.lastName,
                'manager1ID': this.state.manager1ID,   
                'manager2ID': this.state.approvingAuthorityId1,
                'mobileNo': this.state.contactNumber,
                'email': this.state.email
              }
            }
          console.log('sendDataToUser==>', sendData)
          axios.post('/api/masternotifications/post/sendNotification', sendData)
          .then((res) => {
          console.log('sendDataToUser in result==>>>', res.data)
          })
          .catch((error) => { console.log('notification error: ',error)})
        }
       
        axios.get('/api/entitymaster/get/one/' + this.state.corporate_Id)
        .then((response) => {
            contactarray  =  response.data[0].contactData;
            var contactID = contactarray.filter(contact=>contact.personID == userDetails.personID)
            var userDetailsContact = {
                'entityID'                      : this.state.corporate_Id,
                'contactID'                    : contactID[0]._id,
                'contactDetails'                : {
                'branchCode'                : this.state.branchCode, 
                'branchName'                : this.state.workLocation,
                'firstName'                 : this.state.firstName,
                'middleName'                : this.state.middleName,
                'lastName'                  : this.state.lastName,
                'phone'                     : this.state.contactNumber,
                'DOB'                       : this.state.DOB,
                'altPhone'                  : this.state.alternateNumber,
                'gender'                    : this.state.gender ? this.state.gender : "Male",
                'whatsappNumber'            : this.state.whatsappNumber ? this.state.whatsappNumber : "",
                'email'                     : this.state.email,
                'department'                : this.state.departmentVal,
                'departmentName'            : this.state.departmentName, 
                'designationName'           : this.state.designationName,
                'designation'               : this.state.designationVal,
                'employeeID'                : this.state.employeeID,
                 vehicle                     :this.state.vehicle,
                 fuelreimbursement_id                     :this.state.fuelreimbursement_id,
                'userID'                    : this.state.userId,
                'personID'                  : userDetails.personID,
                'createUser'                : this.state.loginCredential == "Yes" ? true : false,
                'role'                      : this.state.pathname,
                'addEmployee'               : this.state.addEmployee,
                'address': this.state.country !== "-- Select --" ? [{
                    addressLine1: this.state.addressLine1,
                    addressLine2: this.state.addressLine2,
                    landmark: this.state.landmark,
                    area: this.state.area,
                    city: this.state.city,
                    district: this.state.district,
                    state: this.state.states,
                    stateCode: this.state.stateCode,
                    country: this.state.country,
                    countryCode: this.state.countryCode,
                    pincode: this.state.pincode,
                    addressProof: this.state.addressProof,
                    latitude: this.state.latLng ? this.state.latLng.lat : "",
                    longitude: this.state.latLng ? this.state.latLng.lng : "",
                  }]:[],
                }
            }
           // this.updateContact(userDetailsContact);
        })
        .catch((error) => {                
        })
        
        if(window.location.pathname == '/my-profile/'+this.state.personID){
            this.setState({
                personID: "",
            })
            this.props.history.push("/my-profile")
            // {console.log("window.location.pathname == '/my-profile/'+this.state.personID===>",window.location.pathname == '/my-profile/'+this.state.personID)}
          // }else if(this.state.pathname+'/users/'+this.state.personID){
          }else if(window.location.pathname === "/"+this.state.pathname+'/users/'+this.state.personID){
            this.props.history.push("/umlistofusers");
          }else{
            this.setState({
                personID: "",
            })
           this.props.history.push("/" + this.state.pathname + "/lists")
          }
        swal(this.Capitalize(this.state.pathname) + " Details Updated Successfully");
      })
      .catch((error) => {
      })
    }
  }

  updateUserData(){
    console.log("userDetails========+>");
      var userDetails = {
          firstname       : this.state.firstName,
          lastname        : this.state.lastName ,
          mobNumber       : this.state.contactNumber ,
          department      : this.state.department  ? this.state.department : "" ,
          designation     : this.state.designation ? this.state.designation : "",
          cityName        : this.state.city,
          email           : this.state.email,
          states          : this.state.states,
          companyName     : this.state.corporate,
          companyID       : this.state.companyID,
          status          : this.state.status,
          image           : this.state.profilePhoto,
      }
      
      axios.patch('/api/users/patch/'+this.state.userId, userDetails)
      .then((response)=>{
          if(response.data.message  === 'USER_CREATED'){
          }else{
          console.log("User not updated in UM")
          }
      })
      .catch((error)=>{
          console.log("userDetailserror",userDetails)
      })
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
                var ext = fileName.split('.').pop();
                if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "pdf" || ext === "JPG" || ext === "PNG" || ext === "JPEG" || ext === "PDF") {
                    var objTitle = { fileInfo: file }
                    uploadedfiles.push(objTitle);
                } else {
                    swal("Allowed file formats are jpg, png, jpeg, pdf");
                }//file types
            }//file
            else {
                swal("Files not uploaded");
            }//file
        }//for 
            
        if (event.currentTarget.files) {
            this.setState({
                ["gotImage"+name]: true
            })
            main().then(formValues => {
                var docBrowsearr = [];
                // var docBrowsearr = this.state[name];
                for (var k = 0; k < formValues.length; k++) {
                    docBrowsearr.push(formValues[k].imgUrl)
                }
                this.setState({
                    [name]: docBrowsearr
                }, () => {
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
  deleteDoc(event) {
    event.preventDefault();
    // var name = event.target.name;
    var name = event.target.getAttribute("name");
    console.log("name",name);
    var deleteDoc = this.state[name];
    const index = event.target.getAttribute("index");
    console.log("deleteDoc1",this.state[name])
    console.log("deleteDoc2",this.state.DocProof1)
    console.log("index",index)
    deleteDoc.splice(index, 1);
    this.setState({
      [name]: deleteDoc,
      ["gotImage"+name]: false
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
    console.log("event",event);

      this.setState({
        contactNumber: event
      }, () => {
        if (this.state.contactNumber) {
          this.setState({
            contactNumberAvailable: this.state.contactNumber == "+" || this.state.contactNumber.length < 12 ? false : true
          }, () => {
          })
        }
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
    {/*if(event.target.name == "country")
    {
        this.setState({
            states: "--  Select --",
        })
    }*/}
    this.getStates(event.target.value.split('|')[0])
  }
  handleChangeDesignation(event) {
    const target = event.target;
    var designation = document.getElementById("desig");
    var designationName = designation.options[designation.selectedIndex].getAttribute("desig-name");
    this.setState({
      [event.target.name]: event.target.value,
      designationName: designationName
    }, () => {
    });
  }
  handleChangeDepartment(event) {
    const target = event.target;
    var department = document.getElementById("dept");
    var departmentName = department.options[department.selectedIndex].getAttribute("dept-name");
    this.setState({
      [event.target.name]: event.target.value,
      departmentName:departmentName
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

        //$('#Citydata').val(this.state.city);
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
              console.log("tableData in person",response.data.goodrecords);
              return {
                "firstName": a.firstName ? a.firstName : '-',
                "middleName": a.middleName ? a.middleName : '-',
                "lastName": a.lastName ? a.lastName : '-',
                "companyName": a.companyName ? a.companyName : '-',
                // "gender": a.gender ? a.gender : '-',
                "contactNo": a.contactNo ? a.contactNo : '-',
                // "altContactNo": a.altContactNo ? a.altContactNo : '-',
                "email": a.email ? a.email : '-',
                "whatsappNo": a.whatsappNo ? a.whatsappNo : '-',
                "employeeId": a.employeeId ? a.employeeId : "-",
                "bookingApprovalRequired": a.bookingApprovalRequired ? a.bookingApprovalRequired : "-",
                "approvingAuthorityId": a.approvingAuthorityId ? a.approvingAuthorityId : "-"
              }
            })

            var failedRecordsTable = response.data.failedRecords.map((a, i) => {
              console.log("response.data.failedRecords---",response.data.failedRecords);
              return {
                "firstName": a.firstName ? a.firstName : '-',
                "middleName": a.middleName ? a.middleName : '-',
                "lastName": a.lastName ? a.lastName : '-',
                "companyName": a.companyName ? a.companyName : '-',
                // "gender": a.gender ? a.gender : '-',
                "contactNo": a.contactNo ? a.contactNo : '-',
                // "altContactNo": a.altContactNo ? a.altContactNo : '-',
                "email": a.email ? a.email : '-',
                "whatsappNo": a.whatsappNo ? a.whatsappNo : '-',
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
          var fileName = file.name;
          var ext = fileName.split('.').pop();
          if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "pdf" || ext === "JPG" || ext === "PNG" || ext === "JPEG" || ext === "PDF") {
            if (file) {
              var objTitle = { fileInfo: file }
              docBrowse.push(objTitle);

            } else {
              swal("Photo not uploaded");
            }//file
          } else {
            swal("Allowed images formats are (jpg,png,jpeg, pdf)");
          }//file types
        }//file
      }//for 

      if (event.currentTarget.files) {
         this.setState({
                    ["gotImage"+name]: true

                })
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
      [name]: "",
      ["gotImage"+name]: false


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
          this.setState({ pincodeExists: true })

        })
    } else {
      this.setState({ pincodeExists: true })
    }
  }
  handleworklocationChange(event) {
    event.preventDefault();
    const target = event.target;
    const name = target.name;

    var e = document.getElementById("corporate");
    if (e != null) {
      var comp_Id = e.options[e.selectedIndex].getAttribute("comp_Id");
      var compID = e.options[e.selectedIndex].getAttribute("compID");
      this.setState({
      [name]: event.target.value,
      corporateID: compID,
      companyID: compID,
      corporate_Id: comp_Id

    })
    }
    // console.log("companyID..",compID);
    var vendorLocation = document.getElementById("workLocation");
    var locationID = vendorLocation.options[vendorLocation.selectedIndex].getAttribute("locationID");
    var branchCode = vendorLocation.options[vendorLocation.selectedIndex].getAttribute("branch-code");
    var coords = vendorLocation.options[vendorLocation.selectedIndex].getAttribute("coords");
    var value = event.target.value;
    this.setState({
      [name]: event.target.value,
      workLocationId: locationID,
      branchCode: branchCode,
      workLocationLatLng: coords
     }, () => {
       console.log("workLocationLatLng",this.state.workLocationLatLng);
      if(name == "corporate")
      {
        this.setState({
            workLocation : "--Select Office Location--"
        })
      }
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
    console.log("vendorId",companyId)
    axios.get('/api/entitymaster/get/one/' + companyId)
      .then((response) => {
        console.log("getEntityLocation=>",response.data);
        this.setState({
          corporateLocationArray: response.data[0]
        },()=>{
        })
      })
      .catch((error) => {
            console.log("error",error);
      })
  }

    handleChangePlaces = address => {
        this.setState({ addressLine1 : address});
    };
    handleSelect = address => {
    this.setState({addressLine1 : address})
    geocodeByAddress(address)
     .then((results) =>{ 
      for (var i = 0; i < results[0].address_components.length; i++) {
          for (var b = 0; b < results[0].address_components[i].types.length; b++) {
              switch (results[0].address_components[i].types[b]) {
                  case 'sublocality_level_1':
                      var area = results[0].address_components[i].long_name;
                      break;
                  case 'sublocality_level_2':
                      area = results[0].address_components[i].long_name;
                      break;
                  case 'locality':
                      var city = results[0].address_components[i].long_name;
                      break;
                  case 'administrative_area_level_1':
                      var state = results[0].address_components[i].long_name;
                      var stateCode = results[0].address_components[i].short_name;
                      break;
                  case 'administrative_area_level_2':
                      var district = results[0].address_components[i].long_name;
                      break;
                  case 'country':
                     var country = results[0].address_components[i].long_name;
                     var countryCode = results[0].address_components[i].short_name;
                      break; 
                  case 'postal_code':
                     var pincode = results[0].address_components[i].long_name;
                      break;
                  default :
                        break;
              }
          }
      }

      this.setState({
        area : area,
        city : city,
        district : district,
        states: state,
        country:country,
        pincode: pincode,
        stateCode:stateCode,
        countryCode:countryCode,
      })

       
        })
     
      .catch(error => console.error('Error', error));

      geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({'latLng': latLng}))
      .catch(error => console.error('Error', error));
  };
  changeAppAuth()
  {
    this.setState({
        changeAppAuth : true
    },()=>{

    })
  }


  addMarker(e){
    this.setState({
      latLng : {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        },
    },()=>{
      axios.get("/api/projectSettings/get/GOOGLE",)
        .then((response) => {
        Geocode.setApiKey(response.data.googleapikey);
        Geocode.fromLatLng(e.latLng.lat(), e.latLng.lng()).then(
          response => {
            console.log("response.results",response.results);
            const address = response.results[0].address_components;
            console.log("address",address);
              for (var i = 0; i < address.length; i++) {
                  console.log("address[i].types[b]",address[i]);
                  for (var b = 0; b < address[i].types.length; b++) {
                      switch (address[i].types[b]) {
                          case 'sublocality_level_1':
                              var area = address[i].long_name;
                              break;
                          case 'sublocality_level_2':
                              area = address[i].long_name;
                              break;
                          case 'locality':
                              var city = address[i].long_name;
                              break;
                          case 'administrative_area_level_1':
                              var state = address[i].long_name;
                              var stateCode = address[i].short_name;
                              break;
                          case 'administrative_area_level_2':
                              var district = address[i].long_name;
                              break;
                          case 'country':
                             var country = address[i].long_name;
                             var countryCode = address[i].short_name;
                              break; 
                          case 'postal_code':
                             var pincode = address[i].long_name;
                              break;
                          default :
                                break;
                      }
                  }
              }
              this.setState({
                addressLine1:response.results[0].formatted_address,
                area : area,
                city : city,
                district : district,
                states: state,
                country:country,
                pincode: pincode,
                stateCode:stateCode,
                countryCode:countryCode
              })
          },
          error => {
            console.error(error);
          }
        );
        })
      .catch((error) =>{
          swal(error)
      })
    })
  }

    departmentModalClickEvent(){
      console.log("click event")
      $('#departmentModalId').addClass('in');
      $('#departmentModalId').css('display','block');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }  

    designationModalClickEvent(){
      console.log("click event")
      $('#designationModalId').addClass('in');
      $('#designationModalId').css('display','block');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }

    vehcileModalClickEvent(){
      console.log("click event")
      $('#vehicleModalId').addClass('in');
      $('#vehicleModalId').css('display','block');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }

    imgBrowse(event) {
      event.preventDefault();
      var imagesArray = [];
      if (event.currentTarget.files && event.currentTarget.files[0]) {
        for (var i = 0; i < event.currentTarget.files.length; i++) {
          var file = event.currentTarget.files[i];
          if (file) {
            var fileName = file.name;
            var ext = fileName.split('.').pop();
            if (ext === "jpg" || ext === "png" || ext === "jpeg" || 
                ext === "JPG" || ext === "PNG" || ext === "JPEG" || 
                ext === "pdf" || ext === "PDF"
              ) {
              if (file) {
                var objTitle = { fileInfo: file }
                imagesArray.push(objTitle);
              } else {
                swal("Images not uploaded");
              }//file
            } else {
              swal("Allowed images formats are (jpg, png, pdf)");
              this.setState({
                gotTicketImage:false
              })
            }//file types
          }//file
        }//for 
  
        if (event.currentTarget.files) {
           this.setState({
              gotTicketImage:true
            })
          main().then(formValues => {
            var imagesArray = this.state.imagesArray;
            for (var k = 0; k < formValues.length; k++) {
              imagesArray.push(formValues[k].imagesArray)
            }
  
            this.setState({
              imagesArray: imagesArray,
              gotTicketImage:false
            })
          });
  
          async function main() {
            var formValues = [];
            for (var j = 0; j < imagesArray.length; j++) {
              var config = await getConfig();
              var s3url = await s3upload(imagesArray[j].fileInfo, config, this);
              const formValue = {
                "imagesArray": s3url,
                gotTicketImage:false,
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
                    dirName: 'workImages',
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

    deleteImage(event){
      event.preventDefault();
        const imagesArray = this.state.imagesArray;
        const index = event.target.getAttribute("id");
        if (index > -1) {
            imagesArray.splice(index, 1);
        }
        this.setState({
            imagesArray
        })
    } 
    deleteSocialImage(event){
      event.preventDefault();
        const socialMediaArray = this.state.socialMediaArray;
        const index = event.target.getAttribute("id");
        if (index > -1) {
          socialMediaArray.splice(index, 1);
        }
        this.setState({
          socialMediaArray
        })
    } 
    
    addSocialMedia(){
      if(this.state.socialMedia && this.state.socialMediaUrl){
        var {socialMediaArray} = this.state;
        socialMediaArray.push({
            social_id   : this.state.socialMedia.split("^")[0],
            name        : this.state.socialMedia.split("^")[1],
            icon        : this.state.socialMedia.split("^")[2],
            url         : this.state.socialMediaUrl
        })
        this.setState({
          socialMediaArray,
          socialMedia:"",
          socialMediaUrl:""
        })
      }else{
        swal("Please select option and add URL")
      }
    }

  render() {
    console.log("socialMediaArray",this.state.socialMediaArray);
    var oldDate = new Date();
    oldDate.setFullYear(oldDate.getFullYear() - 18);

    const searchOptions = {componentRestrictions: {country: "in"}}
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        {
          this.state.pathname ?
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                <section className="content">
                  <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                    { window.location.pathname == '/my-profile/'+this.state.personID ? 
                        <h4 className="weighttitle col-lg-9 col-md-6 col-xs-6 col-sm-6 NOpadding-right">{this.state.pathname ? this.Capitalize(this.state.pathname)+ " Profile": ""}</h4>
                        :
                        
                          this.state.personID ?
                          <h4 className="weighttitle col-lg-9 col-md-6 col-xs-6 col-sm-6 NOpadding-right">{"Edit  "+ (this.state.pathname ? this.Capitalize(this.state.pathname) : "") }</h4>
                          :
                          <h4 className="weighttitle col-lg-9 col-md-6 col-xs-6 col-sm-6 NOpadding-right">{"Add  "+ (this.state.pathname ? this.Capitalize(this.state.pathname) : "") }</h4>
                        
                        
                    }
                    {this.state.personID ?
                        null
                        :
                      <ul className="nav tabNav nav-pills col-lg-3 col-md-3 col-sm-12 col-xs-12">
                        <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill" href="#manual">Manual</a></li>
                        <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center"><a data-toggle="pill" href="#bulk">Bulk Upload</a></li>
                      </ul>
                      }
                    </div>
                    <form className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12" id="SelectVendor">
                      {this.state.listOfRoles.indexOf("admin") > 1 ?

                        <div className="form-margin col-lg-4 col-md-6 col-sm-12 col-xs-12 driver employee" >
                          <div>
                            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">{this.state.pathname == "driver" ? "Vendor" : "Corporate"} <sup className="astrick">*</sup></label>
                            <select id="corporate" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.corporate} ref="corporate" name="corporate" onChange={this.handleworklocationChange.bind(this)} >
                              <option selected={true} disabled={true}>{"-- Select --"}</option>
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
                        :
                        null
                      }
                      <div className="form-margin col-lg-4 col-md-6 col-sm-12 col-xs-12 marbtm30 driver employee" >
                        <div>
                          <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Office Location <sup className="astrick">*</sup></label>
                          <select id="workLocation" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.workLocation} ref="workLocation" name="workLocation" onChange={this.handleworklocationChange.bind(this)} required>
                            <option selected={true} disabled={true}>--Select Office Location--</option>
                            {
                              this.state.corporateLocationArray && this.state.corporateLocationArray.locations && this.state.corporateLocationArray.locations.length > 0 ?
                                this.state.corporateLocationArray.locations.map((data, i) => {
                                  // console.log("data",data)
                                  return (
                                    <option key={i} locationID={data._id} branch-code={data.branchCode} coords={data.latitude+","+data.longitude} value={((data.locationType).match(/\b(\w)/g)).join('') + "-" + data.city + " " + data.stateCode + "-" + data.countryCode}>{((data.locationType).match(/\b(\w)/g)).join('')} - {data.area} {data.city}, {data.stateCode} - {data.countryCode}  </option>
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
                                          <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.firstName} ref="firstName" name="firstName" onChange={this.handleChange} onKeyDown={this.isTextKey.bind(this)} required />
                                        </div>
                                      </div>
                                      <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12  driver employee guest person" >
                                        <div id="middleName">
                                          <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Middle Name {this.state.pathname !== "employee" ? <i className="astrick">*</i> : ""}</label>
                                          <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.middleName} ref="middleName" name="middleName" onChange={this.handleChange} onKeyDown={this.isTextKey.bind(this)}/>
                                        </div>
                                      </div>
                                      <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee guest person">
                                        <div id="lastName">
                                          <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Last Name <i className="astrick">*</i></label>
                                          <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.lastName} ref="lastName" name="lastName" onChange={this.handleChange} onKeyDown={this.isTextKey.bind(this)}required />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="form-margin col-lg-9 col-md-12 col-sm-12 col-xs-12 driver guest employee person NOpadding-left NOpadding-right">
                                      <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">
                                        <div id="DOB">
                                          <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">DOB <i className="astrick">*</i></label>
                                          <input type="date" id="DOB" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.DOB} max={moment(oldDate).format("YYYY-MM-DD")} ref="DOB" name="DOB" onChange={this.handleChange} required/>
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
                                          <input type="email" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" value={this.state.email} ref="email" name="email" onChange={this.handleChange} placeholder="testemail@gmail.com" required/>
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
                                                    <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={this.state.profilePhoto} data-toggle="tooltip" title="Delete Image" name="profilePhoto" onClick={this.deleteDocSingle.bind(this)}>x</label>
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
                                                 ( this.state.gotImageprofilePhoto  ?
                                                    <div className="col-lg-12 col-md-2 col-sm-12 col-xs-12 nopadding CustomImageUpload">
                                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogosPM" id="profilePhoto">
                                                                <img src="/images/loading.gif" className="img-responsive profileImageDivlogoStyle2"/>
                                                          </div>
                                                      </div>
                                                </div>
                                                :
                                                null)

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
                                            }}
                                            onChange={this.changeMobile.bind(this)}
                                          />
                                        </div>
                                        {this.state.contactNumberAvailable == true ? null : <label className="error">Please enter valid number</label>}

                                      </div>
                                      <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">
                                        <label className="labelform  NOpadding-left">Alternate Number </label>
                                        <PhoneInput
                                          country={'in'}
                                          value={this.state.alternateNumber}
                                          name="alternateNumber"
                                          inputProps={{
                                            name: 'alternateNumber',
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
                                          }}
                                          onChange={this.changeMobileWhatsapp.bind(this)}
                                        />
                                      </div>
                                    </div>
                                    <div className="form-margin col-lg-9 col-md-12 col-sm-12 col-xs-12  employee person NOpadding-left NOpadding-right">
                                      <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 driver employee person">
                                        <div id="departmentVal">
                                          <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Department <i className="astrick">*</i></label>
                                            <div className="input-group" id="selectField" > 
                                            <select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                              id="dept" ref="departmentVal" value={this.state.departmentVal} name="departmentVal" onChange={this.handleChangeDepartment} required>
                                              <option selected={true} disabled={true} >-- Select --</option>
                                              {console.log("this.state.departmentArray",this.state.departmentArray)}
                                              {
                                                this.state.departmentArray && this.state.departmentArray.length > 0 ?
                                                  this.state.departmentArray.map((deptData, index) => {
                                                    return (
                                                      <option key={index} dept-name={deptData.department} value={deptData._id}>{(deptData.department)}</option>
                                                    );
                                                  }
                                                  ) : ''
                                              }
                                            </select>
                                            <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#departmentModalId"  onClick={this.departmentModalClickEvent.bind(this)} title="Add Department" ><i className="fa fa-plus "></i>
                                           </div>
                                           </div>
                                        </div>
                                      </div>
                                      <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee person">
                                        <div id="designationVal">
                                          <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Designation <i className="astrick">*</i></label>
                                          <div className="input-group" id="selectField" > 
                                            <select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" id="desig" ref="designationVal" value={this.state.designationVal} name="designationVal" onChange={this.handleChangeDesignation} required>
                                              <option selected={true} disabled={true} >-- Select --</option>
                                              {
                                                this.state.designationArray && this.state.designationArray.length > 0 ?
                                                  this.state.designationArray.map((desData, index) => {
                                                    return (
                                                      <option key={index} desig-name={desData.designation} value={desData._id}>{(desData.designation)}</option>
                                                    );
                                                  }) : ''
                                              }
                                            </select>
                                            <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#designationModalId"  onClick={this.designationModalClickEvent.bind(this)} title="Add Designation" ><i className="fa fa-plus "></i>
                                            </div>
                                           </div> 
                                        </div>
                                      </div>
                                      <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee person">
                                        <div id="employeeID">
                                          <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Employee ID </label>
                                          <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.employeeID} ref="employeeID" name="employeeID" onChange={this.handleChange}/>
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
                                      {this.state.loginCredential === "Yes" ?
                                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" > 
                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Role <i className="astrick">*</i></label>
                                        <select className="errorinputText form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                          ref="role" name="role" id="role" value={this.state.role} onChange={this.handleChange}>
                                          <option value="" disabled={true} selected>-- Select Role --</option>
                                          {this.state.rolesArray && this.state.rolesArray.length > 0 ?
                                                this.state.rolesArray.map((rolesArray, index) => {
                                                return (
                                                  <option key={index} value={rolesArray.role}>{rolesArray.role}</option>
                                                );
                                                }) : ''
                                              }
                                            </select>
                                          </div>
                                        :
                                        null
                                     }
                                     <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" > 
                                      <div id="vehicleVal">
                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Vehicle <i className="astrick">*</i></label>
                                        <div className="input-group" id="selectField" > 
                                          <select className="errorinputText form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                            ref="vehicle" name="vehicle" id="vehicle" value={this.state.vehicle} onChange={this.handleChange}>
                                             <option value="" disabled={true}>-- Select Vehicle --</option>
                                             {console.log("this.state.vehicleArray><>>>>>>>>>>>>>",this.state.vehicleArray)}
                                              {this.state.vehicleArray && this.state.vehicleArray.length > 0 ?
                                                this.state.vehicleArray.map((item, index) => {
                                                return (
                                                  <option key={index} id={item._id} value={item.vehicleType}>{item.vehicleType}</option>
                                                );
                                              }) : ''
                                            }
                                          </select>
                                           <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#vehicleModalId"  onClick={this.vehcileModalClickEvent.bind(this)} title="Add Designation" ><i className="fa fa-plus "></i>
                                          </div>
                                         </div> 
                                        </div> 
                                      </div>   
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 driver employee  person borderBottom">
                                    </div>
                                    <label className="subHead col-lg-12 col-md-12 col-sm-12 col-xs-12 driver person employee">Home Address Details</label>
                                    <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                                      <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 driver person employee">
                                        <div id="addressLine1">
                                          <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Address Line 1 {this.state.pathname !== "employee" ? <i className="astrick">*</i> : ""}</label>
                                          {/*<input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.addressLine1} ref="addressLine1" name="addressLine1" onChange={this.handleChange} />*/}
                                          <PlacesAutocomplete
                                                value={this.state.addressLine1}
                                                onChange={this.handleChangePlaces}
                                                onSelect={this.handleSelect}
                                                // searchOptions={searchOptions}
                                              >
                                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                  <div>
                                                    <input
                                                      {...getInputProps({
                                                        placeholder: 'Search Address ...',
                                                        className: 'location-search-input col-lg-12 form-control errorinputText',
                                                        id:"addressLine1",
                                                        name:"addressLine1"
                                                      })}
                                                      required
                                                    />
                                                    <div className={this.state.addressLine1 ? "autocomplete-dropdown-container SearchListContainer" : ""}>
                                                      {loading && <div>Loading...</div>}
                                                      {suggestions.map(suggestion => {
                                                        const className = suggestion.active
                                                          ? 'suggestion-item--active'
                                                          : 'suggestion-item';
                                                        // inline style for demonstration purpose
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
                                                            <span>{suggestion.description}</span>
                                                          </div>
                                                        );
                                                      })}
                                                    </div>
                                                  </div>
                                                )}
                                              </PlacesAutocomplete>
                                        </div>
                                      </div>
                                     
                                    </div>

                                    <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12  driver employee person NOpadding-left NOpadding-right">
                                      <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
                                        <div id="addressLine2">
                                          <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Flat No/Block No</label>
                                          <input type="text" id="addressLine2" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.addressLine2} ref="addressLine2" name="addressLine2" onChange={this.handleChange} />
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
                                        <div id="landmark">
                                          <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Landmark </label>
                                          <input type="text" id="landmark" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.landmark} ref="landmark" name="landmark" onChange={this.handleChange} />
                                        </div>
                                      </div>
                                      <div className="col-lg-4   col-md-4 col-sm-12 col-xs-12 driver employee person">
                                        <div id="pincode">
                                          <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Pincode {this.state.pathname !== "employee" ? <i className="astrick">*</i> : ""}</label>
                                          <input maxLength="6" onChange={this.handlePincode.bind(this)} type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.pincode} ref="pincode" name="pincode" onKeyDown={this.keyPressNumber.bind(this)} required/>
                                          {this.state.pincodeExists ? null : <label style={{ color: "red", fontWeight: "100" }}>This pincode does not exists!</label>}

                                        </div>
                                      </div>
                                    </div>
                                    <div className = "col-lg-12 marginTop17">
                                      <MapContainer address={this.state.addressLine1} latLng={this.state.latLng} addMarker={this.addMarker.bind(this)} />
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding mt20">
                                      <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12" > 
                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Social Media <i className="astrick">*</i></label>
                                        <select className="errorinputText form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                          ref="socialMedia" name="socialMedia" id="socialMedia" value={this.state.socialMedia} onChange={this.handleChange}>
                                          <option value="" disabled={true} selected>-- Select Social Media --</option>
                                          {this.state.socialMediaOptions && this.state.socialMediaOptions.length > 0 ?
                                                this.state.socialMediaOptions.map((socialMediaOptions, index) => {
                                                return (
                                                  <option key={index} value={socialMediaOptions._id+"^"+socialMediaOptions.socialMedia+"^"+socialMediaOptions.iconUrl}>{socialMediaOptions.socialMedia}</option>
                                                );
                                                }) : ''
                                              }
                                            </select>
                                          </div>
                                          <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                            <div id="socialMediaUrl">
                                              <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">URL <i className="astrick">*</i></label>
                                              <input type="text" id="socialMediaUrl" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.socialMediaUrl} ref="socialMediaUrl" name="socialMediaUrl" onChange={this.handleChange} />
                                            </div>
                                        </div>     
                                        <div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 mt20">
                                        <div className="btn btn-primary pull-right" onClick={this.addSocialMedia.bind(this)} >Add&nbsp;</div>
                                        </div>          
                                    </div> 
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding mt20">
                                      {
                                        this.state.socialMediaArray && this.state.socialMediaArray.length >0 ?
                                          this.state.socialMediaArray.map((item,index)=>{
                                            return(
                                              <div className="col-lg-1" style={{"marginLeft":"15px"}}>
                                                    <label className="labelform deleteImage col-lg-12 col-md-12 col-sm-12 col-xs-12"  style={{"background":"#fff"}} id={index} onClick={this.deleteSocialImage.bind(this)}><i className="fa fa-trash text-danger" /></label>
                                                    <a href={item.url} target="_blank" title={item.url}><img src={item.icon} className="img-responsive"/></a>
                                              </div>      
                                            )
                                          })
                                        :
                                        []
                                      }
                                    </div>  
                                    <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 NOpadding mt20">
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Attach Work Images</label>
                                      </div>
                                      <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 nopadding">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginsBottom" id="hide">
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imageView" id="LogoImageUpOne">
                                            {this.state.gotTicketImage ?
                                              <img src="/images/loading.gif" className="img-responsive logoStyle"/>
                                              :
                                              <div><i className="fa fa-upload"></i> <br /></div>
                                            }  
                                            <input multiple onChange={this.imgBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="companyLogo" />
                                          </div>
                                        </div>
                                      </div>
                                      {
                                        this.state.imagesArray && this.state.imagesArray.length > 0 ?
                                          this.state.imagesArray.map((image, i) => {
                                            return (
                                              <div  key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12 nopadding">
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  marginsBottom" id="hide">
                                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imageView" id="LogoImageUpOne">
                                                    <label className="labelform deleteImage  col-lg-12 col-md-12 col-sm-12 col-xs-12" id={i} onClick={this.deleteImage.bind(this)}>x</label>
                                                    <embed src={image+"#toolbar=0"} className="img-responsive logoStyle" />
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })
                                          :
                                          null
                                      }
                                    </div>
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
                                                    <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" ref={"documentNumber" + i} name={"documentNumber" + i} id={"documentNumber" + i} value={this.state[`documentNumber${i}`]} index={i} token={doc.documentName} placeholder={"Enter " + doc.documentName + " Number"} onChange={this.handleChange} required />
                                                    {/* {this.state[`documentNumber${i}`] ? <label style={{ color: "red", fontWeight: "100" }}>This field is required!</label> : null } */}
                                                  </div>
                                                </div>

                                                <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver  person">
                                                  <div id="documentValidFrom">
                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Valid From Date
                                                                                                        </label>
                                                    <input type="date" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" name={"documentValidFrom" + i} id={"documentValidFrom" + i} value={moment(this.state[`documentValidFrom${i}`]).format("YYYY-MM-DD")} index={i} token={doc.documentName} max={moment(new Date).format("YYYY-MM-DD")} ref={"documentValidFrom" + i} onChange={this.handleChange} />
                                                  </div>
                                                </div>
                                                <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver  person">
                                                  <div id="effectiveUpto">
                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Valid To Date
                                                                                                        </label>
                                                    <input type="date" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" index={i} token={doc.documentName} name={"documentValidTo" + i} id={"documentValidTo" + i} value={moment(this.state[`documentValidTo${i}`]).format("YYYY-MM-DD")} ref={"documentValidTo" + i} min={moment(new Date).format("YYYY-MM-DD")} onChange={this.handleChange} />
                                                  </div>
                                                </div>

                                              </div>
                                              <div className="form-margin col-lg-8 col-md-12 col-sm-12 col-xs-12  driver person NOpadding-left NOpadding-right">
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  driver person ">
                                                  <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">{doc.documentName} Proof (jpg, jpeg, png, pdf)  <i className="astrick">*</i></label>
                                                  <div className="col-lg-1 col-md-2 col-sm-12 col-xs-12 driver person nopadding">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                                        <div className="cursorPointer"><i className="fa fa-upload"></i><br /></div>
                                                        <input multiple onChange={this.docBrowse.bind(this)} name={"DocProof" + i} id={"ImgProof" + i} value={this.state[`ImgProof${i}`]} type="file" token={doc.documentName} className="form-control fileManage col-lg-12 col-md-12 col-sm-12 col-xs-12" />
                                                        {/* {this.state["DocProof"+i] !== "" ?
                                                                                                                <input multiple onChange={this.docBrowse.bind(this)} name={"DocProof"+i} id={"ImgProof"+i} value={this.state[`ImgProof${i}`]}  type="file" token={doc.documentName} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"  />
                                                                                                                :
                                                                                                                <img src="⁨../../../public⁩/images⁩/loading.gif" alt="Logo_img" height="21%" width="21%" className="imgHt"/>
                                                                                                            } */}
                                                      </div>
                                                    </div>
                                                  </div>

                                                  {
                                                    this.state["DocProof" + i] && this.state["DocProof" + i].length > 0 ?
                                                      this.state["DocProof" + i].map((data, index) => {
                                                        return (
                                                          <div key={index} className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                                            <div  id="hide">
                                                              <label className="labelform deletelogoPersonMaster col-lg-12 col-md-12 col-sm-12 col-xs-12" id={data} index={index} data-toggle="tooltip" title="Delete Image" name={"DocProof"+i} onClick={this.deleteDoc.bind(this)}>x</label>
                                                              {
                                                                (data ? data.split('.').pop() : "") === "pdf" || (data ? data.split('.').pop() : "") === "PDF" ?
                                                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdfContainerPM" id="LogoImageUpOne">
                                                                    <img src="/images/pdfImg.png" />
                                                                    <span>{(data ? data.split('.').pop() : "")}</span>
                                                                  </div>
                                                                  :
                                                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogosPersonmaster" id="licenseProof">
                                                                    <img src={data} className="img-responsive logoStyle2" />
                                                                  </div>
                                                              }
                                                            </div>
                                                          </div>
                                                        );
                                                      })
                                                      :
                                                      (this.state["gotImageDocProof"+i] ?

                                                        <div className="col-lg-12 col-md-2 col-sm-12 col-xs-12 nopadding CustomImageUploadOF margin-top">

                                                          <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                            <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 brdlogosPersonmaster" id="licenseProof">
                                                              <img src="/images/loading.gif" className="img-responsive logoStyle2 " />
                                                            </div>
                                                          </div>
                                                        </div>
                                                        :
                                                        null)
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
                                      <button className="btn button3 pull-right" onClick={this.submitPerson.bind(this)} >Submit&nbsp;</button>
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
                                fileurl="https://energypoweruat.s3.ap-south-1.amazonaws.com/EmployeeBulkUploadEnergyPower.xlsx"
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
                          editId  =   {this.props.match.params.fieldID} 
                          editUrl =   {
                                  this.props.match.params.fieldID ?
                                   '/employee/master-modal/'+this.props.match.params.personID
                                  :
                                  '/employee/master-modal'
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
                          editId  =   {this.props.match.params.fieldID} 
                          editUrl =   {
                                  this.props.match.params.personID ?
                                  '/employee/master-modal/'+this.props.match.params.personID
                                  :
                                  '/employee/master-modal'
                                } 
                        />
                    </div>  
                 </div>
                </div>
              </div>
              <div className="modal" id="vehicleModalId" role="dialog">
                <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                    <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                          <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getVehicles.bind(this)}>&times;</button>
                     </div>
                    </div>
                    <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <ReimbursementMaster  
                          editId  =   {this.props.match.params.fieldID} 
                          editUrl =   {
                                  this.props.match.params.personID ?
                                  '/employee/master-modal/'+this.props.match.params.personID
                                  :
                                  '/employee/master-modal'
                                } 
                          history={this.props.history}      
                        />
                    </div>  
                 </div>
                </div>
              </div>
      </div>
    );
  }
}
export default withRouter(PersonMaster);