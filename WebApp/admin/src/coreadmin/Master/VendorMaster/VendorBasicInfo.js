import React, { Component } from 'react';
import 'bootstrap/js/tab.js';

import BasicInfo from '../EntityMaster/Onboarding/basicInfo/BasicInfo.jsx';

function VendorBasicInfo() {
    return (
        <div className="">
            <BasicInfo entity="vendor" />
        </div>
    );
}
export default VendorBasicInfo;

