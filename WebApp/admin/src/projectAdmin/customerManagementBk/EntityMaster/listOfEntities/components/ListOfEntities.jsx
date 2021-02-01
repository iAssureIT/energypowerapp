import React, { Component } from 'react';
import $ from 'jquery';
import axios from 'axios';
import _ from 'underscore';
import EntityDetails from './EntityDetails.jsx';
import 'bootstrap/js/tab.js';
import '../css/ListOfEntity.css';
import '../css/ListOfEntityFilter.css';
import '../css/ListOfAllEntity.css';
import swal                   from 'sweetalert';

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
			district  : "Select District",
			"pathname": window.location.pathname.split('/')[1],
			entityType : this.props.match.params.entity
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
		this.getEntities();
		this.getStates('IN');
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
		axios.get("/api/entitymaster/get/count/"+this.state.entityType)
			.then((response) => {
				this.setState({
					entityCount   : response.data.count
				})
			})
			.catch((error) => {
			})
		axios.get("/api/entitymaster/get/"+this.state.entityType)

			.then((response) => {
				this.setState({
					entityList   : response.data
				})

				$('.selected').removeClass('selectedSupplier');
				document.getElementById(response.data[0]._id).classList.add("selectedSupplier")
				this.setState({ id: response.data[0]._id, showDetails : true });
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
		if ($(event.target).attr('value') == 'All') {
			delete selector.initial;
			this.setState({	selector: selector },()=>{
				this.getFilteredProducts(this.state.selector);
			})
			
		} else {
			
			
			selector.initial = event.currentTarget.value; 

			this.setState({	selector: selector },()=>{
				this.getFilteredProducts(this.state.selector);
			})
		}
		this.setState({ showDetails : false });
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
		})
	}
	onSelectedItemsChange(filterType, selecteditems){
		var selector=this.state.selector;
		this.setState({
	      [selecteditems.currentTarget.getAttribute('name')]: selecteditems.currentTarget.value
	    });
		if (filterType == 'state') {
			this.handleChangeState(selecteditems.currentTarget.value);
			delete selector.district
			selector.stateCode = selecteditems.currentTarget.value; 
		}
		if(filterType == 'district'){
			selector.district  = selecteditems.currentTarget.value; 
		}
		this.setState({	selector: selector },()=>{
			this.getFilteredProducts(this.state.selector);
		})
	}
	getFilteredProducts(selector){
		
		selector.entityType = this.state.entityType;

		axios.post("/api/entitymaster/get/filterEntities", selector)
			.then((response) => {
				this.setState({
					entityList   : response.data
				})

				this.setState({ showDetails : false });
			})
			.catch((error) => {
			})
	}
	editBasicform(event){ 
    	this.props.history.push("/"+this.state.entityType+'/basic-details/'+event.currentTarget.getAttribute('data-id'))
    }
    redirectTo(event)
    {
    	this.props.history.push("/"+this.state.pathname+"/basic-details")
    }
    
	render() {
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
						<section className="content">
							<div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
									<h4 className="weighttitle col-lg-5 col-md-11 col-xs-11 col-sm-11 NOpadding">{this.state.pathname ? this.state.pathname : "Entity"} List</h4><span className="col-lg-2 pull-right sentanceCase addButtonList" onClick={this.redirectTo.bind(this)}><i  className="fa fa-plus-circle"></i>&nbsp;&nbsp;{"Add "+this.state.pathname} </span>
								</div>
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 nopadding">
									<h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12">Total Records :&nbsp;&nbsp;<b>{this.state.entityCount}</b></h5>
									<h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12">Filtered :&nbsp;&nbsp;<b>{this.state.entityList.length}</b></h5>
								</div>

								<div className="contenta col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls nopadding">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<div className="col-lg-2 col-md-12 col-sm-12 col-xs-12 nopadding">
											<button type="button" className="reset selheight" onClick={this.resetFilter.bind(this)}>RESET FILTER</button>
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
												<option  disabled>Select District</option>
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
										<div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 pull-right" >
											<span className="blocking-span" >
												<input type="text" name="search" className="col-lg-8 col-md-8 col-sm-8 col-xs-12 Searchusers searchEntity inputTextSearch outlinebox pull-right texttrans"
													placeholder="Search..." onInput={this.searchEntity.bind(this)} />
											</span>
										</div>
									</div>

									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
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
								{this.state.entityList && this.state.entityList.length > 0 ?
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 scrollbar" id="style-2">
										<div className="borderlist12">
											{
												this.state.entityList.map((data, index) => {
													return (
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 borderlist selected" key={index} onClick={this.ShowForm.bind(this)} name={index} data-child={data._id + '-' + index} id={data._id}>
															<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 supplierLogoDiv">
																<img src={data.companyLogo.length > 0 ? data.companyLogo[0]:"/images/noImagePreview.png"} className="supplierLogoImage"></img>															
															</div>
															<div className="col-lg-8 col-md-10 col-sm-10 col-xs-10 listprofile">
																<h5 className="titleprofile">{data.companyName}</h5>
																{/*<div className="dots dropdown1 col-lg-12 col-md-6 col-sm-6 col-xs-6">
																	
												        			<div className="dropdown-content1 dropdown2-content2">
																		<ul className="pdcls ulbtm">
																			<li id={data._id} className="styleContactActbtn" data-id={data._id} onClick={this.editBasicform.bind(this)} >	
																		    	<a><i className="fa fa-pencil penmrleft" aria-hidden="true" ></i>&nbsp;&nbsp;<span className="mrflfedit">Edit</span></a>
																		    </li>
																		    <li className="styleContactActbtn" data-id={data._id} >
																		    	<a><i className="fa fa-trash-o" aria-hidden="true" ></i>&nbsp;Delete</a>
																		    </li>
																	    </ul>
																	</div>
																</div>*/}
																<ul className="col-lg-9 col-md-9 col-sm-9 col-xs-9 listfont">
																	<li><i className="fa fa-user-o " aria-hidden="true"></i>&nbsp;{data.groupName}</li>
																	<li><i className="fa fa-globe " aria-hidden="true"></i>&nbsp;{data.website}</li>
																	<li><i className="fa fa-envelope " aria-hidden="true"></i>&nbsp;{data.companyEmail}</li>
																	<li><i className="fa fa-phone " aria-hidden="true"></i>&nbsp;{data.companyPhone}</li>
																</ul>
															</div>
															<div className="col-lg-2 noRightPadding">
																<div className="addedDiv col-lg-10 col-lg-offset-2 ">
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
								{ this.state.showDetails ?
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 pdcls suppliersOneProfile commonSup" id={this.state.id}>
										<div id={this.state.id} className="col-lg-12 col-md-12 col-sm-12 col-xs-12" >
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
export default ListOfEntities;