import React, { Component, PropTypes } from 'react';
class UMSelectRoleUsers extends Component {
    render() {
        return (
            <option  value={this.props.roleDataVales} name="roleListDDOption">{this.props.roleDataVales}</option>	    
        );
    }
}
export default UMSelectRoleUsers;
