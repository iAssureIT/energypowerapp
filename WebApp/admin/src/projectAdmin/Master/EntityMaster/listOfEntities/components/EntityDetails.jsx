import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import {withRouter}  					from 'react-router-dom';
import swal                   from 'sweetalert';
import 'bootstrap/js/tab.js';
import '../css/ListOfEntity.css';
import '../css/ListOfEntityFilter.css';
import '../css/ListOfAllEntity.css';

class EntityDetails extends Component {
	constructor(props) {
      super(props);
      this.state = {
      	id 		      : this.props.id,
      	departments   : [],
      };
   }
  componentWillReceiveProps(nextProps){
  	$("html,body").scrollTop(0);
  	this.setState({
			id : nextProps.id
		},()=>{
			this.getEntitiesInfo(this.state.id)
		})
  }

	componentDidMount(){
		$("html,body").scrollTop(0);
		this.setState({
  			id : this.props.id
  		},()=>{
			this.getEntitiesInfo(this.state.id)
		})
  }
  getEntitiesInfo(id){
  	axios.get("/api/entitymaster/get/one/"+id)
      .then((response)=>{
        this.setState({
            entityInfo 	: response.data[0],
            contacts 	: response.data[0].contactData,
            locations 	: response.data[0].locations,
            departments : response.data[0].departments,
            entityType 	: response.data[0].entityType
        });
      })
      .catch((error)=>{
      })
  }

  LocationEdit(event){
    this.props.history.push("/"+this.state.entityType+'/location-details/'+event.currentTarget.getAttribute('data-entityID'))
  }
    
  contactEdit(event){
  	this.props.history.push("/"+this.state.entityType+'/contact-details/'+event.currentTarget.getAttribute('data-entityID'))
  }

  showMore(event) { 
		this.setState({
			'loadMoreLoc':true,
		})
	}

	showMoreContacts(event){
		this.setState({
			'loadMoreContacts':true,
		})
	}
	showLess(event) {
		this.setState({
			'loadMoreLoc':false,
		})
	}
	showLessContacts(event) {
		this.setState({
			'loadMoreContacts':false,
		})
	}
	editBasicform(event){
  	this.props.history.push("/"+this.state.entityType+'/basic-details/'+event.currentTarget.getAttribute('data-id'))
  }
  deleteEntity(event){
		event.preventDefault();
		this.setState({deleteID: event.currentTarget.getAttribute('data-id')})
		$('#deleteEntityModal').show();
  }

  confirmDelete(event){
  	event.preventDefault();
  	axios.delete("/api/entitymaster/delete/"+this.state.deleteID)
    .then((response)=>{
   		if (response.data.deleted) {
   			swal({
          text : (this.state.entityType === "appCompany" ? "Organizational Settings" :this.state.entityType) +" is deleted successfully.",
	  		});
			  $(".swal-text").css("text-transform", "capitalize");
	    }else{
   			swal({text : "Failed to delete.",});
   		}
      this.props.getEntities();
      this.props.hideForm();
      $('#deleteEntityModal').hide();   
    })
    .catch((error)=>{
    })
  }
  closeModal(event){
  	event.preventDefault();
  	$('#deleteEntityModal').hide(); 
  }
	render() {
    return (	
      this.state.entityInfo ? 
		    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding">
			    <div id="supplierprofile" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxshade noPadding">					   
			      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singleClientDetails" data-child={this.state.entityInfo._id} id={this.state.entityInfo._id}>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding borderAllED">
					    	<div  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blueBack ">
					    		<div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 ">
						    		<div className="col-lg-2 col-md-4 col-sm-4 col-xs-4 companyLogoImageView noPadding">
											<img src={this.state.entityInfo.companyLogo && this.state.entityInfo.companyLogo.length > 0?this.state.entityInfo.companyLogo[0]:"/images/noImagePreview.png"} className=""></img>
						    		</div>
					    		</div>
					    		<div className="col-lg-1 col-md-4 col-sm-4 col-xs-4 noPadding pull-right marginTop12 textAlignCenter">{this.state.entityInfo.profileStatus == "New"?<span className="newProfile" title="New Company Profile">New </span>:<span className="approvedProfile" title="Company Profile Approved">Approved </span>}</div>
					    		{/*<div className="col-lg-1 col-md-4 col-sm-4 col-xs-4 noPadding pull-right marginTop12 textAlignCenter">{this.state.entityInfo.profileStatus == "New"?<span className="newProfile" title="New Company Profile">New </span>:(this.state.entityInfo.profileStatus=="Acceted by corporateadmin" ? <i class="fa fa-check-circle greenColorED" title="Company profile Approved"aria-hidden="true"></i> : <i class="fa fa-times-circle-o redColorED" aria-hidden="true"></i>)}</div>*/}
						    </div>
						    <div className="col-lg-10 col-lg-offset-2 col-md-10 col-sm-10 col-xs-10 ">
					    		<div className="col-lg-12 col-md-4 col-sm-4 col-xs-4 orgHeadview">
					    			<label><a target="_blank" title="view company profile" href={"/company-profile/"+this.state.entityInfo._id}>{this.state.entityInfo.companyName}</a></label>&nbsp;&nbsp;<span>( Company ID: <b>{this.state.entityInfo.companyID}</b> )</span>
					    		</div>
						    	<div className="col-lg-1 col-md-2 col-sm-2 col-xs-2 editOptionView pull-right noPadding">
						    		<div id={this.state.entityInfo._id} className=" col-lg-6 noPadding"  title="Edit" data-index data-id={this.state.entityInfo._id} onClick={this.editBasicform.bind(this)}>	
									    <i className="fa fa-pencil "  aria-hidden="true" ></i>
									  </div>
									  <div id={this.state.entityInfo._id} className="col-lg-6 noPadding"  title="delete" data-index data-id={this.state.entityInfo._id} onClick={this.deleteEntity.bind(this)}>	
									    <i className="fa fa-trash "  aria-hidden="true" ></i>
									  </div>
						    	</div>
					    		<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 ">
					    			<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding listLI">
											<li><i className="fa fa-envelope changeColor " aria-hidden="true"></i>&nbsp;&nbsp;{this.state.entityInfo.companyEmail}</li>
											<li><i className="fa fa-phone changeColor" aria-hidden="true"></i>&nbsp;&nbsp;{this.state.entityInfo.companyPhone}</li>
											<li><i className="fa fa-globe changeColor " aria-hidden="true"></i>&nbsp;&nbsp;{this.state.entityInfo.website ? this.state.entityInfo.website :" - "}</li>
										</ul>
					    		</div>
					    		<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noPadding">
					    			<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding listLI">
											<li>CIN&nbsp; : <b>{this.state.entityInfo.CIN? this.state.entityInfo.CIN :" - "}</b>&nbsp;&nbsp;&nbsp;{this.state.entityInfo.COI && this.state.entityInfo.COI.length > 0 ? <a target="_blank" href={this.state.entityInfo.COI[0]}><img src={this.state.entityInfo.COI[0]} title="Click to view COI document" className="coiImage"></img></a>:""}</li>
											<li>TAN&nbsp; : <b>{this.state.entityInfo.TAN ? this.state.entityInfo.TAN : " - "}</b></li>
										</ul>
					    		</div>				   
						    </div>				   
						  </div>
						</div>
			      {
			      this.state.locations && this.state.locations.length>0 &&
			        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singleClientDetails">
								<div className="col-lg-12 col-md-1 col-sm-12 col-xs-12 noPadding">
									<h4>Locations</h4>
								</div>
								<div className="col-lg-12 col-md-1 col-sm-12 col-xs-12 noPadding">

								{console.log("this.state.locations-----------",this.state.locations)}
			        	{
									this.state.locations.map((locationArr,index)=>{
										return(
											<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 noPadding borderAllED" key={index}>
												<div  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding">
													<ul className="col-lg-6 col-md-12 col-sm-12 col-xs-12 locationUL ">
						        				<li><i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;<b> {locationArr.locationType}</b></li>
						        				<i className="textAlignLeft noPadding changeColor col-lg-1 width18px" aria-hidden="true"></i> <li className="col-lg-10 noPadding">#{(locationArr.addressLine1 ? locationArr.addressLine1 +" , "  : "")+locationArr.addressLine2 }</li>
						        				{ locationArr.GSTIN ?
						        					<li title="GSTIN Number" className="col-lg-12 noPadding"><i class="fa fa-credit-card" aria-hidden="true"></i>&nbsp; <b>GSTIN </b><br></br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ locationArr.GSTIN}</li>
						        					:null
						        				}
						        				{ locationArr.PAN?
						        					<li title="PAN Number"  className="col-lg-12 noPadding"><i class="fa fa-id-card" aria-hidden="true"></i>&nbsp; <b>PAN</b><br></br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ locationArr.PAN}</li>
						        					:null
						        				}
								        	</ul>
								        	<div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 noPadding">
								        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addGap"></div>
							        		{
							        			locationArr.GSTDocument&&locationArr.GSTDocument.length>0 ?
							        				locationArr.GSTDocument.map((doc,ind)=>{
							        					return (
							        						<div key={ind} className=" col-lg-2 col-md-3 col-sm-12 col-xs-12 NOpadding-left pull-right">
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding margin-bottom9" id="hide">
																	  {
	                                  (doc ? doc.split('.').pop() : "") === "pdf" || (doc ? doc.split('.').pop() : "") === "PDF" ?
	                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="LogoImageUpOne">
	                          						<a href={doc} target="_blank" className="imageOuterContainerED" title="Click to view"><img src="/images/pdf.png" className="img-responsive logoStyle" /></a>
	                                    </div>
	                                  :
	                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 " id="LogoImageUpOne">
																				<a href={doc} target="_blank"  className="imageOuterContainerED" title="Click to view"><img src={doc} className="img-responsive logoStyle" /></a>
																		  </div>
			                              }
																		</div>
																	</div>
							        					);
							        				})
						        				:
						        				null
						        			}
						        			</div>
						        			<div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 noPadding">
													{
														locationArr.PANDocument&& locationArr.PANDocument.length>0?
									        		locationArr.PANDocument.map((doc,ind)=>{
						        					return (
						        						<div key={ind} className=" col-lg-2 col-md-3 col-sm-12 col-xs-12 NOpadding-left pull-right">
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding margin-bottom9" id="hide">
																	{
		                              (doc ? doc.split('.').pop() : "") === "pdf" || (doc ? doc.split('.').pop() : "") === "PDF" ?
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 " id="LogoImageUpOne">
                          						<a href={doc} target="_blank" className="imageOuterContainerED" title="Click to view"><img src="/images/pdf.png" className="img-responsive logoStyle" /></a>
                                    </div>
                                    :
                                  	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 " id="LogoImageUpOne">
																	 		<a href={doc} target="_blank" className="imageOuterContainerED" title="Click to view"><img src={doc} className="img-responsive logoStyle" /></a>
																 		</div>}
																	</div>
																</div>
						        					);
									        		})
									        	:
									        	null
								          }
									        </div>	
												</div>
											</div>
										);
									})										
								}
								</div>
			      	</div>
			      }		
			      { /*contact Details*/ }
			      {
			      this.state.contacts && this.state.contacts.length>0 ?
			       	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singleClientDetails">
						<div className="col-lg-12 col-md-1 col-sm-12 col-xs-12 noPadding">
							<h4>Contact Details</h4>
						</div>
						<div className="col-lg-12 col-md-1 col-sm-12 col-xs-12 noPadding">
			        	{
							this.state.contacts.map((contact,index)=>{
								return(
									<div className="col-lg-12 col-md-1 col-sm-12 col-xs-12 noPadding coverPadding borderAllED">
										<ul className="col-lg-5 col-md-6 col-sm-6 col-xs-6 locationULContact noPadding">
				        			<li className="nameOfEmpED" ><a target="_blank" title="view profile" href={"/employee-profile/"+contact.personID}>{contact.firstName+" "+contact.lastName+" ( Emp ID : "+ (contact.employeeID?contact.employeeID:" - ") +" )"}</a></li>
				        			<li><i className="fa fa-envelope " aria-hidden="true" ></i>&nbsp;&nbsp;{contact.email}</li>
											<li><i className="fa fa-mobile "></i> &nbsp;&nbsp;{contact.phone ? contact.phone : " - "}</li>
					        	</ul>
									</div>
								);
							})
						}
						</div>
			        </div>	
			      :null		            
			      }
			      {
			      this.state.departments && this.state.departments.length>0 ?
			       	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singleClientDetails">
						<div className="col-lg-12 col-md-1 col-sm-12 col-xs-12 noPadding">
							<h4>Department Details</h4>
						</div>
						<div className="col-lg-12 col-md-1 col-sm-12 col-xs-12 noPadding">
						{
							this.state.departments.map((item,index)=>{
								return(
 									<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12  coverPadding borderAllED">
										<ul className="col-lg-12 col-md-12 col-sm-6 col-xs-6 locationULContact noPadding">
				        					<li><i className="fa fa-building " aria-hidden="true" ></i>&nbsp;&nbsp;{item.departmentName+" - "+item.projectName}</li>
					        			</ul>
									</div>
								);
							})
						}
						</div>
			        </div>	
			      :null		            
			      }
			    </div>
          <div className="modal" id="deleteEntityModal" role="dialog">
	          <div className="adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
	            <div className="modal-content adminModal-content col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
	              <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
	                	<button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.closeModal.bind(this)}>&times;</button>
	                </div>
	              </div>
	            <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          	<h4 className="blackLightFont textAlignCenter examDeleteFont col-lg-12 col-md-12 col-sm-12 col-xs-12">Are you sure, do you want to delete?</h4>
                        </div>
	            <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            	<button type="button" className="btn adminCancel-btn col-lg-7 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal" onClick={this.closeModal.bind(this)}>CANCEL</button>
                            </div>
	                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
	                  <button type="button" className="btn examDelete-btn col-lg-7 col-lg-offset-5 col-md-7 col-md-offset-5 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal" onClick={this.confirmDelete.bind(this)} >DELETE</button>
	                </div>
	            </div>
	            </div>
	          </div>
	        </div>
	     	</div>
	    : null
	  );
	} 
}
export default withRouter(EntityDetails); 
