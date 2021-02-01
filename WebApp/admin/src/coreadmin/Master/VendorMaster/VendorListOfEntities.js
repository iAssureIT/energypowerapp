import React, { Component } from 'react';
import jQuery from 'jquery';
import 'bootstrap/js/tab.js';

import ListOfEntities from '../EntityMaster/listOfEntities/components/ListOfEntities.jsx';

function VendorListOfEntities(){
    return (
    	
        <div className="">
            <ListOfEntities entity="vendor" />
        </div>
    );
}
export default VendorListOfEntities;