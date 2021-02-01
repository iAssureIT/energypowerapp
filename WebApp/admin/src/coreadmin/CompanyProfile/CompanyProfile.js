import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import {withRouter}  		  		from 'react-router-dom';
import swal                   from 'sweetalert';
import IAssureTable           from './IAssureTable.jsx';
import ReactToPdf             from 'react-to-pdf';
import jspdf                 from 'jspdf';
import _                      from 'underscore';
import 'bootstrap/js/tab.js';
import './CompanyProfile.css';

class CompanyProfile extends Component {
	
	constructor(props) {
      super(props);
      this.state = {
      	id : '',
        startRange :0,
        limitRange:10,
        tableHeading      : {
	        locationType     		: "Location Type",
	        addressLine1        : "Address",
	        GSTIN           		: "GSTIN",
	        PAN           			: "PAN",
	        Document      			: "Documents",
	    },
	   
      };
  }

	componentDidMount(){
		axios.get("/api/entitymaster/get/appCompany")
	    .then((response) => {
	    	if(response.data.length > 0){
		        this.setState({
		          entityList   : response.data,
		          entityID     : response.data[0]._id
		        },()=>{
		        	this.getCompanyData(this.state.entityID)
		       				
		        })	      		
	    	}else{
	        	this.props.history.push('/appCompany/basic-details');
	     	}
	    })
	    .catch((error) => {
			console.log("Error in /api/entitymaster/get/appCompany = ", error);
	    })
  	}

  	getCompanyData(entityID) {
  		axios.get("/api/entitymaster/get/one/"+entityID)
		.then((response) => {
			this.setState({
				corporateInfo : response.data[0],
				locations 	  : response.data[0].locations,
				contacts 	  : response.data[0].contactData,
			})
		})
		.catch((error) => {
			console.log("Error in /api/entitymaster/get/one/ = ", error);
		})					
	}

	printTicket(event){
	  var printContents = document.getElementById('pdfWrap').innerHTML;
	  var originalContents = document.body.innerHTML;
	  document.body.innerHTML = printContents;
	  window.print();
	  document.body.innerHTML = originalContents;
	}

	getManagerData(managerID1,managerID2,managerID3){
	    axios.get("/api/personmaster/get/User/"+managerID1)
	    .then((response) => {
	    	var emp_id = response.data.data[0]._id
	    	axios.get("/api/personmaster/get/one/" + emp_id)
			.then((response) => {
				this.setState({
					managerId1 : response.data._id,
					manager1ID: response.data.employeeId,
					manager1contactNo: response.data.contactNo,
					manager1Name : response.data.firstName +' '+response.data.lastName,
					manager1dept : response.data.department ? response.data.department[0].department : "",
					manager1desig : response.data.designation ? response.data.designation[0].designation:"",
				});
			})
			.catch((error) => {
				console.log("error /api/personmaster/get/one/ =>",error)
			})
	    })
	    .catch((error) => {
	      console.log('error: ',error)
	    })
	    axios.get("/api/personmaster/get/User/"+managerID2)
	    .then((response) => {
	    	var emp_id = response.data.data[0]._id
	    	axios.get("/api/personmaster/get/one/" + emp_id)
				.then((response) => {
					this.setState({
						managerId2 : response.data._id,
						manager2ID: response.data.employeeId,
						manager2contactNo: response.data.contactNo,
						manager2Name : response.data.firstName +' '+response.data.lastName,
						manager2dept : response.data.department ? response.data.department[0].department : "",
						manager2desig : response.data.designation ? response.data.designation[0].designation:"",
					});
				})
				.catch((error) => {
					console.log("error /api/personmaster/get/one/ =>",error)
				})
	    })
	    .catch((error) => {
	      console.log('error: ',error)
	    })
	    axios.get("/api/personmaster/get/User/"+managerID3)
	    .then((response) => {
	    	var emp_id = response.data.data[0]._id
	    	axios.get("/api/personmaster/get/one/" + emp_id)
				.then((response) => {
					this.setState({
						managerId3 : response.data._id,
						manager3ID: response.data.employeeId,
						manager3contactNo: response.data.contactNo,
						manager3Name : response.data.firstName +' '+response.data.lastName,
						manager3dept : response.data.department ? response.data.department[0].department : "",
						manager3desig : response.data.designation ? response.data.designation[0].designation:"",
					});
				})
				.catch((error) => {
					console.log("error /api/personmaster/get/one/ =>",error)
				})
	    })
	    .catch((error) => {
	      console.log('error: ',error)
	    })
 	}

	editBasicform(event){
    this.props.history.push("/"+this.state.corporateInfo.entityType+'/basic-details/'+event.currentTarget.getAttribute('data-id'))
  }
  editBasicformLocation(event){
    this.props.history.push("/"+this.state.corporateInfo.entityType+'/location-details/'+this.state.corporateInfo._id+"/"+event.currentTarget.getAttribute('data-id'))
  }
  editBasicformContact(event){
    this.props.history.push("/"+this.state.corporateInfo.entityType+'/contact-details/'+this.state.corporateInfo._id+"/"+event.currentTarget.getAttribute('data-id'))
  }
  download(event) {
      event.preventDefault();
      $('#headerid').hide();
      $('#editPen').hide();
      $('#statusDiv').hide();
      $('#btnDiv').hide();
      $('#sidebar').toggleClass('active');
      $('#headerid').toggleClass('headereffect');
      $('#dashbordid').toggleClass('dashboardeffect')
      $('#sidebar').hide();
      $('#widgets').hide();
      $('#printButton').hide();
      $('.button2').hide();
      $('.main-footer').hide();
      $(".box-header").hide();
      window.print();
      $('#headerid').show();
      $('#sidebar').toggleClass('active')
      $('#headerid').toggleClass('headereffect');
      $('#dashbordid').toggleClass('dashboardeffect')
      $('#sidebar').show();
      $('#widgets').show();
      $('#printButton').show();
      $('.button2').show();
      $('#editPen').show();
      $('#statusDiv').show();
      $('.main-footer').show();
      $(".box-header").show();
  }
  deleteEntity(event) {
    event.preventDefault();
    this.setState({ deleteID: event.currentTarget.getAttribute('data-id'),deleteName: event.currentTarget.getAttribute('data-name') })
    $('#deleteEntityModal').show();
  }
  closeModal(event) {
    event.preventDefault();
    $('#deleteEntityModal').hide();
  }
  confirmDelete(event) {
    event.preventDefault();
    var url="";

    if(this.state.deleteName == "contacts"){
      var formValues = {
				entityID: this.state.corporateInfo._id,
				contactID: this.state.deleteID
			}
			url = '/api/entitymaster/deleteContact/' + formValues.entityID + '/' + formValues.contactID;
    }else{
    	var formValues = {
				entityID: this.state.corporateInfo._id,
				location_ID: this.state.deleteID
			}
			url = '/api/entitymaster/deleteLocation/' + formValues.entityID + '/' + formValues.location_ID;

    }
    axios.delete(url)
    .then((response) => {
      if (response.data.deleted) {
      	$('#deleteEntityModal').hide();
          swal({
              text: "Data deleted successfully.",
          });
        	this.getCompanyData(this.state.entityID)

      } else {
          swal({
              text: "Failed to delete.",
          });
      }
      this.getContracts();
      $('#deleteEntityModal').hide();
    })
    .catch((error) => {
    })
  }
	
 
	render() {
		const ref = React.createRef();
    return (	
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">	
		    {
        	this.state.corporateInfo 
        	?
    				<div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
					    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxshadeOP" id="pdfWrap" iref={ref}> 	
					    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding borderAll">
						    	<div  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blueBack ">
						    		<div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 ">
							    		<div className="col-lg-2 col-md-4 col-sm-4 col-xs-4 companyLogoImage noPadding">
											<img src={this.state.corporateInfo.companyLogo && this.state.corporateInfo.companyLogo.length > 0?this.state.corporateInfo.companyLogo[0]:"/images/noImagePreview.png"} className=""></img>
							    		</div>
						    		</div>
						    		<div id="statusDiv" className="col-lg-1 col-md-4 col-sm-4 col-xs-4 noPadding pull-right marginTop12 textAlignCenter">{this.state.corporateInfo.profileStatus == "New"?<span className="newProfile" title="New Company Profile">New </span>:<span className="approvedProfile" title="Company Profile Approved">Approved </span>}</div>
						    	</div>
						    	<div className="col-lg-10 col-lg-offset-2 col-md-10 col-sm-10 col-sm-offset-4 col-xs-10 ">
						    		<div className="col-lg-10 col-md-4 col-sm-4 col-xs-4 orgHead noPadding">
						    			<label>{this.state.corporateInfo.companyName}</label>&nbsp;&nbsp;<span>( Company ID: <b>{this.state.corporateInfo.companyID}</b> )</span>
						    		</div>
						    		<div className="col-lg-1 col-md-2 col-sm-2 col-xs-2 editOption pull-right textAlignCenter noPadding">
							    		<div id={this.state.corporateInfo._id} className="customBtnCP col-lg-2 col-lg-offset-2"  title="Edit profile" data-index data-id={this.state.corporateInfo._id} onClick={this.editBasicform.bind(this)}>	
										    	<i className="fa fa-pencil " id="editPen" aria-hidden="true" ></i>
										  </div>
									    <div className="customBtnCP col-lg-2" title="Download as PDF">
	                        <i id="printButton" onClick={this.download.bind(this)} className="fa fa-download"></i>
	                    </div>
						    		</div>
						    		<div className="col-lg-8 col-md-12 col-sm-12 col-xs-12 noPadding">
						    			<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding listLI">
												<li><i className="fa fa-envelope changeColor " aria-hidden="true"></i>&nbsp;&nbsp;{this.state.corporateInfo.companyEmail}</li>
												<li><i className="fa fa-phone changeColor" aria-hidden="true"></i>&nbsp;&nbsp;{this.state.corporateInfo.companyPhone}</li>
												<li><i className="fa fa-globe changeColor " aria-hidden="true"></i>&nbsp;&nbsp;{this.state.corporateInfo.website ? this.state.corporateInfo.website :" -NA- "}</li>
											</ul>
						    		</div>
						    		<div className="col-lg-4 col-md-6 col-sm-6 col-xs-6 noPadding">
						    			<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left listLI">
												<li>CIN&nbsp; : <b>{this.state.corporateInfo.CIN? this.state.corporateInfo.CIN :" -NA- "}</b>{this.state.corporateInfo.COI && this.state.corporateInfo.COI.length > 0 ? <a target="_blank" className="col-lg-2 col-sm-2 pull-right"><img src={this.state.corporateInfo.COI[0]}  className="coiImage "></img></a>:""}</li>
												{/*<li>CIN&nbsp; : <b>{this.state.corporateInfo.CIN? this.state.corporateInfo.CIN :" -NA- "}</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.corporateInfo.COI && this.state.corporateInfo.COI.length > 0 ? <a target="_blank" className="col-lg-1 col-sm-2 pull-right" title="Click to view COI document" href={this.state.corporateInfo.COI[0]}><img src={this.state.corporateInfo.COI[0]}  className="coiImage "></img></a>:""}</li>*/}
												<li>&nbsp;</li>
												<li>TAN&nbsp; : <b>{this.state.corporateInfo.TAN ? this.state.corporateInfo.TAN : " -NA- "}</b></li>
											</ul>
						    		</div>				   
						    	</div>				   
						    </div>				   
			        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singleClientDetails noPadding" data-child={this.state.corporateInfo._id} id={this.state.corporateInfo._id}>
									<div className="col-lg-1 col-lg-offset-11 noPadding">
						    	</div>
								</div>
			        	{
			        	this.state.locations && this.state.locations.length>0 &&
			        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding">
				        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 OrgListTitle noPadding">
										<label>Company Locations</label>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding" id="style-2">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 cardDivCP paddingOfInner">
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
													<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 cardColumnCP">
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardHeadingCP">
															LOCATION TYPE
														</div>                                                           
													</div>
													<div className="col-lg-4 col-md-2 col-sm-2 col-xs-2 cardColumnCP"> 
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardHeadingCP">
															ADDRESS
														</div>                                                           
													</div>
													<div className="col-lg-2 col-md-1 col-sm-1 col-xs-1 cardColumnCP"> 
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardHeadingCP">
															GSTIN
														</div>                                                           
													</div>
													<div className="col-lg-2 col-md-1 col-sm-1 col-xs-1 cardColumnCP">  
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardHeadingCP">
															PAN
														</div>                                                           
													</div>
													<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 nopadding textAlignCenter">  
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardHeadingCP">
															ACTION
														</div>                                                           
													</div>
												</div>
											</div>
										<div className="">
											{
												this.state.locations.map((data, index) => {
													return (
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 cardDivDataCP" key={index} name={index} data-child={data._id + '-' + index} id={data._id}>
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
																<div className="col-lg-2 col-md-1 col-sm-1 col-xs-1 cardColumnCP">
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardDataCP"><b>{data.locationType}</b></div>																	                                                        
																</div>
																<div className="col-lg-4 col-md-1 col-sm-1 col-xs-1 cardColumnCP"> 
																	<div className="col-lg-10 col-md-12 col-sm-12 col-xs-12 nopadding cardDataCP">#{(data.addressLine2 ? data.addressLine2 +"," :"") + data.addressLine1 +" "+(data.pincode ? ","+data.pincode : "" )}</div>                                                          
																</div>
																<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 cardColumnCP">
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardDataCP">{data.GSTIN}</div>                                                           
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardDataCP">{data.GSTDocument && data.GSTDocument.length > 0 ? data.GSTDocument.map((data,index)=>{
																		return(
																			<img src={data} className="gstnDocCP"/>
																			)
																		})
																	:
																	null
																	}
																	</div>                                                           
																</div>
																<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 cardColumnCP"> 
																                                                           
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardDataCP">{data.PAN}</div>                                                          
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardDataCP">{data.PANDocument && data.PANDocument.length > 0 ? data.PANDocument.map((data,index)=>{
																		return(
																			<img src={data} className="gstnDocCP"/>
																			)
																		})
																	:
																	null
																	}
																	</div>  
																</div>
															
																<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 nopadding">  
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardActionsCP">
																		<a><i className="fa fa-pencil edit" aria-hidden="true" title="click to edit" id={data._id} data-id={data._id} onClick={this.editBasicformLocation.bind(this)}></i></a> 
																		<a><i  className="fa fa-trash-o delete" aria-hidden="true" title="click to delete" data-name="location" data-id={data._id} onClick={this.deleteEntity.bind(this)}></i></a>
																	</div>                                                         
																</div>
	                                                            
															</div>
														</div>
													);
												})
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
			        	</div>
			        	}
			        	{
				        	this.state.contacts && this.state.contacts.length>0 &&
				        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding">
				        		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 OrgListTitle noPadding">
											<label>Contact Person Details</label>
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 cardDivCP paddingOfInner">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
												<div className="col-lg-1 col-md-2 col-sm-2 col-xs-2 cardColumnCP">
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardHeadingCP">
														NAME <br/>EMP ID
													</div>                                                           
												</div>
												<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 cardColumnCP"> 
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardHeadingCP">
														DEPARTMENT <br/>DESIGNATION
													</div>                                                           
												</div>
												<div className="col-lg-2 col-md-1 col-sm-1 col-xs-1 cardColumnCP"> 
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardHeadingCP">
														COMPANY BRANCH
													</div>                                                           
												</div>
												<div className="col-lg-2 col-md-1 col-sm-1 col-xs-1 cardColumnCP">  
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardHeadingCP">
														EMAIL
													</div>                                                           
												</div>
												<div className="col-lg-2 col-md-1 col-sm-1 col-xs-1 cardColumnCP">  
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardHeadingCP">
														PHONE
													</div>                                                           
												</div>
												<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 cardColumnCP">  
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardHeadingCP">
														ROLE
													</div>                                                           
												</div>
												<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 nopadding textAlignCenter">  
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardHeadingCP">
														ACTION
													</div>                                                           
												</div>
                                                      
											</div>
											</div>
				        			<div className="">
											{
												this.state.contacts.map((data, index) => {
													return (
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 cardDivDataCP" key={index} name={index} data-child={data._id + '-' + index} id={data._id}>
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
																<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 cardColumnCP">
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  nopadding cardDataCP"><a href={"/employee-profile/"+data.personID} title="View profile"> {data.firstName +" "+ data.lastName}</a></div>																	                                                        
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardDataCP">{(data.employeeID ? data.employeeID  :"") }</div>                                                          
																</div>
																<div className="col-lg-2 col-md-1 col-sm-1 col-xs-1 cardColumnCP"> 
																	<div className="col-lg-10 col-md-12 col-sm-12 col-xs-12 nopadding cardDataCP">{(data.departmentName ? data.departmentName  :"") +" "+(data.designationName ? ", "+data.designationName : "" )}</div>                                                          
																</div>
																<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 cardColumnCP">
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardDataCP">{data.branchName}</div>                                                           
																</div>
																<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 cardColumnCP"> 
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardDataCP">{data.email}</div>                                                          
																</div>
																<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 cardColumnCP"> 
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardDataCP">{data.phone}</div>                                                          
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardDataCP">{data.whatsappNo ? data.whatsappNo :""}</div>                                                          
																</div>
																<div className="col-lg-1 col-md-2 col-sm-2 col-xs-2 cardColumnCP"> 
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardDataCP">{data.role}</div>                                                          
																</div>
															
																<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 nopadding">  
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding cardActionsCP">
																		<a><i className="fa fa-pencil edit" aria-hidden="true" title="click to edit" id={data._id} data-id={data._id} onClick={this.editBasicformContact.bind(this)}></i></a> 
																		<a><i  className="fa fa-trash-o delete" aria-hidden="true" title="click to delete" data-name="contacts" data-id={data._id} onClick={this.deleteEntity.bind(this)}></i></a>
																	</div>                                                         
																</div>
	                                                            
															</div>
														</div>
													);
												})
											}
										</div>
				        	</div>
			          }						        
		          </div>
	          </div>
	        :
            <div className="loadingImg">
            	<img src="/images/loader.gif"/>
            </div>
	      }
			</div>	            
	  );
	} 
}
export default withRouter(CompanyProfile); 