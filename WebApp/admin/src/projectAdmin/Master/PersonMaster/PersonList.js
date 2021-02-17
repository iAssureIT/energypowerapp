import React, { Component } from 'react';
import $ 					from 'jquery';
import axios 				from 'axios';
import _ 					from 'underscore';
import PersonDetails 		from './PersonDetails.js';
import Deletedemployees 	from './Deletedemployees.js';
import moment               from 'moment';
import swal                 from 'sweetalert';
import IAssureTable         from "../../../coreadmin/IAssureTable/IAssureTable.jsx";

import 'bootstrap/js/tab.js';
import { CheckBoxSelection, Inject, MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import './PersonMaster.css'

class PersonList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstname: '',
			totalCount: "0",
			supplierListOne: '',
			supplierarrayS: '',
			id: '',
			country: '-',
			states: '-',
			city: '-',
			designation: '-',
			initial: 'All',
			lenghtCount: '',
			searchByName: '',
			personList: [],
			tableHeading:{
	            empName:"Emp Name & ID",
	            contactDetails:"Contact Details",
	            actions:"Action"

	          },
	        tableObjects : {
	          paginationApply : false,
	          searchApply     : false,
	          editUrl         : '/'+window.location.pathname.split('/')[1]+'/master',
	          deleteMethod    : 'delete',
        	  apiLink         : '/api/personmaster/',
	          downloadApply   : true
	      },

			
			statesArray: [],
			masterVendor: [],
			selector:{},
			stateCode : "Select State",
			district  : "Select District",
			"pathname": window.location.pathname.split('/')[1],
			type : window.location.pathname.split('/')[1]
		};
		
		this.handleChange = this.handleChange.bind(this);
		this.ShowForm = this.ShowForm.bind(this);
		this.camelCase = this.camelCase.bind(this);
	}

	handleChange(event) {
		const target = event.target;
		const name = target.name;

		this.setState({
			[name]: event.target.value
		});
	}

	componentDidMount() {
		var role = [];
		role.push(localStorage.getItem("roles"));
		var getcompanyID = localStorage.getItem("companyID")

		this.setState({
			roles : role,
			getcompanyID:getcompanyID
		})
		$("#filterallalphab").css("color", "#fff");
		$("#filterallalphab").css("background", "#0275ce");
		this.getpersons();
		this.getStates('IN');
		this.getDesignation();
		this.getDepartment();
		this.getCompany();

	}
	componentWillReceiveProps(nextProps,prevProps) {
	}

	getDesignation() {
		axios.get("/api/designationmaster/get/list")
			.then((response) => {
				var designationArray = [];
	            response.data.map((data, ind) => {
	                designationArray.push({ id: data._id, designation: data.designation })
	            });

	            this.setState({ designationArray: designationArray })
			})
			.catch((error) => {
			})
	}
	getDepartment() {
		axios.get("/api/departmentmaster/get/list")
			.then((response) => {
				var departmentArray = [];
	            response.data.map((data, ind) => {
	                departmentArray.push({ id: data._id, department: data.department })
	            });
	            this.setState({ departmentArray: departmentArray })
			})
			.catch((error) => {
			})
	}
	getStates(StateCode) {
		axios.get("http://locations2.iassureit.com/api/states/get/list/" + StateCode)
			.then((response) => {

				this.setState({
					stateCode 	: "Select State",
					statesArray	: response.data
				})

			})
			.catch((error) => {
			})
	}
	handleChangeState(stateCode) {
		
		this.getDistrict(stateCode, 'IN');
	}
	getDistrict(stateCode, countryCode) {
		axios.get("http://locations2.iassureit.com/api/districts/get/list/" + countryCode + "/" + stateCode)
			.then((response) => {
				this.setState({
					district 		: "Select District",
					districtArray 	: response.data
				})
			})
			.catch((error) => {
			})
	}
	getCompany()
	{
		 if (this.state.pathname == "employee") {
	      var entity = "corporate"
	    } else if (this.state.pathname == "driver") {
	      var entity = "vendor"
	    } else {
	      var entity = "corporate"
	    }

	    axios.get('/api/entitymaster/get/' + entity)
	      .then((response) => {
	      	var entityArray = [];
	            response.data.map((data, ind) => {
	                entityArray.push({ id: data._id, companyName: data.companyName })
	            });
	            this.setState({ entityArray: entityArray })
	      })
	      .catch((error) => {

	      })

	}
	
	camelCase(str) {
		return str
			.toLowerCase()
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
	getpersons() {

		var formvalues = { 
			type : this.state.type,
			company_Id : localStorage.getItem("company_Id")
		}
		console.log("formValues>>>>>>>>>>>",formvalues);
		axios.post("/api/personmaster/get/list",formvalues)
		.then((response) => {
			// console.log("response persons-------------",response);
	        var tableData=response.data.filter((data,i)=>{
                return data.status!=='deleted-Active' && data.status!=='deleted-Inactive'
			});
			console.log("tableData",tableData);
			if (this.state.roles.indexOf("admin") == -1)
			{
				this.setState({
					personList   : tableData.filter(person=>person.companyID == this.state.getcompanyID),
					totalCount  : tableData.filter(person=>person.companyID == this.state.getcompanyID).length
				})
			}else{
				this.setState({
					personList   : tableData,
					personCount  : tableData.length,
					totalCount 	: tableData.length
				})
			}
			if(this.state.personList.length>0)
			{
			document.getElementById(this.state.personList[0]._id).classList.add("selectedSupplier")
			this.setState({ id: this.state.personList[0]._id, showDetails : true });
			}
		})
		.catch((error) => {
		})
	}
	deletedDriver() {
		var formvalues = { 
			type : this.state.type,
			company_Id : localStorage.getItem('company_Id')
		}
		console.log("formvalues",formvalues);
		axios.post("/api/personmaster/get/list",formvalues)
		.then((response) => {
			console.log("response",response);
	        var deletedPersonData=response.data.filter((data,i)=>{
                return data.status==='deleted-Active'|| data.status==='deleted-Inactive'
			});
			this.setState({
				deletedPersonData :deletedPersonData,
			})
		})
		.catch((error) => {
		})
	}

	handleChangeFilter(event){
		if (event.value) {
			console.log("event=>",event.value);
			var currentSelection = event.element.getAttribute("id");
	        var selector = this.state.selector;
			selector.type = this.state.type;
	        if (currentSelection === 'designationChange') {
	            selector.designations = event.value;
	        }
	        if (currentSelection === 'departmentChange') {
	            selector.departments = event.value;
			}
			selector.company_Id = localStorage.getItem("company_Id");
			console.log("selector",selector);
	        this.setState({	selector: selector },()=>{
				this.getFilteredProducts(this.state.selector);
			})       
		}
    }
	ShowForm(event) {
		var data = $(event.currentTarget).attr('id');
		this.setState({ id: data });
		$('.commonSup').show()
		$('.selected').removeClass('selectedSupplier');
		$(event.currentTarget).addClass('selectedSupplier');	
	}
	shortByAlpha(event) {
		event.preventDefault();
		for (var key in document.querySelectorAll('.alphab')) {
			$($('.alphab')[key]).css('background', '#ddd');
			$($('.alphab')[key]).css('color', '#000');
		}
		event.target.style.background = '#0275ce';
		event.target.style.color = '#fff';
		var selector=this.state.selector;
		if ($(event.target).attr('value') === 'All') {
			this.getpersons();
		} else {
			selector.initial = event.currentTarget.value; 
			selector.company_Id = localStorage.getItem("company_Id");
			this.setState({	selector: selector,showDetails : true },()=>{
				this.getFilteredProducts(selector);
			})
		}
		$('.commonSup').hide();
	}
	searchPerson(event) {
		for (var key in document.querySelectorAll('.alphab')) {
			$($('.alphab')[key]).css('background', '#ddd');
			$($('.alphab')[key]).css('color', '#000');
		}
 
		$("#filterallalphab").css("color", "#fff");
		$("#filterallalphab").css("background", "#0275ce");
		/*if(this.state.pathname !== "guest"){
		this.dropDownListObject.value = null;
		this.dropDownDepartmentListObject.value = null;
		}*/
		this.setState({
			'selector' : {},
			'initial': 'All',
		})
		if(event.target.value){
		axios.get("/api/personmaster/search/"+this.state.type+"/"+event.target.value+"/All")
			.then((response) => {
				console.log("response",response)
				
					var tableData=response.data.filter((data,i)=>{
		                return data.status!=='deleted-Active' && data.status!=='deleted-Inactive'
					});
					if (this.state.roles.indexOf("admin") == -1)
					{
						this.setState({
							personList   : tableData.filter(person=>person.companyID == this.state.getcompanyID),
							personCount  : tableData.length
						})
					}else{
						this.setState({
							personList   : tableData,
							personCount  : tableData.length
						})
					}
					if(this.state.personList.length>0)
					{
					document.getElementById(this.state.personList[0]._id).classList.add("selectedSupplier")
					this.setState({ id: this.state.personList[0]._id, showDetails : true });
					}
				
				console.log("personList",this.state.personList)
			})
			.catch((error) => {
			})
		}else{
			this.getpersons();
		}
	}
	resetFilter(event) {
		event.preventDefault();
		$('.designation').prop('selectedIndex', 0);
		$('.Statesdata').prop('selectedIndex', 0);
		$('.districtsdata').prop('selectedIndex', 0);
		$('.searchPerson').val('');
		this.setState({
			'stateCode': 'Select State',
			'district' : 'Select District',
			'selector' : {},
			'initial': 'All',
		})

		for (var key in document.querySelectorAll('.alphab')) {
			$($('.alphab')[key]).css('background', '#ddd');
			$($('.alphab')[key]).css('color', '#000');
		}
		document.getElementById("filterallalphab").style.background = '#367ea8';
		document.getElementById("filterallalphab").style.color = '#fff';

		this.getpersons();
	}
	onSelectedItemsChange(filterType, selecteditems){
		var selector=this.state.selector;
		this.setState({
	      [selecteditems.currentTarget.getAttribute('name')]: selecteditems.currentTarget.value
	    });
		if (filterType === 'state') {
			this.handleChangeState(selecteditems.currentTarget.value);
			delete selector.district
			selector.stateCode = selecteditems.currentTarget.value; 
		}
		if(filterType === 'district'){
			selector.district  = selecteditems.currentTarget.value; 
		}
		this.setState({	selector: selector },()=>{
			this.getFilteredProducts(this.state.selector);
		})
	}
	getFilteredProducts(selector){ 
		selector.type = this.state.type;
		console.log("selector",selector);
		if(selector){
			axios.post("/api/personmaster/get/filterPersons", selector)
			.then((response) => {
				console.log("response",response);
				var tableData=response.data.filter((data,i)=>{
					return data.status!=='deleted-Active' && data.status!=='deleted-Inactive'
				});
				if (this.state.roles.indexOf("admin") == -1)
				{
					this.setState({
						personList   : tableData.filter(person=>person.companyID == this.state.getcompanyID),
						personCount  : tableData.length
					})
				}else{
					this.setState({
						personList   : tableData,
						personCount  : tableData.length
					})
				}
				console.log("tableData",tableData);
				var tableDataList = tableData.map((a, i)=>{
					return{
						_id:a._id,
						empName:"<b>Name :</b> "+"<a  title='View profile' target='_blank' href='/employee-profile/"+(a._id)+"'>"+a.firstName + " " + a.lastName+"</a>" + " <br><b>Emp ID :</b> " + (a.employeeId? a.employeeId :"- NA -" )+" <br> <b>DOB : </b>"+(a.DOB ? moment(a.DOB).format("DD/MM/YYYY") : "- NA -"),
						contactDetails: "<b>Company Name : </b>" +"<a  title='View company profile'  target='_blank' href='/company-profile/"+(a.company_Id)+"'>"+a.companyName +" (" +a.companyID+")"+"</a>"+ "<br/><b>Office Location :</b> "+a.workLocation + (a.department.length>0? "<br><b> Department : </b>"+ a.department[0].department : "") + (a.designation.length>0? "<br><b>Designation :</b>"+a.designation[0].designation : "") ,
						action:""
					}
				})
				console.log("tableDataList",tableDataList)
			  	this.setState({RecordsTable:tableDataList,initial: 'All'})
				if(this.state.personList.length>0)
				{
					document.getElementById(this.state.personList[0]._id).classList.add("selectedSupplier")
					this.setState({ id: this.state.personList[0]._id, showDetails : true });
				}
			
			})
			.catch((error) => {
			})
		}else{
			this.getpersons();
		}
	}
	editBasicform(event){
    	this.props.history.push("/"+this.state.type+'/basic-details/'+event.currentTarget.getAttribute('data-id'))
    }
    deleteVendor(event){
    	event.preventDefault();
    	axios.delete("/api/entitymaster/delete/"+event.currentTarget.getAttribute('data-id'))
            .then((response)=>{
              swal({
                    title : response.data.message,
                  });
              window.location.reload();   
            })
            .catch((error)=>{
            })
    }
    hideForm(){
		this.setState({ showDetails : false });
	}
	redirectTo(event)
    {
    	this.props.history.push("/"+this.state.pathname+"/master")
    }
    deleteDriver(event){
		event.preventDefault();
		this.setState({deleteID: event.currentTarget.getAttribute('data-id')})
		$('#deleteModal').show();
    }
    restoreDriver(event){
    	event.preventDefault();
		var driverID = event.currentTarget.getAttribute('data-id')
      	var details={
			driverID    : driverID,
            updatedBy   : localStorage.getItem("user_ID")
		}
      	axios.patch("/api/personmaster/patch/restore_driver", details)
            .then((response)=>{
              	this.getpersons();
              	this.deletedDriver(); 
            	
           		if (response.data) {
					 var formValues={
						user_id_toberecover : response.data.user_id,
						updatedBy:localStorage.getItem('user_ID')
					 }
					 console.log("formValues",formValues);
					 axios.patch("/api/users/patch/restorestatus", formValues)
						.then((response)=>{
							this.getpersons();
							this.deletedDriver(); 
							if(response.data) {
								swal({
									title : " ",
									text : "Record is restored successfully.",
								});
							}else{
								swal({
									title : " ",
									text : "Failed to restore.",
								});
							}
							
						})
					.catch((error)=>{
					})
           		}else{
           			swal({
           				title : " ",
	                    text : "Failed to restore.",
	                  });
           		}
           		
            })
            .catch((error)=>{
            })
    }
    confirmDelete(event){
    	event.preventDefault();
    	axios.get("/api/personmaster/get/one/"+this.state.deleteID)
        .then((response)=>{
          this.setState({
              "personID" : response.data.userId,
          },()=>{
      		axios.delete("/api/personmaster/delete/"+this.state.deleteID)
            .then((response)=>{
              	$('#deleteModal').hide();  
              	this.deletedDriver(); 
            	axios.delete("/api/users/delete/"+this.state.personID)
			        .then((response)=>{
			        })
			        .catch((error)=>{
			        })
           		if (response.data) {
           			swal({
	                    title : " ",
	                    text :  "Record is deleted successfully."
	                  });
           		}	else{
           			swal({
	                    title : " ",
	                    text  : "Failed to delete.",
	                  });
           		}
              	this.getpersons();
              	this.hideForm();
            })
            .catch((error)=>{
            })
          });

        })
        .catch((error)=>{
        })
    }
    getDataTable(){
		$(".alphab").css({"color": "#000","background":"#ddd"});
		$(".allBtn").css("color", "#fff");
		$(".allBtn").css("background", "#0275ce");

		var formvalues = { 
			type : this.state.type,
			company_Id : localStorage.getItem("company_Id")
		}
		axios.post("/api/personmaster/get/list",formvalues)
		.then((response)=>{
			 var tableData=response.data.filter((data,i)=>{
                return data.status!=='deleted-Active' && data.status!=='deleted-Inactive'
			});
			if (this.state.roles.indexOf("admin") == -1)
			{
				this.setState({
					personList   : tableData.filter(person=>person.companyID == this.state.getcompanyID),
					personCount  : tableData.length
				})
			}else{
				this.setState({
					personList   : tableData,
					personCount  : tableData.length
				})
			}
			var tableDataList = this.state.personList.map((a, i)=>{
				return{
					_id:a._id,
					empName:"<b>Name :</b> "+"<a  title='View profile' target='_blank' href='/employee-profile/"+(a._id)+"'>"+a.firstName + " " + a.lastName+"</a>" + " <br><b>Emp ID :</b> " + (a.employeeId? a.employeeId :"- NA -" )+" <br> <b>DOB : </b>"+(a.DOB ? moment(a.DOB).format("DD/MM/YYYY") : "- NA -"),
					contactDetails: "<b>Company Name : </b>" +"<a  title='View company profile'  target='_blank' href='/company-profile/"+(a.company_Id)+"'>"+a.companyName +" (" +a.companyID+")"+"</a>"+ "<br/><b>Office Location :</b> "+a.workLocation + (a.department.length>0? "<br><b> Department : </b>"+ a.department[0].department : "") + (a.designation.length>0? "<br><b>Designation :</b>"+a.designation[0].designation : "") ,
					action:""
				}
	      	})
          this.setState({RecordsTable:tableDataList,initial: 'All'})
			
		})
		.catch((error)=>{console.log('error: ',error)})

	}
    closeModal(event){
    	event.preventDefault();
    	$('#deleteModal').hide(); 
    }
    showView(value,event){
		$('.viewBtn').removeClass('btnactive');
        $(event.target).addClass('btnactive');
    	this.setState({
    		view : value
    	})
    	this.getpersons();
    }
	render() {
		const designationfields: object = { text: 'designation', value: 'id' };
		const departmentfields: object = { text: 'department', value: 'id' };
		const companyfields: object = { text: 'companyName', value: 'id' };
		var currentRole = localStorage.getItem("roles");
		console.log("this.state.personList",this.state.personList);
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
						<section className="content">
							<div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
							
								<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
									<h4 className="weighttitle col-lg-5 col-md-11 col-xs-11 col-sm-11">{this.state.pathname ? this.state.pathname : "Person"} List</h4>
										{
											this.state.pathname === "employee"
											?
											<div className="col-lg-5 col-md-12 col-sm-12 col-xs-12 pull-right">
												<span className="col-lg-5 col-lg-offset-1 sentanceCase addButtonList" onClick={this.redirectTo.bind(this)}>
													<i  className="fa fa-plus-circle"></i>&nbsp;&nbsp;{"Add "+this.state.pathname} 
												</span>

												<button type="button" className="btn col-lg-5  col-lg-offset-1 col-sm-12 col-xs-12 sentanceCase addButtonList deleteemplist" data-toggle="modal" data-target="#DeletedDriversModal"  onClick={this.deletedDriver.bind(this)}><i  className="fa fa-minus-circle"></i>&nbsp;&nbsp;<b>{"Deleted "+this.state.pathname+"s"}</b> </button>
												{/* <span className="col-lg-5  col-lg-offset-1 sentanceCase addButtonList" data-toggle="modal" data-target="#DeletedDriversModal"  onClick={this.deletedDriver.bind(this)}>
													<i  className="fa fa-minus-circle"></i>&nbsp;&nbsp;{"Deleted "+this.state.pathname+} 
												</span>  */}
												<div className="modal" id="deleteModal" role="dialog">
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
				                                <div className="modal modalIndex" id="DeletedDriversModal" tabIndex="-1" role="dialog" aria-hidden="true">
				                                    <div className="modal-dialog modal-lg " role="document">
				                                        <div className="modal-content UMmodalContent ummodallftmg ummodalmfdrt  ">
				                                            <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
																{/* <h4 className="CreateTempModal col-lg-11 col-md-11 col-sm-11 col-xs-11 textAlignLeft" id="exampleModalLabel"><b>Deleted Drivers</b></h4> */}
																
				                                                <div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
				                                                    <button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
				                                                        <span aria-hidden="true">&times;</span>
				                                                    </button>
				                                                </div>     
				                                            </div>
				                                            <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
				                                              	
																{this.state.deletedPersonData != "-" ?
																	<div className="table-responsive topmr40 col-lg-12 col-md-12 col-sm-12 col-xs-12">
																		<table className="table iAssureITtable-bordered table-striped table-hover">
																			<thead className="tempTableHeader">
																				<tr className="">
																					<th className="umDynamicHeader srpadd textAlignCenter"> Sr No. </th>
																					<th className="umDynamicHeader srpadd textAlignCenter sentanceCase"> {this.state.pathname} Name </th>
																					<th className="umDynamicHeader srpadd textAlignCenter "> Status </th>
																					{/* <th className="umDynamicHeader srpadd textAlignCenter"> License Validity</th> */}
																					<th className="umDynamicHeader srpadd textAlignCenter"> Deleted On </th>
																					<th className="umDynamicHeader srpadd textAlignCenter"> Action </th>
																				</tr>
																			</thead>
																			<tbody>
																				{this.state.deletedPersonData && this.state.deletedPersonData.length > 0 
																					?
																					this.state.deletedPersonData.map((data, index) => {
																						var statusLength = data.statusLog.length
																						return (
																							<tr key={index}>
																								<td className="textAlignCenter">{index+1}</td>
																								<td className="textAlignLeft">
																									<div>
																										{data.firstName+ " "+(data.middleName?data.middleName:"")+ " "+data.lastName}
																										<p>{data.contactNo+" | "+data.email}</p>
																									</div>
																								</td>
																								<td className="textAlignCenter sentanceCase">{data.status}</td>
																								{/* <td className="textAlignCenter">{moment(data.drivingLicense.effectiveTo).format("DD/MM/YYYY")}</td> */}
																								<td className="textAlignCenter">{ statusLength > 0  ? moment(data.statusLog[statusLength-1].updatedAt).format("DD/MM/YYYY") : "-"}</td>
																								<td className="textAlignCenter">
																									<span>
																										<button className="btn deleteBtn" title="Delete"  data-id={data._id}  onClick={this.deleteDriver.bind(this)}>Delete Permanently</button> 
																										<br/>
																										<button className="btn restoreBtn sentanceCase" title="Restore" data-id={data._id}  onClick={this.restoreDriver.bind(this)}>Restore {this.state.pathname}</button> 
																									</span>
																								</td>
																							</tr>
																						);
																					})
																					:
																					<tr className="trAdmin"><td colSpan={5} className="noTempData textAlignCenter">No Record Found!</td></tr>
																				}
																			</tbody>
																		</table>
																	</div>
																	:
																	<div className="centernote col-lg-12"> No data available </div>
																}
				                                            </div>
				                                        </div>
				                                    </div>
				                                </div>
											</div>
											:
											<div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 pull-right">
												<div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
													<span className="col-lg-12  sentanceCase addButtonList" onClick={this.redirectTo.bind(this)}><i  className="fa fa-plus-circle"></i>&nbsp;&nbsp;{"Add "+this.state.pathname} 
													</span>
												</div>
												<div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">

													<button type="button" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 sentanceCase addButtonList deleteemplist" data-toggle="modal" data-target="#DeletedUsersModal"><i  className="fa fa-minus-circle"></i>&nbsp;&nbsp;<b>{"Deleted "+this.state.pathname+"s"}</b> </button>
														<Deletedemployees
															getpersons ={this.getpersons.bind(this)}
															tableData={this.state.tableData}
														/>
												</div>
											</div>
											
										}
								</div>
								
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
									<h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12"><i className="fa fa-filter"></i>&nbsp;&nbsp;<b> Select Filter</b></h5>
									<h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12 nopadding">Total Records :&nbsp;&nbsp;<b>{this.state.totalCount}</b></h5>
									<h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12 nopadding">Filtered :&nbsp;&nbsp;<b>{this.state.personList.length}</b></h5>
										<div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 pull-right inLOE" >
											<span className="blocking-span" >
												<input type="text" name="search" className="col-lg-8 col-md-8 col-sm-8 col-xs-12 Searchusers searchEntity inputTextSearch outlinebox pull-right texttrans"
													placeholder="Search..." onInput={this.searchPerson.bind(this)} />
											</span>
										</div>
								</div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 borderBottomSO">
	                            </div>

								<div className="contenta col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls nopadding">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										
									</div>
									{
										this.state.type === "employee" ?  
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<br/>
										<div className="col-lg-2 col-md-12 col-sm-12 col-xs-12 nopadding">
											<button type="button" className="reset" onClick={this.resetFilter.bind(this)}>RESET FILTER</button>
										</div>
											
											<div className="col-lg-3 col-md-12 col-xs-12 col-sm-12">
												<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Department</label>
												<MultiSelectComponent id="departmentChange" 
													// ref={(scope)=>{this.dropDownDepartmentListObject=scope}}
													dataSource={this.state.departmentArray}
	                                                change={this.handleChangeFilter.bind(this)}
													fields={departmentfields} placeholder="Select Department" 
													mode="CheckBox" selectAllText="Select All" 
													unSelectAllText="Unselect All" showSelectAll={true}>
	                                                <Inject services={[CheckBoxSelection]} />
	                                            </MultiSelectComponent>
											</div>
											<div className="col-lg-3 col-md-12 col-xs-12 col-sm-12">
												<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Designation</label>
												<MultiSelectComponent id="designationChange" 
													// ref={(scope) => { this.dropDownListObject = scope; }} 
													dataSource={this.state.designationArray}
	                                                change={this.handleChangeFilter.bind(this)} mode='mode' 
	                                                fields={designationfields} placeholder="Select Designation" mode="CheckBox" 
	                                                selectAllText="Select All" unSelectAllText="Unselect All" 
	                                                showSelectAll={true}>
	                                                <Inject services={[CheckBoxSelection]} />
	                                            </MultiSelectComponent>
											</div>
											{/*
											 currentRole == "admin" ?
												<div className="col-lg-3 col-md-12 col-xs-12 col-sm-12">
													<label className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-left">Company Name</label>
													<MultiSelectComponent id="companyChange" 
														// ref={(scope) => { this.dropDownListObject = scope; }} 
														dataSource={this.state.entityArray}
		                                                change={this.handleChangeFilter.bind(this)} mode='mode' 
		                                                fields={companyfields} placeholder="Select Company" mode="CheckBox" 
		                                                selectAllText="Select All" unSelectAllText="Unselect All" 
		                                                showSelectAll={true}>
		                                                <Inject services={[CheckBoxSelection]} />
		                                            </MultiSelectComponent>
												</div>
												 :
												 null
											*/}
											

										</div> : null
									}
									
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
										<br/>
											<button type="button" className="btn alphab"  id="filterallalphab" onClick={this.shortByAlpha.bind(this)} name="initial" value={this.state.initial} onChange={this.handleChange}>All</button>
											<button type="button" className="btn alphab" value="A" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>A</button>
											<button type="button" className="btn alphab" value="B" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>B</button>
											<button type="button" className="btn alphab" value="C" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>C</button>
											<button type="button" className="btn alphab" value="D" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>D</button>
											<button type="button" className="btn alphab" value="E" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>E</button>
											<button type="button" className="btn alphab" value="F" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>F</button>
											<button type="button" className="btn alphab" value="G" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>G</button>
											<button type="button" className="btn alphab" value="H" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>H</button>
											<button type="button" className="btn alphab" value="I" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>I</button>
											<button type="button" className="btn alphab" value="J" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>J</button>
											<button type="button" className="btn alphab" value="K" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>K</button>
											<button type="button" className="btn alphab" value="L" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>L</button>
											<button type="button" className="btn alphab" value="M" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>M</button>
											<button type="button" className="btn alphab" value="N" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>N</button>
											<button type="button" className="btn alphab" value="O" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>O</button>
											<button type="button" className="btn alphab" value="P" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>P</button>
											<button type="button" className="btn alphab" value="Q" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>Q</button>
											<button type="button" className="btn alphab" value="R" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>R</button>
											<button type="button" className="btn alphab" value="S" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>S</button>
											<button type="button" className="btn alphab" value="T" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>T</button>
											<button type="button" className="btn alphab" value="U" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>U</button>
											<button type="button" className="btn alphab" value="V" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>V</button>
											<button type="button" className="btn alphab" value="W" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>W</button>
											<button type="button" className="btn alphab" value="X" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>X</button>
											<button type="button" className="btn alphab" value="Y" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>Y</button>
											<button type="button" className="btn alphab" value="Z" onClick={this.shortByAlpha.bind(this)} onChange={this.handleChange}>Z</button>
									</div>
								</div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 customTab">
									<div className="col-lg-2 col-md-2 col-sm-6 col-xs-12 pull-right">
										<i className="fa fa-th fa-lg btn viewBtn pull-right" name="view" ref="view" value={this.state.view} onClick={this.showView.bind(this,'Grid')} onChange={this.handleChange} aria-hidden="true"></i>&nbsp;&nbsp;
										<i className="fa fa-th-list fa-lg btn pull-right viewBtn btnactive" name="view" ref="view" value={this.state.view} onClick={this.showView.bind(this,'List')} onChange={this.handleChange} aria-hidden="true"></i>
									</div>
								</div>
								{this.state.view === 'Grid' ?
								<div className="col-lg-12"> 
									<IAssureTable 
				                      tableHeading={this.state.tableHeading}
				                      dataCount={this.state.entityCount}
				                      tableData={this.state.RecordsTable}
				                      tableObjects={this.state.tableObjects}
				                      getData={this.getDataTable.bind(this)}
				                      id={"id"}
				                      tableName={this.state.entityType}
				                      />
			                      </div>
								 :
								 <div className="col-lg-12 noPadding">
								 {
								 this.state.personList && this.state.personList.length > 0 ?
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 scrollbar" id="style-2">
										<div className="borderlist12">
											{
											this.state.personList.map((data, index) => {
													return (
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 borderlist selected" key={index} onClick={this.ShowForm.bind(this)} name={index} data-child={data._id + '-' + index} id={data._id}>
															<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 supplierLogoDiv">
																<img src={data.profilePhoto? data.profilePhoto:"/images/noImagePreview.png"} className="employeeLogoImage"></img>
															</div>
															<div className="col-lg-8 col-md-10 col-sm-10 col-xs-10 listprofile">
																<h5 className="titleprofile">{data.firstName +" "+ data.lastName + (data.employeeId ? " (EmpID:"+data.employeeId+")":"")}</h5>
																<ul className="col-lg-12 col-md-12 col-sm-9 col-xs-9 listfont">	
																{/*this.state.type=="employee"  ?
																	data && data.department && data.department[0]?
																		<li>{data.department[0].department+ ", " + data.designation[0].designation +", ("+data.type.replace(/^./, data.type[0].toUpperCase())+")"}</li>
																	:
																	null
																:
																null
																*/}
																{this.state.type=="driver || guest || employee" ?
																	<li>{data.type.replace(/^./, data.type[0].toUpperCase())}</li>
																:
																	null
																}
																	<li><i className="fa fa-id-badge" aria-hidden="true"></i>&nbsp;{data.companyID ? data.companyName + " (Company ID: "+data.companyID +" )": " - "}</li>
																	<li><i className="fa fa-phone " aria-hidden="true"></i>&nbsp;{data.contactNo ? data.contactNo : " - "}</li>
																	<li><i className="fa fa-envelope " aria-hidden="true"></i>&nbsp;{data.email ?data.email : " - "}</li>
																</ul>
															</div>
															<div className="col-lg-2 noRightPadding">
																<div className="addedDivPM col-lg-10 col-lg-offset-2 ">
																	<img src="/images/leftArrow.png"/>
																</div>
															</div>
														</div>
													);
												})
											}
										</div>

									</div>
									:
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-align-center">
										<h5>No Data Found</h5>
									</div>
								}
								{
								this.state.showDetails ?
									<div>
									{
									 this.state.id && this.state.personList && this.state.personList.length > 0 ?
										<div className="col-lg-7 col-md-6 col-sm-6 col-xs-12 pdcls suppliersOneProfile commonSup" id={this.state.id}>
											<div id={this.state.id} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding" >
												<PersonDetails 
													name={this.state.index} 
													id={this.state.id} 
													getPersons={this.getpersons.bind(this)}
												 	hideForm={this.hideForm.bind(this)} type={this.state.type}/>
											
											</div>
										</div>
										:
										null
									}
									</div>	
									:
									null
								}
								</div>
								}							
							</div>
						</section>
					</div>
				</div>
			</div>
		);
	}
}
export default PersonList;