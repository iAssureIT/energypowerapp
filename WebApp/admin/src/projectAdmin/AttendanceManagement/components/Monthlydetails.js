import React, { Component } from 'react';
import { render }           from 'react-dom';
import TimePicker           from 'rc-time-picker';
import moment               from 'moment';
import jQuery               from 'jquery';
import $                    from 'jquery';
import axios                from 'axios';
import MonthlyAttendance    from './MonthlyAttendance.js';
// import ViewMap              from '../../ViewMap/ViewMap.jsx';
// import OneFieldForm         from '../OneFieldForm/OneFieldForm.js';
import 'rc-time-picker/assets/index.css';
import '../css/AttendanceManagement.css';

const format = "h:mm a";
class Monthlydetails extends Component{
   constructor(props) {
      super(props);
      this.state = {
          
          startDate  : moment().format("YYYY-MM-DD"),
          endDate    : moment().format("YYYY-MM-DD"),
          monthVal   : "--",
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
          tabledata  :[],
         "tableHeading": {
              createdAt                 : "Date",
              startDateAndTime          : "Start  Time",
              endDateAndTime            : "End Time",
              stotalTime                : "Total Time",
              totalDistanceTravelled    : "Total  Distance",
              totalreimbursement        : "Total Reimbursement",
              actions                   : "View Tracking",
             
      },
      "tableObjects"  : 
      {
          deleteMethod   : 'delete',
          apiLink        : '/api/tracking',
          paginationApply: false,
          searchApply    : false,
          viewdataurl    : '/map/'
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

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
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
}

 
getData(startRange,limitRange){
  /*var date='2020-02';
  var id="5e55f7f5f080f30b39a233ce";
    axios.get('/api/tracking/get/daywiseUserdetails/'+date+'/'+id)*/
  var date=localStorage.getItem("monthdate");
  this.setState({
    date:date
  })
  // console.log("date",date);
 /* var date="2020-02";*/

  var id=this.props.match.params.amid;

    axios.get('/api/attendance/get/daywiseUserdetails/'+date+'/'+id)
    .then((response)=>{
      console.log("daywise response----",response);


       var count=response.data.length;



        var totalDist=response.data;
        var totalDistance=0;
        var dates=0;
        var responsedata=response.data;
        // console.log("responsedata",responsedata);

         if(responsedata.length>0 ){


           
           var tabledata = response.data.map((a,i)=>{
            return{
              _id                        : a._id,
               createdAt                 : a.createdAt,
               startDateAndTime          : a.startDateAndTime,
               endDateAndTime            : a.endDateAndTime,
               stotalTime                : this.msToTime(a.stotalTime),
               totalDistanceTravelled    : a.totalDistanceTravelled,
               totalreimbursement        : a.totalreimbursement,
              
              }
            })
            var presentdays=0;
            var startTime=0;
            var endTime=0;
            var count1 = 0;
            var count2 = 0;
            for(var i=0;i<responsedata.length;i++){
              presentdays=responsedata[i].present;
              // console.log("presentdays",presentdays);
              if(presentdays===true){
                count1++;
                this.setState({
                  count1:count1
                })
             /* count1=count1+1; 
              this.setState({
                count1:count1
              })  */
              }
              else{
                count2++;

                // console.log("count2",count2);
                this.setState({
                  count2:count2
                })
              }
             
            
              // console.log("presentdayscount",presentdayscount);
              dates     = responsedata[i].createdAt;
              startTime = responsedata[i].startDateAndTime;
              endTime   = responsedata[i].endDateAndTime;
              // console.log("startTime",startTime);
               var StartTime = moment(startTime[i]).format('hh:mm:ss'); 
               var EndTime = moment(endTime[i]).format('hh:mm:ss'); 
               // console.log("StartTime",StartTime);
              
               this.setState({
                dates:dates,
                StartTime:StartTime,
                EndTime:EndTime,
                count:count,
               })
               var localTime =[];
               localTime.push(moment(dates[i]).format('YYYY-MM-DD')); 
               // console.log("localTime==>",localTime );
               
               this.setState({
                localTime:localTime
               })


       }
      

        if(totalDist.length>0){

          var tabledata = response.data.map((a,i)=>{
            return{
              _id                        : a._id,
               createdAt                 : a.createdAt,
               startDateAndTime          : a.startDateAndTime,
               endDateAndTime            : a.endDateAndTime,
               stotalTime                : this.msToTime(a.stotalTime),
               totalDistanceTravelled    : a.totalDistanceTravelled,
               totalreimbursement        : totalreimbursement,
              
              }
            })

      
       for(var i=0; i<=totalDist.length; i++){
          totalDistance  += totalDist[i].totalDistanceTravelled;
          var totalreimbursement=0;
          totalreimbursement=5*totalDistance;
          // console.log("totalreimbursement",totalreimbursement);
          this.setState({
            tableData : tabledata,
            totalDistance:totalDistance,
            totalreimbursement:totalreimbursement

          })
          // console.log("totalDistance",totalDistance);
        }
      }
      } 
       
       /*LocalDate date = LocalDate.parse("2018-04-10T04:00:00.000Z", inputFormatter);
       String formattedDate = outputFormatter.format(date);
       System.out.println(formattedDate); */
      this.setState({
        tableData : tabledata,
      })

      })
      .catch(function (error) {
      console.log(error);
      })
 

  }  
  render(){
    return(
    <div className="container-fluid col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <div className="row">
       <div className="formWrapper">
        <section className="content">
         <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
           <div className="row">
            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageSubHeader">
               Employee Details
              </div>
            </div>
              <hr className="hr-head"/>
          <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mainDiv"> 
            <div className="col-lg-offset-2 col-lg-10 col-lg-12 col-lg-12">
              </div>
               <div className="col-lg-offset-1 col-lg-10 col-md-10 summarybox">
                 <div className className="col-lg-4 col-md-3  infobox1 NOPadding">
                   <div className="col-lg-3 col-md-3 NOPadding">
                    <i className="fa fa-calendar calendericon pull-left"></i>
                   </div>
                  <span className="col-lg-6 col-md-6 text-left boxtext"><b>Total Days</b></span>
                  <div className="col-lg-3 col-md-3 statetext"><b>{this.state.count ? this.state.count :0}</b></div>
                 </div>
                 <div className className="col-lg-4 col-md-3  infobox1 NOPadding">
                   <div className="col-lg-3 col-md-3 NOPadding">
                    <i className="fa fa-calendar calendericon pull-left"></i>
                   </div>
                  <span className="col-lg-6 col-md-6 text-left boxtext"><b>Present Days</b></span>
                  <div className="col-lg-3 col-md-3 statetext"><b>{this.state.count1 ? this.state.count1 :0}</b></div>
                 </div>
                 <div className className="col-lg-3 col-md-3  infobox1 NOPadding">
                   <div className="col-lg-3 col-md-4 NOPadding">
                    <i className="fa fa-users calendericon pull-left"></i>
                   </div>
                  <span className="col-lg-6 col-md-6 text-left boxtext"><b>Absent Days</b></span>
                  <div className="col-lg-3 col-md-3 statetext"><b>{this.state.count2 ? this.state.count2 :0}</b></div>
                 </div>
                 <div className className="col-lg-4 col-md-3  infobox1 NOPadding">
                   <div className="col-lg-3 col-md-4 NOPadding">
                    <i className="fa fa-road calendericon pull-left"></i>
                   </div>
                  <span className="col-lg-6 col-md-6 text-left boxtext"><b>Total Distance</b></span>
                  <div className="col-lg-3 col-md-3 statetext"><b>{this.state.totalDistance ? this.state.totalDistance :0}</b></div>
                 </div>
                 <div className className="col-lg-4 col-md-3  infobox1 NOPadding">
                   <div className="col-lg-2 col-md-4 NOPadding">
                    <i className="fa fa-rupee calendericon pull-left"></i>
                   </div>
                  <span className="col-lg-6 col-md-6 text-left boxtext"><b>Total Reimbursement</b></span>
                  <div className="col-lg-3 col-md-3 statetext"><b>{this.state.totalreimbursement ? this.state.totalreimbursement :0}</b></div>
                 </div>
                </div>
                 <div className="col-lg-offset-1 col-lg-10 col-md-10 col-sm-10 col-xs-10">
                    {/*<ViewMap
                          tableHeading={this.state.tableHeading}
                          dataCount={this.state.dataCount}
                          tableData={this.state.tableData}
                          getData={this.getData.bind(this)}
                          tableObjects={this.state.tableObjects}
                          viewModal ={true}
                          viewLink="map"
                        />*/}
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