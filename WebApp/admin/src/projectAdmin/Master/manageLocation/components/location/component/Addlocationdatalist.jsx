import React, { Component } 	from 'react';
import { render } 				from 'react-dom';
import TrackerReact 			from 'meteor/ultimatejs:tracker-react';
import {Location} 			    from '/imports/admin/masterData/manageLocation/components/location/component/Location.js';
import swal          			from 'sweetalert';


export default class Addlocationdatalist extends TrackerReact(Component) {
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
	
	editlocation(event){
	  event.preventDefault();
      var locationId    = event.target.id;
      var locationName  ={"city": $("input[name="+locationId+"-Namecity]").val(),
      "pincode":$("input[name="+locationId+"-Namepincode]").val(),
      "area":$("input[name="+locationId+"-Namearea]").val(),}

      Meteor.call('updateLocation', locationId, locationName,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    else {
                    	swal("Location updated successfully!!");
                    }//the _id of new object if successful
                }
        );	

	}


	deleteLocation(event){
	  event.preventDefault();
	  Meteor.call('delLocation', event.currentTarget.id,
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
	  console.log("props",props);
	  this.state = {
	    countryName	 		 : this.props.locationValues.countryName,
	    stateName		 		 : this.props.locationValues.stateName,
	    districtName	 	 : this.props.locationValues.districtName,
	    
			blockloctn       : this.props.locationValues.blockloctn,
			cityloctn        : this.props.locationValues.cityloctn,
			arealoctn        : this.props.locationValues.arealoctn,
			pincodeloctn     : this.props.locationValues.pincodeloctn,
                    
	  };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	}

	render(){

       return(
				<tr>
					<td className="rolelst"> {this.props.locationValues.countryName}</td>	
					<td className="rolelst"> {this.props.locationValues.stateName}</td>			
					<td className="rolelst"> {this.props.locationValues.districtName}</td>	
					<td className="rolelst"> {this.props.locationValues.blockloctn}</td>	
					<td className="rolelst"> {this.props.locationValues.cityloctn}</td>	
					<td className="rolelst"> {this.props.locationValues.arealoctn}</td>	
					<td className="rolelst"> {this.props.locationValues.pincodeloctn}</td>	
					<td className="roletbl"> 
						<a className="editrole fa fa-pencil-square-o editbtns editbtns1 editbtnshvr" data-toggle="modal" data-target={`#edit-${this.props.locationValues._id}`} ></a>

						
						<div id={`edit-${this.props.locationValues._id}`} className="modal fade" role="dialog">
						  <div className="modal-dialog">

						    
						    <div className="modal-content reportWrapper">
						      <div className="modal-header">
						        <button type="button" className="close" data-dismiss="modal">&times;</button>
						        <h4 className="modal-title edittitle">Edit Area</h4>
						      </div>
						      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<form className="editroles">
										<div className="form-group col-lg-6 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
											<label className="statelabel">City/Village Name</label>
											<input type="text" ref="roleName" className="form-control rolesField" name={`${this.props.locationValues._id}-Namecity`} defaultValue={`${this.state.cityloctn}`} onChange={this.handleChange.bind(this)} required/>
										</div>
										<div className="form-group col-lg-6 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
											<label className="statelabel">Area</label>
											<input type="text" ref="roleName" className="form-control rolesField" name={`${this.props.locationValues._id}-Namearea`} defaultValue={`${this.state.arealoctn}`} onChange={this.handleChange.bind(this)} />
										</div>
										<div className="form-group col-lg-6 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
											<label className="statelabel">Pin Code</label>
											<input type="text" ref="roleName" className="form-control rolesField" name={`${this.props.locationValues._id}-Namepincode`} defaultValue={`${this.state.pincodeloctn}`} onChange={this.handleChange.bind(this)} required/>
										</div>
										<div className="form-group col-lg-6 col-md-4 col-xs-12 col-sm-12 pull-right btnpos">
											<label>&nbsp;</label>
										    <button type="button" onClick={this.editlocation.bind(this)} id={this.props.locationValues._id} className="btn btn-temp submit pull-right" data-dismiss="modal">Update</button>
										</div>
									</form>
						      </div>
						      <div className="modal-footer">
						      </div>
						    </div>

						  </div>
						</div>
						&nbsp;&nbsp;
						
						<a className= "roleDelete fa fa-trash delIcon detailsCenter editbtns btn-danger editbtns1 editbtnred" data-toggle="modal" data-target={`#del-${this.props.locationValues._id}`}></a>

						 <div className="modal fade" id={`del-${this.props.locationValues._id}`} role="dialog">
						    <div className="modal-dialog modal-sm">
						      <div className="modal-content">
						        <div className="modal-header">
						          <button type="button" className="close" data-dismiss="modal">&times;</button>
						          {/*<h4 className="modal-title">Delete Location</h4>*/}
						        </div>
						        <div className="modal-body">
						          <p><b>The Location will be deleted. Are you sure you want to continue?.</b></p>
						        </div>
						        <div className="modal-footer">
						          <button  onClick={this.deleteLocation.bind(this)} id={this.props.locationValues._id} type="button" data-dismiss="modal" className="btn btn-danger btndeleterole deleteRole" >Delete</button>
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