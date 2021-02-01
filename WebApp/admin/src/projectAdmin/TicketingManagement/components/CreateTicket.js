
import React, { Component } from 'react';
import { render }           from 'react-dom';
import $                    from "jquery";
import swal                 from 'sweetalert';
import S3FileUpload         from 'react-s3';
import jQuery               from 'jquery';
import axios                from 'axios';
import { CheckBoxSelection, Inject, MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import CKEditor           from "react-ckeditor-component";
import '../css/TicketingManagement.css';
import TaskTypes            from '../../Master/TaskTypes/TaskTypes.js';
import BasicInfo            from '../../ClientMaster/ClientBasicInfo.js';
import ContactPerson        from '../../ClientMaster/ClientContactDetails.js';
import LocationDetails      from '../../ClientMaster/ClientLocationDetails.js';
import DepartmentDetails    from '../../ClientMaster/ClientDepartmentDetails.js';
import RecordingLocation    from '../../recordingLocation/components/AddEditRecordingLocation.js';
import CameraLocation    from '../../cameraLocation/components/AddEditCameraLocation.js';
import moment from 'moment';

export default class CreateTicket extends Component {
	constructor(props) {
    super(props); 
    this.state = {  
     
     
      expanded              :false,
       client               :  '',
       client_id            :  '',
       site                 :  '',
       department           :  '',
       project              :  '',
       allocatedTo          :  '',
       description          :  '',
       typeOfIssue          :  '',
       recordingLocationName : '--Select--',
       recordingLocation_id :  '',
       locationName         :  '',
       cameraLocation_id    :  '',
       client_id            :  '',
       videos               :  '', 
       tabledata            :  '',
       allocatedTo          :  '',
       technician_id        :  '',
       clientArray          :  [],
       departmentsArray     :  [],
       siteArray            :  [],
       recordingLocationList:  [],
       cameraLocationList   :  [],
       technicianList       :  [],
       imagesArray          :  [],
       videosArray          :  [],
       editId               : props.match.params ? props.match.params.id : '',
       technician_id        : '',
       serviceRequest       : 'Free',
       cost                 : 0,
       'messageError'     : '',
       gotTicketImage      : false,
    }; 
      this.handleChange = this.handleChange.bind(this);
      this.onChange     = this.onChange.bind(this);
  }

  componentDidMount(){
    this.getClientName();
    this.getTypeOfIssues();
    this.getTechnicianList();
    window.scrollTo(0, 0);
   
    $.validator.addMethod("regx1", function (value, element, arg) {
       return arg !== value;
    }, "Please Select Client"); 
    $.validator.addMethod("regx2", function (value, element, arg) {
       return arg !== value;
    }, "Please Select Department"); 
    $.validator.addMethod("regx3", function (value, element, arg) {
       return arg !== value;
    }, "Please Select Project"); 
    $.validator.addMethod("regx4", function (value, element, arg) {
       return arg !== value;
    }, "Please Select Site");
     $.validator.addMethod("regx5", function (value, element, arg) {
       return arg !== value;
    }, "Please Select issue");
    $.validator.addMethod("regx6", function (value, element, arg) {
       return arg !== value;
    }, "Please Select Recording Location");
    $.validator.addMethod("regx7", function (value, element, arg) {
       return arg !== value;
    }, "Please Select Camera Location");
    $.validator.addMethod("regx8", function (value, element, arg) {
       return arg !== value;
    }, "Please Select Contact Person");
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    $("#ticketform").validate({
      rules: {

        clientName: {
          required: true,
          regx1:  "--Select--",
        },
        contactPerson: {
          required: true,
          regx8:  "--Select--",
        },
        department: {
          required: true,
          regx2:  "--Select--",
        },
        project: {
          required: true,
          regx3:  "--Select--",
        },
        site: {
          required: true,
          regx4:  "--Select--",
        },
        typeOfIssue: {
          required: true,
          regx5:  "--Select--",
        },
        recordingLocationName: {
          required: true,
          regx6:  "--Select--",
        },
        description: {
          required: true,
        },
        // assignToTechnician: {
        //   required: true,
        // },
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") === "clientName") {
          error.insertAfter("#client_id_err");
        }
        if (element.attr("name") === "department") {
          error.insertAfter("#department_details_err");
        }
        if (element.attr("name") === "project") {
          error.insertAfter("#project");
        }
        if (element.attr("name") === "site") {
          error.insertAfter("#location_err");
        }
        if (element.attr("name") === "typeOfIssue") {
          error.insertAfter("#typeOfIssue");
        }
        if (element.attr("name") === "recordingLocationName") {
          error.insertAfter("#recordingLocationName_err");
        }
        if (element.attr("name") === "description") {
          error.insertAfter("#description");
        }
        if (element.attr("name") === "assignToTechnician") {
          error.insertAfter("#assignToTechnician");
        }
        if (element.attr("name") === "contactPerson") {
          error.insertAfter("#contact_person_err");
        }
      }
    })
  }

  getTypeOfIssues(){
    axios.post("/api/taskTypeMaster/get/list")
      .then((response)=>{
        this.setState({
            typeOfIssueArray : response.data
        })
      })
      .catch((error)=>{})
  } 
  getRecodingLocation(client_id){
    axios.get("/api/recordinglocation/get/list/client/"+client_id)
      .then((response)=>{
        if(response.status===200){
          this.setState({
              recordingLocationList : response.data
          })
        }
      })
      .catch((error)=>{})
  }  
  getCameraLocation(recording_id){
    axios.get("/api/cameralocation/get/list/recording/"+recording_id)
      .then((response)=>{
        this.setState({
            cameraLocationList : response.data
        })
      })
      .catch((error)=>{})
  }      

  handleChange(event){
     const target = event.target;
     const name   = target.name;
     if(name==='clientName'){
      var e = document.getElementById("client_id");
      var client_id = e.options[e.selectedIndex].id;
      var client = this.state.clientArray.find((elem)=>{return elem._id===client_id})
      this.setState({
        client            : client,
        client_id         : client_id,
        departmentsArray  : client.departments,
        siteArray         : client.locations,
        contactPersonArray: client.contactPersons,
      })
      console.log("contactPersonArray",client.contactPersons);
      this.getContactPersons(client_id)
      this.getRecodingLocation(client_id)
    }
    if(name==='department'){
      var e = document.getElementById("departmentValue");
      var departmentValue = e.options[e.selectedIndex].id;
      var siteArray = this.state.client.locations.filter(a=> a.department === departmentValue);
      this.setState({
        siteArray : siteArray,
      })
    }
    if(name==='recordingLocationName'){
      var e = document.getElementById("recordingLocationName");
      var recording_id = e.options[e.selectedIndex].id;
      this.setState({
        recordingLocation_id : recording_id,
      },()=>{
        this.getCameraLocation(recording_id)
      })
    }
    if(name==='locationName'){
      var e = document.getElementById("cameraLocation");
      this.setState({
        cameraLocation_id : e.options[e.selectedIndex].id,
      })
    }
    if(name==='contactPerson'){
      var e = document.getElementById("contactPerson");
      console.log("e",e.options[e.selectedIndex].id);
      this.setState({
        contactPerson_id : e.options[e.selectedIndex].id,
      })
    }
     this.setState({
      [name]: event.target.value,
     });
  }

  getContactPersons(event){

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
      url: '/api/tickets/get/one/'+id,
    }).then((response)=> {
      var editData = response.data;
      var client = this.state.clientArray.find((elem)=>{return elem._id===editData.client_id})
      this.getRecodingLocation(editData.client_id);
      this.getCameraLocation(editData.recordingLocation_id._id)
      this.setState({
        departmentsArray  : client.departments,
        siteArray         : client.locations,
        contactPersonArray: client.contactPersons,
      })  

        this.setState({
        "clientName"           :editData.clientName,
        "client_id"            :editData.client_id,
        "contactPerson"        :editData.contactPerson,
        "contactPerson_id"     :editData.contactPerson_id,
        "department"           :editData.department+"-"+editData.project,
        "site"                 :editData.site,
        "description"          :editData.description,
        "allocatedTo"          :editData.allocatedTo,
        "cost"                 :editData.cost,
        "serviceRequest"       :editData.serviceRequest,
        "imagesArray"          :editData.images,
        "videosArray"          :editData.videos,
        "typeOfIssue"          :editData.typeOfIssue,
        "recordingLocationName":editData.recordingLocationName,
        "recordingLocation_id":editData.recordingLocation_id,
        "cameraLocation_id":editData.cameraLocation_id,
        "locationName"   :editData.cameraLocationName 
      });
     }).catch(function (error) {});
  }


   
  componentWillReceiveProps(nextProps){
    if(nextProps){
      var editId = nextProps.match.params.id;
      if(nextProps.match.params.id){
        this.setState({
          editId : editId
        },()=>{
          if(this.state.editId){
            this.edit(this.state.editId)
          }
        })
      }
    }
  }

  handleSubmit(event){
    event.preventDefault()
    if ($('#ticketform').valid()) {
      var formValues = {
        clientName            :  this.state.clientName,
        client_id             :  this.state.client_id,
        contactPerson         :  this.state.contactPerson,
        contactPerson_id      :  this.state.contactPerson_id,
        site                  :  this.state.site,
        department            :  this.state.department.split("-")[0],
        project               :  this.state.department.split("-")[1],
        recordingLocationName :  this.state.recordingLocationName, 
        recordingLocation_id  :  this.state.recordingLocation_id, 
        cameraLocationName    :  this.state.locationName, 
        cameraLocation_id     :  this.state.cameraLocation_id, 
        description           :  this.state.description,
        images                :  this.state.imagesArray,
        typeOfIssue           :  this.state.typeOfIssue,
        videos                :  this.state.videosArray,
        status                :  {
                                  value : "New",
                                  statusBy : localStorage.getItem("user_ID"),
                                  statusAt :  new Date()
                                }

      }

      axios.post('/api/tickets/post', formValues)
        .then((response)=>{
          var sendData = {
            "event": "Event1", //Event Name
            "company_id": formValues.client_id, //company_id(ref:entitymaster)
            "otherAdminRole":'client',
            "variables": {
              'TicketId': response.data.ticketId,
              'CompanyName': formValues.clientName,
              'RaisedBy' :formValues.contactPerson,
              'TypeOfIssue': formValues.typeOfIssue,
              'CreatedAt': moment().format("DD/MM/YYYY"),
            }
          }
          console.log("sendData",sendData);
          axios.post('/api/masternotifications/post/sendNotification', sendData)
          .then((res) => {
          console.log('sendDataToUser in result==>>>', res.data)
          })
          .catch((error) => { console.log('notification error: ',error)})
              this.setState({
                  clientName            : '',
                  client_id             : '',
                  contactPerson         : '',
                  contactPerson_id      : '',
                  site                  : '',
                  project               : '',
                  department            : '',
                  recordingLocationName : '', 
                  recordingLocation_id  : '', 
                  locationName          : '', 
                  cameraLocation_id     : '', 
                  description           : '',
                  imagesArray           : '',
                  typeOfIssue           : '',
                  videosArray                : '',
                  technician_id         : '',
                  allocatedTo           : ''
              },()=>{
                
                swal("Ticket created successfully.");
                this.props.history.push('/ticketlist')
              })
          })
        .catch((error)=>{});  
     }   
  }

  updateFun(event){
    event.preventDefault();
    var formValues= {
        clientName            :  this.state.clientName,
        client_id             :  this.state.client_id,
        contactPerson         :  this.state.contactPerson,
        contactPerson_id      :  this.state.contactPerson_id,
        site                  :  this.state.site,
        department            :  this.state.department.split("-")[0],
        project               :  this.state.department.split("-")[1],
        recordingLocationName :  this.state.recordingLocationName, 
        recordingLocation_id  :  this.state.recordingLocation_id, 
        cameraLocationName    :  this.state.locationName, 
        cameraLocation_id     :  this.state.cameraLocation_id, 
        description           :  this.state.description,
        images                :  this.state.imagesArray,
        typeOfIssue           :  this.state.typeOfIssue,
        videos                :  this.state.videosArray,
      };
  
      axios.patch('/api/tickets/update/'+this.state.editId,formValues)
        .then((response)=>{
        if(response.data){
          this.setState({
              clientName            : '',
              client_id             : '',
              contactPerson         : '',
              contactPerson_id      : '',
              site                  : '',
              project               : '',
              department            : '',
              recordingLocationName : '', 
              recordingLocation_id  : '', 
              locationName    : '', 
              cameraLocation_id     : '', 
              description           : '',
              imagesArray           : '',
              typeOfIssue           : '',
              videosArray           : '',
              technician_id         : '',
              allocatedTo           : ''

          },()=>{
            swal("Ticket updated successfully!!!");
            this.props.history.push('/ticketlist')
          })
        }
      })
      .catch(function(error){}); 
  }

  getClientName(){
    axios.get("/api/entitymaster/get/client")
      .then((response)=>{
        this.setState({
            clientArray   : response.data,
        },()=>{
           if(this.state.editId){
              this.edit(this.state.editId)
            }
        })
        $('#Clientdata').val(this.state.clientName);
      })
      .catch((error)=>{})
  }

  deleteDoc(event){
    event.preventDefault();
      var name = event.target.getAttribute("name");
      var deleteDoc = this.state[name];
      const index = deleteDoc.indexOf(event.target.getAttribute("id"));
      if (index > -1) {
          deleteDoc.splice(index, 1);
      }
      this.setState({
          [name]: deleteDoc
  
      })
  }

   deleteImage(event){
    event.preventDefault();
      const imagesArray = this.state.imagesArray;
      const index = event.target.getAttribute("id");
      if (index > -1) {
          imagesArray.splice(index, 1);
      }
      this.setState({
          imagesArray
      })
  }  

  deleteVideo(event){
    event.preventDefault();
      const videosArray = this.state.videosArray;
      const index = event.target.getAttribute("id");
      if (index > -1) {
          videosArray.splice(index, 1);
      }
      this.setState({
          videosArray
      })
  }

  onchange(e){
    let selected=[];//will be selected option in select
    let selected_opt=(e.target.selectedOptions);
    for (let i = 0; i < selected_opt.length; i++){
        selected.concat(selected_opt.item(i).value)
    }
  }

  handlemultiselect(){
    var node = React.findDOMNode(this.refs.action1Notification);
    var options = [].slice.call(node.querySelectorAll('option'));
    var selected = options.filter(function (option) {
        return option.selected;
    });
    var selectedValues = selected.map(function (option) {
        return option.value;
    });
  } 

  imgBrowse(event) {
    event.preventDefault();
    var imagesArray = [];
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      for (var i = 0; i < event.currentTarget.files.length; i++) {
        var file = event.currentTarget.files[i];
        if (file) {
          var fileName = file.name;
          var ext = fileName.split('.').pop();
          if (ext === "jpg" || ext === "png" || ext === "jpeg" || 
              ext === "JPG" || ext === "PNG" || ext === "JPEG" || 
              ext === "pdf" || ext === "PDF"
            ) {
            if (file) {
              var objTitle = { fileInfo: file }
              imagesArray.push(objTitle);
            } else {
              swal("Images not uploaded");
            }//file
          } else {
            swal("Allowed images formats are (jpg, png, pdf)");
            this.setState({
              gotTicketImage:false
            })
          }//file types
        }//file
      }//for 

      if (event.currentTarget.files) {
         this.setState({
            gotTicketImage:true
          })
        main().then(formValues => {
          var imagesArray = this.state.imagesArray;
          for (var k = 0; k < formValues.length; k++) {
            imagesArray.push(formValues[k].imagesArray)
          }

          this.setState({
            imagesArray: imagesArray,
            gotTicketImage:false
          })
        });

        async function main() {
          var formValues = [];
          for (var j = 0; j < imagesArray.length; j++) {
            var config = await getConfig();
            var s3url = await s3upload(imagesArray[j].fileInfo, config, this);
            const formValue = {
              "imagesArray": s3url,
              gotTicketImage:false,
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
  videoBrowse(event) {
    event.preventDefault();
    var videosArray = [];
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      for (var i = 0; i < event.currentTarget.files.length; i++) {
        var file = event.currentTarget.files[i];

        if (file) {
          var fileName = file.name;
          var ext = fileName.split('.').pop();
          if(ext==="mp4" || ext==="avi" || ext==="ogv"){ 
            if (file) {
              var objTitle = { fileInfo: file }
              videosArray.push(objTitle);

            } else {
              swal("Video not uploaded");
            }//file
          } else {
            swal("Allowed videoos formats are (mp4,avi,ogv)");
            this.setState({
              gotTicketVideo:false
            })
          }//file types
        }//file
      }//for 

      if (event.currentTarget.files) {
         this.setState({
          gotTicketVideo:true
        })
        main().then(formValues => {
          var videosArray = this.state.videosArray;
          for (var k = 0; k < formValues.length; k++) {
            videosArray.push(formValues[k].videosArray)
          }

          this.setState({
            videosArray: videosArray,
            gotTicketVideo:false,
          })
        });

        async function main() {
          var formValues = [];
          for (var j = 0; j < videosArray.length; j++) {
            var config = await getConfig();
            var s3url = await s3upload(videosArray[j].fileInfo, config, this);
            const formValue = {
              "videosArray": s3url,
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
  keyPressWeb = (e) => {
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190, 110]) !== -1 ||
      // Allow: Ctrl+A, Command+A
      (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
      (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
      (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
      (e.keyCode === 190 && (e.ctrlKey === true || e.metaKey === true)) ||
      (e.keyCode === 110 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right, down, up
      (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode === 189 || e.keyCode === 32) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 90)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }
  /*======== alphanumeric  =========*/
  keyPress = (e) => {
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
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
    if (((e.keyCode < 48 || e.keyCode > 90)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode === 190 || e.keyCode === 46)) {
      e.preventDefault();
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


  getTechnicianList(){
     axios.get('api/personmaster/get/personlist/technician')        
    .then((response) => {
      var technicianList = response.data.map((a, i)=>{
        return {
          label  : a.firstName +" "+ a.middleName+" "+a.lastName,
          id             : a._id
        } 
      })
      this.setState({technicianList:technicianList})
    })
    .catch((error)=>{});
  }

 handleTechnician(event){
    var currentSelection = event.element.getAttribute("id");
    var technician_id = event.value;
    this.setState({technician_id:technician_id})
  }

   onChange(evt){
      var description = evt.editor.getData();
      this.setState({
        description: description
      },()=>{
        if(this.state.description){
          this.setState({
            messageError : ''
          });
        }else{
          this.setState({
            messageError : 'This field is required'
          });
        }
      });
    }
 
  modalClickEvent(){
    $('#modalId').addClass('in');
    $('#modalId').css('display','block');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }
 
 clientModalClickEvent(){
    $('#clientId').addClass('in');
    $('#clientId').css('display','block');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  contactPersonModalClickEvent(){
    $('#contactPersonId').addClass('in');
    $('#contactPersonId').css('display','block');
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

  recordingModalClickEvent(){
    $('#recordingId').addClass('in');
    $('#recordingId').css('display','block');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  cameraModalClickEvent(){
    $('#cameraId').addClass('in');
    $('#cameraId').css('display','block');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }


  swalMessage(){
    swal("Please select client first.");
  } 

  swalMessageRecording(){
    swal("Please select recording location first.");
  }


	render() {
    const allocatedTo: object = { text: 'label', value: 'id' };
    return(
      <div className="container-fluid">
          <div className="row">
            <div className="formWrapper">
              <section className="content">
                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                  <div className="row">
                    <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                      <h4 className="weighttitle col-lg-5 col-md-11 col-xs-11 col-sm-11">Create Support Ticket</h4>
                    </div>     
                    <section className="content">
                      <div className="row">
                        <div className="box-body">
                          <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
                            <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" id="ticketform">
    
                              <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 zzero"> 
                                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12" >
                                  <div className=""id="level">
                                    <label className="labelform">Client Name<span className="astrick">*</span></label>
                                    <div className="input-group" id="client_id_err" >   
                                      <select ref="clientName" name="clientName"  
                                        value={this.state.clientName} id='client_id' onChange={this.handleChange.bind(this)}
                                        className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox" required>
                                        <option value='--Select--'>--Select--</option>
                                         {
                                          this.state.clientArray && this.state.clientArray.length > 0 ?
                                          this.state.clientArray.map((client, index)=>{
                                            return(      
                                                <option key={index} id={client._id} value={client.companyName}>{client.companyName}</option>
                                            );
                                          }
                                        ) : ''
                                      }   
                                      </select>
                                        <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#clientId"  onClick={this.clientModalClickEvent.bind(this)} title="Add Client" ><i className="fa fa-plus "></i>
                                        </div>
                                    </div>  
                                  </div> 
                                </div>
                               
                                 
                                 <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12" >
                                   <div className=""id="department">
                                    <label className="labelform">Department & Project<span className="astrick">*</span></label>
                                    <div className="input-group" id="department_details_err" >    
                                      <select ref="department" name="department"  
                                        value={this.state.department} id="departmentValue" onChange={this.handleChange.bind(this)}
                                        className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox" disabled={this.state.client_id==="" ? true : false} required>
                                        <option>--Select--</option>
                                        {
                                            this.state.departmentsArray && this.state.departmentsArray.length > 0 ?
                                            this.state.departmentsArray.map((department, index)=>{
                                              return(      
                                                  <option key={index} id={department.departmentName+" - "+department.projectName} value={department.departmentName+"-"+department.projectName}>{department.departmentName+" - "+department.projectName}</option>
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
                                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                   <div className=""id="site">
                                      <label className="labelform">Location Name<span className="astrick">*</span></label>
                                        <div className="input-group" id="location_err" >  
                                          <select ref="site" name="site"value={this.state.site}  onChange={this.handleChange.bind(this)}
                                            className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox" disabled={this.state.client_id==="" ? true : false} required>
                                              <option>--Select--</option>
                                              {
                                                  this.state.siteArray && this.state.siteArray.length > 0 ?
                                                  this.state.siteArray.map((department, index)=>{
                                                    return(      
                                                        <option key={index} value={department.addressLine1}>{department.addressLine1}</option>
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
                                 <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12" >
                                  <div className=""id="level">
                                    <label className="labelform">Contact Person<span className="astrick">*</span></label>
                                    <div className="input-group" id="contact_person_err" >  
                                      <select ref="conatctPerson" name="contactPerson"  
                                        value={this.state.contactPerson} id={'contactPerson'} onChange={this.handleChange.bind(this)}
                                        className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox" disabled={this.state.client_id==="" ? true : false} required>
                                        <option value='--Select--'>--Select--</option>
                                         {
                                          this.state.contactPersonArray && this.state.contactPersonArray.length > 0 ?
                                          this.state.contactPersonArray.map((person, index)=>{
                                            return(      
                                                <option key={index} id={person.personID} value={person.firstName+" "+person.lastName}>{person.firstName+" "+person.lastName}</option>
                                            );
                                          }
                                        ) : ''
                                      }   
                                      </select>
                                       {this.state.client_id !== "" ?
                                        <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#contactPersonId"  onClick={this.contactPersonModalClickEvent.bind(this)} title="Add Contact Person" ><i className="fa fa-plus "></i>
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
                                 <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                   <div className=""id="site">
                                      <label className="labelform">Type of issue<span className="astrick">*</span></label>
                                         <div className="input-group" id="typeOfIssue" >   
                                          <select ref="typeOfIssue" name="typeOfIssue"  value={this.state.typeOfIssue}  onChange={this.handleChange.bind(this)}
                                            className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox" required>
                                              <option>--Select--</option>
                                              {
                                                  this.state.typeOfIssueArray && this.state.typeOfIssueArray.length > 0 ?
                                                  this.state.typeOfIssueArray.map((issue, index)=>{
                                                    return(      
                                                        <option key={index} value={issue.tasktype}>{issue.taskType}</option>
                                                    );
                                                  }
                                                ) : ''
                                              }   
                                        </select>
                                        <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#modalId"  onClick={this.modalClickEvent.bind(this)} title="Add Issue" ><i className="fa fa-plus "></i>
                                        </div>
                                    </div>  
                                   </div> 
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                  <div className=""id="project">
                                    <label className="labelform">Recording Location<span className="astrick">*</span></label>
                                      <div className="input-group" id="recordingLocationName_err" >
                                        <select ref="recordingLocationName" name="recordingLocationName" id="recordingLocationName" 
                                            value={this.state.recordingLocationName}  onChange={this.handleChange.bind(this)}
                                            className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox" disabled={this.state.client_id==="" ? true : false} required>
                                            <option>--Select--</option>
                                            {
                                                this.state.recordingLocationList && this.state.recordingLocationList.length > 0 ?
                                                this.state.recordingLocationList.map((recordingLocation, index)=>{
                                                  return(      
                                                      <option key={index} id={recordingLocation._id} value={recordingLocation.locationName}>{recordingLocation.locationName}</option>
                                                  );
                                                }
                                              ) : ''
                                            }   
                                        </select>
                                        {this.state.client_id !== "" ?
                                         <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#recordingId"  onClick={this.recordingModalClickEvent.bind(this)} title="Add recording Location" ><i className="fa fa-plus "></i>
                                          </div>
                                          :
                                          <div className="input-group-addon inputIcon plusIconBooking" onClick={this.swalMessage.bind(this)} title="Add Location" ><i className="fa fa-plus "></i>
                                          </div>
                                        }
                                    </div>  
                                  </div> 
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                                  <div className=""id="project">
                                    <label className="labelform">Camera Location</label>
                                    <div className="input-group" >
                                      <select ref="locationName" name="locationName"  
                                          value={this.state.locationName}  onChange={this.handleChange.bind(this)}
                                          id='cameraLocation'
                                          className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox" disabled={this.state.recordingLocation_id==="" ? true : false} required>
                                          <option>--Select--</option>
                                          {
                                              this.state.cameraLocationList && this.state.cameraLocationList.length > 0 ?
                                              this.state.cameraLocationList.map((cameraLocation, index)=>{
                                                return(      
                                                    <option key={index} id={cameraLocation._id} value={cameraLocation.locationName}>{cameraLocation.locationName}</option>
                                                );
                                              }
                                            ) : ''
                                          }   
                                       </select>
                                      {this.state.recordingLocation_id !== "" ?
                                        <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#cameraId"  onClick={this.cameraModalClickEvent.bind(this)} title="Add Camera Location" ><i className="fa fa-plus "></i>
                                        </div>
                                         :
                                        <div className="input-group-addon inputIcon plusIconBooking" onClick={this.swalMessageRecording.bind(this)} title="Add Location" ><i className="fa fa-plus "></i>
                                        </div>
                                      }
                                    </div> 
                                  </div> 
                                </div>
                              </div>
                              <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12 zzero">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                                  <div className="form-group formgroupheight col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                    <label className="labelform">Description</label>
                                    
                                    {/*<textarea name="description" value={this.state.description}  onChange={this.handleChange.bind(this)} 
                                      placeholder="Enter Description" className="form-control" ref="description" id="description"
                                      rows="8" required="" aria-required="true" required>
                                    </textarea>*/}
                                    <CKEditor activeClass="p15" id="editor"  className="templateName" content={this.state.description} events={{"change": this.onChange}}/>
                                  </div>
                                  <label className="redFont">{this.state.messageError}</label>
                                </div>  
                                <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 NOpadding ">
                                  <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Attach Image / Document (jpg, png, pdf)</label>
                                  </div>
                                  <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 nopadding">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginsBottom" id="hide">
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imageView" id="LogoImageUpOne">
                                        {this.state.gotTicketImage ?
                                          <img src="/images/loading.gif" className="img-responsive logoStyle"/>
                                          :
                                          <div><i className="fa fa-upload"></i> <br /></div>
                                        }  
                                        <input multiple onChange={this.imgBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="companyLogo" />
                                      </div>
                                    </div>
                                  </div>
                                  {
                                    this.state.imagesArray && this.state.imagesArray.length > 0 ?
                                      this.state.imagesArray.map((image, i) => {
                                        return (
                                           <div  key={i} className="col-lg-2 col-md-2 col-sm-12 col-xs-12 nopadding">
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  marginsBottom" id="hide">
                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imageView" id="LogoImageUpOne">
                                                <label className="labelform deleteImage  col-lg-12 col-md-12 col-sm-12 col-xs-12" id={i} onClick={this.deleteImage.bind(this)}>x</label>
                                                <embed src={image+"#toolbar=0"} className="img-responsive logoStyle" />
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })
                                      :
                                      null
                                  }
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 NOpadding ">
                                  <div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Attach Videos (mp4, avi, ogv)</label>
                                  </div>
                                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginsBottom" id="hide">
                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imageView" id="LogoImageUpOne">
                                        {this.state.gotTicketVideo ?
                                          <img src="/images/loading.gif" className="img-responsive logoStyle"/>
                                          :
                                          <div><i className="fa fa-upload"></i> <br /></div>
                                        }  
                                        <input multiple onChange={this.videoBrowse.bind(this)} id="LogoImageUp" type="file" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" title="" name="companyLogo" />
                                      </div>
                                    </div>
                                  </div>
                                  {
                                    this.state.videosArray && this.state.videosArray.length > 0 ?
                                      this.state.videosArray.map((video, i) => {
                                        return (
                                           <div  key={i} className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  marginsBottom" id="hide">
                                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imageView" id="LogoImageUpOne">
                                                <label className="labelform deleteImage  col-lg-12 col-md-12 col-sm-12 col-xs-12" id={i} onClick={this.deleteVideo.bind(this)}>x</label>
                                                <video width="100%" height="100%" className="img-responsive logoStyle" controls>
                                                  <source src={video} type="video/mp4" className="col-lg-12 noPad"/>
                                                </video>
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
                                {/* <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 zzero">
                                  <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                                    <label className="labelform">Service Request</label>
                                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                      <label className={this.state.serviceRequest === "Free" ? "btn toggleButton customToggleButtonPermission btn-secondary active" : "btn toggleButton customToggleButtonPermission btn-secondary"} value="Free" onClick={()=>this.setState({serviceRequest:"Free",cost:0})}>
                                        <input type="radio"
                                          name="options"
                                          id="free"
                                          value="free"
                                          autocomplete="off"
                                          checked
                                        />Free
                                    </label>
                                      <label className={this.state.serviceRequest === "Paid" ? "btn toggleButton customToggleButtonPermission btn-secondary active" : "btn toggleButton customToggleButtonPermission btn-secondary"} value="Paid" onClick={()=>this.setState({serviceRequest:"Paid"})}>
                                        <input type="radio" name="options" id="paid" value="paid" autocomplete="off" /> Paid
                                    </label>
                                    </div>
                                  </div>
                                  {this.state.serviceRequest === "Free" ?
                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                        <label className="labelform ">Allocate Ticket To</label>
                                        <MultiSelectComponent id="assignToTechnician" ref={(scope) => { this.technicianList = scope; }} 
                                            dataSource={this.state.technicianList}
                                            change={this.handleTechnician.bind(this)} mode='mode' 
                                            fields={allocatedTo} placeholder="Allocate Ticket To" mode="CheckBox" 
                                            selectAllText="Select All" unSelectAllText="Unselect All" 
                                            showSelectAll={true} 
                                            name="assignToTechnician"
                                            value={this.state.allocatedTo}
                                            required>
                                            <Inject services={[CheckBoxSelection]} />
                                        </MultiSelectComponent>
                                    </div>
                                    :
                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                      <label className="labelform">Cost</label>
                                      <span className="astrick">*</span>
                                        <div className='input-group col-lg-12 col-md-12 col-sm-12 col-xs-12' style={{'width':'150px'}}>
                                          <span className="input-group-addon"><i className="fa fa-rupee"></i></span>
                                          <input  placeholder="Enter Cost " value={this.state.cost}
                                           type="number" name="cost" ref="cost" onChange={this.handleChange.bind(this)}
                                           className="form-control areaStaes " title="Please Enter Value " autoComplete="off"  />
                                        </div>
                                   </div>
                                  }    
                                </div>*/}
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
          </div>
          <div className="modal" id="modalId" role="dialog">
            <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                      <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getTypeOfIssues.bind(this)}>&times;</button>
                 </div>
                </div>
                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <TaskTypes  editId={this.props.match.params.fieldID} editUrl= {this.props.match.params.id ? '/createticketmodal/'+this.props.match.params.id :'/createticketmodal'} />
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
           <div className="modal" id="contactPersonId" role="dialog">
            <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                      <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.setDropdowns.bind(this)}>&times;</button>
                 </div>
                </div>
                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <ContactPerson  modal={true}  entityID={this.state.client_id}   url="createticket"/>
                </div>  
             </div>
            </div>
          </div>
          <div className="modal" id="locationDetailsId" role="dialog">
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
          </div>
          <div className="modal" id="departmentDetailsId" role="dialog">
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
          </div>
           <div className="modal" id="recordingId" role="dialog">
            <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                      <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={()=>this.getRecodingLocation(this.state.client_id)}>&times;</button>
                 </div>
                </div>
                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                 <RecordingLocation modal={true} clientName={this.state.clientName}  client_id={this.state.client_id}  url="createticket"/>
                </div>  
             </div>
            </div>
          </div>
          <div className="modal" id="cameraId" role="dialog">
            <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                      <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={()=>this.getCameraLocation(this.state.recordingLocation_id)}>&times;</button>
                 </div>
                </div>
                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                 <CameraLocation modal={true} recordingLocationName={this.state.recordingLocationName}  recording_id={this.state.recordingLocation_id} url="createticket"/>
                </div>  
             </div>
            </div>
          </div>
           
        </div>
      );
  } 
}
