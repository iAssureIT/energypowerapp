import React, { Component } from 'react';
import { render }           from 'react-dom';
import $ from "jquery";
import axios from 'axios';
import swal from 'sweetalert';
import S3FileUpload           from 'react-s3';
import { deleteFile }         from 'react-s3';
import InputMask  from 'react-input-mask';
import AddImgPublicCompanySetting          from "../../addFile/AddImgPublicCompanySetting.js";
import validate               from 'jquery-validation';
import PhoneInput from 'react-phone-input-2';

import "../../../API";

const formValid = formerrors=>{
  let valid = true;
  Object.values(formerrors).forEach(val=>{
  val.length>0 && (valid = false);
  })
  return valid;
  }

const companymobileRegex  = RegExp(/^[0-9][0-9]{9}$|^$/);
const companyAddressRegex = RegExp(/^[a-zA-Z0-9\s,'/.-]*$/);
const companywebsiteRegex = RegExp(/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/);
const companypincodeRegex = RegExp(/^[1-9][0-9]{5}$/);
const companynameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const emailRegex = RegExp (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/);
class CompanyInformation extends Component{
   constructor(props) {
    super(props);
    this.state = {
      companyId               : "",
      companyName             : "",
      companyContactNumber    : "",
      companyAltContactNumber : "",
      companyEmail            : "",
      companyAddressLine1     : "",
      defaultPassword         : "",
      companyCountry : "-- Select --",
      countryName : "",
      companyState : "-- Select --",
      stateName:"",
      district : "-- Select --",
      taluka : "-- Select --",
      city : "-- Select --",
      companyLogo             : "",
      logoFilename            : "",
      companywebsite          : "",
      data                    : [],
      submitVal               : true,
      pincodeExists           : true,
      imgArrayWSaws           : [],
      "configData" : {
        dirName         : 'CompanySetting',
        deleteMethod    : 'delete',
        apiLink         : '/api/caseStudies/delete/',
        pageURL         : '/caseStudyy',
      },
      subscription : {
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
    
    $.validator.addMethod("regxmobileNumber", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid mobile number.");

    $.validator.addMethod("regxaltcontact", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid contact number.");

    $.validator.addMethod("regxA3", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter valid email");
    $.validator.addMethod("regxA4", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "It should be like www.abcd.com");
    $.validator.addMethod("regxpincode", function (value, element, regexpr) {
            return regexpr.test(value);
        }, "Please enter valid pincode");
   /* $.validator.addMethod("regxContact", function(value, element, regexpr) { 
      return value===regexpr;
    }, "This field value is similar as contact number.");*/
    $("#companyInformationForm").validate({
      rules: {
        companyName: {
          required: true,
        },
        companyEmail: {
          required: true,
          regxA3: /\S+@\S+\.\S+/
        },
        companywebsite: {
          required: true,
          regxA4: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/,
        },
        companyAddressLine1: {
          required: true,
        },
        companyCountry: {
          required: true,
        },
        companyState: {
          required: true,
        },
        companyDist: {
          required: true,
        },
        taluka: {
          required: true,
        },
        companyCity: {
          required: true,
        },
        companyPincode: {
          required: true,
          regxpincode : /^[1-9][0-9]{5}$/
        },
      },
      errorPlacement: function(error, element) {
              if (element.attr("name") === "companyName"){
                error.insertAfter("#companyName");
              }
              if (element.attr("name") === "companyEmail"){
                error.insertAfter("#companyEmail");
              }
              if (element.attr("name") === "companywebsite"){
                error.insertAfter("#companywebsite");
              }
              
              if (element.attr("name") === "companyAddressLine1"){
                error.insertAfter("#companyAddressLine1");
              }
              if (element.attr("name") === "companyCountry"){
                error.insertAfter("#datacountryError");
              }
              if (element.attr("name") === "companyState"){
                error.insertAfter("#StatedataError");
              }
              if (element.attr("name") === "companyDist"){
                error.insertAfter("#districtDataError");
              }
              if (element.attr("name") === "taluka"){
                error.insertAfter("#BlocksdataError");
              }
              if (element.attr("name") === "companyCity"){
                error.insertAfter("#companyCity");
              }
              if (element.attr("name") === "companyPincode"){
                error.insertAfter("#companyPincode");
              }
            }
    });
  }
 

  componentWillReceiveProps(nextProps) {
      this.getStates(nextProps.companyInfo.countryCode);
      this.getDistrict(nextProps.companyInfo.stateCode, nextProps.companyInfo.countryCode);
      this.getBlocks(nextProps.companyInfo.district, nextProps.companyInfo.stateCode, nextProps.companyInfo.countryCode);
      
      this.setState({
        companyId   : nextProps.companyInfo._id,
        companyName : nextProps.companyInfo.companyName,
        companyContactNumber : nextProps.companyInfo.companyContactNumber,
        companyAltContactNumber : nextProps.companyInfo.companyAltContactNumber,
        companyEmail            : nextProps.companyInfo.companyEmail, 
        companywebsite          : nextProps.companyInfo.companywebsite, 
        companyAddressLine1     : nextProps.companyInfo.companyaddress,
        companyDist             : nextProps.companyInfo.district,
        companyPincode          : nextProps.companyInfo.pincode,
        companyCity             : nextProps.companyInfo.city,
        companyState            : nextProps.companyInfo.stateCode,
        state                   : nextProps.companyInfo.state,
        companyCountry          : nextProps.companyInfo.countryCode,
        taluka                  : nextProps.companyInfo.taluka,
        submitVal               : false,
        defaultPassword         : nextProps.companyInfo.defaultPassword, 
        logoFilename            : nextProps.companyInfo.logoFilename, 
        companyLogo             : nextProps.companyInfo.companyLogo, 
      },()=>{
      });

    this.handleChange = this.handleChange.bind(this);
  }
  handleChangeCountry(event){
      const target = event.target;
      this.setState({
        companyCountry: target.value,
        country : target.options[target.selectedIndex].innerHTML })
      this.getStates(target.value)
    }
    getStates(StateCode){
      axios.get("http://locations2.iassureit.com/api/states/get/list/"+StateCode)
            .then((response)=>{
              this.setState({
                  stateArray : response.data
              })
              $('#Statedata').val(this.state.companyState);
            })
            .catch((error)=>{
            })
    }
    handleChangeState(event){
      const target = event.target;
      const stateCode = event.target.value;
      const countryCode = document.getElementById("datacountry").value;
      this.setState({companyState: target.value, state : target.options[target.selectedIndex].innerHTML })
      this.getDistrict(stateCode,countryCode);
       
    }
    getDistrict(stateCode,countryCode){
      axios.get("http://locations2.iassureit.com/api/districts/get/list/"+countryCode+"/"+stateCode)
            .then((response)=>{
              this.setState({
                  districtArray : response.data
              })
             
              $('#districtData').val(this.state.district);
            })
            .catch((error)=>{
            })
    }
    handleChangeDistrict(event){
      const target = event.target;
      const districtName = target.value;
      const stateCode = document.getElementById('Statedata').value;
      const countryCode = document.getElementById("datacountry").value;
      this.setState({companyDist: target.value })
      this.getBlocks(districtName,stateCode,countryCode);
    }
    getBlocks(districtName,stateCode,countryCode){
      axios.get("http://locations2.iassureit.com/api/blocks/get/list/"+countryCode+'/'+stateCode+"/"+districtName)
            .then((response)=>{
              var flags = [], output = [], l = response.data.length, i;
              for( i=0; i<l; i++) {
                  if( flags[response.data[i].blockName]) continue;
                  flags[response.data[i].blockName] = true;
                  output.push(response.data[i]);
              }
              this.setState({
                blocksArray : output
              })
              $('#Blocksdata').val(this.state.taluka);
            })
            .catch((error)=>{
            })
    }
    handleChangeBlock(event){
      this.setState({taluka: event.target.value })
    }
  submitCompanyInformation=(event)=>{
    event.preventDefault();
    
    var companyInfoFormValue = {
      companyName             : this.state.companyName,
      companyContactNumber    : this.state.companyContactNumber,
      companyAltContactNumber : this.state.companyAltContactNumber,
      companyEmail            : this.state.companyEmail,
      companywebsite          : this.state.companywebsite,
      companyaddress          : this.state.companyAddressLine1,
      logoFilename            : this.state.logoFilename,
      companyLogo             : this.state.companyLogo,
      country                 : this.state.companyCountry,
      countryName             : this.state.country,
      state                   : this.state.companyState,
      stateName               : this.state.state,
      district                : this.state.companyDist,
      taluka                  : this.state.taluka,
      city                    : this.state.companyCity,
      pincode                 : this.state.companyPincode
    }//close array

     var companyInfoFormValueUpdate = {
      companyId               : this.state.companyId,
      companyName             : this.state.companyName,
      companyContactNumber    : this.state.companyContactNumber,
      companyAltContactNumber : this.state.companyAltContactNumber,
      companyEmail            : this.state.companyEmail,
      companywebsite          : this.state.companywebsite,
      companyaddress          : this.state.companyAddressLine1,
      companyLogo             : this.state.companyLogo,
      country                 : this.state.companyCountry,
      countryName             : this.state.country ? this.state.country  : "India" ,
      state                   : this.state.companyState,
      stateName               : this.state.state,
      district                : this.state.companyDist,
      taluka                  : this.state.taluka,
      city                    : this.state.companyCity,
      pincode                 : this.state.companyPincode
    }
 
    
  if($("#companyInformationForm").valid() && this.state.pincodeExists){  
    if(this.state.submitVal === true){
        axios.post('/api/companysettings',companyInfoFormValue)
        .then( (response)=> { 
          // handle success
          this.props.handler();
          swal({
            title: "Company Information submitted Successfully",
            text: "Company Information submitted Successfully",
          });
          this.setState({
            companyName             : "",
            companyContactNumber    : "",
            companyAltContactNumber : "",
            companyEmail            : "",
            companyAddressLine1     : "",
            companyDist             : "-- Select --",
            companyPincode          : "",
            companyCity             : "",
            companyState            : "-- Select --",
            state                   : "",
            companyCountry          : "-- Select --",
            country                 : "",
            companyLogo             : "",
            logoFilename            : "",
            taluka                  : "-- Select --",
            companywebsite          : "",
            defaultPassword         : "",
            submitVal               : false
            },()=>{
          });
        })
        .catch(function (error) {
          // handle error
          swal({
            title: "Company Information submition failed!",
            text: "Company Information submition failed!",
          });
        })
        .finally(function () {
          // always executed
        });
    }else{
      // upate function

      axios.patch('/api/companysettings/information',companyInfoFormValueUpdate)
        .then( (response)=> {
          // handle success
          swal({
            title: "Company Information Updated Successfully",
            text: "Company Information Updated Successfully",
          });
        })
        .catch(function (error) {
          // handle error
          if (error.response.status==401) {
            swal({
                title: "Nothing to update!",
                text: "Nothing to update!",
              });
          }
        });
    }
  }
}
  handleChange(event){
    const {name,value} = event.target;
    this.setState({ 
      [name]:value
    });
  }
  getLogo(logo, filename){
    this.setState({
      "companyLogo" : logo,
      "logoFilename" : filename,
    },()=>{
       
    })
  }
  
  deleteimagelogoDirect(event){
    event.preventDefault();
    this.setState({companyLogo:""})
  }
  handlePincode(event){
        event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value
        })
        if (event.target.value !== '') {
            axios.get("https://api.postalpincode.in/pincode/" + event.target.value,{ crossDomain: true,
              headers: {
              'Access-Control-Allow-Origin': true,
              } })
            .then((response) => {
                
                if ($("[name='companyPincode']").valid()) {

                    if (response.data[0].Status === 'Success' ) {
                        this.setState({pincodeExists : true})
                    }else{
                        this.setState({pincodeExists : false})
                    }
                }else{
                    this.setState({pincodeExists : true})
                }
                
            })
            .catch((error) => {
            })
        }else{
            this.setState({pincodeExists : true})
        }
    }
    changeMobile(event){
    this.setState({
      companyContactNumber : event
    })
  }
    changeMobile1(event){
    this.setState({
      companyAltContactNumber : event
    })
  }
  render(){
    const {formerrors} = this.state;
   
    return(
      <div className="">
       
      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <h4 className="">Company Information</h4>
        </div>
        <hr className="compySettingHr" />
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
        <form id="companyInformationForm"  >
          <div className="">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">  
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <h4 className="basicinfotxt"><i className="fa fa-info-circle fonticons" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Basic Info</h4>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 nopadding">
              <div className="form-group valid_box col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="labelform" >
                    Company Name
                  </label>
                  <span className="astrick">*</span>                        
                  <input
                    onChange={this.handleChange} 
                    type="text" name="companyName" id="companyName"
                    className="form-control"
                    placeholder = "Enter company name.."
                    value={this.state.companyName} />                        
                </div>  
              </div>
              <div className="form-group valid_box col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="labelform" >Contact Number</label><span className="astrick">*</span>
                  <PhoneInput
                      country={'in'}
                      value={this.state.companyContactNumber} 
                      name="companyContactNumber"
                      inputProps={{
                        name: 'companyContactNumber',
                        required: true
                      }}
                      onChange={this.changeMobile.bind(this)}
                  />
                </div> 
              </div>

              <div className="form-group valid_box col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="labelform" >Alternate Contact Number</label>
                    <PhoneInput
                      country={'in'}
                      value={this.state.companyAltContactNumber} 
                      name="companyAltContactNumber"
                      inputProps={{
                        name: 'companyAltContactNumber',
                        required: true
                      }}
                      onChange={this.changeMobile1.bind(this)}
                  />
                </div> 
              </div>
              <div className="form-group valid_box col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="labelform" >Email</label><span className="astrick">*</span>
                  <input className="form-control"  type="email"
                    id="companyEmail" type="text"
                    data-text="companyEmailID" 
                    placeholder = "Enter email id.."
                    name="companyEmail" ref="companyEmail" 
                    value={this.state.companyEmail} aria-required="true"
                    onChange={this.handleChange.bind(this)} required/>
               </div> 
              </div>
              <div className="form-group valid_box col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="labelform" >Website</label><span className="astrick">*</span>
                  <a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="Please enter valid Website(www.abc.xyz)." className="fa fa-question-circle"></i> </a>

                  <input className="form-control"  data-text="companywebsitename"
                    id="companywebsite" type="text"
                    placeholder = "www.abcpqr.com"
                    name="companywebsite" ref="companywebsite" value={this.state.companywebsite} aria-required="true" onChange={this.handleChange.bind(this)} required/>
                </div> 
              </div>
            </div>
              <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 nopadding">
                <div className="form-group valid_box">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 csImageWrapper">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                    {this.state.companyLogo && this.state.companyLogo !== ''
                      ? 
                      <div className=" padTopC">
                        <div className="row col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <h5 className="formLable col-lg-12 col-md-12 col-sm-12 col-xs-12 row">Logo </h5>
                        </div>
                        <div className="containerC">
                          <label id="logoImage" className="pull-right custFaTimes1" title="Delete image" onClick={this.deleteimagelogoDirect.bind(this)}><i className="fa fa-times"></i></label>
                          <img src={this.state.companyLogo} alt="logo_Lupin" className="row imageC"/>
                        </div>
                      </div>
                      :
                        <AddImgPublicCompanySetting
                          getLogo    = {this.getLogo.bind(this)}
                          configData = {this.state.configData} 
                          logo       = {this.state.companyLogo} 
                          fileType   = "Image" 
                        />   
                    }
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
            
          </div>
          {/*<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <h4 className="basicinfotxt"><i className="fa fa-map-marker fonticons" aria-hidden="true"></i>&nbsp;&nbsp;Address</h4>
          </div>*/}
          {/*<div className="basicinfocmpset"> 
            <div className="col-lg-12 col-md-4 col-sm-12 col-xs-12">
              <div className="form-group valid_box col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="labelform" >
                  Address
                  </label>
                  <span className="astrick">*</span>  
                  <textarea onChange={this.handleChange} 
                    type="text" name="companyAddressLine1" id="companyAddressLine1"
                    data-text="companyAddress"
                    className="form-control" value={this.state.companyAddressLine1}></textarea>
                  
                </div>  
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="labelform" >
                    Country
                  </label>
                  <span className="astrick">*</span>                          
                  <select id="datacountry" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" 
                    value={this.state.companyCountry} ref="country" name="companyCountry" onChange={this.handleChangeCountry.bind(this)} >
                    <option selected={true} disabled={true}>-- Select --</option>
                    <option value="IN">India</option>
                  </select>
                  <div id="datacountryError"></div>
                </div>  
              </div>
              <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="labelform" >
                    State
                  </label>
                  <span className="astrick">*</span>
                  <select id="Statedata" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" 
                    value={this.state.companyState} ref="states" name="companyState" onChange={this.handleChangeState.bind(this)} >
                    <option selected={true} disabled={true}>-- Select --</option>
                    {
                      this.state.stateArray && this.state.stateArray.length > 0 ?
                      this.state.stateArray.map((stateData, index)=>{
                        return(      
                            <option key={index} value={stateData.stateCode}>{stateData.stateName}</option>
                          );
                        }
                      ) : ''
                    }
                  </select>
                  <div id="StatedataError"></div>
                </div>  
              </div>
              <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="labelform" >
                    District
                  </label>
                  <span className="astrick">*</span>
                  <select id="districtData" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" 
                    value={this.state.companyDist} ref="district" name="companyDist" onChange={this.handleChangeDistrict.bind(this)} >
                    <option selected={true} disabled={true}>-- Select --</option>
                    {  
                      this.state.districtArray && this.state.districtArray.length > 0 ?
                      this.state.districtArray.map((districtdata, index)=>{
                        return(      
                            <option  key={index} value={districtdata.districtName}>{districtdata.districtName}</option>
                          );
                        }
                      ) : ''
                    }
                  </select>
                  <div id="districtDataError"></div>
                </div>  
              </div>
            </div>
            <div className="col-lg-12 col-md-4 col-sm-12 col-xs-12">
              <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="labelform" >
                    Taluka
                  </label>
                  <span className="astrick">*</span>
                  <select id="Blocksdata" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" 
                   ref="block" name="taluka" onChange={this.handleChangeBlock.bind(this)} >
                    <option selected="true" disabled="true">-- Select --</option>
                    {
                      this.state.blocksArray && this.state.blocksArray.length > 0 ?
                      this.state.blocksArray.map((blockdata, index)=>{
                        return(      
                            <option  key={index} value={blockdata.blockName}>{blockdata.blockName}</option>
                          );
                        }
                      ) : ''
                    }
                  </select>
                  <div id="BlocksdataError"></div>
                  
                </div>  
              </div>
              <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="labelform" >
                    City
                  </label>
                  <span className="astrick">*</span>
                  <input
                    onChange={this.handleChange} 
                    type="text" name="companyCity" id="companyCity"
                    data-text="city"
                    value={this.state.companyCity}
                    className="form-control"/>
                </div>  
              </div>
              <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                <div className="form-group">
                  <label className="labelform" >
                    Pincode
                  </label>
                  <span className="astrick">*</span>
                  <input
                    onChange={this.handleChange} 
                    type="text" name="companyPincode" id="companyPincode"
                    maxlength="6" value={this.state.companyPincode} onChange={this.handlePincode.bind(this)}
                    className="form-control" />
                    {this.state.pincodeExists ? null : <label className="error" style={{color: "red", fontWeight: "100"}}>This pincode does not exists!</label>}
                </div>  
              </div>
            </div>
          </div>*/}

          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
            <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn button3 pull-right" id="btnCheck" 
             onClick={this.submitCompanyInformation.bind(this)}>
              {this.state.submitVal
                ? "Submit" :  "Update"
              }  
            </button>
          </div>
        </form>  
        </div>       
      </div>
      </div>
    );
  }
 }

 export default CompanyInformation;