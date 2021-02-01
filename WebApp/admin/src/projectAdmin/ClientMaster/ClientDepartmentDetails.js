import React, { Component } from 'react';
import jQuery from 'jquery';
import 'bootstrap/js/tab.js';

import DepartmentDetails from '../Master/EntityMaster/Onboarding/departmentDetails/DepartmentDetails.jsx';

function ClientDepartmentDetails(props) {
    return (
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <DepartmentDetails 
            	entity 		= "client" 
            	entityID 	= {props.entityID}
                modal		= {props.modal ? props.modal : false} 
                url 		= {props.url ? props.url : "client"}
            />
        </div>
    );
}
export default ClientDepartmentDetails;