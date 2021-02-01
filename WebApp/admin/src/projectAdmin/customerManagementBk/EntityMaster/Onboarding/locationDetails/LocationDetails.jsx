import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import _ from 'underscore';
import 'bootstrap/js/tab.js';
import S3FileUpload from 'react-s3';
class LocationDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			'locationType': '--Select Location Type--',
			'addressLine1': "",
			'locationTypeArry': "",
			'addressLine2': "",
			'countryCode': "",
			'country': "",
			'stateCode': "",
			'state': "",
			'district': "",
			'city': "",
			'area': "",
			'areaCity': "",
			'pincode': "",
			'GSTIN': "",
			'GSTDocument': [],
			'PAN': "",
			'PANDocument': [],
			'indexOneValue': '',
			'uderscoreId': '',
			'locationTypeDisable': true,
			'stateArray': [],
			'districtArray': [],
			'pincodeExists': true,
			'openForm': false,
			'pathname': this.props.match.params.entity,
			'entityID': this.props.match.params ? this.props.match.params.entityID : '',
			'locationID': this.props.match.params ? this.props.match.params.locationID : ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleChangeCountry = this.handleChangeCountry.bind(this);
		this.handleChangeState = this.handleChangeState.bind(this);
		this.handleChangeDistrict = this.handleChangeDistrict.bind(this);
		this.handleChangeBlock = this.handleChangeBlock.bind(this);
		this.camelCase = this.camelCase.bind(this)
	}
	componentDidMount() {
		this.getLocationType();
		this.locationDetails();
		this.edit();
		window.scrollTo(0, 0);
		this.handleChange = this.handleChange.bind(this);
	}
	openForm() {
		this.setState({
			openForm: this.state.openForm == false ? true : false
		}, () => {
			if (this.state.openForm == true) {
				this.validations();
			}
		})
	}
	validations() {
		$.validator.addMethod("regxlocationType", function (value, element, arg) {
			return arg !== value;
		}, "Please select the location type");
		$.validator.addMethod("regxAlphaNum", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Name should only contain letters.");
		$.validator.addMethod("addressLineRegx", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter valid address.");
		$.validator.addMethod("pincodeRegx", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter valid pincode.");
		$.validator.addMethod("regxcountry", function (value, element, arg) {
			return arg !== value;
		}, "Please select the country");
		$.validator.addMethod("regxstate", function (value, element, arg) {
			return arg !== value;
		}, "Please select the state");
		$.validator.addMethod("regxdistrict", function (value, element, arg) {
			return arg !== value;
		}, "Please select the district");
		$.validator.addMethod("regxGSTIN", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter valid GSTIN.");
		$.validator.addMethod("regxPAN", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter valid PAN.");
		$.validator.addMethod("regxCity", function (value, element, regexpr) {
			return regexpr.test(value);
		}, "Please enter valid city name.");

		jQuery.validator.setDefaults({
			debug: true,
			success: "valid"
		});
		$("#locationsDetail").validate({
			rules: {
				locationType: {
					required: true,
					regxlocationType: "--Select Location Type--"
				},
				addressLine1: {
					required: true,
					addressLineRegx: /^[A-Za-z][A-Za-z0-9\-\s]/,
				},
				country: {
					required: true,
					regxcountry: "-- Select --"
				},
				states: {
					required: true,
					regxstate: "-- Select --"
				},
				district: {
					required: true,
					regxdistrict: "-- Select --"
				},
				area: {
					required: true,
					regxAlphaNum: /^[a-zA-Z/\s,.'-/]*$|^$/,
				},
				pincode: {
					required: true,
					pincodeRegx: /^[0-9][0-9\-\s]/,
				},
				GSTIN: {
					required: true,
					regxGSTIN: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
				},
				PAN: {
					required: true,
					regxPAN: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
				},
				city: {
					regxCity: /^[a-zA-Z]+$/,
				}
			},
			errorPlacement: function (error, element) {
				if (element.attr("name") == "locationType") {
					error.insertAfter("#locationType");
				}
				if (element.attr("name") == "addressLine1") {
					error.insertAfter("#addressLine1");
				}
				if (element.attr("name") == "country") {
					error.insertAfter("#country");
				}
				if (element.attr("name") == "states") {
					error.insertAfter("#states");
				}
				if (element.attr("name") == "district") {
					error.insertAfter("#district");
				}
				if (element.attr("name") == "pincode") {
					error.insertAfter("#pincode");
				}
				if (element.attr("name") == "GSTIN") {
					error.insertAfter("#GSTIN");
				}
				if (element.attr("name") == "PAN") {
					error.insertAfter("#PAN");
				}
				if (element.attr("name") == "city") {
					error.insertAfter("#city");
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

		if (name == 'area') {
			var currentVal = event.currentTarget.value;
			if (currentVal.match('[a-zA-Z ]+')) {
				this.setState({
					[name]: event.target.value
				});
			} else {
				this.setState({
					[name]: ''
				});
			}
		}
	}
	handleChangeCountry(event) {
		const target = event.target;
		this.setState({
			[event.target.name]: event.target.value
		});
		this.getStates(event.target.value.split('|')[0])
	}
	getStates(StateCode) {
		axios.get("http://locations2.iassureit.com/api/states/get/list/" + StateCode)
			.then((response) => {
				this.setState({
					stateArray: response.data
				})
				$('#Statedata').val(this.state.states);
			})
			.catch((error) => {
			})
	}
	handleChangeState(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
		const target = event.target;
		const stateCode = $(target).val();
		const countryCode = $("#country").val();

		this.getDistrict(stateCode, countryCode);

	}
	getDistrict(stateCode, countryCode) {
		axios.get("http://locations2.iassureit.com/api/districts/get/list/" + countryCode + "/" + stateCode)
			.then((response) => {
				this.setState({
					districtArray: response.data
				})
				$('#Citydata').val(this.state.city);
			})
			.catch((error) => {
			})
	}
	handleChangeDistrict(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
		// const target = event.target;
		// const districtName = $(target).val();
		// const stateCode = $('#Statedata').val();
		// const countryCode = $("#country").val();
		// this.getBlocks(districtName, stateCode, countryCode);
	}
	handleChangeBlock(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
		const target = event.target;
		const blockName = $(target).val();
		const districtName = $('#Citydata').val();
		const stateCode = $('#Statedata').val();
		const countryCode = $("#country").val();
		this.getAreas(blockName, districtName, stateCode, countryCode);
	}
	getBlocks(districtName, stateCode, countryCode) {
		axios.get("http://locations2.iassureit.com/api/blocks/get/list/" + countryCode + '/' + stateCode + "/" + districtName)
			.then((response) => {
				this.setState({
					blocksArray: response.data
				})
				$('#Blocksdata').val(this.state.block);
			})
			.catch((error) => {
			})
	}
	getAreas(blockName, districtName, stateCode, countryCode) {
		axios.get("http://locations2.iassureit.com/api/areas/get/list/" + countryCode + '/' + stateCode + "/" + districtName + '/' + blockName + '/Pune city')
			.then((response) => {
				this.setState({
					areasArray: response.data
				})
				$('#Areasdata').val(this.state.area);
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
	locationdetailBack(event) {
		event.preventDefault();
		var entityID = this.props.match.params.entityID;

		if (this.state.openForm == true) {
			swal({
				// title: 'abc',
				text: "It seem that you are trying to enter a location. Click 'Cancel' to continue entering location. Click 'Ok' to go to next page. But you may lose values if already entered in the location form",
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
							this.props.history.push("/" + this.state.pathname + "/basic-details/" + entityID);
						} else {
							this.props.history.push("/" + this.state.pathname + "/basic-details");
						}
					} else {
						this.props.history.push("/" + this.state.pathname + "/location-details/" + entityID);
					}
				})
			$(".OkButtonSwal").parents('.swal-button-container').addClass('postionSwalRight');
			$(".CancelButtonSwal").parents('.swal-button-container').addClass('postionSwalLeft');

		} else {
			if (entityID) {
				this.props.history.push("/" + this.state.pathname + "/basic-details/" + entityID);
			} else {
				this.props.history.push("/" + this.state.pathname + "/basic-details");
			}
		}
	}
	locationdetailsAdd(event) {
		event.preventDefault();
		var entityID = this.props.match.params.entityID;
		console.log("loc entity id",entityID);
		if ($('#locationsDetail').valid() && this.state.pincodeExists) {
			var formValues = {
				'entityID': entityID,
				'locationDetails': {
					'locationType': this.state.locationType,
					'addressLine1': this.state.addressLine1,
					'addressLine2': this.state.addressLine2,
					'countryCode' : this.state.country.split("|")[0],
					'country'     : this.state.country.split("|")[1],
					'stateCode'   : this.state.states.split("|")[0],
					'state'       : this.state.states.split("|")[1],
					'district'    : this.state.district,
					'city'        : this.state.city,
					'areaCity'    : this.state.area+ "," +this.state.city,
					'area'        : this.state.area,
					'pincode'     : this.state.pincode,
					'GSTIN'       : this.state.GSTIN,
					'GSTDocument' : this.state.GSTDocument,
					'PAN'         : this.state.PAN,
					'PANDocument' : this.state.PANDocument,
				}
			}
			axios.patch('/api/entitymaster/patch/addLocation', formValues)
				.then((response) => {
					$('.inputText').val('');
					this.setState({
						'openForm': false,
						'locationType': '--Select Location Type--',
						'addressLine1': "",
						'addressLine2': "",
						'countryCode': "",
						'country': '-- Select --',
						'stateCode': "",
						'state': '-- Select --',
						'district': "",
						'city': "",
						'area': "",
						'pincode': "",
						'GSTIN': "",
						'GSTDocument': [],
						'PAN': "",
						'PANDocument': [],
					});
					this.locationDetails();
					swal('Location details added successfully.');
					$("#locationsDetail").validate().resetForm();
				})
				.catch((error) => {

				})
		}
	}
	locationdetailBtn(event) {
		event.preventDefault();
		var entityID = this.props.match.params.entityID;
		if (this.state.openForm == true) {
			swal({
				// title: 'abc',
				text: "It seem that you are trying to enter a location. Click 'Cancel' to continue entering location. Click 'Ok' to go to next page. But you may lose values if already entered in the location form",
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
						this.props.history.push("/" + this.state.pathname + "/contact-details/" + entityID);
					} else {
						this.props.history.push("/" + this.state.pathname + "/location-details/" + entityID);
					}
				})
			$(".OkButtonSwal").parents('.swal-button-container').addClass('postionSwalRight');
			$(".CancelButtonSwal").parents('.swal-button-container').addClass('postionSwalLeft');

		} else {
			this.props.history.push("/" + this.state.pathname + "/contact-details/" + entityID);
		}
	}
	componentWillReceiveProps(props) {
		this.edit();
	}
	edit() {
		var entityID = this.state.entityID;
		var locationID = this.state.locationID;
		if (locationID) {
			axios.get('/api/entitymaster/get/one/' + entityID)
				.then((response) => {
					var editData = response.data.locations.filter((a) => a._id == locationID);
					this.getStates(editData[0].countryCode);
					this.getDistrict(editData[0].stateCode, editData[0].countryCode);
					this.getBlocks(editData[0].district, editData[0].stateCode, editData[0].countryCode);
					this.setState({
						'openForm': true,
						'locationType': editData[0].locationType,
						'addressLine1': editData[0].addressLine1,
						'addressLine2': editData[0].addressLine2,
						'country': editData[0].countryCode + '|' + editData[0].country,
						'states': editData[0].stateCode + '|' + editData[0].state,
						'district': editData[0].district,
						'city': editData[0].city,
						'area': editData[0].area,
						'pincode': editData[0].pincode,
						'GSTIN': editData[0].GSTIN,
						'GSTDocument': editData[0].GSTDocument,
						'PAN': editData[0].PAN,
						'PANDocument': editData[0].PANDocument,
					}, () => {
						if (this.state.openForm == true) {
							this.validations();
						}
					})
				})
				.catch((error) => {
				})
		}
	}
	locationDetails() {
		var route = this.props.match.params.entityID;
		axios.get('/api/entitymaster/get/one/' + this.props.match.params.entityID)
			.then((response) => {
				this.setState({
					locationarray: response.data.locations
				})
			})
			.catch((error) => {
			})
		return [];
	}
	locationDelete(event) {
		event.preventDefault();
		var entityID = this.state.entityID;
		var locationID = event.target.id;
		var formValues = {
			entityID: entityID,
			locationID: locationID
		}
		axios.delete('/api/entitymaster/deleteLocation/' + entityID + "/" + locationID)
			.then((response) => {
				this.setState({
					'openForm': false,
					'locationID': "",
					'locationType': '--Select Location Type--',
					'addressLine1': "",
					'addressLine2': "",
					'countryCode': "",
					'country': '-- Select --',
					'stateCode': "",
					'states': '-- Select --',
					'district': "",
					'city': "",
					'area': "",
					'pincode': "",
					'GSTIN': "",
					'GSTDocument': [],
					'PAN': "",
					'PANDocument': [],
				});
				this.props.history.push('/' + this.state.pathname + '/location-details/' + entityID);
				this.locationDetails();
				swal('Location deleted successfully.');
			})
			.catch((error) => {
			})
	}
	updateLocationDetails(event) {
		event.preventDefault();
		var entityID = this.props.match.params.entityID;
		var locationID = this.props.match.params.locationID;
		if ($('#locationsDetail').valid() && this.state.pincodeExists) {
			var formValues = {
				'entityID': entityID,
				'locationID': locationID,
				'locationDetails': {
					'locationType': this.state.locationType,
					'addressLine1': this.state.addressLine1,
					'addressLine2': this.state.addressLine2,
					'countryCode': this.state.country.split("|")[0],
					'country': this.state.country.split("|")[1],
					'stateCode': this.state.states.split("|")[0],
					'state': this.state.states.split("|")[1],
					'district': this.state.district,
					'city': this.state.city,
					'area': this.state.area,
					'pincode': this.state.pincode,
					'GSTIN': this.state.GSTIN,
					'GSTDocument': this.state.GSTDocument,
					'PAN': this.state.PAN,
					'PANDocument': this.state.PANDocument,
				}
			}
			axios.patch('/api/entitymaster/patch/updateSingleLocation', formValues)
				.then((response) => {
					this.setState({
						'openForm': false,
						'locationID': "",
						'locationType': '--Select Location Type--',
						'addressLine1': "",
						'addressLine2': "",
						'countryCode': "",
						'country': '-- Select --',
						'stateCode': "",
						'states': '-- Select --',
						'district': "",
						'city': "",
						'area': "",
						'pincode': "",
						'GSTIN': "",
						'GSTDocument': [],
						'PAN': "",
						'PANDocument': [],
					});
					this.props.history.push('/' + this.state.pathname + '/location-details/' + entityID);
					this.locationDetails();
					swal('Location details updated successfully');
					$("#locationsDetail").validate().resetForm();
				})
				.catch((error) => {

				})
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
	handlePincode(event) {
		event.preventDefault();
		this.setState({
			[event.target.name]: event.target.value
		})
		if (event.target.value != '') {
			axios.get("https://api.postalpincode.in/pincode/" + event.target.value)
				.then((response) => {
					if ($("[name='pincode']").valid()) {

						if (response.data[0].Status == 'Success') {
							this.setState({ pincodeExists: true })
						} else {
							this.setState({ pincodeExists: false })
						}
					} else {
						this.setState({ pincodeExists: true })
					}

				})
				.catch((error) => {
				})
		} else {
			this.setState({ pincodeExists: true })
		}
	}
	GSTINBrowse(event) {
		event.preventDefault();
		var GSTDocument = [];
		if (event.currentTarget.files && event.currentTarget.files[0]) {
			for (var i = 0; i < event.currentTarget.files.length; i++) {
				var file = event.currentTarget.files[i];

				if (file) {
					var fileName = file.name;
					var ext = fileName.split('.').pop();
					if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "pdf" || ext === "JPG" || ext === "PNG" || ext === "JPEG" || ext === "PDF") {
						if (file) {
							var objTitle = { fileInfo: file }
							GSTDocument.push(objTitle);

						} else {
							swal("Images not uploaded");
						}//file
					} else {
						swal("Allowed images formats are (jpg,png,jpeg)");
					}//file types
				}//file
			}//for 

			if (event.currentTarget.files) {
				main().then(formValues => {
					var GSTDocument = this.state.GSTDocument;
					for (var k = 0; k < formValues.length; k++) {
						GSTDocument.push(formValues[k].GSTDocument)
					}

					this.setState({
						GSTDocument: GSTDocument
					})
				});

				async function main() {
					var formValues = [];
					for (var j = 0; j < GSTDocument.length; j++) {
						var config = await getConfig();
						var s3url = await s3upload(GSTDocument[j].fileInfo, config, this);
						const formValue = {
							"GSTDocument": s3url,
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
	PANBrowse(event) {
		event.preventDefault();
		var PANDocument = [];
		if (event.currentTarget.files && event.currentTarget.files[0]) {
			for (var i = 0; i < event.currentTarget.files.length; i++) {
				var file = event.currentTarget.files[i];

				if (file) {
					var fileName = file.name;
					var ext = fileName.split('.').pop();
					if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "pdf" || ext === "JPG" || ext === "PNG" || ext === "JPEG" || ext === "PDF") {
						if (file) {
							var objTitle = { fileInfo: file }
							PANDocument.push(objTitle);

						} else {
							swal("Images not uploaded");
						}//file
					} else {
						swal("Allowed images formats are (jpg,png,jpeg)");
					}//file types
				}//file
			}//for 

			if (event.currentTarget.files) {
				main().then(formValues => {
					var PANDocument = this.state.PANDocument;
					for (var k = 0; k < formValues.length; k++) {
						PANDocument.push(formValues[k].PANDocument)
					}

					this.setState({
						PANDocument: PANDocument
					})
				});

				async function main() {
					var formValues = [];
					for (var j = 0; j < PANDocument.length; j++) {
						var config = await getConfig();
						var s3url = await s3upload(PANDocument[j].fileInfo, config, this);
						const formValue = {
							"PANDocument": s3url,
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
	deleteGSTIN(event) {
		event.preventDefault();
		var GSTDocument = this.state.GSTDocument;
		const index = GSTDocument.indexOf(event.target.id);
		if (index > -1) {
			GSTDocument.splice(index, 1);
		}
		this.setState({
			GSTDocument: GSTDocument
		})
	}
	getLocationType() {
		axios.post('/api/locationtype/get/list')
		.then((response) => {
			this.setState({
				locationTypeArry: response.data
			})
		})
		.catch((error) => {
			
		})
	}
	deletePAN(event) {
		event.preventDefault();
		var PANDocument = this.state.PANDocument;
		const index = PANDocument.indexOf(event.target.id);
		if (index > -1) {
			PANDocument.splice(index, 1);
		}
		this.setState({
			PANDocument: PANDocument
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
	render() {
		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div className="row">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
						<section className="content">
							<div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
									<h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">{this.state.pathname ? this.state.pathname : "Entity"} Master</h4>
									<div title="Go to Admin" className="col-lg-1 col-md-1 col-xs-1 col-sm-1 NOpadding-right">
										{this.props.vendorData ? <div onClick={this.admin.bind(this)} className="redirectToAdmin col-lg-5 col-lg-offset-7 col-md-10 col-xs-10 col-sm-10 fa fa-arrow-right"></div> : null}
									</div>
								</div>

								<div className="nav-center OnboardingTabs col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<ul className="nav nav-pills vendorpills col-lg-8 col-lg-offset-3 col-md-8 col-md-offset-3 col-sm-12 col-xs-12">
										<li className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn1 disabled">
											<a href="" className="basic-info-pillss pills backcolor">
												<i className="fa fa-info-circle" aria-hidden="true"></i> &nbsp;
												Basic Info
                                           </a>
											<div className="triangleone " id="triangle-right"></div>
										</li>
										<li className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn1 disabled">
											<a href="/client/department" className="basic-info-pillss pills backcolor">
												<i className="fa fa-info-circle" aria-hidden="true"></i> &nbsp;
												Department
                                           </a>
											<div className="triangleone " id="triangle-right"></div>
										</li>
										<li className="active col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn2 ">
											<div className="triangletwo" id="triangle-right1"></div>
											<a href="" className="basic-info-pillss backcolor">
												<i className="fa fa-map-marker iconMarginLeft" aria-hidden="true"></i> &nbsp;
												Location
                                            </a>
											<div className="trianglethree triangleones forActive" id="triangle-right"></div>
										</li>
										<li className="col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab noRightPadding pdcls btn4 disabled">
											<div className="trianglesix" id="triangle-right2"></div>
											<a href="/client/contact-details/client/department" className="basic-info-pillss backcolor">
												<i className="fa fa-phone phoneIcon" aria-hidden="true"></i> &nbsp;
												Contact
                                           </a>
										</li>
									</ul>
								</div>
								<section className="Content">
									<div className="row">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<form id="locationsDetail" className="" >
												<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12">
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														<div className="col-lg-6 col-md-6 col-sm-6 col-sm-6 locationTabs">
															<h4 className="MasterBudgetTitle"><i className="fa fa-map-marker" aria-hidden="true"></i> Location Details</h4>
														</div>
														<div className="col-lg-6 col-md-6 col-sm-6 col-sm-6 locationTabs">
															<div className="button4  pull-right" onClick={this.openForm.bind(this)}>
																<i className="fa fa-plus" aria-hidden="true"></i>&nbsp;Add Location
</div>
														</div>
														<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formHrTag"></div>
													</div>
													{
														this.state.openForm == true ?
															<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" >
																<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Location Type <sup className="astrick">*</sup></label>
																		<select id="locationType" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.locationType} 
																		         ref="locationType" name="locationType" onChange={this.handleChange}>
																			<option disabled>--Select Location Type--</option>
																			{
																				this.state.locationTypeArry && this.state.locationTypeArry.length > 0 ?
																				this.state.locationTypeArry.map((locationtypedata, index) => {
																					return (
																						<option key={index}>{locationtypedata.locationType}</option>
																					);
																				})
																				:
																				null
																			}
																		</select>
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Address Line 1 <sup className="astrick">*</sup></label>
																		<input id="addressLine1" type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.addressLine1} ref="addressLine1" name="addressLine1" onChange={this.handleChange} />
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Address Line 2</label>
																		<input id="Line2" type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.addressLine2} ref="addressLine2" name="addressLine2" onChange={this.handleChange} />
																	</div>
																</div>
																<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Country <sup className="astrick">*</sup>
																		</label>
																		<select id="country" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
																			ref="country" name="country" value={this.state.country} onChange={this.handleChangeCountry} >
																			<option selected={true}>-- Select --</option>
																			<option value="IN|India">India</option>
																		</select>
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">State <sup className="astrick">*</sup> {this.props.typeOption == 'Local' ? <sup className="astrick">*</sup> : null}
																		</label>
																		<select id="states" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
																			ref="states" value={this.state.states} name="states" onChange={this.handleChangeState} >
																			<option >-- Select --</option>
																			{
																				this.state.stateArray && this.state.stateArray.length > 0 ?
																					this.state.stateArray.map((stateData, index) => {
																						return (
																							<option key={index} value={stateData.stateCode + "|" + stateData.stateName}>{this.camelCase(stateData.stateName)}</option>
																						);
																					}
																					) : ''
																			}
																		</select>

																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">District <sup className="astrick">*</sup> {this.props.typeOption == 'Local' ? <sup className="astrick">*</sup> : null}
																		</label>
																		<select id="district" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
																			ref="district" name="district" value={this.state.district} onChange={this.handleChangeDistrict} >
																			<option>-- Select --</option>
																			{
																				this.state.districtArray && this.state.districtArray.length > 0 ?
																					this.state.districtArray.map((districtdata, index) => {
																						return (
																							<option key={index} value={districtdata.districtName}>{this.camelCase(districtdata.districtName)}</option>
																						);
																					}
																					) : ''
																			}
																		</select>
																	</div>
																</div>
																<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">City <sup className="astrick">*</sup>
																		</label>
																		<input type="text" id="city" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.city} ref="city" name="city" onChange={this.handleChange} />
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Area <sup className="astrick"></sup></label>
																		<input type="text" id="area" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.area} ref="area" name="area" onChange={this.handleChange} />
																	</div>
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Pincode <sup className="astrick">*</sup>
																		</label>
																		<input maxLength="6" onChange={this.handlePincode.bind(this)} type="text" id="pincode" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.pincode} ref="pincode" name="pincode" onKeyDown={this.keyPressNumber.bind(this)} />
																		{this.state.pincodeExists ? null : <label style={{ color: "red", fontWeight: "100" }}>This pincode does not exists!</label>}
																	</div>
																</div>
																<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
																	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">GSTIN <sup className="astrick">*</sup>
																			<a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="Eg. 29ABCDE1234F1Z5" className="fa fa-question-circle"></i> </a>
																		</label>
																		<input type="text" id="GSTIN" placeholder="29ABCDE1234F1Z5" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.GSTIN} ref="GSTIN" name="GSTIN" onChange={this.handleChange} />
																	</div>
																	<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpadding">
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
																			<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">GSTIN Document (jpg, jpeg, png, pdf)</label>
																		</div>
																		<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 NOpadding">
																			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="hide">
																				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
																					<div><i className="fa fa-upload"></i> <br /></div>
																					<input multiple onChange={this.GSTINBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="GSTDocument" />
																				</div>
																			</div>
																		</div>
																		{
																			this.state.GSTDocument && this.state.GSTDocument.length > 0 ?
																				this.state.GSTDocument.map((doc, i) => {
																					return (
																						<div key={i} className=" col-lg-2 col-md-2 col-sm-12 col-xs-12">
																							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																								<label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={doc} onClick={this.deleteGSTIN.bind(this)}>x</label>
																								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
																									<img src={doc} className="img-responsive logoStyle" />
																								</div>
																							</div>
																						</div>
																					);
																				})
																				:
																				null
																		}
																	</div>
																	<div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                            <div className="border col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
                                                                        </div>
																	<div className=" form-margin col-lg-4 col-md-4 col-sm-12 col-xs-12  " >
																		<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">PAN  <sup className="astrick">*</sup>
																			<a data-tip data-for='basicInfo4Tooltip' className="pull-right"> <i title="Eg. ABCDE1234E" className="fa fa-question-circle"></i> </a>
																		</label>
																		<input type="text" id="PAN" placeholder="ABCDE1234E" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.PAN} ref="PAN" name="PAN" onChange={this.handleChange} />
																	</div>


																	<div className="form-margin col-lg-6 col-md-6 col-sm-12 col-xs-12 NOpadding">
																		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
																			<label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">PAN Document (jpg, jpeg, png, pdf)</label>
																		</div>
																		<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
																			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" id="hide">
																				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
																					<div><i className="fa fa-upload"></i> <br /></div>
																					<input multiple onChange={this.PANBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="PANDocument" />
																				</div>
																			</div>
																		</div>
																		{
																			this.state.PANDocument && this.state.PANDocument.length > 0 ?
																				this.state.PANDocument.map((doc, i) => {
																					return (
																						<div key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
																							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
																								<label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={doc} onClick={this.deletePAN.bind(this)}>x</label>
																								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
																									<img src={doc} className="img-responsive logoStyle" />
																								</div>
																							</div>
																						</div>
																					);
																				})
																				:
																				null
																		}
																	</div>
																</div>
																<div className="col-lg-7 col-md-7 col-sm-7 col-xs-7   pull-right">

																	{
																		this.state.locationID ?
																			<button className="button3  pull-right" onClick={this.updateLocationDetails.bind(this)}>&nbsp;Update Location</button>
																			:
																			<button className="button3 pull-right" onClick={this.locationdetailsAdd.bind(this)}>&nbsp;Submit</button>
																	}
																</div>

															</div>
															:
															null
													}
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
														<button className="button2" onClick={this.locationdetailBack.bind(this)}><i className="fa fa-angle-double-left" aria-hidden="true"></i>&nbsp;Basic Info</button>
														<button className="button1 pull-right" onClick={this.locationdetailBtn.bind(this)}>Next&nbsp;<i className="fa fa-angle-double-right" aria-hidden="true"></i></button>
													</div>
												</div>
											</form>
										</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											{this.state.locationarray && this.state.locationarray.length > 0 ?
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
													<div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 foothd">
														<h4 className="MasterBudgetTitle">Location Details</h4>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
														{this.state.locationarray && this.state.locationarray.length > 0 ?
															this.state.locationarray.map((Suppliersdata, index) => {
																return (
																	<div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-12 boxul1" key={index}>
																		<div className="liheader1 col-lg-1 col-md-1 col-sm-1 col-xs-1">
																			<i className="fa fa-map-marker" aria-hidden="true"></i>
																		</div>
																		<ul className="col-lg-10 col-md-10 col-sm-10 col-xs-10 palfclr addrbox">
																			<li>{Suppliersdata.locationType}</li>
																			<li>{Suppliersdata.addressLine1} , {Suppliersdata.addressLine2}</li>
																			<li>{Suppliersdata.city},{Suppliersdata.states} {Suppliersdata.pincode}</li>
																		</ul>
																		<div className="liheader1 dropdown col-lg-1 col-md-1 col-sm-1 col-xs-1">
																			<i className="fa fa-ellipsis-h dropbtn" aria-hidden="true"></i>
																			<div className="dropdown-content dropdown-contentLocation">
																				<ul className="pdcls ulbtm">
																					<li name={index}>
																						<a href={'/' + this.state.pathname + "/location-details/" + this.props.match.params.entityID + "/" + Suppliersdata._id}><i className="fa fa-pencil penmrleft" aria-hidden="true"></i>&nbsp;&nbsp;Edit</a>
																					</li>
																					<li name={index}>
																						<span onClick={this.locationDelete.bind(this)} id={Suppliersdata._id}><i className="fa fa-trash-o" aria-hidden="true"></i> &nbsp; Delete</span>
																					</li>
																				</ul>
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
												null
											}
										</div>
									</div>
								</section>

							</div>
						</section>
					</div>
				</div>
			</div>
		);
	}
}
export default LocationDetails;
