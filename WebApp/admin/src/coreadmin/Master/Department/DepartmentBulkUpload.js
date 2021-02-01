
import React, { Component }     from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import S3FileUpload             from 'react-s3';
import moment                   from 'moment';
import PhoneInput               from 'react-phone-input-2';
import _                        from 'underscore';
import OneFieldForm             from '../OneFieldForm/OneFieldForm.js';
import BulkUpload from "../BulkUpload/BulkUpload.js";
import "bootstrap-toggle/css/bootstrap2-toggle.min.css";
import "bootstrap-toggle/js/bootstrap2-toggle.min.js";
// import "./PersonMaster.css";


class DepartmentBulkUpload extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      "fields" : {
                placeholder     : "Enter Department ..",
                title           : "Department",
                attributeName   : "department"
            },
            "tableHeading": {
                department: "Department",
                actions: 'Action',
            },
            "tableObjects": {
                deleteMethod: 'delete',
                apiLink: '/api/departmentmaster/',
                paginationApply: false,
                searchApply: false,
                editUrl: '/department'
            },
      "pathname"         : "Departments",
      "companyLogo"      : [],
      "districtArray"    : [],
      "designationArray" : [],
      "departmentArray"  : [],
      'toggleButtonValue': "Male",
      'getSelectedTrip'  : "Yes",
      'loginCredential'  : "Yes",
      'country'          : "",
      'workLocation'     : "",
      'userId'           : "",
      'pincodeExists'    : true,
      "stateArray"       : [],
      "licenseProof"     : [],
      "panProof"         : [],
      "aadharProof"      : [],
      "voterIDProof"     : [],
      "profilePhoto"     : "",
      "passportProof"    : [],
      "addressProof"     : [],
      "identityProof"    : [],
      "verificationProof": [],
      "COI"              : [],

      fileDetailUrl      : "/api/departmentmaster/get/filedetails/",
      goodRecordsHeading :{
        department       : "Department",
      },
      failedtableHeading   :{
          department            : "Department",
          failedRemark          :  "Failed Data Remark"
      }
    };

    this.handleChange             = this.handleChange.bind(this);
    this.keyPress                 = this.keyPress.bind(this);
    this.handleOptionChange       = this.handleOptionChange.bind(this);
    this.submitPerson             = this.submitPerson.bind(this);
    this.camelCase                = this.camelCase.bind(this)
    this.handleChangeCountry      = this.handleChangeCountry.bind(this);
    this.handleChangeState        = this.handleChangeState.bind(this);
    this.handleChangeDesignation  = this.handleChangeDesignation.bind(this);
    this.handleChangeDepartment   = this.handleChangeDepartment.bind(this);

  }

  componentDidMount() {
    this.getDesignation();
    this.getDepartment();
    this.getCompany();
    

    var pageUrl = window.location.pathname;
    console.log("pageUrl = ",pageUrl);
    let a = pageUrl ? pageUrl.split('/') : "";
        console.log("a==>",a[1]); 
        const urlParam =a[2];
        this.setState({
      pageUrl   : a[1],
      });
    this.setState({
      departmentID: this.props.match.params.fieldID
    }, () => {
      this.edit();
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
              console.log('company', response.data)
              this.setState({
                  companyId : response.data._id,
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

    this.setState({
      [name]: event.target.value
    },()=>{
    });
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

    if ($('#BasicInfo').valid()) {
      
        var userDetails = {
          departmentId            : this.state.department,
         
        }
       
         axios.post('/api/departmentmaster/post', userDetails)
          .then((response) => {

            swal(this.Capitalize(this.state.pathname) + " Added Successfully");

              this.setState({
                
                department      : "-- Select --",
                

            },()=>{
              this.props.history.push("/"+this.state.pathname+"/lists")
            })
             
          })
          .catch((error) => {

          })
      } 
  }
  createLogin(loginCredential){

    if(loginCredential === "Yes")
    {
      var userDetails = {
        firstname     : this.state.firstName,
        lastname      : this.state.lastName,
        mobNumber     : this.state.contactNumber,
        email         : this.state.email,
        pwd           : "welcome123",
        role          : this.state.pathname,
        status        : 'active',
        "emailSubject"    : "Email Verification",
        "emailContent"    : "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
     }
    axios.post('/api/auth/post/signup/user', userDetails)
    .then((response)=>{
       this.setState({
          userId : response.data.ID
        },()=>{
        })
        if(response.data.message =='USER_CREATED'){
       
        }else{
        swal(response.data.message);
      }
    })
    }
    
  }
  updatePerson(event){
   /* event.preventDefault();
  if($('#BasicInfo').valid()  && this.state.pincodeExists){
    if(this.state.departmentID)
    {
       if (this.state.pathname === 'employee' ) {
          var userDetails = {
            departmentID    : this.state.departmentId,
            firstName       : this.state.firstName,
            middleName      : this.state.middleName,
            lastName        : this.state.lastName,
            DOB             : this.state.DOB,
            gender          : this.state.toggleButtonValue,
            contactNo       : this.state.contactNumber,
            altContactNo    : this.state.alternateNumber ? this.state.alternateNumber:"",
            whatsappNo      : this.state.whatsappNumber ? this.state.whatsappNumber :"",
            email           : this.state.email,
            departmentId    : this.state.department,
            designationId   : this.state.designation,
            preApprovedParameter: this.state.preApprovedParameter,
            preApprovedParameterValue: this.state.preApprovedParameterValue,
            profilePhoto    : this.state.profilePhoto,
            employeeId              : this.state.employeeID,
            bookingApprovalRequired : this.state.getSelectedTrip,
            approvingAuthorityId1    : this.state.approvingAuthorityId1,
            approvingAuthorityId2    : this.state.approvingAuthorityId2,
            approvingAuthorityId3    : this.state.approvingAuthorityId3,
            loginCredential         : this.state.loginCredential,
            workLocation            : this.state.workLocation,
            address         : [{
                                addressLine1    : this.state.addressLine1,
                                addressLine2    : this.state.addressLine2,
                                landmark        : this.state.landmark,
                                area            : this.state.area,
                                city            : this.state.city,
                                district        : this.state.district,
                                state           : this.state.states.split('|')[1],
                                stateCode       : this.state.states.split('|')[0],
                                country         : this.state.country.split('|')[1],
                                countryCode     : this.state.country.split('|')[0],
                                pincode         : this.state.pincode,
                                addressProof    : this.state.addressProof,

                              }],
           
            updatedBy        : localStorage.getItem("user_ID")
          }
          console.log("userDetails update",userDetails);
       }else if(this.state.pathname === 'driver' ){
          var userDetails = {
            personID        : this.state.personID,
            firstName       : this.state.firstName,
            middleName      : this.state.middleName,
            lastName        : this.state.lastName,
            DOB             : this.state.DOB,
            gender          : this.state.toggleButtonValue,
            contactNo       : this.state.contactNumber,
            altContactNo    : this.state.alternateNumber ? this.state.alternateNumber:"",
            whatsappNo      : this.state.whatsappNumber ? this.state.whatsappNumber :"",
            // department      : this.state.department,
            // designation     : this.state.designation,
            profilePhoto    : this.state.profilePhoto,
            identityProof   : this.state.identityProof,
            verificationProof: this.state.verificationProof,
            batchNumber     : this.state.batchNumber,
            verificationNumber     : this.state.verificationNumber,

            address         : {
                                addressLine1    : this.state.addressLine1,
                                addressLine2    : this.state.addressLine2,
                                landmark        : this.state.landmark,
                                area            : this.state.area,
                                city            : this.state.city,
                                district        : this.state.district,
                                state           : this.state.states.split('|')[1],
                                stateCode       : this.state.states.split('|')[0],
                                country         : this.state.country.split('|')[1],
                                countryCode     : this.state.country.split('|')[0],
                                pincode         : this.state.pincode,
                                addressProof    : this.state.addressProof,
                              },
            drivingLicense  : {
                                licenseNo       : this.state.licenseNumber,
                                effectiveTo     : this.state.effectiveUpto,
                                licenseProof    : this.state.licenseProof
                              },
            aadhar          : {
                                aadharNo        : this.state.aadharNumber,
                                aadharProof     : this.state.aadharProof
                              },

            updatedBy       : localStorage.getItem("user_ID")
          }
          console.log("userDetails",userDetails);
       }else{
          var userDetails = {
            personID        : this.state.personID,
            firstName       : this.state.firstName,
            middleName      : this.state.middleName,
            lastName        : this.state.lastName,
            gender          : this.state.toggleButtonValue,
            contactNo       : this.state.contactNumber,
            altContactNo    : this.state.alternateNumber ? this.state.alternateNumber:"",
            whatsappNo      : this.state.whatsappNumber ? this.state.whatsappNumber :"",
            email           : this.state.email,
            profilePhoto    : this.state.profilePhoto,
            updatedBy       : localStorage.getItem("user_ID")
          }
        console.log("userDetails==>",userDetails);
      }
       axios.patch('/api/personmaster/patch', userDetails)
        .then((response) => {
          this.setState({
              personID        : "",
              firstName       : "",
              middleName      : "",
              lastName        : "",
              DOB             : "",
              gender          : "",
              contactNumber   : "",
              alternateNumber : "",
              whatsappNumber  : "",
              department      : "-- Select --",
              designation     : "-- Select --",
              preApprovedParameterValue     : "-- Select --",
              preApprovedParameterValue    :"",
              profilePhoto    :"",
              approvingAuthorityId3    :"",
              approvingAuthorityId2    :"",
              approvingAuthorityId1    :"",
             
              addressLine1    : "",
              addressLine2    : "",
              landmark        : "",
              area            : "",
              city            : "",
              district        : "-- Select --",
              states          : "-- Select --",
              country         : "-- Select --",
              pincode         : "",
              email           : "",
              licenseNumber   : "",
              preApprovedAmount : "",
              approvingAuthorityId : "",
              effectiveUpto   : "",
              panNumber       : "",
              aadharNumber    : "",
              voterId         : "",
              passportNumber  : "",
              licenseProof    : [],
              panProof        : [],
              aadharProof     : [],
              identityProof   : [],
              verificationProof: [],
              addressProof    : [],

          },()=>{
            this.props.history.push("/"+this.state.pathname+"/lists")
          })
           swal(this.Capitalize(this.state.pathname) +" Details Updated Sucessfully");
        })
        .catch((error) => {
          console.log("error",error)
        })
      }
    }*/
  }
  imgBrowse(event) {
    event.preventDefault();
    var companyLogo = [];
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      for(var i=0; i<event.currentTarget.files.length; i++){
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
          for(var k = 0; k < formValues.length; k++){
            companyLogo.push(formValues[k].companyLogo)
          }
          
          this.setState({
            companyLogo: companyLogo
          })
        });
        
          async function main() {
            var formValues = [];
            for(var j = 0; j < companyLogo.length; j++){
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
        var name = event.target.name
        var docBrowse = [];
        console.log("event.currentTarget.files", event.target.name,event.currentTarget.files);
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
                            swal("Files not uploaded");
                        }//file
                    } else {    
                        swal("Allowed images formats are (jpg,png,jpeg, pdf)");
                    }//file types
                }//file
            }//for 

            if (event.currentTarget.files) {
                main().then(formValues => {
                  console.log("name->",name)
                    var docBrowse = this.state[name];
                    console.log("docBrowse",docBrowse);
                   for (var k = 0; k < formValues.length; k++) {
                        docBrowse.push(formValues[k].docBrowse)
                        console.log("formValues[k]",formValues[k])
                        console.log("formValues[k].docBrowse",formValues[k].docBrowse)
                    }

                    this.setState({
                        [name]: docBrowse
                    },()=>{
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
  
  keyPressWeb = (e) => {

    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190, 110,48,49,50,51,52,53,54,55,56,57]) !== -1 ||
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
  isTextKey(evt)  {
   var charCode = (evt.which) ? evt.which : evt.keyCode;
   if (charCode!=189 && charCode > 32 && (charCode < 65 || charCode > 90) )
   {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
  }
  componentWillReceiveProps(nextProps,prevProps) {
    var splitslash =  nextProps.location.pathname.split("/");
    this.setState({
      pathname : splitslash[1]
    })
    if(splitslash[1] === "driver")
    {
      $(".person").hide();
      $(".driver").show();
    }else if(splitslash[1] === "employee"){
      $(".person").hide();
      $(".employee").show();
    }else if(splitslash[1] === "guest"){
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
      axios.get('/api/departmentmaster/get/one/' + personID)
        .then((response) => {
          console.log("response:=>",response)
        this.setState({
            
            department      : response.data.department,
            createdBy       : localStorage.getItem("user_ID")
          },()=>{
            if(response.data.address.length > 0)
            {
             this.getStates(response.data.address[0].countryCode);
             this.getDistrict(response.data.address[0].stateCode, response.data.address[0].countryCode);
            }
           
            
          })
        })
        .catch((error) => {
        })
    }
  }
  changeMobile(event){ 
    this.setState({
      companyPhone : event
    },()=>{ 
      if(this.state.companyPhone){
        this.setState({
          companyPhoneError : this.state.companyPhone === "+" ? 'Please enter valid mobile number.' : ""
        })
      } 
    })
  }
  deleteLogo(event){
    event.preventDefault();
    var companyLogo = this.state.companyLogo;
    const index = companyLogo.indexOf(event.target.id);
    if (index > -1) {
      companyLogo.splice(index, 1);
    }
    this.setState({
      companyLogo : companyLogo
    })
  }
  deleteDoc(event){
    event.preventDefault();
        var name = event.target.getAttribute("name");
        var deleteDoc = this.state[name];
        console.log(deleteDoc)
        const index = deleteDoc.indexOf(event.target.getAttribute("id"));
        if (index > -1) {
            deleteDoc.splice(index, 1);
        }
        this.setState({
            [name]: deleteDoc
        })
  }
  deleteDocSingle(event){
    event.preventDefault();
        var name = event.target.getAttribute("name");
        var deleteDoc = this.state[name];
        console.log(deleteDoc)
        const index = deleteDoc.indexOf(event.target.getAttribute("id"));
        if (index > -1) {
            deleteDoc.splice(index, 1);
        }
        this.setState({
            [name]: deleteDoc
        })
  }
  changeMobile(event){
    this.setState({
      contactNumber : event
    })
  }
  changeMobileAlternate(event){
    this.setState({
      alternateNumber : event
    })
  }
  changeMobileWhatsapp(event){
    this.setState({
      whatsappNumber : event
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
    },()=>{
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
        },()=>{
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
  Capitalize(str){
    // return str.charAt(0).toUpperCase() + str.slice(1);
  }
  getSelectedGender(val,event) {
    this.setState({
      toggleButtonValue : val
    })
  }
  getSelectedTrip(val,event) {

      this.setState({
        getSelectedTrip : val
      })
      
  }
  getSelectedLoginValue(val,event) {

      this.setState({
        loginCredential : val
      })
      
  }
  getFileDetails(fileName){
      
      axios
      .get(this.state.fileDetailUrl+fileName)
      .then((response)=> {
      $('.fullpageloader').hide();  
      if (response) {
        this.setState({
            fileDetails         : response.data,
            failedRecordsCount  : response.data.failedRecords.length,
            goodDataCount       : response.data.goodrecords.length
        });
          var tableData = response.data.goodrecords.map((a, i)=>{
            console.log("aaaa",a.department);
            return{
                "department"    : a.department            ? a.department           : '-', 
                  
            }
          })

          var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
          return{
               
                "department"    : a.department            ? a.department           : '-', 
                "failedRemark"  : a.failedRemark     ? a.failedRemark : '-' 
          }
          })

        this.setState({
            goodRecordsTable    : tableData,
            failedRecordsTable  : failedRecordsTable
        })
      }
      })
      .catch((error)=> { 
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
                          console.log("docBrowse",docBrowse)

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
                    console.log("formValues",formValues);
                    var docBrowse = this.state[name];
                    this.setState({
                        [name]: formValues[0].docBrowse
                    },()=>{
                        console.log("profilePhoto0",this.state.profilePhoto)
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
  deleteDocSingle(event){
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

  render() {
   
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
            <section className="content">
              <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                  <h4 className="weighttitle col-lg-9 col-md-6 col-xs-6 col-sm-6 NOpadding-right">{"Add  "+this.state.pathname}</h4>
                  <ul className="nav tabNav nav-pills col-lg-3 col-md-3 col-sm-12 col-xs-12">
                    {/*<li className=" col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill"  href="#manual">Manual</a></li>*/}
                    <li className="active col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center"><a data-toggle="pill"  href="#bulk">Bulk Upload</a></li>
                  </ul>
                </div>
                <section className="Content" >
                  <div className="row tab-content">
                    <div id="manual" className="tab-pane fade in active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
                   {/*  <div id="bulk" className="tab-pane fade in col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">*/}
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerForm">
                        <BulkUpload url="/api/departmentmaster/bulkUploadDepartment" 
                        data={{ "createdBy" : localStorage.getItem("user_ID"),  }} 
                        uploadedData={this.uploadedData} 
                        fileurl="https://iassureitlupin.s3.ap-south-1.amazonaws.com/bulkupload/Create+Family.xlsx"
                        getFileDetails={this.getFileDetails.bind(this)}
                        fileDetails={this.state.fileDetails}
                        goodRecordsHeading ={this.state.goodRecordsHeading}
                        failedtableHeading={this.state.failedtableHeading}
                        failedRecordsTable ={this.state.failedRecordsTable}
                        failedRecordsCount={this.state.failedRecordsCount}
                        goodRecordsTable={this.state.goodRecordsTable}
                        goodDataCount={this.state.goodDataCount}
                        />
                      </div>
                  {/*  </div>*/}
                     
                    </div>
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
export default DepartmentBulkUpload;