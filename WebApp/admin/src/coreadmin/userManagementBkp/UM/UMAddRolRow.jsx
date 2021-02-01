
import React, { Component, PropTypes } from 'react';

class UMAddRolRow extends Component {

    constructor(props) {
        super(props);
    }

    render() {
    	var name = this.props.roleDataVales;
        return (
            <option  value={`add$${this.props.roleDataVales}`} name="userListDDOption">Add {this.props.roleDataVales} Role to Selected </option>
        );
    }
}

export default UMAddRolRow;
