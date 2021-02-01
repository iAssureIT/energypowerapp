import React, { Component }     from 'react';
import { render }               from 'react-dom';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import TwoFieldForm             from '../../../coreadmin/Master/TwoFieldForm/TwoFieldForm.js';
import 'bootstrap/js/tab.js';

class ReimbursementList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "locationType": "",

            "oneFields" : {
                placeholder : "Add the name of entity & press 'Enter' Key",
                title       : "Vehicle Type",
                attributeName : "vehicleType"
            },
            "oneTableHeading": {
                vehicleType: "Vehicle Type",
                actions: 'Action',
            },
            "oneTableObjects": {
                deleteMethod: 'delete',
                apiLink: '/api/vehiclemaster/',
                paginationApply: false,
                searchApply: false,
                editUrl: this.props.editUrl+'/oneField',
                editUrl1: this.props.editUrl,
            },

            "fields" : {
                placeholder          : "Enter price per km",
                title                : "Fuel Reimbursement (in Rs.) / KM",
                secondtitle          : "Vehicle Type",
                attributeName        : "fuelReimbursement",
                secondAttributeId    : "vehicle_id",
                secondAttributeName  : "vehicleType"
            },
            "tableHeading": {
                vehicleType         : "Vehicle Type",
                fuelReimbursement   : "Fuel Reimbursement (in Rs.) / KM ",
                actions             : 'Action',
            },
            "tableObjects": {
                deleteMethod    : 'delete',
                apiLink         :'/api/fuelReimbursement/',
                apiLink2        :'/api/vehiclemaster/',
                paginationApply : false,
                searchApply     : false,
                editUrl         : this.props.editUrl
            },
            "startRange": 0,
            "limitRange": 10,
            "editId": '',
            "oneeditId": ''

        };
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                        <TwoFieldForm   
                            fields          = {this.state.fields}
                            tableHeading    = {this.state.tableHeading}
                            tableObjects    = {this.state.tableObjects}
                            editId          = {this.props.editId}
                            oneFields       = {this.state.oneFields}
                            oneTableHeading = {this.state.oneTableHeading}
                            oneTableObjects = {this.state.oneTableObjects}
                            oneeditId       = {this.props.oneFieldEditId}
                            history         = {this.props.history}
                            input_type      ="number"   
                        />
                    </div> 
                </div>
            </div>
        )
    }
}
export default ReimbursementList;