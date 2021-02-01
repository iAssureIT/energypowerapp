import React, { Component } 	from 'react';
import { render } 				from 'react-dom';
import $              from 'jquery';

import ReactTable               from "react-table";
import swal from 'sweetalert';
import InputMask                 from 'react-input-mask';


import Form from 'react-validation/build/form';
/*import AddCountriesFunc 		from '/imports/admin/masterData/manageLocation/components/Country/component/AddCountries.jsx';
import AddDistrictFunc 			from '/imports/admin/masterData/manageLocation/components/District/component/AddDistrict.jsx';
import AddStateFunc 			from '/imports/admin/masterData/manageLocation/components/State/component/AddState.jsx';
import AddTalukaFunc 			from '/imports/admin/masterData/manageLocation/components/Taluka/component/AddTaluka.jsx';
import AddCityexp					from '/imports/admin/masterData/manageLocation/components/City/component/AddCity.jsx';
import AddAreaexp					from '/imports/admin/masterData/manageLocation/components/Area/component/AddArea.jsx';

import {State} 					from '/imports/admin/masterData/manageLocation/components/State/component/state.js';
import {Countries} 				from '/imports/admin/masterData/manageLocation/components/Country/component/Countries.js';
import {City} 					from '/imports/admin/masterData/manageLocation/components/City/component/City.js';
import {District} 				from '/imports/admin/masterData/manageLocation/components/District/component/District.js';
import {Location} 				from '/imports/admin/masterData/manageLocation/components/location/component/Location.js';
import {Taluka} 				from '/imports/admin/masterData/manageLocation/components/Taluka/component/Taluka.js';
import {Area} 				from '/imports/admin/masterData/manageLocation/components/Area/component/Area.js';

import LocationBulkupload 		from '/imports/admin/masterData/manageLocation/components/location/component/LocationBulkupload.jsx';
import Addlocationdatalist 		from '/imports/admin/masterData/manageLocation/components/location/component/Addlocationdatalist.jsx';*/

/*import 								'/imports/admin/masterData/manageLocation/manageLocation.css'
*/
// import 								'/imports/admin/masterData/manageLocation/masterdata.css'

export default class AddLocations extends Component{

	constructor(props){
		super(props);

		this.state = {
			country    		: [],
			countryStored 	: [],
			states 	   		: [],
			statesStored   	: [],
			district 	   	: [],
			districtStored 	: [],
			taluka 	  	 	: [],
			talukaStored 	: [],
			area 			: [],
			areaStored 		: [],
			city 			: [],
			cityStored 		: [],
			data 			: [],
			countryval 		: '',
			stateval   		: '',
			districtval   	: '',
			talukaval   	: '',
			areaval			: '',
			Village 		: '',
			pincode 		: '',
			locationId      : '',
			options	    	: 'manual',
		}
		this.changeCountry		= this.changeCountry.bind(this);
		this.changeState 		= this.changeState.bind(this);
		this.changeCity 		= this.changeCity.bind(this);
		this.handleInputChange  = this.handleInputChange.bind(this);
	}

	componentDidMount(){
		$('#listOfUsersDwnld').after('<div id="nav"></div>');
	    var rowsShown = 8;
	    var rowsTotal = $("#listOfUsersDwnld").find('tr').length;
	    console.log("rowsTotal",rowsTotal);
	    
	    var numPages = rowsTotal/rowsShown;
	    console.log("numPages",numPages);
	    for(var i = 0;i < numPages;i++) {
	        var pageNum = i + 1;
	        $('#nav').append('<a href="#" rel="'+i+'">'+pageNum+'</a> ');
	    }
	    $('#listOfUsersDwnld tbody tr').hide();
	    $('#listOfUsersDwnld tbody tr').slice(0, rowsShown).show();
	    $('#nav a:first').addClass('active');
	    $('#nav a').bind('click', function(){

	        $('#nav a').removeClass('active');
	        $(this).addClass('active');
	        var currPage = $(this).attr('rel');
	        var startItem = currPage * rowsShown;
	        var endItem = startItem + rowsShown;
	        $('#listOfUsersDwnld tbody tr').css('opacity','0.0').hide().slice(startItem, endItem).
	        css('display','table-row').animate({opacity:1}, 300);
	    });


		$("html,body").scrollTop(0); 
	    $.validator.addMethod("regx1", function(value, element, regexpr) {          
	      return regexpr.test(value);
	    }, "It should only contain letters.");
	    $.validator.addMethod("regxpin", function(value, element, regexpr) {          
	      return regexpr.test(value);
	    }, "Please enter a valid pincode.");
	    $.validator.addMethod("valueNotEquals", function(value, element, arg){
	        return arg !== value;
	    }, "Value must not equal arg.");
	    $.validator.addMethod("regxA1", function(value, element, regexpr) {        
	      	return regexpr.test(value);
	    }, "It should only contain letters.");
	    
	    $("#addareaform").validate({
	    	rules: {
		        pincode:{
		        	required:true,
		        	regxpin:/^[1-9][0-9]{5}$/
		        },
		        countryval:{
		        	required:true,
		        	regxA1: /^[a-zA-Z ]+$|^$/,
		        	/*valueNotEquals: "-Select-"*/
		        },
		        stateval:{
		        	required:true,
		        	regxA1: /^[a-zA-Z ]+$|^$/,
		        	/*valueNotEquals: "-Select-"*/
		        },
		        cityval:{
		        	required:true,
		        	regxA1: /^[a-zA-Z ]+$|^$/,
		        	/*valueNotEquals: "-Select-"*/
		        },
		        areaval:{
		        	required:true,
		        	regxA1: /^[a-zA-Z ]+$|^$/,
		        	/*valueNotEquals: "-Select-"*/
		        }
	      },
	      	messages: {
	      		pincode:{
	      			required: "This field is required"
	      		}
		  },
	    	errorPlacement: function(error,element){
	    		if(element.attr("name") == "countryval" ){
	    			error.insertAfter("#countryval")
	    		}
	    		if(element.attr("name") == "stateval" ){
	    			error.insertAfter("#stateval")
	    		}
	    		if(element.attr("name") == "cityval" ){
	    			error.insertAfter("#cityval")
	    		}
	    		if(element.attr("name") == "areaval" ){
	    			error.insertAfter("#areaval")
	    		}
	    		if(element.attr("name") == "pincode" ){
	    			error.insertAfter("#pincode")
	    		}
	    	}
	    });
	       
	    /*jQuery.validator.setDefaults({
	      debug: true,
	      success: "valid"
	    });*/
	    /*$("#addareaform").validate({
	      rules: {
	        Village: {
	          required: true,
          	  regx1: /^[A-za-z ']+( [A-Za-z']+)*$/,
	        },
	        pincode:{
	        	required:true,
	        	regxpin:/^[1-9][0-9]{5}$/
	        },
	        countryval:{
	        	valueNotEquals: "-Select-"
	        },
	        stateval:{
	        	valueNotEquals: "-Select-"
	        },
	        cityval:{
	        	valueNotEquals: "-Select-"
	        },
	        areaval:{
	        	valueNotEquals: "-Select-"
	        }
	      },
	      
	    });
*/
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
		    }, 500);
		  });
		})*/

	}

	handleInputChange(event) {
	    const target = event.target;
	    // const value = target.type === 'radio' ? target.checked : target.value;
	    const name = target.name;

	    this.setState({
	      [name]: event.target.value
	    });

	}


    componentWillReceiveProps(nextProps){
		var country = nextProps.post;
		var states = nextProps.post2;
		var city = nextProps.post1;
		var area = nextProps.post4;
		this.setState({
			country 		: country,
			states 			: states,
			city 			: city,
			area 			: area,
			countryStored 	: country,
			statesStored 	: states,
			cityStored 		: city,
			areaStored 		: area,
			data 			: nextProps.post3,
		});

	}


	changeCountry = (event)=>{
    	var countryval = $('.countrySelected').val();

    	var statesData = this.state.statesStored;
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
    	var cityData = this.state.cityStored;
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
/*    changeArea(event){
    	var cityval = $('#cityval').val();
    	var areaData = this.state.areaStored;
    	var newareaArr = [];
    	for(var i=0;i<areaData.length;i++){
    		if(areaData[i].area == cityval){
    			newareaArr.push(areaData[i]);
    		}
    	}
    	this.setState({
    		area : newareaArr,
    		cityval : cityval
    	})
    }*/
    changeCity(event){
    	var cityval = $('#cityval').val();
    	var areaData = this.state.areaStored;
    	var newstateArr = [];
    	for(var i=0; i<areaData.length; i++){
    		if(areaData[i].cityName == cityval){
    			newstateArr.push(areaData[i]);
    		}
    	}

		this.setState({
			area 		: newstateArr,
    		cityval     : event.target.value
    	})
    	
    }
  
	Bulkuploadlocation(event){
    	// event.preventDefault();
		$('#areaform' ).css({'display':'none'});
		$('#bulkuploadlocation').css({'display':'block'});	
	}

	addlocation(event){
		event.preventDefault();	
		
		if ($('#addareaform').valid()) {
			var locationValues = {
				"country" 			: this.state.countryval,
		  		"state" 				: this.state.stateval,
				"city" 				: this.state.cityval,
				"arealoctn" 		: this.state.areaval,			
				"pincodeloctn" 	: this.state.pincode,			
			}

	     /* 	Meteor.call('addLocation',locationValues,
	            (error, result)=> { 
	                if (error) {
	                    swal(error.reason);
	                } 
	                else {
	                	if(result == 'exist'){
	                		swal({

	                			customClass: ".swal-title",
	                			customClass: ".swal-text",
                            	customClass: ".swal-footer",
                            	customClass: "swal-button",
                            	timer:1500,
	                			text:"Location Already Added",

	                			});
	                	}else{
		                    swal({

		                    customClass: ".swal-title",
		                    customClass: ".swal-text",
                            customClass: ".swal-footer",
                            customClass: "swal-button",
			       			timer:1500,
			                text: "Location Added successfully!",
			                // type: 'success',
			                showCancelButton: false,
			                confirmButtonColor: '#e60004',
			                confirmButtonText: 'Ok'});
		  					this.setState({
		  						countryval 		: '',
								stateval   		: '',
								cityval   	    : '',
								areaval   	    : '',
								Village 		: '',
								pincode 		: '',
								locationId      : ''
		  					})
		  				}

	                }
	            }
	        );*/

		}else{
			$("#selectOption").removeClass("error");
			if($(event.target).parent().parent().find('.error').val() == ''){
			  $(event.target).parent().parent().find('.error').siblings('label.error').text('This field is required.');
			}
			$(event.target).parent().parent().find('.error:first').focus();
		}


	}

	editRole(event){
	  event.preventDefault();
      var locationId    = this.state.locationId;
      var locationValues = {
			  		"country" 		: this.state.countryval,
			  		"state" 		: this.state.stateval,
					"city" 		: this.state.cityval,
					"blockloctn" 	: this.state.areaval,	
					"cityloctn" 	: this.state.Village,			
					"pincodeloctn" 	: this.state.pincode,			
				}
	  if ($('#addareaform').valid()) {
	  /*    Meteor.call('updateLocation', locationId, locationValues,
	                (error, result)=> { 
	                    if (error) {
	                        swal( error.reason ); 
	                    }else {
	                    	swal({
			                timer:2000,
			                text: "Location Modified successfully!",
			                
			                showCancelButton: false,
			                confirmButtonColor: '#666',
			                confirmButtonText: 'Ok'});
	                    	this.setState({
		  						countryval 		: '',
								stateval   		: '',
								cityval   		: '',
								areaval   		: '',
								Village 		: '',
								pincode 		: '',
								locationId      : ''
		  					})

	                    }
	                }

	        );*/	
	   }

	}

	deleteLocation(event){
	  event.preventDefault();
	  let id = $(event.currentTarget).attr("id");
	  swal({
	  	text: "Are you sure you want to delete this Location?",
        buttons: {confirm:'Yes',cancel:'No'},
        confirmButtonColor: "#DD6B55",
        className: "confirmSwal",
        closeOnConfirm: false,
        content: false
	  }).then((willDelete)=>{
	  		if(willDelete){
	  			/*Meteor.call('delLocation', id,
		                (error, result)=> { 
		                    if (error) {
		                        console.log ( error ); 
		                    }else{
		                    	swal({
				                timer:2000,
				                text: "Location Deleted successfully!",
				                });
				            	this.setState({
			  						countryval 		: '',
									stateval   		: '',
									cityval		   	: '',
									areaval   	: '',
									Village 		: '',
									pincode 		: '',
									locationId      : ''
			  					})
		                    }
		                    
		                });	*/
	  		}
	  })
	}

		/*usernamesortup(){
  		
		$("#sortup").css('display', 'none');
		$("#sortdown").css('display', 'inline-block');
	
  		console.log("this.state.usersListData==",this.state.usersListData);
		var sortedAsc = this.state.usersListData.sort(function(a, b){
		  return a.profile.fullName > b.profile.fullName;
		});
 		console.log("sortedAsc=",sortedAsc);
		this.setState({
			usersListData : sortedAsc,
		});
  	} 
  	usernamesortdown(){
   		$("#sortup").css('display', 'inline-block');
		$("#sortdown").css('display', 'none');	
  		var sortedDesc = this.state.usersListData.sort(function(a, b){
		  return a.profile.fullName > b.profile.fullName;
		}).reverse();
		this.setState({
			usersListData : sortedDesc,
		});
  	}*/
  	citysortup(){
  		
		$("#citysortup").css('display', 'none');
		$("#citysortdown").css('display', 'inline-block');
	
  		// console.log("this.state.usersListData==",this.state.usersListData);
		var sortedAsc = this.state.data.sort(function(a, b){
		  return a.cityloctn > b.cityloctn;
		});
 		console.log("sortedAsc=",sortedAsc);
		this.setState({
			data : sortedAsc,
		});
  	} 
  	citysortdown(){
   		$("#citysortup").css('display', 'inline-block');
		$("#citysortdown").css('display', 'none');	
  		var sortedDesc =  this.state.data.sort(function(a, b){
		  return a.cityloctn > b.cityloctn;
		}).reverse();
		// console.log("sortedDesc=",sortedDesc);

		this.setState({
			data : sortedDesc,
		});
  	}
  	areasortup(){
  		
		$("#areasortup").css('display', 'none');
		$("#areasortdown").css('display', 'inline-block');
	
  		// console.log("this.state.usersListData==",this.state.usersListData);
		var sortedAsc = this.state.data.sort(function(a, b){
		  return a.blockloctn > b.blockloctn;
		});
 		// console.log("sortedAsc=",sortedAsc);
		this.setState({
			data : sortedAsc,
		});
  	} 
  	areasortdown(){
   		$("#areasortup").css('display', 'inline-block');
		$("#areasortdown").css('display', 'none');	
  		var sortedDesc =  this.state.data.sort(function(a, b){
		  return a.blockloctn > b.blockloctn;
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
			// var sortedDesc = _.sortBy(this.state.usersListData, 'profile.fullName').reverse();
		// console.log("sortedDesc=",sortedDesc);
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


	editLocation(event){
		event.preventDefault();
		$("html,body").scrollTop(0); 
		$('#areaform' ).css({'display':'block'});
		$('#bulkuploadlocation').css({'display':'none'});
		$("#addareaform").validate().resetForm();
		this.setState({
			options : 'manual'
		}) 	
		$("#manual").addClass('active');
		$("#locationform").addClass('active');
		$("#auto").removeClass('active');
		$("#csvUpload").removeClass('active');
		var locationId = $(event.currentTarget).attr("id");
		var locationdata = Location.findOne({"_id":locationId});
		if(locationdata){
			this.setState({
				countryval 		: locationdata.countryName,
				stateval   		: locationdata.stateName,
				cityval   		: locationdata.cityloctn,
				areaval   		: locationdata.arealoctn,
				pincode 		: locationdata.pincodeloctn,
				locationId      : locationdata._id
			})

		}
	}

	showBtn(){
		if(this.state.locationId){
			return(
	    			<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn updateBTN btn-temp" onClick={this.editRole.bind(this)} >UPDATE</button>
			)
		}else{
			return(
	    			<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn btnSubmit btn-temp" onClick={this.addlocation.bind(this)} >ADD</button>
			)
		}
	}

	Bulkuploadform(event){
    	// event.preventDefault();
		$('#addcountrie' ).css({'display':'none'});
		$('#bulkuploads').css({'display':'block'});	
	}

	uploadCSV(event){
        event.preventDefault();
        $("#loadMe").modal({show:true,backdrop: "static",keyboard: false})
/*        Session.set("progressbarSession",50);
*/        
      /*  Papa.parse( event.target.files[0], {
		    header: true,
		    complete( results, file ) {
		    	Meteor.call('CSVUploadCountries',results.data, (error,result)=>{
		    		if(error){
		    			console.log('state error',error.reason);
		    		}
		    	});
		    	Meteor.call('CSVUploadstate',results.data, (error,result)=>{
		    		if(error){
		    			console.log('state error',error.reason);
		    		}
		    	});		    	
		    	Meteor.call('CSVUploadcity',results.data, (error,result)=>{
		    		if(error){
		    			console.log('state error',error.reason);
		    		}
		    	});
		    	Meteor.call('CSVUploadarea',results.data, (error,result)=>{
		    		if(error){
		    			console.log('state error',error.reason);
		    		}
		    	});
				Meteor.call( 'CSVUploadlocation', results.data, ( error, result ) => {
                	if ( error ){
                        //Some code
         			} else {
         				console.log('result',result)
                    	if(result > 0){
                            swal({
                                
                               
                               timer:2000,
                                text     : "Location List Uploaded Successfully",
                                
                            });
                            $("#loadMe").modal("hide");
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
                                
                                
                            }); 
                             $('#addcountrie' ).css({'display':'block'});
									  $('#bulkuploads').css({'display':'none'});                      		
                        }       
         			}
      			});

		    }
        });*/
    }
    uplaodProgress(){
    /*	var percent = Session.get('progressbarSession');
    	if(percent){
    		var percentVal = parseInt(percent);
    	}
    	   if(percentVal){
            
              var styleC = {
                  width:percentVal + "%",
                  display:"block",
              }
              var styleCBar = {
                  display:"block",
                  marginTop:5,
              }
          }
          if(!percentVal){
              var percentVal = 0;

              var styleC = {
                  width:0 + "%",
                  display:"none",
              }
              var styleCBar = {
                  display:"none",
                  marginTop:5,
              }
          }

          if(parseInt(percentVal)==100){
              setTimeout(()=>{
                  Session.set("uploadTicketImgProgressbar",0);
              }, 3000);
            
             
          }

          return (
            <div className='col-lg-12 col-md-12 col-xs-12 col-sm-12'>             
              <div className="progress"  style={styleCBar}>
                <div className="progress-bar progress-bar-striped active" role="progressbar"
                aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style= {styleC}>
                  {percentVal} %
                </div>
              </div>
            </div>
          );*/
      }
   
	
	render(){
	const data = this.props.post3;
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
				accessor: 'cityloctn'
			},
			{
				Header 	:'Area',
				accessor: 'arealoctn'
			},
			{
				Header 	:'Pincode',
				accessor: 'pincodeloctn'
			},
			{
				Header 	:'Actions',
				accessor: '_id',
				Cell:row=>(
					<div>
						<i className="fa fa-pencil action-btn" aria-hidden="true" id={row.value} title="Edit Location" onClick={this.editLocation.bind(this)}></i> &nbsp; &nbsp;
                        <i className="fa fa-trash redFont action-btn" id={row.value} aria-hidden="true" title="Delete Location " onClick={this.deleteLocation.bind(this)}></i>
					</div>
				)
			},
		]
       return(
       		<div className="">
	       		
    			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addlocationWrapper">
    				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 wrapperTitle formgroupheight pt20">
						<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc padding-zero">
							<h4 className="manageLocTitle"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Location</h4>
						</div>
						
						<div className="switchField manual-auto col-lg-6 col-md-6 col-sm-12 col-xs-12">
							<ul className="nav nav-pills nav-pillss location pull-right">
                                <li className="active text-center transactionTab masterDataTab" id='manual'>
                                    <a href="#locationform" className="tab-align" data-toggle="tab" >
                                    	Manual
                                    </a>
                                </li>
                                <li className="text-center  transactionTab masterDataTab" id='auto'>
                                    <a href="#csvUpload" className="tab-align" data-toggle="tab" >
                                    	Auto
                                    </a>
                                </li>
                            </ul>
							
						</div>
					</div>
					<div className="marginBottom col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
					<div className='tab-content col-lg-12 col-md-12 col-sm-12 col-xs-12'>
						<div className='tab-pane active' id="locationform">
				       		<Form id="addareaform" >  
				 				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 masterInput padding-zero ht110">
										<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 formht">
											<div className="form-group">
											    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls padding-zero">Country<span className="astrick">*</span></label>
											   	<select required aria-describedby="basic-addon1" onChange={this.changeCountry.bind(this)} title="Please select Country." className="countrySelected col-lg-12 col-md-12 col-xs-12 col-sm-12 areaStaes form-control" ref="countryval" name="countryval" ref="countryval" id="countryval" value={this.state.countryval}>
												    <option className="inputText" id='selectOption'>-Select-</option>
												    
													{this.state.country.map((data, index)=>{
					                    					return(	
														        <option className="inputText" key={index}>{data.countryName}</option>		 
														    );
					                					})}
											    </select>
											</div>	
										</div>
										<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 formht">
											<div className="form-group">
											     <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls padding-zero" >State<span className="astrick">*</span></label>
											    <select required aria-describedby="basic-addon1" onChange={this.changeState.bind(this)} title="Please select State." className="stateSelected col-lg-12 col-md-12 col-xs-12 col-sm-12 areaStaes form-control" ref="stateval" name="stateval" id="stateval" value={this.state.stateval}>
													<option className="inputText">-Select-</option>
												    
													   {this.state.states.map((data, index)=>{
					                    						return(	
														       		<option className="inputText" key={index} >{data.stateName}</option>
														   						 
														     	);
					                					})}
											    </select>
											</div>	
										</div>
										<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 formht">
											<div className="form-group2 ">
											    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls padding-zero" >City<span className="astrick">*</span></label>
											   	<select required  title="Please select City." aria-describedby="basic-addon1" className="distSelected col-lg-12 col-md-12 col-xs-12 col-sm-12 areaStaes form-control" ref="cityval" name="cityval" id="cityval" value={this.state.cityval} onChange={this.changeCity.bind(this)}>
												    <option className="inputText">-Select-</option>
												    
													   	{this.state.city.map((data, index)=>{
					                						return(	
													      		<option className="inputText" key={index}>{data.cityName}</option>
													 
													      	);
					            						})}
											    </select>
											</div>	
										</div>
								</div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 masterInput padding-zero ht110">
										<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 formht">
											<div className="form-group2 ">
											    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls padding-zero" >Area<span className="astrick">*</span></label>
											   	<select required onChange={this.handleChange.bind(this)} aria-describedby="basic-addon1" title="Please select Area." className="areaSelected col-lg-12 col-md-12 col-xs-12 col-sm-12 areaStaes form-control" ref="areaval" name="areaval" id="areaval" value={this.state.areaval}>
												    <option className="inputText">-Select-</option>
													   	{this.state.area.map((data, index)=>{
					                						return(	
													      	<option className="inputText" key={index}>{data.area}</option>
													     );
					            						})}
											    </select>
											</div>	
										</div>
										
										
										<div className="form-group col-lg-4 col-md-4 col-sm-12  col-xs-12 formht">
											<div className="form-group">
											    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls padding-zero" >Pin Code<span className="astrick">*</span></label>
											    <input className="form-control areaStaes" title="Please enter valid pincode." type="number" name="pincode" ref="pincode" id="pincode" value={this.state.pincode} onChange={this.handleChange.bind(this)} />
											       {/*<InputMask mask="999999" maskChar=" " pattern="(0|[1-9][0-9-])"  className="form-control areaStaes" title="Please enter valid Pincode." type="text" name="pincode" ref="pincode" id="pincode" value={this.state.pincode} onChange={this.handleChange.bind(this)} />*/}
											</div>	
										</div>

									
									{/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						    			{this.showBtn()}
									</div>*/}
								</div>	
								</Form>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						    			{this.showBtn()}
								</div>
						</div>
						<div className='tab-pane' id="csvUpload">
							<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
								<div className="csvDLWrap">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkUploadForm">
										<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 bulkImage">
											<div className="csvIcon">
												<a href="/csv/location.csv" download>
													<img src="/images/csv.jpg" className="csvimg" title="Click to download file"/>
												</a>
											</div>
										</div>
										<div className="col-lg-11 col-md-12 col-sm-12 col-xs-12">
											<h4><b>Instructions</b></h4>
											<ul className="uploadQuesinst col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<li><b>1)</b>&nbsp;&nbsp;Please use attached file format to bulkupload <b>Location Data</b> into this system.</li>
												<li><b>2)</b>&nbsp; File Format must be *.CSV.</li>
												<li><b>3)</b>&nbsp; Following is the format of .CSV file.</li>					
											</ul>
										</div>
										<div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12"><span className="control-label statelabel"><b>Upload Locations</b></span></div>
										<div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 inputBulk">
											<div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 inputFieldBulk">
												<input type="file" onChange={this.uploadCSV.bind(this)} name="uploadCSV" ref="uploadCSV"  accept=".csv" className="form-control col-lg-6 col-md-12 col-sm-12 col-xs-12 uploadFileInput" required/>
											</div>
										</div>
										{/*<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">          
				                            {this.uplaodProgress()}
				                        </div>*/}
									</div>
								</div>
								
							</div>
							{/*Loading Modal*/}
							<div className="modal fade" id="loadMe" tabIndex="-1" role="dialog" aria-labelledby="loadMeLabel">
							  <div className="modal-dialog modal-sm loading-modal" role="document">
							    <div className="modal-content">
							      <div className="modal-body text-center">
							        <div className="loader"></div>
							            <img src="/images/loading.gif" alt="loading" className='img'></img>
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

										</div>
									
						            { 
						            	this.state.data && this.state.data.length>0 ? 
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
		
	    );
	} 
}

