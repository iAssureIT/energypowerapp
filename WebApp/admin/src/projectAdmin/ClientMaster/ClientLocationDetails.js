import React, { Component } from 'react';
import 'bootstrap/js/tab.js';
import LocationDetails from '../Master/EntityMaster/Onboarding/locationDetails/LocationDetails.jsx';

function ClientLocationDetails(props) {
    return (
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <LocationDetails 
            	entity="client" 
            	entityID={props.entityID}
                modal={props.modal ? props.modal : false} 
                url={props.url ? props.url : "client"}
            />
        </div>
    );
}
export default ClientLocationDetails;

