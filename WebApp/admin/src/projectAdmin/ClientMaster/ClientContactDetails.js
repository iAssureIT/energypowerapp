import React, { Component } from 'react';
import 'bootstrap/js/tab.js';

import ContactDetails from '../Master/EntityMaster/Onboarding/contactDetails/ContactDetails.jsx';

function ClientContactDetails(props){
    return (
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <ContactDetails entity="client" 
                            roles={['manager','client']} 
                            userRole="employee" 
                            entity="client" 
                            entityID={props.entityID}
                            modal={props.modal ? props.modal : false} 
                            url={props.url ? props.url : "client"}
            />
        </div>
    );
}
export default ClientContactDetails;

