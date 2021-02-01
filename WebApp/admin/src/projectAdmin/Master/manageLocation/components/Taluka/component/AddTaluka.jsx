import React, { Component } 	from 'react';
import { render } 				from 'react-dom';
import {withTracker} 			from 'meteor/react-meteor-data';

import ReactTable               from "react-table";

import {District} 				from '/imports/admin/masterData/manageLocation/components/District/component/District.js';
import {Countries} 				from '/imports/admin/masterData/manageLocation/components/Country/component/Countries.js';
import {State} 					from '/imports/admin/masterData/manageLocation/components/State/component/state.js';
import {Taluka} 				from '/imports/admin/masterData/manageLocation/components/Taluka/component/Taluka.js';
import Form 					from 'react-validation/build/form';
import TalukaBulkupload 		from '/imports/admin/masterData/manageLocation/components/Taluka/component/TalukaBulkupload.jsx';
import Addtalukadatalist 		from '/imports/admin/masterData/manageLocation/components/Taluka/component/Addtalukadatalist.jsx';
import swal          			from 'sweetalert';

class AddTaluka extends Component{

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
			districtval   	: '',
			blockloctn      : '',
			talukaId 		: '',
			options	    	: 'manual',
		}
		this.handleChange = this.handleChange.bind(this);
		this.changeCountry = this.changeCountry.bind(this);
		this.changeState = this.changeState.bind(this);
		this.handleInputChange  = this.handleInputChange.bind(this);
	}

	componentDidMount(){
		$("html,body").scrollTop(0); 
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
	    $("#talukaForm").validate({
	      rules: {
	        blockloctn: {
	          required: true,
          	  regx1: /^[A-za-z ']+( [A-Za-z']+)*$/,
	        },
	        countryval:{
	        	valueNotEquals: "-Select-"
	        },
	        stateval:{
	        	valueNotEquals: "-Select-"
	        },
	        districtval:{
	        	valueNotEquals: "-Select-"
	        }

	      },
	      
	    });

	    //Spinner Effect
	    $(document).ready(function() {
		  $('.btn').on('click', function() {
		    var $this = $(this);
		    var loadingText = '<i class="fa fa-spinner fa-spin"></i> loading...';
		    if ($(this).html() !== loadingText) {
		      $this.data('original-text', $(this).html());
		      $this.html(loadingText);
		    }
		    setTimeout(function() {
		      $this.html($this.data('original-text'));
		    }, 2000);
		  });
		})
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
    	var districtData = this.props.post1;
    	var newstateArr = [];
    	for(var i=0; i<districtData.length; i++){
    		if(districtData[i].stateName == stateval){
    			newstateArr.push(districtData[i]);
    		}
    	}

		this.setState({
			district : newstateArr,
    		stateval : stateval

    	})
    	
    }

 
	componentWillReceiveProps(nextProps){
		var country 	= nextProps.post;
		var states 		= nextProps.post2;
		var district 	= nextProps.post1;
		// console.log("post33==");
		this.setState({
			country 		: country,
			states 			: states,
			district 		: district,
			countryStored 	: country,
			statesStored 	: states,
			districtStored 	: district,
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

	talukaadd(event){
		  event.preventDefault();		 
		  	var talukavalues = {
		  		"country" 		: this.state.countryval,
			  	"state" 		: this.state.stateval,	
				"district" 		: this.state.districtval,
				"blockloctn" 	: this.state.blockloctn,
			
			}

				
			     if ($('#talukaForm').valid()) {
			      Meteor.call('addTaluka',talukavalues,
			            (error, result)=> { 
			                if (error) {
			                    swal(error.reason);
			                } 
			                else {
			                	if(result == 'exist'){
			                		swal({
			                			title: 'abc',
			                			text:"Taluka Already Added."
			                		});
			                	}else{
			                		swal({
					                title: 'abc',
					                text: "Taluka Added successfully!",
					                });
			                	}
			                    
			                    this.setState({
			                    	countryval 		: '',
									stateval   		: '',
									districtval   	: '',
									blockloctn      : '',
									talukaId  		: ''
			                    })
			                }
			            }
			        );
			       }

	}

    updateTaluka(event){
	  event.preventDefault();
      var talukaId    = this.state.talukaId;
      var talukavalues = {
		  		"country" 		: this.state.countryval,
			  	"state" 		: this.state.stateval,	
				"district" 		: this.state.districtval,
				"blockloctn" 	: this.state.blockloctn,
			
			}
	 if ($('#talukaForm').valid()) {
      	Meteor.call('updateTaluka', talukaId, talukavalues,
                (error, result)=> { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    else {
                    	if(result == 'exist'){
	                		swal({
	                			title: 'abc',
	                			text:"Taluka Already Added."
	                		});
	                	}else{
	                    	swal({
				                title: 'abc',
				                text: "Taluka Modified successfully!",
				                });
	                    	this.setState({
		                    	countryval 		: '',
								stateval   		: '',
								districtval   	: '',
								blockloctn      : '',
								talukaId  		: ''
		                    })
		                }
                    }//the _id of new object if successful
                }

        );	
       }

	}

	deleteTaluka(event){
	  event.preventDefault();
	  Meteor.call('deleteTaluka', event.currentTarget.id,
                function(error, result) { 
                    if(error) {
                        console.log ( error ); 
                    }else{
                    	swal({
			                title: 'abc',
			                text: "Taluka Deleted successfully!",
			                });
                    	this.setState({
	                    	countryval 		: '',
							stateval   		: '',
							districtval   	: '',
							blockloctn      : '',
							talukaId  		: ''
	                    })
                    }
                    
                });	

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
		  return a.districtName > b.districtName;
		});
		this.setState({
			data : sortedAsc,
		});
  	} 
  	distrctsortdown(){
  		$("#districtsortup").css('display', 'inline-block');
		$("#distrctsortdown").css('display', 'none');
			
  		var sortedDesc = this.state.data.sort(function(a, b){
		  return a.districtName > b.districtName;
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

	editTaluka(event){
		event.preventDefault();
		$("html,body").scrollTop(0); 
		$('#addcountrie' ).css({'display':'block'});
		$('#bulkuploads').css({'display':'none'});
		this.setState({
			options : 'manual'
		}) 
		var talukaId = event.currentTarget.id;
		var talukadata = Taluka.findOne({"_id":talukaId});
		if(talukadata){
		    var country = Countries.find({}).fetch();
		    var dist = District.find({}).fetch();
		    var state = State.find({}).fetch();
			this.setState({
				country 		: country,
				states 			: state,
				district 		: dist,
				countryval 		: talukadata.countryName,
				stateval   		: talukadata.stateName,
				districtval   	: talukadata.districtName,
				blockloctn   	: talukadata.blockloctn,
				talukaId   		: talukadata._id
			})
		}
	}

	uploadCSV(event){
        event.preventDefault();
        
        UserSession.delete("progressbarSession", Meteor.userId());
        
        Papa.parse( event.target.files[0], {
		    header: true,
		    complete( results, file ) {
				Meteor.call( 'CSVUploadtaluka', results.data, ( error, result ) => {
                	if ( error ){
                        //Some code
         			} else {
         				
                    	if(result > 0){
                            swal({
                                
                                text    : 'Talukas Added Successfully',
                                title   : 'abc'
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
        });
    }

	showBtn(){
		if(this.state.talukaId){
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn updateBTN btn-temp" onClick={this.updateTaluka.bind(this)}>Update</button>
			)
		}else{
			return(
				<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn btnSubmit btn-temp" onClick={this.talukaadd.bind(this)}>Submit</button>
			)
		}
	}


	render(){
	
       return(
			<div className="">
				<div className=""  id="addcountrie">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 wrapperTitle formgroupheight pt20">
						<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc">
							<h4 className="manageLocTitle"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Taluka</h4>
						</div>
						
						<div className="switchField col-lg-6 col-md-6 col-sm-12 col-xs-12">
							<div className="pull-right">
						      	<input type="radio" id="switch_left" name="options" value="manual" checked={this.state.options === 'manual'} onChange={this.handleInputChange.bind(this)} />
						      	<label htmlFor="switch_left" className="mr15">Manual</label>
						      	<input type="radio" id="switch_right" name="options" value="auto" checked={this.state.options === 'auto'} onChange={this.handleInputChange.bind(this)} />
						      	<label htmlFor="switch_right">Auto</label>
						    </div>
						</div>
					</div>
				<div className="marginBottom col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
				{this.state.options == 'manual' ? 
			   		<Form id="talukaForm" >
        			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 masterTalukaInput padding-zero" id="addtaluka">	
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 talukaFormAlignment">
							<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 formht">
								 <label className="control-label col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls padding-zero" >Country<span className="astrick">*</span></label>
								<select onChange={this.changeCountry.bind(this)} title="Please select country." className="countrySelected col-lg-12 col-md-12 col-xs-12 col-sm-12 areaStaes form-control" ref="countryval" name="countryval" ref="countryval" id="countryval" value={this.state.countryval}>

								    <option >-Select-</option>
								    
									{this.props.post.map((data, index)=>{
                    					return(	
									        <option key={index}>{data.countryName}</option>		 
									    );
                					})}
							    </select>

							</div>	
							<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 formht">
							    <label className="control-label col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls padding-zero" >State<span className="astrick">*</span></label>
							    <select onChange={this.changeState.bind(this)} title="Please select state." className="stateSelected col-lg-12 col-md-12 col-xs-12 col-sm-12 areaStaes form-control" ref="stateval" name="stateval" id="stateval" value={this.state.stateval}>

								    <option >-Select-</option>
								    
									   	{this.state.states.map((data, index)=>{
                    						return(	
									       		<option key={index} >{data.stateName}</option>
									   						 
									     	);
                						})}
							    </select>

							</div>
							<div className="col-lg-4 col-md-4 col-xs-12 col-sm-12 formht">
								<div className="form-group">
								    <label className="control-label col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls padding-zero" >District<span className="astrick">*</span></label>
								   	<select title="Please select district." className="distSelected col-lg-12 col-md-12 col-xs-12 col-sm-12 areaStaes form-control" ref="districtval" name="districtval" id="districtval" value={this.state.districtval} onChange={this.handleChange.bind(this)} >

									    <option >-Select-</option>
									    
										   	{this.state.district.map((data, index)=>{
		                						return(	
										      
										      		<option key={index}>{data.districtName}</option>
										      
										 
										      	);
		            						})}
								    </select>

								</div>	
							</div>
							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
								<div className="form-group formht">
								    <label className="control-label col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls padding-zero" >Block/Taluka<span className="astrick">*</span></label>
								    <input className="form-control areaStaes" title="Please enter valid taluka." id="blockloctn" type="text" name="blockloctn" ref="blockloctn" value={this.state.blockloctn} onChange={this.handleChange.bind(this)} />
								</div>									
							</div>	

						</div>

						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pr28">
					    	{this.showBtn()}
						</div>
						</div>
						</Form>
						:
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
												<li><b>1)</b>&nbsp;&nbsp;Please use attached file format to bulkupload <b>Taluka Data</b> into this system.</li>
												<li><b>2)</b>&nbsp; File Format must be *.CSV.</li>
												<li><b>3)</b>&nbsp; Following is the format of .CSV file.</li>					
											</ul>
										</div>

										<div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12"><span className="control-label statelabel"><b>Upload Talukas</b></span></div>
										<div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 inputBulk">
											<div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 inputFieldBulk">
												<input type="file" onChange={this.uploadCSV.bind(this)} name="uploadCSV" ref="uploadCSV"  accept=".csv" className="form-control col-lg-6 col-md-12 col-sm-12 col-xs-12 uploadFileInput" required/>
											</div>
										</div>
									</div>
								</div>
							</div>
						}
						</div>
					
						
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  usrmgnhead">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<table id="listOfUsersDwnld" className="UMTableSAU table  myTable dataTable no-footer formTable col-lg-12 col-md-12 col-sm-10 col-xs-12" >
										<thead className="table-head tablebodyfix">
										<tr className="tempTableHeader">
											<th className="umHeader srpadd">  
												<span className="" >Country
													<span className="fa fa-caret-up custom  namesortup"  id="countrysortup" onClick={this.countrysortup.bind(this)} />
													<span className="fa fa-caret-down custom namesortdown" id="countrysortdown" onClick={this.countrysortdown.bind(this)} />   
												</span>
											</th>
											<th className="umHeader srpadd">  
												<span className="" >State{/*
												<span className="fa fa-caret-up custom  namesortup"  id="statesortup" onClick={this.statesortup.bind(this)} />
													<span className="fa fa-caret-down custom namesortdown" id="statesortdown" onClick={this.statesortdown.bind(this)} /> */}
												</span>
											</th>
											<th className="umHeader srpadd">  
												<span className="" >District{/*
													<span className="fa fa-caret-up custom  namesortup"  id="districtsortup" onClick={this.districtsortup.bind(this)} />
													<span className="fa fa-caret-down custom namesortdown" id="distrctsortdown" onClick={this.distrctsortdown.bind(this)} /> */}
												</span>
											</th>
											<th className="umHeader srpadd">  
												<span className="" >Taluka
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
																	<td className="txtcentr">{locationdata.districtName}</td>
																	<td className="txtcentr">{locationdata.blockloctn}</td>
																	
																	<td className="txtcentr">
																	<i className="fa fa-pencil action-btn" aria-hidden="true" title="Edit State" id={locationdata._id} onClick={this.editTaluka.bind(this)}></i> &nbsp; &nbsp;
																	<i className="fa fa-trash redFont action-btn" aria-hidden="true" title="Delete State "  data-toggle="modal" data-target={`#del-${locationdata._id}`}></i>
																	   	
																				 <div className="modal fade" id={`del-${locationdata._id}`} role="dialog">
																				    <div className="modal-dialog modal-md modDelWrapper">
																				      <div className="modal-content col-lg-12 modDelContent">
																				        <div className="modal-header modDelHeader">
																				          <button type="button" className="modDelClose pull-right" data-dismiss="modal">&times;</button>
																				        </div>
																				        <div className="modal-body deleteMsg">
																				          <p><b>The Taluka will be deleted. Are you sure you want to continue?</b></p>
																				        </div>
																				        <div className="modal-footer modDelFooter">
																				        	<button type="button" data-dismiss="modal" className="btn btnClose col-lg-2 col-md-2 col-sm-12 col-xs-12">Cancel</button>
																				          	<button  onClick={this.deleteTaluka.bind(this)} id={locationdata._id} type="button" data-dismiss="modal" className="btn updateBTNModal col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-right" >OK</button>
																				        </div>
																				      </div>
																				    </div>
																				  </div>
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

											</table>
										
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
							</div>
									</div>

				
				

			</div>			
	    );
	} 
}

export default AddTalukaexp = withTracker((props)=>{
	var dataVal = props.dataVal;

    const postHandle = Meteor.subscribe('countriesdata');
    const post       = Countries.find({}).fetch()||[];
   
    const loading    = !postHandle.ready();

    const postHandle1 = Meteor.subscribe('districtdata');
    const post1       = District.find({}).fetch()||[];

    const loading1    = !postHandle1.ready();
  	
  	const postHandle2 = Meteor.subscribe('statedata');
    const post2       = State.find({}).fetch()||[];
    const loading2    = !postHandle2.ready();
 
  	const postHandle3 = Meteor.subscribe('talukadata');
    const post3       = Taluka.find({},{sort: {createdAt: -1}}).fetch()||[];
    const loading3    = !postHandle3.ready();
    
    
    return {
    	
    	loading,
      	post,
    
	    loading1,
	    post1,


      	loading2,
      	post2, 
      	dataVal,


	    loading3,
	    post3,

    };
})(AddTaluka);

