import React, { Component } from 'react';
import { render }           from 'react-dom';
import TimePicker           from 'rc-time-picker';
import moment               from 'moment';
import jQuery               from 'jquery';
import $                    from 'jquery';
import OneFieldForm         from '../../../coreadmin/Master/OneFieldForm/OneFieldForm.js';
import 'rc-time-picker/assets/index.css';

const format = "h:mm a";
class CameraModel extends Component{
   constructor(props) {
    super(props);
    this.state = {
      "tableHeading": {
          equipmentModel: "Equipment Model",
          actions: 'Action',
      },
      "tableObjects": {
          deleteMethod: 'delete',
          apiLink: '/api/equipmentModel/',
          paginationApply: false,
          searchApply: false,
          editUrl: this.props.editUrl,
          listUrl        : '/project-master-data',
      },
      "startRange": 0,
      "limitRange": 10,
      fields : {
        placeholder : "Enter Equipment Model No ..",
        title       : "Equipment Model",
        attributeName : "equipmentModel"
      },
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

 export default CameraModel;