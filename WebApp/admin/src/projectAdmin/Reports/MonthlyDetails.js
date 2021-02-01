import React, { Component } from 'react';
import { render }           from 'react-dom';
import TimePicker           from 'rc-time-picker';
import moment               from 'moment';
import jQuery               from 'jquery';
import $                    from 'jquery';
import axios                from 'axios';
// import MonthlyAttendance    from './MonthlyAttendance.js';
import ViewMap              from '../ViewOption/ViewOption.js';
import Loader           from 'react-loader-spinner';
// import OneFieldForm         from '../OneFieldForm/OneFieldForm.js';
import 'rc-time-picker/assets/index.css';
import './Reports.css';

const format = "h:mm a";
class Monthlydetails extends Component{
   constructor(props) {
      super(props);
      this.state = {
          
          startDate  : moment().format("YYYY-MM-DD"),
          endDate    : moment().format("YYYY-MM-DD"),
          monthVal   : this.props.match.params.date,
          dates      :'' ,
          date       :'' ,
          localTime  :'' ,
          EndTime    :'' ,
          count      :'' ,
          count1     :'' ,
          count2     :'' ,
          totalreimbursement  :'' ,
          totaldays  : '',
          StartTime  : '',
          tabledata  : [],
          isLoading  : false,
          technician_id       : this.props.match.params.employee_id ? this.props.match.params.employee_id : '',
         "tableHeading": {
              createdAt                 : "Date",
              attendance                : "Attendance",
              startDateAndTime          : "Start Time",
              attendanceDateAndTime     : "Calculated Attendance Time",
              endDateAndTime            : "End Time",
              stotalTime                : "Total Hours",
              startOdometer             : "Start Odometer",
              endOdometer               : "End Odometer",
              totalDistanceTravelled    : "Total Distance Travelled",
              reimbursementDistance     : "Calculated Reimbursement Distance",
              vehicle                   : "Vehicle",
              totalReimbursement        : "Total Reimbursement (In Rupees)",
              actions                   : "View Tracking",
             
      },
      "tableObjects"  : 
      {
          deleteMethod   : 'delete',
          apiLink        : '/api/tracking',
          paginationApply: false,
          downloadApply  : true,
          searchApply    : false,
          viewdataurl    : '/tracking/'
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
    if(duration <= 0){
      return "NA"
    }else{
      var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;
      return hours + ":" + minutes;
    }
    
  } 
daysInMonth (month, year) { 

            var selectedMonth = this.refs.monthVal.value;
            var splitdate =  Date.getDate()
            // console.log("splitdate",splitdate);
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
  componentDidMount(){
    this.getData();
    this.getTechnicianList();
  }

  getTechnicianList(){
    axios.get('api/personmaster/get/personlist/technician')        
    .then((response) => {
      var technicianList = response.data.map((a, i)=>{
        return {
          label  : a.firstName +" "+(a.middleName?a.middleName:"")+" "+a.lastName,
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
    this.setState({isLoading:true});
    var id=this.state.technician_id;
    var monthYear=this.state.monthVal;
    console.log("monthYear",monthYear);
    console.log("id",id);
    axios.get('/api/reports/get/daywiseUserdetails/'+monthYear+'/'+id)
    .then((response)=>{
      console.log("response",response);
        var count=response.data.length;
        var totalDist=response.data;
        var totalDistance=0;
        var dates=0;
        var responsedata=response.data.staffAttendance;
        var totalDistanceTravelled=response.data.totalDistanceTravelled;
        var totalReimbursement=response.data.totalReimbursement;
        console.log("responsedata1",responsedata);
         if(responsedata.length>0 ){
           var tabledata = responsedata.map((a,i)=>{
            return{
              _id                        : a.tracking_id,
               createdAt                 : "<div class='tdWrap'>"+moment(a.createdAt).format('DD-MM-YYYY')+"</div>",
               attendance                : a.present ? ("<span class='label label-success'>P</span>"):("<span class='label label-danger'>A</span>"),
               startDateAndTime          : a.startDateAndTime ? moment(a.startDateAndTime).format('LT') : "NA",
               attendanceDateAndTime     : a.attendanceDateAndTime ? moment(a.attendanceDateAndTime).format('LT') : "NA",
               endDateAndTime            : a.endDateAndTime ? moment(a.endDateAndTime).format('LT') : "NA",
               stotalTime                : a.stotalTime ? this.msToTime(a.stotalTime) : "NA",
               startOdometer             : a.startOdometer && a.startOdometer.Proof ? "<a target='_blank'  className='imageOuterContainerDM' title='Click to View' href="+(a.startOdometer.Proof)+"><img src="+(a.startOdometer.Proof)+" class='tableImageOdometer center'/></a><span class='col-lg-12 nopadding text-info pointerCls text-center' >"+a.startOdometer.Reading+" Km</span>":"<span class='col-lg-12 nopadding text-center'>"+"NA"+"</span>",
               endOdometer               : a.endOdometer && a.endOdometer.Proof ? "<a target='_blank'  className='imageOuterContainerDM' title='Click to View' href="+(a.endOdometer.Proof)+"><img src="+(a.endOdometer.Proof)+" class='tableImageOdometer center'/></a><span class='col-lg-12 nopadding text-info pointerCls text-center'>"+a.endOdometer.Reading+" Km</span>":"<span class='col-lg-12 nopadding text-center'>"+"NA"+"</span>",
               totalDistanceTravelled    : a.totalDistanceTravelled ? (a.totalDistanceTravelled).toFixed(6)+" Km" : "0 Km",
               reimbursementDistance     : a.totalReimbursementDistance ? (a.totalReimbursementDistance).toFixed(6)+" Km"  : "0 Km",
               vehicle                   : a.vehicle ? a.vehicle+" ( "+a.vehicle_charges_per_km+" Rs.) " : "NA",
               totalReimbursement        : a.totalReimbursement ? ("₹ "+(a.totalReimbursement).toFixed(6))  : 0,
               showTracking              : a.present
              }
            })
      } 
      this.setState({
        tableData : tabledata,
        employee: response.data.employee,
        isLoading:false,
        totalDistanceTravelled,
        totalReimbursement
      })

      })
      .catch(function (error) {
      console.log(error);
      })
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
                  <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right"> Monthly Reimbursement Detail Report</h4>
              </div>
              <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mainDiv"> 
                 <div className="col-lg-12 col-md-12 col-sm-10 col-xs-10">
                    <div className="col-lg-12 NOpadding"> 
                      <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
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
                      <h5 className="col-lg-3 col-md-12 col-sm-12 col-xs-12" style={{'margin-top':'7px'}}>Total Distance : {this.state.totalDistanceTravelled ? this.state.totalDistanceTravelled.toFixed(6)+" Km": "0 Km"}</h5>
                      <h5 className="col-lg-3 col-md-12 col-sm-12 col-xs-12 row" style={{'margin-top':'7px'}}>Total Reimbursement : {this.state.totalReimbursement ? "₹ "+(this.state.totalReimbursement.toFixed(6)): "0"}</h5>
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
                   <ViewMap
                        tableHeading={this.state.tableHeading}
                        dataCount={this.state.dataCount}
                        tableData={this.state.tableData}
                        getData={this.getData.bind(this)}
                        tableObjects={this.state.tableObjects}
                        viewModal ={true}
                        isLoading={this.state.isLoading}
                        tableName={'Monthly Reimbursement Detail Report'}
                        id={'MonthlyReimbursementDetailReport'}
                        viewLink="map"
                      />
                </div>    
             </form> 
            </div>          
          </div>           
        </section>
       </div>
      </div>
    </div>      
 
    );
  }
 }

 export default Monthlydetails;