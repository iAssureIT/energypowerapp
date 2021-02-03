
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
import EquipmentSpecifications           from '../../Master/EquipmentSpecifications/EquipmentSpecifications.js';
import Industry               from '../../Master/Industry/Industry.js';
import ActualPerformance     from '../../Master/ActualPerformance/ActualPerformance.js';
import EquipmentModel          from '../../Master/EquipmentModel/EquipmentModel.js';
import MapContainer         from '../../Map/MapContainer.js';
import Geocode              from "react-geocode";
import ProjectLocation    from '../../projectLocation/components/AddEditProjectLocation.js';

export default class AddEditEquipmentLocation extends Component {
	constructor(props) {
    super(props); 
    this.state = {  
      imgs                          :[],
      industryArray                 :[],
      equipmentSpecificationsArray  :[],
      recLocationArray              :[],
      equipmentloc                  :[],
      locationName                  :'', 
      equipmentLocAddress           :'',   
      country                       :'',
      states                        :'',
      area                          :'',
      city                          :'',
      pincode                       :'',
      equipmentLat                  :'',
      equipmentLong                 :'',
      equipmentSpecifications    :'--Select--',
      industry                :'--Select--',
      actualPerformance        :'--Select--',
      images                        :[],
      equipmentUrl                  :'',
      projectLocationName           :'--Select--',
      editId                        :props.match && props.match.params ? props.match.params.id : '',
      latLng                        :{lat:null,lng:null},
      'pincodeExists'               :true,
    }; 

      this.handleChange              = this.handleChange.bind(this);
      this.handleChangeCountry       = this.handleChangeCountry.bind(this);
      this.handleChangeState         = this.handleChangeState.bind(this);
  }
   handleChange(event){
     const target = event.target;
     const name   = target.name;
    if(name==='projectLocationName'){
      var e = document.getElementById("projectLocationName");
      var project_id = e.options[e.selectedIndex].id;
      this.setState({project_id})
    }
     this.setState({
      [name]: event.target.value,
     });

  }
   edit(id){
    axios({
      method: 'get', 
      url: '/api/equipmentlocation/get/one/'+id,
    }).then((response)=> {
      var editData = response.data;  
      this.setState({
        "locationName"              : editData.locationName,
        "projectLocationName"       : editData.projectLocationName,
        "project_id"                : editData.project_id,
        "equipmentLat"              : editData.equipmentLat,
        "equipmentLong"             : editData.equipmentLong,
        "equipmentSpecifications": editData.equipmentSpecifications,
        "equipmentModelVal"         : editData.equipmentModel,
        "industry"                  : editData.industry,
        "actualPerformance"         : editData.actualPerformance,
        "images"                    : editData.images,
        "equipmentUrl"              : editData.equipmentUrl,
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
        projectLocationName:nextProps.projectLocationName,
        project_id:nextProps.project_id
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
    if ($('#equipmentform').valid()) {
    var formValues = {
            locationName             : this.state.locationName,   
            projectLocationName      : this.state.projectLocationName,
            project_id               : this.state.project_id,
            equipmentLat             : this.state.equipmentLat,
            equipmentLong            : this.state.equipmentLong,
            equipmentSpecifications  : this.state.equipmentSpecifications,
            equipmentModel           : this.state.equipmentModelVal,
            industry           : this.state.industry,
            actualPerformance      : this.state.actualPerformance,
            images                   : this.state.images,
            equipmentUrl             : this.state.equipmentUrl,
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
      axios.post('/api/equipmentlocation/post', formValues)
      .then((response)=>{
          swal("Equipment Location "+this.state.locationName+" added successfully!");
          this.setState({
              locationName   : '',
              country              : '',
              states               : '',
              city                 : '',
              area                 : '',
              pincode              : '',
              equipmentModelVal       : '--Select--',
              equipmentSpecifications         : '--Select--',
              industry           : '--Select--',
              actualPerformance   : '--Select--',
              projectLocationName: '--Select--',
              equipmentLat            : '',
              equipmentLong           : '',
              equipmentUrl            : '',
              images               : '',
              addressLine1         : "",
              addressLine2         : "",
              landmark            : "",
          })
          this.props.history.push('/listofequipmentloc')
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
    if ($('#equipmentform').valid()) {
      var formValues= {
            locationName          : this.state.locationName,   
            projectLocationName : this.state.projectLocationName,
            project_id          : this.state.project_id,
            equipmentLat             : this.state.equipmentLat,
            equipmentLong            : this.state.equipmentLong,
            equipmentSpecifications            : this.state.equipmentSpecifications,
            industry           : this.state.industry,
            equipmentModel           : this.state.equipmentModelVal,
            actualPerformance      : this.state.actualPerformance,
            images                : this.state.images,
            equipmentUrl             : this.state.equipmentUrl,
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
  
      axios.patch('/api/equipmentlocation/update/'+this.state.editId,formValues)
        .then((response)=>{
        if(response.data){
          swal("Equipment Location "+this.state.locationName+" updated successfully!");
          this.setState({
              editId                  : '',
              locationName            : '',
              equipmentLocAddress     : '',
              country                 : '',
              addressLine1            : "",
              addressLine2            : "",
              landmark                : "",
              states                  : '',
              city                    : '',
              area                    : '',
              pincode                 : '',
              equipmentModelVal       : '--Select--',
              equipmentSpecifications : '--Select--',
              industry                : '--Select--',
              actualPerformance       : '--Select--',
              projectLocationName     : '--Select--',
              equipmentLat            : '',
              equipmentLong           : '',
              equipmentUrl            : '',
              images                  : '',
          },()=>{
            this.props.history.push('/listofequipmentloc')
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
    this.getActualPerformance();
    this.getEquipmentSpecifications();
    this.getProjectLocName();
    this.getIndustry();
    this.getEquipmentModel();
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
    $("#equipmentform").validate({
      rules: {
        equipmentSpecifications: {
          required: true,
          regx2:  "--Select--",
        },
        industry: {
          required: true,
          regx3:  "--Select--",
        },
        actualPerformance: {
          required: true,
          regx4:  "--Select--",
        },
        equipmentModelVal: {
          required: true,
          regx4:  "--Select--",
        },
       locationName: {
          required: true,
          regx7:  "--Select--",
        },
        projectLocationName: {
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
        
        if (element.attr("name") == "equipmentSpecifications") {
          error.insertAfter("#equipmentSpecifications");
        }
        if (element.attr("name") == "industry") {
          error.insertAfter("#industry");
        }
        if (element.attr("name") == "equipmentModelVal") {
          error.insertAfter("#equipmentModelVal");
        }
        if (element.attr("name") == "actualPerformance") {
          error.insertAfter("#actualPerformance");
        }
        if (element.attr("name") == "equipmentLat") {
          error.insertAfter("#equipmentLat");
        }
        if (element.attr("name") == "equipmentLong") {
          error.insertAfter("#equipmentLong");
        }
        if (element.attr("name") == "projectLocationName") {
          error.insertAfter("#projectLocationName");
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
        if (element.attr("name") == "equipmentModelVal") {
          error.insertAfter("#equipmentModelVal");
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
    axios.get('/api/equipmentLocation/get/list')
    .then((response)=>{
        this.setState({
            equipmentloc : response.data
        })
         $('#Equipmentloc').val(this.state.locationName);
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

  getEquipmentSpecifications(){
    axios.post("/api/equipmentSpecifications/get/list")
      .then((response)=>{
        console.log("response",response);
        this.setState({
            equipmentSpecificationsArray : response.data
        })
        $('#EquipmentSpecificationsdata').val(this.state.equipmentSpecifications);
      })
      .catch((error)=>{
          console.log('error', error);
      })
  }
  
  getActualPerformance(){
    axios.post("/api/actualPerformance/get/list")
      .then((response)=>{
        this.setState({
            actualPerformanceArray : response.data
        })
        $('#equipmentres').val(this.state.actualPerformance);
      })
      .catch((error)=>{
          console.log('error', error);
      })
  }

  getEquipmentModel(){
    axios.post("/api/equipmentModel/get/list")
    .then((response)=>{
        this.setState({
            equipmentModelArray : response.data
        })
    })
    .catch((error)=>{
        console.log('error', error);
    })
  }

  getIndustry(){
    axios.post("/api/industryMaster/get/list")
      .then((response)=>{
      // console.log("response====>1111",response);
        this.setState({
            industryArray : response.data
        })
        $('#BrandData').val(this.state.industry);
      })
      .catch((error)=>{
          console.log('error', error);
      })
  }

  getProjectLocName(){
    axios.get("/api/projectlocation/get/list")
      .then((response)=>{
        this.setState({
            recLocationArray : response.data
        })
        $('#projectLocationName').val(this.state.projectLocationName);
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

   equipmentSpecificationsModalClickEvent(){
      $('#equipmentSpecModalId').addClass('in');
      $('#equipmentSpecModalId').css('display','block');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }
    industryModalIdClickEvent(){
      $('#industryModalId').addClass('in');
      $('#industryModalId').css('display','block');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }
    actualPerformanceClickEvent(){
      $('#actualPerformanceModalId').addClass('in');
      $('#actualPerformanceModalId').css('display','block');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    }
    equipmentModelClickEvent(){
      $('#equipmentModelModalId').addClass('in');
      $('#equipmentModelModalId').css('display','block');
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
                          <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 " id="equipmentform"> 
                            <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                               
                                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 ">
                                  <label className="labelform  locationlabel" >Project Location Name</label>
                                    <span className="astrick">*</span>
                                    <select ref="projectLocationName" name="projectLocationName" id="projectLocationName" 
                                      value={this.state.projectLocationName}  onChange={this.handleChange.bind(this)}
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
                                   <div className={!this.props.modal&& "input-group"} id="equipmentSpecifications" > 
                                    <select ref="equipmentSpecifications" name="equipmentSpecifications"
                                        value={this.state.equipmentSpecifications}  onChange={this.handleChange.bind(this)}
                                         className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox">
                                         <option value="--Select--">--Select--</option>
                                           {
                                            this.state.equipmentSpecificationsArray && this.state.equipmentSpecificationsArray.length > 0 ?
                                            this.state.equipmentSpecificationsArray.map((equipmentdata, index)=>{
                                              return(      
                                                  <option key={index} value={equipmentdata.equipmentSpecification}>{equipmentdata.equipmentSpecification}</option>
                                              );
                                            }
                                          ) : null
                                        }
                                    </select>
                                   {!this.props.modal&&<div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#equipmentSpecModalId"  onClick={this.equipmentSpecificationsModalClickEvent.bind(this)} title="Add Equipment Specifications" ><i className="fa fa-plus "></i>
                                    </div>}
                                  </div>    
                              </div> 
                            </div>  
                             <div className="cform-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 mainDiv NOpadding  " >
                              <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding labelform aftermapDiv">Equipment Model<span className="astrick">*</span></label>
                                   <div className={!this.props.modal&& "input-group"} id="equipmentModelVal" > 
                                    <select ref="equipmentModelVal" name="equipmentModelVal"  
                                        value={this.state.equipmentModelVal}  onChange={this.handleChange.bind(this)}
                                         className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox">
                                         <option value="--Select--" disabled selected>--Select--</option>
                                           {
                                            this.state.equipmentModelArray && this.state.equipmentModelArray.length > 0 ?
                                            this.state.equipmentModelArray.map((equipmentdata, index)=>{
                                              return(      
                                                  <option key={index} value={equipmentdata.equipmentModel}>{equipmentdata.equipmentModel}</option>
                                              );
                                            }
                                          ) : null
                                        }
                                    </select>
                                  {!this.props.modal&&<div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#equipmentModelModalId"  onClick={this.equipmentModelClickEvent.bind(this)} title="Add Equipment Specifications" ><i className="fa fa-plus "></i>
                                    </div>}
                                  </div>    
                              </div>
                              <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding labelform aftermapDiv">Industry<span className="astrick">*</span></label>
                                 <div className={!this.props.modal&& "input-group"} id="industry" > 
                                  <select ref="industry" name="industry" id="industry" 
                                    value={this.state.industry}  onChange={this.handleChange.bind(this)}
                                     className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox">
                                      <option disabled selected value="--Select--">--Select--</option>
                                       {
                                        this.state.industryArray && this.state.industryArray.length > 0 ?
                                        this.state.industryArray.map((industryData, index)=>{
                                          return(      
                                              <option key={index} value={industryData.industry}>{industryData.industry}</option>
                                          );
                                        }
                                      ) : ''
                                    }
                                  </select>
                                   {!this.props.modal&& <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#industryModalId"  onClick={this.industryModalIdClickEvent.bind(this)} title="Add Brand" ><i className="fa fa-plus "></i>
                                    </div>}
                               </div>    
                              </div> 
                              <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding labelform aftermapDiv">Actual Performance<span className="astrick">*</span></label>
                                   <div className={!this.props.modal&& "input-group"} id="actualPerformance"  >   
                                    <select ref="actualPerformance" name="actualPerformance" id="actualPerformance" 
                                      value={this.state.actualPerformance}  onChange={this.handleChange.bind(this)}
                                       className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox">
                                        <option disabled selected value="--Select--">--Select--</option>
                                         {
                                          this.state.actualPerformanceArray && this.state.actualPerformanceArray.length > 0 ?
                                          this.state.actualPerformanceArray.map((resolutiondata, index)=>{
                                            return(      
                                                <option key={index} value={resolutiondata.actualPerformance}>{resolutiondata.actualPerformance}</option>
                                            );
                                          }
                                        ) : ''
                                      }
                                  </select>
                                    {!this.props.modal&&<div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#actualPerformanceModalId"  onClick={this.actualPerformanceClickEvent.bind(this)} title="Add Actual Performance" ><i className="fa fa-plus "></i>
                                    </div>}
                                </div>  
                              </div>  
                              <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                <div className="">
                                  <label className="labelform labelform locationlabel" >Equipment URL/IP</label>
                                      <input ref="equipmentUrl" name="equipmentUrl" id="equipmentUrl" 
                                        value={this.state.equipmentUrl}  onChange={this.handleChange.bind(this)}
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
            <div className="modal" id="equipmentSpecModalId" role="dialog">
              <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                  <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                        <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getEquipmentSpecifications.bind(this)}>&times;</button>
                   </div>
                  </div>
                  <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <EquipmentSpecifications  editId={this.props.match.params.fieldID} editUrl= {this.props.match.params.id ? '/equipmentlocationmodal/'+this.props.match.params.id :'/equipmentlocationmodal'} />
                  </div>  
               </div>
              </div>
            </div>
            <div className="modal" id="industryModalId" role="dialog">
              <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                  <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                        <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getIndustry.bind(this)}>&times;</button>
                   </div>
                  </div>
                  <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <Industry  editId={this.props.match.params.fieldID} editUrl= {this.props.match.params.id ? '/equipmentlocationmodal/'+this.props.match.params.id :'/equipmentlocationmodal'} />
                  </div>  
               </div>
              </div>
            </div>
            <div className="modal" id="actualPerformanceModalId" role="dialog">
              <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                  <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                        <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getActualPerformance.bind(this)}>&times;</button>
                   </div>
                  </div>
                  <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <ActualPerformance  editId={this.props.match.params.fieldID} editUrl= {this.props.match.params.id ? '/equipmentlocationmodal/'+this.props.match.params.id :'/equipmentlocationmodal'} />
                  </div>  
               </div>
              </div>
            </div>
            <div className="modal" id="equipmentModelModalId" role="dialog">
              <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                  <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                        <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getEquipmentModel.bind(this)}>&times;</button>
                   </div>
                  </div>
                  <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <EquipmentModel  editId={this.props.match.params.fieldID} editUrl= {this.props.match.params.id ? '/equipmentlocationmodal/'+this.props.match.params.id :'/equipmentlocationmodal'} />
                  </div>  
               </div>
              </div>
            </div>
            <div className="modal" id="projectId" role="dialog">
            <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                      <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={()=>this.getProjectLocName(this.state.client_id)}>&times;</button>
                 </div>
                </div>
                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                 <ProjectLocation modal={true}  url="createticket"/>
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
