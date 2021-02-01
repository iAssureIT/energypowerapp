import React, { Component }       from 'react';
import {browserHistory} 		  from 'react-router';
import swal                       from 'sweetalert';
import $ 						  from 'jquery';
import axios 					  from 'axios';
import CKEditor 				  from "react-ckeditor-component";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';


class EditNotificationModal extends Component{

	constructor(props){
		super(props);
		this.state = {
	    'event' 		    : props.data ? props.data.event : '',
	    'templateName' 		    : props.data ? props.data.templateName : '',
	    'templateType' 		: props.data ? props.data.templateType : '',
		'role'		: props.data ? props.data.role : '',
		'company'		: props.data && props.data.company != null ? props.data.company : 'All',
		'status'		: props.data ? props.data.status : '',
		'subject'			: props.data ? props.data.subject : '',
		'content'			: props.data ? props.data.content : '',
	   	'optionA'			: '',
	   	'messageError' 		: '',
	   	shown 				: true,
		tokens 			: "",
		roleArray:[],
		companyArray:[],
		eventArray:[],
	  };

	    this.handleChange = this.handleChange.bind(this);
	    this.onChange 		= this.onChange.bind(this);
	}
	componentDidMount() {
        this.getRoles();
        this.getCompany();
        this.getAllEvents();
    }

	componentWillReceiveProps(nextProps){
		this.getRoles();
        this.getCompany();
        this.getAllEvents();
		this.setState({
			'event' 		    : nextProps.data.event,
			'templateName' 		    : nextProps.data.templateName,
			'templateType' 		: nextProps.data.templateType,
			'role'		: nextProps.data.role,
			'status'		: nextProps.data.status,
			'company'		: nextProps.data.company,
			'subject'			: nextProps.data.subject,
			'content'			: nextProps.data.content,
		});
	}

	getTokens(){
		axios.get('/api/EventToken/get/token/'+this.state.event)
		.then((response)=>{
			this.setState({
				tokens : response.data
			})
		})
	}


	handleChange(event){
	  const target = event.target;
	  const name   = target.name;
	  this.setState({
	  	[name]: event.target.value,
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

	updateNotificationEmail(event){
		event.preventDefault();

	    if(this.state.content){
	    	var editId 		 = this.props.emailNot;
			var event        = this.state.event;
			var templateType     = this.state.templateType;
			var status     = this.state.status;
			var subject          = this.state.subject;
			var cketext          = this.state.content;
			if(cketext === null || cketext === ""){
				swal({
					title: 'This field is required.',
					// text:"This field is required.",
					type: 'success',
					showCancelButton: false,
					confirmButtonColor: '#666',
					confirmButtonText: 'Ok'
				});
			}else{	
				var formValues = {
					"editId":editId,
					"status": status,
					"content": this.state.content,
					"subject":this.state.subject
				}
				axios.patch('/api/masternotifications/update', formValues)
				.then((response)=> {		
					 swal("Template updated successfully");		
					this.setState({
						shown : false,
					});
						this.props.getData()

					
					$('#editNotifyModal-'+this.props.emailNot).hide();
				    $('.modal-backdrop').remove();
                   
				})
				.catch((error)=> {
					console.log('inside error=>',error)
					this.setState({
						shown : false,
					});
				})
			}
		}else{
			this.setState({
				contentError: 'This field is required.',
			});
		}
    	// }
	}
	selectType(event){
		event.preventDefault();
		const target = event.target;
	  const name   = target.name;
	  this.setState({
	  	[name]: event.target.value,
	  });
	
	}
	
	updateContent(newContent) {
        this.setState({
            content: newContent
        })
    }
    onChange(evt){
      var newContent = evt.editor.getData();
      this.setState({
        content: newContent
      },()=>{
      	if(this.state.content){
      		this.setState({
      			messageError : ''
      		});
      	}else{
      		this.setState({
      			messageError : 'This field is required'
      		});
      	}
      });
    }

    showAllTokens(event){
    	event.preventDefault();
    	this.getTokens();
		$('.showTokens').toggle();
		var change = document.getElementById('showTokens');
        if (change.innerHTML == "Show Available Tokens")
        {
            change.innerHTML = "Hide Available Tokens";
        }
        else {
            change.innerHTML = "Show Available Tokens";
        }
	}


	render() {
		if(this.props.emailNot){
	        return (
	        	<div>
	        		{this.state.shown === true ? 
					<div className="modal modalHide" id={"editNotifyModal-"+this.props.emailNot} role="dialog">
					  	<div className="modal-dialog modal-lg" role="document">
					    	<div className="modal-content modalContent col-lg-12 NOpadding">
					      		<div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
					        		<h4 className="CreateTempModal col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel">Edit {this.state.templateType} Template</h4>
					        		<div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
								        <button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
								          <span aria-hidden="true">&times;</span>
								        </button>
							        </div>
					      		</div>

					     		<div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
							        <form className="newTemplateForm" id="editModal" >
							         	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding rowPadding">
											
											<div className="col-lg-3 col-md-3 col-sm-12 col-xs-12" >
                                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Event <sup className="astrick">*</sup></label>
                                                <select id="event" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" disabled="disabled" value={this.state.event} ref="event" name="event" >
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
                                                <select id="role" disabled="disabled" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.role} ref="role" name="role" >
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
                                                <select id="company" disabled="disabled" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.company} ref="company" name="company">
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
										{this.state.templateType!='Notification' && this.state.templateType!='SMS' ?
											<div className="rowPadding col-lg-12 col-md-12 col-xs-12 col-sm-12">
												<div className="form-group">
												 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 labelform">Subject <span className="astrick">*</span></label>     						
											     <input type="text" name="subject" value={this.state.subject} onChange={this.handleChange} className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" required/>
												</div>	
											</div>
											:
											null
										}
										<div className="rowPadding col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<button className="btn-default btn-sm btnToken pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding" id="showTokens" onClick={this.showAllTokens.bind(this)}>Show Available Tokens</button>
										</div>

										<div className=" rowPadding col-lg-12 col-md-12 col-sm-12 col-xs-12 showTokens">
											{this.state.tokens ? this.state.tokens : "No Tokens Added Yet"}
										</div>
										<div className="rowPadding col-lg-12 col-md-12 col-xs-12 col-sm-12">
											<div className="form-group">
												 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 labelform">Message <span className="astrick">*</span></label> 
												 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">  
												 	<CKEditor activeClass="p15" id="editor"  className="templateName" name="content" content={this.state.content} events={{"change": this.onChange}}/>
												 </div> 
												 			
												<label className="redFont">{this.state.messageError}</label>			
											</div>
										</div>
									</form>
							    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<button type="submit"  className="col-lg-3 col-md-3 col-sm-6 col-xs-12 btn pull-right button3 outlinebox" id={this.props.emailNot} onClick={this.updateNotificationEmail.bind(this)}>Update Template</button>
							   	</div>
					      		</div>
					   		</div>
					  	</div>
					</div>
					:
					null
				}
				</div>
		    );
		}else{
			return (<div></div>);
		}
	} 

}
export default EditNotificationModal;