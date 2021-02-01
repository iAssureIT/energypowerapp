import React, { Component } 		from 'react';
  import UMaddRoles 					from './UMaddRoles.jsx';
  import UMadd_role 					from './UMadd_role.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/js/modal.js';
import swal                       from 'sweetalert';


export default class UMRolesList extends Component {
	constructor(){
		super();
		this.state = {
				allPosts : [],
				startRange : 0,
				limitRange : 1000

		}
	}

	componentDidMount(){

		this.getdata();	

	}
	handleChange(event) {
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        this.setState({
            attributeName : event.target.value
        });
    }
	getdata(data){
	var data = {
		"startRange"        : this.state.startRange,
		"limitRange"        : this.state.limitRange, 
	}
	axios
	.get('/api/roles/get/list')
	.then(
		(res)=>{
			console.log("role res data=>>",res.data);
			const postsdata = res.data;
			this.setState({
				allPosts : postsdata,
			});
		}
	)
	.catch((error)=>{

		 });			
	}

	deleteRole(event){
		event.preventDefault();
	var id = event.target.id;
	const token = '';
	const url = '/api/roles/delete/'+id ;
	const headers = {
		    "Authorization" : token,
		    "Content-Type" 	: "application/json",
		};

		axios({
			method: "DELETE",
			url : url,
			headers: headers,
			timeout: 3000,
			data: null,
		})
		.then((response)=> {
			this.getdata();
		}).catch((error)=> {
		});
	}

	updateRole(event){
		event.preventDefault();
	    const formValues = {
	      "role"     : this.refs.role.value,
	    }
	    console.log(event.target.getAttribute('id'))
	    axios.put('/api/roles/put/'+event.target.getAttribute('id'), formValues)
        .then( (res)=>{
          swal("success", "Role is uppdated successfully" );
          this.refs.role.value = '';    
          this.props.getRoles()    
      })
      .catch((error)=>{
      });
	}
	render(){

       return(
			<div className="content">
				<div className=""></div>
				<section className="">
			        <div className="">
			          	<div className="">
	                        <div className="">
	                            <div className="box col-lg-12 col-md-12 col-xs-12 col-sm-12">
	                            	<div className=" col-lg-1 col-md-1 col-xs-1 col-sm-1 box-header with-border text-center">
                                         <h4 className="weighttitle"><a href="/UMListOfUsers"><i className="cursorpointer fa fa-chevron-circle-left"></i></a></h4>
                                    </div>
                                    <div className=" col-lg-11 col-md-11 col-xs-11 col-sm-11 box-header with-border">
                                         <h4 className="weighttitle">List of Roles</h4>
                                    </div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addRolesInWrap">
											<UMaddRoles getRoles={this.getdata.bind(this)} />
										<div className="table-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<table className="table iAssureITtable-bordered table-striped table-hover">
												<thead className="tempTableHeader">
													<tr className="">
														<th className="umDynamicHeader srpadd textAlignCenter"> Role </th>
														<th className="umDynamicHeader srpadd textAlignCenter"> Action </th>
													</tr>
												</thead>
												<tbody>
												{this.state.allPosts.map( (roleData, index)=>{
												   return( 
													<tr>
														<td className="textAlignLeft">{roleData.role}</td>		
														<td className="roleTextCenter"> 						
															<i className="fa fa-pencil editTcon editIcon"  data-toggle="modal" title="Delete" data-target={`#${roleData._id}-edit`} title="Edit Department Name" ></i>
															&nbsp;&nbsp;
															<i className="deleteIcon roleDelete  redFont fa fa-trash delIcon detailsCenter"  id="" title="Edit Department Name" data-toggle="modal" title="Delete" data-target={`#${roleData._id}-rm`} ></i>
														</td>

														<div className="modal col-lg-12 col-md-12 col-sm-12 col-xs-12" id={`${roleData._id}-rm`}  role="dialog">
										                    <div className=" modal-dialog adminModal adminModal-dialog">
										                         <div className="modal-content adminModal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
										                                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
															        		<h4 className="CreateTempModal col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel"></h4>
															        		<div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
																		        <button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
																		          <span aria-hidden="true">&times;</span>
																		        </button>
																	        </div>
															      		</div>
										                              <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">

										                                 <h4 className="blackFont textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 examDeleteFont">Are you sure you want to delete this role?</h4>
										                              </div>
										                              
										                              <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
										                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
										                                        <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
										                                   </div>
										                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
										                                        <button id={roleData._id} onClick={this.deleteRole.bind(this)} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
										                                   </div>
										                              </div>
										                         </div>
										                    </div>
										               </div>


										               <div className="modal col-lg-12 col-md-12 col-sm-12 col-xs-12" id={`${roleData._id}-edit`}  role="dialog">
										                    <div className=" modal-dialog adminModal adminModal-dialog">
										                         <div className="modal-content adminModal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
										                                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
															        		<h4 className="CreateTempModal col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel"></h4>
															        		<div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
																		        <button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
																		          <span aria-hidden="true">&times;</span>
																		        </button>
																	        </div>
															      		</div>
										                              <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
										                              
										                              <label className="textAlignLeft labelform">Role Name</label>
																		<input type="text" ref="roleName" className="form-control rolesField" value={roleData.role} onChange={this.handleChange.bind(this)} required/>
										                              </div>
										                              
										                              <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
										                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
										                                        <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
										                                   </div>
										                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
										                                        <button id={roleData._id} onClick={this.updateRole.bind(this)} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">SUBMIT</button>
										                                   </div>
										                              </div>
										                         </div>
										                    </div>
										               </div>


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
													)
													
													})
												}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
	

       		
	    );

	} 

}