import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import S3FileUpload from 'react-s3';
import PhoneInput from 'react-phone-input-2';
import _ from 'underscore';
import 'bootstrap/js/tab.js';
import '../css/SupplierOnboardingForm.css';
import 'react-phone-input-2/lib/style.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "pathname": this.props.match.params.entity,
      "companyLogo": [],
      "COI": []
    };

    this.handleChange = this.handleChange.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.supplier = this.supplier.bind(this);
  }
  componentDidMount() {
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

    $.validator.addMethod("regxA2", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter a valid TAN Number.");

    $.validator.addMethod("regxA4", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "It should be www.abcd.com");
    $.validator.addMethod("regxEmail", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter a valid email address.");
    $.validator.addMethod("regxA8", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter the valid CIN");

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
        TAN: {
          required: true,
          regxA2: /^[A-Za-z]{4}[0-9]{5}[A-Za-z]$/,
        },
        website: {
          required: true,
          regxA4: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/,
        },
        companyEmail: {
          required: true,
          regxEmail: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        },
        CIN: {
          required: true,
          regxA8: /^([L|U]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/,
        },
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") == "companyName") {
          error.insertAfter("#companyName");
        }
        if (element.attr("name") == "groupName") {
          error.insertAfter("#groupName");
        }
        if (element.attr("name") == "companyEmail") {
          error.insertAfter("#companyEmail");
        }
        if (element.attr("name") == "TAN") {
          error.insertAfter("#TAN");
        }
        if (element.attr("name") == "website") {
          error.insertAfter("#website");
        }
        if (element.attr("name") == "CIN") {
          error.insertAfter("#CIN");
        }
      }
    });
    console.log('vendorID', this.props.vendorID)
  }
  componentWillReceiveProps(nextProps) {
    console.log('vendorID', nextProps.vendorID);
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
      if (percentVal == 100) {
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
      if (percentVal == 100) {
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
    });
  }
  handleOptionChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: event.target.value
    });
  }
  supplier(event) {
    event.preventDefault();
    console.log('vendorID', this.props.vendorID, $('#BasicInfo').valid());
    if ($('#BasicInfo').valid()) {
      var userDetails = {
        firstname: this.state.companyName,
        lastname: this.state.companyName,
        mobile: this.state.companyPhone,
        email: this.state.companyEmail,
        pwd: "fivebees123",
        role: this.state.pathname,
        status: 'active',
        "emailSubject": "Email Verification",
        "emailContent": "As part of our registration process, we screen every new profile to ensure its credibility by validating email provided by user. While screening the profile, we verify that details put in by user are correct and genuine.",
      }

      if (this.props.match.params.entityID) {
        var formValues = {
          "supplierOf": this.props.vendorID ? this.props.vendorID : localStorage.getItem("user_ID"),
          "entityID": this.props.match.params.entityID,
          "entityType": this.state.pathname,
          "companyName": this.state.companyName,
          "groupName": this.state.groupName,
          "website": this.state.website,
          "companyPhone": this.state.companyPhone,
          "companyEmail": this.state.companyEmail,
          "CIN": this.state.CIN.toUpperCase(),
          "COI": this.state.COI,
          "TAN": this.state.TAN.toUpperCase(),
          "companyLogo": this.state.companyLogo,
          "userID": this.state.userID,
          "createdBy": localStorage.getItem("user_ID")
        }
        axios.post('/api/entitymaster/post', formValues)
          .then((response) => {
            swal(this.state.pathname + " updated successfully.");
            this.props.history.push('/' + this.state.pathname + '/department/' + this.props.match.params.entityID)
          })
          .catch((error) => {

          })
      } else {

        axios.post('/api/auth/post/signup/user', userDetails)
          .then((response) => {

            var formValues = {
              "entityID": this.props.match.params.entityID,
              "supplierOf": this.props.vendorID ? this.props.vendorID : localStorage.getItem("user_ID"),
              "entityType": this.state.pathname,
              "companyName": this.state.companyName,
              "groupName": this.state.groupName,
              "website": this.state.website,
              "companyPhone": this.state.companyPhone,
              "companyEmail": this.state.companyEmail,
              "CIN": this.state.CIN.toUpperCase(),
              "COI": this.state.COI,
              "TAN": this.state.TAN.toUpperCase(),
              "companyLogo": this.state.companyLogo,
              "userID": response.data.ID,
              "createdBy": localStorage.getItem("user_ID")
            }

            axios.post('/api/entitymaster/post', formValues)
              .then((response) => {
                swal(this.state.pathname + " created successfully.");
                this.props.history.push('/' + this.state.pathname + '/department/' + response.data.entityID)
              })
              .catch((error) => {

              })
          })
          .catch((error) => {

          })
      }
    } else {
      $(event.target).parent().parent().find('.inputText.error:first').focus();
      this.setState({
        companyPhoneError: 'This field is required.'
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
                console.log("response",response);
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
    var COI = [];
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      for (var i = 0; i < event.currentTarget.files.length; i++) {
        var file = event.currentTarget.files[i];

        if (file) {
          var fileName = file.name;
          var ext = fileName.split('.').pop();
          if (ext === "jpg" || ext === "png" || ext === "pdf" || ext === "jpeg" || ext === "JPG" || ext === "PNG" || ext === "JPEG" || ext === "PDF") {
            if (file) {
              var objTitle = { fileInfo: file }
              COI.push(objTitle);

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
          var COI = this.state.COI;
          for (var k = 0; k < formValues.length; k++) {
            COI.push(formValues[k].COI)
          }

          this.setState({
            COI: COI
          })
        });

        async function main() {
          var formValues = [];
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
    if (entityID != '') {
      axios.get('/api/entitymaster/get/one/' + entityID)
        .then((response) => {
          this.setState({
            "entityID": this.props.match.params.entityID,
            "entityType": response.data.pathname,
            "companyName": response.data.companyName,
            "groupName": response.data.groupName,
            "website": response.data.website,
            "companyPhone": response.data.companyPhone,
            "companyEmail": response.data.companyEmail,
            "CIN": response.data.CIN,
            "COI": response.data.COI,
            "TAN": response.data.TAN,
            "companyLogo": response.data.companyLogo,
            "userID": response.data.ID,
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
          companyPhoneError: this.state.companyPhone == "+" ? 'Please enter valid mobile number.' : ""
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
    var COI = this.state.COI;
    const index = COI.indexOf(event.target.id);
    if (index > -1) {
      COI.splice(index, 1);
    }
    this.setState({
      COI: COI
    })
  }
  render() {
    console.log('companyLogo', this.state.companyLogo)
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
            <section className="content">
              <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                  <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">{this.state.pathname ? this.state.pathname : "Entity"} Master</h4>
                </div>

                <div className="nav-center OnboardingTabs col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <ul className="nav nav-pills vendorpills col-lg-8 col-lg-offset-2 col-md-12  col-sm-12 col-xs-12">
                    <li className="active col-lg-3 col-md-3 col-sm-12 col-xs-12 pdcls pdclsOne btn1 NOpadding-left">
                      <a href="" className="basic-info-pillss pills">
                        <i className="fa fa-info-circle" aria-hidden="true"></i> &nbsp;
                        Basic Info
                      </a>
                      <div className="triangleone triangleones" id="triangle-right"></div>
                    </li>
                    <li className="col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn2 disabled">
                      <div className="triangletwo" id="triangle-right1"></div>
                      <a href="/client/department" className="basic-info-pillss backcolor">
                        <i className="fa fa-map-marker iconMarginLeft" aria-hidden="true"></i> &nbsp;
                        Department
                      </a>
                      <div className="trianglethree forActive" id="triangle-right"></div>
                    </li>
                    <li className="col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn2 disabled">
                      <div className="triangletwo" id="triangle-right1"></div>
                      <a href="/client/location-details" className="basic-info-pillss backcolor">
                        <i className="fa fa-map-marker iconMarginLeft" aria-hidden="true"></i> &nbsp;
                        Location
                      </a>
                      <div className="trianglethree forActive" id="triangle-right"></div>
                    </li>
                    <li className="col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab noRightPadding pdcls btn4 disabled">
                      <div className="trianglesix" id="triangle-right2"></div>
                      <a href="/client/contact-details" className="basic-info-pillss backcolor">
                        <i className="fa fa-phone phoneIcon" aria-hidden="true"></i> &nbsp;
                        Contact
</a>
                    </li>
                  </ul>
                </div>
                <section className="Content">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
                      <form id="BasicInfo">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                          <div className="col-lg-12 col-md-12 col-sm-12 supplierForm">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                              <br />
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls NOpadding-left NOpadding-right">
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Company Name <i className="astrick">*</i></label>
                                    <input type="text" id="companyName" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.companyName} ref="companyName" name="companyName" onChange={this.handleChange} />
                                  </div>
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Group Name <i className="astrick">*</i></label>
                                    <input type="text" id="groupName" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.groupName} ref="groupName" name="groupName" onChange={this.handleChange} required />
                                  </div>
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Company Email <i className="astrick">*</i></label>
                                    <input disabled={this.props.match.params.entityID ? true : false} type="email" id="companyEmail" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.companyEmail} ref="companyEmail" name="companyEmail" onChange={this.handleChange} required />
                                  </div>
                                </div>
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                                  <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                    <label className="labelform  NOpadding-left">Company Number <i className="astrick">*</i></label>
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
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Website <i className="astrick">*</i>
                                      <a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="Eg. www.abc.xyz" className="fa fa-question-circle"></i> </a>
                                    </label>
                                    <input type="text" id="website" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onKeyDown={this.keyPressWeb} value={this.state.website} ref="website" name="website" onChange={this.handleChange} required />
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 panerror" >
                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">TAN (Tax Deduction Account Number)<i className="astrick">*</i>
                                      <a data-tip data-for='basicInfo2Tooltip' className="pull-right"> <i title="Eg. NGPO02911G" className="fa fa-question-circle"></i> </a>
                                    </label>
                                    <input maxLength="10" type="text" id="TAN" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText UpperCase" value={this.state.TAN} ref="TAN" name="TAN" onChange={this.handleChange} placeholder="NGPO02911G" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls ">
                              <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">CIN (Corporate Identification Number)<i className="astrick">*</i>
                                  <a data-tip data-for='basicInfo7Tooltip' className="pull-right"> <i title="Eg. L12345MH2019PTC123456" className="fa fa-question-circle"></i> </a>
                                </label>
                                <input type="text" id="CIN" maxLength="21" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 UpperCase inputText" placeholder="L12345MH2019PTC123456" value={this.state.CIN} ref="CIN" name="CIN" onChange={this.handleChange} />
                              </div>
                              <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 NOpadding ">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Add COI Document (jpg, jpeg, png, pdf)</label>
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                      <div><i className="fa fa-upload"></i> <br /></div>
                                      <input multiple onChange={this.docBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="COI" />
                                    </div>
                                  </div>
                                </div>
                                {
                                  this.state.COI && this.state.COI.length > 0 ?
                                    this.state.COI.map((doc, i) => {
                                      return (
                                        <div key={i} className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                            <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={doc} onClick={this.deleteDoc.bind(this)}>x</label>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                              <img src={doc} className="img-responsive logoStyle" />
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })
                                    :
                                    null
                                }
                              </div>
                              <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 NOpadding ">
                            <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Add Logo (jpg, jpeg, png)</label>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                  <div><i className="fa fa-upload"></i> <br /></div>
                                  <input multiple onChange={this.imgBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="companyLogo" />
                                </div>
                              </div>
                            </div>
                            {
                              this.state.companyLogo && this.state.companyLogo.length > 0 ?
                                this.state.companyLogo.map((logo, i) => {
                                  return (
                                    <div key={i} className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                        <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={logo} onClick={this.deleteLogo.bind(this)}>x</label>
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                          <img src={logo} className="img-responsive logoStyle" />
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
                              <button className="btn button3 pull-right" onClick={this.supplier.bind(this)} >Save & Next&nbsp;<i className="fa fa-angle-double-right" aria-hidden="true"></i></button>
                            </div>
                          </div>
                        </div>

                      </form>
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
const mapStateToProps = (state) => {
  return {
    vendorID: state.vendorID,
    vendorLocationID: state.vendorLocationID
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    vendor: (vendorID, vendorLocationID) => dispatch({
      type: 'VENDOR',
      vendorID: vendorID,
      vendorLocationID: vendorLocationID
    }),
  }
}
export default BasicInfo