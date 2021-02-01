import React, { Component } from 'react';
import { render }           from 'react-dom';
import TimePicker           from 'rc-time-picker';
import moment               from 'moment';
import jQuery               from 'jquery';
import $                    from 'jquery';
import OneFieldForm         from '../OneFieldForm/OneFieldForm.js';
import 'rc-time-picker/assets/index.css';

const format = "h:mm a";
class CityType extends Component{
   constructor(props) {
    super(props);
    this.state = {
       fields : {
        placeholder : "Enter Your City Type",
        title       : "City Type",
        attributeName : "cityType"
      },
      "tableHeading": {
          cityType: "City Type",
          actions: 'Action',
      },
      "tableObjects": {
          deleteMethod: 'delete',
          apiLink: '/api/citytypemaster/',
          paginationApply: false,
          searchApply: false,
          editUrl: '/project-master-data'
      },
      "startRange": 0,
      "limitRange": 10,
      "editId": ''
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

 export default CityType;