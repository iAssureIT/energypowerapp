import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import 'bootstrap/js/tab.js';
import S3FileUpload from 'react-s3';
import { withRouter } from 'react-router-dom';
import OneFieldForm             from '../../../../../coreadmin/Master/OneFieldForm/OneFieldForm.js';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import IAssureTable from "../../../../../coreadmin/IAssureTable/IAssureTable.jsx";
import LocationType from  '../../../../../coreadmin/Master/LocationType/LocationType.jsx';
import MapContainer from '../../../../Map/MapContainer.js';
import Geocode from "react-geocode";

class LocationDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			'locationTypeVal': "",
			'addressLine1': "",
			'addressLine2': "",
			'country': "",
			'state': "",
			'district': "",
			'city': "",
			'area': "",
			'pincode': "",
			'stateCode':"",
			'countryCode':"",
			'indexOneValue': '',
			'uderscoreId': '',
			'locationTypeDisable': true,
			 'latLng':{lat:null,lng:null},
			'stateArray': [],
			'districtArray': [],
			'pincodeExists': true,
			'openForm'					: this.props.modal ?this.props.modal: false,
			'openFormIcon'              : this.props.modal ?this.props.modal: false,
			gmapsLoaded: false,
			view : 'Grid',
			'pathname': this.props.entity,
			'entityID': this.props.match.params ? this.props.match.params.entityID : '',
			'locationID': this.props.match.params ? this.props.match.params.locationID : '',
			 "fields" : {
                placeholder     : "Enter location type..",
                title           : "Location Type",
                attributeName   : "locationType"
            },
            // "tableHeading": {
            //     locationType: "Location Type",
            //     actions: 'Action',
            // },
            // "tableObjects": {
            //     deleteMethod: 'delete',
            //     apiLink: '/api/locationtypemaster/',
            //     paginationApply: false,
            //     searchApply: false,
            //     editUrl: '/appCompany/location-details'
            // },
            RecordsTable:[],
			tableHeading:{
	            locationType:"Location Type",
	            address:"Address",
	            actions:"Action"
	          },
	        tableObjects : {
	          paginationApply : false,
	          searchApply     : false,
	          editUrl         : '/' + this.props.entity + "/location-details/" + this.props.match.params.entityID,
	          listUrl         : '/' + this.props.entity + "/location-details/" + this.props.match.params.entityID,
	          deleteMethod    : 'delete',
        	  apiLink         : '/api/entitymaster/location',
	          downloadApply   : true
	        },
	        startRange        : 0,
            limitRange        : 100000,
		
            "editId": this.props.match.params ? this.props.match.params.fieldID : '',
            "IdToDelete" : "",

           
		};
		this.handleChange = this.handleChange.bind(this);
		// this.handleChangeCountry = this.handleChangeCountry.bind(this);
		// this.handleChangeState = this.handleChangeState.bind(this);
		// this.handleChangeDistrict = this.handleChangeDistrict.bind(this);
		// this.handleChangeBlock = this.handleChangeBlock.bind(this);
		this.camelCase = this.camelCase.bind(this)
	}

	initMap = () => {
      this.setState({
        gmapsLoaded: true,
      })
    }

	componentDidMount() {
		this.getLocationType();
		this.locationDetails();
		this.getData();
		this.getDepartment();
		this.edit();
		window.scrollTo(0, 0);
		this.handleChange = this.handleChange.bind(this);
		axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
		this.setState({
			'entityID': this.props.match.params ? this.props.match.params.entityID : '',
			'locationID': this.props.match.params ? this.props.match.params.locationID : '',
		})
	}
	componentWillReceiveProps(nextProps) {
		this.edit();
		this.getData();
		this.getLocationType();
		this.getDepartment();
		this.setState({
			'entityID': nextProps.match.params ? nextProps.match.params.entityID : '',
			'locationID':nextProps.match.params ? nextProps.match.params.locationID : '',
		})
	}
	getData(){
		this.setState({
			'entityID': this.props.match.params ? this.props.match.params.entityID : '',
			'locationID': this.props.match.params ? this.props.match.params.locationID : '',
		})
		var formvalues = {
			startRange : this.state.startRange,
			limitRange : this.state.limitRange,
			entityID : this.props.match.params.entityID
		}
		if(this.props.match.params.entityID){
			axios.post('/api/entitymaster/getAllLocation',formvalues)
			.then((response)=>{
				var data = response.data.locations.reverse()
				var tableData = data.map((a, i)=>{
					// var gstimage = a.GSTDocument.map((image,i)=>{return '<a href='+image+' target="_blank" title="Click to View"><img src='+image+' class="img-responsive imgtabLD logoStyle" /></a>'})
					// var panimage = a.PANDocument.map((image,i)=>{return '<a href='+image+' target="_blank" title="Click to View"><img src='+image+' class="img-responsive imgtabLD logoStyle" /></a>'})
		        return{
		        	_id:a._id,
		            locationType:a.locationType,
		            address:a.addressLine2 ? a.addressLine2+", "+a.addressLine1 : a.addressLine1,
		            // GSTIN:a.GSTIN ? (a.GSTIN +"</br>"+(a.GSTDocument && a.GSTDocument.length > 0 ? gstimage:'')) : 'NIL',
		            // PAN:a.PAN ? (a.PAN +"</br>"+(a.PANDocument && a.PANDocument.length > 0 ? panimage:'')): 'NIL',
		        }
		      })
	          this.setState({RecordsTable:tableData})
				
			})
			.catch((error)=>{})
		}		
	}

	openForm() {		
		this.setState({
			openForm: this.state.openForm === false ? true : false,
			openFormIcon : this.state.openFormIcon === false ? true : false
		}, () => {
			if (this.state.openForm === true) {
				this.validations();
			}
		})

	}
	validations() {
		$.validator.addMethod("regxlocationType", function (value, element, arg) {
			return arg !== value;
		}, "Please select the location type");
		
		$.validator.addMethod("addressLineRegx", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter valid address.");
		$.validator.addMethod("pincodeRegx", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Pincode does not exist!");
		$.validator.addMethod("regxcountry", function (value, element, arg) {
			return arg !== value;
		}, "Please select the country");
		$.validator.addMethod("regxstate", function (value, element, arg) {
			return arg !== value;
		}, "Please select the state");
		$.validator.addMethod("regxdistrict", function (value, element, arg) {
			return arg !== value;
		}, "Please select the district");
		
		$.validator.addMethod("regxarea", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter valid area.");
		jQuery.validator.addMethod("notEqual", function(value, element, param) {
      return this.optional(element) || value != param;
    }, "Please specify a different (non-default) value");
		

		jQuery.validator.setDefaults({
			debug: true,
			success: "valid"
		});
		$("#locationsDetail").validate({
			rules: {
				department :{
					required :true
				},
				locationTypeVal: {
					required: true,
					notEqual:""
				},
				addressLine1: {
					required: true,
				},
			},
			errorPlacement: function (error, element) {
				if (element.attr("name") === "locationTypeVal") {
					error.insertAfter("#locationTypeVal");
				}
				if (element.attr("name") === "department") {
					error.insertAfter("#locationTypeVal");
				}
				if (element.attr("name") === "addressLine1") {
					error.insertAfter("#addressLine1");
				}
				if (element.attr("name") === "country") {
					error.insertAfter("#country");
				}
				if (element.attr("name") === "states") {
					error.insertAfter("#states");
				}
				if (element.attr("name") === "district") {
					error.insertAfter("#district");
				}
				if (element.attr("name") === "pincode") {
					error.insertAfter("#pincode");
				}
				if (element.attr("name") === "area") {
					error.insertAfter("#area");
				}
			}
		})
	}
	handleChange(event) {
		const target = event.target;
		const name = target.name;
		this.setState({
			[name]: event.target.value
		});
		
	}
	
	camelCase(str) {
		return str
			.toLowerCase()
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
	locationdetailBack(event) {
		event.preventDefault();
		var entityID = this.props.match.params.entityID;

		if (this.state.locationTypeVal || this.state.addressLine1 || this.state.countryCode || this.state.stateCode || this.state.district || this.state.city || this.state.area || this.state.pincode) {
			swal({
				// title: 'abc',
				text: "It seems that you are trying to enter a location. Click 'Cancel' to continue entering location. Click 'Ok' to go to next page. But you may lose values if already entered in the location form",
				buttons: {
					cancel: {
						text: "Cancel",
						value: false,
						visible: true,
						className: "CancelButtonSwal"
					},
					confirm: {
						text: "OK",
						value: true,
						visible: true,
						className: "OkButtonSwal",
						closeModal: true
					}
				},
			})
				.then((value) => {
					if (value) {
						if (entityID) {
							this.props.history.push("/" +this.state.pathname + "/department-details/" + entityID);
						} else {
							this.props.history.push("/" + this.state.pathname + "/department-details");
						}
					} else {
						this.props.history.push("/" +this.state.pathname + "/location-details/" + entityID);
					}
				})
			$(".OkButtonSwal").parents('.swal-button-container').addClass('postionSwalRight');
			$(".CancelButtonSwal").parents('.swal-button-container').addClass('postionSwalLeft');

		} else {
			if (entityID && entityID != undefined) {
				this.props.history.push("/" +this.state.pathname+ "/department-details/" + entityID);
			} else {
				this.props.history.push("/" +this.state.pathname+ "/department-details");
			}
		}
	}
	locationdetailsAdd(event) {
		event.preventDefault();
		var entityID = this.props.entityID ? this.props.entityID : this.props.match.params.entityID;
		if ($('#locationsDetail').valid()) {
			var formValues = {
				'entityID': entityID,
				'locationDetails': {
					'locationType': this.state.locationTypeVal,
					'addressLine1': this.state.addressLine1,
					'addressLine2': this.state.addressLine2,
					'countryCode': this.state.countryCode,
					'department' :this.state.department,
					'country': this.state.country,
					'stateCode': this.state.stateCode,
					'state': this.state.states,
					'district': this.state.district,
					'city': this.state.city,
					'area': this.state.area,
					'pincode': this.state.pincode,
					'latitude':this.state.latLng ? this.state.latLng.lat : "",
					'longitude':this.state.latLng ? this.state.latLng.lng : "",
				}
			}
			axios.patch('/api/entitymaster/patch/addLocation', formValues)
				.then((response) => {
					$('.inputText').val('');
					this.setState({
						'openForm': this.props.modal ? true : false,
						'pincodeExists': true,
						'locationTypeVal': '',
						'addressLine1': "",
						'addressLine2': "",
						'countryCode': "",
						'country': '',
						'stateCode': "",
						'states': '',
						'district': "",
						'city': "",
						'area': "",
						'pincode': "",
						'latLng':"",
						"department":""
					});
					this.locationDetails();
					$(".swal-text").css("font-family", "sans-serif");
					if(response.data.duplicated === true){
						swal('Location details already exist')
					}else{
						swal('Location details added successfully.');
					}
					// this.setState({			
					// 	openFormIcon : this.state.openFormIcon === false ? true : false
					// });
					$("#locationsDetail").validate().resetForm();
				})
				.catch((error) => {})
		}else{
			$(event.target).parent().parent().parent().find('.errorinputText.error:first').focus();
		}
	}
	locationdetailBtn(event) {
		event.preventDefault();
		var entityID = this.props.match.params.entityID;
		if (this.state.locationTypeVal || this.state.addressLine1 || this.state.countryCode || this.state.stateCode || this.state.district || this.state.city || this.state.area || this.state.pincode) {
			swal({
				// title: 'abc',
				text: "It seems that you are trying to enter a location. Click 'Cancel' to continue entering location. Click 'Ok' to go to next page. But you may lose values if already entered in the location form",
				buttons: {
					cancel: {
						text: "Cancel",
						value: false,
						visible: true,
						className: "CancelButtonSwal"
					},
					confirm: {
						text: "OK",
						value: true,
						visible: true,
						className: "OkButtonSwal",
						closeModal: true
					}
				},
			})
				.then((value) => {
					if (value) {
						if(entityID === undefined){
						this.props.history.push("/" + this.state.pathname + "/contact-details" );
						}else{
						this.props.history.push("/" + this.state.pathname + "/contact-details/" + entityID);
						}
					} else {
						if(entityID === undefined){
						this.props.history.push("/" + this.state.pathname + "/location-details" );
						}else{
						this.props.history.push("/" + this.state.pathname + "/location-details/" + entityID);
						}
					}
				})
			$(".OkButtonSwal").parents('.swal-button-container').addClass('postionSwalRight');
			$(".CancelButtonSwal").parents('.swal-button-container').addClass('postionSwalLeft');

		} else {
			if(entityID === undefined){
			this.props.history.push("/" + this.state.pathname + "/contact-details" );
			}else{
			this.props.history.push("/" + this.state.pathname + "/contact-details/" + entityID);
			}
		}
	}

	edit() {
		var entityID = this.state.entityID;
		var locationID = this.state.locationID;
		if (entityID && locationID) {
			axios.get('/api/entitymaster/get/one/' + entityID)
				.then((response) => {
					var editData = response.data[0].locations.filter((a) => a._id === locationID);
					// this.getStates(editData[0].countryCode);
					// this.getDistrict(editData[0].stateCode, editData[0].countryCode);
					// this.getBlocks(editData[0].district, editData[0].stateCode, editData[0].countryCode);
					this.setState({
						'openForm': true,
						'locationTypeVal': editData[0].locationType,
						'addressLine1': editData[0].addressLine1,
						'addressLine2': editData[0].addressLine2,
						'country': editData[0].country,
						'countryCode': editData[0].countryCode,
						'states': editData[0].state,
						'stateCode': editData[0].stateCode,
						"department":editData[0].department,
						'district': editData[0].district,
						'branchCode': editData[0].branchCode,
						'latLng': {lat:editData[0].latitude, lng:editData[0].longitude},
						'city': editData[0].city,
						'area': editData[0].area,
						'pincode': editData[0].pincode,
					}, () => {
						if (this.state.openForm === true) {
							this.validations();
						}
					})
				})
				.catch((error) => {
				})
		}
	}

	// updateStateDoc(){
		
	// }

	locationDetails() {
		axios.get('/api/entitymaster/get/one/' + this.props.match.params.entityID)
			.then((response) => {
				this.setState({
					locationarray: response.data[0].locations.reverse()
				})
			})
			.catch((error) => {
			})
		return [];
	}

	deleteEntity(event){
		event.preventDefault();
		this.setState({IdToDelete: event.currentTarget.getAttribute('data-id')})
		$('#deleteEntityModal').show();
    }
    confirmDelete(event){
    	event.preventDefault();
    	var entityID = this.props.match.params.entityID;
    	var locationID = this.state.IdToDelete;
    	axios.delete('/api/entitymaster/location/delete/'+locationID)
            .then((response)=>{
           		if (response.data) {
					this.setState({
						'openForm': false,
						'locationID': "",
						'locationTypeVal': '--Select Location Type--',
						'addressLine1': "",
						'addressLine2': "",
						'countryCode': "",
						'country': '',
						'stateCode': "",
						'states': '',
						'district': "",
						'department':"",
						'city': "",
						'area': "",
						'pincode': "",
						'latLng':"",
					});
					this.props.history.push('/' + this.state.pathname + '/location-details/' + entityID);
					this.locationDetails();
           			swal({
	                    text : "Location deleted successfully.",
	                    // text : (this.state.entityType === "appCompany" ? "Organizational Settings" :this.state.entityType) +" is deleted successfully.",
					  });
					  $(".swal-text").css("text-transform", "capitalize");
           		}	else{
           			swal({
	                    text : "Sorry,Failed to delete.",
	                  });
           		}
           		$('#deleteEntityModal').hide();
	              this.props.getEntities();
	              this.props.hideForm();
                 

            })
            .catch((error)=>{
            })
    }
    closeModal(event){
    	event.preventDefault();
    	$('#deleteEntityModal').hide(); 
    }
	locationDelete(event) {
		event.preventDefault();
		var entityID = this.state.entityID;
		var locationID = event.target.id;
		axios.delete('/api/entitymaster/deleteLocation/' + entityID + "/" + locationID)
			.then((response) => {
				this.setState({
					'openForm': false,
					'locationID': "",
					'locationTypeVal': '--Select Location Type--',
					'addressLine1': "",
					'addressLine2': "",
					'countryCode': "",
					'country': '',
					'stateCode': "",
					'department':"",
					'states': '',
					'district': "",
					'city': "",
					'area': "",
					'pincode': "",
					'latLng':"",
				});
				this.props.history.push('/' +this.state.pathname + '/location-details/' + entityID);
				this.locationDetails();
				$(".swal-text").css("font-family", "sans-serif");
				swal('Location deleted successfully.');
			})
			.catch((error) => {
			})
	}
	updateLocationDetails(event) {
		event.preventDefault();
		var entityID = this.props.match.params.entityID;
		var locationID = this.props.match.params.locationID;
		if ($('#locationsDetail').valid()) {
			var formValues = {
				'entityID': entityID,
				'locationID': locationID,
				'locationDetails': {
					'locationType': this.state.locationTypeVal,
					'addressLine1': this.state.addressLine1,
					'addressLine2': this.state.addressLine2,
					'branchCode'	: this.state.branchCode,
					'countryCode': this.state.countryCode,
					'country': this.state.country,
					'stateCode': this.state.stateCode,
					'department': this.state.department,
					'state': this.state.states,
					'district': this.state.district,
					'city': this.state.city,
					'area': this.state.area,
					'latitude':this.state.latLng ? this.state.latLng.lat : "",
					'longitude':this.state.latLng ? this.state.latLng.lng : "",
					'pincode': this.state.pincode,
				}
			}
			axios.patch('/api/entitymaster/patch/updateSingleLocation', formValues)
				.then((response) => {
					this.setState({
						'openForm': false,
						'pincodeExists': true,
						'locationID': "",
						'locationTypeVal': '',
						'addressLine1': "",
						'addressLine2': "",
						'department':'',
						'countryCode': "",
						'country': '',
						'stateCode': "",
						'states': '',
						'district': "",
						'city': "",
						'area': "",
						'pincode': "",
						'latLng':"",
					});
					this.props.history.push('/' +this.state.pathname+ '/location-details/' + entityID);
					this.locationDetails();
					$(".swal-text").css("font-family", "sans-serif");
					if(response.data.duplicated === true){
						swal('Location details already exist')
					}else{
						swal('Location details updated successfully.');
					}
					// swal('Location details updated successfully');					
					$("#locationsDetail").validate().resetForm();
					// this.setState({			
					// 	openFormIcon : this.state.openFormIcon === false ? true : false
					// });
				})
				.catch((error) => {

				})
		}else{
			$(event.target).parent().parent().parent().find('.errorinputText.error:first').focus();
		}
	}
	admin(event) {
		event.preventDefault();
		this.props.history.push('/adminDashboard');
	}
	getLocationType() {
		axios.get('/api/locationtypemaster/get/list')
		.then((response) => {
			this.setState({
				locationTypeArry: response.data
			})
		})
		.catch((error) => {

		})
	}

	
	keyPressNumber = (e) => {
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 189]) !== -1 ||
			// Allow: Ctrl+A, Command+A
			(e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
			(e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
			(e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
			// Allow: home, end, left, right, down, up
			(e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode === 189 || e.keyCode === 32) {
			// let it happen, don't do anything
			return;
		}
		// Ensure that it is a number and stop the keypress
		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 58)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode === 190 || e.keyCode === 46)) {
			e.preventDefault();
		}
	}
	OpenModal(event){

	}

	handleChangePlaces = address => {
	    this.setState({ addressLine1 : address});
	};

	handleSelect = address => {

    geocodeByAddress(address)
     .then((results) =>{ 
      for (var i = 0; i < results[0].address_components.length; i++) {
          for (var b = 0; b < results[0].address_components[i].types.length; b++) {
              switch (results[0].address_components[i].types[b]) {
                  case 'sublocality_level_1':
                      var area = results[0].address_components[i].long_name;
                      break;
                  case 'sublocality_level_2':
                      area = results[0].address_components[i].long_name;
                      break;
                  case 'locality':
                      var city = results[0].address_components[i].long_name;
                      break;
                  case 'administrative_area_level_1':
                      var state = results[0].address_components[i].long_name;
                      var stateCode = results[0].address_components[i].short_name;
                      break;
                  case 'administrative_area_level_2':
                      var district = results[0].address_components[i].long_name;
                      break;
                  case 'country':
                     var country = results[0].address_components[i].long_name;
                     var countryCode = results[0].address_components[i].short_name;
                      break; 
                  case 'postal_code':
                     var pincode = results[0].address_components[i].long_name;
                      break;
                  default :
                  		break;
              }
          }
      }

      this.setState({
        area : area,
        city : city,
        district : district,
        states: state,
        country:country,
        pincode: pincode,
        stateCode:stateCode,
        countryCode:countryCode
      })

       
        })
     
      .catch(error => {});

      geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({'latLng': latLng}))
      .catch(error => {});
     
      this.setState({ addressLine1 : address});
  };

  hideModal(event){
    	event.preventDefault();
    	$("html,body").scrollTop(0);
    	var token = $(event.target).attr('token');
    	var idVar = '#exampleModal'+token
    	$(idVar).hide()
    	$(".modal-backdrop").remove();
    	window.location.reload();
    }
     showView(value,event){
    	this.locationDetails();
		$('.viewBtn').removeClass('btnactive');
        $(event.target).addClass('btnactive');
    	this.setState({
    		view : value
    	})
    }

   getDepartment(){
    var entityID = this.props.entityID? this.props.entityID : this.props.match.params.entityID;
    if (entityID && entityID !== '') {
      axios.get('/api/entitymaster/get/one/' + entityID)
      .then((response)=>{
        var departmentArray = response.data[0].departments.map((a,i)=>{
          return{
            _id                    : a._id,
            departmentName         : a.departmentName,
            projectName            : a.projectName,
          }
        })
        this.setState({
          departmentArray : departmentArray,
        })
      })
      .catch(function(error){});
    }
  }

  locationTypeModalClickEvent(){
    $('#locationTypeModalId').addClass('in');
    $('#locationTypeModalId').css('display','block');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }


  addMarker(e){
    this.setState({
      latLng : {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        },
    },()=>{
      axios.get("/api/projectSettings/get/GOOGLE",)
        .then((response) => {
        Geocode.setApiKey(response.data.googleapikey);
        Geocode.fromLatLng(e.latLng.lat(), e.latLng.lng()).then(
          response => {
            const address = response.results[0].address_components;
              for (var i = 0; i < address.length; i++) {
                  for (var b = 0; b < address[i].types.length; b++) {
                      switch (address[i].types[b]) {
                          case 'sublocality_level_1':
                              var area = address[i].long_name;
                              break;
                          case 'sublocality_level_2':
                              area = address[i].long_name;
                              break;
                          case 'locality':
                              var city = address[i].long_name;
                              break;
                          case 'administrative_area_level_1':
                              var state = address[i].long_name;
                              var stateCode = address[i].short_name;
                              break;
                          case 'administrative_area_level_2':
                              var district = address[i].long_name;
                              break;
                          case 'country':
                             var country = address[i].long_name;
                             var countryCode = address[i].short_name;
                              break; 
                          case 'postal_code':
                             var pincode = address[i].long_name;
                              break;
                          default :
                                break;
                      }
                  }
              }
              this.setState({
                addressLine1:response.results[0].formatted_address,
                area : area,
                city : city,
                district : district,
                states: state,
                country:country,
                pincode: pincode,
                stateCode:stateCode,
                countryCode:countryCode
              })
          },
          error => {}
        );
        })
      .catch((error) =>{
          swal(error)
      })
    })
  }


	render() {
		 const searchOptions = {
      // types: ['(cities)'],
      componentRestrictions: {country: "in"}
     }
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
						<section className="content OrgSettingFormWrapper">
							
							<div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
									 {this.state.pathname !="appCompany" ?
					                  <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">{this.state.pathname ? this.state.pathname : "Entity"} Master</h4>
					                  :
					                  <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Organizational Settings</h4>
					  
					                }
									<div title="Go to Admin" className="col-lg-1 col-md-1 col-xs-1 col-sm-1 NOpadding-right">
										{this.props.vendorData ? <div onClick={this.admin.bind(this)} className="redirectToAdmin col-lg-5 col-lg-offset-7 col-md-10 col-xs-10 col-sm-10 fa fa-arrow-right"></div> : null}
									</div>
								</div>

								{!this.props.modal && <div className="nav-center OnboardingTabs col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<ul className="nav nav-pills vendorpills col-lg-10 col-lg-offset-1 col-md-8 col-md-offset-3 col-sm-12 col-xs-12">
											<li className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne  NOpadding-left btn1 disabled">
												<a href={this.props.match.params.entityID ? "/"+this.props.entity+"/basic-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/basic-details"} className="basic-info-pillss pills backcolor">
													<i className="fa fa-info-circle" aria-hidden="true"></i> &nbsp;
													Basic Info
												</a>
												<div className="triangleone " id="triangle-right"></div>
											</li>
											<li className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn2 disabled">
												<div className="triangletwo" id="triangle-right1"></div>
												<a href={this.props.match.params.entityID ? "/"+this.props.entity+"/department-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/department-details"} className="basic-info-pillss pills backcolor">
													<i className="fa fa-info-circle" aria-hidden="true"></i> &nbsp;
													Departments
												</a>
												<div className="triangleone " id="triangle-right"></div>
											</li>
											<li className="active col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls  pdclsOne btn2 ">
												<div className="triangletwo" id="triangle-right1"></div>
												<a href={this.props.match.params.entityID ? "/"+this.props.entity+"/location-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/location-details" } className="basic-info-pillss backcolor">
													<i className="fa fa-map-marker iconMarginLeft" aria-hidden="true"></i> &nbsp;
													Locations
												</a>
												<div className="trianglethree triangleones forActive" id="triangle-right"></div>
											</li>
											<li className="col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab noRightPadding pdcls btn4 disabled">
												<div className="trianglesix" id="triangle-right2"></div>
												<a href={this.props.match.params.entityID ? "/"+this.props.entity+"/contact-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/contact-details"} className="basic-info-pillss backcolor">
													<i className="fa fa-phone phoneIcon" aria-hidden="true"></i> &nbsp;
													Contacts
												</a>
											</li>
										</ul>
									</div>
								}
								<section className="Content">
									<div className="row">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<form id="locationsDetail" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
												<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12">
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<div className="col-lg-6 col-md-6 col-sm-6 col-sm-6 locationTabs">
															<h4 className="MasterBudgetTitle"><i className="fa fa-map-marker" aria-hidden="true"></i> Location Details</h4>
														</div>
														{!this.props.modal && <div className="col-lg-6 col-md-6 col-sm-6 col-sm-6 locationTabs">
															<div className="button4 col-lg-3 pull-right" onClick={this.openForm.bind(this)}>
															{
																this.state.openForm === true ?
																<i className="fa fa-minus-circle" aria-hidden="true"></i>
																:
																<i className="fa fa-plus-circle" aria-hidden="true"></i>
															}   &nbsp;Add Location																
															</div>
														</div>}
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formHrTag"></div>
													</div>
													{
														this.state.openForm === true ?
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" >
																<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Department & Project <sup className="astrick">*</sup></label>
																		<div>
																		<select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 errorinputText" value={this.state.department} ref="department" name="department" id="department" onChange={this.handleChange} required>
																			<option value="" disabled selected>--Select Department--</option>
																			{
																				this.state.departmentArray && this.state.departmentArray.length > 0 ?
																					this.state.departmentArray.map((item, index) => {
																						return (
																							<option key={index} data-attribute={index} value={item.departmentName+" - "+item.projectName}>{item.departmentName+" - "+item.projectName}</option>
																						);
																					})
																					:
																					null
																			}
																		</select>
																			{/* <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"  data-target="#addLocationType" onClick={this.OpenModal.bind(this)} title="Add Location Type" ><i className="fa fa-plus "></i></div>*/}

																	  </div>
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Location Type <sup className="astrick">*</sup></label>
																		<div className={!this.props.modal&& "input-group"} id="locationTypeVal" > 
																			<select className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 errorinputText" value={this.state.locationTypeVal} ref="locationTypeVal" name="locationTypeVal"  onChange={this.handleChange} required>
																				<option value="" disabled>--Select Location Type--</option>
																				{
																					this.state.locationTypeArry && this.state.locationTypeArry.length > 0 ?
																						this.state.locationTypeArry.map((locationtypedata, index) => {
																							return (
																								<option key={index} data-attribute={index}>{locationtypedata.locationType}</option>
																							);
																						})
																						:
																						null
																				}
																			</select>
																			{!this.props.modal&& <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#locationTypeModalId"  onClick={this.locationTypeModalClickEvent.bind(this)} title="Add Location Type" ><i className="fa fa-plus "></i>
                                      										</div>}
																		</div>
																	  </div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Flat No/Block No</label>
																		<input id="Line2" type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.addressLine2} ref="addressLine2" name="addressLine2" onChange={this.handleChange} />
																	</div>
																</div>
																<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																		
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  " >
																			<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Address Line 2 <sup className="astrick">*</sup></label>
																			{/*<input id="addressLine1" type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.addressLine1} ref="addressLine1" name="addressLine1" onChange={this.handleChange} />*/}
																			 <PlacesAutocomplete
									                                        value={this.state.addressLine1}
									                                        onChange={this.handleChangePlaces}
									                                        onSelect={this.handleSelect}
									                                        // searchOptions={searchOptions}
									                                      >
									                                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
									                                          <div>
									                                            <input
									                                              {...getInputProps({
									                                                placeholder: 'Search Address ...',
									                                                className: 'location-search-input col-lg-12 form-control errorinputText',
									                                                id:"addressLine1",
									                                                name:"addressLine1"
									                                              })}
									                                            />
									                                            <div className={this.state.addressLine1 ? "autocomplete-dropdown-container SearchListContainer" : ""}>
									                                              {loading && <div>Loading...</div>}
									                                              {suggestions.map(suggestion => {
									                                                const className = suggestion.active
									                                                  ? 'suggestion-item--active'
									                                                  : 'suggestion-item';
									                                                // inline style for demonstration purpose
									                                                const style = suggestion.active
									                                                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
									                                                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
									                                                return (
									                                                  <div
									                                                    {...getSuggestionItemProps(suggestion, {
									                                                      className,
									                                                      style,
									                                                    })}
									                                                  >
									                                                    <span>{suggestion.description}</span>
									                                                  </div>
									                                                );
									                                              })}
									                                            </div>
									                                          </div>
									                                        )}
									                                      </PlacesAutocomplete>
																		</div>
																	</div>
																	<div className = "col-lg-12 marginTop17">
								                                      <MapContainer address={this.state.addressLine1} latLng={this.state.latLng} addMarker={this.addMarker.bind(this)} />
								                                    </div>
																	<div className="form-margin col-lg-7 col-md-7 col-sm-7 col-xs-7  NOpadding pull-right">
																		{this.props.match.params.entityID || this.props.entityID?
																			
																				this.state.locationID ?
																					<button className="button3  pull-right" onClick={this.updateLocationDetails.bind(this)}>&nbsp;Update Location</button>
																					:
																					<button className="button3 pull-right" onClick={this.locationdetailsAdd.bind(this)}>&nbsp;Submit</button>
																			
																			:
																			null
																		}
																</div>
															</div>
															:
															null
													}
													{!this.props.modal&&<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
														<button className="button2" onClick={this.locationdetailBack.bind(this)}><i className="fa fa-angle-double-left" aria-hidden="true"></i>&nbsp;Department</button>
														<button className="button1 pull-right" onClick={this.locationdetailBtn.bind(this)}>Next&nbsp;<i className="fa fa-angle-double-right" aria-hidden="true"></i></button>
													</div>}
												</div>
											</form>
										</div>
										{!this.props.modal && this.state.locationarray && this.state.locationarray.length > 0	&& <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<div className="col-lg-2 col-md-2 col-sm-6 col-xs-12 textAlignCenter  pull-right">
												<i className="fa fa-th fa-lg btn viewBtn btnactive" name="view" title="Grid View" ref="view" value={this.state.view} onClick={this.showView.bind(this,'Grid')} onChange={this.handleChange} aria-hidden="true"></i>&nbsp;&nbsp;
												<i className="fa fa-th-list fa-lg btn viewBtn " title="List View" name="view" ref="view" value={this.state.view} onClick={this.showView.bind(this,'List')} onChange={this.handleChange} aria-hidden="true"></i>
											</div>
										</div>}

										{this.state.view === 'List' ?
										<div  className="col-lg-12 col-md-12 col-sm-12 col-xs-12 padding30">
											<IAssureTable 
						                      tableHeading={this.state.tableHeading}
						                      dataCount={this.state.entityCount}
						                      tableData={this.state.RecordsTable}
						                      tableObjects={this.state.tableObjects}
						                      getData={this.getData.bind(this)}
						                      id={"id"}
											  tableName={"Company Locations"}
											  refresh={true}
						                    />
					                    </div>
										 :
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											{this.state.locationarray && this.state.locationarray.length > 0 ?
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
													<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 foothd">
														<h4>List of Locations</h4>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" style={{"display" : "block"}}>
														{this.state.locationarray && this.state.locationarray.length > 0 ?
															this.state.locationarray.map((Suppliersdata, index) => {
																return (
																	<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 " key={index}>
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 box_style">
																			<div className=" col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
																				<div className="locationIcon col-lg-10 col-md-10 col-sm-10 col-xs-10 ">
																					<i className="fa fa-map-marker" aria-hidden="true"></i>
																				</div>
																			</div>
																			<ul className="col-lg-10 col-md-10 col-sm-10 col-xs-10 palfclr addrbox">
																				<li><b>{Suppliersdata.locationType}</b></li>
																				<li>{Suppliersdata.addressLine1 ? Suppliersdata.addressLine1+", "+Suppliersdata.addressLine2: Suppliersdata.addressLine2}</li>
																				<li>{Suppliersdata.city ? Suppliersdata.city :""}</li>
																				<li>{Suppliersdata.state ? Suppliersdata.state:""}</li>
																				<li>{Suppliersdata.pincode?Suppliersdata.pincode:""}</li>
																				{Suppliersdata.GSTIN || Suppliersdata.PAN ?
																					<li>
																					<button type="button" className=" showMoreBtn" data-toggle="modal" data-target={"#exampleModal"+index}>
																					  Show More
																					</button>
																					</li> 
																				: null }
																				<div id={"exampleModal"+index} className="modal" role="dialog">
																				  <div className="modal-dialog">

																				    <div className="modal-content col-lg-12">
																				      <div className="modal-header">
																				        <button type="button" className="close" token={index} title="Close" data-dismiss="modal" onClick={this.hideModal.bind(this)}>&times;</button>
																				      </div>
																				      <div className="modal-body">
																				
																				        {Suppliersdata.GSTIN ?
																						<div className="col-md-12">
																						<li className="gst">GSTIN : {Suppliersdata.GSTIN}</li>
																						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																						{
																							Suppliersdata.GSTDocument && Suppliersdata.GSTDocument.length > 0 ?
																								Suppliersdata.GSTDocument.map((doc, i) => {
																									if(('extension',doc.substring(doc.lastIndexOf("."))) === '.pdf'){
																										return (
																											<div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding-left">
																												<a href={doc} title="Click to View" target="_blank">
																													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																														<div title={(doc.substring(doc.lastIndexOf("/"))).replace('/', "")} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos locationDocsImg" id="LogoImageUpOne">
																															<img src={'/images/pdf.png'} className="img-responsive logoStyle" />
																														</div>
																													</div>
																												</a>
																											</div>
																										);
																									}else{
																										return (
																											<div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding-left">
																												<a href={doc} title="Click to View" target="_blank">
																													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																														<div title={(doc.substring(doc.lastIndexOf("/"))).replace('/', "")} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos locationDocsImg" id="LogoImageUpOne">
																															<img src={doc} className="img-responsive logoStyle" />
																														</div>
																													</div>
																												</a>
																											</div>
																										);
																									}
																								})
																								:
																								<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding-left">
																									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom">
																										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos">
																											<img src={"/images/noImagePreview.png"} className="img-responsive logoStyle" />
																										</div>
																									</div>
																								</div>
																						}
																						</div>
																						</div>
																						:
																						null
																						}
																						{Suppliersdata.PAN ?
																						<div className="col-md-12">
																						<li className="pan">PAN : {Suppliersdata.PAN}</li>
																						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																						{
																							Suppliersdata.PANDocument && Suppliersdata.PANDocument.length > 0 ?
																								Suppliersdata.PANDocument.map((doc, i) => {
																									if(('extension',doc.substring(doc.lastIndexOf("."))) === '.pdf'){
																										return (
																											<div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding-left">
																												<a href={doc} title="Click to View" target="_blank">
																													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos locationDocsImg" id="LogoImageUpOne">
																															<img src={'/images/pdf.png'} className="img-responsive logoStyle" />
																														</div>
																													</div>
																												</a>
																											</div>
																										);
																									}else{
																										return (
																											<div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding-left">
																												<a href={doc} title="Click to View" target="_blank">
																													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos locationDocsImg" id="LogoImageUpOne">
																															<img src={doc} className="img-responsive logoStyle" />
																														</div>
																													</div>
																												</a>
																											</div>
																										);
																									}
																								})
																								:
																								<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding-left">
																									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom">
																										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos">
																											<img src={"/images/noImagePreview.png"} className="img-responsive logoStyle" />
																										</div>
																									</div>
																								</div>
																						}
																						</div>
																						</div>
																						:
																						null
																						}
																				        </div>
																				     
																				    </div>
																				     
																				  </div>
																				</div>
																				
																			</ul>
																			<div className=" dropdown col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
																				<div className=" dotsContainerLD col-lg-8 col-md-8 col-sm-8 col-xs-8">
																					<i className="fa fa-ellipsis-h" aria-hidden="true"></i>
																					<div className="dropdown-content dropdown-contentLocation">
																						<ul className="pdcls ulbtm">
																							<li name={index}>
																								<a href={'/' + this.state.pathname + "/location-details/" + this.props.match.params.entityID + "/" + Suppliersdata._id}><i className="fa fa-pencil penmrleft" aria-hidden="true"></i>&nbsp;&nbsp;Edit</a>
																							</li>
																							<li name={index} data-id={Suppliersdata._id} onClick={this.deleteEntity.bind(this)} >
																								{/*<span onClick={this.locationDelete.bind(this)} id={Suppliersdata._id}>*/}
																								<a><i className="fa fa-trash-o" aria-hidden="true"></i> &nbsp; Delete</a>
																							</li>
																						</ul>
																					</div>
																				</div>
																			</div>
																		</div>

																	</div>
																);
															})
															:
															<div className="textAlign">Locations will be shown here.</div>
														}
													</div>
												</div>
												:
												!this.props.modal&&<div className="textAlign">No Locations Found</div>

											}
										</div>
									 }
									</div>
								</section>

							</div>
						</section>
					</div>
				</div>

				{/*Confirm Delete modal*/}
				<div className="modal" id="deleteEntityModal" role="dialog">
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
		         <div className="modal" id="locationTypeModalId" role="dialog">
		            <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
		              <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
		                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
		                      <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getLocationType.bind(this)}>&times;</button>
		                 </div>
		                </div>
		                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                  	<LocationType  
			                  	editId  = 	{this.props.match.params.fieldID} 
			                  	editUrl = 	{
			                  					this.props.match.params.entityID && this.props.match.params.locationID ?
			                  				 	'/'+this.props.url+'/location-details-modal/'+this.props.match.params.entityID+"/"+this.props.match.params.locationID 
			                  				 	:this.props.match.params.entityID ?
			                  				 	'/'+this.props.url+'/location-details-modal/'+this.props.match.params.entityID
			                  				 	:!this.props.modal ?
			                  				 	'/'+this.props.url+'/location-details-modal'
			                  				 	:
			                  				 	'/'+this.props.url
			                  				} 
		                  	/>
		                </div>  
		             </div>
		            </div>
		          </div>
			</div>
		);
	}
}
export default withRouter(LocationDetails);
