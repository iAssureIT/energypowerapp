import React, { Component } from 'react';
import 'bootstrap/js/tab.js';

import LocationDetails from '../EntityMaster/Onboarding/locationDetails/LocationDetails.jsx';

function CorporateLocationDetails() {
    return (
        <div className="">
            <LocationDetails entity="corporate" />
        </div>
    );
}
export default CorporateLocationDetails;

