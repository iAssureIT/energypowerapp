import React, { Component } 	from 'react';
import { render } 				from 'react-dom';
import TrackerReact 			from 'meteor/ultimatejs:tracker-react';
import {State} 					from '/imports/admin/masterData/manageLocation/components/State/component/state.js';
import {Area} 				from '/imports/admin/masterData/manageLocation/components/Area/component/Area.js';
import swal          			from 'sweetalert';


export default class Addareadatalist extends TrackerReact(Component) {
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
	editarea(event){
	  event.preventDefault();
      var areaId    = event.target.id;
      var areaName  = {"area":$("input[name="+areaId+"-Namecity]").val(),}

      Meteor.call('updateArea', areaId, areaName,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    else {
                    	swal("Area updated successfully!!");
                    }//the _id of new object if successful
                }
        );	

	}

	deleteArea(event){
	  event.preventDefault();
	  Meteor.call('deleteArea', event.currentTarget.id,
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
	    countryName		: this.props.areavalues.countryName,
	    stateName		: this.props.areavalues.stateName,
	    cityName	: this.props.areavalues.cityName,
	    area      : this.props.areavalues.area,
	  };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	}

	render(){

       return(
				<tr>
					<td className="rolelst textalignTaluka"> {this.props.areavalues.countryName}	</td>	
					<td className="rolelst textalignTaluka"> {this.props.areavalues.stateName}	</td>			
					<td className="rolelst textalignTaluka"> {this.props.areavalues.cityName}	</td>	
					<td className="rolelst textalignTaluka"> {this.props.areavalues.area}	</td>	
					<td className="roletbl textalignTaluka	"> 
						<a className="editrole fa fa-pencil-square-o editbtns editbtns1 editbtnshvr" data-toggle="modal" data-target={`#edit-${this.props.areavalues._id}`} ></a>

						
						<div id={`edit-${this.props.areavalues._id}`} className="modal fade" role="dialog">
						  <div className="modal-dialog">

						    
						    <div className="modal-content reportWrapper">
						      <div className="modal-header">
						        <button type="button" className="close" data-dismiss="modal">&times;</button>
						        <h4 className="modal-title edittitle">Edit Area</h4>
						      </div>
						      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<form className="editroles">
										<div className="form-group col-lg-8 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
											<label className="statelabel">Area Name</label>
											<input type="text" ref="roleName" className="form-control rolesField" name={`${this.props.areavalues._id}-Namecity`} defaultValue={`${this.state.area}`} onChange={this.handleChange.bind(this)} required/>
										</div>
										<div className="form-group col-lg-2 col-md-4 col-xs-12 col-sm-12 ">
											<label>&nbsp;</label>
										    <button type="button" onClick={this.editarea.bind(this)} id={this.props.areavalues._id} className="btn btn-temp submit" data-dismiss="modal">Update</button>
										</div>
									</form>
						      </div>
						      <div className="modal-footer">
						      </div>
						    </div>

						  </div>
						</div>
						&nbsp;&nbsp;
						
						<a className= "roleDelete fa fa-trash delIcon detailsCenter editbtns btn-danger editbtns1 editbtnred" data-toggle="modal" data-target={`#del-${this.props.areavalues._id}`}></a>

						 <div className="modal fade" id={`del-${this.props.areavalues._id}`} role="dialog">
						    <div className="modal-dialog modal-sm">
						      <div className="modal-content">
						        <div className="modal-header">
						          <button type="button" className="close" data-dismiss="modal">&times;</button>
						        {/*  <h4 className="modal-title">Delete Taluka</h4>*/}
						        </div>
						        <div className="modal-body">
						          <p><b>The Area will be deleted. Are you sure you want to continue?.</b></p>
						        </div>
						        <div className="modal-footer">
						          <button  onClick={this.deleteArea.bind(this)} id={this.props.areavalues._id} type="button" data-dismiss="modal" className="btn btn-danger btndeleterole deleteRole" >Delete</button>
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