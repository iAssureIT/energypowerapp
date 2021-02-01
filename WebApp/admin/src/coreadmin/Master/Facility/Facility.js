import React, { Component }     from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import IAssureTable             from '../../IAssureTable/IAssureTable.jsx';
import TwoFieldForm             from '../TwoFieldForm/TwoFieldForm.js';

import _ from 'underscore';
import 'bootstrap/js/tab.js';

class Facility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "fields" : {
                placeholder          : "Add facility & press 'Enter' Key.",
                title                : "Module",
                secondtitle          : "Facility",
                attributeName        : "facility",
                secondAttributeId    : "moduleId",
                secondAttributeName  : "moduleName"
            },
            "tableHeading": {
                moduleName       : "Module",
                facility         : "Facility",
                actions          : 'Action',
            },
            "tableObjects": {
                deleteMethod: 'delete', 
                apiLink  :'/api/facilitymaster/',
                apiLink2 :'/api/modulemaster/',
                paginationApply: false,
                searchApply: false,
                editUrl: '/facility'
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
    }
     componentWillReceiveProps(nextProps) {
        var editId = nextProps.match.params.fieldID;
        if (nextProps.match.params.fieldID) {
            this.setState({
                editId: editId
            })
        }
    }

    render() {
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <TwoFieldForm fields={this.state.fields}
                          tableHeading={this.state.tableHeading}
                          tableObjects={this.state.tableObjects}
                          editId ={this.props.match.params.fieldID}
                          history={this.props.history} />

            </div>
        );
    }
}
export default Facility;

