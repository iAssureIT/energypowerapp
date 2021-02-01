import React from 'react';
import CKEditor from 'ckeditor4-react';
import IAssureTableUM 					 from '../../IAssureTableUM/IAssureTable.jsx';
import axios                       		 from 'axios';

import moment               			 from 'moment';
import  UMSelectRoleUsers 				 from '../../userManagement/UM/UMSelectRoleUsers.jsx';
import swal                     		 from 'sweetalert';
import S3FileUpload             from 'react-s3';

import { connect }   from 'react-redux';
import './MessageForm.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/js/modal.js';

export default class EmailForm extends React.Component {

	constructor(props) {
		
		super(props);
		this.state = {
		 	allPosts 			: [],
		 	id 					: "",
		 	receipientArray 	: [],
		 	emails 				: "",
		 	ccID 					: "",
		 	bcc 				: "",
		 	subject 			: "",
		 	message 			: "",
		 	attachmentfile 		: "",

		 	"twoLevelHeader"    : {
						            apply  : false,
						           },
             "tableHeading"     : {
                fullName        : 'User Details',
        		city       		: "City",
        		company 		: "Company",
        		role 			: "Role",
				email        	: 'Email',
				mobNumber 		: 'Mobile Number',
                status        	: 'Status',
				// actions        	: 'Action',
			},
			"tableObjects" 		: {
				paginationArray : true
			},
            "startRange"        : 0,
            "limitRange"        : 10, 
            blockActive			: "all",
            "listofRoles"	    : "",
            adminRolesListData  : [],
            checkedUser  : [],
            activeswal : false,
            blockswal : false,
            confirmDel : false,
            unCheckedUser:false
		}
    	this.handleChange  = this.handleChange.bind(this);
			
	}
	handleChange(event){
	  	event.preventDefault();
        const target = event.target;
        const name   = target.name; 
        this.setState({

        [event.target.name]:event.target.value 
        }); 
    }
	componentDidMount(){
	    const user_ID = localStorage.getItem("user_ID");
	    this.setState({ 
	    	id : this.props.id ,
	        user_ID: user_ID
	    },()=>{
	    	var user_ID=this.state.user_ID
	       	axios.get('/api/users/get/'+user_ID)
	        .then( (res)=>{  
	        	this.setState({ 
			        username: res.data.firstname +" "+ res.data.lastname
			    })
	        })
		    .catch((error)=>{
		    }); 
	    })
		this.getRole();
		var data = {
			"startRange"        : this.state.startRange,
            "limitRange"        : this.state.limitRange, 
		}
		this.getData(this.state.startRange, this.state.limitRange)
	}

	getData(startRange, limitRange){    
		var data = {
			"startRange"        : parseInt(startRange),
            "limitRange"        : parseInt(limitRange), 
		}    
       	axios.post('/api/users/get/list', data)
        .then( (res)=>{  

        	// console.log('res',res);

            var tableData = res.data.filter((data,i)=>{
              return data.status !== '<span class="label label-default statusLabel">deleted</span>';
            }); 
            console.log('tableData0',tableData);
        	var tableData = tableData.map((a, i)=>{
				return {
					_id 			: a._id,
					fullName        : a.fullName,
					city 			: "",
					company 		: "",
					role 			: a.role.map((b,j)=> '  <span>'+b+' </span>').toString(),
					email 			: a.email,
					mobNumber 		: a.mobNumber,
	                status        	: a.status,	
				}
			})
        	
          	this.setState({
              completeDataCount : res.data.length,
              tableData 		: tableData,          
            })
        })
	    .catch((error)=>{
	    }); 
    }
    getSearchText(searchText, startRange, limitRange){
        var data = {
			searchText: searchText,
			startRange: startRange,
			limitRange: limitRange
		}
		axios.post('/api/users/get/searchlist',data)
		.then((res)=>{
			console.log('res', res.data);
			var tableData = res.data.filter((data,i)=>{
              return data.status!== '<span class="label label-default statusLabel">deleted</span>';
            });
			var tableData = tableData.map((a, i)=>{
				return {
					_id 			: a._id,
					fullName        : a.fullName,
					city 			: "",
					company 		: "",
					role 			: a.role.map((b,j)=> '  <span>'+b+' </span>').toString(),
					email 			: a.email,
					mobNumber 		: a.mobNumber,
	                status        	: a.status
	            }
			})
			console.log('tableData', tableData);
          	this.setState({
              completeDataCount : res.data.length,
              tableData 		: tableData,          
            })
		})
		.catch((error)=>{
		})
        this.setState({
            tableData : []
        });
    }
    setunCheckedUser(value){
		this.setState({
			unCheckedUser : value,
		})
	}
	selectedUser(checkedUsersList){
		this.setState({
			checkedUser : checkedUsersList,
		})
		console.log("checkedUser",this.state.checkedUser)
	}
	getRole(){
		var data = {
			"startRange"        : this.state.startRange,
			"limitRange"        : this.state.limitRange, 
		}
		axios.post('/api/roles/get/list', data)
		.then((response)=> {
		    	// console.log('response',response);
		    this.setState({
		      adminRolesListData : response.data
		    },()=>{
		    })
		}).catch(function (error) {
		});
	}
	selectedRole(event){
		event.preventDefault();
		var selectedValue        = this.refs.roleListDropdown.value;
		var keywordSelectedValue = selectedValue.split('$')[0];
		var formValues ={
			searchText : selectedValue,
		}


		if(selectedValue === "all"){
			this.getData(this.state.startRange, this.state.limitRange)
		}else{
			var data = {
				"startRange"        : this.state.startRange,
				"limitRange"        : this.state.limitRange, 
			}
			axios.post('/api/users/get/list/role/'+keywordSelectedValue, data)
		      .then(
		        (res)=>{
					var tableData = res.data.filter((data,i)=>{
		              return data.status!== '<span class="label label-default statusLabel">deleted</span>';
		            });
					var tableData = tableData.map((a, i)=>{
						return {
							_id 			: a._id,
							fullName        : a.fullName,
							city 			: "",
							company 		: "",
							role 			: a.role.map((b,j)=> '  <span>'+b+' </span>').toString(),
							email 			: a.email,
							mobNumber 		: a.mobNumber,
			                status        	: a.status
						}
					})
		          	this.setState({
		              tableData 		: tableData,          
		            }) 
		        }).catch((error)=>{ 
		            swal(" ", "Sorry there is no data of "+selectedValue,"");
		      });

		}				    
	}
	// onclickEvent(){
 	//  	this.setState({
 	//  	      			id : this.props.id ,
	 //  	      		});
	// 	console.log("id===>",this.state.id);
 	//  }
	selectedDataFromodal(){
 	var selectedData = this.state.checkedUser;
 	// console.log("in next btn",selectedData);
 	var receipientArray = [];
 	if (selectedData) {
			for (var i = 0; i < selectedData.length; i++) {
				
					axios.get('/api/users/get/'+selectedData[i])
			        .then( (res)=>{  

			         console.log('res',res.data.email);
			         this.setState({
			        			emails:res.data.email+","+this.state.emails
			        		},()=>{
			        		// console.log("emails",this.state.emails);
			       	 		})
			        	})
				    .catch((error)=>{
				    }); 

					}	
			}
			
 }
 selectedccIDFromodal(){
 	// console.log("im in cc")
 	var selectedData = this.state.checkedUser;
 	// console.log("in cc btn",selectedData);
 	var receipientArray = [];
 	if (selectedData) {
			for (var i = 0; i < selectedData.length; i++) {
				
					axios.get('/api/users/get/'+selectedData[i])
			        .then( (res)=>{  

			         console.log('res',res.data.email);
			         this.setState({
			        			ccID:res.data.email+","+this.state.ccID
			        		},()=>{
			        		// console.log("emails",this.state.emails);
			       	 		})
			        	})
				    .catch((error)=>{
				    }); 

					}	
			}
			
 }
 selectedBccEnailsFromodal(){
 	// console.log("im in cc")
 	var selectedData = this.state.checkedUser;
 	// console.log("in cc btn",selectedData);
 	var receipientArray = [];
 	if (selectedData) {
			for (var i = 0; i < selectedData.length; i++) {
				
					axios.get('/api/users/get/'+selectedData[i])
			        .then( (res)=>{  

			         console.log('res',res.data.email);
			         this.setState({
			        			bcc:res.data.email+","+this.state.bcc
			        		},()=>{
			        		// console.log("emails",this.state.emails);
			       	 		})
			        	})
				    .catch((error)=>{
				    }); 

					}	
			}
			
 }

	onEditormessage( evt ) {
      this.setState( {
          message: evt.editor.getData()
      } );
  	}
 	Submit(event){
	    event.preventDefault();
	    // var adminEmail = this.getAdminEmail();  //Get email id from company settings. Write API for that.
	    // var adminEmail = "info@iassureit.com";
	    
	    let email = this.state.emails ? this.state.emails.split(',') : "";
	    let Cc = this.state.ccID ? this.state.ccID.split(',') : "";
	    let Bcc = this.state.bcc ? this.state.bcc.split(',') : "";
	    var formValues1;
		email.map((emailData,index)=>(
		
	
			  formValues1 = {
			        "email"         : emailData,
			        "subject"       : this.state.subject,
			        "text"          : "", 
			        "mail"          : this.state.message,
			        "cc"            : Cc.map((CcData,index)=>(CcData)),
			        "bcc"           : Bcc.map((BccData,index)=>(BccData)),
			        "attachment"	: this.state.attachmentfile,
			      },
					      // console.log("notification",formValues1);
					      console.log("notification",formValues1)

			))
	 		/*       axios
	        .post('/send-email',formValues1)
	        .then((res)=>{
	          console.log("re==",res);
	                   if(res.status === 200){
	                    swal("Thank you for contacting us. We will get back to you shortly.")
	                    }
	                })
	                .catch((error)=>{
	                  console.log("error = ", error);
	                  
	                });
	           
	                this.refs.emails.value = "";
	                this.refs.subject.value = "";
	                // this.refs.message.value = "";*/           
	}
    docBrowseSingle(event) {
        event.preventDefault();
        var name = event.target.name
        var docBrowse = [];
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            for (var i = 0; i < event.currentTarget.files.length; i++) {
                var file = event.currentTarget.files[i];
                if (file) {
                    var fileName = file.name;
                    var ext = fileName.split('.').pop();
                    if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "pdf" || ext === "JPG" || ext === "PNG" || ext === "JPEG" || ext === "PDF") {
                        if (file) {
                            var objTitle = { fileInfo: file }
                            docBrowse.push(objTitle);
                          console.log("docBrowse",docBrowse)

                        } else {
                            swal("Files not uploaded");
                        }//file
                    } else {
                        swal("Allowed images formats are (jpg,png,jpeg, pdf)");
                    }//file types
                }//file
            }//for 

            if (event.currentTarget.files) {
                main().then(formValues => {
                    console.log("formValues",formValues);
                    var docBrowse = this.state[name];
                    this.setState({
                        [name]: formValues[0].docBrowse
                    },()=>{
                        console.log("attachmentfile0",this.state.attachmentfile)
                    })
                });

                async function main() {
                    var formValues = [];
                    for (var j = 0; j < docBrowse.length; j++) {
                        var config = await getConfig();
                        var s3url = await s3upload(docBrowse[j].fileInfo, config, this);
                        const formValue = {
                            "docBrowse": s3url,
                            "status": "New"
                        };
                        formValues.push(formValue);
                    }
                    return Promise.resolve(formValues);
                }


                function s3upload(image, configuration) {

                    return new Promise(function (resolve, reject) {
                        S3FileUpload
                            .uploadFile(image, configuration)
                            .then((Data) => {
                                resolve(Data.location);
                            })
                            .catch((error) => {
                            })
                    })
                }
                function getConfig() {
                  return new Promise(function (resolve, reject) {
                      axios
                        .get('/api/projectsettings/get/S3')
                        .then((response) => {
                            const config = {
                                bucketName: response.data.bucket,
                                dirName: 'propertiesImages',
                                region: response.data.region,
                                accessKeyId: response.data.key,
                                secretAccessKey: response.data.secret,
                            }
                            resolve(config);
                        })
                        .catch(function (error) {
                        })
                    })
                }
            }
        }
    }
    deleteDocSingle(event){
    	event.preventDefault();
        var name = event.target.getAttribute("name");
      
        this.setState({
            [name]: ""
        })
  	}

	render() {
		var adminRolesListDataList = this.state.adminRolesListData;
		// console.log("id",this.state.id)
		return (
			<div >
				<form id="MessageForm" className="form-horizontal ">
					<div className="form-group">
				        <label className="control-label col-lg-1">To </label>
				        <div className=" col-lg-10 MessageFormwrap cf">
				        	<input type="text" className="form-control addemailsbtn" id="email" placeholder="" name="emails" ref="emails" value={this.state.emails} onChange={this.handleChange.bind(this)}/>				      		
				      		
				      		<button type="button" id="emailToBtn1" className="buttonAddEmails" data-toggle="modal" data-target="#email1">+</button>{/*onClick={this.onclickEvent.bind(this)}*/}
				      	</div>
				      		{/*<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#AddRecipients">Open Modal</button>*/}
				    </div>
				    <div className="form-group">
				      	<label className="control-label col-lg-1">Cc </label>
				      	<div className=" col-lg-10 MessageFormwrap cf">
				        	<input type="text" className="form-control" id="cc" name="ccID" ref="ccID" value={this.state.ccID} onChange={this.handleChange.bind(this)}/>
				      		{/*<button id="ccIDToBTn" className="buttonAddEmails">+</button>*/}
				      		<button type="button" id="emailToBtn1" className="buttonAddEmails" data-toggle="modal" data-target="#emailofCC">+</button>{/*onClick={this.onclickEvent.bind(this)}*/}

				      	</div>
				    </div>
				    <div className="form-group">
				      	<label className="control-label col-lg-1">Bcc </label>
				      	<div className=" col-lg-10 MessageFormwrap cf">
				        	<input type="text" className="form-control" id="bcc" placeholder=""  name="bcc" ref="bcc" value={this.state.bcc} onChange={this.handleChange.bind(this)}/>
				      	{/*<button className="buttonAddEmails">+</button>*/}
				      		<button type="button" id="emailToBtn1" className="buttonAddEmails" data-toggle="modal" data-target="#email1ofBcc">+</button>{/*onClick={this.onclickEvent.bind(this)}*/}
				      	</div>
				    </div>
				    <div className="form-group">
				      	<label className="control-label col-lg-1">Subject </label>
				      	<div className=" col-lg-10">
				        	<input type="text" className="form-control" id="subject" placeholder=""  name="subject" ref="subject" value={this.state.subject} onChange={this.handleChange.bind(this)}/>
				      	</div>
				    </div>
				    <div className="form-group">
				      	<label className="control-label col-lg-1">Attachment </label>
				      	<div className=" col-lg-10">
                        	<input onChange={this.docBrowseSingle.bind(this)}  type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="attachmentfile" />
				        	{/*<input type="text" className="form-control" id="subject" placeholder=""  name="subject" ref="subject" value={this.state.subject} onChange={this.handleChange.bind(this)}/>*/}
				      	</div>
				    </div>
				    <div className="form-group">
				      <label className="control-label col-lg-1">Message </label>
				      <div className=" col-lg-10">  
				      	<CKEditor 
				      	data={this.state.message} 
				      	onChange={this.onEditormessage.bind(this)} />        
				      </div>
				    </div>
				    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 nopadding bt40">
                    	<button type="button" className="btn btn-primary col-lg-3 pull-right" onClick={this.Submit.bind(this)}>Send Message</button>			
				    </div>
				</form>

				{/*<!-- Modal -->*/}
				<div>
					<div id="emailofCC" className="modal" role="dialog">
						 <div className="modal-dialog modalwidth">
						    {/*<!-- Modal content-->*/}
						    <div className="modal-content">
						      <div className="modal-header">
						        <button type="button" id="closeemailmodal" className="close closeemailmodal" data-dismiss="modal">&times;</button>
						        <h4 className="modal-title text-center">Add Recipients</h4>
						    
						      	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						      		<div className="boxInModal row">
						      			<div className="col-lg-4">
									      	<label >Select City (select one):</label>
									      	<select className="form-control" id="sel1">
												<option name="roleListDDOption" disabled="disabled" selected="true">-- Select --</option>

										        <option>1</option>
										        <option>2</option>
										        <option>3</option>
										        <option>4</option>
									    	</select>
									    </div>
									    <div className="col-lg-4">
									      	<label >Select Company (select one):</label>
									      	<select className="form-control" id="sel1">
												<option name="roleListDDOption" disabled="disabled" selected="true">-- Select --</option>

										        <option>1</option>
										        <option>2</option>
										        <option>3</option>
										        <option>4</option>
									    	</select>
									    </div>
									   
									    <div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6">
									      	<label >Select Role (select one):</label>
											<select className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control" ref="roleListDropdown" name="roleListDropdown" onChange={this.selectedRole.bind(this)} >
												<option name="roleListDDOption" disabled="disabled" selected="true">-- Select --</option>
												<option value="all" name="roleListDDOption">Show All</option>		
												
												{ adminRolesListDataList.map( (rolesData,index)=>{
													return <UMSelectRoleUsers  key={index} roleDataVales={rolesData.role}/>
												  }) 
												}
											</select>
										</div>
						      		</div>
						      		
						      		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<IAssureTableUM
											completeDataCount={this.state.completeDataCount}
											twoLevelHeader={this.state.twoLevelHeader} 
											getData={this.getData.bind(this)} 
											tableHeading={this.state.tableHeading} 
											tableData={this.state.tableData} 
											Actioncol="Actioncol" 
											tableObjects={this.state.tableObjects}
											getSearchText={this.getSearchText.bind(this)}
											selectedUser={this.selectedUser.bind(this)} 
											setunCheckedUser={this.setunCheckedUser.bind(this)} 
											unCheckedUser={this.state.unCheckedUser}
		            						UsersTable = {true}
										/>			
									</div>
						      	</div>

						        <button type="button" className="btn btn-primary nxtbtn pull-right"  onClick={this.selectedccIDFromodal.bind(this)} data-dismiss="modal" >Add Cc</button>
						        {/*<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>*/}
						      </div>
						     
						    </div>

						  </div>
					</div>
					{/**/}
					<div id="email1" className="modal" role="dialog">
						<div className="modal-dialog modalwidth">
					    	{/*<!-- Modal content-->*/}
					    	<div className="modal-content">
						      	<div className="modal-header">
							        <button type="button" id="closeemailmodal" className="close closeemailmodal" data-dismiss="modal">&times;</button>
							        <h4 className="modal-title text-center">Add Recipients</h4>
							      	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							      		<div className="boxInModal row">
							      			<div className="col-lg-4">
										      	<label >Select City (select one):</label>
										      	<select className="form-control" id="sel1">
													<option name="roleListDDOption" disabled="disabled" selected="true">-- Select --</option>
											        <option>1</option>
											        <option>2</option>
											        <option>3</option>
											        <option>4</option>
										    	</select>
										    </div>
										    <div className="col-lg-4">
										      	<label >Select Company (select one):</label>
										      	<select className="form-control" id="sel1">
													<option name="roleListDDOption" disabled="disabled" selected="true">-- Select --</option>
											        <option>1</option>
											        <option>2</option>
											        <option>3</option>
											        <option>4</option>
										    	</select>
										    </div>
										    <div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6">
										      	<label >Select Role (select one):</label>
												<select className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control" ref="roleListDropdown" name="roleListDropdown" onChange={this.selectedRole.bind(this)} >
													<option name="roleListDDOption" disabled="disabled" selected="true">-- Select --</option>
													<option value="all" name="roleListDDOption">Show All</option>		
													{ adminRolesListDataList.map( (rolesData,index)=>{
														return <UMSelectRoleUsers  key={index} roleDataVales={rolesData.role}/>
													  }) 
													}
												</select>
											</div>
							      		</div>
							      		
							      		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<IAssureTableUM
												completeDataCount={this.state.completeDataCount}
												twoLevelHeader={this.state.twoLevelHeader} 
												getData={this.getData.bind(this)} 
												tableHeading={this.state.tableHeading} 
												tableData={this.state.tableData} 
												Actioncol="Actioncol" 
												tableObjects={this.state.tableObjects}
												getSearchText={this.getSearchText.bind(this)}
												selectedUser={this.selectedUser.bind(this)} 
												setunCheckedUser={this.setunCheckedUser.bind(this)} 
												unCheckedUser={this.state.unCheckedUser}
			            						UsersTable = {true}
											/>			
										</div>
							      	</div>

						        	<button type="button" className="btn btn-primary nxtbtn pull-right" data-dismiss="modal" onClick={this.selectedDataFromodal.bind(this)} >Add Recipients</button>
						        	{/*<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>*/}
					      		</div>
					    	</div>
					  	</div>
					</div>
					{/**/}
					{/**/}
					<div id="email1ofBcc" className="modal" role="dialog">
						<div className="modal-dialog modalwidth">
					    	{/*<!-- Modal content-->*/}
					    	<div className="modal-content">
						      	<div className="modal-header">
							        <button type="button" id="closeemailmodal" className="close closeemailmodal" data-dismiss="modal">&times;</button>
							        <h4 className="modal-title text-center">Add Recipients</h4>
							      	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							      		<div className="boxInModal row">
							      			<div className="col-lg-4">
										      	<label >Select City (select one):</label>
										      	<select className="form-control" id="sel1">
													<option name="roleListDDOption" disabled="disabled" selected="true">-- Select --</option>
											        <option>1</option>
											        <option>2</option>
											        <option>3</option>
											        <option>4</option>
										    	</select>
										    </div>
										    <div className="col-lg-4">
										      	<label >Select Company (select one):</label>
										      	<select className="form-control" id="sel1">
													<option name="roleListDDOption" disabled="disabled" selected="true">-- Select --</option>
											        <option>1</option>
											        <option>2</option>
											        <option>3</option>
											        <option>4</option>
										    	</select>
										    </div>
										    <div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6">
										      	<label >Select Role (select one):</label>
												<select className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control" ref="roleListDropdown" name="roleListDropdown" onChange={this.selectedRole.bind(this)} >
													<option name="roleListDDOption" disabled="disabled" selected="true">-- Select --</option>
													<option value="all" name="roleListDDOption">Show All</option>		
													{ adminRolesListDataList.map( (rolesData,index)=>{
														return <UMSelectRoleUsers  key={index} roleDataVales={rolesData.role}/>
													  }) 
													}
												</select>
											</div>
							      		</div>
							      		
							      		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<IAssureTableUM
												completeDataCount={this.state.completeDataCount}
												twoLevelHeader={this.state.twoLevelHeader} 
												getData={this.getData.bind(this)} 
												tableHeading={this.state.tableHeading} 
												tableData={this.state.tableData} 
												Actioncol="Actioncol" 
												tableObjects={this.state.tableObjects}
												getSearchText={this.getSearchText.bind(this)}
												selectedUser={this.selectedUser.bind(this)} 
												setunCheckedUser={this.setunCheckedUser.bind(this)} 
												unCheckedUser={this.state.unCheckedUser}
			            						UsersTable = {true}
											/>			
										</div>
							      	</div>

						        	<button type="button" className="btn btn-primary nxtbtn pull-right" data-dismiss="modal" onClick={this.selectedBccEnailsFromodal.bind(this)} >add Bcc</button>
						        	{/*<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>*/}
					      		</div>
					    	</div>
					  	</div>
					</div>
				</div>
			</div>
		);
	}
}
