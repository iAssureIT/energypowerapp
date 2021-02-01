import React, { Component } from 'react';
import { render }           from 'react-dom';
import TimePicker           from 'rc-time-picker';
import moment               from 'moment';
import jQuery               from 'jquery';
import $                    from 'jquery';
import axios                from 'axios';
import ViewOption           from './MonthlyReimbursementTable.js';
// import OneFieldForm         from '../OneFieldForm/OneFieldForm.js';
import 'rc-time-picker/assets/index.css';
import './Reports.css';

const date= new Date()
const format = "h:mm a";
const month=("0" + (date.getMonth() + 1)).slice(-2)
const year=date.getFullYear()


class MonthlyReimbursementReport extends Component{
   constructor(props) {
      super(props);
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
         monthVal:`${year}-${month}`,
         "tableHeading": {
              staffName                 : "Employee Name",
              present                   : "Present Days",
              absent                    : "Absent Days",
              totalDistanceTravelled    : "Total Distance Travelled",
              reimbursementDistance     : "Calculated Reimbursement Distance",
              totalreimbursement        : "Total Reimbursement (In Rupees)",
              processofpayment          : "Payment",
              paidreimbursement         : "Paid Reimbursement",
              displayRemainingreimbursement    : "Remaining Reimbursement",
              actions                   : 'View Details',
      },
      "tableObjects"  : 
      {
          deleteMethod   : 'delete',
          apiLink        : '/api/recordinglocation',
          paginationApply: false,
          searchApply    : false,
          downloadApply  : true,
          viewdataurl    : '/Monthlydetails/'+`${year}-${month}`+"/",
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
    daysInMonth (month, year) { 
      var selectedMonth = this.refs.monthVal.value;
      var splitdate =  Date.getDate()
      console.log("splitdate",splitdate);
    } 


  currentFromDate(){
    if(this.state.startDate){
        var today = this.state.startDate;
    }else {
        var today = (new Date());
        var nextDate = today.getDate() - 30;
        today.setDate(nextDate);
        // var newDate = today.toLocaleString();
        var today =  moment(today).format('YYYY-MM-DD');
    }
    this.setState({
       startDate :today
    },()=>{
    });
    return today;
  }

  msToTime(duration){
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  } 

  monthChange(event){
    event.preventDefault();
    var selectedMonth = this.refs.monthVal.value;
    var selecteddate1= this.state.monthVal;
    
    var newMonthStDt = moment(selectedMonth).format("YYYY-MM-DD");
    var monthEndDt   = moment(newMonthStDt).endOf('month');
    var totaldays    = moment(selectedMonth).daysInMonth();
   
   this.setState({
      monthVal  : selectedMonth,
      totaldays:totaldays,
      },()=>{
       var setdate=localStorage.setItem("monthdate",selectedMonth);
       this.setState({
        setdate:setdate

       })
       console.log("setdate",setdate);
      this.getData();
      });
  }

  componentDidMount(){
    const monthControl = document.querySelector('input[type="month"]');
    
 
    var selectedMonth = this.refs.monthVal.value;
    var newMonthStDt = moment(selectedMonth).format("YYYY-MM-DD");
    var monthEndDt   = moment(newMonthStDt).endOf('month');
    var daysInMonth  = moment(selectedMonth).daysInMonth();
      this.getData();
      console.log("monthEndDt",monthEndDt);
      var today = moment().format("MM-DD-YYYY");
      var weeknumber = moment(today).week();
      if(weeknumber<=9){
      weeknumber="0"+weeknumber;
      }
      var yyyy = moment(today).format("YYYY");
      var weekVal = yyyy+"-W"+weeknumber;
      this.setState({
      weekVal   : weekVal,
      });
  }

setMonthDates(event){
  event.preventDefault();
  var monthVal = (moment().year())+"-"+(parseInt((moment().month()<10?"0"+(moment().month()):moment().month()))+1);
  var monthStDt = moment([(moment().year()),(parseInt((moment().month()<10?"0"+(moment().month()):moment().month()))+1) - 1]);
  var monthEndDt = moment(monthStDt).endOf('month');
  console.log("monthEndDt--->",monthEndDt);

  // console.log(monthStDt,"--",monthEndDt);
  // console.log((moment().year())+"-"+(parseInt((moment().month()<10?"0"+(moment().month()):moment().month()))+1));

  this.setState({
    monthVal  : monthVal,
    startDate : monthStDt,
    endDate   : monthEndDt,
  },()=>{
    this.getData(this.state.startRange, this.state.limitRange);
  });
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
    
 handleChange(event){
     const target = event.target;
     const name   = target.name;
     this.setState({
      [name]: event.target.value,
     });
  }

 
  getData(startRange,limitRange){
   var formValues = {
      monthyear        : this.state.monthVal,   
    }
    axios.get('/api/reports/get/datewiseUserdetails/'+formValues.monthyear)
    .then((response)=>{
        console.log("response.data",response.data);
        var tableData = response.data.map((a,i)=>{
          return{
            _id                    : a._id,
            staffName              : a.firstName + " "+(a.middleName?a.middleName:"")+" "+a.lastName,
            // stotalTime             : this.msToTime(a.stotalTime),
            present                : a.present,
            absent                 : a.absent,
            totalDistanceTravelled :  a.totalDistanceTravelled ? (a.totalDistanceTravelled).toFixed(6)+" Km"  : "0 Km",
            reimbursementDistance  :  a.totalReimbursementDistance ? (a.totalReimbursementDistance).toFixed(6)+" Km"  : "0 Km",
            totalreimbursement     : a.totalreimbursement ? "₹ "+(a.totalreimbursement.toFixed(6)) : "0",
            processofpayment             : "",
            paidreimbursement      : a.paidreimbursement? "₹ "+(a.paidreimbursement.toFixed(6)) : "0",
            remainingreimbursement : a.remainingreimbursement ?a.remainingreimbursement.toFixed(6) : 0,
            displayRemainingreimbursement : a.remainingreimbursement ? "₹ "+ (Math.abs(a.remainingreimbursement.toFixed(6))) : 0,
            user_id                : a.user_id,
            showTracking           : true
          }
        })
        this.setState({tableData})
      })
      .catch(function (error) {
      console.log(error);
      })
  }  

  render(){
    console.log("tableData",this.state.tableData);
    return(
     <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
          <section className="content OrgSettingFormWrapper">
            <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
           <div className="row">
              <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                  <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right"> Monthly Reimbursement Report</h4>
              </div>
              <div className="col-lg-3 col-lg-offset-4  col-md-10  col-sm-10 col-xs-10 mt25">
                <div className="input-group" id="selectField" >
                    <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#modalId"  onClick={this.prevMonth.bind(this)} title="Previos Month" ><i className="fa fa-chevron-left "></i></div>
                    <input id="monthVal" value={this.state.monthVal}
                      type="month" name="monthVal" ref="monthVal" onChange={this.monthChange.bind(this)}
                      className="form-control areaStaes inputbxtext " title="" autoComplete="off"  /> 
                    <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#modalId"  onClick={this.nextMonth.bind(this)} title="Next Month" ><i className="fa fa-chevron-right "></i> </div>
                </div> 
              </div>  
             <div className="col-lg-12 col-md-12 col-sm-10 col-xs-10 attendacetable">  
                 <ViewOption
                      tableHeading={this.state.tableHeading}
                      dataCount={this.state.dataCount}
                      tableData={this.state.tableData}
                      getData={this.getData.bind(this)}
                      tableObjects={this.state.tableObjects}
                      viewModal ={true}
                      tableName={'Monthly Reimbursement Report'}
                      id={'MonthlyReimbursementReport'}
                      viewLink="Monthlydetails"
                      monthyear={this.state.monthVal}
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

 export default MonthlyReimbursementReport;