import React, { Component } from 'react';
import { render }           from 'react-dom';
import $                    from "jquery";
import swal                 from 'sweetalert';
import S3FileUpload         from 'react-s3';
import axios                from 'axios';
import AddFilePublic        from "../../AddFilePublic/AddFilePublic.js";
import jQuery from 'jquery';
import IAssureTable         from '../../../coreadmin/IAssureTable/IAssureTable.jsx';
import OneFieldForm         from '../../../coreadmin/Master/OneFieldForm/OneFieldForm.js';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import RecorderType         from '../../Master/RecorderType/RecorderType.js';
import Brands               from '../../Master/Brands/Brands.js';
import MaxChannels          from '../../Master/MaxChannels/MaxChannels.js';
import MapContainer         from '../../Map/MapContainer.js';
import Geocode              from "react-geocode";
import BasicInfo            from '../../ClientMaster/ClientBasicInfo.js';
import LocationDetails      from '../../ClientMaster/ClientLocationDetails.js';
import DepartmentDetails    from '../../ClientMaster/ClientDepartmentDetails.js';
// import '../css/recordingLocation.css';


// import MyMap from '/imports/admin/map/MyMap.js'; 

export default class AddEditRecordingLocation extends Component{
  constructor(props) {
    super(props);
    this.state = {
            imgs                      :[],
            stateArray                :[],
            clientArray               :[],
            projectArray              :[],
            siteArray                 :[],
            recorderTypeArray         :[],
            brandArray                :[],
            maxChannelsArray          :[],
            clientName                : '--Select--',   
            department                : '--Select--',   
            siteName                  : '--Select--',
            locationName              : '',
            client_id                 :  '',
            recordingLocAddress       : '', 
            recorderType              : '--Select--',
            brandVal                  : '--Select--',
            maxchannelsVal            : '--Select--',
            country                   : '',
            states                    : '',
            city                      : '',
            area                      : '',
            pincode                   : '',
            images                    : [],
            recordingLocLatitude      : '',
            recordingLocLongitude     : '',
            editId                    : props.match && props.match.params ? props.match.params.id : '',
            latLng                    :{lat:null,lng:null},
            'pincodeExists'           : true,
    };
      this.handleChange              = this.handleChange.bind(this);
      this.handleChangeCountry       = this.handleChangeCountry.bind(this);
      this.handleChangeState         = this.handleChangeState.bind(this);
  }

  componentDidMount(){
    this.getStates();
    this.getClientName();
    this.getRecorderType();
    this.getRecorderBrand();
    this.getmaxChannels();

    var editId = this.props.match && this.props.match.params.id;
    if(editId){     
      this.edit(editId);
    }
  
    $.validator.addMethod("regxA1", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter Recording Location");

    $.validator.addMethod("regxA4", function (value, element, arg) {
       return arg !== value;
    }, "Please Select Recorder Type");
    
     $.validator.addMethod("regxA2", function (value, element, arg) {
      return arg !== value;
    }, "Please Select Max  Channels");

     $.validator.addMethod("regxA3", function (value, element, arg) {
       return arg !== value;
    }, "Please Select Brand");

     $.validator.addMethod("regxA5", function (value, element, arg) {
      return arg !== value;
    }, "Please Select Client Name");

     $.validator.addMethod("regxA6", function (value, element, arg) {
     return arg !== value;
    }, "Please Select Project Name");
    
     $.validator.addMethod("regxA7", function (value, element, arg) {
      return arg !== value;
    }, "Please Select Site Name");
 
     jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    $("#recordform").validate({
      rules: {
        locationName: {
          required: true,
          regxA1: /^[A-Za-z][A-Za-z0-9\-\s]/,
        },
        recorderTypeVal: {
          required: true,
          regxA4: "--Select--"
        },
        maxchannelsVal: {
          required: true,
          regxA2: "--Select--"
        },
        brandVal: {
          required: true,
          regxA3: "--Select--"
        },
        
         clientName: {
          required: true,
          regxA5: "--Select--",
        },
         department: {
          required: true,
          regxA6: "--Select--",
        },
        siteName: {
          required: true,
          regxA7: "--Select--",
        },
        addressLine1:{
          required:true
        },
        addressLine2:{
          // required:true
        },
        pincode:{
          required:true
        }
        
       
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") == "locationName") {
          error.insertAfter("#locationName");
        }
        if (element.attr("name") == "recorderTypeVal") {
          error.insertAfter("#recorderTypeVal");
        }
        if (element.attr("name") == "maxchannelsVal") {
          error.insertAfter("#maxchannelsVal");
        }
        if (element.attr("name") == "brandVal") {
          error.insertAfter("#brandVal");
        }
        if (element.attr("name") == "clientName") {
          error.insertAfter("#client_id_err");
        }
        if (element.attr("name") == "department") {
          error.insertAfter("#department_details_err");
        }
        if (element.attr("name") == "siteName") {
          error.insertAfter("#location_err");
        }
        if (element.attr("name") == "addressLine1") {
          error.insertAfter("#addressLine1");
        } 
        if (element.attr("name") == "addressLine2") {
          error.insertAfter("#addressLine2");
        } 
        if (element.attr("pincode") == "pincode") {
          error.insertAfter("#pincode");
        }
      }
    });
     
  }

   handleChange(event){
    const target = event.target;
    const name   = target.name;
    if(name==='clientName'){
      var e = document.getElementById("clientName");
      var client_id = e.options[e.selectedIndex].id;
      var client = this.state.clientArray.find((elem)=>{return elem._id===client_id})
      this.setState({
        client_id    : client_id,
        departmentArray : client.departments,
        siteArray    : client.locations
      })
    }
    this.setState({
      [name]: event.target.value,
    });
  }

  setDropdowns(){
   axios.get('/api/entitymaster/get/one/'+this.state.client_id)
   .then(res=>{
     this.setState({
        departmentsArray  : res.data[0].departments,
        siteArray         : res.data[0].locations,
        contactPersonArray: res.data[0].contactData,
      })  
   })
   .catch(err=>{})
  }

   edit(id){
    axios({
      method: 'get', 
      url: '/api/recordinglocation/get/one/'+id,
    }).then((response)=> {
      var editData = response.data;  
      var client = this.state.clientArray.find((elem)=>{return elem._id===editData.client_id})
      this.setState({
        departmentArray  : client.departments,
        siteArray     : client.locations
      })
      this.setState({
        "clientName"                : editData.clientName,
        "client_id"                 : editData.client_id,  
        "department"                : editData.department,
        "project"                   : editData.project,
        "siteName"                  : editData.siteName,
        "locationName"              : editData.locationName,
        "recordingLocAddress"       : editData.recordingLocAddress,
        "country"                   : editData.country,
        "images"                    : editData.images,
        "recorderTypeVal"           : editData.recorderType,
        "brandVal"                  : editData.brand,
        "maxchannelsVal"               : editData.maxchannels,
        "addressLine1"              : editData.address[0].addressLine1,
        "addressLine2"              : editData.address[0].addressLine2,
        "landmark"                  : editData.address[0].landmark,
        area                        : editData.address[0].area,
        city                        : editData.address[0].city,
        district                    : editData.address[0].district,
        stateCode                   : editData.address[0].stateCode,
        states                      : editData.address[0].state,
        countryCode                 : editData.address[0].countryCode,
        country                     : editData.address[0].country,
        pincode                     : editData.address[0].pincode,
        latLng                      : {
                                        lat : editData.address[0].latitude,
                                        lng : editData.address[0].longitude,
                                      }    
      });
     }).catch(function (error) {
    });
  }
   componentWillReceiveProps(nextProps){
    if(nextProps){
      this.setState({
        clientName:nextProps.clientName,
        client_id:nextProps.client_id,
      },()=>{
        if(nextProps.client_id && nextProps.client_id!==""){
          var client = this.state.clientArray.find((elem)=>{return elem._id===nextProps.client_id})
          this.setState({
            client_id    : nextProps.client_id,
            departmentArray : client.departments,
            siteArray    : client.locations
          })
        }
      })
      var editId = nextProps.match && nextProps.match.params.id;
      if(nextProps.match && nextProps.match.params.id){
        this.setState({
          editId : editId
        },()=>{
          this.edit(this.state.editId);
        })
      }
    }
  }
 
  handleSubmit(event){
    event.preventDefault()
    if ($('#recordform').valid()) {
    var formValues = {
            clientName                : this.state.clientName,   
            client_id                 : this.state.client_id,   
            department                : this.state.department.split("-")[0],   
            project                   : this.state.department.split("-")[1],   
            siteName                  : this.state.siteName,
            locationName              : this.state.locationName,
            recorderType              : this.state.recorderTypeVal,
            brand                     : this.state.brandVal,
            maxchannels               : this.state.maxchannelsVal,
            images                    : this.state.images,
            address                   : {
                                                addressLine1    : this.state.addressLine1,
                                                addressLine2    : this.state.addressLine2,
                                                landmark        : this.state.landmark,
                                                area            : this.state.area,
                                                city            : this.state.city,
                                                district        : this.state.district,
                                                stateCode       : this.state.stateCode,
                                                state           : this.state.states,
                                                countryCode     : this.state.countryCode,
                                                country         : this.state.country,
                                                pincode         : this.state.pincode,
                                                latitude        : this.state.latLng.lat,
                                                longitude       : this.state.latLng.lng,
                                        }
            
        }
          axios.post('/api/recordinglocation/post', formValues)
          .then((response)=>{
            if(response.data.created){
              swal("Recording location "+this.state.locationName+" added successfully!");
               this.setState({
                  "editId"                    :"",
                  "clientName"                : "",   
                  "department"               : "",   
                  "siteName"                  : "",
                  "locationName"              : "",
                  "recorderTypeVal"           : "",
                  "brandVal"                     : "",
                  "maxchannelsVal"               : "",
                  "country"                   : "",
                  "states"                    : "",
                  "city"                      : "",
                  "landmark"                  : "",
                  "area"                      : "",
                  "pincode"                   : "",
                  "images"                    : "",
                  "latitude"                  : "",
                  "longitude"                 : "",
                  "addressLine1"              : "",
                  "addressLine2"              : "",
               })
                this.props.history.push('/listrecordingloc')
              }else if(response.data.duplicate){
                swal("Recording location "+this.state.locationName+" already exist!");
              }
          })
          .catch((error)=>{
              console.log('error', error)
          });
      }else{
          window.scrollTo(0, 0);
      }
    }

   handleUpdate(event){
    event.preventDefault();
     if ($('#recordform').valid()) {
      var formValues= {
            clientName                : this.state.clientName,   
            client_id                : this.state.client_id,   
            department                : this.state.department.split("-")[0],   
            project                   : this.state.department.split("-")[1],     
            siteName                  : this.state.siteName,
            locationName              : this.state.locationName,
            recorderType              : this.state.recorderTypeVal,
            brand                     : this.state.brandVal,
            maxchannels               : this.state.maxchannelsVal,
            images                    : this.state.images,
            address                   : {
                                                addressLine1    : this.state.addressLine1,
                                                addressLine2    : this.state.addressLine2,
                                                landmark        : this.state.landmark,
                                                area            : this.state.area,
                                                city            : this.state.city,
                                                district        : this.state.district,
                                                stateCode       : this.state.stateCode,
                                                state           : this.state.states,
                                                countryCode     : this.state.countryCode,
                                                country         : this.state.country,
                                                pincode         : this.state.pincode,
                                                latitude        : this.state.latLng.lat,
                                                longitude       : this.state.latLng.lng,
                                        }
            
      };
      axios.patch('/api/recordinglocation/update/'+this.state.editId,formValues)
        .then((response)=>{
          swal("Recording location "+this.state.locationName+" updated successfully!");
         if(response.data){
          this.setState({
             "editId"                    :"",
              "clientName"                : "",   
              "department"               : "",   
              "siteName"                  : "",
              "locationName"              : "",
              "recorderTypeVal"           : "",
              "brandVal"                     : "",
              "maxchannelsVal"               : "",
              "country"                   : "",
              "states"                    : "",
              "city"                      : "",
              "area"                      : "",
              "pincode"                   : "",
              "landmark"                  : "",
              "images"                    : "",
              "latitude"                  : "",
              "longitude"                 : "",
              "addressLine1"              : "",
              "addressLine2"              : ""
          },()=>{
              this.props.history.push('/listrecordingloc')
          })
        }
      })
      .catch(function(error){
        console.log("error = ",error);
      }); 
     } 
  }
deleteDoc(event){
    event.preventDefault();
        var name = event.target.getAttribute("name");
        var index = event.target.getAttribute("id");
        var deleteDoc = this.state[name];
        deleteDoc.splice(index, 1);
        this.setState({
            [name]: deleteDoc
        })
  }

  
  getStates(StateCode){
    axios.get("http://locations2.iassureit.com/api/states/get/list/" + StateCode)
    .then((response)=>{
      this.setState({
          stateArray : response.data
      })
      $('#Statedata').val(this.state.states);
    })
    .catch((error)=>{
        console.log('error', error);
    })
  }

  handleChangeState(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
    const target = event.target;
    const stateCode = $(target).val();
    const countryCode = $("#country").val();
  }

  camelCase(str){
    return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }

  handleChangeCountry(event){
    const target = event.target;
    this.setState({
      [event.target.name] : event.target.value
    })
    this.getStates($(target).val())
  }

  getClientName(){
    axios.get("/api/entitymaster/get/client")
      .then((response)=>{
        this.setState({
            clientArray   : response.data,
        })
        $('#Clientdata').val(this.state.clientName);
      })
      .catch((error)=>{
          console.log('error', error);
      })
  }


  getRecorderType(){
  axios.post("/api/recorderTypeMaster/get/list")
        .then((response)=>{
          this.setState({
              recorderTypeArray : response.data
          })
          $('#RecoredrTypeData').val(this.state.recorderTypeVal);
        })
        .catch((error)=>{
            console.log('error', error);
        })
  }
  getRecorderBrand(){
  axios.post("/api/brandsMaster/get/list")
    .then((response)=>{
      this.setState({
          brandArray : response.data
      })
      $('#BrandData').val(this.state.brandVal);
    })
    .catch((error)=>{
        console.log('error', error);
    })
  }
  getmaxChannels(){
  axios.post("/api/maxChannels/get/list")
    .then((response)=>{
      this.setState({
          maxChannelsArray : response.data
      })
      $('#MaxChannelData').val(this.state.maxchannelsVal);
    })
    .catch((error)=>{
      console.log('error', error);
    })
  }

  docBrowse(event) {
    event.preventDefault();
    var images =[];
    if (event.currentTarget.files && event.currentTarget.files[0]) {
        for (var i = 0; i < event.currentTarget.files.length; i++) {
            var file = event.currentTarget.files[i];
            if (file) {
                var fileName = file.name;
                console.log("fileName",fileName);
                var ext = fileName.split('.').pop();
                var filename =fileName.split(".")[0]
                var new_file = new File([file], filename.split(" ").join("").concat("^"+file.lastModified+"."+ext));
                console.log("new_file",new_file);
                if (ext === "jpg" || ext === "png" || ext === "jpeg" || ext === "pdf" || ext === "JPG" || ext === "PNG" || ext === "JPEG" || ext === "PDF") {
                    if (file) {
                        var objTitle = { fileInfo: new_file }
                        images.push(objTitle);
                    } else {
                        swal("Files not uploaded");
                    }//file
                } else {
                    swal("Allowed images formats are (jpg,png,jpeg, pdf)");
                }//file types
            }//file
        }//for

        if (event.currentTarget.files) {
            main().then(formValues => {
              var images = this.state.images;
              for (var k = 0; k < formValues.length; k++) {
                images.push(formValues[k].images)
              }
              this.setState({
                images: images
              })
            });
            async function main() {
                var formValues = [];
                $("#imageLoader").show();
                for (var j = 0; j < images.length; j++) {
                  var config = await getConfig();
                  var s3url = await s3upload(images[j].fileInfo, config, this);
                  const formValue = {
                    "images": s3url,
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
                    console.log("Data",Data);
                    resolve(Data.location);
                  })
                  .catch((error) => {
                    console.log("error",error);
                  })
              })
            }
            function getConfig() {
              return new Promise(function (resolve, reject) {
                axios
                  .post('/api/projectsettings/getS3Details/S3')
                  .then((response) => {
                    const config = {
                      bucketName: response.data.bucket,
                      dirName: process.env.REACT_APP_ENVIRONMENT,
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

  handleChangePlaces = address => {
      this.setState({ addressLine1 : address});
  };

   handleSelect = address => {
    this.setState({addressLine1 : address})
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
      .catch(error => console.error('Error', error));
      geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({'latLng': latLng}))
      .catch(error => console.error('Error', error));
     
      this.setState({ addressLine1 : address});
  };

  recorderModalClickEvent(){
    $('#recorderModalId').addClass('in');
    $('#recorderModalId').css('display','block');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }
  recorderBrandModalClickEvent(){
    $('#recorderBrandModalId').addClass('in');
    $('#recorderBrandModalId').css('display','block');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }
  channelModalClickEvent(){
    $('#channelModalId').addClass('in');
    $('#channelModalId').css('display','block');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  clientModalClickEvent(){
    $('#clientId').addClass('in');
    $('#clientId').css('display','block');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

    departmentDetailsModalClickEvent(){
    $('#departmentDetailsId').addClass('in');
    $('#departmentDetailsId').css('display','block');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  locationDetailsModalClickEvent(){
    $('#locationDetailsId').addClass('in');
    $('#locationDetailsId').css('display','block');
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
          error => {
            console.error(error);
          }
        );
        })
      .catch((error) =>{
          swal(error)
      })
    })
  }

  handlePincode(event) {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    })
    if (event.target.value !== '') {
      axios.get("https://api.postalpincode.in/pincode/" + event.target.value)
        .then((response) => {
          if ($("[name='pincode']").valid()) {

            if (response.data[0].Status === 'Success') {
              this.setState({ pincodeExists: true })
            } else {
              this.setState({ pincodeExists: false })
            }
          } else {
            this.setState({ pincodeExists: true })
          }

        })
        .catch((error) => {
          this.setState({ pincodeExists: true })

        })
    } else {
      this.setState({ pincodeExists: true })
    }
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

  swalMessage(){
    swal("Please select client first.");
  } 

  swalMessageRecording(){
    swal("Please select recording location first.");
  }

  onInputClick = (event) => {
    event.target.value = ''
}

    render(){
      const searchOptions = {
      // types: ['(cities)'],
      componentRestrictions: {country: "in"}
     }
      return(
        <div className="container-fluid">
          <div className="row">
            
              <section className="content">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                  <div className="row">
                    <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                      <h4 className="weighttitle col-lg-5 col-md-11 col-xs-11 col-sm-11">Add Recording Location</h4>
                    </div>     
                    <section className="content">
                      <div className="row">
                        <div className="box-body">
                          <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
                            <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12"id="recordform"> 
                              <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 mainDiv NOpadding">
                                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                  <label className="control-label labelform locationlabel" >Client <span className="astrick">*</span></label>
                                  <div className="input-group" id="client_id_err" >
                                  <select ref="clientName" name="clientName"
                                      value={this.state.clientName}  id="clientName" onChange={this.handleChange.bind(this)}
                                       className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox" disabled={this.props.modal}>
                                        <option disabled>--Select--</option>
                                         {
                                          this.state.clientArray && this.state.clientArray.length > 0 ?
                                          this.state.clientArray.map((ClientData, index)=>{
                                            return(      
                                                <option key={index} id={ClientData._id} value={ClientData.value}>{ClientData.companyName}</option>
                                            );
                                          }
                                        ) : ''
                                      }
                                    </select>
                                    <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#clientId"  onClick={this.clientModalClickEvent.bind(this)} title="Add Client" ><i className="fa fa-plus "></i>
                                    </div>
                                  </div>  
                                </div> 
                                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                  <div className="">
                                    <label className="control-label labelform locationlabel" >Department <span className="astrick">*</span></label>
                                      <div className="input-group" id="department_details_err" >
                                        <select ref="department" name="department" id="department"  
                                          value={this.state.department}  onChange={this.handleChange.bind(this)}
                                           className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox">
                                            <option disabled selected>--Select--</option>
                                             {
                                              this.state.departmentArray && this.state.departmentArray.length > 0 ?
                                              this.state.departmentArray.map((item, index)=>{
                                                return(      
                                                    <option key={index} value={item.departmentName+"-"+item.projectName}>{item.departmentName+" - "+item.projectName}</option>
                                                );
                                              }
                                            ) : ''
                                          }
                                      </select>
                                      {this.state.client_id !== "" ?
                                        <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#departmentDetailsId"  onClick={this.departmentDetailsModalClickEvent.bind(this)} title="Add Department & Project" ><i className="fa fa-plus "></i>
                                        </div>
                                        :
                                        <div className="input-group-addon inputIcon plusIconBooking"   onClick={this.swalMessage.bind(this)} title="Add Department & Project" ><i className="fa fa-plus "></i>
                                        </div>
                                      }
                                     </div> 
                                  </div> 
                               </div> 
                               <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                  <div className="" >
                                    <label className="control-label labelform locationlabel" >Project Location <span className="astrick">*</span></label>
                                      <div className="input-group" id="location_err" >
                                        <select ref="siteName" name="siteName"id="siteName" 
                                          value={this.state.siteName}  onChange={this.handleChange.bind(this)}
                                          className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox">
                                          <option disabled>--Select--</option>
                                           {
                                            this.state.siteArray && this.state.siteArray.length > 0 ?
                                            this.state.siteArray.map((SiteData, index)=>{
                                              return(      
                                                  <option key={index} value={SiteData.addressLine1}>{SiteData.addressLine1}</option>
                                              );
                                            }
                                          ) : ''
                                        }
                                      </select>
                                      {this.state.client_id !== "" ?
                                          <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#locationDetailsId"  onClick={this.locationDetailsModalClickEvent.bind(this)} title="Add Location" ><i className="fa fa-plus "></i>
                                          </div>
                                          :
                                          <div className="input-group-addon inputIcon plusIconBooking" onClick={this.swalMessage.bind(this)} title="Add Location" ><i className="fa fa-plus "></i>
                                          </div>
                                        }
                                      </div>
                                  </div> 
                                </div> 
                              </div>
                               <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 zzero">
                                 <div className=""id="locationName">
                                    <label className="control-label labelform locationlabel">Recording Location Name</label>
                                    <span className="astrick">*</span>
                                      <input  placeholder="Enter Location " value={this.state.locationName}
                                       type="text" name="locationName" ref="locationName" onChange={this.handleChange}
                                       className="form-control areaStaes " title="Please Enter Value " autoComplete="off"  />
                                  </div> 
                               </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mainDiv NOpadding">
                                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 shippingInput">
                                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding labelform">Recorder Type<span className="astrick">*</span></label>
                                    <div className={!this.props.modal&& "input-group"} id="recorderTypeVal" > 
                                      <select ref="recorderTypeVal" name="recorderTypeVal" 
                                          value={this.state.recorderTypeVal}  onChange={this.handleChange.bind(this)}
                                          className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox">
                                            <option disabled selected>--Select-- </option>
                                            {
                                              this.state.recorderTypeArray && this.state.recorderTypeArray.length > 0 ?
                                              this.state.recorderTypeArray.map((recorderdata, index)=>{
                                                return(      
                                                      <option key={index}  value={recorderdata.recorderType}>{recorderdata.recorderType}</option>
                                                )}
                                              ) : ''
                                            }
                                      </select>
                                      {!this.props.modal&&<div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#recorderModalId"  onClick={this.recorderModalClickEvent.bind(this)} title="Add Recorder Type" ><i className="fa fa-plus "></i>
                                      </div>}
                                    </div>  
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 shippingInput" >
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding labelform">Recorder Brand<span className="astrick">*</span></label>
                                      <div className={!this.props.modal&& "input-group"} id="brandVal" >  
                                       <select ref="brandVal" name="brandVal" 
                                        value={this.state.brandVal}  onChange={this.handleChange.bind(this)}
                                         className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox">
                                          <option disabled>--Select--</option>
                                           {
                                            this.state.brandArray && this.state.brandArray.length > 0 ?
                                            this.state.brandArray.map((brandData, index)=>{
                                              return(      
                                                  <option key={index} value={brandData.brand}>{brandData.brand}</option>
                                              );
                                            }
                                          ) : ''
                                        }
                                      </select>
                                        {!this.props.modal&&<div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#recorderBrandModalId"  onClick={this.recorderBrandModalClickEvent.bind(this)} title="Add Recorder Brand" ><i className="fa fa-plus "></i>
                                        </div>}
                                    </div> 
                                  </div> 
                                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 shippingInput" >
                                    <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding labelform">Max Channels<span className="astrick">*</span></label>
                                    <div className={!this.props.modal&& "input-group"} id="maxchannelsVal" >  
                                      <select  ref="maxchannelsVal" name="maxchannelsVal" 
                                        value={this.state.maxchannelsVal}  onChange={this.handleChange.bind(this)}
                                         className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox">
                                         
                                          <option disabled>--Select--</option>
                                           {
                                            this.state.maxChannelsArray && this.state.maxChannelsArray.length > 0 ?
                                            this.state.maxChannelsArray.map((maxdata, index)=>{
                                              return(      
                                                  <option key={index} value={maxdata.maxchannels}>{maxdata.maxchannels}</option>
                                              );
                                            }
                                          ) : ''
                                        }
                                      </select>
                                        {!this.props.modal&&<div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#channelModalId"  onClick={this.channelModalClickEvent.bind(this)} title="Add Recorder Brand" ><i className="fa fa-plus "></i>
                                        </div>}
                                    </div> 
                                  </div>
                                </div>   
                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left NOpadding-right">
                                      <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 driver person employee">
                                        <div id="addressLine1">
                                          <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Address Line 1 {this.state.pathname !== "employee" ? <i className="astrick">*</i> : ""}</label>
                                          {/*<input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.addressLine1} ref="addressLine1" name="addressLine1" onChange={this.handleChange} />*/}
                                          <PlacesAutocomplete
                                                value={this.state.addressLine1}
                                                onChange={this.handleChangePlaces}
                                                onSelect={this.handleSelect}
                                                searchOptions={searchOptions}
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
                                                      required
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
                               </div>        
                               <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12  driver employee person NOpadding-left NOpadding-right">
                                <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
                                  <div id="addressLine2">
                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Flat No/Block No</label>
                                    <input type="text" id="addressLine2" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.addressLine2} ref="addressLine2" name="addressLine2" onChange={this.handleChange} />
                                  </div>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
                                  <div id="landmark">
                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Landmark </label>
                                    <input type="text" id="landmark" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.landmark} ref="landmark" name="landmark" onChange={this.handleChange} />
                                  </div>
                                </div>
                                <div className="col-lg-4   col-md-4 col-sm-12 col-xs-12 driver employee person">
                                  <div id="pincode">
                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Pincode </label>
                                    <input maxLength="6" onChange={this.handlePincode.bind(this)} type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.pincode} ref="pincode" name="pincode" id='pincode' onKeyDown={this.keyPressNumber.bind(this)}/>
                                    {this.state.pincodeExists ? null : <label style={{ color: "red", fontWeight: "100" }}>This pincode does not exists!</label>}

                                  </div>
                                </div>
                              </div>
                              <div className = "col-lg-12 marginTop17">
                                <MapContainer address={this.state.addressLine1} latLng={this.state.latLng} addMarker={this.addMarker.bind(this)} />
                              </div>
                             <div className="form-margin col-lg-12 col-md-2 col-sm-12 col-xs-12  person newdiv ">
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Recording Images (jpg, jpeg, png, pdf)  <i className="astrick">*</i></label>
                                <div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                  <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                    <div className="cursorPointer"><i className="fa fa-upload"></i><br /></div>
                                      <input multiple onChange={this.docBrowse.bind(this)} onClick={this.onInputClick.bind(this)} accept="*/*" id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="images" />
                                  </div>
                                </div>
                                {
                                  this.state.images && this.state.images.length > 0 ?
                                      this.state.images.map((logo, i) => {
                                          return (
                                              <div key={i} className="col-lg-1 col-md-1 col-sm-12 col-xs-12">
                                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                                      <label className="labelform deletelogo col-lg-12 col-md-12 col-sm-12 col-xs-12" id={i} name="images" onClick={this.deleteDoc.bind(this)}>x</label>
                                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 brdlogos" id="profilePhoto">
                                                          <embed src={logo} className="img-responsive logoStyle" />
                                                      </div>
                                                  </div>
                                              </div>
                                          );
                                      })
                                      :
                                      null
                                }
                              </div>
                              <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                  {
                                    this.state.editId ?
                                    <button className="btn button3 pull-right" onClick={this.handleUpdate.bind(this)}> Update</button>
                                    :
                                    <button className="btn button3 pull-right" onClick={this.handleSubmit.bind(this)}> Submit</button>
                                  }
                              </div> 
                            </form>     
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </section>
            </div>
          {!this.props.modal&&<React.Fragment>
          <div className="modal" id="recorderModalId" role="dialog">
            <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                      <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getRecorderType.bind(this)}>&times;</button>
                 </div>
                </div>
                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <RecorderType  editId={this.props.match && this.props.match.params.fieldID} editUrl= {this.props.match && this.props.match.params.id ? '/recordinglocationmodal/'+this.props.match.params.id :'/recordinglocationmodal'} />
                </div>  
             </div>
            </div>
          </div>
          <div className="modal" id="recorderBrandModalId" role="dialog">
            <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                      <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getRecorderBrand.bind(this)}>&times;</button>
                 </div>
                </div>
                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <Brands editId={this.props.match && this.props.match.params.fieldID} editUrl= {this.props.match && this.props.match.params.id ? '/recordinglocationmodal/'+this.props.match.params.id :'/recordinglocationmodal'} />
                </div>  
             </div>
            </div>
          </div>
          <div className="modal" id="channelModalId" role="dialog">
            <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                      <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getmaxChannels.bind(this)}>&times;</button>
                 </div>
                </div>
                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <MaxChannels  editId={this.props.match && this.props.match.params.fieldID} editUrl= {this.props.match && this.props.match.params.id ? '/recordinglocationmodal.</div></div></div></div></div>/'+this.props.match.params.id :'/recordinglocationmodal'} />
                </div>  
             </div>
            </div>
          </div>
           <div className="modal" id="clientId" role="dialog">
            <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                      <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getClientName.bind(this)}>&times;</button>
                 </div>
                </div>
                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <BasicInfo modal={true} url="createTicket"/>
                </div>  
             </div>
            </div>
          </div>
          {this.state.client_id && this.state.client_id!==""&&<div className="modal" id="locationDetailsId" role="dialog">
            <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                      <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.setDropdowns.bind(this)}>&times;</button>
                 </div>
                </div>
                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <LocationDetails  modal={true}  entityID={this.state.client_id}   url="createticket"/>
                </div>  
             </div>
            </div>
          </div>}
          {this.state.client_id && this.state.client_id!==""&&<div className="modal" id="departmentDetailsId" role="dialog">
            <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                      <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.setDropdowns.bind(this)}>&times;</button>
                 </div>
                </div>
                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <DepartmentDetails  modal={true} entityID={this.state.client_id} url="createticket"/>
                </div>  
             </div>
            </div>
          </div>}
          </React.Fragment>}
        </div>
      );
    }
  }  
