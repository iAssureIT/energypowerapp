import React, { Component } from 'react';
import jQuery from 'jquery';
import 'bootstrap/js/tab.js';

import BasicInfo from '../Master/EntityMaster/Onboarding/basicInfo/BasicInfo.jsx';

function ClientBasicInfo(props) {
    return (
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <BasicInfo entity="client" modal={props.modal ? props.modal : false} url={props.url ? props.url : "client"}/>
        </div>
    );
}
export default ClientBasicInfo;



