import React, { Component } from 'react';
import { render } 			from 'react-dom';
// import TrackerReact 		from 'meteor/ultimatejs:tracker-react';
import {Countries} 	 		from '/imports/admin/masterData/manageLocation/components/Country/component/Countries.js';
import swal 				from 'sweetalert';
export default class AddCountrydatalist extends Component {


	constructor(props) {
		super(props);
		this.state = {
			countryName: this.props.countryvalues.countryName,
		};

		this.handleChange = this.handleChange.bind(this);
		
	}
	

	editcountry(event){
	  event.preventDefault();
      var countryId    = event.target.id;
      var countryName  = {
      	"country": $("input[name="+countryId+"-Namecountry]").val(),
      }
      Meteor.call('updateCountries', countryId, countryName,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    else {
                    	swal("Country updated successfully!!")
                    }//the _id of new object if successful
                }
        )
  	}

	delcountry(event){
	  event.preventDefault();
	  Meteor.call('deleteCountries', event.currentTarget.id,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    
                });	

	}

	handleChange(event){
	    this.setState({value: event.target.value});
	}



	render(){
		
       return(
				<tr>
					<td className="rolelst"> {this.props.countryvalues.countryName}</td>			
					<td className="roletbl"> 
				   <a href="#" className="editrole fa fa-pencil-square-o editbtns editbtns1 editbtnshvr" data-toggle="modal" data-target={`#editCountry-${this.props.countryvalues._id}`} ></a>

						
				   <div id={`editCountry-${this.props.countryvalues._id}`} className="modal fade" role="dialog">
					   <div className="modal-dialog">


						   <div className="modal-content reportWrapper">
							   <div className="modal-header">
								   <button type="button" className="close" data-dismiss="modal">&times;</button>
										 <h4 className="modal-title edittitle">Edit Country</h4>
							   </div>
							   <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
								   <form className="editroles">
									   <div className="form-group col-lg-8 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
										   <label className="statelabel">Country Name</label>
										   <input type="text" ref="roleName" className="form-control rolesField" name={`${this.props.countryvalues._id}-Namecountry`} defaultValue={`${this.state.countryName}`} onChange={this.handleChange.bind(this)} required />
									   </div>
									   <div className="form-group col-lg-2 col-md-4 col-xs-12 col-sm-12 ">
										   <label>&nbsp;</label>
										   <button type="button" onClick={this.editcountry.bind(this)} id={this.props.countryvalues._id} className="btn btn-temp submit" data-dismiss="modal">Update</button>
									   </div>
								   </form>
							   </div>
							   <div className="modal-footer">
								   {/*  <button type="button" className="btn btn-temp" data-dismiss="modal">Close</button>*/}
							   </div>
						   </div>

					   </div>
				   </div>

				   	&nbsp;&nbsp;
						
						<a className= "roleDelete fa fa-trash delIcon detailsCenter editbtns btn-danger editbtns1 editbtnred" data-toggle="modal" data-target={`#del-${this.props.countryvalues._id}`}></a>

						 <div className="modal fade" id={`del-${this.props.countryvalues._id}`} role="dialog">
						    <div className="modal-dialog modal-sm">
						      <div className="modal-content">
						        <div className="modal-header">
						          <button type="button" className="close" data-dismiss="modal">&times;</button>
						         {/* <h4 className="modal-title">Delete </h4>*/}
						        </div>
						        <div className="modal-body">
						          <p><b>Country will be deleted. Are you sure you want to continue?.</b></p>
						        </div>
						        <div className="modal-footer">
						          <button  onClick={this.delcountry.bind(this)} id={this.props.countryvalues._id} type="button" data-dismiss="modal" className="btn btn-danger btndeleterole deleteRole" >Delete</button>
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