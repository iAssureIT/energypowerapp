import React from 'react';
import CKEditor from 'ckeditor4-react';
import IAssureTableUM 					 from '../../IAssureTableUM/IAssureTable.jsx';
import axios                       		 from 'axios';

import moment               			 from 'moment';
import  UMSelectRoleUsers 				 from '../../userManagement/UM/UMSelectRoleUsers.jsx';
import swal                     		 from 'sweetalert';

import './MessageForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';

export default class MessageForm extends React.Component {
	constructor(props) {
		
		super(props);
		this.state = {
		 	allPosts 			: [],
		 	id 					: "",
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

	render() {
		var adminRolesListDataList = this.state.adminRolesListData;
		// console.log("id",this.state.id);
		return (
			<div >
				<form id="MessageForm" className="form-horizontal ">
					<div className="form-group">
				        <label className="control-label col-sm-2">To :</label>
				        <div className="col-sm-10 MessageFormwrap cf">
				        	<input type="text" className="form-control addemailsbtn" id="email" placeholder="" name="email"/>
				      		<button type="button" className="buttonAddEmails" data-toggle="modal" data-target={"#"+this.state.id}  >+</button>{/*onClick={this.onclickEvent.bind(this)}*/}
				      	</div>
				      		{/*<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#AddRecipients">Open Modal</button>*/}
				    </div>
				    { this.props.Cc ?
				    <div className="form-group">
				      	<label className="control-label col-sm-2">Cc :</label>
				      	<div className="col-sm-10 MessageFormwrap cf">
				        	<input type="text" className="form-control" id="email" placeholder="" name=""/>
				      		<button className="buttonAddEmails">+</button>
				      	</div>
				    </div>
				    :""
					}
					{ this.props.Cc ?
				    <div className="form-group">
				      <label className="control-label col-sm-2">Bcc :</label>
				      <div className="col-sm-10 MessageFormwrap cf">
				        <input type="text" className="form-control" id="email" placeholder="" name=""/>
				      	<button className="buttonAddEmails">+</button>
				      </div>
				    </div>
				    :""
					}
				    <div className="form-group">
				      <label className="control-label col-sm-2">Subject :</label>
				      <div className="col-sm-10">
				        <input type="text" className="form-control" id="email" placeholder="" name="email"/>
				      </div>
				    </div>
				    <div className="form-group">
				      <label className="control-label col-sm-2">Message :</label>
				      <div className="col-sm-10">  
				      	<CKEditor data="<p></p>" />        
				      </div>
				    </div>

				</form>

				{/*<!-- Modal -->*/}
				<div id={this.state.id} className="modal" role="dialog">
					
				  <div className="modal-dialog modalwidth">

				    {/*<!-- Modal content-->*/}
				    <div className="modal-content">
				      <div className="modal-header">
				        <button type="button" className="close" data-dismiss="modal">&times;</button>
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
							    {/*<div className="col-lg-4">
							      	<label >Select Role (select one):</label>
							      	<select className="form-control" id="sel1">
								        <option>1</option>
								        <option>2</option>
								        <option>3</option>
								        <option>4</option>
							    	</select>
							    </div>*/}
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

				        <button type="button" className="btn btn-success nxtbtn pull-right" >Next</button>
				        {/*<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>*/}
				      </div>
				     
				    </div>

				  </div>
				</div>
			</div>
		);
	}
}
