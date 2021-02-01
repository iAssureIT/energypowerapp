import React, { Component }     from 'react';
import { render }               from 'react-dom';
import $ from "jquery";
import swal from 'sweetalert';
import axios from 'axios';
import InputMask  from 'react-input-mask';

import "../css/CompanySetting.css";


const companycontact  = RegExp(/^[0-9][0-9]{9}$|^$/);
const companylocation = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const companybuilding = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const companynameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const companypincodeRegex = RegExp(/^[1-9][0-9]{5}$/);
const numberRegex = RegExp(/[0-9]+(?:-[0-9]+)?(,[0-9]+(?:-[0-9]+)?)*/);
class CompanyLocation extends Component{

  constructor(props) {
    super(props);
    this.state = {
      EditLocId             : props.locId ? props.locId : "", 
      locationType          : "Head Office",
      companycontact        : "", 
      companybuildingblock  : "",
      companyArea           : "",
      companylandmark       : "",
      countryCode           : "-- Select --",
      country               : "",
      stateCode             : "-- Select --",
      state                 : "",
      companyDist           : "-- Select --",
      taluka                : "-- Select --",
      city                  : "",
      pincode               : "",
      GST                   : "",
      PAN                   : "",
      submitVal             : true,
      allPosts              : null,
      pincodeExists         : true,
      allLoc   : null,
      editlocId : null,
      required : "",
     

    };
    this.handleChange = this.handleChange.bind(this);
    
  }
  
  componentWillReceiveProps(nextProps){
    
    this.setState({
      companyId    : nextProps.companyInfo._id,
      allLoc       : nextProps.companyInfo.companyLocationsInfo
    });
  }
   
  componentDidMount(){
    $.validator.addMethod("regxpincode", function (value, element, regexpr) {
        return regexpr.test(value);
    }, "Please enter valid pincode");
    $.validator.addMethod("regxmobileNumber", function (value, element, regexpr) {
        return regexpr.test(value);
    }, "Please enter valid contact number");
    $.validator.addMethod("regxGSTIN", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid GST.");
    $.validator.addMethod("regxPAN", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid PAN.");
    
    $("#companyLocationForm").validate({
      rules: {
        locationType: {
          required: true,
        },
        companycontact: {
          required: true,
          regxmobileNumber: /^([7-9][0-9]{9})$/
        },
        companybuildingblock: {
          required: true,
        },
        companyArea: {
          required: true,
        },
        countryCode: {
          required: true,
        },
        stateCode: {
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
        GST: {
          required: true,
          regxGSTIN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        },
        PAN: {
          required: true,
          regxPAN: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
        },
      },
      errorPlacement: function(error, element) {
              if (element.attr("name") === "locationType"){
                error.insertAfter("#locationType");
              }
              if (element.attr("name") === "companycontact"){
                error.insertAfter("#companycontact");
              }
              if (element.attr("name") === "companybuildingblock"){
                error.insertAfter("#companybuildingblock");
              }
              if (element.attr("name") === "companyArea"){
                error.insertAfter("#companyArea");
              }
              
              if (element.attr("name") === "countryCode"){
                error.insertAfter(".datacountryError");
              }
              if (element.attr("name") === "stateCode"){
                error.insertAfter(".StatedataError");
              }
              if (element.attr("name") === "companyDist"){
                error.insertAfter(".districtDataError");
              }
              if (element.attr("name") === "taluka"){
                error.insertAfter(".BlocksdataError");
              }
              if (element.attr("name") === "companyCity"){
                error.insertAfter(".companyCity");
              }
              if (element.attr("name") === "companyPincode"){
                error.insertAfter(".companyPincode");
              }
              if (element.attr("name") === "GST") {
                error.insertAfter("#GST");
              }
              if (element.attr("name") === "PAN") {
                error.insertAfter("#PAN");
              }
            }
    });
           
  }
  handleChange(event){
    const {name,value} = event.target;
    this.setState({ 
      [name]:value
    });
  }
  handleChangeCountry(event){
    const target = event.target;
    this.setState({
      countryCode: target.value,
      country : target.options[target.selectedIndex].innerHTML })
    this.getStates(target.value)
  }
    getStates(StateCode){
      axios.get("http://locations2.iassureit.com/api/states/get/list/"+StateCode)
            .then((response)=>{
          
              this.setState({
                  stateArray : response.data
              })
              
              $('#Statedata').val(this.state.stateCode);
            })
            .catch((error)=>{
            })
    }
    handleChangeState(event){
      const target = event.target;
      const stateCode = event.target.value;
      const countryCode = this.state.countryCode;
      this.setState({stateCode: target.value, state : target.options[target.selectedIndex].innerHTML })
      this.getDistrict(stateCode,countryCode);
       
    }
    getDistrict(stateCode,countryCode){
      axios.get("http://locations2.iassureit.com/api/districts/get/list/"+countryCode+"/"+stateCode)
            .then((response)=>{
              this.setState({
                  districtArray : response.data
              })
             
              $('#districtData').val(this.state.companyDist);
            })
            .catch((error)=>{
            })
    }
    handleChangeDistrict(event){
      const target = event.target;
      const districtName = target.value;
      const stateCode = this.state.stateCode;
      const countryCode = this.state.countryCode;
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
  submitCompanyLocation=(event)=>{
    event.preventDefault();
    var companyLocationFormValue ={
      locationType              : this.state.locationType,
      companyId                 : this.state.companyId,
      contactnumber             : this.state.companycontact,
      blockname                 : this.state.companybuildingblock,
      area                      : this.state.companyArea,
      landmark                  : this.state.companylandmark,
      countryCode               : this.state.countryCode,
      country                   : this.state.country,
      stateCode                 : this.state.stateCode,
      state                     : this.state.state,
      district                  : this.state.companyDist,
      taluka                    : this.state.taluka,
      companyCity               : this.state.companyCity,
      companyPincode            : this.state.companyPincode,
      GST                       : this.state.GST,
      PAN                       : this.state.PAN,
      
    }//close array

    var companyLocationFormValueupdate ={
      
      locationID                : this.state.editlocId,
      locationType              : this.state.locationType,
      companyId                 : this.state.companyId,
      contactnumber             : this.state.companycontact,
      blockname                 : this.state.companybuildingblock,
      area                      : this.state.companyArea,
      landmark                  : this.state.companylandmark,
      countryCode               : this.state.countryCode,
      country                   : this.state.country,
      stateCode                 : this.state.stateCode,
      state                     : this.state.state,
      district                  : this.state.companyDist,
      taluka                    : this.state.taluka,
      companyCity               : this.state.companyCity,
      companyPincode            : this.state.companyPincode,
      GST                       : this.state.GST,
      PAN                       : this.state.PAN,
    }

   if($("#companyLocationForm").valid() && this.state.pincodeExists ){
      
      if(this.state.submitVal === true)
      {
        axios.patch('/api/companysettings/addLocation',companyLocationFormValue)
          .then( (response)=> {
            
            swal({
              title: "Location is added successfully",
              text: "Location is added successfully",
            });
            this.setState({
              locationType         :"",
              companycontact          :"",
              companybuildingblock    :"",
              companylandmark         :"",
              countryCode             :"-- Select --",
              country                 :"",
              stateCode               :"-- Select --",
              state                   :"",
              companyDist             :"-- Select --",
              taluka                  :"-- Select --",
              companyCity             :"-- Select --",
              companyPincode          :"",
              companyArea             :"",
              GST                     :"",
              PAN                     :""
            });
            axios.get('/api/companysettings/')
            .then( (res)=>{   
              this.setState({allLoc: res.data.companyLocationsInfo}) 
            })
            .catch((error)=>{
            });
          })
          .catch(function (error) {
          })
      }
      else{
        axios.patch('/api/companysettings/update_location',companyLocationFormValueupdate)
        .then( (response)=> {
          // handle success
          swal({
              title: "Location is updated successfully",
              text: "Location is updated successfully",
            });
          this.setState({
            locationType         :"",
            companycontact          :"",
            companybuildingblock    :"",
            companylandmark         :"",
            countryCode             :"-- Select --",
            country                 :"",
            stateCode               :"-- Select --",
            state                   :"",
            companyDist             :"-- Select --",
            taluka                  :"-- Select --",
            companyCity             :"-- Select --",
            companyPincode          :"",
            companyArea             :"",
            submitVal               : false,
            GST                     :"",
            PAN                     :""
          });
            axios.get('/api/companysettings/')
            .then( (res)=>{   
              this.setState({allLoc: res.data.companyLocationsInfo}) 
            })
            .catch((error)=>{
            });

        })
        .catch(function (error) {
          // handle error
        })  
      }
    }
  }

selectType(event){
    event.preventDefault();
    const target = event.target;
    const name   = target.name;
    this.setState({
      [name]: event.target.value,
    });  
}

  editLoc(event){
      event.preventDefault();
      var id = event.target.id;
      
      this.setState({
        editlocId:id,
        submitVal:false,
      });   

      axios.get('/api/companysettings/singleLocation/'+id)
      .then( (response)=> {
        
        var maindata = response.data.companyLocationsInfo[0];
        this.getStates(maindata.countryCode);
        this.getDistrict(maindata.stateCode, maindata.countryCode);
        this.getBlocks(maindata.district, maindata.stateCode, maindata.countryCode);
      
        this.setState({
          locationType              : maindata.locationType,
          companycontact            : maindata.contactNumber,
          companybuildingblock      : maindata.blockName,
          companyArea               : maindata.area,
          companylandmark           : maindata.landmark,
          countryCode               : maindata.countryCode,
          country                   : maindata.country,
          stateCode                 : maindata.stateCode,
          state                     : maindata.state,
          companyDist               : maindata.district,
          taluka                    : maindata.taluka,
          companyCity               : maindata.city,
          companyPincode            : maindata.pincode,
          GST                       : maindata.GST,
          PAN                       : maindata.PAN
        });

      })
      .catch(function (error) {
      })
    }

  deleteLoc(event){
      event.preventDefault();
      var id = event.target.id;
      axios.patch('/api/companysettings/deleteLocation/'+this.state.companyId+'/'+id)
        .then( (response)=> {
          // handle success
          swal({
              title: "Location is deleted successfully",
              text: "Location is deleted successfully",
            });
          axios.get('/api/companysettings/')
            .then( (res)=>{   
              this.setState({allLoc: res.data.companyLocationsInfo}) 
            })
            .catch((error)=>{
            });
        })
        .catch(function (error) {
      })
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
  render(){   
    return(
        <div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyDisplayForm">
            
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h4 className="">Location Details</h4>
              </div>
               <hr className="compySettingHr" />
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <form id="companyLocationForm" className="companyLocationForm">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  compForm">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls ">
                        <div className="form-group margin15">
                            <label className="labelform" >Company Location</label><span className="astrick">*</span>
                            <select className="form-control" value={this.state.locationType} onChange={this.selectType.bind(this)} ref ="locationType" id="locationType" name="locationType" data-text="locationType">
                                <option selected={true} disabled={true}>-- Select --</option>
                                <option value="Head Office" > Head Office </option>
                                <option value="Sales Agent Office" > Sales Agent Office </option>
                                <option value="Field Agent Office" > Field Agent Office </option>
                            </select>
                            <div id="locationTypeError"></div>
                        </div>
                    </div> 
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls">
                        <div className="form-group margin15">
                           <label className="labelform" >Contact Number</label><span className="astrick">*</span>
                           <input type="text" id="companycontact" maxLength="10" className="form-control" value={this.state.companycontact} ref="companycontact" name="companycontact" pattern="[0-9]+" onChange={this.handleChange.bind(this)} required/>
                        </div>
                    </div> 
                  </div>
                </div>

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls">
                        <div className="form-group margin15">
                            <label className="labelform" >Block Name/Building</label><span className="astrick">*</span>
                            <input value={this.state.companybuildingblock} onChange={this.handleChange} data-text="blockName" type="text" id="companybuildingblock" title="Please enter valid address" name="companybuildingblock" className="form-control CLcompanyAddress inputValid " required/>
                        </div>
                    </div> 
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls">
                        <div className="form-group margin15">
                          <label className="labelform" >Area Name</label><span className="astrick">*</span>
                          <input value={this.state.companyArea} onChange={this.handleChange} type="text" data-text="companyArea" id="companyArea" ref="companyArea" name="companyArea" className="form-control CLcompanylandmark inputValid" />
                    </div> 
                  </div>
                </div>

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">

                 <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
                    <div className="form-group formht pdcls   ">
                        <div className="form-group margin15">
                            <label className="labelform" >Near by Landmark</label>
                             <input value={this.state.companylandmark} onChange={this.handleChange} type="text" id="companylandmark"  name="companylandmark" className="form-control CLcompanylandmark inputValid" />
                        </div>
                    </div> 
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">GST <sup className="astrick">*</sup>
                      <a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="Eg. 29ABCDE1234F1Z5" className="fa fa-question-circle"></i> </a>
                    </label>
                    <input type="text" id="GST" placeholder="29ABCDE1234F1Z5" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.GST} ref="GST" name="GST" onChange={this.handleChange} />
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">PAN  <sup className="astrick">*</sup>
                      <a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="Eg. ABCDE1234E" className="fa fa-question-circle"></i> </a>
                    </label>
                    <input type="text" id="PAN" placeholder="ABCDE1234E" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.PAN} ref="PAN" name="PAN" onChange={this.handleChange} />
                  </div>
                </div>

                <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                  <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="labelform" >
                            Country
                          </label>
                          <span className="astrick">*</span>
                        <select id="datacountry" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" 
                          value={this.state.countryCode} ref="countryCode" name="countryCode" onChange={this.handleChangeCountry.bind(this)} >
                          <option selected={true} disabled={true}>-- Select --</option>
                          <option value="IN">India</option>
                        </select>
                        <div className="datacountryError"></div>
                      </div>  
                    </div>

                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="labelform" >
                            State
                          </label>
                          <span className="astrick">*</span>
                          <select id="Statedata" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" 
                            value={this.state.stateCode} ref="stateCode" name="stateCode" onChange={this.handleChangeState.bind(this)} >
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
                          <div className="StatedataError"></div>
                      </div>  
                    </div>

                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
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
                          <div className="districtDataError"></div>
                      </div>  
                    </div>

                  </div>
                  <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="labelform" >
                            Taluka
                          </label>
                          <span className="astrick">*</span>
                          <select id="Blocksdata" className="form-control inputText inputTextTwo col-lg-12 col-md-12 col-sm-12 col-xs-12" 
                           value={this.state.taluka} ref="taluka" name="taluka" onChange={this.handleChange} >
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
                          <div className="BlocksdataError"></div>
                      </div>  
                    </div>

                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="labelform" >
                            City
                          </label>
                          <span className="astrick">*</span>
                          <input
                            onChange={this.handleChange} 
                            type="text" name="companyCity" 
                            data-text="city"
                            value={this.state.companyCity}
                            className="form-control companyCity"/>

                      </div>  
                    </div>

                    <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="form-group">
                          <label className="labelform" >
                            Pincode
                          </label>
                          <span className="astrick">*</span>
                          <input
                            type="text" name="companyPincode" onChange={this.handlePincode.bind(this)}
                            data-text="pincode"
                            value={this.state.companyPincode}
                            className="form-control companyPincode" />
                            {this.state.pincodeExists ? null : <label className="error" style={{color: "red", fontWeight: "100"}}>This pincode does not exists!</label>}
                      </div>  
                    </div>
                  </div>

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn button3 pull-right" id="btnCheck" onClick={this.submitCompanyLocation.bind(this)} >
                    {this.state.submitVal
                      ? "Submit" : "Update"
                    }  
                  </button>
                </div>
                </div>
              </div>
            </form>  
          </div>
        </div>


        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
        {this.state.allLoc && this.state.allLoc.length > 0 ?
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
            <div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 foothd">
              <h4 className="MasterBudgetTitle">Location Details</h4>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              {this.state.allLoc && this.state.allLoc.length > 0 ?
                this.state.allLoc.map((locationdata, index) => {
                  return (
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 " key={index}>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxul1">
                        <div className=" col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                          <div className="locationIcon col-lg-10 col-md-10 col-sm-10 col-xs-10 ">
                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                          </div>
                        </div>

                        <ul className="col-lg-10 col-md-10 col-sm-10 col-xs-10 palfclr addrbox">
                          <li>{locationdata.locationType}</li>
                          <li>Contact : {locationdata.contactNumber}</li>
                          <li>{locationdata.blockName} , {locationdata.area}</li>
                          <li>{locationdata.district},{locationdata.city} - {locationdata.pincode}</li>
                          <li>GST: {locationdata.GST}</li>
                          <li>PAN: {locationdata.PAN}</li>
                        </ul>
                        <div className=" dropdown col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                          <div className=" dotsContainerLD col-lg-8 col-md-8 col-sm-8 col-xs-8">
                            <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                            <div className="dropdown-content dropdown-contentLocation">
                              <ul className="pdcls ulbtm">

                                <li name={index}>
                                  <span id={locationdata._id} onClick={this.editLoc.bind(this)}> <i className="fa fa-pencil penmrleft" title="Edit" aria-hidden="true"></i>&nbsp;&nbsp;Edit</span>
                                </li>
                                <li name={index}>
                                  <span data-toggle="modal" title="Delete" data-target={`#${locationdata._id}-rm`}><i className="fa fa-trash-o" aria-hidden="true"></i> &nbsp; Delete</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })
                :
                <div className="textAlign">Locations will be shown here.</div>
              }
            </div>
          </div>
          :
          null
        }
      </div>

      </div>
    );
  }
}

export default CompanyLocation;
