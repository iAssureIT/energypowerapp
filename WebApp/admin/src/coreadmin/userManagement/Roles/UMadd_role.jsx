import React, { Component } from 'react';
import { render } from 'react-dom';

export default class UMadd_role extends Component {

	editRole(event){
	 
	}

	delRole(event){}

	handleChange(event){}

	 handleSubmit(event) {}

	constructor(props) {
	  super(props);
	  this.state = {};

	}

	render(){

       return(
				<tr>
					<td className="textAlignLeft"></td>			
					<td className="roleTextCenter"> 						
						<i className="fa fa-pencil editTcon editIcon" data-toggle="modal" data-target="#edit" title="Edit Department Name" ></i>
						&nbsp;&nbsp;
						<i className="deleteIcon roleDelete  redFont fa fa-trash delIcon detailsCenter"  id="" title="Edit Department Name" ></i>
					</td>		
					<div id="edit" className="modal col-lg-12 col-md-12 col-sm-12 col-xs-12" role="dialog">
					  <div className="modal-dialog adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12" role="document">
					    <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
					      <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
					        <h4 className="WightFont textAlignCenter col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel1">Edit Role</h4>
					        <div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-12 NOpadding-left NOpadding-right">
                              	<button type="button" className="adminCloseButton" data-dismiss="modal" data-target="edit">&times;</button>
                            </div>
					      </div>
					      <div className="modal-body addressModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
								<form className="editroles">
									<div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-xs-12 col-sm-12 paddingLeftz addRoleMarginBtm">
										<label className="textAlignLeft labelform">Role Name</label>
										<input type="text" ref="roleName" className="form-control rolesField" required/>
									</div>
									<div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<div className="form-group col-lg-4 col-lg-offset-8 col-md-4 col-md-offset-8 col-xs-12 col-sm-12">
											<label>&nbsp;</label>
										    <button type="button" id="" className="btn adminFinish-btn" data-dismiss="modal">Edit Role</button>
										</div>
									</div>
								</form>
					      </div>
					    </div>

					  </div>
					</div>
				</tr>
	    );

	} 

}