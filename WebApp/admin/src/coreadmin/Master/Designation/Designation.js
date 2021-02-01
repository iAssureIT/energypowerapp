import React, { Component }     from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import IAssureTable             from '../../IAssureTable/IAssureTable.jsx';
import OneFieldForm             from '../OneFieldForm/OneFieldForm.js';
import _                        from 'underscore';

import 'bootstrap/js/tab.js';
import CompanyBankDetails           from  '../../companysetting/Components/CompanyBankDetails.js';
import CompanyTaxDetails            from  '../../companysetting/Components/CompanyTaxDetails.js';
import CompanyPaymentGateway        from  '../../companysetting/Components/CompanyPaymentGateway.js';
import CompanySMSGateway            from  '../../companysetting/Components/CompanySMSGateway.js';
import CompanyEmailGateway          from  '../../companysetting/Components/CompanyEmailGateway.js';
import AmazonS3                     from  '../../companysetting/Components/AmazonS3.js';

class Designation extends Component {
    constructor(props) {
        super(props);
        this.state = {
             companyInfo              : [],
      profileCreated            : false,
            "locationType": "",
            "fields" : {
                placeholder     : "Enter designation type..",
                title           : "Designation",
                attributeName   : "designation"
            },
            "tableHeading": {
                designation: "Designation",
                actions: 'Action',
            },
            "tableObjects": {
                deleteMethod: 'delete',
                apiLink: '/api/designationmaster/',
                paginationApply: false,
                searchApply: false,
                editUrl: '/designation'
            },
            "startRange": 0,
            "limitRange": 10,
            "editId": this.props.match.params ? this.props.match.params.fieldID : ''

        };
    }
    componentDidMount() {
        var editId = this.props.match.params.fieldID;
       
        this.setState({
            editId: editId
        })
        var editId = this.props.match.params.fieldID;
        window.scrollTo(0, 0);
         axios.get('/api/companysettings/')
        .then( (res)=>{   
          this.setState({profileCreated:true, companyInfo: res.data}) 
        })
        .catch((error)=>{
        });
    }
     componentWillReceiveProps(nextProps) {
        var editId = nextProps.match.params.fieldID;
        if (nextProps.match.params.fieldID) {
            this.setState({
                editId: editId
            })
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
                        <div  className="">
                          <div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 noPadding"> 
                              {
                              this.state.profileCreated ?
                              <ul className="nav nav-tabs tabs-left sideways">
                               {/* 
                               <li className="active  col-lg-12 col-md-12 col-xs-12 col-sm-12" ><a className="tabLeft tablefthr lettersp" href="#companyInformation" data-toggle="tab">Company Information</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"  ><a className="tabLeft lettersp tablefthr" href="#CompanyLocation" data-toggle="tab">Location Details</a></li>
                               */}
                                <li className="  col-lg-12 col-md-12 col-xs-12 col-sm-12" ><a className="tabLeft lettersp tablefthr" href="#CompanyBankDetails" data-toggle="tab">Bank Details</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#CompanyPaymentGateway" data-toggle="tab">Payment Gateway</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#SMSGateway" data-toggle="tab">SMS Gateway</a></li>
                                
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#email" data-toggle="tab">Email Gateway</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#amazon" data-toggle="tab">Amazon S3</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12 "><a className="tabLeft lettersp tablefthr" href="/tax-name" >Tax Master</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12 "><a className="tabLeft lettersp tablefthr" href="/tax-rate" >Tax Rate Master</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12 "><a className="tabLeft lettersp tablefthr" href="/location-type" >Location Types</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="/Department" >Department</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12 active"><a className="tabLeft lettersp tablefthr" href="/designation" >Designation</a></li>
                              </ul>
                              :
                              <ul className="nav nav-tabs tabs-left sideways">
                                {/*
                                <li className="active  col-lg-12 col-md-12 col-xs-12 col-sm-12" ><a className="tabLeft tablefthr lettersp" href="#companyInformation">Company Information</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12 disabled"><a className="tabLeft lettersp tablefthr">Location Details</a></li>
                                */}
                                <li className="  col-lg-12 col-md-12 col-xs-12 col-sm-12" ><a className="tabLeft lettersp tablefthr" href="#CompanyBankDetails" data-toggle="tab">Bank Details</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12 disabled" ><a className="tabLeft lettersp tablefthr" >Tax Information</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12 disabled"><a className="tabLeft lettersp tablefthr">Payment Gateway</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#SMSGateway" data-toggle="tab">SMS Gateway</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#email" data-toggle="tab">Email Gateway</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#amazon" data-toggle="tab">Amazon S3</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12 "><a className="tabLeft lettersp tablefthr" href="/location-type" >Location Types</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12 "><a className="tabLeft lettersp tablefthr" href="/Department">Department</a></li>
                                <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12 active"><a className="tabLeft lettersp tablefthr" href="/designation">Designation</a></li>
                              
                              </ul>
                            }
                          </div>
                          <div className="tab-content col-lg-9 col-md-9 col-xs-12 col-sm-12">
                            <div className="tab-pane" id="CompanyBankDetails"> <CompanyBankDetails companyInfo={this.state.companyInfo}/> </div>                               
                            <div className="tab-pane" id="CompanyTaxDetails"> <CompanyTaxDetails companyInfo={this.state.companyInfo}/> </div>
                            <div className="tab-pane" id="CompanyPaymentGateway"> <CompanyPaymentGateway/> </div>                              
                            <div className="tab-pane" id="SMSGateway"> <CompanySMSGateway /> </div> 
                            <div className="tab-pane" id="email"> <CompanyEmailGateway /> </div>   
                            <div className="tab-pane" id="amazon"> <AmazonS3 /> </div>  
                            <div className="tab-pane active" id="">  
                               <OneFieldForm fields={this.state.fields}
                                  tableHeading={this.state.tableHeading}
                                  tableObjects={this.state.tableObjects}
                                  editId ={this.props.match.params.fieldID}
                                  history={this.props.history} />
                            </div>                            
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
export default Designation;

