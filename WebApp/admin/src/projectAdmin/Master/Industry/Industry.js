import React, { Component } from 'react';
import $                    from 'jquery';
import jQuery               from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import _                    from 'underscore';
import OneFieldForm         from '../../../coreadmin/Master/OneFieldForm/OneFieldForm.js';
import 'bootstrap/js/tab.js';


class industry extends Component{
   constructor(props) {
    super(props);
    this.state = {
      "tableHeading": {
          industry: "Industry",
          actions: 'Action',
      },
      "tableObjects"  : 
      {
          deleteMethod   : 'delete',
          apiLink        : '/api/industryMaster/',
          paginationApply: false,
          searchApply    : false,
          editUrl        : this.props.editUrl,
          listUrl        : '/project-master-data',
      },
          "startRange"   : 0,
          "limitRange"   : 10,
          "fields"       : 
      {
            placeholder   : "Enter Industry...",
            title         : "Industry",
            attributeName : "industry"
      }
    };
  } 

 
    render() {
        return (
            <div className="container-fluid">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                  <OneFieldForm fields={this.state.fields}
                                tableHeading={this.state.tableHeading}
                                tableObjects={this.state.tableObjects}
                                editId ={this.props.editId}
                                masterFieldForm = {true}                              
                                history={this.props.history} />
                </div>
              </div>
            </div>
        );
    }
}
export default industry;

