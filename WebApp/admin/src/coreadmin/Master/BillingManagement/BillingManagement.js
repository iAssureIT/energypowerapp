import React, { Component }     from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios                    from 'axios';
import moment                   from 'moment';
import _                        from 'underscore';
import GenerateBill             from "./GenerateBill.js";
import UnpaidBills              from "./UnpaidBills.js";
import PaidBills                from "./PaidBills.js";
import CancelledBills           from "./CancelledBills.js";

import "./BillingManagement.css";
import 'bootstrap/js/tab.js';

class BillingManagement extends Component {
     
    constructor(props) {
        super(props);
        this.state = {
          tabtype       : "GenerateBills",
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
          axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");

    }

    changeTab = (data)=>{
      this.setState({
        tabtype : data,
      })
    }
   handleChange(event) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: event.target.value
        });   
    }



  render() {
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
        <section className="content">   
          <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="box-header with-border manageLocationTitle">
                 <h4 className="">Billing Management</h4>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                 <div className="reportWrapper col-lg-12 nopadding">
                      <div className="nav-center col-lg-10 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12">
                           <ul className="nav nav-pills nav_pills">
                                <li className="active col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                    <a href="#GenerateBills" data-toggle="tab" className="TabName" onClick={()=>this.changeTab('GenerateBills')} >
                                      Generate Bills
                                    </a>
                                </li>
                                <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                    <a href="#UnpaidBills" data-toggle="tab" className="TabName" onClick={()=>this.changeTab('UnpaidBills')}>
                                      Unpaid Bills
                                    </a>
                                </li>
                                <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                    <a href="#PaidBills" data-toggle="tab" className="TabName"  onClick={()=>this.changeTab('PaidBills')} >
                                      Paid Bills
                                    </a>
                                </li>
                                <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                    <a href="#CancelledBills" data-toggle="tab" className="TabName" onClick={()=>this.changeTab('CancelledBills')} >
                                      Cancelled Bills
                                    </a>
                                </li>
              
                           </ul>
                      </div>
                        <div className="tab-content col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="tab-pane active" id="GenerateBills">
                              <GenerateBill />
                            </div>
                            <div className="tab-pane" id="UnpaidBills">
                              <UnpaidBills />
                            </div>
                            <div className="tab-pane" id="PaidBills">
                              <PaidBills />
                            </div>
                            <div className="tab-pane" id="CancelledBills">
                              <CancelledBills />
                            </div>
                        </div>
                        
                 </div>
            </div>
          </div>
         </section>
      </div>
    );
  }
}
export default BillingManagement;

