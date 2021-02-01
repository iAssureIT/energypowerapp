

import React, { Component, PropTypes } from 'react';

class UMDelRolRow extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <option  value={`remove$${this.props.roleDataVales}`} name="userListDDOption">Remove {this.props.roleDataVales} Role to Selected </option>
        );
    }
}

export default UMDelRolRow;
