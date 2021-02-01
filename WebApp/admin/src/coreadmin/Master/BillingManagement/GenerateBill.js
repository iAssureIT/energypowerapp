import React, { Component }       	from 'react';
import axios 						from 'axios';
import $ 							from 'jquery';
import jQuery 						from 'jquery';
import swal                         from 'sweetalert';
import moment                       from 'moment';


import {withRouter}  		  from 'react-router-dom';

import BillingManagementTable from './BillingManagementTable.js';

class GenerateBill extends Component {
	constructor(props){
		super(props);
		this.state = {
			"RecordsCount"              :'',
            "RecordsTable"              :[],
		    "tableObjects" 				: {paginationApply : false,searchApply     : false},
		    "tableHeading"              :{
		    							 CompanyName:"Company Name",
		    							 EmployeeDetail:"Employee Detail",
		    							 TripDetails : "Trip Details",
		    							 CarDetails:"Car Details", 
		    							 TotalKmTravelled:"Total KM Travelled",
		    							 TotalTimetaken:"Total Time Taken",
		    							 PackageApplied:"Package Applied",
		    							 TotalTravelCost:"Total Travel Cost(Rs)",
		    							 OtherCost:"Other Cost(Rs)",
		    							 TotalEstimatedAmount:"Total Estimated Amount(Rs)", 
		    							 action:"Actions"
		    							}
		}
	}

	componentDidMount(){
		axios.get('/api/bookingmaster/get/getAllBookingListForGenerateBill')
		.then((response)=>{
			console.log('data: ',response.data)
			var tableData = response.data.map((a, i)=>{
				var Total = 0;  // Variable to hold your total
				var tripExpenseVar = a.tripExpenses;
				if(tripExpenseVar && tripExpenseVar.length > 0){
					for(var i = 0, len = tripExpenseVar.length; i < len; i++) {
					    Total += tripExpenseVar[i].ticketPrice;  // Iterate over your first array and then grab the second element add the values up
					}	
				}
		
			  return{
					 CompanyName:"",
					 EmployeeDetail:a.person[0].firstName+' '+a.person[0].lastName+'(Emp No: '+a.person[0].employeeId+')',
					 TripDetails:"<ul className='nopadding'><li>Booking No#: "+a.bookingId+"</li><li><b>"+a.tripType+"</b></li><li><b>From</b></li><li>"+a.from.address+"</li><li>"+moment(a.pickupDate).format('MMMM Do YYYY')+' '+moment(a.pickupTime).format('LT')+"</li><li><b>To</b></li><li>"+a.to.address+"</li><li>"+moment(a.returnDate).format('MMMM Do YYYY')+" "+moment(a.returnTime).format('LT')+"</li></ul>",
					 CarDetails:"<ul><li>"+a.driver[0].firstName+" "+a.driver[0].lastName+"</li><li>Honda City|| MH-12-DE-1234||White AC<li></ul>", 
					 TotalKmTravelled:"175KM",
					 TotalTimetaken:"1.40 hrs",
					 PackageApplied:a.package[0].packageName,
					 TotalTravelCost:a.estimatedCost,
					 OtherCost:Total,
					 TotalEstimatedAmount:"1650", 
					 id:a._id
				}
				
			})
			this.setState({
				RecordsTable : tableData
			})
		})
		.catch((err)=>{
			swal(err)
		})
		
	}


    
	render() {
		return (
         <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 tableComponent">
		       
		       <BillingManagementTable 
	              tableHeading={this.state.tableHeading}
	              dataCount={this.state.RecordsCount}
	              tableData={this.state.RecordsTable}
	              tableObjects={this.state.tableObjects}
	              />	
	     </div>
	    );
		
	} 

}

export default withRouter(GenerateBill);