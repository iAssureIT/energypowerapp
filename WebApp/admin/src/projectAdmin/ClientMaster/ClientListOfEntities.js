import React, { Component } from 'react';
import jQuery from 'jquery';
import 'bootstrap/js/tab.js';

import ListOfEntities from '../Master/EntityMaster/listOfEntities/components/ListOfEntities.jsx';

function ClientListOfEntities(){
    return (
    	
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <ListOfEntities entity="client" />
        </div>
    );
}
export default ClientListOfEntities;