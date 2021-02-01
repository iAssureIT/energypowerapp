import React, { Component } from 'react';
import jQuery from 'jquery';
import 'bootstrap/js/tab.js';

import ListOfEntities from '../EntityMaster/listOfEntities/components/ListOfEntities.jsx';

function CorporateListOfEntities(){
    return (
    	
        <div className="">
            <ListOfEntities entity="corporate" />
        </div>
    );
}
export default CorporateListOfEntities;