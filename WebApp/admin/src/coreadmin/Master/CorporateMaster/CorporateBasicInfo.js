import React, { Component } from 'react';
import jQuery from 'jquery';
import 'bootstrap/js/tab.js';

import BasicInfo from '../EntityMaster/Onboarding/basicInfo/BasicInfo.jsx';

function CorporateBasicInfo() {
    return (
        <div className="">
            <BasicInfo entity="corporate" />
        </div>
    );
}
export default CorporateBasicInfo;



