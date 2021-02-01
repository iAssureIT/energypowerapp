import React, { Component }    from 'react';
import EditNotificationModal   from './EditNotificationModal.jsx';
import axios 				   from 'axios';
import swal                     	from 'sweetalert';
import $ from 'jquery';
import './NotificationTemplate.css';
import './notification.css';


class TemplateContent extends Component{

	constructor(props) {
      super(props);   
      
        this.state = {
	    templateType    : '',
	    templateName    : '',
	    subject         : '',
	    content         : '',
	   
	  };

    }
    componentDidMount(){

    	if(this.props.status == 'active'){
			$('#toggleSwitch').attr("checked", true);
        }else {
            $('#toggleSwitch').attr("checked", false);
        }

        this.setState({
        	role: this.props.templateValues.role,
        	company: this.props.company,
        	status: this.props.status,
        	subject: this.props.templateValues.subject,
        	content: this.props.templateValues.content
        })

    }

    componentWillReceiveProps(nextProps){

    	if(nextProps.status == 'active'){
			$('#toggleSwitch').attr("checked", true);
        }else {
            $('#toggleSwitch').attr("checked", false);
        }
        this.setState({
        	role: nextProps.templateValues.role,
        	company: nextProps.company,
        	status: nextProps.status,
        	subject: nextProps.templateValues.subject,
        	content: nextProps.templateValues.content
        })
    }
	deleteEmailTemplate(event){
		event.preventDefault();
		var id = event.target.id;
		axios.delete('/api/masternotifications/delete/'+id)
		.then((response)=> {
	    	swal("Template deleted successfully");
		    this.props.getData();
		}).catch((error)=> {
		});
	}

	
	changeStatus(event){
		if(this.props.status == 'active'){
			var value = 'inactive';
		}else{
			var value = 'active';
		}
		var formValues = {
			notifId : this.props.templateValues._id,
			status : value
		}
		axios.patch('/api/masternotifications/patch/status',formValues)
		.then((response)=>{
			swal("Status changed successfully!")
			this.getData();
		})
		.catch((error)=>{
			console.log('error: ',error);
		})
		
	}
	getData(){
		axios.get('/api/masternotifications/get/'+this.props.templateValues._id)
        .then((response) => {
            this.setState({
                role: response.data.role,
	        	status: response.data.status,
	        	subject: response.data.subject,
	        	content: response.data.content
            })
            if(response.data.company === null || response.data.company === undefined || response.data.company === ""){
                this.setState({
                    companyname : 'All'
                })
            }else{
                var companyId = response.data.company ;
                axios.get('/api/entitymaster/get/one/'+companyId)
                .then((res)=>{
                    this.setState({
                    	companyname : res.data[0].companyName,
                    	company : res.data[0].companyName
                    })
                })
                .catch((error)=>{console.log(error)})
            }
        })
        .catch((error)=>{console.log(error)})
		
	}

	render() {
		if(this.props.status == 'active'){
			$('#toggleSwitch').attr("checked", true);
        }else {
            $('#toggleSwitch').attr("checked", false);
        }
			var text = this.state.content ? this.state.content : ''; 
		        return (
		    	<div className="contentBox col-lg-12">
		      		<div className="pull-right actionBtn">
		      			<div className="dropdown ">
						  	<i className="fa fa-ellipsis-h dropbtn" aria-hidden="true"></i>
						  	<div className="dropdown_content">
		      				<ul className="pdcls ulbtm">
		      					 <li>  
                                <a href="#" data-toggle="modal" data-target={"#editNotifyModal-"+this.props.templateValues._id} id={this.props.templateValues._id} title="Edit"><i className="fa fa-pencil" aria-hidden="true"></i>&nbsp;&nbsp;Edit</a>
                              </li>
                              <li>
                                <a data-toggle="modal" data-target={`#${this.props.templateValues._id}-rm`}  id={this.props.templateValues._id} title="Delete"><i className="fa fa-trash-o" aria-hidden="true"></i>&nbsp;Delete</a>
                                 
                              </li>
		      				</ul>
		      				</div>
						</div>
						
					</div>
					<EditNotificationModal emailNot={this.props.templateValues._id} getData={this.getData.bind(this)} data={this.props.templateValues} />

					<div className="modal col-lg-12 col-md-12 col-sm-12 col-xs-12" id={`${this.props.templateValues._id}-rm`}  role="dialog">
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

	                                 <h4 className="blackFont textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 examDeleteFont">Are you sure you want to delete this template?</h4>
	                              </div>
	                              
	                              <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
	                                        <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
	                                   </div>
	                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
	                                        <button id={this.props.templateValues._id} onClick={this.deleteEmailTemplate.bind(this)} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
	                                   </div>
	                              </div>
	                         </div>
	                    </div>
	               </div>

					<div className="col-md-12 NOpadding divStyle">
						<div className="col-md-4">
							<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Role</label>
							<p className="subject noBorderBox col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">{this.state.role}</p>
						</div>
						
						<div className="col-md-4">
							<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Company</label>
							<p className="subject noBorderBox col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">{this.state.company}</p>
						</div>
						<div className="col-md-4">
							<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Status</label>
							{/*<div className="toggle-switch">
						        <input
						          type="checkbox"
						          className="toggle-switch-checkbox"
						          name="toggleSwitch"
						          id="toggleSwitch"
						          value={this.props.status} onClick={this.changeStatus.bind(this)}
						        />
						        <label className="toggle-switch-label" htmlFor="toggleSwitch">
						          <span className="toggle-switch-inner" />
						          <span className="toggle-switch-switch" />
						        </label>
						    </div>*/}
						    <div className="btn-group btn-group-toggle col-lg-12 nopadding" data-toggle="buttons">
                              <label className={this.state.status === "active" ? "btn toggleButton customToggleButton col-lg-3 btn-secondary active nopadding" : "nopadding btn toggleButton customToggleButton col-lg-3 btn-secondary "} value="active" onClick={this.changeStatus.bind(this, "active")}  >
                                <input type="radio"
                                  name="options"
                                  id="active"
                                  value="active"
                                  autoComplete="off"
                                  checked={this.state.status === "active" ? "checked" : "unchecked"}
                                /> Active
                            </label>
                              <label className={this.state.status === "inactive" ? "btn toggleButton customToggleButton col-lg-3 btn-secondary active nopadding" : "btn toggleButton customToggleButton col-lg-3 btn-secondary nopadding"} value="inactive" onClick={this.changeStatus.bind(this, "inactive")}>
                                <input type="radio" name="options" id="inactive" value="inactive" autoComplete="off" checked={this.state.toggleButtonValue === "inactive" ? "checked" : "unchecked"} /> Inactive
                            </label>
                              
                            </div>
						</div>


					</div>
					{this.props.templateValues.templateType === 'Email' ?
					<div className="inputrow col-md-12 NOpadding">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div className="form-group overAuto">
							 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Subject:</label>     						
						        <p className="subject noBorderBox col-lg-12 col-md-12 col-sm-12 col-xs-12 wrapText">{this.state.subject}</p>
							</div>	
						</div>
					</div>
					:
					null
					}
					<div className="inputrow col-md-12 NOpadding"> 
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div className="form-group overAuto">
							 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Message:</label>     						
							 <p  dangerouslySetInnerHTML={{ __html:text}} className="textAreaBox col-lg-12 col-md-12 col-sm-12 col-xs-12 wrapText"></p>
							</div>	
						</div>
					</div>
					</div>
			    );

	} 

}
export default TemplateContent;