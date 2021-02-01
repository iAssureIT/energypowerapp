import React, { Component } 	from 'react';
import { render } 				from 'react-dom';
import $              from 'jquery';

import ReactTable           from "react-table";

/*import {City} 				from '/imports/admin/masterData/manageLocation/components/City/component/City.js';
import {Countries} 		    from '/imports/admin/masterData/manageLocation/components/Country/component/Countries.js';
import {State} 				from '/imports/admin/masterData/manageLocation/components/State/component/state.js';
import {Area} 				from '/imports/admin/masterData/manageLocation/components/Area/component/Area.js';
import Form 			    from 'react-validation/build/form';
import AreaBulkupload 		from '/imports/admin/masterData/manageLocation/components/Area/component/AreaBulkupload.jsx';
import Addareadatalist 		from '/imports/admin/masterData/manageLocation/components/Area/component/Addareadatalist.jsx';*/
import swal          	   from 'sweetalert';

export default class AddArea extends Component{

	constructor(props){
		super(props);
		this.state = {
			country    		: [],
			countryStored : [],
			states 	   		: [],
			statesStored 	: [],
			city    	   	: [],
			cityStored   	: [],
			data 		    	: [],
			countryval 		: '',
			stateval   		: '',
			cityval   	  : '',
			area          : '',
			areaId 		    : '',
			options	    	: 'manual',
		}
		this.handleChange = this.handleChange.bind(this);
		this.changeCountry = this.changeCountry.bind(this);
		this.changeState = this.changeState.bind(this);
		this.handleInputChange  = this.handleInputChange.bind(this);
	}

	componentDidMount(){
		/*$("html,body").scrollTop(0); 
		$.validator.addMethod("regx1", function(value, element, regexpr) {          
	      return regexpr.test(value);
	    }, "It should only contain letters.");
	    $.validator.addMethod("valueNotEquals", function(value, element, arg){
	        return arg !== value;
	    }, "Value must not equal arg.");
	    
	       
	    jQuery.validator.setDefaults({
	      debug: true,
	      success: "valid"
	    });
	    $("#areaForm").validate({
	      rules: {
	        area: {
	          required: true,
          	  regx1: /^[A-za-z ']+( [A-Za-z']+)*$/,
	        },
	        countryval:{
	        	valueNotEquals: "-Select-"
	        },
	        stateval:{
	        	valueNotEquals: "-Select-"
	        },
	        cityval:{
	        	valueNotEquals: "-Select-"
	        }

	      },
	      messages:{
	      	area: {
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
	
    changeCountry = (event)=>{
    	var countryval = $('.countrySelected').val();

    	var statesData = this.props.post2;
    	var newArr = [];
    	for(var i=0; i<statesData.length; i++){
    		if(statesData[i].countryName == countryval){
    			newArr.push(statesData[i]);
    		}
    	}
    	this.setState({
    		states : newArr,
    		countryval:countryval
    	})
    }

    changeState = (event)=>{
    	var stateval = $('.stateSelected').val();
    	var cityData = this.props.post1;
    	var newstateArr = [];
    	for(var i=0; i<cityData.length; i++){
    		if(cityData[i].stateName == stateval){
    			newstateArr.push(cityData[i]);
    		}
    }

		this.setState({
			 city : newstateArr,
    		stateval : stateval

    	})
    	
    }

 
	componentWillReceiveProps(nextProps){
		var country 	= nextProps.post;
		var states 		= nextProps.post2;
		var city     	= nextProps.post1;
		// console.log("post33==");
		this.setState({
			country 		: country,
			states 			: states,
			city    		: city,
			countryStored 	: country,
			statesStored 	: states,
			cityStored   	: city,
			data 			: nextProps.post3,
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

	Bulkuploadform(event){
    	// event.preventDefault();
		$('#addcountrie' ).css({'display':'none'});
		$('#bulkuploads').css({'display':'block'});	
	}

	areaadd(event){
		  event.preventDefault();	
/*		  console.log('areavalues ',areavalues);*/	 
		  	var areavalues = {
		  		"country" 		: this.state.countryval,
			  	"state" 		: this.state.stateval,	
				"city" 		    : this.state.cityval,
				"area" 	        : this.state.area,
			
			}
			var areaData= this.props.post3.map((obj,i)=>{return ({area:obj.area.toUpperCase(),city:obj.cityName.toUpperCase()})});

			     if ($('#areaForm').valid()) {
			     	if((areaData.some(e=>e.area == areavalues.area.toUpperCase()))&&(areaData.some(e=>e.city == areavalues.city.toUpperCase()))){
			     		swal({
			                	timer: 2000,
			                	text:"Area Already Added."
			                });
			     	}else{

				     /* Meteor.call('addArea',areavalues,
				            (error, result)=> { 
				                if (error) {
				                    swal(error.reason);
				                } 
				                else {
				                	if(result == 'exist'){
				                		swal({
				                			timer: 2000,
				                			text:"Area Already Added."
				                		});
				                	}else{
				                		swal({
						                timer: 2000,
						                text: "Area Added successfully!",
						                });
				                	}
				                    
				                    this.setState({
				                    	countryval 		: '',
										stateval   		: '',
										cityval   	: '',
										area      : '',
										areaId  		: ''
				                    })
				                }
				            }
				        );*/
			     	}
			       }

	}

    updateArea(event){
	  event.preventDefault();
      var areaId    = this.state.areaId;
      var areavalues = {
		  		"country" 		: this.state.countryval,
			  	"state" 		: this.state.stateval,	
				"city" 		: this.state.cityval,
				"area" 	: this.state.area,
			
			}
	 if ($('#areaForm').valid()) {
      /*	Meteor.call('updateArea', areaId, areavalues,
                (error, result)=> { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    else {
                    	if(result == 'exist'){
	                		swal({
	                			timer: 2000,
	                			text:"Area Already Added."
	                		});
	                	}else{
	                    	swal({
				                timer: 2000,
				                text: "Area Modified successfully!",
				                });
	                    	this.setState({
		                    	countryval 		: '',
								stateval   		: '',
								cityval   		: '',
								area      		: '',
								areaId  		: ''
		                    })
		                }
                    }
                }

        );*/	
       }

	}

	deleteArea(event){
	  event.preventDefault();
	  let id = $(event.currentTarget).attr("id");
      swal({       
        text: "Are you sure you want to delete this Area?",
        buttons: {confirm:'Yes',cancel:'No'},
        confirmButtonColor: "#DD6B55",
        className: "confirmSwal",
        closeOnConfirm: false,
        content: false
       }).then((willDelete)=>{
       		if(willDelete){
       		/*	Meteor.call('deleteArea', id,(error, result)=> { 
		                    if(error) {
		                        console.log ( error ); 
		                    }else{
		                    	swal({
					                timer: 2000,
					                text: "Area Deleted successfully!",
					                });
		                    	this.setState({
			                    	countryval 		: '',
									stateval   		: '',
									cityval   		: '',
									area      		: '',
									areaId  		: ''
			                    })
		                    }                    
		                });	*/
       		}
       })
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
  	districtsortup(){
  		$("#districtsortup").css('display', 'none');
		$("#distrctsortdown").css('display', 'inline-block');	
		
		var sortedAsc =  this.state.data.sort(function(a, b){
		  return a.cityName > b.cityName;
		});
		this.setState({
			data : sortedAsc,
		});
  	} 
  	distrctsortdown(){
  		$("#districtsortup").css('display', 'inline-block');
		$("#distrctsortdown").css('display', 'none');
			
  		var sortedDesc = this.state.data.sort(function(a, b){
		  return a.cityName > b.cityName;
		}).reverse();
			
		this.setState({
			data : sortedDesc,
		});
  	}

	handleChange(event){
	  const target = event.target;
	  
	  const name   = target.name;
	  this.setState({
	  	[name] : event.target.value,
	  });

	}

	editArea(event){
	/*	event.preventDefault();
		$("html,body").scrollTop(0); 
		$('#addcountrie' ).css({'display':'block'});
		$('#bulkuploads').css({'display':'none'});
		$("#areaForm").validate().resetForm();
		this.setState({
			options : 'manual'
		}) 
		var areaId = event.currentTarget.id;
		var areadata = Area.findOne({"_id":areaId});
		if(areadata){
		    var country = Countries.find({}).fetch();
		    var dist = City.find({}).fetch();
		    var state = State.find({}).fetch();
			this.setState({
				country 		: country,
				states 			: state,
				city    		: dist,
				countryval 		: areadata.countryName,
				stateval   		: areadata.stateName,
				cityval   	: areadata.cityName,
				area   	: areadata.area,
				areaId   		: areadata._id
			})
		}*/
	}

	uploadCSV(event){
        event.preventDefault();
        
      /*  UserSession.delete("progressbarSession", Meteor.userId());*/
        
       /* Papa.parse( event.target.files[0], {
		    header: true,
		    complete( results, file ) {
				Meteor.call( 'CSVUploadarea', results.data, ( error, result ) => {
                	if ( error ){
                        //Some code
         			} else {
         				
                    	if(result > 0){
                            swal({
                                
                                text    : 'Area Added Successfully',
                                timer: 2000
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
                                position 		  : 'top-right',
                                type     		  : 'warning',
                                title    		  : 'Nothing to upload.',
                                showConfirmButton : true,
                                
                            }); 
                            $('#addcountrie' ).css({'display':'block'});
							              $('#bulkuploads').css({'display':'none'});                      		
                        }       
         			}
      			});

		    }
        });*/
    }

	showBtn(){
		if(this.state.areaId){
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn updateBTN btn-temp" onClick={this.updateArea.bind(this)}>UPDATE</button>
			)
		}else{
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn btnSubmit btn-temp" onClick={this.areaadd.bind(this)}>ADD</button>
			)
		}
	}


	render(){
	const data = this.props.post3;
	// console.log('data',data);
	const columns = [
			{
				Header: 'Sr. No.',
				id    : 'row',
		        width: 80,
		        Cell  : (row)=>
		          <span>{row.index+1}</span>
			},
			{
				Header 	:'Country',
				accessor: 'countryName'
			},
			{
				Header 	:'State',
				accessor: 'stateName'
			},
			{
				Header 	:'City',
				accessor: 'cityName'
			},
			{
				Header 	:'Area',
				accessor: 'area'
			},
			{
				Header  : 'Actions',
				accessor: '_id',
				Cell:row=>(
						<div>
							<i className="fa fa-pencil action-btn" aria-hidden="true" title="Edit Area" id={row.value} onClick={this.editArea.bind(this)}></i> &nbsp; &nbsp;
							<i className="fa fa-trash redFont action-btn" aria-hidden="true" title="Delete Area" onClick={this.deleteArea.bind(this)} id={row.value} ></i>
						</div>
					)
			}
	]
       return(
			<div className="">
				<div className=""  id="addcountrie">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 wrapperTitle formgroupheight pt20">
						<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc">
							<h4 className="manageLocTitle"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Area</h4>
						</div>
						
						{/*<div className="switchField manual-auto col-lg-6 col-md-6 col-sm-12 col-xs-12">
							<ul className="nav nav-pills nav-pillss location pull-right">
                                <li className="active text-center  transactionTab masterDataTab">
                                    <a href="#addareaForm" className="tab-align" data-toggle="tab" onClick={()=>this.changeTab('location')} >
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
				<div className="marginBottom col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
				  <div className='tab-content col-lg-12 col-md-12 col-sm-12 col-xs-12'>
					<div className='tab-pane active' id="addareaForm">
				   		<form id="areaForm" >
	        			 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 masterTalukaInput padding-zero" id="addtaluka">	
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 talukaFormAlignment">
								<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 formht ht110">
									 <label className="control-label col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls padding-zero" >Country<span className="astrick">*</span></label>
									<select onChange={this.changeCountry.bind(this)} title="Please select country." className="countrySelected col-lg-12 col-md-12 col-xs-12 col-sm-12 areaStaes form-control" ref="countryval" name="countryval" ref="countryval" id="countryval" value={this.state.countryval}>

									    <option >-Select-</option>
									    
										{this.props.post.map((data, index)=>{
	                    					return(	
										        <option className="inputText" key={index}>{data.countryName}</option>		 
										    );
	                					})}
								    </select>

								</div>	
								<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 formht ht110">
								    <label className="control-label col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls padding-zero" >State<span className="astrick">*</span></label>
								    <select onChange={this.changeState.bind(this)} title="Please select state." className="stateSelected col-lg-12 col-md-12 col-xs-12 col-sm-12 areaStaes form-control" ref="stateval" name="stateval" id="stateval" value={this.state.stateval}>

									    <option >-Select-</option>
									    
										   	{this.state.states.map((data, index)=>{
	                    						return(	
										       		<option className="inputText" key={index} >{data.stateName}</option>
										   						 
										     	);
	                						})}
								    </select>

								</div>
								<div className="col-lg-4 col-md-4 col-xs-12 col-sm-12 formht">
									<div className="form-group">
									    <label className="control-label col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls padding-zero" >City<span className="astrick">*</span></label>
									   	<select title="Please select city." className="distSelected col-lg-12 col-md-12 col-xs-12 col-sm-12 areaStaes form-control" ref="cityval" name="cityval" id="cityval" value={this.state.cityval} onChange={this.handleChange.bind(this)} >

										    <option >-Select-</option>
										    
											   	{this.state.city.map((data, index)=>{
			                						return(	
											      
											      		<option className="inputText" key={index}>{data.cityName}</option>
											      
											 
											      	);
			            						})}
									    </select>

									</div>	
								</div>
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ht110">
									<div className="form-group formht">
									    <label className="control-label col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls padding-zero" >Area<span className="astrick">*</span></label>
									    <input className="form-control areaStaes" title="Please enter valid area." id="area" type="text" name="area" ref="area" value={this.state.area} onChange={this.handleChange.bind(this)} />
									</div>									
								</div>	

							</div>

							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pr28">
						    	{this.showBtn()}
							</div>
						 </div>
					    </form>
					</div>
					<div className='tab-pane' id="csvUpload">						
						<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 bulkUploadWrapper" >
							<div className="csvDLWrap">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkUploadForm">
									<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 bulkImage">
										<div className="csvIcon">
											<a href="/csv/taluka.csv" download>
												<img src="/images/csv.jpg" className="csvimg" title="Click to download file"/>
											</a>
										</div>
									</div>
									<div className="col-lg-11 col-md-12 col-sm-12 col-xs-12">
										<h4><b>Instructions</b></h4>
										<ul className="uploadQuesinst col-lg-10 col-md-10 col-sm-12 col-xs-12">
											<li><b>1)</b>&nbsp;&nbsp;Please use attached file format to bulkupload <b>Area Data</b> into this system.</li>
											<li><b>2)</b>&nbsp; File Format must be *.CSV.</li>
											<li><b>3)</b>&nbsp; Following is the format of .CSV file.</li>					
										</ul>
									</div>

									<div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12"><span className="control-label statelabel"><b>Upload Areas</b></span></div>
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
{/*								<table id="listOfUsersDwnld" className="UMTableSAU table  myTable dataTable no-footer formTable col-lg-12 col-md-12 col-sm-10 col-xs-12" >
									<thead className="table-head tablebodyfix">
										<tr className="tempTableHeader">
											<th className="umHeader srpadd">  
												<span className="" >Country
													<span className="fa fa-caret-up custom  namesortup"  id="countrysortup" onClick={this.countrysortup.bind(this)} />
													<span className="fa fa-caret-down custom namesortdown" id="countrysortdown" onClick={this.countrysortdown.bind(this)} />   
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
											<th className="umHeader srpadd">  
												<span className="" >Area
												</span>
											</th>
											
											<th className="umHeader srpadd"> Action   </th>
										</tr>
									</thead>
											  
										
												{ this.props.post3
												?
													this.props.post3.length>0 
													? 
													

													<tbody className="noLRPad tableheaderfix">
															{this.props.post3.map( (locationdata,index)=>{
																return(
																	<tr key={index} className="tablebodyfix">
																		<td className="txtcentr">{locationdata.countryName}</td>
																		<td className="txtcentr">{locationdata.stateName}</td>
																		<td className="txtcentr">{locationdata.cityName}</td>
																		<td className="txtcentr">{locationdata.area}</td>
																		
																		<td className="txtcentr">
																			<i className="fa fa-pencil action-btn" aria-hidden="true" title="Edit Area" id={locationdata._id} onClick={this.editArea.bind(this)}></i> &nbsp; &nbsp;
																			<i className="fa fa-trash redFont action-btn" aria-hidden="true" title="Delete Area" onClick={this.deleteArea.bind(this)} id={locationdata._id} ></i>
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
							            	this.props.post3 && this.props.post3.length>0 ? 
								                <div className="col-lg-12 col-md-12 col-sm-12 paginationWrap">
								                  <ul className="pagination paginationOES">
								                      {this.state.paginationArray}
								                  </ul>
								                </div>
								              :
								                null
							            }
							     <ReactTable
									data={data}
									columns={columns}
									sortable={false}
									defaultPageSize={10}
									showPagination={true} />
							</div>
						</div>

				
				

			</div>			
	    );
	} 
}

