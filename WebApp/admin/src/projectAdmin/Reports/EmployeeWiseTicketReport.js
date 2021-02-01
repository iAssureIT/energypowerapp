import React, { Component } from 'react';
import { render }           from 'react-dom';
import TimePicker           from 'rc-time-picker';
import moment               from 'moment';
import jQuery               from 'jquery';
import $                    from 'jquery';
import {withRouter}           from 'react-router-dom';
import swal                   from 'sweetalert';
import axios                from 'axios';
// import MonthlyAttendance    from './MonthlyAttendance.js';
import ViewOption         from '../ViewOption/ViewOption.js';
// import OneFieldForm         from '../OneFieldForm/OneFieldForm.js';
import 'rc-time-picker/assets/index.css';
import './Reports.css';

const date= new Date()
const format = "h:mm a";
const month=("0" + (date.getMonth() + 1)).slice(-2)
const year=date.getFullYear()
class EmployeeWiseTicketReport extends Component{
   constructor(props) {
      super(props);
      var dd = new Date().getDate();
      var mm = new Date().getMonth()+1; //January is 0!
      var yyyy = new Date().getFullYear();
      var today = yyyy+'-'+mm+'-'+dd;
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      this.state = {
          
          startDate           : moment().format("YYYY-MM-DD"),
          endDate             : moment().format("YYYY-MM-DD"),
          monthVal            :`${year}-${month}`,
          totaldays           : '',
          totalDistance       : '',
          setdate          : '',
          totalreimbursement  : '',
          count               : '',
          tabledata           :[],
          fromdate            : today,
          todate              : tomorrow,
          searchText          : 'All',
          employee            : 'employee', 
          technician_id       : this.props.match.params.employee_id ? this.props.match.params.employee_id : '',
         "tableHeading": {
            ticketNo               : "Ticket No.",
            status                 : "Ticket Status",
            allocatedOn            : "Allocated On",      
            startedOn              : "Started On",
            completedOn            : "Completed On",
            ticketClosedDate       : "Ticket Closed Date",
            actions                : 'View Details',
      },
      "tableObjects"  : 
      {
          deleteMethod   : 'delete',
          apiLink        : '/api/recordinglocation',
          paginationApply: false,
          searchApply    : false,
          downloadApply  : true,
          viewdataurl    : '/ticketview/'
      },
          "startRange"   : 0,
          "limitRange"   : 10,
          "fields"       : 
      {
            placeholder   : "",
            title         : "",
            attributeName : ""
      }
    };
    // this.handleChange              = this.handleChange.bind(this);
  }

  msToTime(duration){
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours + ":" + minutes + ":" + seconds;
  } 


  componentDidMount(){
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      if(dd<10){
          dd='0'+dd;
      }
      if(mm<10){
          mm='0'+mm;
      }
      var today = yyyy+'-'+mm+'-'+dd;

      this.setState({
        todayDate : today,
      },()=>{this.getData()});
      this.getTechnicianList();
  }

  getTechnicianList(){
    axios.get('api/personmaster/get/personlist/technician')        
    .then((response) => {
      var technicianList = response.data.map((a, i)=>{
        return {
          label  : a.firstName +" "+ (a.middleName ? a.middleName  : "")+" "+a.lastName,
          id             : a._id
        } 
      })
      this.setState({technicianList:technicianList})
    })
    .catch((error)=>{
          console.log("error = ",error);
    });
  }


 
  getData(startRange,limitRange){
    var todayDateSelected = this.state.todayDate;
    var startDate = moment(todayDateSelected).startOf('day'); // set to 12:00 am today
    var endDate = moment(todayDateSelected).endOf('day'); // set to 23:59 pm today
    startDate  = new Date(startDate);
    endDate  = new Date(endDate);
    if(this.state.technician_id){
      axios.get('/api/reports/get/employee_wise_task_report/'+this.state.technician_id+"/"+this.state.monthVal)
      .then((response)=>{
          console.log("response.data",response.data);
          var tableData = response.data.tickets.map((a,i)=>{
            return{
              _id                    : a._id,
              ticketNo               : "<a target='_blank' href="+'/ticketview/'+a._id+">"+"<span class='label label-primary'>"+a.ticketId+"</div></a>",
              status                 : a.statusValue,
              allocatedOn            : a.allocatedOn ? moment(a.allocatedOn).format('DD MMM YYYY h:mm'):"NA",      
              startedOn              : a.startedOn ? moment(a.startedOn).format('DD MMM YYYY h:mm') : "NA",
              completedOn            : a.completedOn ? moment(a.completedOn).format('DD MMM YYYY h:mm') : "NA",
              ticketClosedDate       : a.ticketClosedDate ? moment(a.ticketClosedDate).format('DD MMM YYYY h:mm') : "NA",
              showTracking           : true
            }
          })
          this.setState({
            tableData,
            employee : response.data.employee
          })
        })
        .catch(function (error) {
        console.log(error);
        })
      }   
  }  

  prevMonth(event){
    event.preventDefault();
    var selectedMonth = this.refs.monthVal.value;
    var newMonthStDt = moment(selectedMonth).subtract(1, 'month').format("YYYY-MM-DD");
    var newMonthNumber = moment(newMonthStDt).month() + 1;
    console.log("newMonthNumber",newMonthNumber);
    if(newMonthNumber <= 9){
    newMonthNumber = '0' + newMonthNumber;
    }
    var yearNum = moment(newMonthStDt).format("YYYY");
    var newMonth = yearNum+"-"+newMonthNumber;
    console.log("newMonth",newMonth);
    var monthEndDt = moment(newMonthStDt).endOf('month');
    console.log("monthEndDt",monthEndDt);

    this.setState({
    startDate : newMonthStDt,
    endDate   : monthEndDt,
    monthVal  : newMonth,
    },()=>{
    this.getData(this.state.startRange, this.state.limitRange);
    });
  }

  nextMonth(event){
    event.preventDefault();
    var selectedMonth = this.refs.monthVal.value;
    var newMonthStDt = moment(selectedMonth).add(1, 'month').format("YYYY-MM-DD");
    var newMonthNumber = moment(newMonthStDt).month() + 1;
    if(newMonthNumber <= 9){
    newMonthNumber = '0' + newMonthNumber;
    }
    var yearNum = moment(newMonthStDt).format("YYYY");
    var newMonth = yearNum+"-"+newMonthNumber;
    // console.log("newMonth",newMonth);
    var monthEndDt = moment(newMonthStDt).endOf('month');

    this.setState({
    startDate : newMonthStDt,
    endDate   : monthEndDt,
    monthVal  : newMonth,
    },()=>{
    this.getData(this.state.startRange, this.state.limitRange);
    });
  }

  monthChange(event){
    event.preventDefault();
   var selectedMonth = this.refs.monthVal.value;
   // console.log("selectedMonth--",selectedMonth);
   var newMonthStDt = moment(selectedMonth).format("YYYY-MM-DD");
   var monthEndDt   = moment(newMonthStDt).endOf('month');
   var totaldays    = moment(selectedMonth).daysInMonth();
   // console.log("totaldays----",totaldays);
  this.setState({
   monthVal  : selectedMonth,
   totaldays:totaldays,
   },()=>{
   this.getData();
   });
 }

 daysInMonth (month, year) { 

  var selectedMonth = this.refs.monthVal.value;
  var splitdate =  Date.getDate()
  // console.log("splitdate",splitdate);
  }
  searchPerson(event) {
    for (var key in document.querySelectorAll('.alphab')) {
      $($('.alphab')[key]).css('background', '#ddd');
      $($('.alphab')[key]).css('color', '#000');
    }
 
    $("#filterallalphab").css("color", "#fff");
    $("#filterallalphab").css("background", "#0275ce");
    if(event.target.value){
      this.setState({
        'searchText': event.target.value,
      },()=>{
        this.getData()
      })
    }else{
      this.setState({
        'searchText': 'All',
      },()=>{
        this.getData()
      })
    }
  }

   handleTechnician(event){
    event.preventDefault();
    if(this.refs.technician.value === 'All') {
      var technician_id = '';
    }else{
      var e = document.getElementById("technician");
      var technician_id = e.options[e.selectedIndex].id;
    }
    this.setState({
      technician_id:technician_id
    },()=>{
      this.getData()
    })
  }

  render(){
    var {employee}=this.state;
    return(
     <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
          <section className="content OrgSettingFormWrapper">
            <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
           <div className="row">
              <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                  <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right"> Employee Wise Ticket Allocation</h4>
              </div>
               <div className="marginStyle col-lg-12 "> 
                <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
                    <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding custom-select">
                    <select onChange={this.handleTechnician.bind(this)} value={this.state.technician_id} id="technician" ref="technician" name="technician" className="col-lg-12 col-md-12 col-sm-6 col-xs-12  noPadding form-control">
                      <option value="Not Selected" selected>Please Select Employee</option>
                      {
                          this.state.technicianList && this.state.technicianList.length > 0 ?
                          this.state.technicianList.map((result, index)=>{
                            return(      
                                <option key={index} id={result.id} value={result.id}>{result.label}</option>
                            );
                          }
                        ) : ''
                      }   
                    </select>
                  </div>
                </div>
                {/*<div className="col-lg-3  col-md-6 col-sm-12 col-xs-12 searchBoxBugt margintopReport pull-right">
                      <span className="blocking-span" >
                        <input type="text" name="search" className="col-lg-8 col-md-8 col-sm-8 col-xs-12 Searchusers searchEntity inputTextSearch outlinebox pull-right texttrans"
                          placeholder="Search..." onInput={this.searchPerson.bind(this)} />
                      </span>
                </div>*/}
                {/*<div className="col-lg-12 NOPadding "> 
                  <h5 className="box-title2 col-lg-4 col-md-11 col-sm-11 col-xs-12 nopadding">{employee.firstName ? <span><b>Employee</b> :<a target='_blank' href={"/employee-profile/"+employee._id}>{ employee.firstName+" "+employee.lastName+ " ("+employee.employeeId+") "}</a></span>:""}</h5>
                </div>*/}
                <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 pull-right" style={{'margin-right':'15px'}}>
                  <div className="input-group" id="selectField" >
                      <div className="input-group-addon " data-toggle="modal"   data-target="#modalId"  onClick={this.prevMonth.bind(this)} title="Previos Month" ><i className="fa fa-chevron-left "></i></div>
                      <input id="monthVal" value={this.state.monthVal}
                        type="month" name="monthVal" ref="monthVal" onChange={this.monthChange.bind(this)}
                        className="form-control" title="" autoComplete="off"  /> 
                      <div className="input-group-addon" data-toggle="modal"   data-target="#modalId"  onClick={this.nextMonth.bind(this)} title="Next Month" ><i className="fa fa-chevron-right "></i> </div>
                  </div> 
                </div>  
              </div>
             <div className="col-lg-12 col-md-12  col-sm-10 col-xs-10 ">  
                 <ViewOption
                      tableHeading={this.state.tableHeading}
                      dataCount={this.state.dataCount}
                      tableData={this.state.tableData}
                      getData={this.getData.bind(this)}
                      tableObjects={this.state.tableObjects}
                      tableName={'Employee Wise Ticket Allocation'}
                      id={'EmployeeWiseTicketAllocation'}
                      viewModal ={true}
                      viewLink="Monthlydetails"
                    />
            </div>          
            </div>          
          </div>           
        </section>
       </div>
      </div>
    </div>
    );
  }
 }

 export default EmployeeWiseTicketReport;