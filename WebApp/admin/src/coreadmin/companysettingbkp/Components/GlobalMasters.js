import React, {Component}           from 'react';
import {render}                     from 'react-dom';
import $ from "jquery";
import axios from 'axios';

import LocationType                 from  '../../Master/LocationType/LocationType.jsx';
import Department                   from  '../../Master/Department/DepartmentMaster-GlobalMaster.js';
import Designation                  from  '../../Master/Designation/DesignationMaster-GlobalMaster.js';
import CompanyBankDetails           from  './CompanyBankDetails.js';
import CompanyTaxDetails            from  './CompanyTaxDetails.js';

import '../css/CompanySetting.css';

 class GlobalMasters extends Component{
    constructor(props) {
		super(props)

		this.state = {
			companyinformation				: "Company Information",
      profileCreated            : false,
      editType                  : "",
      editId                    : "",
		}
	
	}
  componentDidMount() {

    if(this.props.match){
      if(this.props.match.params.editId && this.props.match.params.editId !== 'undefined'){
        console.log("this.props.match.params.editId = ",this.props.match.params.editId);
        this.setState({editId : this.props.match.params.editId},
                      ()=>{
                        console.log("global componentDidMount editId = ",this.state.editId);
                      });
      }
    }


    axios.get('/api/companysettings/')
    .then( (res)=>{   
      this.setState({profileCreated:true, companyInfo: res.data}) 
    })
    .catch((error)=>{
    });
  }
 
  componentDidUpdate(prevProps) {
    if(this.props.match.params.editId !== this.state.editId){
      this.setState({editId : this.props.match.params.editId},
                    ()=>{
                      //console.log("global componentDidUpdate editId = ",this.state.editId);
                    });
    }
  }



  handler(){
    axios.get('/api/companysettings/')
    .then( (res)=>{   
      this.setState({profileCreated:true, companyInfo: res.data}) 
    })
    .catch((error)=>{
    });
  }

  render() {
    // console.log("render this.state.editId = ",this.state.editId);
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact NOpadding">
                    <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right ">
                        <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Global Masters</h4>
                    </div>
                  </div>     
                  <div className="boxMinHeight boxMinHeighttab addMarginTop">
                      <div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 noPadding"> 
                          <ul className="nav nav-tabs tabs-left sideways">
                            <li className="active col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#email" data-toggle="tab">LocationType</a></li>
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#SMSGateway" data-toggle="tab">Department</a></li>
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#amazon" data-toggle="tab">Designation</a></li>
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#googleapikey" data-toggle="tab">Bank Details</a></li>
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#CompanyPaymentGateway" data-toggle="tab">Tax Master</a></li>
                          </ul>   
                      </div>
                      <div className="tab-content col-lg-9 col-md-9 col-xs-12 col-sm-12">                         
                        <div className="tab-pane active" id="email">          <LocationType       editId={this.state.editId}/>  </div>                              
                        <div className="tab-pane" id="SMSGateway">            <Department         editId={this.state.editId}/>  </div>                              
                        <div className="tab-pane" id="amazon">                <Designation        editId={this.state.editId}/>  </div>                                
                        <div className="tab-pane" id="googleapikey">          <CompanyBankDetails editId={this.state.editId}/>  </div>          
                        <div className="tab-pane" id="CompanyPaymentGateway"> <CompanyTaxDetails  editId={this.state.editId}/>  </div>
                      </div> 

                    </div>
                  </div>
                </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default GlobalMasters;