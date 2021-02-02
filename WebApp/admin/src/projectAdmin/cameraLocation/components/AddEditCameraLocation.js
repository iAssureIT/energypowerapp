
import React, { Component } from 'react';
import { render }           from 'react-dom';
import $                    from "jquery";
import swal                 from 'sweetalert';
import S3FileUpload         from 'react-s3';
import jQuery               from 'jquery';
import axios                from 'axios';
import '../css/customer.css';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import CameraType           from '../../Master/CameraType/CameraType.js';
import Brands               from '../../Master/Brands/Brands.js';
import CameraResolution     from '../../Master/CameraResolution/CameraResolution.js';
import CameraModel          from '../../Master/CameraModel/CameraModel.js';
import MapContainer         from '../../Map/MapContainer.js';
import Geocode              from "react-geocode";
import RecordingLocation    from '../../recordingLocation/components/AddEditRecordingLocation.js';

export default class AddEditCameraLocation extends Component {
	constructor(props) {
    super(props); 
    this.state = {  
      imgs                  :[],
      brandArray            :[],
      cameraTypeArray       :[],
      recLocationArray      :[],
      cameraloc             :[],
      locationName         : '', 
      cameraLocAddress      : '',   
      country               : '',
      states                : '',
      area                  : '',
      city                  : '',
      pincode               : '',
      cameraLat             : '',
      cameraLong            : '',
      cameraTypeVal         : '--Select--',
      cameraBrand           : '--Select--',
      cameraResolutionVal   : '--Select--',
      images                : [],
      cameraUrl             : '',
      recordingLocationName : '--Select--',
      editId                    : props.match && props.match.params ? props.match.params.id : '',
      latLng                    :{lat:null,lng:null},
      'pincodeExists'           : true,
    }; 

      this.handleChange              = this.handleChange.bind(this);
      this.handleChangeCountry       = this.handleChangeCountry.bind(this);
      this.handleChangeState         = this.handleChangeState.bind(this);
  }
   handleChange(event){
     const target = event.target;
     const name   = target.name;
    if(name==='recordingLocationName'){
      var e = document.getElementById("recordingLocationName");
      var recording_id = e.options[e.selectedIndex].id;
      this.setState({recording_id})
    }
     this.setState({
      [name]: event.target.value,
     });

  }
   edit(id){
    axios({
      method: 'get', 
      url: '/api/cameralocation/get/one/'+id,
    }).then((response)=> {
      var editData = response.data;  
      this.setState({
        "locationName"              : editData.locationName,
        "recordingLocationName"     : editData.recordingLocationName,
        "recording_id"              : editData.recording_id,
        "cameraLat"                 : editData.cameraLat,
        "cameraLong"                : editData.cameraLong,
        "cameraTypeVal"             : editData.cameraType,
        "cameraModelVal"            : editData.cameraModel,
        "cameraBrand"               : editData.cameraBrand,
        "cameraResolutionVal"       : editData.cameraResolution,
        "images"                    : editData.images,
        "cameraUrl"                 : editData.cameraUrl,
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
        recordingLocationName:nextProps.recordingLocationName,
        recording_id:nextProps.recording_id
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
    if ($('#cameraform').valid()) {
    var formValues = {
            locationName          : this.state.locationName,   
            recordingLocationName : this.state.recordingLocationName,
            recording_id          : this.state.recording_id,
            cameraLat             : this.state.cameraLat,
            cameraLong            : this.state.cameraLong,
            cameraType            : this.state.cameraTypeVal,
            cameraModel           : this.state.cameraModelVal,
            cameraBrand           : this.state.cameraBrand,
            cameraResolution      : this.state.cameraResolutionVal,
            images                : this.state.images,
            cameraUrl             : this.state.cameraUrl,
            address               : {
                                        addressLine1    : this.state.addressLine1,
                                        addressLine2    : this.state.addressLine2,
                                        area            : this.state.area,
                                        city            : this.state.city,
                                        landmark        : this.state.landmark,
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
      axios.post('/api/cameralocation/post', formValues)
      .then((response)=>{
          swal("Equipment Location "+this.state.locationName+" added successfully!");
          this.setState({
              locationName   : '',
              country              : '',
              states               : '',
              city                 : '',
              area                 : '',
              pincode              : '',
              cameraModelVal       : '--Select--',
              cameraTypeVal         : '--Select--',
              cameraBrand           : '--Select--',
              cameraResolutionVal   : '--Select--',
              recordingLocationName: '--Select--',
              cameraLat            : '',
              cameraLong           : '',
              cameraUrl            : '',
              images               : '',
              addressLine1         : "",
              addressLine2         : "",
              landmark            : "",
          })
          this.props.history.push('/listofcameraloc')
        })
        .catch((error)=>{
            console.log('error', error)
       });  
   }else{
      window.scrollTo(0, 0);
    }         
}
updateFun(event){
    event.preventDefault();
    if ($('#cameraform').valid()) {
      var formValues= {
            locationName          : this.state.locationName,   
            recordingLocationName : this.state.recordingLocationName,
            recording_id          : this.state.recording_id,
            cameraLat             : this.state.cameraLat,
            cameraLong            : this.state.cameraLong,
            cameraType            : this.state.cameraTypeVal,
            cameraBrand           : this.state.cameraBrand,
            cameraModel           : this.state.cameraModelVal,
            cameraResolution      : this.state.cameraResolutionVal,
            images                : this.state.images,
            cameraUrl             : this.state.cameraUrl,
            address               : {
                                        addressLine1    : this.state.addressLine1,
                                        addressLine2    : this.state.addressLine2,
                                        area            : this.state.area,
                                        city            : this.state.city,
                                        district        : this.state.district,
                                        landmark        : this.state.landmark,
                                        stateCode       : this.state.stateCode,
                                        state           : this.state.states,
                                        countryCode     : this.state.countryCode,
                                        country         : this.state.country,
                                        pincode         : this.state.pincode,
                                        latitude        : this.state.latLng.lat,
                                        longitude       : this.state.latLng.lng,
                                  }
            
      };
  
      axios.patch('/api/cameralocation/update/'+this.state.editId,formValues)
        .then((response)=>{
        if(response.data){
          swal("Equipment Location "+this.state.locationName+" updated successfully!");
          this.setState({
              editId               : '',
              locationName        : '',
              cameraLocAddress     : '',
              country              : '',
              addressLine1         : "",
              addressLine2         : "",
              landmark            : "",
              states               : '',
              city                 : '',
              area                 : '',
              pincode              : '',
              cameraModelVal       : '--Select--',
              cameraTypeVal         : '--Select--',
              cameraBrand           : '--Select--',
              cameraResolutionVal   : '--Select--',
              recordingLocationName: '--Select--',
              cameraLat            : '',
              cameraLong           : '',
              cameraUrl            : '',
              images        : '',
          },()=>{
            
            this.props.history.push('/listofcameraloc')
          })
        }
      })
      .catch(function(error){
        console.log("error = ",error);
      }); 
     } 
    
  }



  componentDidMount(){
    this.getStates();
    this.getCameraResolution();
    this.getCameraModel();
    this.getRecorderdingLocName();
    this.getcameraType();
    this.getRecorderBrand();
    this.getlocationName();
      var editId = this.props.match && this.props.match.params.id;
    // console.log('editId', editId);
    if(editId){     
      this.edit(editId);
    }

    window.scrollTo(0, 0);
   
   $.validator.addMethod("regx2", function (value, element, arg) {  
     return arg !== value;
    }, "Select Equipment Specifications.");

    $.validator.addMethod("regx3", function (value, element, arg) { 
     return arg !== value; 
    }, "Select Industry");

    $.validator.addMethod("regx4", function (value, element, arg) {
      return arg !== value;
    }, "Select Actual Performance");

    $.validator.addMethod("regx7", function (value, element, arg) {
      return arg !== value;
    }, "Select Equipment Location");

     $.validator.addMethod("regx8", function (value, element, arg) {
      return arg !== value;
    }, "Select Project Location");



    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    $("#cameraform").validate({
      rules: {
        cameraTypeVal: {
          required: true,
          regx2:  "--Select--",
        },
        cameraBrand: {
          required: true,
          regx3:  "--Select--",
        },
        cameraResolutionVal: {
          required: true,
          regx4:  "--Select--",
        },
        cameraModelVal: {
          required: true,
          regx4:  "--Select--",
        },
       locationName: {
          required: true,
          regx7:  "--Select--",
        },
        recordingLocationName: {
          required: true,
          regx8:  "--Select--",
        },
        addressLine1 : {
          required: true,
        },
        addressLine2 : {
          // required: true,
        }

      },
      errorPlacement: function (error, element) {
        
        if (element.attr("name") == "cameraTypeVal") {
          error.insertAfter("#cameraTypeVal");
        }
        if (element.attr("name") == "cameraBrand") {
          error.insertAfter("#cameraBrand");
        }
        if (element.attr("name") == "cameraModelVal") {
          error.insertAfter("#cameraModelVal");
        }
        if (element.attr("name") == "cameraResolutionVal") {
          error.insertAfter("#cameraResolutionVal");
        }
        if (element.attr("name") == "cameraLat") {
          error.insertAfter("#cameraLat");
        }
        if (element.attr("name") == "cameraLong") {
          error.insertAfter("#cameraLong");
        }
        if (element.attr("name") == "recordingLocationName") {
          error.insertAfter("#recordingLocationName");
        }
        if (element.attr("name") == "locationName") {
          error.insertAfter("#locationName");
        } 
        if (element.attr("name") == "addressLine1") {
          error.insertAfter("#addressLine1");
        }
        if (element.attr("name") == "addressLine2") {
          error.insertAfter("#addressLine2");
        }
        if (element.attr("name") == "cameraModelVal") {
          error.insertAfter("#cameraModelVal");
        }
      }
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
  
  getlocationName(){
    axios.get('/api/cameraLocation/get/list')
    .then((response)=>{
        this.setState({
            cameraloc : response.data
        })
         $('#Cameraloc').val(this.state.locationName);
      })
      .catch((error)=>{
          console.log('error', error);
      })
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

  getcameraType(){
    axios.post("/api/cameraTypeMaster/get/list")
      .then((response)=>{
        this.setState({
            cameraTypeArray : response.data
        })
        $('#CameraTypedata').val(this.state.cameraTypeVal);
      })
      .catch((error)=>{
          console.log('error', error);
      })
  }
  
  getCameraResolution(){
    axios.post("/api/cameraResolution/get/list")
      .then((response)=>{
        this.setState({
            cameraResolutionArray : response.data
        })
        $('#camerares').val(this.state.cameraResolutionVal);
      })
      .catch((error)=>{
          console.log('error', error);
      })
  }

  getCameraModel(){
    axios.post("/api/cameraModel/get/list")
    .then((response)=>{
        this.setState({
            cameraModelArray : response.data
        })
    })
    .catch((error)=>{
        console.log('error', error);
    })
  }

  getRecorderBrand(){
    axios.post("/api/brandsMaster/get/list")
      .then((response)=>{
      // console.log("response====>1111",response);
        this.setState({
            brandArray : response.data
        })
        $('#BrandData').val(this.state.brand);
      })
      .catch((error)=>{
          console.log('error', error);
      })
  }

  getRecorderdingLocName(){
    axios.get("/api/recordinglocation/get/list")
      .then((response)=>{
        this.setState({
            recLocationArray : response.data
        })
        $('#recordingLocationName').val(this.state.recordingLocationName);
      })
      .catch((error)=>{
          console.log('error', error);
      })
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

  docBrowse(event) {
    event.preventDefault();
    var images =[];
    if (event.currentTarget.files && event.currentTarget.files[0]) {
        for (var i = 0; i < event.currentTarget.files.length; i++) {
            var file = event.currentTarget.files[i];
            if (file) {
                var fileName = file.name;
                var ext = fileName.split('.').pop();
                var filename =fileName.split(".")[0]
                var new_file = new File([file], filename.split(" ").join("").concat("^"+file.lastModified+"."+ext));
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

   cameraTypeModalClickEvent(){
      $('#cameraTypeModalId').addClass('in');
      $('#cameraTypeModalId').css('display','block');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }
    brandsModalIdClickEvent(){
      $('#brandsModalId').addClass('in');
      $('#brandsModalId').css('display','block');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }
    cameraResolutionClickEvent(){
      $('#cameraResolutionModalId').addClass('in');
      $('#cameraResolutionModalId').css('display','block');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }
    cameraModelClickEvent(){
      $('#cameraModelModalId').addClass('in');
      $('#cameraModelModalId').css('display','block');
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
                    <h4 className="weighttitle col-lg-5 col-md-11 col-xs-11 col-sm-11">Add Equipment Location</h4>
                  </div>     
                  <section className="content">
                    <div className="row">
                      <div className="box-body">
                        <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
                          <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 " id="cameraform"> 
                            <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                               
                                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                                  <label className="labelform  locationlabel" >Project Location Name</label>
                                    <span className="astrick">*</span>
                                    <select ref="recordingLocationName" name="recordingLocationName" id="recordingLocationName" 
                                      value={this.state.recordingLocationName}  onChange={this.handleChange.bind(this)}
                                       className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox" disabled={this.props.modal} required>
                                        <option value="--Select--">--Select--</option>
                                         {
                                          this.state.recLocationArray && this.state.recLocationArray.length > 0 ?
                                          this.state.recLocationArray.map((item, index)=>{
                                            return(      
                                                <option key={index} id={item._id} value={item.locationName}>{item.locationName}</option>
                                            );
                                          }
                                        ) : ''
                                      }
                                  </select>
                                </div> 
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">  
                                  <label className="labelform new_statelabel locationlabel">Equipment Location Name<span className="astrick">*</span></label>
                                  <input id="locationName" placeholder="Enter Equipment Location Name " id="locationName"  value={this.state.locationName}
                                    type="text" name="locationName" ref="locationName" onChange={this.handleChange}
                                    className="form-control areaStaes " title="Please Enter Location here" autoComplete="off"  required
                                  />
                                </div>
                                 <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding labelform aftermapDiv">Equipment Specifications<span className="astrick">*</span></label>
                                   <div className={!this.props.modal&& "input-group"} id="cameraTypeVal" > 
                                    <select ref="cameraTypeVal" name="cameraTypeVal"
                                        value={this.state.cameraTypeVal}  onChange={this.handleChange.bind(this)}
                                         className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox">
                                         <option value="--Select--">--Select--</option>
                                           {
                                            this.state.cameraTypeArray && this.state.cameraTypeArray.length > 0 ?
                                            this.state.cameraTypeArray.map((cameradata, index)=>{
                                              return(      
                                                  <option key={index} value={cameradata.cameraType}>{cameradata.cameraType}</option>
                                              );
                                            }
                                          ) : null
                                        }
                                    </select>
                                   {!this.props.modal&&<div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#cameraTypeModalId"  onClick={this.cameraTypeModalClickEvent.bind(this)} title="Add Equipment Specifications" ><i className="fa fa-plus "></i>
                                    </div>}
                                  </div>    
                              </div> 
                            </div>  
                             <div className="cform-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 mainDiv NOpadding  " >
                              <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding labelform aftermapDiv">Equipment Model<span className="astrick">*</span></label>
                                   <div className={!this.props.modal&& "input-group"} id="cameraModelVal" > 
                                    <select ref="cameraModelVal" name="cameraModelVal"  
                                        value={this.state.cameraModelVal}  onChange={this.handleChange.bind(this)}
                                         className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox">
                                         <option value="--Select--" disabled selected>--Select--</option>
                                           {
                                            this.state.cameraModelArray && this.state.cameraModelArray.length > 0 ?
                                            this.state.cameraModelArray.map((cameradata, index)=>{
                                              return(      
                                                  <option key={index} value={cameradata.cameraModel}>{cameradata.cameraModel}</option>
                                              );
                                            }
                                          ) : null
                                        }
                                    </select>
                                  {!this.props.modal&&<div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#cameraModelModalId"  onClick={this.cameraModelClickEvent.bind(this)} title="Add Equipment Specifications" ><i className="fa fa-plus "></i>
                                    </div>}
                                  </div>    
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding labelform aftermapDiv">Industry<span className="astrick">*</span></label>
                                 <div className={!this.props.modal&& "input-group"} id="cameraBrand" > 
                                  <select ref="cameraBrand" name="cameraBrand" id="cameraBrand" 
                                    value={this.state.cameraBrand}  onChange={this.handleChange.bind(this)}
                                     className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox">
                                      <option disabled selected value="--Select--">--Select--</option>
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
                                   {!this.props.modal&& <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#brandsModalId"  onClick={this.brandsModalIdClickEvent.bind(this)} title="Add Brand" ><i className="fa fa-plus "></i>
                                    </div>}
                               </div>    
                              </div> 
                              <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding labelform aftermapDiv">Actual Performance<span className="astrick">*</span></label>
                                   <div className={!this.props.modal&& "input-group"} id="cameraResolutionVal"  >   
                                    <select ref="cameraResolutionVal" name="cameraResolutionVal" id="cameraResolutionVal" 
                                      value={this.state.cameraResolutionVal}  onChange={this.handleChange.bind(this)}
                                       className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox">
                                        <option disabled selected value="--Select--">--Select--</option>
                                         {
                                          this.state.cameraResolutionArray && this.state.cameraResolutionArray.length > 0 ?
                                          this.state.cameraResolutionArray.map((resolutiondata, index)=>{
                                            return(      
                                                <option key={index} value={resolutiondata.cameraResolution}>{resolutiondata.cameraResolution}</option>
                                            );
                                          }
                                        ) : ''
                                      }
                                  </select>
                                    {!this.props.modal&&<div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#cameraResolutionModalId"  onClick={this.cameraResolutionClickEvent.bind(this)} title="Add Actual Performance" ><i className="fa fa-plus "></i>
                                    </div>}
                                </div>  
                              </div>  
                              <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                <div className="">
                                  <label className="labelform labelform locationlabel" >Equipment URL/IP</label>
                                      <input ref="cameraUrl" name="cameraUrl" id="cameraUrl" 
                                        value={this.state.cameraUrl}  onChange={this.handleChange.bind(this)}
                                        className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox"
                                      />
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
                                  <input type="text" id="addressLine2" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.addressLine2} ref="addressLine2" name="addressLine2" onChange={this.handleChange.bind(this)} />
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 driver person employee">
                                <div id="landmark">
                                  <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Landmark </label>
                                  <input type="text" id="landmark" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.landmark} ref="landmark" name="landmark" onChange={this.handleChange.bind(this)} />
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
                              <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Equipment Images (jpg, jpeg, png, pdf)  <i className="astrick">*</i></label>
                              <div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 NOpadding marginsBottom" id="hide">
                                <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 brdlogos" id="LogoImageUpOne">
                                  <div className="cursorPointer"><i className="fa fa-upload"></i><br /></div>
                                    <input multiple onChange={this.docBrowse.bind(this)} onClick={this.onInputClick.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="images" />
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
                                  <button className="btn button3 pull-right" onClick={this.updateFun.bind(this)}> Update</button>
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
          {!this.props.modal && 
            <React.Fragment>
            <div className="modal" id="cameraTypeModalId" role="dialog">
              <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                  <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                        <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getcameraType.bind(this)}>&times;</button>
                   </div>
                  </div>
                  <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <CameraType  editId={this.props.match.params.fieldID} editUrl= {this.props.match.params.id ? '/cameralocationmodal/'+this.props.match.params.id :'/cameralocationmodal'} />
                  </div>  
               </div>
              </div>
            </div>
            <div className="modal" id="brandsModalId" role="dialog">
              <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                  <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                        <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getRecorderBrand.bind(this)}>&times;</button>
                   </div>
                  </div>
                  <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <Brands  editId={this.props.match.params.fieldID} editUrl= {this.props.match.params.id ? '/cameralocationmodal/'+this.props.match.params.id :'/cameralocationmodal'} />
                  </div>  
               </div>
              </div>
            </div>
            <div className="modal" id="cameraResolutionModalId" role="dialog">
              <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                  <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                        <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getCameraResolution.bind(this)}>&times;</button>
                   </div>
                  </div>
                  <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <CameraResolution  editId={this.props.match.params.fieldID} editUrl= {this.props.match.params.id ? '/cameralocationmodal/'+this.props.match.params.id :'/cameralocationmodal'} />
                  </div>  
               </div>
              </div>
            </div>
            <div className="modal" id="cameraModelModalId" role="dialog">
              <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                  <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                        <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getCameraModel.bind(this)}>&times;</button>
                   </div>
                  </div>
                  <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <CameraModel  editId={this.props.match.params.fieldID} editUrl= {this.props.match.params.id ? '/cameralocationmodal/'+this.props.match.params.id :'/cameralocationmodal'} />
                  </div>  
               </div>
              </div>
            </div>
            <div className="modal" id="recordingId" role="dialog">
            <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                      <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={()=>this.getRecorderdingLocName(this.state.client_id)}>&times;</button>
                 </div>
                </div>
                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                 <RecordingLocation modal={true}  url="createticket"/>
                </div>  
             </div>
            </div>
          </div>
            </React.Fragment>
           } 
        </div>
      );
    }
}
