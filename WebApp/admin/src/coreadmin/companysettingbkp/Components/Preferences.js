import React, {Component}           from 'react';
import {render}                     from 'react-dom';
import $                            from "jquery";
import TimeFormat                   from  '../../Preferences/TimeFormat.js';
import ProfitMargin                 from  '../../Preferences/ProfitMargin.js';

import axios from 'axios';

 class Preferences extends Component{
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
                        <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Preferences</h4>
                    </div>
                  </div>     
                  <div className="boxMinHeight boxMinHeighttab addMarginTop">
                    <div  className="">
                      <div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 noPadding"> 
                          <ul className="nav nav-tabs tabs-left sideways">
                            <li className="active col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#timeFormat" data-toggle="tab">Time Format</a></li>
                            <li className="col-lg-12 col-md-12 col-xs-12 col-sm-12"><a className="tabLeft lettersp tablefthr" href="#profitMargin" data-toggle="tab">Profit Margin</a></li>
                          </ul>   
                      </div>
                      <div className="tab-content col-lg-9 col-md-9 col-xs-12 col-sm-12">  
                        <div className="tab-pane active" id="timeFormat">  <TimeFormat/>  </div>                           
                        <div className="tab-pane" id="profitMargin">       <ProfitMargin/>  </div>
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
export default Preferences;