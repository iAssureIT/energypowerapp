import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import EntityDetails from './EntityDetails.jsx';
import {withRouter}  from 'react-router-dom';

import IAssureTable           from "../../../../../coreadmin/IAssureTable/IAssureTable.jsx";

import 'bootstrap/js/tab.js';
import '../css/ListOfEntity.css';
import '../css/ListOfEntityFilter.css';
import '../css/ListOfAllEntity.css';

class ListOfEntities extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstname: '',
			supplierListOne: '',
			supplierarrayS: '',
			id: '',
			country: '-',
			states: '-',
			city: '-',
			category: '-',
			initial: 'All',
			lenghtCount: '',
			searchByName: '',
			entityList: [],
			masterVendor: [],
			selector:{},
			stateCode : "Select State",
			showDetails : false,
			view : 'List',
			district  : "Select District",
			"pathname": window.location.pathname.split('/')[1],
			entityType : this.props.entity ,
			RecordsTable:[],
			tableHeading:{
	            companyName:"Company Name",
	            companyEmail:"Company Email",
	            companyPhone:"Company Contact",
	            location:"Locations",
	            contacts:"Contacts",
	            department:"Departments",
	            actions:"Action"

	          },
	          tableObjects : {
	          paginationApply : false,
	          searchApply     : false,
	          editUrl         : '/'+this.props.entity+'/basic-details',
	          deleteMethod    : 'delete',
        	  apiLink         : '/api/entitymaster/',
	          downloadApply   : true
	      },
	      startRange        : 0,
      	  limitRange        : 100000,
      	  company_id        : this.props.company_id ? this.props.company_id : '', 
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
		var getcompanyID = localStorage.getItem("company_Id")
		var role = [];
		role.push(localStorage.getItem("roles"));

		this.setState({
			roles:role,
			entityType : this.props.entity,
			getcompanyID:getcompanyID
		})
		//by default All flter button should be active  
		$(".allBtn").css("color", "#fff");
		$(".allBtn").css("background", "#0275ce");
		// axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
		this.getEntities();
		this.getStates('IN');

	}

	componentWillReceiveProps(nextProps){
		this.setState({
			entityType : nextProps.entity
		})
		this.getData();
		this.getEntities();
		this.getgridFilteredProducts();
	}

	getData(){
		$(".alphab").css({"color": "#000","background":"#ddd"});
		$(".allBtn").css("color", "#fff");
		$(".allBtn").css("background", "#0275ce");
		var formvalues = {
			startRange : this.state.startRange,
			limitRange : this.state.limitRange,
			type : this.state.entityType
		}
		axios.post('/api/entitymaster/getAll',formvalues)
		.then((response)=>{
			if (this.state.roles.indexOf("admin") === -1)
				{
					
					var FilteredData =  response.data.filter(entity=>entity.supplierOf == this.state.getcompanyID)
					var tableData = FilteredData.map((a, i)=>{
					var locDetails = a.locations.map((l,i)=>{
						return ("<ul class='nopadding'><li><b>BranchCode</b>:"+l.branchCode+"</li><li><b>Type</b>: "+l.locationType+"</li><li><b>Address</b>: "+l.addressLine1+"</li></ul>")
					})
					var contactData = a.contactPersons.map((c,i)=>{
						return "<ul class='nopadding'><li><b>BranchCode</b>:"+c.branchCode+"</li><li><b>Name</b>:<a title='View profile' target='_blank' href="+'/employee-profile/'+c.personID+">"+c.firstName+" "+c.lastName+"</a></li><li><b>Email</b>:"+c.email+"</li></ul>"
					})
					var departmentData = a.departments.map((k,i)=>{
						return "<ul class='nopadding'><li><b>Department : </b>"+k.departmentName+"</li><li><b>Project : </b>"+k.projectName+"</li></ul>"
					}).join("")
			        return{
			        	_id:a._id,
			             companyName:"<a  title='View company profile'  target='_blank' href="+'/company-profile/'+a._id+">"+a.companyName +"</a>"+"<br> <b>Group Name : </b> "+a.groupName,
			            companyEmail:a.companyEmail,
			            companyPhone:a.companyPhone,
			            location:locDetails && locDetails.length > 0 ? locDetails : "No Location Added Yet",
			            contacts:contactData && contactData.length > 0 ? contactData : "No Contacts Added Yet",
			            department : departmentData && departmentData.length> 0? departmentData : "No Departments Added Yet",
			            action:""
			        }
			      })
				
				}else{
					var tableData = response.data.map((a, i)=>{
					var locDetails = a.locations.map((l,i)=>{
						return "<ul class='nopadding'><li><b>BranchCode</b>:"+l.branchCode+"</li><li><b>Type</b>: "+l.locationType+"</li><li><b>Address</b>: "+l.addressLine1+"</li></ul>"
					})
					var contactData = a.contactPersons.map((c,i)=>{
						return "<ul class='nopadding'><li><b>BranchCode</b>:"+c.branchCode+"</li><li><b>Name</b>:<a title='View profile' target='_blank' href="+'/employee-profile/'+c.personID+">"+c.firstName+" "+c.lastName+"</a></li><li><b>Email</b>:"+c.email+"</li></ul>"
					})
					var departmentData = a.departments.map((k,i)=>{
						return "<ul class='nopadding'><li><b>Department : </b>"+k.departmentName+"</li><li><b>Project : </b>"+k.projectName+"</li></ul>"
					}).join("")
			        return{
			        	_id:a._id,
			             companyName:"<a  title='View company profile'  target='_blank' href="+'/company-profile/'+a._id+">"+a.companyName +"</a>"+"<br> <b>Group Name : </b> "+a.groupName,
			            companyEmail:a.companyEmail,
			            companyPhone:a.companyPhone,
			            location:locDetails && locDetails.length > 0 ? locDetails : "No Location Added Yet",
			            contacts:contactData && contactData.length > 0 ? contactData : "No Contacts Added Yet",
			            department : departmentData && departmentData.length> 0? departmentData : "No Departments Added Yet",
			            action:""
			        }
			      })
				}

          this.setState({RecordsTable:tableData,initial: 'All'})
			
		})
		.catch((error)=>{console.log('error: ',error)})

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
	
	camelCase(str) {
		return str
			.toLowerCase()
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
	getEntities() {
		$(".lists").removeClass("selectedSupplier")
		axios.get("/api/entitymaster/get/count/"+this.state.entityType)
		.then((response) => {

			this.setState({
				entityCount   : response.data.count
			})
		})
		.catch((error) => {
		})
		var url ='';
		if(this.state.entityType === "supplier" && this.state.company_id!==''){
			url = "/api/entitymaster/get/list/"+this.state.entityType+"/"+this.state.company_id;

		}else{
			url = "/api/entitymaster/get/"+this.state.entityType;
		}
		axios.get(url)
		.then((response) => {
			$(".alphab").css({"color": "#000","background":"#ddd"});
			$(".allBtn").css("color", "#fff");
			$(".allBtn").css("background", "#0275ce");
			if (this.state.roles.indexOf("admin") === -1)
				{
					this.setState({
						entityList   : response.data.filter(entity=>entity.supplierOf === this.state.getcompanyID),
						entityCount  : response.data.filter(entity=>entity.supplierOf === this.state.getcompanyID).length,
						showDetails  : true,
						initial : 'All'


					},()=>{
						if(this.state.entityList.length>0)
						{
						this.setState({
							id:this.state.entityList[0]._id
						})
						document.getElementById(this.state.entityList[0]._id).classList.add("selectedSupplier")
						}
					})
				
				}else{
					this.setState({
						entityList   : response.data,
						showDetails  : true,
						id  			: response.data[0]._id,
						initial : 'All'
					},()=>{
						if(this.state.entityList.length>0)
						{
						document.getElementById(this.state.entityList[0]._id).classList.add("selectedSupplier")
						}
					})
				}
			

			// $('.selected').removeClass('selectedSupplier');
		})
		.catch((error) => {
		})
	}
	ShowForm(event) {
		var data = $(event.currentTarget).attr('id');
		this.setState({ id: data, showDetails : true });

		$('.selected').removeClass('selectedSupplier');
		$(event.currentTarget).addClass('selectedSupplier');

	}
	hideForm(){
		this.setState({ showDetails : false });
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
			delete selector.initial;
			this.setState({	selector: selector },()=>{
				this.getFilteredProducts(this.state.selector);
				this.getgridFilteredProducts(this.state.selector);
			})
			
		} else {
			
			
			selector.initial = event.currentTarget.value; 

			this.setState({	selector: selector },()=>{
				this.getFilteredProducts(this.state.selector);
				this.getgridFilteredProducts(this.state.selector);
			})
		}
	}

	searchEntity(event) {
		var selector = this.state.selector;
		delete selector.initial;

		for (var key in document.querySelectorAll('.alphab')) {
			$($('.alphab')[key]).css('background', '#ddd');
			$($('.alphab')[key]).css('color', '#000');
		}

		document.getElementById("filterallalphab").style.background = '#000';
		document.getElementById("filterallalphab").style.color = '#fff';
		selector.searchStr = event.target.value;

		this.setState({	selector: selector },()=>{
			this.getFilteredProducts(this.state.selector);
			this.getgridFilteredProducts(this.state.selector);
		})
		// this.setState({ 'searchByName': event.target.value });
		// var pattern = new RegExp('^' + event.target.value, 'i');
		// var searchedData = this.state.masterVendor.filter((vendor) => {

		// 	return pattern.test(vendor.companyName);
		// });

		// this.setState({ entityList: searchedData });
	}
	resetFilter(event) {
		event.preventDefault();
		$('.category').prop('selectedIndex', 0);
		$('.Statesdata').prop('selectedIndex', 0);
		$('.districtsdata').prop('selectedIndex', 0);
		$('.searchEntity').val('');
		this.setState({
			'stateCode': 'Select State',
			'district' : 'Select District',
			'districtArray':[],
			'selector' : {},
			'initial': 'All',
		})

		for (var key in document.querySelectorAll('.alphab')) {
			$($('.alphab')[key]).css('background', '#ddd');
			$($('.alphab')[key]).css('color', '#000');
		}

		document.getElementById("filterallalphab").style.background = '#000';
		document.getElementById("filterallalphab").style.color = '#fff';

		var selector = this.state.selector;
		selector = {}
		this.setState({	selector: selector },()=>{
			this.getFilteredProducts(this.state.selector);
			this.getgridFilteredProducts(this.state.selector);
		})
	}

	selectFilter(event){
		$(".filterWrapper").toggle();
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
			this.getgridFilteredProducts(this.state.selector);
		})
	}
	getFilteredProducts(selector){
		
		selector.entityType = this.state.entityType;

		axios.post("/api/entitymaster/get/filterEntities", selector)
			.then((response) => {
				if (this.state.roles.indexOf("admin") === -1)
				{
					this.setState({
						entityList   : response.data.filter(entity=>entity.supplierOf === this.state.getcompanyID),
						showDetails  : true,
					})
				
				}else{
					this.setState({
						entityList   : response.data,
						showDetails  : true,
					})
				}
				
				if(this.state.entityList.length>0)
					{
					this.setState({ id: this.state.entityList[0]._id});
					if(this.state.view === 'List'){document.getElementById(this.state.entityList[0]._id).classList.add("selectedSupplier")}
				}
				
			})
			.catch((error) => {
			})
	}
	getgridFilteredProducts(selector){
		
		selector.entityType = this.state.entityType;
		selector.startRange = this.state.startRange;
		selector.limitRange = this.state.limitRange;

		axios.post("/api/entitymaster/get/gridfilterEntities", selector)
			.then((response) => {
				if (this.state.roles.indexOf("admin") === -1)
				{
					
					var FilteredData =  response.data.filter(entity=>entity.supplierOf === this.state.getcompanyID)
					var tableData = FilteredData.map((a, i)=>{
					var locDetails = a.locations.map((l,i)=>{
						return "<ul><li>#"+(i+1)+"</li><li>BranchCode:"+l.branchCode+"</li><li>Type: "+l.locationType+"</li><li><b>Address</b>: "+l.addressLine1+"</li></ul>"
					})
					var contactData = a.contactPersons.map((c,i)=>{
						return "<ul><li>#"+(i+1)+"</li><li>BranchCode:"+c.branchCode+"</li><li>Name:"+c.firstName+" "+c.lastName+"</li><li><b>Email</b>:"+c.email+"</li></ul>"
					})
					var departmentData = a.departments.map((k,i)=>{
						return "<ul class='nopadding'><li><b>Department : </b>"+k.departmentName+"</li><li><b>Project : </b>"+k.projectName+"</li></ul>"
					}).join("")
			        return{
			        	_id:a._id,
			            companyName:a.companyName,
			            companyID:a.companyID,
			            groupName:a.groupName,
			            companyEmail:a.companyEmail,
			            companyPhone:a.companyPhone,
			            location:locDetails && locDetails.length > 0 ? locDetails : "No Location Added Yet",
						contacts:contactData && contactData.length > 0 ? contactData : "No Contacts Added Yet",
						department : departmentData && departmentData.length> 0? departmentData : "No Departments Added Yet",
			            action:""
			        }
			      })
			
				}else{
					var tableData = response.data.map((a, i)=>{
					var locDetails = a.locations.map((l,i)=>{
						return "<ul><li>#"+(i+1)+"</li><li>BranchCode:"+l.branchCode+"</li><li>Type: "+l.locationType+"</li><li><b>Address</b>: "+l.addressLine1+"</li></ul>"
					})
					var contactData = a.contactPersons.map((c,i)=>{
						return "<ul><li>#"+(i+1)+"</li><li>BranchCode:"+c.branchCode+"</li><li>Name:"+c.firstName+" "+c.lastName+"</li><li><b>Email</b>:"+c.email+"</li></ul>"
					})
					var departmentData = a.departments.map((k,i)=>{
						return "<ul class='nopadding'><li><b>Department : </b>"+k.departmentName+"</li><li><b>Project : </b>"+k.projectName+"</li></ul>"
					}).join("")
			        return{
			        	_id:a._id,
			            companyName:a.companyName,
			            companyID:a.companyID,
			            groupName:a.groupName,
			            companyEmail:a.companyEmail,
			            companyPhone:a.companyPhone,
			            location:locDetails && locDetails.length > 0 ? locDetails : "No Location Added Yet",
						contacts:contactData && contactData.length > 0 ? contactData : "No Contacts Added Yet",
						department : departmentData && departmentData.length> 0? departmentData : "No Departments Added Yet",
			            action:""
			        }
			      })
				}
				

	          this.setState({RecordsTable:tableData})
				
			})
			.catch((error) => {
			})
	}
	editBasicform(event){ 
    	this.props.history.push("/"+this.state.entityType+'/basic-details/'+event.currentTarget.getAttribute('data-id'))
    }
    redirectTo(event)
    {
    	this.props.history.push("/"+this.state.entityType+"/basic-details")
    }

    showView(value,event){
		$('.viewBtn').removeClass('btnactive');
        $(event.target).addClass('btnactive');
    	this.setState({
    		view : value
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
									<h4 className="weighttitle col-lg-5 col-md-11 col-xs-11 col-sm-11">{this.state.pathname ? this.state.pathname : "Entity"} List</h4>
									<div className="col-lg-5 col-md-12 col-sm-12 col-xs-12 pull-right">
										<span className="col-lg-6 col-lg-offset-6 sentanceCase addButtonList" onClick={this.redirectTo.bind(this)}><i  className="fa fa-plus-circle"></i>&nbsp;&nbsp;{"Add "+this.state.pathname} 
										</span>
									</div>
								</div>
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">									
									<div className="col-lg-2 col-md-12 col-sm-12 col-xs-12 nopadding">
										<button type="button" className=" selectFilterBtn reset" onClick={this.selectFilter.bind(this)}>
											<i class="fa fa-filter"></i>&nbsp;&nbsp;<b> SELECT FILTER</b>
										</button>
									</div>
									
									<h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12 nopadding">Total Records :&nbsp;&nbsp;<b>{this.state.entityCount}</b></h5>
									<h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12 nopadding">Filtered :&nbsp;&nbsp;<b>{this.state.entityList.length}</b></h5>
									<div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 pull-right inLOE" >
										<span className="blocking-span" >
											<input type="text" name="search" className="col-lg-8 col-md-8 col-sm-8 col-xs-12 Searchusers searchEntity inputTextSearch outlinebox pull-right texttrans"
												placeholder="Search..." onInput={this.searchEntity.bind(this)} />
										</span>
									</div>
								</div>

								<div className="contenta col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls nopadding">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 borderBottomSO">
	                                </div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 firstElement filterWrapper">
										<div className="col-lg-2 col-md-12 col-sm-12 col-xs-12 nopadding">
											<button type="button" className="reset selheight" onClick={this.resetFilter.bind(this)}>RESET FILTERS</button>
										</div>
										
										<div className="col-lg-3 col-md-12 col-xs-12 col-sm-12">
											<select className="form-control resetinp selheight Statesdata" ref="states" name="stateCode" defaultValue={this.state.stateCode} 
											onChange={this.onSelectedItemsChange.bind(this,'state')}>
												<option disabled value="Select State">Select State</option>
												{this.state.statesArray &&
													this.state.statesArray.map((Statedata, index) => {
														return (
															<option key={index} value={Statedata.stateCode}>{this.camelCase(Statedata.stateName)}</option>
														);
													}
													)
												}
											</select>
										</div>
										<div className="col-lg-3 col-md-12 col-xs-12 col-sm-12">
											<select className="form-control resetinp selheight districtsdata" ref="district" name="district" value={this.state.district}
											onChange={this.onSelectedItemsChange.bind(this,'district')}>
												<option value="Select District" disabled>Select District</option>
												{this.state.districtArray && this.state.districtArray.length > 0 &&
													this.state.districtArray.map((districtdata, index) => {
														return (
															<option key={index} value={districtdata.districtName}>{this.camelCase(districtdata.districtName)}</option>
														);
													}
													)
												}
											</select>
										</div>
									
									</div>

									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
											<button type="button" className="btn alphab allBtn"  id="filterallalphab" onClick={this.shortByAlpha.bind(this)} name="initial" value={this.state.initial} onChange={this.handleChange}>All</button>
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

								{this.state.entityList && this.state.entityList.length > 0 &&<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 customTab">
									<div className="col-lg-2 col-md-2 col-sm-6 col-xs-12 pull-right">
										<i className="fa fa-th fa-lg btn viewBtn pull-right" name="view" ref="view" value={this.state.view} onClick={this.showView.bind(this,'Grid')} onChange={this.handleChange} aria-hidden="true"></i>&nbsp;&nbsp;
										<i className="fa fa-th-list fa-lg btn pull-right viewBtn btnactive" name="view" ref="view" value={this.state.view} onClick={this.showView.bind(this,'List')} onChange={this.handleChange} aria-hidden="true"></i>
									</div>
								</div>}

								{this.state.view === 'Grid' ?
								<div className="col-lg-12"> <IAssureTable 
			                      tableHeading={this.state.tableHeading}
			                      dataCount={this.state.entityCount}
			                      tableData={this.state.RecordsTable}
			                      tableObjects={this.state.tableObjects}
			                      getData={this.getData.bind(this)}
			                      id={"id"}
			                      tableName={this.state.entityType}
			                      />
			                      </div>
								 :
								 this.state.entityList && this.state.entityList.length > 0 ?
									<div className="col-lg-4 col-md-6 col-sm-6 col-xs-6 scrollbar" id="style-2">
										<div className="borderlist12">
											{
												this.state.entityList.map((data, index) => {
													return (
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 borderlist selected lists" key={index} onClick={this.ShowForm.bind(this)} name={index} data-child={data._id + '-' + index} id={data._id}>
															<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 supplierLogoDiv">
																<img alt="companyLogo" src={data.companyLogo.length > 0 ? data.companyLogo[0]:"/images/noImagePreview.png"} className="supplierLogoImage"></img>															
															</div>
															<div className="col-lg-8 col-md-10 col-sm-10 col-xs-10 listprofile">
																<h5 className="titleprofile">{data.companyName}</h5>
																<ul className="col-lg-9 col-md-9 col-sm-9 col-xs-9 listfont">
																	<li><i className="fa fa-user-o " aria-hidden="true"></i>&nbsp;{data.groupName}</li>
																	<li><i className="fa fa-globe " aria-hidden="true"></i>&nbsp;{data.website? data.website: " - "}</li>
																	<li><i className="fa fa-envelope " aria-hidden="true"></i>&nbsp;{data.companyEmail}</li>
																	<li><i className="fa fa-phone " aria-hidden="true"></i>&nbsp;{data.companyPhone}</li>
																</ul>
															</div>
															<div className="col-lg-2 noRightPadding">
																<div className="addedDiv col-lg-10 col-lg-offset-2">
																	<img  alt="leftArrow" src="/images/leftArrow.png"/>
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
								{ this.state.view === 'List' && this.state.showDetails && this.state.entityList && this.state.entityList.length > 0?
									<div className="col-lg-7 col-md-6 col-sm-6 col-xs-12 pdcls suppliersOneProfile commonSup noPadding" id={this.state.id}>
										<div id={this.state.id} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding" >
											<EntityDetails name={this.state.index} id={this.state.id} 
											entityType={this.state.entityType} getEntities={this.getEntities.bind(this)}
											hideForm={this.hideForm.bind(this)}/>
										</div>
									</div>
									:
									null
								}
							</div>
						</section>
					</div>
				</div> 

			</div>
		);
	}
}
export default withRouter(ListOfEntities);