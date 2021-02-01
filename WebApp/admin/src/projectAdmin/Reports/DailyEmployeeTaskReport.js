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

const format = "h:mm a";
class DailyEmployeeTaskReport extends Component{
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
          monthVal            : "",
          totaldays           : '',
          totalDistance       : '',
          setdate          : '',
          totalreimbursement  : '',
          count               : '',
          tabledata           :[],
          fromdate            : today,
          todate              : tomorrow,
          searchText             : 'All',
         "tableHeading": {
              employee                  : "Employee",
              startTime                 : "Start Time",
              endTime                   : "End Time",
              totalHours                : "Total Hours",
              distanceTravelled         : "Distance Travelled",
              closedToday               : "Tickets Closed",
              ticketsAllocated          : "Tickets Allocated",
              startOdometer             : "Start Odometer",
              endOdometer               : "End Odometer",
              actions                   : 'View Details',
      },
      "tableObjects"  : 
      {
          deleteMethod   : 'delete',
          apiLink        : '/api/recordinglocation',
          paginationApply: false,
          searchApply    : false,
          downloadApply  : true,
          viewdataurl    : '/EmployeeWiseTicketReport/'
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
    this.handleChange              = this.handleChange.bind(this);
  }

    handleChange(event){
     const target = event.target;
     const name   = target.name;
     this.setState({
      [name]: event.target.value,
     },()=>{
      this.getData()
     });
  }


  msToTime(duration){
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours + ":" + minutes;
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
  }




 
  getData(startRange,limitRange){
    var todayDateSelected = this.state.todayDate;
    var startDate = moment(todayDateSelected).startOf('day'); // set to 12:00 am today
    var endDate = moment(todayDateSelected).endOf('day'); // set to 23:59 pm today
    startDate  = new Date(startDate);
    endDate  = new Date(endDate);
    axios.get('/api/reports/get/daily_employee_task_report/'+startDate+"/"+endDate+"/"+this.state.searchText)
    .then((response)=>{
        console.log("response.data",response.data);
        var tableData = response.data.map((a,i)=>{
          return{
            _id                    : a._id,
            employee               :  "<a target='_blank' href="+'/employee-profile/'+a._id+">"+(a.firstName +" "+(a.middleName ? a.middleName : "")+" "+a.lastName+(a.employeeId ? (" ( Emp ID : "+a.employeeId+" ) ") : ""))+"</a>",
            startTime              : a.startTime ? moment(a.startTime).format('h:mm') : "00:00",
            endTime                : a.endTime ? moment(a.endTime).format('h:mm') : "00:00",
            totalHours             : a.totalHours ? this.msToTime(a.totalHours) : "00:00",
            distanceTravelled      : a.distanceTravelled ? (a.distanceTravelled).toFixed(4)+" Km" : 0+" Km",
            closedToday            : a.ticketsClosed,
            ticketsAllocated       : a.ticketAllocated,
            startOdometer          : a.startOdometer  && a.startOdometer.Proof? "<a target='_blank'  className='imageOuterContainerDM' title='Click to View' href="+(a.startOdometer.Proof)+"><img src="+(a.startOdometer.Proof)+" class='tableImageOdometer center'/></a><span class='col-lg-12 nopadding text-info pointerCls text-center' >"+a.startOdometer.Reading+" Km</span>":"NA",
            endOdometer            : a.endOdometer && a.endOdometer.Proof? "<a target='_blank'  className='imageOuterContainerDM' title='Click to View' href="+(a.endOdometer.Proof)+"><img src="+(a.endOdometer.Proof)+" class='tableImageOdometer center'/></a><span class='col-lg-12 nopadding text-info pointerCls text-center'>"+a.endOdometer.Reading+" Km</span>":"NA",
            showTracking           : true
          }
        })
        console.log("tableData",tableData);
        this.setState({tableData})
      })
      .catch(function (error) {
      console.log(error);
      })
  }  

   nextDate(event){
      event.preventDefault();
      var selectedDate1 = $("input#todayDate").val();
      var selectedDate = selectedDate1.replace(/-/g, '\/');

      var newDate1 = new Date(selectedDate);
      var newDate2 = new Date(newDate1.getTime() + (24*60*60*1000) );
      var newDate3 = new Date(newDate2);
      var dd = newDate3.getDate();
      var mm = newDate3.getMonth()+1; //January is 0!
      var yyyy = newDate3.getFullYear();
      if(dd<10){
          dd='0'+dd;
      }
      if(mm<10){
          mm='0'+mm;
      }
      var newDate3 = yyyy+'-'+mm+'-'+dd;

      this.setState({
          todayDate : newDate3,
      },()=>{this.getData()});
    }

    previousDate(event){
      event.preventDefault();
      var selectedDate1 = $("input#todayDate").val();
      var selectedDate = selectedDate1.replace(/-/g, '\/');
      var newDate1 = new Date(selectedDate);
      var newDate2 = new Date(newDate1.getTime() - (24*60*60*1000) );
      // Session.set('newDate', newDate2);
      var newDate3 = new Date(newDate2);
      var dd = newDate3.getDate();
      var mm = newDate3.getMonth()+1; //January is 0!
      var yyyy = newDate3.getFullYear();
      if(dd<10){
          dd='0'+dd;
      }
      if(mm<10){
          mm='0'+mm;
      }
      var newDate3 = yyyy+'-'+mm+'-'+dd;
      this.setState({
        todayDate : newDate3,
      },()=>{this.getData()});
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

  render(){
    return(
     <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
          <section className="content OrgSettingFormWrapper">
            <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
           <div className="row">
              <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                  <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right"> Daily Employee Task Report</h4>
              </div>
               <div className="marginStyle col-lg-12 ">
                <div className="col-lg-3 col-md-3 col-sm-10 col-xs-10">
                  <div className="input-group" id="selectField" >
                      <div className="input-group-addon inputIcon plusIconBooking" id="previousDate" onClick={this.previousDate.bind(this)} title="Previos Date" ><i className="fa fa-chevron-left "></i></div>
                      <input 
                        type="date" name="todayDate" id="todayDate" value={this.state.todayDate}
                        className="form-control" title="" autoComplete="off"  onChange={this.handleChange.bind(this)}/> 
                      <div className="input-group-addon inputIcon plusIconBooking" id="nextDate"  onClick={this.nextDate.bind(this)} title="Next Date" ><i className="fa fa-chevron-right "></i> </div>
                  </div> 
                </div>  
                <div className="col-lg-3  col-md-6 col-sm-12 col-xs-12 searchBoxBugt margintopReport pull-right">
                      <span className="blocking-span" >
                        <input type="text" name="search" className="col-lg-8 col-md-8 col-sm-8 col-xs-12 Searchusers searchEntity inputTextSearch outlinebox pull-right texttrans"
                          placeholder="Search..." onInput={this.searchPerson.bind(this)} />
                      </span>
                </div>
              </div>
             <div className="col-lg-12 col-md-12  col-sm-10 col-xs-10 ">  
                 <ViewOption
                      tableHeading={this.state.tableHeading}
                      dataCount={this.state.dataCount}
                      tableData={this.state.tableData}
                      getData={this.getData.bind(this)}
                      tableObjects={this.state.tableObjects}
                      viewModal ={true}
                      viewLink="Monthlydetails"
                      tableName={'Daily Employee Task Report'}
                      id={'DailyEmployeeTaskReport'}
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

 export default DailyEmployeeTaskReport;