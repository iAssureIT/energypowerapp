import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class UMeditRoles extends TrackerReact(Component) {


	editRole(event){
	  event.preventDefault();
      var roleId    = event.target.id;
      var roleName  = $("input[name="+roleId+"-Namerole]").val();

      Meteor.call('updaterole', roleId, roleName,
                function(error, result) { 
                    if (error) {
                    } //info about what went wrong 
                    else {
                    }//the _id of new object if successful
                }


        );	

	}
	
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

	constructor(props) {
	  super(props);
	  this.state = {
	    firstName: props.firstName,
	  };
	}

	render(){

       return(
			<form className="editroles">
				<div className="form-group col-lg-5 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
					<label>Role Name*</label>
					<input type="text" className="form-control rolesField" name={`${this.props.roleDataVales._id}-Namerole`} value={this.props.roleDataVales.name} onChange={this.handleChange} required/>
				</div>
				<div className="form-group col-lg-1 col-md-4 col-xs-12 col-sm-12 ">
					<label>&nbsp;</label>
				    <button type="button" onClick={this.editRole.bind(this)} id={this.props.roleDataVales._id} className="btn btn-primary submit" data-dismiss="modal">Edit Role</button>
				</div>
			</form>
	    );

	} 

}