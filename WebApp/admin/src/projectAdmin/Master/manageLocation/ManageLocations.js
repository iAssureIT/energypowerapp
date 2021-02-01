import React, { Component } from 'react';
import { render } 				  from 'react-dom';
import './masterdata.css';
import $ from 'jquery';
import axios from 'axios';

export default class ManageLocations extends Component{
	constructor(props){
		super(props)
		this.state = {

       stateArray :[],
       cityArray  :[],
			 tabtype    : "location",
		}
		this.changeTab = this.changeTab.bind(this);	

	}

  handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleChangeCountry(event){
      const target = event.target;
      this.setState({
        [event.target.name] : event.target.value
      })
      this.getStates($(target).val())
    }
    getStates(countryCode){
      axios.get("http://locationapi.iassureit.com/api/states/get/list/"+countryCode)
            .then((response)=>{
          
              this.setState({
                  stateArray : response.data
              })
              $('#Statedata').val(this.state.states);
            })
            .catch((error)=>{
                console.log('error', error);
            })
    }
    getCities(cityCode){
      axios.get("http://locationapi.iassureit.com/api/cities/get/list/"+cityCode)
            .then((response)=>{
          
              this.setState({
                  cityArray : response.data
              })
              $('#Citydata').val(this.state.states);
            })
            .catch((error)=>{
                console.log('error', error);
            })
    }
    saveAddress(event){
       /* event.preventDefault();
        var deliveryAddressID = this.props.match.params.deliveryAddressID;
        var formValues = {
            "user_ID"         : localStorage.getItem("user_ID"),
            "deliveryAddressID" : deliveryAddressID,
            "name"            : this.state.username,
            "email"           : this.state.email,
            "addressLine1"    : this.state.addressLine1,
            "addressLine2"    : this.state.addressLine2,  
            "pincode"         : this.state.pincode,
            "block"           : this.state.block,
            "city"            : this.state.city,
            "state"           : this.state.state,
            "country"         : this.state.country,
            "mobileNumber"    : this.state.mobileNumber,
            "addType"         : this.state.addType,
        }
        if(deliveryAddressID){
            if($("#addressForm").valid()){
                console.log('form deliveryAddressID', formValues);
                axios.patch('/api/users/useraddress', formValues)
                .then((response)=>{
                ToastsStore.success(<div className="alertback">{response.data.message}<span className="pull-right pagealertclose" onClick={this.Closepagealert.bind(this)}>X</span></div>, 10000)
                    // swal(response.data);
                    this.props.history.push('/address-book');
                })
                .catch((error)=>{
                    console.log('error', error)
                });
            }
        }else{
            if($("#addressForm").valid()){
                axios.patch('/api/users/patch/address', formValues)
                .then((response)=>{
                ToastsStore.success(<div className="alertback">{response.data.message}<span className="pull-right pagealertclose" onClick={this.Closepagealert.bind(this)}>X</span></div>, 10000)
                    // swal(response.data.message);
                    this.props.history.push('/address-book');
                })
                .catch((error)=>{
                    console.log('error', error)
                });
            }
        }
*/        
    }


  	componentDidMount() {
     
  	}

  	componentWillUnmount(){
      	  	}

  	changeTab = (data)=>{
		this.setState({
			tabtype : data,
		})
	}


  	render() {

    return (
       <div>
          <div className="content-wrapper">
            <section className="content-header">
              <h1> Manage Location </h1>
              <ol className="breadcrumb">
                <li>
                  <a href="#"><i className="fa fa-database" /> Manage Location </a></li>
                <li className="active">Add {this.state.tabtype.charAt(0).toUpperCase()+this.state.tabtype.slice(1)}</li>
              </ol>
              </section>
            <div className="col-lg-12 col-md-12 hidden-sm hidden-xs secdiv"></div>
               <section className="content">
                    <div className="row">
                        <div className="addrol col-lg-12 col-md-12 col-xs-12 col-sm-12">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 padding-zero">
                              <div className="box padding-zero col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                <div className="box-header with-border">
                                  <h4 className="weighttitle">Manage Location</h4>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                 <div className="reportWrapper">
                                      <div className="nav-center manageLocationTabs col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12">
                                        <ul className="nav nav-pills nav-pillss location">
                                          <li className="active text-center col-lg-3 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab">
                                              <a href="#Location" className="tab-align firstTab" data-toggle="tab" onClick={()=>this.changeTab('location')} >
                                              	Location Pincode
                                              </a>
                                          </li>
                                          <li className="text-center col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab">
                                              <a href="#Area" className="tab-align" data-toggle="tab" onClick={()=>this.changeTab('area')}>
                                              	Area
                                              </a>
                                          </li>
                                          <li className="text-center col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab">
                                              <a href="#City" data-toggle="tab" className="tab-align"	onClick={()=>this.changeTab('city')} >
                                              	City
                                              </a>
                                          </li>
                                           <li className="text-center col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab">
                                              <a href="#State" data-toggle="tab" className="tab-align"	onClick={()=>this.changeTab('state')} >
                                              	State
                                              </a>
                                          </li>
                                          <li className="text-center col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab masterDataTab">
                                            	<a  href="#Country" data-toggle="tab" className="tab-align" 	onClick={()=>this.changeTab('country')} >
                                            		Country
                                            	</a>
                                          </li>
                                        </ul>
                                      </div>
                                    	<div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 mainDiv">
            														<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 shippingInput">
                                         <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Country <span className="required">*</span></label>
                                            <select ref="country" name="country" id="country" 
                                             value={this.state.country} onChange={this.handleChangeCountry.bind(this)} 
                                              className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox">
                                              <option value="Select Country">Select Country</option>
                                              <option value="IN">India</option>
                                            </select>
                                          </div>
                                          <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 shippingInput">
                                           <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">State <span className="required">*</span></label>
                                             <select ref="state" name="state" id="state"
                                              value={this.state.state}  onChange={this.handleChange.bind(this)}
                                               className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox">
                                                <option value="Select State">Select State</option>
                                                 {
                                                  this.state.stateArray && this.state.stateArray.length > 0 ?
                                                  this.state.stateArray.map((stateData, index)=>{
                                                    return(      
                                                        <option key={index} value={this.camelCase(stateData.stateName)}>{this.camelCase(stateData.stateName)}</option>
                                                    );
                                                  }
                                                ) : ''
                                              }
                                          </select>
                                         </div>	
                                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 shippingInput">
                                          <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Block 
                                           <span className="required">*</span></label>
                                          <input type="text" ref="block" name="block" id="block"
                                           value={this.state.block}  onChange={this.handleChange.bind(this)} 
                                           className="col-lg-12 col-md-12 col-sm-12 col-xs-12 inputbox" />
                                      </div>
                                     </div>
                                     <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mainDiv"> 
                                       <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 shippingInput">
                                           <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">State <span className="required">*</span></label>
                                             <select ref="state" name="state" id="state"
                                              value={this.state.city}  onChange={this.handleChange.bind(this)}
                                               className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox">
                                                <option value="Select State">Select City</option>
                                                 {
                                                  this.state.cityArray && this.state.cityArray.length > 0 ?
                                                  this.state.cityArray.map((cityData, index)=>{
                                                    return(      
                                                        <option key={index} value={this.camelCase(cityData.stateName)}>{this.camelCase(cityData.stateName)}</option>
                                                    );
                                                  }
                                                ) : ''
                                              }
                                          </select>
                                         </div> 
                                      <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 shippingInput">
                                          <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Zip/Postal Code <span className="required">*</span></label>
                                          <input type="text" ref="pincode" name="pincode" id="pincode"
                                           value={this.state.pincode} onChange={this.handleChange.bind(this)}
                                           className="col-lg-12 col-md-12 col-sm-12 col-xs-12 inputbox" />
                                      </div>
                                     </div> 
            													</div>
                                  </div>
                                </div>
                            </div>
                          </div>
                      
                    </div>
               </section>
          </div>
      </div>
    );

  }

}
