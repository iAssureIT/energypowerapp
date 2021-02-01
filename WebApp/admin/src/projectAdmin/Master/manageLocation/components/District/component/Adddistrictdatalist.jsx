import React, { Component } 	from 'react';
import { render } 				from 'react-dom';
import TrackerReact 			from 'meteor/ultimatejs:tracker-react';
import {State} 					from '/imports/admin/masterData/manageLocation/components/State/component/state.js';
import swal 					from 'sweetalert';

export default class Adddistrictdatalist extends TrackerReact(Component) {
	componentDidMount(){
		
		if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
	      // console.log("I am appended!");
	      var adminLte = document.createElement("script");
	      adminLte.type = "text/javascript";
	      adminLte.src = "/js/adminLte.js";
	      adminLte.setAttribute('id','adminLte');
	      $("body").append(adminLte);
	    }
	}
	editDistrict(event){
	  event.preventDefault();
      var districtId    = event.target.id;
      var districtName  = {"district":$("input[name="+districtId+"-Namedistrict]").val(),}

      Meteor.call('updateDistrict', districtId, districtName,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    else {
                    	swal("District updated successfully!!");
                    }//the _id of new object if successful
                }

// 
        );	

	}

	deleteDistrict(event){
	  event.preventDefault();
	  Meteor.call('deleteDistrict', event.currentTarget.id,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    
                });	

	}

	handleChange(event){
	    this.setState({value: event.target.value});
	}

	 handleSubmit(event) {
	    event.preventDefault();
	}

	constructor(props) {
	  super(props);
	  this.state = {
	    countryName	: this.props.districtvalues.countryName,
	    stateName	: this.props.districtvalues.stateName,
	    districtName: this.props.districtvalues.districtName,
	  };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	}

	render(){

       return(
				<tr>
					<td className="rolelst"> {this.props.districtvalues.countryName}</td>	
					<td className="rolelst"> {this.props.districtvalues.stateName}</td>			
					<td className="rolelst"> {this.props.districtvalues.districtName}</td>	
					<td className="roletbl"> 
						<a className="editrole fa fa-pencil-square-o editbtns editbtns1 editbtnshvr" data-toggle="modal" data-target={`#edit-${this.props.districtvalues._id}`} ></a>

						
						<div id={`edit-${this.props.districtvalues._id}`} className="modal fade" role="dialog">
						  <div className="modal-dialog">

						    
						    <div className="modal-content reportWrapper">
						      <div className="modal-header">
						        <button type="button" className="close" data-dismiss="modal">&times;</button>
						        <h4 className="modal-title edittitle ">Edit District</h4>
						      </div>
						      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<form className="editroles">
										<div className="form-group col-lg-8 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
											<label className="statelabel">District Name</label>
											<input type="text" ref="roleName" className="form-control rolesField" name={`${this.props.districtvalues._id}-Namedistrict`} defaultValue={`${this.state.districtName}`} onChange={this.handleChange.bind(this)} required/>
										</div>
										<div className="form-group col-lg-2  col-md-4 col-xs-12 col-sm-12 ">
											<label>&nbsp;</label>
										    <button type="button" onClick={this.editDistrict.bind(this)} id={this.props.districtvalues._id} className="btn btn-temp submit" data-dismiss="modal">Update</button>
										</div>
									</form>
						      </div>
						      <div className="modal-footer">
						      </div>
						    </div>

						  </div>
						</div>
						&nbsp;&nbsp;
						
						<a className= "roleDelete fa fa-trash delIcon detailsCenter editbtns btn-danger editbtns1 editbtnred" data-toggle="modal" data-target={`#del-${this.props.districtvalues._id}`}></a>

						 <div className="modal fade" id={`del-${this.props.districtvalues._id}`} role="dialog">
						    <div className="modal-dialog modal-sm">
						      <div className="modal-content">
						        <div className="modal-header">
						          <button type="button" className="close" data-dismiss="modal">&times;</button>
						      {/*    <h4 className="modal-title">Delete District</h4>*/}
						        </div>
						        <div className="modal-body">
						          <p><b>The District will be deleted. Are you sure you want to continue?.</b></p>
						        </div>
						        <div className="modal-footer">
						          <button  onClick={this.deleteDistrict.bind(this)} id={this.props.districtvalues._id} type="button" data-dismiss="modal" className="btn btn-danger btndeleterole deleteRole" >Delete</button>
				    			  <button type="button" data-dismiss="modal" className="btn btn-temp ">Cancel</button>
						        </div>
						      </div>
						    </div>
						  </div>

					</td>		
				</tr>
	    );

	} 

}