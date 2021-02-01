import React, { Component }     from 'react';
import TwoFieldForm             from '../../coreadmin/Master/TwoFieldForm/TwoFieldForm.js';
import _ from 'underscore';
import 'bootstrap/js/tab.js';

class DocumentsRequired extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "locationType": "",
            "fields" : {
                placeholder          : "Enter Document Name",
                title                : "Documents Entity",
                secondtitle          : "Documents Name",
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
                apiLink2        :'/api/documententitymaster',
                paginationApply : false,
                searchApply     : false,
                editUrl         : '/project-master-data'
            },
            "startRange": 0,
            "limitRange": 10,
            "editId": ''

        };
    }


    render() {
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <TwoFieldForm   fields={this.state.fields}
                                tableHeading={this.state.tableHeading}
                                tableObjects={this.state.tableObjects}
                                editId ={this.props.editId}
                                masterFieldForm = {true}                                    
                                history={this.props.history} 
                />
            </div>
        );
    }
}
export default DocumentsRequired;

