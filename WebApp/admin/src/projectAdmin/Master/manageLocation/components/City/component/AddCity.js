import React, { Component } 	from 'react';
import { render } 				from 'react-dom';
import $              from 'jquery';

import ReactTable               from "react-table";
import Form from 'react-validation/build/form';
/*import {State} 					from '/imports/admin/masterData/manageLocation/components/State/component/state.js';
import {Countries} 				from '/imports/admin/masterData/manageLocation/components/Country/component/Countries.js';
import {City} 				from '/imports/admin/masterData/manageLocation/components/City/component/City.js';

import DistrictBulkupload 		from '/imports/admin/masterData/manageLocation/components/District/component/DistrictBulkupload.jsx';
import Adddistrictdatalist 		from '/imports/admin/masterData/manageLocation/components/District/component/Adddistrictdatalist.jsx';*/

import swal from 'sweetalert';

export default class AddCity extends Component{

	constructor(props){
		super(props);

		this.state = {
			country    		: [],
			countryStored 	: [],
			states 	   		: [],
			statesStored   	: [],
			district 	   	: [],
			districtStored 	: [],
			data 			: [],
			countryval 		: '',
			stateval   		: '',
			cityval   	  : '',
			cityId        : '',
			options	    	: 'manual',
		}
		this.handleChange = this.handleChange.bind(this);
		this.changeCountry = this.changeCountry.bind(this);
		this.changeState = this.changeState.bind(this);
		this.handleInputChange  = this.handleInputChange.bind(this);
	}

	componentDidMount() {
    	/*$.validator.addMethod("regx1", function(value, element, regexpr) {          
	      return regexpr.test(value);
	    }, "It should only contain letters.");
	    $.validator.addMethod("valueNotEquals", function(value, element, arg){
	        return arg !== value;
	    }, "Value must not equal arg.");
	     jQuery.validator.setDefaults({
	      debug: true,
	      success: "valid"
	    });
	    $("#cityForm").validate({
	      rules: {
	        cityval: {
	          required: true,
          	  regx1: /^[A-za-z ']+( [A-Za-z']+)*$/,
	        },
	        countryval:{
	        	required: true,
	        	valueNotEquals: "-Select-"
	        },
	        stateval:{
	        	required: true,
	        	valueNotEquals: "-Select-"
	        }
	      },
	      messages: {
	      	cityval: {
	      		required: "This field is required"
	      	}
	      }
	      
	    });*/

	    //Spinner Effect
/*	    $(document).ready(function() {
		  $('.btn').on('click', function() {
		    var $this = $(this);
		    var loadingText = '<i class="fa fa-spinner fa-spin"></i> loading...';
		    if ($(this).html() !== loadingText) {
		      $this.data('original-text', $(this).html());
		      $this.html(loadingText);
		    }
		    setTimeout(function() {
		      $this.html($this.data('original-text'));
		    }, 100);
		  });
		})*/
 	}
 	
	 handleChange(event){
    	event.preventDefault();
    	   const target = event.target;
		   const name   = target.name;
		   this.setState({
		    [name]: event.target.value,
		   });
  
    }
    handleInputChange(event) {
	    const target = event.target;
	    // const value = target.type === 'radio' ? target.checked : target.value;
	    const name = target.name;

	    this.setState({
	      [name]: event.target.value
	    });

	}

    changeCountry = (event)=>{
    	var countryval = $('#countryval').val();
    	var statesData = this.props.post2;
    	var newArr = [];
    	for(var i=0; i<statesData.length; i++){
    		if(statesData[i].countryName == countryval){
    			newArr.push(statesData[i]);
    		}
    	}
    	this.setState({
    		states : newArr,
    		countryval : countryval
    	})
    }

    changeState = (event)=>{
    	var stateval = $('.stateSelected').val();
		  this.setState({
    		stateval : stateval
    	})
    	
    }

  componentWillReceiveProps(nextProps){
		var country = nextProps.post;
		var states = nextProps.post2;
		var district = nextProps.post1;
		this.setState({
			country 		: country,
			states 			: states,
			district 		: district,
			countryStored 	: country,
			statesStored 	: states,
			districtStored 	: district,

			data 			: nextProps.post1,
		});
	}

	
	Bulkuploadform(event){
    	// event.preventDefault();
		$('#addcountrie' ).css({'display':'none'});
		$('#bulkuploaddist').css({'display':'block'});	
	}
	
	cityadd(event){
	  event.preventDefault();		 
	  	var cityValues = {
	  		"country" 		: this.state.countryval,
		  	"state" 		: this.state.stateval,	
		   	"city" 		: this.state.cityval,	
		}	
	var cityData={"state" 		: cityValues.state.toUpperCase(),	
		   		  "city" 		: cityValues.city.toUpperCase()}	
     var cityExist= this.props.post1.map((obj,i)=>{return ({ state: obj.stateName.toUpperCase(),city: obj.cityName.toUpperCase()})});
/*     if((cityExist.some(e=>e.state == cityData.state))&&(cityExist.some(e=>e.city == cityData.city))){
     	console.log("exist",true);
     }else{
     	console.log("exist",false);
     }*/
      if($('#cityForm').valid()){
      	if((cityExist.some(e=>e.state == cityData.state))&&(cityExist.some(e=>e.city == cityData.city))){
      		swal({timer:2000,text:"City Already Added!"});
      	}else{
      		
	     /* Meteor.call('addCity',cityValues,
	            (error, result)=> { 
	                if (error) {
	                    swal(error.reason);
	                } 
	                else {
	                	if(result == 'exist'){
	                		swal({timer:2000,text:"City Already Added!"});
	                	}else{
	                		swal({
				                timer:2000,
				                text: "City Added successfully!"
				                });
	                	}
	                    
                    this.setState({
                    	countryval 		: '',
											stateval   		: '',
											cityval   	: '',
											cityId      : ''
                    })
	                }
	            }
	        );*/
      	}	
  		}

	}

	
  updateCity(event){
	  event.preventDefault();
      var cityId    = this.state.cityId;
      var cityValues = {
	  		"country" 		: this.state.countryval,
		  	"state" 		: this.state.stateval,	
			  "city" 		: this.state.cityval,	
		
		}
      if($('#cityForm').valid()){	
	    /*  Meteor.call('updateCity', cityId, cityValues,
            (error, result)=> { 
                if (error) {
                    console.log ( error ); 
                } //info about what went wrong 
                else {
                	swal({
	                 text : "City Modified successfully!",
	                 timer:2000
	                });
                	this.setState({
                  	countryval 		: '',
										stateval   		: '',
										cityval   	: '',
										cityId      : ''
                  })
                }//the _id of new object if successful
            }
	      );*/	
	   }

	}

	statesortup(){
		$("#statesortup").css('display', 'none');
		$("#statesortdown").css('display', 'inline-block');

		// console.log("this.state.usersListData==",this.state.usersListData);
		var sortedAsc = this.state.data.sort(function(a, b){
		  return a.stateName > b.stateName;
		});
		this.setState({
			data : sortedAsc,
		});
  } 
  statesortdown(){
 		$("#statesortup").css('display', 'inline-block');
	  $("#statesortdown").css('display', 'none');	
	 	var sortedDesc =  this.state.data.sort(function(a, b){
		  return a.stateName > b.stateName;
		}).reverse();
	// console.log("sortedDesc=",sortedDesc);

		this.setState({
			data : sortedDesc,
		});
  }

  countrysortup(){
		$("#countrysortup").css('display', 'none');
	  $("#countrysortdown").css('display', 'inline-block');	
	
		var sortedAsc =  this.state.data.sort(function(a, b){
		  return a.countryName > b.countryName;
		});
		this.setState({
			data : sortedAsc,
		});
	} 
	countrysortdown(){
		$("#countrysortup").css('display', 'inline-block');
   	$("#countrysortdown").css('display', 'none');
		
		var sortedDesc = this.state.data.sort(function(a, b){
		  return a.countryName > b.countryName;
		}).reverse();
			
		this.setState({
			data : sortedDesc,
		});
	}

	uploadCSV(event){
      event.preventDefault();
      
     /* UserSession.delete("progressbarSession", Meteor.userId());*/
      
    /*  Papa.parse( event.target.files[0], {
	    header: true,
	    complete( results, file ) {
	    	Meteor.call( 'CSVUploadcity', results.data, ( error, result ) => {
              	if ( error ){
                      //Some code
       			} else {
       			
            	if(result > 0){
                    swal({
                        timer:2000,
                        text     : "City Added Successfully!"
                    });
                    $('#addcountrie' ).css({'display':'block'});
	              		$('#bulkuploads').css({'display':'none'});
                    $(".uploadFileInput").val('');
                    setTimeout(()=>{ 
                        UserSession.delete("allProgressbarSession", Meteor.userId());
                        UserSession.delete("progressbarSession", Meteor.userId());
                    }, 8000);
            	}else{
                      swal({
                        text    		  : 'Nothing to upload.',
                        timer:2000
                        
                    }); 
                    $('#addcountrie' ).css({'display':'block'});
	             		$('#bulkuploads').css({'display':'none'});                      		
                }       
       			}
    			});
		    }
      });*/
    }


	deleteCity(event){
	  event.preventDefault();
	  let id = $(event.currentTarget).attr("id");
      swal({    
        text: "Are you sure you want to delete this City?",
        buttons: {confirm:'Yes',cancel:'No'},
        confirmButtonColor: "#DD6B55",
        className: "confirmSwal",
        closeOnConfirm: false,
        content: false
       }).then((willDelete)=>{
       		if(willDelete){
       			/*Meteor.call('deleteCity',id,
		                (error, result)=> { 
		                    if(error){
		                        console.log ( error ); 
		                    }else{
		                    	swal({
					                timer : 2000,
					                text: "City Deleted successfully!"
					                });
		                    	this.setState({
			                    	countryval 		: '',
														stateval   		: '',
														cityval   : '',
														cityId    : ''
			                    })
		                    }                    
		                });	*/
       		}
       })
	}

	

  editCity(event){
	/*	event.preventDefault();
		$("html,body").scrollTop(0); 
		$('#addcountrie' ).css({'display':'block'});
		$('#bulkuploaddist').css({'display':'none'});
		$("#cityForm").validate().resetForm();
		this.setState({
			options : 'manual'
		}) 
		var cityId = event.currentTarget.id;
		var citydata = City.findOne({"_id":cityId});
		if(citydata){
			this.setState({
				countryval 		: citydata.countryName,
				stateval   		: citydata.stateName,
				cityval   	  : citydata.cityName,
				cityId        : citydata._id
			})
		}*/
	}

	showBtn(){
		if(this.state.cityId){
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn updateBTN btn-temp" onClick={this.updateCity.bind(this)}>UPDATE</button>
			)
		}else{
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn btnSubmit btn-temp" onClick={this.cityadd.bind(this)}>ADD</button>
			)
		}
	}



	render(){
		const data = this.props.post1;
/*		console.log('data',data);
*/		const columns = [
			{
				Header: 'Sr. No.',
				id    : 'row',
		        width: 80,
		        Cell  : (row)=>
		          <span>{row.index+1}</span>
			},
			{
				Header: 'Country',
				accessor: 'countryName'
			},
			{
				Header: 'State',
				accessor: 'stateName',
			},
			{
				Header: 'City',
				accessor:'cityName'
			},
			{
				Header: 'Actions',
				accessor: '_id',
				Cell:row=>(
						<div>
							<i className="fa fa-pencil action-btn" aria-hidden="true" title="Edit City" id={row.value} onClick={this.editCity.bind(this)}></i> &nbsp; &nbsp;
							<i className="fa fa-trash redFont action-btn" aria-hidden="true" title="Delete City " onClick={this.deleteCity.bind(this)} id={row.value}></i>
						</div>
					)
			},
		]
       return(
			<div className="">
				<div className=""  id="addcountrie">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 wrapperTitle formgroupheight pt20">
						<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc">
							<h4 className="manageLocTitle"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add City</h4>
						</div>
						
						{/*<div className="switchField manual-auto col-lg-6 col-md-6 col-sm-12 col-xs-12">
							 <ul className="nav nav-pills nav-pillss  location pull-right">
                                <li className="active text-center  transactionTab masterDataTab">
                                    <a href="#addcityform" className="tab-align" data-toggle="tab" onClick={()=>this.changeTab('location')} >
                                    	Manual
                                    </a>
                                </li>
                                <li className="text-center  transactionTab masterDataTab">
                                    <a href="#csvUpload" className="tab-align" data-toggle="tab" onClick={()=>this.changeTab('area')}>
                                    	Auto
                                    </a>
                                </li>
                              </ul>

						</div>*/}
					</div>
					<div className='tab-content col-lg-12 col-md-12 col-sm-12 col-xs-12'>
						<div className='tab-pane active' id="addcityform">
			       			<Form id="cityForm" className="">
			        			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 masterDistrictWrapper padding-zero" id="adddist">	
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 masterDistrictInput">
												<div className="form-group col-lg-6 col-md-12 col-sm-12 col-xs-12 formht ht95">
													<label className="control-label col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls padding-zero" >Country<span className="astrick">*</span></label>
													<select onChange={this.changeCountry.bind(this)} title="Please select country." required className="countrySelected col-lg-12 col-md-12 col-xs-12 col-sm-12 areaStaes form-control" ref="countryval" name="countryval" ref="countryval" id="countryval" value={this.state.countryval} >
													    <option >-Select-</option>
													    
														{this.props.post.map((data, index)=>{
					                    					return(	
														        <option className="inputText" key={index}>{data.countryName}</option>		 
														    );
					                					})}
												    </select>
												</div>	
												<div className="form-group col-lg-6 col-md-12 col-sm-12 col-xs-12 formht ht95">
												    <label className="control-label col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls padding-zero" >State<span className="astrick">*</span></label>
												    <select onChange={this.changeState.bind(this)} title="Please select state." required className="stateSelected col-lg-12 col-md-12 col-xs-12 col-sm-12 areaStaes form-control" ref="stateval" name="stateval" id="stateval" value={this.state.stateval} required>

													    <option >-Select-</option>
													    
														   	{this.state.states.map((data, index)=>{
					                    						return(	
														       		<option className="inputText" key={index} >{data.stateName}</option>
														   						 
														     	);
					                						})}
												    </select>

												</div>
												<div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 formht ht95">
													    <label className="control-label col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls padding-zero" >City<span className="astrick">*</span></label>
													    <input className="form-control areaStaes" id="cityval" type="text" name="cityval" id="cityval" value={this.state.cityval} title="Please enter valid city." onChange={this.handleChange.bind(this)} required/>
												</div>	
									   </div>
											
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pr28">
												{this.showBtn()}
									</div>
							</Form>
						</div>
						<div className='tab-pane' id="csvUpload">
							<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
								<div className="csvDLWrap">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkUploadForm">
										<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 bulkImage ">
											<div className="csvIcon">
												<a href="/csv/district.csv" download>
													<img src="/images/csv.jpg" className="csvimg" title="Click to download file"/>
												</a>
											</div>
										</div>
										<div className="col-lg-11 col-md-12 col-sm-12 col-xs-12">
											<h4><b>Instructions</b></h4>
											<ul className="uploadQuesinst col-lg-10 col-md-10 col-sm-12 col-xs-12">
												<li><b>1)</b>&nbsp;&nbsp;Please use attached file format to bulkupload <b>City Data</b> into this system.</li>
												<li><b>2)</b>&nbsp; File Format must be *.CSV.</li>
												<li><b>3)</b>&nbsp; Following is the format of .CSV file.</li>
																	
											</ul>
										</div>
										<div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12"><span className="control-label statelabel"><b>Upload Cities</b></span></div>
										<div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 inputBulk">
											<div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 inputFieldBulk">
												<input type="file" onChange={this.uploadCSV.bind(this)} name="uploadCSV" ref="uploadCSV"  accept=".csv" className="form-control col-lg-6 col-md-12 col-sm-12 col-xs-12 uploadFileInput" required/>
											</div>
										</div>
									</div>
								</div>		
							</div>
						</div>
					</div>	
					
				</div>
	
						
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  usrmgnhead">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<ReactTable
									data={data}
									columns={columns}
									sortable={false}
									defaultPageSize={10}
									showPagination={true} />

	{/*							<table id="listOfUsersDwnld" className="UMTableSAU table  myTable dataTable no-footer formTable col-lg-12 col-md-12 col-sm-10 col-xs-12" >
										<thead className="table-head tablebodyfix">
										<tr className="tempTableHeader">
											<th className="umHeader srpadd">  
												<span className="" >Country
												</span>
											</th>
											<th className="umHeader srpadd">  
												<span className="" >State
												</span>
											</th>
											<th className="umHeader srpadd">  
												<span className="" >City
												</span>
											</th>
											
											<th className="umHeader srpadd"> Action   </th>
										</tr>
									</thead>
								  
							
									{ this.props.post1
									?
										this.props.post1.length>0 
										? 
										

										<tbody className="noLRPad tableheaderfix">
												{this.props.post1.map( (locationdata,index)=>{
													return(
														<tr key={index} className="tablebodyfix">
															<td className="txtcentr">{locationdata.countryName}</td>
															<td className="txtcentr">{locationdata.stateName}</td>
															<td className="txtcentr">{locationdata.cityName}</td>
															
															<td className="txtcentr">
																<i className="fa fa-pencil action-btn" aria-hidden="true" title="Edit City" id={locationdata._id} onClick={this.editCity.bind(this)}></i> &nbsp; &nbsp;
																<i className="fa fa-trash redFont action-btn" aria-hidden="true" title="Delete City " onClick={this.deleteCity.bind(this)} id={locationdata._id}></i>
															</td>
														</tr>
														)
												})}
												
										</tbody>
										:
											<td colSpan="9" className="ntdiaplay displayblck">Nothing to display.</td>
											
									:
									<tbody>
										<td colSpan="9" >
											<div className="loaderimgcent col-lg-12 col-md-12  "><img src="../images/loading.gif" className="loaderimgcent" alt="loading"/></div>

										</td>
									</tbody>
									
									}

								</table>*/}
							
				            { 
				            	this.props.post1 && this.props.post1.length>0 ? 
					                <div className="col-lg-12 col-md-12 col-sm-12 paginationWrap">
					                  <ul className="pagination paginationOES">
					                      {this.state.paginationArray}
					                  </ul>
					                </div>
					              :
					                null
				            }
						</div>
					</div>

				

			</div>			
	    );
	} 
}


