
import PhoneInput from 'react-phone-input-2';
import React, { Component } from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/js/modal.js';
import './userManagement.css';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

const formValid = formerrors => {
  let valid = true;
  Object.values(formerrors).forEach(val => {
    val.length > 0 && (valid = false);
  })
  return valid;
}

const nameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const mobileRegex = RegExp(/^[0-9][0-9]{9}$/);
const emailRegex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
class CreateUser extends Component {


  constructor(props) {
    super(props);
    this.state = {
      show: true,
      office: null,
      allPosts: null,
      gmapsLoaded: false,
      firstname: "",
      lastname: "",
      signupEmail: "",
      mobile: "",
      companyName: "",
      role: "-- Select --",
      department: "-- Select --",
      designation: "-- Select --",
      cityName: "",
      states: "",
      formValues: "",
      adminRolesListData: [],

      formerrors: {
        firstname: "",
        companyID: "",
        lastname: "",
        signupEmail: "",
        mobile: "",
        role: "",
      },
      'buttonType': 'Register User'
    };
    this.handleChange = this.handleChange.bind(this);
  }

  initMap = () => {
      this.setState({
        gmapsLoaded: true,
      })
    }

  handleChange(event) {
    const datatype = event.target.getAttribute('data-text');
    const target = event.target;
    const name   = target.name;
    const value  = target.value;
    if(name==='role'){
      var e = document.getElementById("role");
      var rolesentityname = e.options[e.selectedIndex].id;
      console.log("rolesentityname==>",rolesentityname);
      this.setState({
        rolesentityname: rolesentityname
      })
    }
    let formerrors = this.state.formerrors;
    this.setState({[name]:event.target.value},()=>{if(name=='companyID'){
      axios.get('/api/entitymaster/get/one/companyName/' + this.state.companyID)
      .then((response) => {
        var companyName = response.data.companyName;
        if (companyName == null) {
          this.setState({
            companyName: "No Company Available"
          })
        } else {
          this.setState({
            companyName: companyName
          })
        }

      }).catch(function (error) { });
    }})
    switch (datatype) {
      case 'firstname':
        formerrors.firstname = nameRegex.test(value) && value.length > 0 ? '' : "Please Enter Valid Name";
        break;

      case 'lastname':
        formerrors.lastname = nameRegex.test(value) && value.length > 0 ? '' : "Please Enter Valid Name";
        break;

      case 'mobile':
        formerrors.mobile = mobileRegex.test(value) && value.length > 0 ? '' : "Please enter a valid Contact Number";
        break;

      case 'signupEmail':
        formerrors.signupEmail = emailRegex.test(value) && value.length > 0 ? "" : "Please enter a valid Email ID";
        break;

      case 'role':
        formerrors.role = value !== "--select--" ? "" : "Please select role";
        break;

      case 'department':
        formerrors.department = value !== "--select--" ? "" : "Please select department";
        break;

      case 'designation':
        formerrors.designation = value !== "--select--" ? "" : "Please select designation";
        break;

      case 'city':
        formerrors.city = value !== "--select--" ? "" : "Please select city";
        break;

      case 'state':
        formerrors.state = value !== "--select--" ? "" : "Please select state";
        break;

      case 'centerName':
        formerrors.role = value !== "--select--" ? "" : "Please select Center";
        break;

      default:
        break;

    }

    this.setState({
      formerrors,
      [name]: value
    });
  }
  validation() {
    $.validator.addMethod("regxA1", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid first name");
    $.validator.addMethod("regxA2", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid last name");
    $.validator.addMethod("regxEmail", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid email ID");

    $.validator.addMethod("regxmobile", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid mobile number");

    $.validator.addMethod("regxcompanyID", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid company ID");

    $.validator.addMethod("regxRole", function (value, element, arg) {
      return arg !== value;
    }, "Please select the role");

    $.validator.addMethod("regxdesignation", function (value, element, arg) {
      return arg !== value;
    }, "Please select the Designation");


    $.validator.addMethod("regxdepartment", function (value, element, arg) {
      return arg !== value;
    }, "Please select the Department");


    $.validator.addMethod("regxcity", function (value, element, arg) {
      return arg !== value;
    }, "Please select the City");

    $.validator.addMethod("regxstate", function (value, element, arg) {
      return arg !== value;
    }, "Please select the state");


    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    $("#userInfo").validate({
      rules: {
        firstname: {
          required: true,
          regxA1: /^[A-Za-z][A-Za-z0-9\-\s]/,
        },
        lastname: {
          required: true,
          regxA2: /^[A-Za-z][A-Za-z0-9\-\s]/,
        },
        signupEmail: {
          required: true,
          regxEmail: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        },
        mobile: {
          required: true,
          regxmobile: /^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/,
        },

        companyID: {
          required: true,
          regxcompanyID: /[a-zA-Z0-9]/,
        },
        role: {
          required: true,
          regxRole: "--Select--"
        },
        department: {
          required: true,
          regxdepartment: "--Select--"
        },
        designation: {
          required: true,
          regxdesignation: "--Select--"
        },
        city: {
          required: true,
          regxA2: /^[A-Za-z][A-Za-z0-9\-\s]/,
        },
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") === "firstname") {
          error.insertAfter("#firstname");
        }
        if (element.attr("name") === "lastname") {
          error.insertAfter("#lastname");
        }
        if (element.attr("name") === "signupEmail") {
          error.insertAfter("#signupEmail");
        }
        if (element.attr("name") === "mobile") {
          error.insertAfter("#mobile");
        }
        if (element.attr("name") === "companyID") {
          error.insertAfter("#companyID");
        }
        if (element.attr("name") === "role") {
          error.insertAfter("#role");
        }
        if (element.attr("name") === "department") {
          error.insertAfter("#department");
        }
        if (element.attr("name") === "designation") {
          error.insertAfter("#designation");
        }
        if (element.attr("name") === "city") {
          error.insertAfter("#city");
        }
      }
    });
  }
  componentDidMount() {
    window.initMap = this.initMap
    const gmapScriptEl = document.createElement(`script`)
    gmapScriptEl.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCrzFPcpBm_YD5DfBl9zJ2KwOjiRpOQ1lE&libraries=places&callback=initMap`
    document.querySelector(`body`).insertAdjacentElement(`beforeend`, gmapScriptEl)

    this.validation();
    this.getDepartment();
    this.getDesignation();
    this.getRole();
    axios.get('/api/companysettings/list')
      .then(
        (res) => {
          const postsdata = res.data;
          this.setState({
            allPosts: postsdata,
          });
          let locationArray = [];
          if (this.state.allPosts !== null) {
            locationArray = this.state.allPosts.map(function (item) { return item.companyLocationsInfo });
          } else {
            locationArray = "no data";
          }
          this.setState({
            office: locationArray,
          });

          // here for list
          var data = {
            "startRange": this.state.startRange,
            "limitRange": this.state.limitRange,
            "companyID": this.props.companyID,
          }
          this.props.getData(data);
        }
      )
      .catch((error) => {

      });

  }
  getDepartment() {
    axios.get("/api/departmentmaster/get/list")
      .then((response) => {
        console.log("departmentArray==>",response.data[0])
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
  createUser(event) {
    event.preventDefault();
    if ($('#userInfo').valid()) {
      axios.get('/api/entitymaster/get/one/companyName/' + this.state.companyID)
        .then((response) => {
          var companyName = response.data.companyName;
          this.setState({
            companyName: companyName
          })
          this.setState(() => {
            if (companyName === "No Company Available") {
              swal({
                title: "",
                text: "Company ID " + this.state.companyID + " is not valid Company ID",
              });
            } else {
              console.log('this.state.role Post==>>>', this.state.role)
              const formValues = {
                "firstname": this.state.firstname,
                "lastname": this.state.lastname,
                "email": this.state.signupEmail,
                "mobNumber": (this.state.mobile).replace("-", ""),
                "pwd": "Welcome@123",
                // "role": this.state.role !== "employee" ? ["  employee",this.state.role] : ["employee"],
                "role" :  this.state.rolesentityname === "corporate" ? 
                          this.state.role === "employee" ? ["employee"] : ["employee",this.state.role]
                          :
                          [this.state.role],

                "department": this.state.department,
                "designation": this.state.designation,
                "cityName": this.state.cityName,
                "states": this.state.states,
                "companyID": this.state.companyID,
                "companyName": companyName,
                "status": "active",
              }
              console.log('userid Post==>>>', formValues)
              if (this.state.firstname !== "" && this.state.companyName !== "" && this.state.lastname !== "" && this.state.signupEmail && this.state.mobile ) {
                axios.post('/api/auth/post/signup/user', formValues)
                  .then((res) => {
                    // console.log('userid Post==>>>', res.data.ID)
                    if (res.data.message === 'Email Id already exits.') {
                      swal({
                        title: "Please enter mandatory fields",
                        text: res.data.message,
                      });
                      this.setState({
                        show: false,
                        'buttonType': 'Register User'
                      })
                    } else {
                      var sendData = {
                        "event": "Contact Created", //Event Name
                        "toUser_id": res.data.ID, //To user_id(ref:users)
                        "toUserRole":"employee",
                        "company_id": this.state.corporate_Id, //company_id(ref:entitymaster)
                        "otherAdminRole":'corporateadmin',
                        "variables": {
                          'EmployeeName': this.state.firstname + ' ' + this.state.lastname,
                          'Password': "Welcome@123",
                          'mobileNo': this.state.mobile,
                          'email': this.state.signupEmail
                        }
                      }

                      var contactDetailspersonmaster 	= {
                          'firstName'       : this.state.firstname,
                          'lastName'        : this.state.lastname,
                          'contactNo'       : (this.state.mobile).replace("-", ""),
                          'phone'           : (this.state.mobile).replace("-", ""),
                          'email'           : this.state.signupEmail,
                          "departmentName"  : this.state.department,
                          "designationName" : this.state.designation,
                          "cityName"        : this.state.cityName,
                          "states"          : this.state.states,
                          "companyID"       : this.state.companyID,
                          "companyName"     : companyName,
                          "type"            : this.state.rolesentityname === "corporate" ? 
                                              "employee": null ||
                                              this.state.rolesentityname === "vendor" ? 
                                              "driver": null,
                          "userId"          : res.data.ID,
                        }
                      axios.post('/api/masternotifications/post/sendNotification', sendData)
                        .then((res) => {
                          // console.log('sendDataToUser in result==>>>', res.data.type)
                        })
                        .catch((error) => { console.log('notification error: ', error) })
                        if(contactDetailspersonmaster.type == "driver" || "employee" || "guest"){
                          axios.post('/api/personmaster/post' ,contactDetailspersonmaster)
                          .then((response) => {
                            console.log('in result Res data==>>>', response.data)
                          })
                          .catch((error) => {})
                        }
                        
                      swal(" ", "User added successfully! \n Email Id: "+this.state.signupEmail+"\n Default Password: "+"Welcome@123");
                      var data = {
                        "startRange": this.state.startRange,
                        "limitRange": this.state.limitRange,
                        "companyID": this.props.companyID,
                      }
                      this.props.getData(data);
                      this.setState({
                        firstname: "",
                        lastname: "",
                        companyID: "",
                        signupEmail: "",
                        mobile: "",
                        role: "",
                        centerName: "",
                        department: "",
                        designation: "",
                        cityName: "",
                        states: "",
                        companyName: "",
                        show: false,
                        'buttonType': 'Register User'
                      }, () => {
                        var data = {
                          "startRange": this.state.startRange,
                          "limitRange": this.state.limitRange,
                          "companyID": this.props.companyID,
                        }
                        this.props.getData(data);
                        var modal = document.getElementById("CreateUserModal");
                        modal.style.display = "none";
                        $('.modal-backdrop').remove();
                        

                      })
                    }
                  })
                  .catch((error) => {
                    this.setState({ show: false })
                  });

              } else {
                swal({
                  title: "Please enter mandatory fields",
                  text: "Please enter mandatory fields",
                });
              }
            }
          })
        }).catch(function (error) { });
    }
  }
  companynamewithid() {
    // console.log(" this.state.companyID==>>", this.state.companyID)
    axios.get('/api/entitymaster/get/one/companyName/' + this.state.companyID)
      .then((response) => {
        var companyName = response.data.companyName;
        this.setState({
          companyName: companyName
        })
      }).catch(function (error) { });
  }
  // getRole() {
  //   // var data = {
  //   //   "startRange": this.state.starFtRange,
  //   //   "limitRange": this.state.limitRange,
  //   // }
  //   axios.post('/api/roles/get/list')
  //     .then((response) => {
  //       console.log("response.data==>",response.data)
  //       const key = 'role';
	// 			// const arrayUniqueByKey = [...new Map(response.data.map(item =>
	// 			// [item[key], item])).values()];
  //       this.setState({
  //         adminRolesListData: response.data
  //       }, () => {
  //       })
  //     }).catch(function (error) {
  //     });
  // }
  getRole() {
		axios.post('/api/roles/get/list')
		  .then((response) => {
        console.log("response from role =>",response.data[0].rolesentity)
        this.setState({
          adminRolesListData: response.data
        })
			// var fileName = 'admin'
			// axios.get('/api/rolesentitymaster/get/filedetails/'+fileName)
			// .then((response) => {
      //   console.log("response from role =>",response.data)
			// 	var rolecor = response.data[0]._id
			// 	axios.get('/api/roles/get/rolelist/'+rolecor)
			// 		.then((response) => {
			// 			this.setState({
			// 				adminRolesListData: response.data
			// 			  }, () => {
			// 			  })
			// 		}).catch(function (error) {});
			// }).catch(function (error) {});
			
		  }).catch(function (error) {
		  });
	}
  handleChangePlaces = address => {
    var array = {
      cityName: address,
    }
    this.setState({ cityName: address, tripArray: array });
  };
  handleSelectLocation = address => {
    console.log(address)
    geocodeByAddress(address)
      .then((results) => {

        for (var i = 0; i < results[0].address_components.length; i++) {
          for (var b = 0; b < results[0].address_components[i].types.length; b++) {
            switch (results[0].address_components[i].types[b]) {
              case 'sublocality_level_1':
                var area = results[0].address_components[i].long_name;
                break;
              case 'sublocality_level_2':
                var area = results[0].address_components[i].long_name;
                break;
              case 'locality':
                var city = results[0].address_components[i].long_name;
                break;
              case 'administrative_area_level_1':
                var state = results[0].address_components[i].long_name;
                break;
            }
          }
        }
        console.log("state===>>>>", state)
        this.setState({ states: state })
      })
      .catch(error => console.error('Error', error));
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({ 'fromLatLng': latLng }))
      .catch(error => console.error('Error', error));
    var array = {
      cityName: address,
    }
    console.log("address===>>>>", address)
    this.setState({ 
      cityName: address ? address.split(",")[0] : "", 
      tripArray: array });
  };

  camelCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  close(event) {
    this.setState({
      firstname: "",
      lastname: "",
      signupEmail: "",
      mobile: "",
      role: "",
    });
    var modal = document.getElementById("CreateUserModal");
    modal.style.display = "none";
    $('.modal-backdrop').remove();
    $("#userInfo").validate().resetForm();

  }
  render() {
    const searchOptions = {
      types: ['(cities)'],
      componentRestrictions: { country: "in" }
    }
    const { formerrors } = this.state;
    return (
      <div>
        <div className="modal" id="CreateUserModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg " role="document">
            <div className="modal-content UMmodalContent ummodallftmg ummodalmfdrt  ">
              <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button type="button" onClick={this.close.bind(this)} className="close " data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title row userTitle" id="exampleModalLabel">Add New User</h4>
              </div>
              <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="hideModal">
                  <div className="userBox-body">
                    <div className="">
                      <form id="userInfo">
                        <div className="">
                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box ">
                            <label>First Name <span className="requiredsign">*</span></label>
                            <input type="text" style={{ textTransform: 'capitalize' }}
                              className="form-control UMname has-content"
                              id="firstname" ref="firstname" name="firstname" data-text="firstname" placeholder="First Name" onChange={this.handleChange}
                              value={this.state.firstname} />
                          </div>
                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
                            <label>Last Name <span className="requiredsign">*</span></label>
                            <input type="text" className="form-control UMname  has-content"
                              id="lastname" ref="lastname" name="lastname" data-text="lastname" onChange={this.handleChange}
                              value={this.state.lastname} placeholder="Last Name" />
                          </div>
                        </div>
                        <div className="valid_box">
                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
                            <label >Email ID <span className="requiredsign">*</span></label>
                            <input type="text" className="formFloatingLabels form-control  newinputbox" ref="signupEmail" name="signupEmail" id="signupEmail" data-text="signupEmail" onChange={this.handleChange} value={this.state.signupEmail}
                              placeholder="Email" />
                          </div>
                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
                            <label >Mobile Number <span className="requiredsign">*</span></label>
                            <input type="number"  required pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" className="formFloatingLabels form-control  newinputbox" ref="mobile" name="mobile" id="mobile" data-text="mobile" onChange={this.handleChange} value={this.state.mobile}
                              placeholder="Mobile Number" />
                          </div>
                        </div>
                        <div className="valid_box">
                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box " >
                            <label >Role <span className="requiredsign">*</span></label>
                            <div className="input-group col-lg-12 col-md-12 col-xs-12 col-sm-12" >

                              <select ref="role" name="role"
                                      value={this.state.role}  id="role" onChange={this.handleChange.bind(this)}
                                       className="form-control">
                                        <option hidden>--Select--</option>
                                         {
                                          this.state.adminRolesListData && this.state.adminRolesListData.length > 0 ?
                                          this.state.adminRolesListData.map((roledata, index)=>{
                                            return(      
                                                <option key={index} id={roledata.rolesentity} value={roledata.role}>{roledata.role}</option>
                                            );
                                          }
                                        ) : ''
                                      }
                                    </select>
                            </div>
                          </div>

                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
                            <label>Company ID <span className="requiredsign">*</span></label>
                            <input type="text" className="form-control UMname  has-content"
                              id="companyID" ref="companyID" name="companyID" data-text="companyID" 
                              onChange={this.handleChange}
                              value={this.state.companyID} placeholder="company ID" />
                          </div>
                          <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box">
                            <label>Company Name <span className="requiredsign">*</span></label>
                            <input type="text"
                              className="form-control UMname  has-content"
                              id="companyName" ref="companyName"
                              name="companyName" data-text="companyName"
                              onChange={this.handleChange}
                               disabled
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
                                      // console.log("data dept==>",data);
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
                          {this.state.gmapsLoaded ?
                                <PlacesAutocomplete
                                  value={this.state.cityName}
                                  onChange={this.handleChangePlaces}
                                  onSelect={this.handleSelectLocation}
                                  // searchOptions={searchOptions}
                                  >
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
                                              {/*<span>{suggestion.description}</span>*/}
                                              <span>{(suggestion.description ? suggestion.description.split(",")[0] : "")}</span>

                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </PlacesAutocomplete>
                                :
                                                <div><input type="text" value={this.state.cityName} placeholder="GOOGLE API NOT FOUND" name="cityName" ref="cityName" className="form-control" onChange={this.handleChange.bind(this)}/></div>
                                              }
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

                        <div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                          <button className="col-lg-3 col-md-2 col-xs-12 col-sm-12 col-xs-12 pull-right btn button3 topMargin outlinebox" type="submit" onClick={this.createUser.bind(this)} id="CreateUserModal">{this.state.buttonType}</button>
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
export default CreateUser;
