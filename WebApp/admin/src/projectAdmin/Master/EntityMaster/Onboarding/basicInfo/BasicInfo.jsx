import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import S3FileUpload from 'react-s3';
import PhoneInput from 'react-phone-input-2';
import 'bootstrap/js/tab.js';
import '../css/SupplierOnboardingForm.css';
import 'react-phone-input-2/lib/style.css';
import { withRouter } from 'react-router-dom';
import BulkUpload from "../../../../../coreadmin/Master/BulkUpload/BulkUpload.js";
var contactarray = [];
var personIDOF = "";
class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
                "pathname"      : this.props.entity,
                "companyLogo"   : [],
                 fileDetailUrl: "/api/entitymaster/get/filedetails/",
                "imageUploaded" : true,
                "companyPhoneAvailable" : true, 
                "companyPhone"  : '',
                "COI"           : [],

                goodRecordsHeading: 
              {
                // entityType: "Entity Type",
                companyName: "Company Name",
                groupName: "Group Name",
                companyPhone: "Contact No",
                companyEmail: "Company Email",
       
               },
             failedtableHeading: 
              {
               
                // entityType: "Entity Type",
                companyName: "Company Name",
                groupName: "Group Name",
                companyPhone: "Contact No",
                companyEmail: "Company Email",
                failedRemark              : "Failed Data Remark"
             }
    }; 

    this.handleChange              = this.handleChange.bind(this);
    this.keyPress                  = this.keyPress.bind(this);
    this.handleOptionChange        = this.handleOptionChange.bind(this);
    this.SubmitBasicInfo           = this.SubmitBasicInfo.bind(this);
  }

  Preloader(props) {
    return <img src="spinner.gif" />;
  }


    componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");

    this.setState({
      entityID: this.props.match.params.entityID
    }, () => {
      this.edit();
    })
    window.scrollTo(0, 0);
    $.validator.addMethod("regxA1", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid company name");
    $.validator.addMethod("regxA5", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid group name");
  /*  $.validator.addMethod("regxA2", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter a valid TAN Number.");*/
    $.validator.addMethod("regxA4", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter a valid website.");
    $.validator.addMethod("regxEmail", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter a valid email address.");
    jQuery.validator.addMethod("notEqual", function(value, element, param) {
      return this.optional(element) || value != param;
    }, "Please specify a different (non-default) value");
   /* $.validator.addMethod("regxA8", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter the valid CIN");
    */
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    $("#BasicInfo").validate({
      rules: {
        companyName: {
          required: true,
          regxA1: /^[A-Za-z][A-Za-z0-9\-\s]/,
        },
        groupName: {
          required: true,
          regxA5: /^[A-Za-z][A-Za-z0-9\-\s]/,
        },
     /*   TAN: {
          regxA2: /^[A-Za-z]{4}[0-9]{5}[A-Za-z]$|^$/,
        },
        */
        website: {
          regxA4: /^([a-zA-Z0-9_\-:/.]+).([a-zA-Z]{2,5})$|^$/
        },
        companyEmail: {
          required: true,
          regxEmail: /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/
        },
        companyPhone: {
          required: true,
          notEqual:"+91"
        },
      /*  CIN: {
          regxA8: /^([L|U|l|u]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$|^$/,
        },*/
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") === "companyName") {
          error.insertAfter("#companyName");
        }
        if (element.attr("name") === "companyPhone") {
          error.insertAfter("#companyPhone");
        }
        if (element.attr("name") === "groupName") {
          error.insertAfter("#groupName");
        }
        if (element.attr("name") === "companyEmail") {
          error.insertAfter("#companyEmail");
        }
       /*  if (element.attr("name") === "TAN") {
          error.insertAfter("#TAN");
        }*/
        if (element.attr("name") === "website") {
          error.insertAfter("#website");
        }
       /*  if (element.attr("name") === "CIN") {
          error.insertAfter("#CIN");
        }*/
      }
    });
    // axios.get("/api/entitymaster/get/"+this.props.entity)
    //   .then((response) => {
    //     this.setState({
    //       entityList   : response.data,
    //       entityID     : response.data[0]._id
    //     },()=>{
    //       console.log("entityID",this.state.entityID,this.state.entityList)
    //      {/* if (this.state.entityList.length > 0 && this.state.entityList[0].entityType === "appCompany")
    //       {
    //        this.props.history.push('/org-profile/' + this.state.entityID);
    //        this.edit();

    //       }*/}
    //     })
    //    })
    //   .catch((error) => {
    //   })

  }
componentWillUnmount() {
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();
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
        percentVal = 0;

        styleC = {
          width: 0 + "%",
          display: "none",
          height: "8px",
        }
        styleCBar = {
          display: "none",
          marginTop: 10,
          height: "8px",
        }

      }
      if (percentVal === 100) {
        percentVal = 0;

        styleC = {
          width: 0 + "%",
          display: "none",
          height: "8px",
        }
        styleCBar = {
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
        percentVal = 0;

        styleC = {
          width: 0 + "%",
          display: "none",
          height: "8px",
        }
        styleCBar = {
          display: "none",
          marginTop: 10,
          height: "8px",
          padding: "0px",
        }

      }
      if (percentVal === 100) {
        percentVal = 0;

        styleC = {
          width: 0 + "%",
          display: "none",
          height: "8px",
        }
        styleCBar = {
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
    });
  }
  handleOptionChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: event.target.value
    });
  }
  SubmitBasicInfo(event) {
    event.preventDefault();
    if(this.state.companyPhone === "" || this.state.companyPhone === undefined)
    {
      this.setState({
        companyPhoneAvailable : false
      })
    }
    else{
       this.setState({
        companyPhoneAvailable : true
      })
    }
    if ($('#BasicInfo').valid() && this.state.companyPhoneAvailable) {
      var formValues = {
        "supplierOf": this.props.vendorID ? this.props.vendorID : localStorage.getItem("user_ID"),
        "profileStatus":"New",
        "entityID": this.props.match.params.entityID,
        "entityType": this.state.pathname,
        "companyName": this.state.companyName,
        "groupName": this.state.groupName,
        "website": this.state.website,
        "companyPhone": this.state.companyPhone,
        "companyEmail": this.state.companyEmail,
        "CIN": this.state.CIN? this.state.CIN.toUpperCase() :"",
        "COI": this.state.COI,
        "TAN": this.state.TAN ? this.state.TAN.toUpperCase() : "",
        "companyLogo": this.state.companyLogo,
        "userID": this.state.userID,
        "createdBy": localStorage.getItem("user_ID")
      }
      if (this.props.match.params.entityID) {
        axios.patch('/api/entitymaster/patch', formValues)
          .then((response) => {
            
            swal((this.state.pathname === "appCompany" ? "Organzational Settings" : this.state.pathname ) + " updated successfully.");
            $(".swal-text").css("text-transform", "capitalize");
            $(".swal-text").css("font-family", "sans-serif");
            if(this.props.modal){
              window.location.reload();
            }else{
               this.props.history.push('/' + this.state.pathname + '/department-details/' + this.props.match.params.entityID)
            }
          })
          .catch((error) => {

          })
      } else {
        axios.post('/api/entitymaster/post', formValues)
        .then((response) => {
          swal((this.state.pathname === "appCompany" ? "Organzational Settings" : this.state.pathname ) + " created successfully.");
          $(".swal-text").css("text-transform", "capitalize");
          if(this.props.modal){
            window.location.reload();
          }else{
             this.props.history.push('/' + this.state.pathname + '/department-details/' + response.data.entityID)
          }
        })
        .catch((error) => {

        })
      }
    } else {
      $('select.error:first').focus();
      $('input.error:first').focus();

    }

  }
  imgBrowse(event) {
    event.preventDefault();
    var companyLogo = [];
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      this.setState({
        gotImagecompanyLogo:true
      })
      for (var i = 0; i < event.currentTarget.files.length; i++) {
        var file = event.currentTarget.files[i];
        if (file) {
          var fileName = file.name;
          var fileSize = file.size;
          var ext = fileName.split('.').pop();
          if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "JPG" || ext === "PNG" || ext === "JPEG") {
            if(fileSize > 1048576){
              swal("Allowed file size is 1MB");
              this.setState({
                gotImagecompanyLogo:false
              })
						}else{
              if (file) {
                var objTitle = { fileInfo: file }
                companyLogo.push(objTitle);
              } else {
                swal("Images not uploaded");
                this.setState({
                  gotImagecompanyLogo:false
                })
              }//file
            }
          } else {
            swal("Allowed images formats are (jpg,png,jpeg)");
            this.setState({
              gotImagecompanyLogo:false
            })
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
            companyLogo   : companyLogo,
            imageUploaded : false
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
              .post('/api/projectsettings/getS3Details/S3')
              .then((response) => {
                const config = {
                  bucketName: response.data.bucket,
                  dirName: process.env.REACT_APP_ENVIRONMENT,
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
    var COI = [];
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      this.setState({
        gotImageCOI: true
      })
      for (var i = 0; i < event.currentTarget.files.length; i++) {
        var file = event.currentTarget.files[i];

        if (file) {
          var fileName = file.name;
          var fileSize = file.size;
          var ext = fileName.split('.').pop();
          if (ext === "jpg" || ext === "png" || ext === "pdf" || ext === "jpeg" || ext === "JPG" || ext === "PNG" || ext === "JPEG" || ext === "PDF") {
            if(fileSize > 1048576){
              swal("Your file size is exceeding max size allowed which is 1 MB.");
              this.setState({
                gotImageCOI:false
              },()=>{})
            }else{
              if (file) {
                  var objTitle = { fileInfo: file }
                  COI.push(objTitle);

                } else {
                  swal("File not uploaded");
                  this.setState({
                    gotImageCOI:false
                  },()=>{})
                }//file
              }
            } else {
            swal("Allowed file formats are (jpg, png, jpeg, pdf)");
            this.setState({
              gotImageCOI:false
            },()=>{})
          }//file types
        }//file
      }//for 

      if (event.currentTarget.files) {
        
        main().then(formValues => {
          var COI = this.state.COI;
          for (var k = 0; k < formValues.length; k++) {
            COI.push(formValues[k].COI)
          }

          this.setState({
            COI: COI,
            gotImageCOI:false
          })
        });

        async function main() {
          var formValues = [];
          $("#imageLoader").show();
          for (var j = 0; j < COI.length; j++) {
            var config = await getConfig();
            var s3url = await s3upload(COI[j].fileInfo, config, this);
            const formValue = {
              "COI": s3url,
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
              .post('/api/projectsettings/getS3Details/S3')
              .then((response) => {
                const config = {
                  bucketName: response.data.bucket,
                  dirName: process.env.REACT_APP_ENVIRONMENT,
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
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190, 110]) !== -1 ||
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
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 90)) && (e.keyCode < 96)) {
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
  componentWillReceiveProps(nextProps) {
    this.edit();
    this.handleChange = this.handleChange.bind(this);
  }
  admin(event) {
    event.preventDefault();
    this.props.history.push('/adminDashboard');
  }
  edit() {
    var entityID = this.state.entityID;
    if (entityID  && entityID !== '') {
      axios.get('/api/entitymaster/get/one/' + entityID)
        .then((response) => {
          this.setState({
            "entityID": this.props.match.params.entityID,
            "entityType": response.data[0].entityType,
            "companyName": response.data[0].companyName,
            "groupName": response.data[0].groupName,
            "website": response.data[0].website,
            "companyPhone": response.data[0].companyPhone,
            "companyEmail": response.data[0].companyEmail,
            "CIN": response.data[0].CIN,
            "COI": response.data[0].COI,
            "TAN": response.data[0].TAN,
            "companyLogo": response.data[0].companyLogo,
            "userID": response.data[0].ID,
            "createdBy": localStorage.getItem("user_ID")
          })
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
          companyPhoneAvailable: this.state.companyPhone === "+" || this.state.companyPhone.length<12 ? false : true
        },()=>{
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
      companyLogo: companyLogo,
      gotImagecompanyLogo : false
    })
  }
  deleteDoc(event) {
    event.preventDefault();
    var COI = this.state.COI;
    const index = COI.indexOf(event.target.id);
    if (index > -1) {
      COI.splice(index, 1);
    }
    this.setState({
      COI: COI,
      gotImageCOI: false

    })
  }
  getFileDetails(fileName){
     axios
      .get(this.state.fileDetailUrl+fileName)
      .then((response)=> {
        console.log("Bulk response",response);
      $('.fullpageloader').hide();  
      if (response) {
        this.setState({
            fileDetails         : response.data,
            failedRecordsCount  : response.data.failedRecords.length,
            goodDataCount       : response.data.goodrecords.length
        });
          console.log("response.data.goodrecords----",response.data.goodrecords);
          var tableData = response.data.goodrecords.map((a, i)=>{
            console.log("a.role///// ",a.role );
            return{
                
                "entityType": a.entityType ? a.entityType : '-',
                "companyName": a.companyName ? a.companyName : '-',
                "groupName": a.groupName ? a.groupName : '-',
                "website": a.website ? a.website : '-',
                "companyPhone": a.companyPhone ? a.companyPhone : '-',
                "companyEmail": a.companyEmail ? a.companyEmail : '-',
                "CIN": a.CIN ? a.CIN : '-',
                "COI": a.COI ? a.COI : '-',
                "TAN": a.TAN ? a.TAN : "-",
                // "role": a.contactPersons[i].role ? a.contactPersons[i].role : "-",
            }
          })

          var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
          return{
                
                "entityType": a.entityType ? a.entityType : '-',
                "companyName": a.companyName ? a.companyName : '-',
                "groupName": a.groupName ? a.groupName : '-',
                "website": a.website ? a.website : '-',
                "companyPhone": a.companyPhone ? a.companyPhone : '-',
                "companyEmail": a.companyEmail ? a.companyEmail : '-',
                "CIN": a.CIN ? a.CIN : '-',
                "COI": a.COI ? a.COI : '-',
                "TAN": a.TAN ? a.TAN : "-",
                 // "role": a.contactPersons[i].role ? a.contactPersons[i].role : "-",
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
  


  render() {
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        {
          this.state.pathname ?
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                <section className="content">
                  <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                      {
                        this.state.pathname !== "appCompany" ?
                        <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">{this.state.pathname ? this.state.pathname : "Entity"} Master</h4>
                        :
                        <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Organization Settings</h4>
                      }
                    </div>
                     <ul className="nav tabNav nav-pills col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right">
                      <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill" href="#manual">Manual</a></li>
                      <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center"><a data-toggle="pill" href="#bulk">Bulk Upload</a></li>
                   </ul>
                    <section className="Content" >
                      <div className="row tab-content">
                        <div id="manual" className="tab-pane fade in active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
                          <section className="Content">
              <div className="tab-pane fade in active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding" id="manual">
                {!this.props.modal ?
                  <div className="nav-center OnboardingTabs col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <ul className="nav nav-pills vendorpills col-lg-10 col-lg-offset-1 col-md-12  col-sm-12 col-xs-12">
                      <li className="active col-lg-3 col-md-3 col-sm-12 col-xs-12 pdcls pdclsOne btn1 NOpadding-left">
                        <a href={this.props.match.params.entityID ? "/"+this.props.entity+"/basic-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/basic-details"} className="basic-info-pillss pills">
                          <i className="fa fa-info-circle" aria-hidden="true"></i> &nbsp;
                          Basic Info
                        </a>
                        <div className="triangleone triangleones" id="triangle-right"></div>
                      </li>
                      <li className="col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn2 disabled">
                        <div className="triangletwo" id="triangle-right1"></div>
                        <a href={this.props.match.params.entityID ? "/"+this.props.entity+"/department-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/department-details" } className="basic-info-pillss backcolor">
                          <i className="fa fa-map-marker iconMarginLeft" aria-hidden="true"></i> &nbsp;
                          Departments
                        </a>
                        <div className="trianglethree forActive" id="triangle-right"></div>
                      </li>
                      <li className="col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn2 disabled">
                        <div className="triangletwo" id="triangle-right1"></div>
                        <a href={this.props.match.params.entityID ? "/"+this.props.entity+"/location-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/location-details" } className="basic-info-pillss backcolor">
                          <i className="fa fa-map-marker iconMarginLeft" aria-hidden="true"></i> &nbsp;
                          Locations
                        </a>
                        <div className="trianglethree forActive" id="triangle-right"></div>
                      </li>
                      <li className="col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab noRightPadding pdcls btn4 disabled">
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
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
                  <form id="BasicInfo">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                      <div className="col-lg-12 col-md-12 col-sm-12 supplierForm">
                        <div className="col-lg-12 col-md-12 col-sm-12">
                          <br />
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls NOpadding-left NOpadding-right">
                            
                            <div className="form-margin col-lg-9 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                              <div className=" col-lg-8 col-md-6 col-sm-12 col-xs-12">
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Company Name<i className="astrick">*</i></label>
                                <input type="text" id="companyName" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.companyName} ref="companyName" name="companyName" onChange={this.handleChange} />
                              </div>
                              <div className=" col-lg-4 col-md-3 col-sm-12 col-xs-12">
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Group / Brand Name<i className="astrick">*</i></label>
                                <input type="text" id="groupName" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.groupName} ref="groupName" name="groupName" onChange={this.handleChange} required />
                              </div>
                              
                              
                            </div>

                            <div className="form-margin col-lg-3 col-md-3 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding ">
                                <div className="col-lg-12 col-md-3 col-sm-12 col-xs-12">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding " id="hide">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 uploadImageClient" id="LogoImageUpOne" title="Upload Image">
                                      <div><i className="fa fa-camera"></i></div>
                                      <input multiple onChange={this.imgBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="companyLogo" />
                                    </div>
                                  </div>
                                </div>
                                
                              </div>  
                            </div>


                            <div className="form-margin col-lg-9 col-md-9 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                              
                              <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Email<i className="astrick">*</i></label>
                                <input  type="email" id="companyEmail" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.companyEmail} ref="companyEmail" name="companyEmail" onChange={this.handleChange} required />
                              </div>

                             <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                <label className="labelform  NOpadding-left">Company Number<i className="astrick">*</i></label>
                                <PhoneInput
                                  country={'in'}
                                  value={this.state.companyPhone}
                                  name="companyPhone"
                                  inputProps={{
                                    name: 'companyPhone',
                                    required: true
                                  }}
                                  onChange={this.changeMobile.bind(this)}
                                />

                                {this.state.companyPhoneAvailable === true ? null : <label className="error">Please enter valid number</label>}
                                
                              </div>                                     
                            
                              <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Website
                                  <a href="#" data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="Eg. www.abc.xyz" className="fa fa-question-circle"></i> </a>
                                </label>
                                <input type="text" id="website" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onKeyDown={this.keyPressWeb} value={this.state.website} ref="website" name="website" onChange={this.handleChange} />
                              </div>
                              
                             
                            </div>
                            <div className="form-margin col-lg-3 col-md-3 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                              {
                                  this.state.companyLogo && this.state.companyLogo.length > 0 ?
                                    this.state.companyLogo.map((logo, i) => {
                                      return (
                                        <div key={i} className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                          <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" title="Delete Logo" style={{'right':'-20px'}} id={logo} onClick={this.deleteLogo.bind(this)}>x</label>
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos1" id="LogoImageUpOne">
                                            <img src={logo} alt={"companyLogo"+i} className="img-responsive logoStyle" />
                                          </div>
                                        </div>
                                      </div>
                                      );
                                    })
                                    :
                                    ( this.state.gotImagecompanyLogo ?
                                          <div className="col-lg-12 col-md-2 col-sm-12 col-xs-12 nopadding CustomImageUploadBIProfile">
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos1" id="profilePhoto">
                                                      <img src="/images/loading.gif" className="img-responsive logoStyle"/>
                                                </div>
                                            </div>
                                          </div>
                                :
                                null)
                                                                         
                                }
                            </div>
                          </div>
                        </div>
                        <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls ">
                        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 panerror" >
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">{this.props.modal ? "TAN": "Tax Deduction Account Number"}
                                  <a href="#" data-tip data-for='basicInfo2Tooltip' className="pull-right"> <i title="Eg. NGPO02911G" className="fa fa-question-circle"></i> </a>
                                </label>
                                <input maxLength="10" type="text" id="TAN" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText UpperCase" value={this.state.TAN} ref="TAN" name="TAN" onChange={this.handleChange} placeholder="NGPO02911G" />
                              </div>
                          <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12" >
                            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">{this.props.modal ?"CIN" :"Corporate Identification Number"}
                              <a href="#" data-tip data-for='basicInfo7Tooltip' className="pull-right"> <i title="Eg. L12345MH2019PTC123456" className="fa fa-question-circle"></i> </a>
                            </label>
                            <input type="text" id="CIN" maxLength="21" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 UpperCase inputText" placeholder="L12345MH2019PTC123456" value={this.state.CIN} ref="CIN" name="CIN" onChange={this.handleChange} />
                          </div>
                          <div className="col-lg-5 col-md-4 col-sm-12 col-xs-12 NOpadding ">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Add COI Document (jpg, jpeg, png, pdf)</label>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos1" id="LogoImageUpOne">
                                  <div><i className="fa fa-upload"></i> <br /></div>
                                  <input multiple onChange={this.docBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="COI" />
                                </div>
                              </div>
                            </div>
                            {
                              this.state.COI && this.state.COI.length > 0 ?
                                this.state.COI.map((doc, i) => {
                                  if(('extension',doc.substring(doc.lastIndexOf("."))) === '.pdf'){
                                    return (
                                      <div key={i} className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                          <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" title="Delete Document" id={doc} onClick={this.deleteDoc.bind(this)}>x</label>
                                          <div title={(doc.substring(doc.lastIndexOf("/"))).replace('/', "")} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos1 " id="LogoImageUpOne">
                                            <img src={'/images/pdf.png'} alt={"coi"+i} className="img-responsive logoStyle" />
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }else{
                                    return (
                                      <div key={i} className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                          <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" title="Delete Document" id={doc} onClick={this.deleteDoc.bind(this)}>x</label>
                                          <div title={(doc.substring(doc.lastIndexOf("/"))).replace('/', "")} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos1" id="LogoImageUpOne">
                                            <img src={doc} alt={"coi"+i} className="img-responsive logoStyle" />
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                })
                                :
                                ( this.state.gotImageCOI  ?
                                  <div className="col-lg-12 col-md-2 col-sm-12 col-xs-12 nopadding CustomImageUploadBILoading">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding " id="hide">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos1" id="LogoImageUpOne">
                                              <img src="/images/loading.gif" className="img-responsive logoStyle"/>
                                        </div>
                                    </div>
                                  </div>
                                :
                                null)
                            }
                          </div>
                      
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                          <button className="btn button3 pull-right" onClick={this.SubmitBasicInfo.bind(this)} >{this.props.modal? "Submit" : "Save & Next"}{!this.props.modal && <i className="fa fa-angle-double-right" aria-hidden="true"></i>}</button>
                        </div>
                      </div>
                    </div>

                  </form>
                </div>
                
              </div>
            </section>

                        </div>

                        <div id="bulk" className="tab-pane fade in col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerForm">
                            <BulkUpload url="/api/entitymaster/bulkUploadEntity"
                                data={{ "type": "client", "createdBy": localStorage.getItem("user_ID") }}
                                uploadedData={this.uploadedData}
                                fileurl="https://prodsta.s3.ap-south-1.amazonaws.com/EntityBulk.xlsx"
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
                      {/*<div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                          <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getDepartment.bind(this)}>&times;</button>
                     </div>*/}
                    </div>
                   
                 </div>
                </div>
              </div>
               <div className="modal" id="designationModalId" role="dialog">
                <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                    <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                     {/* <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                          <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getDesignation.bind(this)}>&times;</button>
                     </div>*/}
                    </div>
                   
                 </div>
                </div>
              </div>
              <div className="modal" id="vehicleModalId" role="dialog">
                <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                    <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                     {/* <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                          <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getVehicles.bind(this)}>&times;</button>
                     </div>*/}
                    </div>
                   
                 </div>
                </div>
              </div>
      </div>
    );
  }
}
export default withRouter(BasicInfo);