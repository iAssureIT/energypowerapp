import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import S3FileUpload from 'react-s3';
import PhoneInput from 'react-phone-input-2';
import { withRouter } from 'react-router-dom';
import BulkUpload from "../Master/BulkUpload/BulkUpload.js";
import CreateTemplate from './CreateTemplate.js';
import 'bootstrap/js/tab.js';
import CKEditor from "react-ckeditor-component";
// import '../css/SupplierOnboardingForm.css';
import 'react-phone-input-2/lib/style.css';
import "bootstrap-toggle/css/bootstrap2-toggle.min.css";
import "bootstrap-toggle/js/bootstrap2-toggle.min.js";

class CreateTemplateNew extends Component {


	constructor(props) {

		super(props);
		this.state = {
			templateType: "Email",
			templateName: "",
			subject: "",
			editorEmail: null,
			editorNotification: null,
			editorSMS: null,
			contentError: '',
			defaultLabel: ' --Select-- ',
			subjecterror: '',
			templateNameerror: '',
			templateTypeerror: '',
			event:"",
			eventName:"",
			tokens:"",
			template:"",

			formerrors: {
				message: '',
				subject: '',

			},
			role:"",
			roleArray:[],
			eventArray:[],
			status:"active",
			company:"All",
			companyArray:[],
			companyname:"",
			tabtype : 'emailTemplates',
			fileDetailUrl: "/api/masternotifications/get/filedetails/",
             goodRecordsHeading: {
	        templateType			: "Template Type",
	        templateName			: "Template Name",
	        role 					: "Role",
	        company 				: "Company Name",
	        entityType				: "eEntity Type",
	        content 				: "Content",
	        subject 				: "Subject",
	        },
			failedtableHeading: {
	        templateType    		: "Template Type",
	        templateName 			: "Template Name",
	        role 					: "Role",
	        company 				: "Company Name",
	        entityType				: "Entity Type",
	        content 				: "Content",
	        subject 				: "Subject",
	        failedRemark            :  "Failed Data Remark"
      
      }
		};
		this.onChangeEmail = this.onChangeEmail.bind(this);
		this.onChangeNotification = this.onChangeNotification.bind(this);
		this.onChangeSMS = this.onChangeSMS.bind(this);
		this.handleChange = this.handleChange.bind(this);

	}

	componentDidMount() {
        this.getRoles();
        this.getCompany();
        this.getAllEvents();
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
		$("html,body").scrollTop(0);
		$.validator.addMethod("regxtemplateName", function (value, element, arg) {
			return arg !== value;
		}, "Please select the template Name ");
		$.validator.addMethod("regxEvent", function (value, element, arg) {
            return  arg !== value;
        }, "Please select the Event.");
        $.validator.addMethod("regxRole", function (value, element, arg) {
            return arg !== value;
        }, "Please select the Role.")
        $.validator.addMethod("regxStatus", function (value, element, arg) {
            return arg !== value;
        }, "Please select the Status.");
		/*$.validator.addMethod("regxtemplateType", function (value, element, arg) {
			return arg !== value;
		}, "Please select the template Type ");*/
		    $("#newTemplateForm").validate({
		      rules: {
		        eventName: {
                    required: true,
                    regxEvent: ""
                },
		         templateName: {
		          required: true,
		          regxtemplateName: ""
		        }, 
		        
		        subject: {
		          required: true,
		        }, 
		        role: {
                    required: true,
                    regxRole: ""
                },
                status: {
                    required: true,
                    regxStatus: "--Select Status--"
                },
		       /* editor: {
		          required: true,
		          regxeditor: this.state.editor
		        },*/      
      },
      errorPlacement: function(error, element) {
       /* if (element.attr("name") == "templateType"){
          error.insertAfter("#templateType");
        } */
        if (element.attr("name") == "eventName") {
                    error.insertAfter("#eventName");
                }
        if (element.attr("name") == "templateName"){
          error.insertAfter("#templateName");
        }
        if (element.attr("name") == "subject"){
          error.insertAfter("#subject");
        }
        if (element.attr("name") == "editorEmail"){
          error.insertAfter("#editorEmail");
        }
        if (element.attr("name") == "editorNotification"){
          error.insertAfter("#editorNotification");
        }
        if (element.attr("name") == "editorSMS"){
          error.insertAfter("#editorSMS");
        }
        if (element.attr("name") == "role") {
            error.insertAfter("#role");
        }
        if (element.attr("name") == "status") {
                    error.insertAfter("#status");
                }
      }
    });
	
	}

	componentWillReceiveProps(nextProps) {
		this.getAllEvents();
	}

	handleEventChange(event) {
		this.setState({template:""})
		const { name, value } = event.target;
		let formerrors = this.state.formerrors;
		var str = value ; 
		var finalStr = str.split("-");
		var event = finalStr[0];
		var template = finalStr[1];
		this.setState({
			formerrors,
			[name]: value,
			event: event,
			template: template
		},()=>{this.getTokens(event)});
	}

	getTokens(event){
		axios.get('/api/EventToken/get/token/'+event)
		.then((response)=>{
			this.setState({
				tokens : response.data
			})
		})
	}

	handleChange(event) {
		const { name, value } = event.target;
		let formerrors = this.state.formerrors;
		this.setState({
			formerrors,
			[name]: value
		});
	}

	getRoles() {
        var data = {
	      "startRange": 0,
	      "limitRange": 100000,
	    }
	    axios.post('/api/roles/get/list', data)
	      .then((response) => {
	        this.setState({
	          roleArray: response.data
	        }, () => {
	        })
	      }).catch(function (error) {
	      });
    }
    getCompany() {
	    axios.get('/api/entitymaster/getAllEntities')
	      .then((response) => {
	        this.setState({
	          companyArray: response.data
	        }, () => {
	        })
	      }).catch(function (error) {
	      });
    }

    getAllEvents() {
	    axios.post('/api/EventToken/list')
	      .then((response) => {
	        this.setState({
	          eventArray: response.data
	        })
	      }).catch(function (error) {
	      });
    }
	
	selectType(type,event) {
		const target = event.target;
		const name = target.name;
		this.setState({
			templateType: type,
		})

	}
	updateContent(newContent) {
		this.setState({
			editorEmail: newContent,
			editorNotification: newContent,
			editorSMS: newContent
		})
	}
	onChangeEmail(evt) {
		var newContent = evt.editor.getData();
		this.setState({
			editorEmail: newContent
		}, () => {
			if (this.state.editorEmail) {
				this.setState({
					contentError: ''
				});
			} else {
				this.setState({
					contentError: ''
				})
			}
		})
	}
	onChangeNotification(evt) {
		var newContent = evt.editor.getData();
		this.setState({
			editorNotification: newContent
		}, () => {
			if (this.state.editorNotification) {
				this.setState({
					contentError: ''
				});
			} else {
				this.setState({
					contentError: ''
				})
			}
		})
	}
	onChangeSMS(evt) {
		var newContent = evt.editor.getData();
		this.setState({
			editorSMS: newContent
		}, () => {
			if (this.state.editorSMS) {
				this.setState({
					contentError: ''
				});
			} else {
				this.setState({
					contentError: ''
				})
			}
		})
	}
	getFileDetails(fileName){
     axios
      .get(this.state.fileDetailUrl+fileName)
      .then((response)=> {
      $('.fullpageloader').hide();  
      if (response) {
        this.setState({
            fileDetails         : response.data,
            failedRecordsCount  : response.data.failedRecords.length,
            goodDataCount       : response.data.goodrecords.length
        });

          var tableData = response.data.goodrecords.map((a, i)=>{
          	console.log("response.data.goodrecords",response.data.goodrecords);
            return{
                 	"templateType": a.templateType ? a.templateType : '-',
	                // "event": a.event ? a.event : '-',
	                "entityType": a.entityType ? a.entityType : '-',
	                "templateName": a.templateName ? a.templateName : '-',
	                "role": a.role ? a.role : '-',
	                "company": a.company ? a.company : '-',
	                "subject": a.subject ? a.subject : '-',
	                "content": a.content ? a.content : '-',
	            }
          })

          var failedRecordsTable = response.data.failedRecords.map((a, i)=>{
          return{
                	
                 	"templateType": a.templateType ? a.templateType : '-',
	                // "event": a.event ? a.event : '-',
	                "entityType": a.entityType ? a.entityType : '-',
	                "templateName": a.templateName ? a.templateName : '-',
	                "role": a.role ? a.role : '-',
	                "company": a.company ? a.company : '-',
	                "subject": a.subject ? a.subject : '-',
	                "content": a.content ? a.content : '-',
                	"failedRemark"  : a.failedRemark     ? a.failedRemark : '-' 
          }
          })
          
        this.setState({
            goodRecordsTable    : tableData,
            failedRecordsTable  : failedRecordsTable
        })
      }
      })
      .catch((error)=> { 
        console.log('error', error);
      }) 
  }


	submitTemplate(event) {
		event.preventDefault();
		var event = this.state.event;
		var role = this.state.role;
		var company = this.state.company;
		var status = this.state.status;
		var templateType = this.state.templateType;
		var subject = this.state.subject;
		var emailContent = this.state.editorEmail;
		var notificationContent = this.state.editorNotification;
		var smsContent = this.state.editorSMS;
		if(company == 'All'){
			company = null
		}
		if(event && role){
			if(templateType == 'Email'){
				if(subject === "" & emailContent === null || emailContent === ""){
					swal("For Email Template Subject & Message are mandatory")
				}else{
					
					var formValues = {
						"event":event,
						"templateType": templateType,
						"templateName": this.state.template,
						"role": role,
						"status":status,
						"company":company,
						"subject": subject,
						"content": emailContent,
					}
					axios.post('/api/masternotifications/post', formValues)
				  	.then((response)=> {
				    // handle success
				    	if(response.data.message === "Notification Details already exists"){
				    		swal("Email Template already exists")
				    		
				    	}else{
				    		this.setState({
								subject: "",
								editorEmail: null
							});
					    	swal("Email Template added successfully");
						}
						
				  	})
				  	.catch((error)=> {
				    // handle error
				    	console.log(error);
				  	});
					
				}
			}else if(templateType == 'Notification'){
				if(notificationContent === null || notificationContent === ""){
					swal("Please enter message")
				}else{
					var formValues = {
						"event":event,
						"templateType": templateType,
						"templateName": this.state.template,
						"role": role,
						"status":status,
						"company":company,
						"content": notificationContent,
					}
					axios.post('/api/masternotifications/post', formValues)
				  	.then((response)=> {
				    // handle success
				    	if(response.data.message === "Notification Details already exists"){
				    		swal("Notification Template already exists")
				    		
				    	}else{
				    		this.setState({
								editorNotification: null
							});
					    	swal("Notification template added successfully");
						}
				  	})
				  	.catch((error)=> {
				    // handle error
				    	console.log(error);
				  	});

				}
			}else{
				if(smsContent === null || smsContent === ""){
					swal("Please enter message")
				}else{
					var formValues = {
						"event":event,
						"templateType": templateType,
						"templateName": this.state.template,
						"role": role,
						"status":status,
						"company":company,
						"content": smsContent,
					}
					axios.post('/api/masternotifications/post', formValues)
				  	.then((response)=> {
				    // handle success
				    	if(response.data.message === "Notification Details already exists"){
				    		swal("SMS Template already exists")
				    		
				    	}else{
				    		this.setState({
								editorSMS: null
							});
					    	swal("SMS template added successfully");
						}
				  	})
				  	.catch((error)=> {
				    // handle error
				    	console.log(error);
				  	});
						
				}
			}
		}else{
			swal("Please select Event & Role")
		}
		
	}

	closeModal(event){
		event.preventDefault();
		$('#createNotifyModal').hide();
    	$(".modal-backdrop").remove();
    	this.setState({
    		templateType: "Email",
			templateName: "",
			subject: "",
			editorEmail: null,
			editorNotification: null,
			editorSMS: null,
			event:"",
			eventName:"",
			tokens:"",
			template:"",
			role:"",
			status:"active",
			company:"All",
			companyname:"",
			tabtype : 'emailTemplates'
    	})
    	this.props.getType('Email')
	}

	showToken(event){
		const target = event.target;
        var id = $(event.currentTarget).attr('id');
        var divid = $(event.currentTarget).attr('dataid');
		$('#'+divid).toggle();
		var change = document.getElementById(id);
        if (change.innerHTML == "Show Available Tokens")
        {
            change.innerHTML = "Hide Available Tokens";
        }
        else {
            change.innerHTML = "Show Available Tokens";
        }
	 
	}

  render() {
    return (

      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
        <section className="content">   
          <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt20">
              <ul className="nav tabNav nav-pills col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right">
                <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill" href="#manual">Manual</a></li>
                <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center"><a data-toggle="pill" href="#bulk">Bulk Upload</a></li>
              </ul>
            </div>
            <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Create Template</h4>
            </div>

            <section className="Content tab-content">
                <div id="bulk" className="tab-pane fade in col-lg-12 col-md-1f2 col-sm-12 col-xs-12 mt">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerForm">
                    <BulkUpload url="/api/masternotifications/bulkUploadNotification"
                        data={{ "entityType": this.state.pathname, "createdBy": localStorage.getItem("user_ID"), "corporateId": localStorage.getItem("corporate_ID") }}
                        uploadedData={this.uploadedData}
                        fileurl="https://fivebees.s3.ap-south-1.amazonaws.com/prod/master/entitymaster.xlsx"
                        getFileDetails={this.getFileDetails.bind(this)}
                        fileDetails={this.state.fileDetails}
                        goodRecordsHeading={this.state.goodRecordsHeading}
                        failedtableHeading={this.state.failedtableHeading}
                        failedRecordsTable={this.state.failedRecordsTable}
                        failedRecordsCount={this.state.failedRecordsCount}
                        goodRecordsTable={this.state.goodRecordsTable}
                        goodDataCount={this.state.goodDataCount}
                    />
                  </div>
                </div>
                <div id="manual" className="tab-pane fade in active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding"style={{marginTop:"25px"}}>
                   <div className="col-md-12 NOpadding rowPadding">
					<div className="col-md-3">
						<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Event <sup className="astrick">*</sup></label>
			            <select id="eventName" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.eventName} ref="eventName" name="eventName" onChange={this.handleEventChange.bind(this)}>
			                <option disabled value="">--Select Event--</option>
			                {this.state.eventArray && this.state.eventArray.length > 0 ?
			                	this.state.eventArray.map((data,index)=>{
			                		return(
			                			<option key={index} value={data.event+'-'+data.templateName}>{data.templateName}</option>
			                		)
			                	})
			                	:
			                	<option disabled>No Event Added Yet</option>
			                }
			               
			            </select>   
					</div>
					<div className="col-md-3">
						<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Role<sup className="astrick">*</sup></label>
			            <select id="role" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.role} ref="role" name="role" onChange={this.handleChange.bind(this)}>
			                <option disabled value="">--Select Role--</option>
			                {
			                    this.state.roleArray && this.state.roleArray.length > 0 ?
			                        this.state.roleArray.map((data, i)=>{
			                            return(
			                                <option key={i} value={data.role}>{data.role} </option>
			                            );
			                        })
			                    :
			                    null
			                }
			            </select>
					</div>
					<div className="col-md-3">
						<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Status<sup className="astrick">*</sup></label>
			            <select id="status" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.status} ref="status" name="status" onChange={this.handleChange.bind(this)}>
			                <option disabled value="">--Select Status--</option>
			                <option> active </option>
							<option> inactive </option>
			            </select>
					</div>
					<div className="col-md-3">
						<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Company</label>
			            <select id="company" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.company} ref="company" name="company" onChange={this.handleChange.bind(this)}>
			                <option disabled value="All">--Select Company--</option>
			                {
			                    this.state.companyArray && this.state.companyArray.length > 0 ?
			                        this.state.companyArray.map((data, i)=>{
			                            return(
			                                <option key={i} value={data._id}>{data.companyName} </option>
			                            );
			                        })
			                    :
			                    null
			                }
			            </select>
				   </div>
				</div>
				<div className="col-md-12">
					<ul className="nav nav-pills nav-justified rowPadding">
					  <li className="active defaultColor" value="Email" onClick={this.selectType.bind(this,"Email")}><a data-toggle="pill" href="#email">Email</a></li>
					  <li className="defaultColor" value="Notification" onClick={this.selectType.bind(this,"Notification")}><a data-toggle="pill" href="#notification">Notification</a></li>
					  <li className="defaultColor" value="SMS" onClick={this.selectType.bind(this,"SMS")}><a data-toggle="pill" href="#sms">SMS</a></li>
					</ul>

					<div className="tab-content NOpadding">
					  <div id="email" className="tab-pane fade in active">
					    <div className="rowPadding subjectRow NOpadding col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div className="form-group">
								<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 labelform">Subject <span className="astrick">*</span></label>
								<input type="text" name="subject" data-text="subject"  id="subject" value={this.state.subject} onChange={this.handleChange.bind(this)} className="subject form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" required />
							</div>
						</div>

						<div className="NOpadding rowPadding col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<button className="btn-default btn-sm btnToken pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding" id="showEmailTokens" dataid="EmailTokens" onClick={this.showToken.bind(this)}>Show Available Tokens</button>
						</div>

						<div className=" rowPadding col-lg-12 col-md-12 col-sm-12 col-xs-12 showTokens" id="EmailTokens">
							{this.state.tokens ? this.state.tokens : "No Tokens Added Yet"}
						</div>

						<div className="NOpadding rowPadding col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div className="form-group">
								<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 labelform">Message <span className="astrick">*</span></label>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" id="editorEmail">
									<CKEditor activeClass="p15"  name="editorEmail" data-text="message" className="editorEmail" content={this.state.editorEmail} events={{ "change": this.onChangeEmail }}/>
								</div>
							</div>
						</div>
					  </div>
					  <div id="notification" className="tab-pane fade">
					    <div className="NOpadding rowPadding col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<button className="btn-default btn-sm btnToken pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding" dataid="SMSTokens" id="showSMSTokens" onClick={this.showToken.bind(this)}>Show Available Tokens</button>
						</div>

						<div className=" rowPadding col-lg-12 col-md-12 col-sm-12 col-xs-12 showTokens" id="SMSTokens">
							{this.state.tokens ? this.state.tokens : "No Tokens Added Yet"}
						</div>
					    <div className="NOpadding rowPadding col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div className="form-group">
								<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 labelform">Message <span className="astrick">*</span></label>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" id="editorNotification">
									<CKEditor activeClass="p15"  name="editorNotification" data-text="message" className="editorNotification" content={this.state.editorNotification} events={{ "change": this.onChangeNotification }}/>
								</div>
							</div>
						</div>
					  </div>
					  <div id="sms" className="tab-pane fade">
					    <div className="NOpadding rowPadding col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<button className="btn-default btn-sm btnToken pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding" dataid="NotifTokens" id="showNotifTokens" onClick={this.showToken.bind(this)}>Show Available Tokens</button>
						</div>

						<div className=" rowPadding col-lg-12 col-md-12 col-sm-12 col-xs-12 showTokens" id="NotifTokens">
							{this.state.tokens ? this.state.tokens : "No Tokens Added Yet"}
						</div>
					    <div className="NOpadding rowPadding col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div className="form-group">
								<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 labelform">Message <span className="astrick">*</span></label>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" id="editorSMS">
									<CKEditor activeClass="p15"  name="editorSMS" data-text="message" className="editorSMS" content={this.state.editorSMS} events={{ "change": this.onChangeSMS }}/>
								</div>
							</div>
						</div>
					  </div>
					</div>
				</div>
				<form className="newTemplateForm col-lg-12 col-md-12 col-sm-12 col-xs-12" id="newTemplateForm">
					<div className="NOpadding paddingtop-down col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<button type="submit" onClick={this.submitTemplate.bind(this)} className="col-lg-3 col-md-3 col-sm-6 col-xs-12 btn pull-right button3 outlinebox">Save Template</button>
					</div>
				</form>
                </div>
            </section>
          </div>
        </section>
      </div>
    );
  }
}
// const mapStateToProps = (state) => {
//   return {
//     vendorID: state.vendorID,
//     vendorLocationID: state.vendorLocationID
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     vendor: (vendorID, vendorLocationID) => dispatch({
//       type: 'VENDOR',
//       vendorID: vendorID,
//       vendorLocationID: vendorLocationID
//     }),
//   }
// }
// export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BasicInfo));
export default withRouter(CreateTemplateNew);