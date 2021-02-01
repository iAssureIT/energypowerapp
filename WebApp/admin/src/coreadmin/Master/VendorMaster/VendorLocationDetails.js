import React, { Component } from 'react';
import 'bootstrap/js/tab.js';

import LocationDetails from '../EntityMaster/Onboarding/locationDetails/LocationDetails.jsx';

function VendorLocationDetails() {
    return (
        <div className="">
            <LocationDetails entity="vendor" />
        </div>
    );
}
export default VendorLocationDetails;

