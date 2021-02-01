import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import {withRouter}  		  		from 'react-router-dom';
import swal                   from 'sweetalert';
import _                      from 'underscore';
import IAssureTable           from '../CompanyProfile/IAssureTable.jsx';
import moment 								from 'moment';


import 'bootstrap/js/tab.js';
class EmployeeProfile extends Component {
	
	constructor(props) {
      super(props);
      this.state = {
      	id : '',
        loadMore: false,
        loadless: false,
        percentage:100,
        emp_ID : this.props.match.params ? this.props.match.params.emp_ID : '',
        tableHeadingCompany     : {
	        companyName     	  : "Company Name",
	        officelocation      : "Office Location",
	        department          : "Department",
	        designation         : "Designation",
	        approvingauthority1  : "Approving Authority #1",
	        approvingauthority2  : "Approving Authority #2",
	        approvingauthority3  : "Approving Authority #3",
	    	},
		    tableObjects      			: {
			    deleteMethod    			: 'delete',
			    apiLink         			: '/api/packagemaster/',
			    paginationApply 			: false,
			    searchApply     			: false,
			    editUrl         			: '/package-master'
			  },
      };
  }
	componentDidMount(){
		var employeeID ="";
		var user_id = localStorage.getItem("user_ID");
		var url = '';
		if(this.state.emp_ID && this.state.emp_ID!==""){
			url = "/api/personmaster/get/one/"+this.state.emp_ID
		}else{
			url = "/api/personmaster/get/details/"+user_id;
		}
		axios.get(url)
        .then((response)=>{
          this.setState({
            personInfo : response.data[0],
            type : response.data[0].type,
            address : response.data[0].address,
            contact : response.data[0].contactPersons
          },()=>{
          console.log("personInfo",this.state.personInfo);
          this.getManagerData(this.state.personInfo.approvingAuthorityId1,this.state.personInfo.approvingAuthorityId2,this.state.personInfo.approvingAuthorityId3);
          });
        })
        .catch((error)=>{
        	console.log("error",error);
        })
  	}
 
	editBasicform(event){
  		this.props.history.push("/my-profile/"+event.currentTarget.getAttribute('data-id'))
  	}


 getManagerData(managerID1,managerID2,managerID3){
    axios.get("/api/personmaster/get/User/"+managerID1)
    .then((response) => {
    	console.log("response",response,this.state.manager1Name)
        this.setState({
            managerId1 : response.data.data[0]._id,
            manager1ID: response.data.data[0].employeeId,
            manager1contactNo: response.data.data[0].contactNo,
            manager1Name : response.data.data[0].firstName +' '+response.data.data[0].lastName,
            approver1exist:'Yes'
        })    
      console.log("response->",this.state.manager1Name)
    })
    .catch((error) => {
      console.log('error: ',error)
    })
    axios.get("/api/personmaster/get/User/"+managerID2)
    .then((response) => {
        this.setState({
          managerId2 : response.data.data[0]._id,
          manager2ID : response.data.data[0].employeeId,
          manager2contactNo : response.data.data[0].contactNo,
          manager2Name : response.data.data[0].firstName +' '+response.data.data[0].lastName,
        })            
    })
    .catch((error) => {
      console.log('error: ',error)
    })
    axios.get("/api/personmaster/get/User/"+managerID3)
    .then((response) => {
        this.setState({
          managerId3 : response.data.data[0]._id,
          manager3ID : response.data.data[0].employeeId,
          manager3contactNo : response.data.data[0].contactNo,
          manager3Name : response.data.data[0].firstName +' '+response.data.data[0].lastName,
        })            
    })
    .catch((error) => {
      console.log('error: ',error)
    })
 	}


	render() {
    return (
      <div  className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">
				{
					this.state.personInfo ?
		    		<div className=" pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 singleClientDetails" data-child={this.state.personInfo._id} id={this.state.personInfo._id}>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding borderAllED">
						    	<div  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 blueBack ">
						    		<div className="col-lg-10 col-md-10 col-sm-10 col-xs-10 ">
							    		<div className="col-lg-2 col-md-4 col-sm-4 col-xs-4 companyLogoImage noPadding">
												<img src={this.state.personInfo.profilePhoto ? this.state.personInfo.profilePhoto:"/images/noImagePreview.png"} className=""></img>
							    		</div>
						    		</div>
						    		<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 noPadding pull-right marginTop12 textAlignCenter colorWhite">Login Credential Created  {this.state.personInfo.userId !== ""? <i class="fa fa-check-circle" aria-hidden="true"></i> : <i class="fa fa-times-circle-o " aria-hidden="true"></i>}</div>
							    </div>
							    <div className="col-lg-10 col-lg-offset-2 col-md-10 col-sm-10 col-xs-10 ">
						    		<div className="col-lg-12 col-md-4 col-sm-4 col-xs-4 empHeadview">
						    			<label><a target="_blank" title="view profile" href={"/employee-profile/"+this.state.personInfo._id}>{this.state.personInfo.firstName + " "+(this.state.personInfo.middleName?this.state.personInfo.middleName:"") +" "+ this.state.personInfo.lastName }</a></label>&nbsp;&nbsp;<span> {(this.state.personInfo.employeeId ? " (Emp ID : " + this.state.personInfo.employeeId +") ":"")}</span>
						    		</div>
							    	<div className="col-lg-1 col-md-2 col-sm-2 col-xs-2 editOptionView pull-right noPadding">
							    		{!this.state.emp_ID?
							    		<div id={this.state.personInfo._id} className=" col-lg-6 noPadding"  title="Edit" data-index data-id={this.state.personInfo._id} onClick={this.editBasicform.bind(this)}>	
										    <i className="fa fa-pencil "  aria-hidden="true" ></i>
										  </div>
										  :
										  null
							    		}
							    	</div>
						    		<div className="col-lg-12 col-md-6 col-sm-6 col-xs-6 ">
						    			<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding listLI">
												<li>{this.state.personInfo.designation && this.state.personInfo.designation.length>0 ? this.state.personInfo.designation[0].designation : "- NA -"}</li>
												<li><b><a target="_blank" title="view profile" href={"/company-profile/"+this.state.personInfo.company_Id}>{this.state.personInfo.companyName +" (Company ID : "+this.state.personInfo.companyID+") "}</a></b></li>
											</ul>
						    		</div>
							    </div>				   
							  </div>
							  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 borderAllED padding20">
							  	<ul className="col-lg-4 col-md-4 col-sm-4 col-xs-12 noPadding listLI">
										<li><i className="fa fa-briefcase changeColor " aria-hidden="true"></i>&nbsp;&nbsp;<b>Role</b></li>
										<li className="marginLeft5">{this.state.personInfo.type}</li>
									</ul>
									<ul className="col-lg-6 col-md-4 col-sm-4 col-xs-12 noPadding listLI">
										<li><i className="fa fa-map-marker changeColor " aria-hidden="true"></i>&nbsp;&nbsp;<b>Work Location</b></li>
										<li className="marginLeft5">{this.state.personInfo.workLocation}</li>
									</ul>
									<ul className="col-lg-2 col-md-4 col-sm-4 col-xs-12 noPadding listLI">
										<li><i className="fa fa-calendar changeColor " aria-hidden="true"></i>&nbsp;&nbsp;<b>DOB</b></li>
										<li className="marginLeft5">{this.state.personInfo.DOB ? moment(this.state.personInfo.DOB).format('DD-MM-YYYY') : "- NA -"}</li>
									</ul>
							  	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding seperaterBorder">
							  	</div>
							  	<ul className="col-lg-8 col-md-4 col-sm-4 col-xs-12 noPadding listLI">
										<li><i className="fa fa-envelope changeColor " aria-hidden="true"></i>&nbsp;&nbsp;{this.state.personInfo.email}</li>
										<i className="fa fa-map-marker textAlignLeft noPadding changeColor col-lg-1 width18px" aria-hidden="true"></i><li className="col-lg-10 noPadding">{this.state.personInfo.address && this.state.personInfo.address.length > 0 ? (this.state.personInfo.address[0].addressLine2 +" , "+ this.state.personInfo.address[0].addressLine1 +" , "+ this.state.personInfo.address[0].pincode) : " -NA- " }</li>
									</ul>
									<ul className="col-lg-4 col-md-4 col-sm-4 col-xs-12 listLI">
										<li><i className="fa fa-mobile changeColor " aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;{this.state.personInfo.contactNo}</li>
										{this.state.personInfo.altContactNo ? <li><i className="fa fa-mobile changeColor " aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;{this.state.personInfo.altContactNo}</li>:""}
										{this.state.personInfo.whatsappNo ? <li><i className="fa fa-whatsapp changeColor " aria-hidden="true"></i>&nbsp;&nbsp;{this.state.personInfo.whatsappNo}</li>:""}
									</ul>
							  </div>
							  {this.state.personInfo.bookingApprovalRequired == "Yes" ?
								  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 borderAllED padding20">
								  	<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fz18 noPadding" >Booking Approval Details</label>
								  	<ul className="col-lg-4 col-md-4 col-sm-4 col-xs-12 noPadding listLI">
											<li><b>Approving Authority ID 1</b></li>
											<li> Employee ID : {this.state.personInfo.approvingAuthorityId1}</li>
											<li> Name : {this.state.manager1Name}</li>
											<li> Mobile : {this.state.manager1contactNo ? this.state.manager1contactNo : " -NA- "}</li>
										</ul>
										<ul className="col-lg-4 col-md-4 col-sm-4 col-xs-12 noPadding listLI">
											<li><b>Approving Authority ID 3</b></li>
											<li> Employee ID : {this.state.personInfo.approvingAuthorityId2}</li>
											<li> Name : {this.state.manager2Name}</li>
											<li> Mobile : {this.state.manager2contactNo ? this.state.manager2contactNo : " -NA- "}</li>
										</ul>
										<ul className="col-lg-4 col-md-4 col-sm-4 col-xs-12 noPadding listLI">
											<li><b>Approving Authority ID 3</b></li>
											<li> Employee ID : {this.state.personInfo.approvingAuthorityId3}</li>
											<li> Name : {this.state.manager3Name}</li>
											<li> Mobile : {this.state.manager3contactNo ? this.state.manager3contactNo : " -NA- "}</li>
										</ul>
								  	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding seperaterBorder">
								  	</div>
								  	<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 fz18 noPadding" >Pre-Approved Limits</label>
								  	<ul className="col-lg-4 col-md-4 col-sm-4 col-xs-12 noPadding listLI">
											<li><b>Amount</b></li>
											<li>₹ {this.state.personInfo.preApprovedAmount}</li>
										</ul>
										<ul className="col-lg-4 col-md-4 col-sm-4 col-xs-12 noPadding listLI">
											<li><b>Kilometer</b></li>
											<li>{this.state.personInfo.preApprovedKilometer} Km</li>
										</ul>
										<ul className="col-lg-4 col-md-4 col-sm-4 col-xs-12 noPadding listLI">
											<li><b>Rides</b></li>
											<li>{this.state.personInfo.preApprovedRides}</li>
										</ul>
								  </div>
							  :
							  null
								}
							</div>
							{
								this.props.type !== "guest" && this.state.Documentarray && this.state.Documentarray.length > 0 &&
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationMainContainer addMarginTopPM">
									<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 mapIconMargin">
										<i className="fa fa-map-marker addressIcon" aria-hidden="true"></i>
									</div>
									<div className="col-lg-6 col-md-1 col-sm-12 col-xs-12">
										<h5 className="locationHeading">Document List</h5>
									</div>
									{
										this.state.Documentarray.map((docdata, index) => {
											return (
												<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 noRightPadding" key={index}>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{ heigth: '100px' }}>
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 locationAddress">
															<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
																<li title="document"><b>{docdata.documentName}</b>: {docdata.documentNumber}</li>
																<li title="document"><b>Document Valid From : </b>{moment(docdata.documentValidFrom).format("DD-MMM-YY")}</li>
																<li title="document"><b>Document Valid To :</b> {moment(docdata.documentValidTo).format("DD-MMM-YY")}</li>
																
															</ul>
														</div>
													</div>
													<br />
												</div>
											);
										})
									}
								</div>
							}
						{/*<div className="modal" id="deleteModal" role="dialog">
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
						<div className="modal" id="deleteStatusOfDriverModal" role="dialog">
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
												<button type="button" className="btn examDelete-btn col-lg-7 col-lg-offset-5 col-md-7 col-md-offset-5 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal" onClick={this.deleteStatusOfDriver.bind(this)} >DELETE</button>
											</div>
										</div>
									</div>
								</div>
						</div>*/}
						</div>
						
					: null
				}
			</div>
	  );
	} 
}
export default withRouter(EmployeeProfile); 
