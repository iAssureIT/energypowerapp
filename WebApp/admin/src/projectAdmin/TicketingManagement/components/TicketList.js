import React, { Component } from 'react';
import { render }           from 'react-dom';
import $                    from "jquery";
import swal                 from 'sweetalert';
import axios                from 'axios';
import IAssureTable         from './IAssureTable.js';
import moment from 'moment';
import { CheckBoxSelection, Inject, MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';

const openStatus = [
    'New',
    'Acknowledged',
    'Allocated',
    'Assignee Accepted',
    'Assignee Rejected',
    'Resolved',
    'Work Started',
    'Work In Progress',
    'Reopen',
    'Paid Service Request',
    'Paid Service Approved',
    'Paid Service Rejected',
    'Resolved'
    ];

// import MyMap from '/imports/admin/map/MyMap.js'; 
 const filterData = {
      pageNumber    : 0,
      nPerPage      : 10,
      ticketId      : '',
      client_id     : '',
      issue         : '', 
      status        : openStatus,
      serviceRequest: ['Free','Paid',null],
      technician_id : '',     
      searchText    : '', 
      date          : '',
  }
export default class ListOfCameraLocations extends Component{

  constructor(props) {
    super(props);
    this.state = {
     "tableHeading": {
        ticketId       : "Ticket ID",
        client         : "Client",
        // project        : "Project",
        typeOfIssue    : "Issue",
        displayStatus  : "Status",
        displayServiceReq : "Service Request",
        assignTo       : "Allocated To",
        createdAt      : "Created At",
        actions        : 'Action',
      },
      "tableObjects"  :{
            deleteMethod     : 'patch',
            apiLink          : '/api/tickets/',
            downloadApply    : true,
            paginationApply  : true,
            searchApply      : false,
            checkedBox       : true,
            serialNo         : false,
            editUrl          : '/createticket',
            listUrl          : '/ticketlist'
        },
    "editId"              : props.match.params ? props.match.params.id : '',
      searchData            : '',
      limitRange            : '',
      clientArray           : [],
      typeOfIssueArray      : [],
      technicianList        : [],
      client_id             : '',
      clientName            : '',
      status                : '',
      date                  : '',
      ticketId              : '',
      issue                 : '',
      tableData             : [],
      totalCount            : 0,
      openCount            : 0,
      closeCount            : 0,
      dataCount            : 0,
      deletedTickets        : [],
      isLoading             : true
    };
  }

   handleChange(event){
     const target = event.target;
     const name   = target.name;
     this.setState({
      [name]: event.target.value,
     });
  }
   componentWillReceiveProps(nextProps){
    if(nextProps){
      var editId = nextProps.match.params.id;
      if(nextProps.match.params.id){
        this.setState({
          editId : editId
        },()=>{
          this.edit(this.state.editId);
        })
      }
    }
  }
 
  componentDidMount(){
    var editId = this.props.match.params.id;
    if(editId){     
      this.edit(editId);
    }
    this.getData(filterData);
  }

  getData(filterData){
    axios.post('/api/tickets/post/list',filterData)
    .then((response)=>{
      var tabledata = response.data.map((a,i)=>{
        return{
            checked           : false,
             _id              : a._id,
            ticketId          : "<div class='idWrap'><a target='_blank' href="+'/ticketview/'+a._id+">"+"<span class='label label-primary' style={{'color':'#fff'}}>"+(a.ticketId)+"</span></a></div>",
            ticketID          : a.ticketId,
            client            : "<div class='tdWrap'><a target='_blank' href="+'/company-profile/'+a.client_id+">"+(a.clientName+" ("+(a.companyID)+")</a><div><b>Raised By   : </B><a target='_blank' href="+'/employee-profile/'+a.contactPerson_id+">"+(a.contactPerson)+"</a></div>")+"</div>",
            // project           : "<div class='tdWrap'>"+a.project+"</div>",
            typeOfIssue       :"<div class='tdWrap'>"+ a.typeOfIssue+"</div>",
            displayStatus     : a.statusValue === "New"  || a.statusValue === "Reopen"?
                                "<div class='tdStatusWrap'><span class='label label-primary' style={{'color':'#fff'}}>"+(a.statusValue)+"</span></div>"
                                :
                                a.statusValue === "Acknowledged"?
                                "<div class='tdStatusWrap'><span class='label label-info' style={{'color':'#fff'}}>"+(a.is_type === "Reopen" ? a.is_type+"-"+a.statusValue:a.statusValue)+"</span></div>"
                                :
                                a.statusValue === "Paid Service Request"?
                                "<div class='tdStatusWrap'><span class='label label-orange' style={{'color':'#fff'}}>"+(a.is_type === "Reopen" ? a.is_type+"-"+a.statusValue:a.statusValue)+"</span></div>"
                                :
                                a.statusValue === "Allocated"?
                                "<div class='tdStatusWrap'><span class='label label-ligntGreen' style={{'color':'#fff'}}>"+(a.is_type === "Reopen" ? a.is_type+"-"+a.statusValue:a.statusValue)+"</span></div>"
                                :
                                a.statusValue === "Assignee Rejected" || a.statusValue === "Paid Service Rejected"?
                                "<div class='tdStatusWrap'><span class='label label-danger' style={{'color':'#fff'}}>"+(a.is_type === "Reopen" ? a.is_type+"-"+a.statusValue:a.statusValue)+"</span></div>"
                                :
                                a.statusValue === "Resolved" ?
                                "<div class='tdStatusWrap'><span class='label label-success' style={{'color':'#fff'}}>"+(a.is_type === "Reopen" ? a.is_type+"-"+a.statusValue:a.statusValue)+"</span></div>"                              
                                :
                                a.statusValue === "Work Started"  || a.statusValue === "Work In Progress" ?
                                "<div class='tdStatusWrap'><span class='label label-warning' style={{'color':'#fff'}}>"+(a.is_type === "Reopen" ? a.is_type+"-"+a.statusValue:a.statusValue)+"</span></div>"
                                 :
                                a.statusValue === "Paid Service Approved"  ?
                                "<div class='tdStatusWrap'><span class='label label-purple' style={{'color':'#fff'}}>"+(a.is_type === "Reopen" ? a.is_type+"-"+a.statusValue:a.statusValue)+"</span></div>"
                                :
                                a.statusValue === "Assignee Accepted" ?
                                "<div class='tdStatusWrap'><span class='label label-fuchsia' style={{'color':'#fff'}}>"+(a.is_type === "Reopen" ? a.is_type+"-"+a.statusValue:a.statusValue)+"</span></div>"
                                :
                                 a.statusValue === "Closed" ?
                                "<div class='tdStatusWrap'><span class='label label-teal' style={{'color':'#fff'}}>"+(a.is_type === "Reopen" ? a.is_type+"-"+a.statusValue:a.statusValue)+"</span></div>"
                                :
                                null
                                ,
           displayServiceReq   : a.serviceRequest === "Paid" && a.cost? 
                                "<div class='tdWrap'> Pay ₹"+ a.cost+"</div>"
                                : 
                                a.serviceRequest? 
                                    "<div class='tdWrap'>"+a.serviceRequest+"</div>"
                                :null,
            status            : a.statusValue,
            serviceRequest    : a.serviceRequest ? a.serviceRequest : null,                    
            assignTo          : a.technicianDetails && a.technicianDetails.length > 0 ? a.technicianDetails.map(e=>{return("<div class='tdWrap'><a target='_blank' href="+'/employee-profile/'+e._id+">"+e.firstName+" "+(e.middleName ? e.middleName : "")+" "+e.lastName+"</a></div>")}).join("") :"<div class='tdWrap'>NA</div>",
            createdAt         : "<div class='tdWrap'>"+moment(a.createdAt).format('MM/DD/YYYY LT')+"</div>",
          }
        })
        this.setState({
          tableData : tabledata,
          isLoading : false,
          ticketList : response.data
        })
      })
      .catch(function(error){
        console.log("error = ",error);
      });
     
      axios.post('/api/tickets/get/paginationcount',filterData)
      .then((response)=>{
        this.setState({
          dataCount : response.data,
        })
      })
      .catch(error=>{
        console.log("error = ",error);
      });

      axios.post('/api/tickets/get/totalcount',filterData)
      .then((response)=>{
        this.setState({
          totalCount : response.data.totalcount,
          openCount : response.data.opencount,
          closeCount : response.data.closecount,
        })
      })
      .catch(error=>{
        console.log("error = ",error);
      });
  }

 updateStatus(event){
    event.preventDefault()
    var formValues ={
        ticket_id  : event.currentTarget.id,
        status      : {
                        value         : 'Acknowledged',
                        statusBy      : localStorage.getItem("user_ID"),
                        statusAt      :  new Date(),
                      },
        updatedBy   : localStorage.getItem("user_ID")  
      }
      var ticket = this.state.ticketList.find(elem=>elem._id ===event.currentTarget.id);
      console.log("ticket",ticket);
      axios.patch('/api/tickets/patch/status', formValues)
      .then((response)=>{
        this.getData(filterData);
        var sendData = {
          "event": "Event2", //Event Name
          "company_id": ticket.client_id, //company_id(ref:entitymaster)
          "otherAdminRole":'client',
          "variables": {
            'TicketId': ticket.ticketId,
            'CompanyName': ticket.clientName,
            'RaisedBy' :ticket.contactPerson,
            'TypeOfIssue': ticket.typeOfIssue,
            'CreatedAt': moment().format("DD/MM/YYYY"),
          }
        }
        console.log("sendData",sendData);
        axios.post('/api/masternotifications/post/sendNotification', sendData)
        .then((res) => {
        console.log('sendDataToUser in result==>>>', res.data)
        })
      })
      .catch((error)=>{
            console.log('error', error);
       });
  }

  deletedTickets(){
    axios.get("/api/tickets/get/deleted")
    .then((response) => {
         this.setState({deletedTickets:response.data})
    })
    .catch((error) => {
    })
  }

  restoreTicket(event){
    event.preventDefault();
    var ticket_id = event.currentTarget.getAttribute('data-id')
    axios.patch("/api/tickets/restore/delete/"+ticket_id)
    .then((response) => {
      this.deletedTickets();
      this.getData(filterData);
       if(response.data) {
          swal({
            title : " ",
                text : "Record is restored successfully.",
             });
        } else{
          swal({
            title : " ",
                text : "Failed to restore.",
              });
        }
    })
    .catch((error) => {
    })
  }


  deleteTicket(event){
    event.preventDefault();
    this.setState({ticket_id: event.currentTarget.getAttribute('data-id')})
    $('#deleteModal').show();
  }



    closeModal(event){
      event.preventDefault();
      $('#deleteModal').hide(); 
    }

    confirmDelete(event){
      event.preventDefault();
        axios.delete("/api/tickets/permanent/delete/"+this.state.ticket_id)
        .then((response)=>{
            $('#deleteModal').hide();  
            this.deletedTickets(); 
          if (response.data) {
            swal({
                  title : " ",
                  text :  "Record is deleted successfully."
                });
          } else{
            swal({
                  title : " ",
                  text  : "Failed to delete.",
                });
          }
            this.getData(filterData);
        })
        .catch((error)=>{
        })
    }

  render() {
      const allocatedTo: object = { text: 'label', value: 'id' };
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="formWrapper">
                        <section className="content">
                          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                            <div className="row">
                                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                  <h4 className="weighttitle col-lg-5 col-md-11 col-xs-11 col-sm-11">Ticket List</h4>
                                    <div className="col-lg-5 col-md-12 col-sm-12 col-xs-12 pull-right">
                                       <a href="/createticket">
                                          <span className="col-lg-5 col-lg-offset-1 sentanceCase addButtonList"><i  className="fa fa-plus-circle"></i>&nbsp;&nbsp;Create Ticket
                                          </span>
                                      </a>  
                                      <button type="button" className="btn col-lg-5 col-lg-offset-1 sentanceCase addButtonList deleteemplist" data-toggle="modal" data-target="#DeletedTicketsModal" onClick={this.deletedTickets.bind(this)}><i  className="fa fa-minus-circle"></i>&nbsp;&nbsp;Deleted Tickets
                                      </button>
                                    </div>
                                </div>     
                                <section className="content ">
                                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding box-header with-border">                  
                                  <h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12 nopadding">Total Tickets :&nbsp;&nbsp;<b>{this.state.totalCount}</b></h5>
                                  <h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12 nopadding">Open Tickets :&nbsp;&nbsp;<b>{this.state.openCount}</b></h5>
                                  <h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12 nopadding">Close Tickets :&nbsp;&nbsp;<b>{this.state.closeCount}</b></h5>
                                  <h5 className="box-title2 col-lg-2 col-md-11 col-sm-11 col-xs-12 nopadding">Filtered :&nbsp;&nbsp;<b>{this.state.tableData.length}</b></h5>
                                </div>
                                <div className="row">
                                  <div className="col-lg-12 col-md-10 col-sm-10 col-xs-10">
                                    <IAssureTable
                                      tableHeading={this.state.tableHeading}
                                      dataCount={this.state.dataCount}
                                      nPerPage={filterData.nPerPage}
                                      tableData={this.state.tableData}
                                      ticketList={this.state.ticketList}
                                      tableName={'Ticket List'}
                                      getData={this.getData.bind(this)}
                                      tableObjects={this.state.tableObjects}
                                      updateStatus={this.updateStatus.bind(this)}
                                      id={'bookingList'}
                                      isLoading = {this.state.isLoading}
                                    />
                                  </div>
                                </div>
                              </section>
                            </div>
                          </div>
                        </section>
                    </div>
                </div>
                 <div className="modal modalIndex" id="DeletedTicketsModal" tabIndex="-1" role="dialog" aria-hidden="true">
                    <div className="modal-dialog modal-lg " role="document">
                        <div className="modal-content UMmodalContent ummodallftmg ummodalmfdrt  ">
                            <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
                                    <button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>     
                            </div>
                            <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                        
                                {this.state.deletedTickets != "-" ?
                                  <div className="table-responsive topmr40 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <table className="table iAssureITtable-bordered table-striped table-hover">
                                      <thead className="tempTableHeader">
                                        <tr className="">
                                          <th className="umDynamicHeader srpadd textAlignCenter"> Ticket ID</th>
                                          <th className="umDynamicHeader srpadd textAlignCenter sentanceCase">Client </th>
                                          <th className="umDynamicHeader srpadd textAlignCenter sentanceCase">Issue </th>
                                          <th className="umDynamicHeader srpadd textAlignCenter "> Status </th>
                                          {/* <th className="umDynamicHeader srpadd textAlignCenter"> License Validity</th> */}
                                          <th className="umDynamicHeader srpadd textAlignCenter"> Deleted On </th>
                                          <th className="umDynamicHeader srpadd textAlignCenter"> Action </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {this.state.deletedTickets && this.state.deletedTickets.length > 0 
                                          ?
                                          this.state.deletedTickets.map((data, index) => {
                                            var statusLength = data.updateLog.length
                                            return (
                                              <tr key={index}>
                                                <td className="textAlignCenter">{data.ticketId}</td>
                                                <td className="textAlignLeft">{data.clientName}</td>
                                                <td className="textAlignLeft">{data.typeOfIssue}</td>
                                                <td className="textAlignCenter sentanceCase">{data.statusValue}</td>
                                                {/* <td className="textAlignCenter">{moment(data.drivingLicense.effectiveTo).format("DD/MM/YYYY")}</td> */}
                                                <td className="textAlignCenter">{ statusLength > 0  ? moment(data.updateLog[statusLength-1].updatedAt).format("DD/MM/YYYY") : "-"}</td>
                                                <td className="textAlignCenter">
                                                  <span>
                                                    <button className="btn deleteBtn" title="Delete"  data-id={data._id}  onClick={this.deleteTicket.bind(this)}>Delete Permanently</button> 
                                                    <br/>
                                                    <button className="btn restoreBtn sentanceCase" title="Restore" data-id={data._id}  onClick={this.restoreTicket.bind(this)}>Restore {this.state.pathname}</button> 
                                                  </span>
                                                </td>
                                              </tr>
                                            );
                                          })
                                          :
                                          <tr className="trAdmin"><td colSpan={6} className="noTempData textAlignCenter">No Record Found!</td></tr>
                                        }
                                      </tbody>
                                    </table>
                                  </div>
                                  :
                                  <div className="centernote col-lg-12"> No data available </div>
                                }
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="modal" id="deleteModal" role="dialog">
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
            </div>
        );
    }
}
