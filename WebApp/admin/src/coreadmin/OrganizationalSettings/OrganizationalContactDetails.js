import React, { Component } from 'react';
import ContactDetails from '../Master/EntityMaster/Onboarding/contactDetails/ContactDetails.jsx';
import _ from 'underscore';
import 'bootstrap/js/tab.js';

class OrganizationalContactDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    componentWillReceiveProps(nextProps) {
    
    }
    render() {
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <ContactDetails entity="appCompany" 
                 roles={['employee','manager','admin']} 
                 bookingRequired={false}
                />
            </div>
        );
    }
}
export default OrganizationalContactDetails;

