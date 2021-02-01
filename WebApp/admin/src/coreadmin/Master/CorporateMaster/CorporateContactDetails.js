import React, { Component } from 'react';
import 'bootstrap/js/tab.js';

import ContactDetails from '../EntityMaster/Onboarding/contactDetails/ContactDetails.jsx';

function CorporateContactDetails(){
    return (
        <div className="">
            <ContactDetails entity="corporate" 
                            roles={['employee','manager','corporateadmin']} 
                            userRole="employee" 
                            bookingRequired={true}
            />
        </div>
    );
}
export default CorporateContactDetails;

