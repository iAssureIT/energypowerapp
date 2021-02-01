import React, {Component}           from 'react';
import {render}                     from 'react-dom';
import $ from "jquery";

import CompanyEmailGateway          from  '../Components/CompanyEmailGateway.js';
import CompanySMSGateway            from  '../Components/CompanySMSGateway.js';
import AmazonS3                     from  '../Components/AmazonS3.js';
import GoogleApiKey                 from  '../Components/GoogleApiKey.js';
import CompanyPaymentGateway        from  '../Components/CompanyPaymentGateway.js';


import axios from 'axios';

 class TechnicalMasters extends Component{
    constructor(props) {
    super(props)

    this.state = {
      companyinformation        : "Company Information",
      profileCreated            : false
    }
  
  }
  componentDidMount() {
    axios.get('/api/companysettings/')
    .then( (res)=>{   
      this.setState({profileCreated:true, companyInfo: res.data}) 
    })
    .catch((error)=>{
    });
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
    
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact NOpadding">
                    <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right ">
                        <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Technical Masters</h4>
                    </div>
                  </div>     
                  <div className="boxMinHeight boxMinHeighttab addMarginTop">
                    <div  className="">
                      <div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 noPadding"> 
                          <ul className="nav nav-tabs tabs-left sideways">
                            <li className="active col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#email" data-toggle="tab">Email Gateway</a></li>
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#SMSGateway" data-toggle="tab">SMS Gateway</a></li>
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#amazon" data-toggle="tab">Amazon S3</a></li>
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#googleapikey" data-toggle="tab">Google API Key</a></li>
                            {/*<li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#CompanyPaymentGateway" data-toggle="tab">Payment Gateway</a></li>*/}
                          </ul>   
                      </div>
                      <div className="tab-content col-lg-9 col-md-9 col-xs-12 col-sm-12">                         
                        <div className="tab-pane active" id="email">          <CompanyEmailGateway/>  </div>                              
                        <div className="tab-pane" id="SMSGateway">            <CompanySMSGateway />   </div>                              
                        <div className="tab-pane" id="amazon">                <AmazonS3/>             </div>                                
                        <div className="tab-pane" id="googleapikey">          <GoogleApiKey/>         </div>          
                        <div className="tab-pane" id="CompanyPaymentGateway"> <CompanyPaymentGateway/> </div>
                      </div> 
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
export default TechnicalMasters;