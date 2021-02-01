import React,{Component} from 'react';
import { render } from 'react-dom';
import moment                   from 'moment';
import axios                    from 'axios';

import Statistics from './StatisticsBox/Statistics.js'
import PieChart from './Charts/PieChart.js'
import BarChart from './Charts/BarChart.js'
import Report from './Reports/Report.js'
import Locations from './Locations/Locations.js'

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

 const filterData = {
      pageNumber    : 0,
      nPerPage      : 6,
      ticketId      : '',
      client_id     : '',
      issue         : '', 
      status        : openStatus,
      serviceRequest: ['Free','Paid',null],
      technician_id : '',     
      searchText    : '', 
      date          : '',
  }
export default class Dashboard extends Component{
	constructor(props) {
	   super(props);
	    this.state = {
	      monthStart:"",
	      monthEnd:"",
	      yearStart:"",
	      yearEnd:""
	    }
	}

  cancelAllPastBookings(){
      var formValues = {
        userId : localStorage.getItem("user_ID")
      }
      axios.patch('/api/bookingmaster/allPastBookings',formValues)
      .then((response) => {
      })
      .catch((error) =>{
          console.log(error)
      })
  }

	   
	componentDidMount(){
	   this.cancelAllPastBookings()
        var yyyy = moment().format("YYYY");
        var monthNum = moment().format("MM");
        var currentMonth = yyyy+"-"+monthNum;

        var monthDateStart = new Date(moment(currentMonth).month("YYYY-MM"));//Find out first day of month with currentMonth
        var monthDateEnd = new Date(moment(currentMonth).add(1,"M"));
        this.setState({
          monthStart:monthDateStart,
          monthEnd:monthDateEnd
        });

        
        var currentYear = moment().format('YYYY');
        var yearDateStart = new Date("1/1/" + currentYear);
        var yearDateEnd = new Date (yearDateStart.getFullYear(), 11, 31);

        this.setState({
          yearStart : yearDateStart,
          yearEnd: yearDateEnd
        })
	}

  render(){
    return(
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
           <section className="content">
           	<div className="row">
	           	<Statistics 
                display={true}
	           		bgColor="bg-aqua"
	           		faIcon="fa-building"
	           		firstField={{"Field":"Total Clients","method":"get","path":"/api/entitymaster/get/count/client"}} 
                secondField={{"Field":"Total Project","method":"get","path":"/api/entitymaster/countProjects/client"}}
                path="/client/list" 
                history={this.props.history}
				      />
	           	<Statistics 
                display={true}
	           		bgColor="bg-red"
	           		faIcon="fa-map-marker"
	           		firstField={{"Field":"Recording Locations","method":"get","path":"/api/recordinglocation/get/count"}}
                 secondField={{"Field":"Camera Locations","method":"get","path":"/api/cameralocation/get/count"}}
                 path="/locationmap" 
                 history={this.props.history}
	           	/>
	           	<Statistics
                display={true}
	           		bgColor="bg-green"
	           		faIcon="fa-ticket"
	           		firstField={{"Field":"Total Tickets","method":"get","path":"/api/tickets/get/count/all"}}
                 secondField={{"Field":"Open Tickets","method":"get","path":"/api/tickets/get/count/open"}}
                 path="/ticketlist" 
                 history={this.props.history}
	           	/>
	           	<Statistics 
                display={true}
	           		bgColor="bg-yellow"
	           		faIcon="fa-users"
	           		firstField={{"Field":"Total Staff","method":"get","path":"/api/users/get/count/"+localStorage.getItem('company_Id')}}
                 secondField={{"Field":"Tracked Users","method":"get","path":"/api/attendance/get/count/"+localStorage.getItem('company_Id')}}
                 path="/employee/lists" 
                 history={this.props.history}
	            />
           	</div>
           	<div className="row">
           		<PieChart
                display={true}
           			boxColor="box-success"
           			title="Status Wise Tickets"
                api={{"method":"get","path":"/api/tickets/get/tickets_status_wise"}} />
           		<PieChart
                display={true}
           			boxColor="box-default"
           			title="Client-wise Tickets" 
                api={{"method":"get","path":"/api/tickets/get/client_wise_tickets"}} />
           	</div>
           	<div className="row">
           		<BarChart
                display={true}
           			boxColor="box-warning"
           			title="Month-wise Ticket"
                api={{"method":"get","path":"/api/tickets/get/month_wise_tickets/"+this.state.yearStart+"/"+this.state.yearEnd}} />
           		<Report
                display={true}
                tableHeading={["Ticket Id","Client","Status","Date"]}
           			boxColor="box-primary"
           			title="Latest Tickets"
                api={{"method":"post","path":"/api/tickets/post/list",body:filterData}}
                redirectlink="/ticketlist" />
                {/* <Locations
                display={true}
                boxColor="box-warning"
                title="Locations Map"
                api={{"method":"get","path":"/api/tickets/get/month_wise_tickets/"+this.state.yearStart+"/"+this.state.yearEnd}} /> */}
           	</div>
           </section>
        </div>
   );
  }
}




