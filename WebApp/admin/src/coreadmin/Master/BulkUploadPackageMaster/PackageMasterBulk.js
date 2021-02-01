
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
// import "./PersonMaster.css";
import ImageLoader from 'react-load-image';


class PackageMasterBulk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "pathname": this.props.entity ? this.props.entity : "",
      "personID": this.props.match.params ? this.props.match.params.fieldID : '',
      "listOfRoles": [],
      "companyLogo": [],
      "districtArray": [],
      "designationArray": [],
      "departmentArray": [],
      "corporateLocationArray": "",
      'toggleButtonValue': "Male",
      'getSelectedTrip': "Yes",
      'loginCredential': "Yes",
      'workLocationId': "",
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
      "COI": [],
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

  }

  Preloader(props) {
    return <img src="spinner.gif" />;
  }

  componentDidMount() {
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

   
    this.setState({
      personID: this.props.match.params.fieldID,
    }, () => {
      this.edit();
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
        $.validator.addMethod("regxvendor", function (value, element, arg) {
            return arg !== value;
        }, "Please select the corporate");
        $.validator.addMethod("regxcontry", function (value, element, arg) {
            return arg !== value;
        }, "Please select the country");

        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });
        $("#BasicInfo").validate({
            rules: {

                corporate: {
                    required: true,
                    regxvendor: "-- Select --"
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
                    regxcontry: "-- Select --"
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
            }
        });
    }
    if (this.state.pathname === "employee") {
        $(".person").hide();
        $(".employee").show();
        $.validator.addMethod("regxEmail", function (value, element, regexpr) {
            return regexpr.test(value);
        }, "Please enter valid Email Id");
         $.validator.addMethod("regxvendor", function (value, element, arg) {
            return arg !== value;
        }, "Please select the corporate");
        $.validator.addMethod("regxcontry", function (value, element, arg) {
            return arg !== value;
        }, "Please select the country");


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
                    regxcontry: "--Select --"
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
                preApprovedAmount: {
                    required: true,
                },
                preApprovedKilometer: {
                    required: true,
                },
                 preApprovedRides: {
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
                if (element.attr("name") === "preApprovedKilometer") {
                    error.insertAfter("#preApprovedKilometer");
                }
                if (element.attr("name") === "preApprovedAmount") {
                    error.insertAfter("#preApprovedAmount");
                }
                if (element.attr("name") === "preApprovedRides") {
                    error.insertAfter("#preApprovedRides");
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
        }, "Please select the office location");
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
                    regxdistrict: "--Select Office Location--"
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
    axios.get('/api/documentlistmaster/get/list/'+entityname)
        .then((response) => {
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
            preApprovedKilometer: this.state.preApprovedKilometer,
            preApprovedAmount: this.state.preApprovedAmount,
            preApprovedRides: this.state.preApprovedRides,
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
              state: this.state.states ? this.state.states.split('|')[1] : this.state.states,
              stateCode: this.state.states ? this.state.states.split('|')[0] : this.state.states,
              country: this.state.country ? this.state.country.split('|')[1] : this.state.country,
              countryCode: this.state.country ? this.state.country.split('|')[0] : this.state.country,
              pincode: this.state.pincode,
              latitude: "",
              longitude: "",
              addressProof: this.state.addressProof,
            },
        }

    } else if (this.state.pathname === 'driver') {

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
        loginCredential: "Yes",
        Documentarray: docarr,
        badgeNumber: this.state.badgeNumber,
        address: {
          addressLine1: this.state.addressLine1,
          addressLine2: this.state.addressLine2,
          landmark: this.state.landmark ? this.state.landmark : "",
          area: this.state.area,
          city: this.state.city,
          district: this.state.district,
          state: this.state.states ? this.state.states.split('|')[1] : this.state.states,
          stateCode: this.state.states ? this.state.states.split('|')[0] : this.state.states,
          country: this.state.country ? this.state.country.split('|')[1] : this.state.country,
          countryCode: this.state.country ? this.state.country.split('|')[0] : this.state.country,

          pincode: this.state.pincode,
          addressProof: this.state.addressProof,
        },
        // drivingLicense: {
        //   licenseNo: this.state.licenseNumber,
        //   effectiveTo: this.state.effectiveUpto,
        //   licenseProof: this.state.licenseProof
        // },
        // aadhar: {
        //   aadharNo: this.state.aadharNumber,
        //   aadharProof: this.state.aadharProof
        // },
        // verification: {
        //   verificationNumber: this.state.verificationNumber,
        //   verificationProof: this.state.verificationProof
        // },
        workLocation: this.state.workLocation,
        workLocationId: this.state.workLocationId,
        status: "Active",
        username: "MOBILE"
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
        profilePhoto: this.state.profilePhoto,
        status: "Active",
      }
    }
    console.log("userDetails", userDetails)
    const main = async () => {
      if ($('#BasicInfo').valid() && this.state.pincodeExists && this.state.contactNumberAvailable && this.state.listOfEmpEmail.indexOf(this.state.email) === -1) {
        if (userDetails.loginCredential === "Yes") {
          userDetails.userId = await this.createLogin();
          this.setState({
            getUserId : userDetails.userId
          })
          var sendData = {
              "event": "Contact Created", //Event Name
              "company_id": this.state.corporate_Id, //company_id(ref:entitymaster)
              "toUser_id": userDetails.userId,
              "toUserRole":"employee",
              "otherAdminRole":"corporateadmin",
              "variables": {
                'EmployeeName': this.state.firstName + ' ' + this.state.lastName,
                'Password': "Welcome@123",
                'mobileNo': this.state.contactNumber,
                'email': this.state.email
              }
            }
            console.log("sendData",sendData)
            axios.post('/api/masternotifications/post/sendNotification', sendData)
              .then((res) => {
                console.log('sendDataToUser in result==>>>', res.data)
              })
              .catch((error) => { console.log('notification error: ', error) })

        }
        console.log("-->",userDetails)
        this.savePerson(userDetails);
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
      firstname: this.state.firstName,
      lastname: this.state.lastName,
      mobNumber: this.state.contactNumber,
      email: this.state.email,
      companyID: this.state.companyID,
      companyName: this.state.corporate,
      pwd: "Welcome@123",
      role: this.state.pathname,
      status: 'active',
      "emailSubject": "Email Verification",
      "emailContent": "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
    }
    console.log("userDetails", userDetails);
    return new Promise(function (resolve, reject) {
      axios.post('/api/auth/post/signup/user', userDetails)
        .then((response) => {
          console.log("response.data.ID===>>>>", response.data.ID)
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
        console.log("-->",response)
        if(response.data.duplicated)
        {
            swal(this.Capitalize(this.state.pathname) + " Already Exists");

        }else{
        var userDetailsContact = {
            'entityID'                      : this.state.corporate_Id,
            'contactDetails'                : {
            'branchCode'                : this.state.branchCode, 
            'branchName'                : this.state.workLocation,
            'firstName'                 : this.state.firstName,
            'lastName'                  : this.state.lastName,
            'phone'                     : this.state.contactNumber,
            'altPhone'                  : this.state.alternateNumber,
            'email'                     : this.state.email,
            'department'                : this.state.department,
            'departmentName'            : this.state.departmentName, 
            'designationName'           : this.state.designationName,
            'designation'               : this.state.designation,
            'employeeID'                : this.state.employeeID,
            'userID'                    : this.state.getUserId,
            'personID'                  : response.data.PersonId,
            'bookingApprovalRequired'   : this.state.getSelectedTrip,
            'approvingAuthorityId1'     : this.state.getSelectedTrip ? this.state.approvingAuthorityId1 : "",
            'approvingAuthorityId2'     : this.state.getSelectedTrip ? this.state.approvingAuthorityId2 : "",
            'approvingAuthorityId3'     : this.state.getSelectedTrip ? this.state.approvingAuthorityId3 : "",
            'preApprovedAmount'         : this.state.getSelectedTrip ? this.state.preApprovedAmount : "",
            'preApprovedRides'          : this.state.getSelectedTrip ? this.state.preApprovedRides : "",
            'preApprovedKilometers'     : this.state.getSelectedTrip ? this.state.preApprovedKilometers : "",
            'createUser'                : true,
            'role'                      : this.state.pathname,
            'addEmployee'               : this.state.addEmployee,
            }
        }
        console.log("userDetails",userDetailsContact);
    
        this.saveContact(userDetailsContact);
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
        swal(this.Capitalize(this.state.pathname) + " Added Successfully");
          this.props.history.push("/" + this.state.pathname + "/lists")
          this.getElementByIds();
        })


        }

      })
      .catch((error) => {

      })
  }
  saveContact(userDetails){

    console.log("userDetails->",userDetails)
    axios.patch('/api/entitymaster/patch/addContact' ,userDetails)
        .then((response) => {
                console.log("response",response)
                if(response.data.duplicated)
                {
                    swal({
                        title : "Contact already exists.",
                    });

                }else{
                    console.log("contact Added")
                    
                }
                
        })
        .catch((error) => {
        
        })
  }
    updateContact(userDetailsContact){
        console.log("userDetailsContact->",userDetailsContact)
        axios.patch('/api/entitymaster/patch/updateSingleContact', userDetailsContact)
            .then((response) => {
                    console.log("response",response)
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
    } 
    this.setState({
        Documentarray : docarr,
    }, () => {
    });

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
          contactNo: this.state.contactNumber ? this.state.contactNumber : "",
          altContactNo: this.state.alternateNumber ? this.state.alternateNumber : "",
          whatsappNo: this.state.whatsappNumber ? this.state.whatsappNumber : "",
          email: this.state.email,
          departmentId: this.state.department,
          designationId: this.state.designation,
          preApprovedKilometer: this.state.preApprovedKilometer,
          preApprovedAmount: this.state.preApprovedAmount,
          preApprovedRides: this.state.preApprovedRides,
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
          Documentarray : docarr,
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
        console.log("userDetails update", userDetails);
      } else if (this.state.pathname === 'driver') {
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
          Documentarray : docarr,
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
          drivingLicense: {
            licenseNo: this.state.licenseNumber,
            effectiveTo: this.state.effectiveUpto,
            licenseProof: this.state.licenseProof
          },
          aadhar: {
            aadharNo: this.state.aadharNumber,
            aadharProof: this.state.aadharProof
          },
          verification: {
            verificationNumber: this.state.verificationNumber,
            verificationProof: this.state.verificationProof
          },

          updatedBy: localStorage.getItem("user_ID"),
          status: "Active",
          username: "MOBILE"
        }

      } else {
        console.log("email:==>", this.state.email);
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
        console.log("userDetails==>", userDetails);
      }

      if ($('#BasicInfo').valid() && this.state.pincodeExists) {

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
        var userDetailsContact = {
            'entityID'                      : this.state.corporate_Id,
            'contactDetails'                : {
            'branchCode'                : this.state.branchCode, 
            'branchName'                : this.state.workLocation,
            'firstName'                 : this.state.firstName,
            'lastName'                  : this.state.lastName,
            'phone'                     : this.state.contactNumber,
            'altPhone'                  : this.state.alternateNumber,
            'email'                     : this.state.email,
            'department'                : this.state.department,
            'departmentName'            : this.state.departmentName, 
            'designationName'           : this.state.designationName,
            'designation'               : this.state.designation,
            'employeeID'                : this.state.employeeID,
            'userID'                    : this.state.getUserId,
            'personID'                  : response.data.PersonId,
            'bookingApprovalRequired'   : this.state.getSelectedTrip,
            'approvingAuthorityId1'     : this.state.getSelectedTrip ? this.state.approvingAuthorityId1 : "",
            'approvingAuthorityId2'     : this.state.getSelectedTrip ? this.state.approvingAuthorityId2 : "",
            'approvingAuthorityId3'     : this.state.getSelectedTrip ? this.state.approvingAuthorityId3 : "",
            'preApprovedAmount'         : this.state.getSelectedTrip ? this.state.preApprovedAmount : "",
            'preApprovedRides'          : this.state.getSelectedTrip ? this.state.preApprovedRides : "",
            'preApprovedKilometers'     : this.state.getSelectedTrip ? this.state.preApprovedKilometers : "",
            'createUser'                : true,
            'role'                      : this.state.pathname,
            'addEmployee'               : this.state.addEmployee,
            }
        }
        console.log("userDetailsContact",userDetailsContact)

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
          preApprovedKilometer: "",
          preApprovedAmount: "",
          preApprovedRides: "",
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
  // docBrowse(event) {
  //   event.preventDefault();
  //   $('#loader_img').show();
  //   // $('.fullpageloader').show();
  //   var name = event.target.name
  //   var docBrowse = [];
  //   if (event.currentTarget.files && event.currentTarget.files[0]) {
  //     for (var i = 0; i < event.currentTarget.files.length; i++) {
  //       var file = event.currentTarget.files[i];
  //       if (file) {
  //         var fileName = file.name;
  //         var ext = fileName.split('.').pop();
  //         if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "pdf" || ext === "JPG" || ext === "PNG" || ext === "JPEG" || ext === "PDF") {
  //           if (file) {

  //             var objTitle = { fileInfo: file }
  //             docBrowse.push(objTitle);
  //           } else {
  //             swal("Files not uploaded");
  //           }//file
  //         } else {
  //           swal("Allowed images formats are (jpg,png,jpeg, pdf)");
  //         }//file types
  //       }//file
  //     }//for 

  //     if (event.currentTarget.files) {
  //       main().then(formValues => {

  //         var docBrowse = this.state[name];

  //         for (var k = 0; k < formValues.length; k++) {
  //           docBrowse.push(
  //             {
  //               imgUrl: formValues[k].docBrowse,
  //               status: "New",
  //               remarks: "xyz"

  //             })
  //         }
  //         console.log("docBrowse", docBrowse);
  //         this.setState({
  //           [name]: docBrowse
  //         }, () => {
  //           console.log("")
  //         })
  //       });

  //       async function main() {
  //         var formValues = [];
  //         for (var j = 0; j < docBrowse.length; j++) {
  //           var config = await getConfig();
  //           var s3url = await s3upload(docBrowse[j].fileInfo, config, this);
  //           const formValue = {
  //             "docBrowse": s3url,
  //             "status": "New"
  //           };
  //           formValues.push(formValue);
  //         }
  //         return Promise.resolve(formValues);
  //       }


  //       function s3upload(image, configuration) {

  //         return new Promise(function (resolve, reject) {
  //           S3FileUpload
  //             .uploadFile(image, configuration)
  //             .then((Data) => {
  //               resolve(Data.location);
  //             })
  //             .catch((error) => {
  //             })
  //         })
  //       }
  //       function getConfig() {
  //         return new Promise(function (resolve, reject) {
  //           axios
  //             .get('/api/projectsettings/get/S3')
  //             .then((response) => {
  //               $('#loader_img').hide();

  //               const config = {
  //                 bucketName: response.data.bucket,
  //                 dirName: 'propertiesImages',
  //                 region: response.data.region,
  //                 accessKeyId: response.data.key,
  //                 secretAccessKey: response.data.secret,
  //               }
  //               resolve(config);
  //             })
  //             .catch(function (error) {
  //             })
  //         })
  //       }
  //     }
  //   }
  // }
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
                    console.log("before Push formValues==>",formValues[k])
                    docBrowsearr.push(formValues[k].imgUrl)
                    // console.log("Only docBrowsearr==>",docBrowsearr)
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
  edit() {
    var personID = this.state.personID;
    if (personID) {
        axios.get('/api/personmaster/get/one/' + personID)
            .then((response) => {
                console.log("response=>",response,response.data.department[0].department)

          if (this.state.pathname === 'driver') {
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
                        ["docproofimg"+i]       : docarray[i].documentProof.imgUrl,
                        docimgarray             : docarray[i].documentProof.imgUrl,
                        showdocimg              : true,
                    })
                } 
                this.setState({
                    DocumentsDetails : docarr,
                }, () => {
                });
            this.setState({
              companyID: response.data.companyID,
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
              // getSelectedTrip :   response.data.bookingApprovalRequired && response.data.bookingApprovalRequired === "true" ? "Yes" : "No",
              getSelectedTrip: response.data.bookingApprovalRequired && (response.data.bookingApprovalRequired === "Yes" || response.data.bookingApprovalRequired === true) ? "Yes" : "No",
              loginCredential: response.data.loginCredential ? response.data.loginCredential : "Yes",
              approvingAuthorityId1: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId1 : "",
              approvingAuthorityId2: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId2 : "",
              approvingAuthorityId3: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId3 : "",
              whatsappNumber: response.data.whatsappNo ? response.data.whatsappNo : "",
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
              country: response.data.address[0] ? response.data.address[0].countryCode + "|" + response.data.address[0].country : "-- Select --",
              pincode: response.data.address[0] ? response.data.address[0].pincode : "",
              email: response.data.email,
              preApprovedKilometer: response.data.bookingApprovalRequired == "Yes" ? response.data.preApprovedKilometer:"",
              preApprovedAmount: response.data.bookingApprovalRequired == "Yes" ? response.data.preApprovedAmount:"",
              preApprovedRides: response.data.bookingApprovalRequired == "Yes" ? response.data.preApprovedRides:"",

              licenseNumber: response.data.drivingLicense ? response.data.drivingLicense.licenseNo : "",
              effectiveUpto: moment(response.data.effectiveTo).format("YYYY-MM-DD"),
              //panNumber       : response.data.pan[0] ? response.data.pan[0].PAN : "",
              aadharNumber: response.data.aadhar ? response.data.aadhar.aadharNo : "",
              //voterId         : response.data.voterID[0] ? response.data.voterID[0].voterID : "", 
              //passportNumber  : response.data.passport[0] ? response.data.passport[0].passportNo : [],
              licenseProof: response.data.drivingLicense ? response.data.drivingLicense.licenseProof : [],
              addressProof: response.data.address[0] ? response.data.address[0].addressProof : [],
              //panProof        : response.data.pan[0] ? response.data.pan[0].PANProof : [],
              aadharProof: response.data.aadhar ? response.data.aadhar.aadharProof : [],
              verificationProof: response.data.verification ? response.data.verification.verificationProof : [],
              //voterIDProof    : response.data.voterID[0] ? response.data.voterID[0].voterIDProof : [],
              identityProof: response.data.identityProof ? response.data.identityProof : [],
              profilePhoto: response.data.profilePhoto,
              createdBy: localStorage.getItem("user_ID")
            }, () => {
              this.getEntityLocation(this.state.corporate_Id);

              if (response.data.address.length > 0) {
                this.getStates(response.data.address[0].countryCode);
                this.getDistrict(response.data.address[0].stateCode, response.data.address[0].countryCode);
              }


            })
          } else if(this.state.pathname === 'employee')
          {
          this.setState({
              companyID: response.data.companyID,
              corporate_Id: response.data.company_Id,
              corporate: response.data.companyName,
              firstName: response.data.firstName,
              middleName: response.data.middleName?response.data.middleName:"",
              lastName: response.data.lastName,
              branchCode:this.state.branchCode,
              DOB: moment(response.data.DOB).format("YYYY-MM-DD"),
              toggleButtonValue: response.data.gender ? response.data.gender : "Male",
              contactNumber: response.data.contactNo ? response.data.contactNo : "",
              alternateNumber: response.data.altContactNo ? response.data.altContactNo : "",
              bookingApprovalRequired: response.data.bookingApprovalRequired && response.data.bookingApprovalRequired === true ? "Yes" : "No",
              // getSelectedTrip :   response.data.bookingApprovalRequired && response.data.bookingApprovalRequired === "true" ? "Yes" : "No",
              getSelectedTrip: response.data.bookingApprovalRequired && (response.data.bookingApprovalRequired === "Yes" || response.data.bookingApprovalRequired === true) ? "Yes" : "No",
              loginCredential: response.data.loginCredential ? response.data.loginCredential : "Yes",
              approvingAuthorityId1: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId1 : "",
              approvingAuthorityId2: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId2 : "",
              approvingAuthorityId3: response.data.bookingApprovalRequired == "Yes" ? response.data.approvingAuthorityId3 : "",
              whatsappNumber: response.data.whatsappNo ? response.data.whatsappNo : "",
              department: response.data.departmentId,
              designation: response.data.designationId,
              employeeID: response.data.employeeId,
              workLocation: response.data.workLocation,
              workLocationId: response.data.workLocationId,
              userId:response.data.userId ? response.data.userId : "",
              departmentName : response.data.department[0].department,
              designationName : this.state.designationName,
              // badgeNumber: response.data.badgeNumber,
              //verificationNumber: response.data.verification ? response.data.verification.verificationNumber : "",
              type: response.data.pathname,
              addressLine1: response.data.address[0] ? response.data.address[0].addressLine1 : "",
              addressLine2: response.data.address[0] ? response.data.address[0].addressLine2 : "",
              landmark: response.data.address[0] ? response.data.address[0].landmark : "",
              area: response.data.address[0] ? response.data.address[0].area : "",
              city: response.data.address[0] ? response.data.address[0].city : "",
              district: response.data.address[0] ? response.data.address[0].district : "",
              states: response.data.address[0] ? response.data.address[0].stateCode + "|" + response.data.address[0].state : "",
              country: response.data.address[0] ? response.data.address[0].countryCode + "|" + response.data.address[0].country : "-- Select --",
              pincode: response.data.address[0] ? response.data.address[0].pincode : "",
              email: response.data.email,
              preApprovedKilometer: response.data.bookingApprovalRequired == "Yes" ? response.data.preApprovedKilometer:"",
              preApprovedAmount: response.data.bookingApprovalRequired == "Yes" ? response.data.preApprovedAmount:"",
              preApprovedRides: response.data.bookingApprovalRequired == "Yes" ? response.data.preApprovedRides:"",

              //licenseNumber: response.data.drivingLicense ? response.data.drivingLicense.licenseNo : "",
             // effectiveUpto: moment(response.data.effectiveTo).format("YYYY-MM-DD"),
              //panNumber       : response.data.pan[0] ? response.data.pan[0].PAN : "",
              //aadharNumber: response.data.aadhar ? response.data.aadhar.aadharNo : "",
              //voterId         : response.data.voterID[0] ? response.data.voterID[0].voterID : "", 
              //passportNumber  : response.data.passport[0] ? response.data.passport[0].passportNo : [],
             // licenseProof: response.data.drivingLicense ? response.data.drivingLicense.licenseProof : [],
             // addressProof: response.data.address[0] ? response.data.address[0].addressProof : [],
              //panProof        : response.data.pan[0] ? response.data.pan[0].PANProof : [],
             // aadharProof: response.data.aadhar ? response.data.aadhar.aadharProof : [],
              //verificationProof: response.data.verification ? response.data.verification.verificationProof : [],
              //voterIDProof    : response.data.voterID[0] ? response.data.voterID[0].voterIDProof : [],
             // identityProof: response.data.identityProof ? response.data.identityProof : [],
              profilePhoto: response.data.profilePhoto,
              createdBy: localStorage.getItem("user_ID")
            }, () => {
              this.getEntityLocation(this.state.corporate_Id);

              if (response.data.address.length > 0) {
                this.getStates(response.data.address[0].countryCode);
                this.getDistrict(response.data.address[0].stateCode, response.data.address[0].countryCode);
              }


            })
          
          }else {
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
          companyPhoneAvailable: this.state.companyPhone == "+" || this.state.companyPhone.length < 15 ? false : true
        }, () => {
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
  deleteDoc(event) {
    event.preventDefault();

    var name = event.target.getAttribute("name");
    var deleteDoc = this.state[name];
    const index = deleteDoc.indexOf(event.target.getAttribute("id"));
    if (index > -1) {
      deleteDoc.splice(index, 1);
    }
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
        this.setState({
          contactNumber: event
        }, () => {
          if (this.state.contactNumber) {
            this.setState({
              contactNumberAvailable: this.state.contactNumber == "+" || this.state.contactNumber.length < 15 ? false : true
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
 
  render() {
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"style={{background:"#fff"}}>
       <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
          <h4 className="weighttitle col-lg-9 col-md-6 col-xs-6 col-sm-6 NOpadding-right">Package Master</h4>
          <ul className="nav tabNav nav-pills col-lg-3 col-md-3 col-sm-12 col-xs-12">
            <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill" href="#manual">Manual</a></li>
            <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center"><a data-toggle="pill" href="#bulk">Bulk Upload</a></li>
          </ul>
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
    );
  }
}
export default withRouter(PackageMasterBulk);


