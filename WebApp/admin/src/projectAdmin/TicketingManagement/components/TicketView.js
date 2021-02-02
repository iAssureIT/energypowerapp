
import React, { Component } from 'react';
import { render }           from 'react-dom';
import $                    from "jquery";
import swal                 from 'sweetalert';
import jQuery               from 'jquery';
import axios                from 'axios';
import moment               from 'moment';
import '../css/TicketingManagement.css';
import ReactStars from "react-rating-stars-component";
import Loader           from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default class TicketingManagement extends Component {
	constructor(props) {
    super(props); 
    this.state = {  
        ticket_id : props.match.params ? props.match.params.ticket_id : '',
        technicianList: [],
        allocatedTo:[],
        status:[],
        showlength:3,
        isLoading:true,
        remark:"",
        review:""
    }; 
    this.handleChange    = this.handleChange.bind(this);
  }

  


  componentDidMount(){
    console.log("ticket_id",this.state.ticket_id);
    this.ticketDetails();

    $.validator.addMethod("regx1", function (value, element, arg) {  
      return arg !== value;
     }, "This field is required");

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    $("#closedTicketValid").validate({
      rules: {
        review: {
          required: true,
        },
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") == "review") {
          error.insertAfter("#review");
        }
      }
    })
    $("#reopenTicketValid").validate({
      rules: {
        remark: {
          required: true,
        },
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") == "remark") {
          error.insertAfter("#reopen");
        }
      }
    })
  }



  ticketDetails(){
     axios.get('/api/tickets/get/one/'+this.state.ticket_id)
        .then((response)=>{
        console.log("response",response);
        if(response.status == 200)
        { 
          this.setState({
            ticketId      : response.data.ticketId,
            clientName    : response.data.clientName,
            client_id    : response.data.client_id,
            department    : response.data.department,
            description   : response.data.description,
            images        : response.data.images,
            project       : response.data.project,
            site          : response.data.site,
            status        : response.data.status,
            statusValue   : response.data.statusValue,
            ticketId      : response.data.ticketId,
            typeOfIssue   : response.data.typeOfIssue,
            videos        : response.data.videos,
            serviceRequest: response.data.serviceRequest,
            contactPerson : response.data.contactPerson,
            cost          : response.data.cost,
            recordingLoc  : response.data.recordingLocation_id,
            cameraLoc     : response.data.cameraLocation_id,
            createdAt     : response.data.createdAt,
            is_type       : response.data.is_type,
            isLoading     : false
          },()=>{
            var currentStatus = [];
            var status = this.state.status;
            var allocated = this.state.status.filter(a=>a.value === "Allocated");
            var unique_allocated = [ ...new Map(allocated.map(item => [String(item.allocatedTo._id), item])).values()];
            console.log("unique",unique_allocated);
            for (var i = unique_allocated.length - 1; i >= 0; i--) {
              for (var j = status.length - 1; j >= 0; j--) {
                if(status[j].allocatedTo){
                  if(unique_allocated[i].allocatedTo &&  status[j].allocatedTo && unique_allocated[i].allocatedTo._id === status[j].allocatedTo._id){
                    currentStatus.push(status[j]);
                    break;
                  }
                }
              }
            }
            if(i<allocated.length){
              this.setState({currentStatus:currentStatus})
            }
          })
        }   
      
       })
      .catch((error)=>{
            console.log('error', error);
       });
  }

  getTechnicianList(){
      axios.get('api/personmaster/get/personlist/technician')        
      .then((response) => {
        console.log("this.state.status.",this.state.status);
        var technicianList = response.data.map((a, i)=>{
          return {
            label  : a.firstName +" "+ (a.middleName ? a.middleName : "")+" "+a.lastName,
            id     : a._id,
            checked: false,
            disabled:false,
          } 
        }) 
        console.log("technicianList",technicianList);
        for (var i = technicianList.length - 1; i >= 0; i--) {
          var allocated = this.state.status.filter(a=> a.allocatedTo);
          var myStatusArray = allocated.filter(a=> a.allocatedTo._id=== technicianList[i].id);
          if(myStatusArray && myStatusArray.length > 0){
            var myStatus = myStatusArray[myStatusArray.length-1].value; 
            if(myStatus!=="Assignee Rejected"){
              technicianList[i].disabled = true;
            }
          }
        }
        if(i < technicianList.length){
          this.setState({technicianList:technicianList})
        }
      })
      .catch((error)=>{
            console.log("error = ",error);
      });
    }

  setlectTechnician(event){
    var id=event.target.id;
    var technicianList=this.state.technicianList;
    console.log("id",id,event.target.checked);
    if(event.target.checked){
      for(let i=0; i <technicianList.length; i++){
        if(technicianList[i].id === id){
          technicianList[i].checked = true;
        }
      }
    }else{
      for(let i=0; i <technicianList.length; i++){
        if(technicianList[i].id === id){
          technicianList[i].checked = false;
        }
      }
    }
    this.setState({
      technicianList : technicianList,
    });
  }

  assignTechnician(event){
      var technician_id = this.state.technicianList.filter(e=>e.checked===true).map(e=>e.id);
      var tickets_id = this.state.ticket_id;
      if(technician_id && technician_id.length > 0){
        for (var i = technician_id.length - 1; i >= 0; i--) {
          var formValues ={
            tickets_id  : tickets_id,
            status      : {
                            value         : 'Allocated',
                            statusBy      : localStorage.getItem("user_ID"),
                            allocatedTo   : technician_id[i],
                            statusAt      :  new Date(),
                          },
            updatedBy   : localStorage.getItem("user_ID")  
          }
          axios.patch('/api/tickets/patch/ticket_allocation', formValues)
          .then((response)=>{
            if(response.data.updated){
              this.ticketDetails();
              for(let i=0; i <this.state.technicianList.length; i++){
                  this.state.technicianList[i].checked = false;
              }
              this.setState({allocatedTo:''})
              swal(response.data.message)
          }else{
            swal(response.data.message)
          }
          })
          .catch((error)=>{
                console.log('error', error);
           });
        }
    }else{
      swal("Please select technician.")
    }
  }

  closeTicket(){
    if ($('#closedTicketValid').valid()) {
      var payload = {
        ticket_id : this.state.ticket_id,
        status    : {
                      value    : "Closed",
                      statusBy : localStorage.getItem("user_ID"),
                      review   : this.state.review,
                      statusAt : new Date(),     
                    },
        updatedBy : localStorage.getItem("user_ID"),         
      };
      console.log("payload",payload);
      axios.patch('/api/tickets/patch/status', payload)
      .then((response)=>{
          this.ticketDetails();
          var userDetails = JSON.parse(localStorage.getItem("userDetails")) 
          var sendData = {
            "event": "Event10",  //Event Name
            "company_id": this.state.client_id, //company_id(ref:entitymaster)
            "otherAdminRole":'client',
            "variables": {
              'Username' : userDetails.firstName+" "+userDetails.lastName,
              'TicketId': this.state.ticketId,
              'CompanyName': this.state.clientName,
              'ClosedDate': moment().format("DD/MM/YYYY"),
            }
          }
          console.log("sendData",sendData);
          axios.post('/api/masternotifications/post/sendNotification', sendData)
          .then((res) => {
          console.log('sendDataToUser in result==>>>', res.data)
          })
          this.setState({
            review : ""
          })
          $('#closedTicket').addClass('out');
          $('#closedTicket').css('display','none');
          $('body').removeClass('modal-close');
          $('.modal-backdrop').remove();
      })
      .catch((error)=>{
        console.log("error",error);
      });
    }  
  }

  reopenTicket(){
    if ($('#reopenTicketValid').valid()) {
      var payload = {
        ticket_id : this.state.ticket_id,
        status    : {
                      value    : "Reopen",
                      statusBy : localStorage.getItem("user_ID"),
                      review   : this.state.remark,
                      statusAt : new Date(),     
                    },
        updatedBy : localStorage.getItem("user_ID"),         
      };
      console.log("payload",payload);
      axios.patch('/api/tickets/patch/reopen_ticket', payload)
      .then((response)=>{
          this.ticketDetails();
          var userDetails = JSON.parse(localStorage.getItem("userDetails")) ;
          console.log("userDetails",userDetails);
          var sendData = {
            "event": "Event8",  //Event Name
            "company_id": this.state.client_id, //company_id(ref:entitymaster)
            "otherAdminRole":'client',
            "variables": {
              'Username' : userDetails.firstName+" "+userDetails.lastName,
              'TicketId': this.state.ticketId,
              'CompanyName': this.state.clientName,
              'ClosedDate': moment().format("DD/MM/YYYY"),
            }
          }
          console.log("sendData",sendData);
          axios.post('/api/masternotifications/post/sendNotification', sendData)
          .then((res) => {
          console.log('sendDataToUser in result==>>>', res.data)
        })
          this.setState({
            remark : ""
          })
          $('#reopenTicket').addClass('out');
          $('#reopenTicket').css('display','none');
          $('body').removeClass('modal-close');
          $('.modal-backdrop').remove();
      })
      .catch((error)=>{
        console.log("error",error);
      });
    }  
  }
  
  handleChange(event){
    const target = event.target;
    const name   = target.name;
    this.setState({
     [name]: event.target.value,
    });

 }
 
	render() {
     const designationfields: object = { text: 'designation', value: 'designation' };
     const departmentfields: object = { text: 'department', value: 'department' };
     console.log("this.state.technicianList",this.state.technicianList);
      $(".arrow-left").click(function(){
        $(".scroll").animate({scrollLeft: "-="+110});
      });
      $(".arrow-right").click(function(){
          $(".scroll").animate({scrollLeft: "+="+110});
      }); 
      $(".arrow-left1").click(function(){
          $(".scroll1").animate({scrollLeft: "-="+110});
      });
      $(".arrow-right1").click(function(){
          $(".scroll1").animate({scrollLeft: "+="+110});
      }); 
       $(".arrow-left2").click(function(){
          $(".scroll2").animate({scrollLeft: "-="+110});
      });
      $(".arrow-right2").click(function(){
          $(".scroll2").animate({scrollLeft: "+="+110});
      }); 
      console.log("this.state.status",this.state.status);
      const rating= this.state.status.find(a=>a.value === "Closed");
      console.log("rating",rating);

     return (
      <div className="container-fluid">
          <div className="row">
              <div className="formWrapper">
                  <section className="content">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                      {this.state.isLoading ?
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 text-center" style={{marginTop:"300px"}}>
                          <Loader
                            type="TailSpin"
                            color={'var(--blue-color )'}
                            height="50"
                            width="50"
                          />
                        </div>   
                      : 
                      (<div className="row">
                         {/* <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                            <h4 className="weighttitle col-lg-5 col-md-11 col-xs-11 col-sm-11">Ticket View</h4>
                          </div>     */}
                          <section className="col-lg-12 col-md-12 col-xs-12 col-sm-12 content">
                          <div className='col-lg-8 col-md-8 col-xs-12 col-sm-12 marginTop8'  style={{'border-right': '1px solid #d4d4d4'}}>
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding"  style={{'border-bottom': '1px solid #d4d4d4'}}>
                              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding">  
                                <h4 className="col-lg-8 col-md-12 col-xs-12 col-sm-12 noPadding"><b><b className="text-primary">{this.state.ticketId}</b>{" - "+this.state.typeOfIssue}</b></h4>
                                {
                                   this.state.statusValue === "New"  || this.state.statusValue === "Reopen"?
                                    <h4 className="label label-primary pull-right"><b>{this.state.statusValue}</b></h4> 
                                    :
                                    this.state.statusValue === "Acknowledged"?
                                    <h5 className="label label-info pull-right"><b>{this.state.is_type === "Reopen" ? this.state.is_type+"-"+this.state.statusValue: this.state.statusValue}</b></h5> 
                                    :
                                    this.state.statusValue === "Paid Service Request" ?
                                     <h5 className="label label-orange pull-right"><b>{this.state.is_type === "Reopen" ? this.state.is_type+"-"+this.state.statusValue: this.state.statusValue}</b></h5>
                                    :
                                    this.state.statusValue === "Allocated"?
                                     <h4 className="label label-ligntGreen pull-right"><b>{this.state.is_type === "Reopen" ? this.state.is_type+"-"+this.state.statusValue: this.state.statusValue}</b></h4>
                                    :
                                    this.state.statusValue === "Assignee Rejected" || this.state.statusValue === "Paid Service Rejected"?
                                    <h5 className="label label-danger pull-right"><b>{this.state.is_type === "Reopen" ? this.state.is_type+"-"+this.state.statusValue: this.state.statusValue}</b></h5>
                                    :
                                    this.state.statusValue === "Resolved" ?
                                    <h5 className="label label-success pull-right"><b>{this.state.is_type === "Reopen" ? this.state.is_type+"-"+this.state.statusValue: this.state.statusValue}</b></h5>
                                    :
                                    this.state.statusValue === "Work Started"  || this.state.statusValue === "Work In Progress" ?
                                    <h5 className="label label-warning pull-right"><b>{this.state.is_type === "Reopen" ? this.state.is_type+"-"+this.state.statusValue: this.state.statusValue}</b></h5>
                                     :
                                    this.state.statusValue === "Paid Service Approved"?
                                    <h5 className="label label-purple pull-right"><b>{this.state.is_type === "Reopen" ? this.state.is_type+"-"+this.state.statusValue: this.state.statusValue}</b></h5>
                                    :
                                    this.state.statusValue === "Assignee Accepted" ?
                                    <h5 className="label label-fuchsia pull-right"><b>{this.state.is_type === "Reopen" ? this.state.is_type+"-"+this.state.statusValue: this.state.statusValue}</b></h5>
                                    :
                                    this.state.statusValue === "Closed" ?
                                     <h5 className="label label-teal pull-right"><b>{this.state.is_type === "Reopen" ? this.state.is_type+"-"+this.state.statusValue: this.state.statusValue}</b></h5>
                                    :
                                    null
                                }
                              </div>  
                              <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                                <h5><b>Date :</b> {moment(this.state.createdAt).format('DD-MM-YYYY LT')}</h5>
                              </div>
                              <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                                <h5><b>Client Name :</b> {this.state.clientName}</h5>
                              </div>
                              <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                                <h5><b>Project :</b> {this.state.department+" - "+this.state.project}</h5>
                              </div>
                             
                               <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                                <h5><b>Service Request :</b> {this.state.serviceRequest ? this.state.serviceRequest : "NA"}</h5>
                              </div>
                              {
                                this.state.cost ?
                                <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                                  <h5><b>Cost :</b> {this.state.cost}</h5>
                                </div>
                                :
                                null
                              }
                               <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                                <h5><b>Raised by :</b> {this.state.contactPerson ? this.state.contactPerson : "NA"}</h5>
                              </div>
                              <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
                                <h5><b>Reported By :</b> {this.state.status && this.state.status.length > 0 ? this.state.status[0].statusBy.profile.fullName : "NA"}</h5>
                              </div>
                               <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                <h5><b>Location :</b> {this.state.site}</h5>
                              </div>
                            </div>
                             <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 marginTop17 noPadding"  style={{'border-bottom': '1px solid #d4d4d4'}}>
                              <h4><b>Description</b></h4>
                               <p dangerouslySetInnerHTML={{ __html:this.state.description}} className="textAreaBox col-lg-12 col-md-12 col-sm-12 col-xs-12"></p>
                            </div> 
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 marginTop17 noPadding" style={{'border-bottom': '1px solid #d4d4d4'}}>
                              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding" style={{'margin-bottom': '15px'}}>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding">
                                  <h4 className="col-lg-10 noPadding"><b>Attachments</b></h4>
                                  {this.state.images && this.state.images.length > 4 ?
                                    <div className="col-lg-2 col-md-2 col-xs-12 col-sm-12 noPadding  pull-right" style={{width:'70px'}}>
                                      <button  type="button" className='col-lg-5 btn arrow-left  btn-default pull-left' style={{ width:"30px",height:'30px',}}title="Left Scroll"><i className="fa fa-chevron-left"/></button>
                                      <button type="button" className='col-lg-5 btn arrow-right  btn-default pull-right' style={{ width:"30px",height:'30px',}} title="Right Scroll"><i className="fa fa-chevron-right"/></button>
                                    </div>
                                    :
                                    null
                                  }
                                </div>      
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding scroll">
                                  {this.state.images && this.state.images.length > 0 ?
                                    this.state.images.map((image,index)=>{
                                      return(
                                        <a href={image} target="_blank"  className="imageOuterContainerDM" title="Click to View">  <embed src={image} style={{'height':'120px',width:'150px',marginRight:'15px','border': '1px solid #d4d4d4'}} /></a>
                                      )
                                    })
                                    :
                                    <img src="/images/noImagePreview.png" className="col-lg-2"/>
                                  }
                               </div>   
                              </div>
                              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding" style={{'margin-bottom': '15px'}}>
                                <h4><b>Videos</b></h4>
                                {this.state.videos && this.state.videos.length > 0 ?
                                  this.state.videos.map((video,index)=>{
                                    return(
                                      <video className="col-lg-4 noPadding" height={'150px'} controls>
                                        <source src={video}  type="video/mp4" />
                                      </video>
                                    )
                                  })
                                  :
                                  <img src="/images/noImagePreview.png" className="col-lg-2"/>
                                }
                              </div>
                             </div> 
                             <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding marginTop17">
                              <h4><b>Activity</b></h4>
                              {this.state.status && this.state.status.length > 0 ?
                                this.state.status.slice(0, this.state.showlength).map((item,index)=>{
                                  return(
                                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 marginTop8" style={{background:"#eee",padding:'10px'}}>
                                         <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                            <span className="text-primary">{item.value} </span>
                                            <span>{item.value === "Allocated" && item.allocatedTo ? " To " + item.allocatedTo.firstName+"  "+item.allocatedTo.lastName : null}</span>
                                            {<span  style={{'text-transform':'capitalize'}}> By {item.statusBy.profile.fullName}</span>}
                                            {" At "+ moment(item.statusAt).format('DD-MM-YYYY LT')}
                                          </div>  
                                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 marginTop8">
                                            {
                                              item.remark ?
                                              <span><b>Remark: </b>{item.remark}</span>  
                                              :
                                              null 
                                            }
                                          </div>
                                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 marginTop8">
                                            {item.images && item.images.length > 0 ?
                                              item.images.map((image,index)=>{
                                                return(
                                                  <a href={image} target="_blank"  className="imageOuterContainerDM" title="Click to View">  <embed src={image} style={{'height':'100px',width:'100px',marginRight:'15px','border': '1px solid #d4d4d4'}} /></a>
                                                )
                                              })
                                              :
                                              null
                                            }
                                            {item.videos && item.videos.length > 0 ?
                                              item.videos.map((video,index)=>{
                                                return(
                                                  <video className="noPadding" style={{'height':'100px',width:'100px',marginRight:'15px','border': '1px solid #d4d4d4'}} controls>
                                                    <source src={video}  type="video/mp4" />
                                                  </video>
                                                )
                                              })
                                              :
                                              null
                                            }
                                          </div>  
                                     </div>
                                  );
                                })
                                :
                                null
                              }
                             {this.state.status.length > 3 ?
                                this.state.showlength === this.state.status.length ?
                                <a onClick={()=>this.setState({showlength:3})}> <span className="pull-right cursor mt20">{"<< View less"}</span></a>
                                :
                               <a onClick={()=>this.setState({showlength:this.state.status.length})}> <span className="pull-right cursor mt20">{"View More >>"}</span></a>
                                :
                                null
                              }
                             </div>
                           </div>
                          <div className='col-lg-4 col-md-4 col-xs-12 col-sm-12'>
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding" style={{'border-bottom': '1px solid #d4d4d4'}}>
                              <div className="col-lg-12 marginTop8 noPadding">
                                <h4 className="col-lg-10 noPadding"><b>Assigned To</b></h4>
                                {
                                this.state.statusValue ===  "New"  ||this.state.statusValue === "Acknowledged" || this.state.statusValue === "Paid Service Request" ?   
                                  this.state.statusValue === "Acknowledged" && this.state.serviceRequest==="Free" ?
                                    <div className="col-lg-2 noPadding plus pull-right" data-toggle="modal" title="Add Technician" data-target={"#assigedTo"} onClick={this.getTechnicianList.bind(this)}></div>
                                  :
                                   null
                                :
                                this.state.statusValue === "Resolved"|| this.state.statusValue === "Closed" ?
                                null
                                :
                                 <div className="col-lg-2 noPadding plus pull-right" data-toggle="modal" title="Add Technician" data-target={"#assigedTo"} onClick={this.getTechnicianList.bind(this)}></div>
                              }
                              </div>  
                              {this.state.currentStatus && this.state.currentStatus.length > 0 ?
                                this.state.currentStatus.map((item,index)=>{
                                  return(  
                                    <div className="col-lg-12" style={{'border':'1px solid #d4d4d4',"padding":"15px",'marginBottom':'15px'}}>
                                      <h5 className="col-lg-12 noPadding"><b>{item.allocatedTo.firstName + " " + item.allocatedTo.lastName}</b><span>{" - "+item.allocatedTo.contactNo}</span></h5> 
                                      
                                      <h5 className=""><b>Action On</b> {moment(item.statusAt).format('DD-MM-YYYY LT')}</h5> 
                                      {
                                         item.value === "New"  || item.value === "Reopen"?
                                          <h5 className="label label-primary"><b>{item.value}</b></h5> 
                                          :
                                          item.value === "Acknowledged"?
                                          <h5 className="label label-info"><b>{item.value}</b></h5> 
                                          :
                                          item.value === "Paid Service Request" ?
                                           <h5 className="label label-orange"><b>{item.value}</b></h5>
                                          :
                                          item.value === "Allocated"?
                                           <h5 className="label label-ligntGreen"><b>{item.value}</b></h5>
                                          :
                                          item.value === "Assignee Rejected" || item.value === "Paid Service Rejected"?
                                          <h5 className="label label-danger"><b>{item.value}</b></h5>
                                          :
                                          item.value === "Resolved" ?
                                          <h5 className="label label-success"><b>{item.value}</b></h5>
                                          :
                                          item.value === "Work Started"  || item.value === "Work In Progress" ?
                                          <h5 className="label label-warning"><b>{item.value}</b></h5>
                                           :
                                          item.value === "Paid Service Approved"?
                                          <h5 className="label label-purple"><b>{item.value}</b></h5>
                                          :
                                          item.value === "Assignee Accepted" ?
                                          <h5 className="label label-fuchsia"><b>{item.value}</b></h5>
                                          :
                                          item.value === "Closed" ?
                                           <h5 className="label label-teal"><b>{item.value}</b></h5>
                                          :
                                          null
                                      }
                                    </div>
                                  );    
                                })
                                :
                                <h5>No Technician Allocated</h5>
                              }
                              
                            </div> 
                            {this.state.statusValue === "Resolved" &&
                              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding  mt20" style={{'border-bottom': '1px solid #d4d4d4',"paddingBottom":"15px"}}>
                                  <div className="col-lg-8 col-lg-offset-2 col-md-12 col-xs-12 col-sm-12">  
                                    <button className="btn pull-left btn-teal" data-toggle="modal" title="Closed Ticket" data-target="#closedTicket">Closed</button>
                                    <button className="btn pull-right btn-primary" data-toggle="modal" title="Reopen Ticket" data-target="#reopenTicket">Reopen</button>
                                  </div>  
                              </div>   
                            }
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding marginTop17" style={{'border-bottom': '1px solid #d4d4d4'}}>
                              <h4><b>Project Details</b></h4>
                              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding">
                                <h5><b>{this.state.recordingLoc ? this.state.recordingLoc.locationName : null}</b></h5>
                                <h5 style={{lineHeight:'1.5'}}>{this.state.recordingLoc ? (this.state.recordingLoc.address[0].addressLine2 ? this.state.recordingLoc.address[0].addressLine2+", ":"")+this.state.recordingLoc.address[0].addressLine1 : null}</h5>
                              </div>
                              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding">
                               <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding">
                                  <h5 className="col-lg-8 noPadding"><b>Images</b></h5>
                                  {this.state.recordingLoc && this.state.recordingLoc.images.length > 2 ?
                                    <div className="col-lg-2 col-md-2 col-xs-12 col-sm-12 noPadding  pull-right" style={{width:'70px'}}>
                                      <button  type="button" className='col-lg-5 btn arrow-left1  btn-default pull-left' style={{ width:"30px",height:'30px',}}title="Left Scroll"><i className="fa fa-chevron-left"/></button>
                                      <button type="button" className='col-lg-5 btn arrow-right1  btn-default pull-right' style={{ width:"30px",height:'30px',}} title="Right Scroll"><i className="fa fa-chevron-right"/></button>
                                    </div>
                                    :
                                    null
                                  }
                                </div>    
                               <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 marginTop8 noPadding scroll1">
                                  {this.state.recordingLoc && this.state.recordingLoc.images.length > 0 ?
                                    this.state.recordingLoc.images.map((image,index)=>{
                                      return(
                                         <a href={image} target="_blank"  className="imageOuterContainerDM" title="Click to View"><img src={image}  style={{'height':'100px','width':'120px',marginRight:'15px','border': '1px solid #d4d4d4'}}/></a>
                                      )
                                    })
                                    :
                                    null
                                  }
                                  </div>
                              </div>
                              <div clientName="marginTop17 col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 noPadding">
                                  <h5><b>Industry :</b> {this.state.recordingLoc ? this.state.recordingLoc.brand : null}</h5>
                                </div>
                                <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 noPadding">
                                  <h5><b>Process :</b> {this.state.recordingLoc ? this.state.recordingLoc.maxchannels : null}</h5>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding">
                                  <h5><b>Division :</b> {this.state.recordingLoc ? this.state.recordingLoc.recorderType : null}</h5>
                                </div>
                              </div>  
                            </div>
                            {this.state.cameraLoc ?
                              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding marginTop17" style={{'border-bottom': '1px solid #d4d4d4'}}>
                                <h4><b>Equipment Details</b></h4>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding">
                                  <h5><b>{this.state.cameraLoc ? this.state.cameraLoc.locationName : null}</b></h5>
                                  <h5 style={{lineHeight:'1.5'}}>{this.state.cameraLoc ? (this.state.cameraLoc.address[0].addressLine2 ? this.state.cameraLoc.address[0].addressLine2+", ":"")+this.state.cameraLoc.address[0].addressLine1 : null}</h5>
                                </div>
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding">
                                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding">
                                  <h5 className="col-lg-8 noPadding"><b>Images</b></h5>
                                  {this.state.cameraLoc && this.state.cameraLoc.images.length > 2 ?
                                    <div className="col-lg-2 col-md-2 col-xs-12 col-sm-12 noPadding  pull-right" style={{width:'70px'}}>
                                      <button  type="button" className='col-lg-5 btn arrow-left2  btn-default pull-left' style={{ width:"30px",height:'30px',}}title="Left Scroll"><i className="fa fa-chevron-left"/></button>
                                      <button type="button" className='col-lg-5 btn arrow-right2  btn-default pull-right' style={{ width:"30px",height:'30px',}} title="Right Scroll"><i className="fa fa-chevron-right"/></button>
                                    </div>
                                    :
                                    null
                                  }
                                </div>    
                                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 marginTop8 noPadding scroll2">
                                    {this.state.cameraLoc && this.state.cameraLoc.images.length > 0 ?
                                      this.state.cameraLoc.images.map((image,index)=>{
                                        return(
                                           <a href={image} target="_blank"  className="imageOuterContainerDM" title="Click to View"><img src={image} style={{'height':'100px',width:"120px",marginRight:'15px','border': '1px solid #d4d4d4'}} /></a>
                                        )
                                      })
                                      :
                                      null
                                    }
                                  </div>  
                                </div>
                                <div clientName="marginTop17 col-lg-12 col-md-12 col-xs-12 col-sm-12">
                                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding">
                                    <h5><b>Industry :</b> {this.state.cameraLoc ? this.state.cameraLoc.cameraBrand : null}</h5>
                                  </div>
                                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding">
                                    <h5><b>Equipment Specifications :</b> {this.state.cameraLoc ? this.state.cameraLoc.cameraType : null}</h5>
                                  </div>
                                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding">
                                    <h5><b>Actual Performance :</b> {this.state.cameraLoc ? this.state.cameraLoc.cameraResolution : null}</h5>
                                  </div>
                                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding">
                                    <h5><b>Url/IP :</b> {this.state.cameraLoc ? this.state.cameraLoc.cameraUrl : null}</h5>
                                  </div>
                                </div>  
                              </div>
                              :
                              null
                            }
                            {rating ?
                              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding marginTop17" style={{'border-bottom': '1px solid #d4d4d4'}}>
                                <h4><b>Client Rating</b></h4>
                                <ReactStars
                                  count={5}
                                  size={24}
                                  value={rating.rating}
                                  isHalf={true}
                                  edit={false}
                                  emptyIcon={<i className="far fa-star"></i>}
                                  halfIcon={<i className="fa fa-star-half-alt"></i>}
                                  fullIcon={<i className="fa fa-star"></i>}
                                  activeColor="#ffd700"
                                />
                                {rating.review ?
                                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 noPadding">
                                    <h5><b>Review :</b> {rating.review}</h5>
                                  </div>
                                  :
                                  null
                                }  
                              </div>
                              :
                              null
                             } 
                           </div> 
                          </section>
                      </div>)}
                    </div>
                  </section>
              </div>
          </div>
          <div className="modal" id="closedTicket" role="dialog">
            <div className=" adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="modal-content adminModal-content col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                    <button type="button" className="adminCloseButton" data-dismiss="modal" data-target="#closedTicket">&times;</button>
                  </div>

                </div>
                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 " id="closedTicketValid"> 
                        <label className="labelform new_statelabel locationlabel">Reason<span className="astrick">*</span></label>
                        <textarea rows="4" cols="50" placeholder="Enter Reason..." id="review"  value={this.state.review}
                          type="text" name="review" ref="review" onChange={this.handleChange}
                          className="form-control areaStaes " title="Please enter reason." autoComplete="off"  required
                        />
                    </form>
                </div>

                <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <button type="button" className="btn adminCancel-btn col-lg-7 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <button onClick={this.closeTicket.bind(this)} type="button" className="btn  btn-success col-lg-7 col-lg-offset-5 col-md-7 col-md-offset-5 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" style={{boxShadow: '2px 2px 9px -2px #555'}}>Closed</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal" id="reopenTicket" role="dialog">
            <div className=" adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="modal-content adminModal-content col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                    <button type="button" className="adminCloseButton" data-dismiss="modal" data-target="#reopenTicket">&times;</button>
                  </div>

                </div>
                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 " id="reopenTicketValid"> 
                        <label className="labelform new_statelabel locationlabel">Reason<span className="astrick">*</span></label>
                        <textarea rows="4" cols="50" placeholder="Enter Reason..." id="reopen"  value={this.state.remark}
                          type="text" name="remark" ref="remark" onChange={this.handleChange}
                          className="form-control areaStaes " title="Please enter reason." autoComplete="off"  required
                        />
                    </form>
                </div>

                <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <button type="button" className="btn adminCancel-btn col-lg-7 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <button onClick={this.reopenTicket.bind(this)} type="button" className="btn  btn-success col-lg-7 col-lg-offset-5 col-md-7 col-md-offset-5 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" style={{boxShadow: '2px 2px 9px -2px #555'}}>Reopen</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal" id={"assigedTo"} role="dialog">
            <div className=" adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="modal-content adminModal-content col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                    <button type="button" className="adminCloseButton" data-dismiss="modal" data-target={"#assigedTo"}>&times;</button>
                  </div>

                </div>
                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="col-lg-12">
                    {this.state.technicianList && this.state.technicianList.length > 0 ?
                      this.state.technicianList.map((item,index)=>{
                          return(
                            <div className="col-lg-12">
                              <input type="checkbox" disabled={item.disabled} className='col-lg-1 check individual pointer propCheck' checked={item.checked} id={item.id} onClick={this.setlectTechnician.bind(this)} value={item._id}/>
                                <div className="col-lg-11 col-md-11 col-sm-12 col-xs-12"> 
                                  <label for={item.id} className="marginTop8 pointer" style={{"cursor":"pointer"}}>{item.label}</label>
                                  {item.disabled &&<span className="marginTop8 pointer text-danger"> (Already Assigned)</span>} 
                                </div>
                            </div>
                          )
                      })
                      :
                      "No technician Allocated"
                    }
                    </div>
                </div>

                <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <button type="button" className="btn adminCancel-btn col-lg-7 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <button onClick={this.assignTechnician.bind(this)} type="button" className="btn  btn-success col-lg-7 col-lg-offset-5 col-md-7 col-md-offset-5 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" style={{boxShadow: '2px 2px 9px -2px #555'}} data-dismiss="modal">Allocate</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      );
  } 
}
