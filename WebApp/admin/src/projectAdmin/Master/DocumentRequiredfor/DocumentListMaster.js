import React, { Component }     from 'react';
import { render }               from 'react-dom';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import TwoFieldForm             from '../../../coreadmin/Master/TwoFieldForm/TwoFieldForm.js';
import 'bootstrap/js/tab.js';

class DocumentsRequired extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "locationType": "",

            "oneFields" : {
                placeholder : "Add the name of entity & press 'Enter' Key",
                title       : "Document Entity",
                attributeName : "documententity"
            },
            "oneTableHeading": {
                documententity: "Document Entity",
                actions: 'Action',
            },
            "oneTableObjects": {
                deleteMethod: 'delete',
                apiLink: '/api/documententitymaster/',
                paginationApply: false,
                searchApply: false,
                editUrl: '/project-master-data/oneField',
                editUrl1: '/project-master-data'
            },

            "fields" : {
                placeholder          : "Enter Document Name",
                title                : "Documents Name",
                secondtitle          : "Documents Entity",
                attributeName        : "documentName",
                secondAttributeId    : "documententityId",
                secondAttributeName  : "documententity"
            },
            "tableHeading": {
                documententity      : "Documents Entity",
                documentName        : "Document  Name",
                actions             : 'Action',
            },
            "tableObjects": {
                deleteMethod    : 'delete',
                apiLink         :'/api/documentlistmaster/',
                apiLink2        :'/api/documententitymaster/',
                paginationApply : false,
                searchApply     : false,
                editUrl         : '/project-master-data'
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
                        />
                    </div> 
                </div>
            </div>
        )
    }
}
export default DocumentsRequired;

