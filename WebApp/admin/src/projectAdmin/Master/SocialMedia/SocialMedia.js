import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import OneFieldForm         from '../../../coreadmin/Master/OneFieldForm/OneFieldForm.js';

import 'bootstrap/js/tab.js';

class SocialMedia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socialMedia: "",
            "fields" : {
                    placeholder   : "Enter social media..",
                    title         : "Social Media",
                    api           : "/api/vendorCategory/",
                    attributeName : "socialMedia",
                    hasImage      : true
                },
            "tableHeading": {
                socialMedia     : "Social Media",
                iconUrl      : "Social Icon",
                actions         : 'Action',
            },
            "tableObjects": {
                deleteMethod: 'delete',
                apiLink: '/api/socialmediamaster/',
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
                        <OneFieldForm   fields={this.state.fields}
                                        tableHeading={this.state.tableHeading}
                                        tableObjects={this.state.tableObjects}
                                        editId ={this.props.editId}
                                        masterFieldForm = {true}
                                        history={this.props.history}  />
                    </div>
                </div>
            </div>
        );
    }
}
export default SocialMedia;

