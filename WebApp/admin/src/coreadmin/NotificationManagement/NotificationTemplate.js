import React, { Component } from 'react';
import $                    from 'jquery';
import jQuery               from 'jquery';
import axios                from 'axios';
import moment               from 'moment';
import swal                 from 'sweetalert';
import { withRouter }       from 'react-router-dom';
import 'bootstrap/js/tab.js';
import './NotificationTemplate.css';
import './notification.css';
import BulkUpload from "../Master/BulkUpload/BulkUpload.js";
import TemplateList from './TemplateList.js';
import CreateTemplate from './CreateTemplate.js';


class NotificationTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	"pathname": this.props.type ? this.props.type : "",
            type:'Email',
			roleArray:[],
			eventArray:[],
			filterStatus:'',
			filterEvent:'',
			filterRole:'',
			filterCompany:'All',
			TemplatesListCount : 0,
			filteredTemplatesCount : 0,
			filteredSelectors : "",
			selector : {},
			selectorOn:false,
			fileDetailUrl: "/api/masternotifications/get/filedetails/",
             goodRecordsHeading: {
	        templateType: "Template Type",
	        templateName: "Template Name",
	        role: "Role",
	        company: "Company Name",
	        entityType: "eEntity Type",
	        website: "Website",
	        content: "Content",
	        subject: "Subject",
	        },
			failedtableHeading: {
	        templateType: "Template Type",
	        templateName: "Template Name",
	        role: "Role",
	        company: "Company Name",
	        entityType: "Entity Type",
	        website: "Website",
	        content: "Content",
	        subject: "Subject",
      
      }
        };
    }

    componentDidMount(){
    	this.getAllEvents();
    	this.getRoles();
    	this.getCompany();
    	this.getData('Email')
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
    
    getData(type){
    	axios.get('/api/masternotifications/get/listByType/'+type)
       .then((response) => {
         if(response.data){ 
            this.setState({
                TemplatesListCount:response.data.length
            })
          }else{
          	this.setState({
                TemplatesListCount:0
            })
          }
        })
       .catch((err)=>{console.log('error: ',err)})
    }

    handleChange(event) {
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        var value = event.target.value;
        this.setState({
            [name]: event.target.value
        });
    }

    getType(type){
       this.setState({type:type})
    }

    clickTab(value){
		this.setState({type:value},()=>{
			if(this.state.selectorOn){
				this.getFilteredTemplate(this.state.selector);
			}else{
				this.getData(value)
			}
		
		})
    }

    selectFilter(event){
		$(".filterWrapper").toggle();
	}

	resetFilter(event) {
		event.preventDefault();
		this.setState({
			filterStatus:'',
			filterEvent:'',
			filterRole:'',
			filterCompany:'All',
			filteredTemplatesCount:0,
			filteredSelectors: "",
			selector:{},
			selectorOn:false
		},()=>{
			this.getData(this.state.type)
		})
	}


	

	getFileDetails(fileName) {

    axios
      .get(this.state.fileDetailUrl + this.state.pathname + fileName)
      .then((response) => {
        console.log("filedetails...",response);
        $('.fullpageloader').hide();
        if (response) {
          this.setState({
            fileDetails: response.data,
            failedRecordsCount: response.data.failedRecords.length,
            goodDataCount: response.data.goodrecords.length
          });
          // if (this.state.pathname === "ViewTemplates") {
            var tableData = response.data.goodrecords.map((a, i) => {
              return {

	                "templateType": a.templateType ? a.templateType : '-',
	                "event": a.event ? a.event : '-',
	                "entityType": a.entityType ? a.entityType : '-',
	                "templateName": a.templateName ? a.templateName : '-',
	                "role": a.role ? a.role : '-',
	                "company": a.company ? a.company : '-',
	                "subject": a.subject ? a.subject : '-',
	                "content": a.content ? a.content : '-',
                 }
            })

            var failedRecordsTable = response.data.failedRecords.map((a, i) => {
              return {
                    "templateType": a.templateType ? a.templateType : '-',
	                "event": a.event ? a.event : '-',
	                "entityType": a.entityType ? a.entityType : '-',
	                "templateName": a.templateName ? a.templateName : '-',
	                "role": a.role ? a.role : '-',
	                "company": a.company ? a.company : '-',
	                "subject": a.subject ? a.subject : '-',
	                "content": a.content ? a.content : '-',
              }
            })
          // }

          this.setState({
            goodRecordsTable: tableData,
            failedRecordsTable: failedRecordsTable
          })
        }
      })
      .catch((error) => {
      })
  }
   redirectTo(event)
    {
    	this.props.history.push("/ViewTemplates")
    }

	onSelectedItemsChange(filterType, selecteditems){
		console.log('inside selector==>',filterType,selecteditems.currentTarget.value)
		var selector=this.state.selector;
		this.setState({
	      [selecteditems.currentTarget.getAttribute('name')]: selecteditems.currentTarget.value
	    });
		
		if(filterType === 'filterEvent'){
			selector.filterEvent  = selecteditems.currentTarget.value; 
		}
		if(filterType === 'filterRole'){
			selector.filterRole  = selecteditems.currentTarget.value; 
		}
		if(filterType === 'filterStatus'){
			selector.filterStatus  = selecteditems.currentTarget.value; 
		}
		if(filterType === 'filterCompany'){
			selector.filterCompany  = selecteditems.currentTarget.value; 
		}
		this.setState({	selector: selector,selectorOn:true },()=>{
			this.getFilteredTemplate(this.state.selector);
		})
	}
	getFilteredTemplate(selector){
		console.log('selector:',selector)
		axios.post("/api/masternotifications/get/filterTemplate/"+this.state.type,selector)
		.then((response) => {
		  if(response.data){ 
            this.setState({
                filteredTemplatesCount:response.data.length,
                filteredSelectors:selector
            })
          }else{
          	this.setState({
                filteredTemplatesCount:0,
                filteredSelectors:""
            })
          }
		})
		.catch((error) => {
		})
	}

	    
    render() {
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                        <section className="content">
                            <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                    <h4 className="weighttitle col-lg-8 col-md-8 col-xs-8 col-sm-8 NOpadding-right">Notification Management</h4>
                                </div>
                                <section className="Content">
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                          {/* <ul className="nav tabNav nav-pills col-lg-3 col-md-3 col-sm-12 col-xs-12">
						                        <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill" href="#manual">Manual</a></li>
						                        <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center"><a data-toggle="pill" href="#bulk">Bulk Upload</a></li>
						                    </ul>*/}
                                           {/*<div  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt20">
								              <ul className="nav tabNav nav-pills col-lg-3 col-md-3 col-sm-12 col-xs-12 pull-right">
								                <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center"><a data-toggle="pill" data-toggle="modal" data-target="#createNotifyModal">Create New Template</a></li>
								                <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center"><a data-toggle="pill" href="#bulk">Bulk Upload</a></li>
								              </ul>
								            </div>*/}
   											 
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mrgTp1">
                                            	<a href="/CreateTemplate"><button className="pull-right btn btn-primary btn-sm btn_oval col-lg-2 col-md-2"onClick={this.redirectTo.bind(this)}><i className="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;Add New Template</button></a>
                                            	{/*<CreateTemplate getType={this.getType.bind(this)} />*/}
   											</div>
   											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	   											{/*<li className="col-lg-2 col-md-2 col-xs-2 col-sm-2  pull-right btn btn-primary btn-sm btn_oval  text-center"style={{marginTop:"20px"}}><a data-toggle="pill" href="#bulk" style={{color:"#fff"}}>Bulk Upload</a></li>*/}
						                          <section className="Content tab-content">
									                <div id="bulk" className="tab-pane fade in col-lg-12 col-md-1f2 col-sm-12 col-xs-12 mt">
									                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerForm">
									                    <BulkUpload 
									                        url="/api/masternotifications/bulkUploadNotification"
							                                data={{ "type": "employee", "createdBy": localStorage.getItem("user_ID"), "corporateId": localStorage.getItem("corporate_ID") }}
							                                uploadedData={this.uploadedData}
							                                fileurl="https://fivebees.s3.ap-south-1.amazonaws.com/prod/master/notificationBulk.xls"
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
					                            </section>
					                         </div>   
   											<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 nopadding">									
												<div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopadding rowPadding">
													<button type="button" className=" selectFilterBtn reset" onClick={this.selectFilter.bind(this)}>
														<i className="fa fa-filter"></i>&nbsp;&nbsp;<b> SELECT FILTER</b>
													</button>
												</div>
													<h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12 nopadding">Total Records :&nbsp;&nbsp;<b>{this.state.TemplatesListCount}</b></h5>
													<h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12 nopadding">Filtered :&nbsp;&nbsp;<b>{this.state.filteredTemplatesCount}</b></h5>

												</div>
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding firstElement filterWrapper rowPadding">
													<div className="col-lg-2 col-md-12 col-sm-12 col-xs-12 nopadding">
														<button type="button" className="reset selheight" onClick={this.resetFilter.bind(this)}>RESET FILTERS</button>
													</div>
													
													<div className="col-lg-3 col-md-12 col-xs-12 col-sm-12 nopadding">
														<select id="filterEvent" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.filterEvent} ref="filterEvent" name="filterEvent" onChange={this.onSelectedItemsChange.bind(this,'filterEvent')}>
	                                                        <option className="fontAjt" disabled value="">Select Event</option>
	                                                       {this.state.eventArray && this.state.eventArray.length > 0 ?
											                	this.state.eventArray.map((data,index)=>{
											                		return(
											                			<option key={index} value={data.templateName}>{data.templateName}</option>
											                		)
											                	})
											                	:
											                	<option disabled>No Event Added Yet</option>
											                }
	                                                    </select>   
													</div>
													<div className="col-lg-2 col-md-12 col-xs-12 col-sm-12">
														<select id="filterRole" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.filterRole} ref="filterRole" name="filterRole" onChange={this.onSelectedItemsChange.bind(this,'filterRole')}>
	                                                        <option className="fontAjt" disabled value="">Select Role</option>
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
													<div className="col-lg-2 col-md-12 col-xs-12 col-sm-12 nopadding">
	                                                    <select id="filterStatus" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.filterStatus} ref="filterStatus" name="filterStatus" onChange={this.onSelectedItemsChange.bind(this,'filterStatus')}>
	                                                        <option className="fontAjt" disabled value="">Select Status</option>
	                                                        <option> active </option>
															<option> inactive </option>
	                                                    </select>
													</div>
													<div className="col-lg-3 col-md-12 col-xs-12 col-sm-12">
	                                                    <select id="filterCompany" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.filterCompany} ref="filterCompany" name="filterCompany" onChange={this.onSelectedItemsChange.bind(this,'filterCompany')}>
	                                                        <option className="fontAjt" disabled value="All">Select Company</option>
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
   											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mrgTp1">
												<ul className="nav nav-pills nav-justified" id="navContents">
											      <li className="active" onClick={this.clickTab.bind(this,'Email')}>
											        <a data-toggle="tab" href="#email" role="tab">Email</a>
											      </li>
											      <li onClick={this.clickTab.bind(this,'SMS')}>
											        <a data-toggle="tab" href="#sms" role="tab">SMS</a>
											      </li>
											      <li onClick={this.clickTab.bind(this,'Notification')}>
											        <a data-toggle="tab" href="#notification" role="tab">Notification</a>
											      </li>
											    </ul>

                								<div className="tab-content" id="nav-tabContent">
								                  <div className="tab-pane fade in active" id="email" role="tabpanel">
								                        <TemplateList type={this.state.type} filteredSelectors={this.state.filteredSelectors} />
								                  </div>
								                  <div className="tab-pane fade" id="sms" role="tabpanel">
								                        <TemplateList type={this.state.type} filteredSelectors={this.state.filteredSelectors} />
								                  </div>
								                  <div className="tab-pane fade" id="notification" role="tabpanel">
								                        <TemplateList type={this.state.type} filteredSelectors={this.state.filteredSelectors} />
								                  </div>
	               								</div>
   											</div>
   											
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}
export default NotificationTemplate;