import React, { Component } from 'react';
import { render }           from 'react-dom';
import TimePicker           from 'rc-time-picker';
import moment               from 'moment';
import jQuery               from 'jquery';
import $                    from 'jquery';
import axios                from 'axios';
import IAssureTable         from '../../../coreadmin/IAssureTable/IAssureTable.jsx';

// import OneFieldForm         from '../OneFieldForm/OneFieldForm.js';
import 'rc-time-picker/assets/index.css';
import '../css/AttendanceManagement.css';

const format = "h:mm a";
class MonthlyAttendance extends Component{
   constructor(props) {
    super(props);
    this.state = {
          
          startDate    : moment().format("YYYY-MM-DD"),
          endDate      : moment().format("YYYY-MM-DD"),
          monthVal     : "--",
          tabledata    :[],
         "tableHeading": {
          name         : "Name",
          total        : "Total ",
          totalkm      : "Total KM ",
          ref          : "Name",
          view         : "Name",
          
      },
      "tableObjects"  : 
      {
          deleteMethod   : 'delete',
          apiLink        : '/api/brandsMaster/',
          paginationApply: false,
          searchApply    : false,
          editUrl        : '/brands/'
      },
          "startRange"   : 0,
          "limitRange"   : 10,
          "fields"       : 
      {
            placeholder   : "Enter Brand ..",
            title         : "Brand",
            attributeName : "brand"
      }
    };
  }
  componentDidMount(){
    /*this.getData(this.state.startRange,this.state.limitRange);
    this.setState({
                 "month"      : this.state.month,
            })*/
   
  }
dateChange(event){
    const target = event.target;
    const name = target.name;
    console.log("Date = ",event.target.value)
    this.setState({
    startDate:event.target.value,
    endDate:event.target.value,
    },()=>{
    this.getData(this.state.startRange, this.state.limitRange);
    });
}
setDay(event){
    event.preventDefault();
    this.setState({
    startDate : moment().format("YYYY-MM-DD"),
    endDate   : moment().format("YYYY-MM-DD"),
    },()=>{
    this.getData(this.state.startRange, this.state.limitRange);
    });
}
prevDate(event){
    const inputDate = this.refs.startDate.value;
    var split = inputDate.split('-');
    var new_date = new Date(parseInt(split[0]), parseInt(split[1] - 1), parseInt(split[2]) - 1, 0,0,0,0);
    new_date = moment(new_date).format("YYYY-MM-DD");

    this.setState({
    startDate : new_date,
    endDate   : new_date,
    },()=>{
    this.getData(this.state.startRange, this.state.limitRange);
    });
}

nextDate(event){
    const inputDate = this.refs.startDate.value;
    var split = inputDate.split('-');
    var new_date = new Date(parseInt(split[0]), parseInt(split[1] - 1), parseInt(split[2]) + 1, 0,0,0,0);
    new_date = moment(new_date).format("YYYY-MM-DD");
    this.setState({
    startDate : new_date,
    endDate   : new_date,
    },()=>{
    this.getData(this.state.startRange, this.state.limitRange);
    });
}
monthChange(event){
    event.preventDefault();
    var selectedMonth = this.refs.monthVal.value;
    console.log("selectedMonth--",selectedMonth);
    var newMonthStDt = moment(selectedMonth).format("YYYY-MM-DD");
    var monthEndDt = moment(newMonthStDt).endOf('month');

    this.setState({
    startDate : newMonthStDt,
    endDate   : monthEndDt,
    monthVal  : selectedMonth,
    },()=>{
    this.getData(this.state.startRange, this.state.limitRange);
    });
}
setMonthDates(event){
    event.preventDefault();
    var monthVal = (moment().year())+"-"+(parseInt((moment().month()<10?"0"+(moment().month()):moment().month()))+1);
    var monthStDt = moment([(moment().year()),(parseInt((moment().month()<10?"0"+(moment().month()):moment().month()))+1) - 1]);
    var monthEndDt = moment(monthStDt).endOf('month');

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
    console.log("newMonth",newMonth);
    var monthEndDt = moment(newMonthStDt).endOf('month');

    this.setState({
    startDate : newMonthStDt,
    endDate   : monthEndDt,
    monthVal  : newMonth,
    },()=>{
    this.getData(this.state.startRange, this.state.limitRange);
    });
}
getData(startRange, limitRange){
    var startDate = this.state.startDate === moment().format("YYYY-MM-DD")?this.state.startDate:moment(this.state.startDate).format("YYYY-MM-DD");
    var endDate = this.state.endDate === moment().format("YYYY-MM-DD")?this.state.endDate:moment(this.state.endDate).format("YYYY-MM-DD");
    var typeUser = this.state.typeUser;
    console.log(startDate,"<......SED......>",endDate);
    if(startDate&&endDate){
    axios
    .get('/api/report/get/sales/'+startDate+'/'+endDate+'/'+typeUser+'/'+startRange+'/'+limitRange)
    .then((response)=>{
    // console.log("sales............>",response.data);
    if(response.data.message !== "Data not found"){
    var tableData = response.data.map((a, i)=>{
    return {
    // "_id" : a._id ? a._id : 1,
    userName        : a.userName ? a.userName : '-',
    packageName     : a.packageName ? a.packageName : '-',
    amount          : a.amount >= 0? a.amount : '-',
    totalChkIn      : a.totalChkIn? a.totalChkIn : '-',
    checkInLeft     : a.checkInLeft >= 0? a.checkInLeft : '0',
    packageStartDate: a.packageStartDate ? moment(a.packageStartDate).format('DD-MM-YYYY') : '-',
    packageEndDate  : a.packageEndDate ? moment(a.packageEndDate).format('DD-MM-YYYY') : '-',
    }
    })
    }
    if(response.data.message == "Data not found"){
    this.setState({
    completeDataCount : 0,
    tableData : [],
    })
    }else{
    this.setState({
    completeDataCount : tableData.length>0?tableData.length:10,
    tableData : tableData,
    })
    }

    })
    .catch(function (error) {
    console.log(error);
    })
    }
    // console.log("end")
}
    
 handleChange(event){
     const target = event.target;
     const name   = target.name;
     this.setState({
      [name]: event.target.value,
     });
  }
  render(){
   console.log(this.getData());
    return(
       <div>
       
         <IAssureTable
          tableHeading={this.state.tableHeading}
          dataCount={this.state.dataCount}
          tableData={this.state.tabledata}
          getData={this.getData.bind(this)}
          tableObjects={this.state.tableObjects}
                      
          />
      </div>    
                 
    );
  }
 }

 export default MonthlyAttendance;