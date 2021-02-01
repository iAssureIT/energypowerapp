import React, { Component }       	from 'react';
import {Route, withRouter} 			from 'react-router-dom';
import swal                     	from 'sweetalert';
import axios 						from 'axios';
import $ 							from 'jquery';
import jQuery 						from 'jquery';
import 'jquery-validation';

import BillingManagementTable from './BillingManagementTable.js';

class CancelledBills extends Component {
	constructor(props){
		super(props);
		this.state = {
			"RecordsCount"              :'',
            "RecordsTable"              :[],
		    "tableObjects" 				: {paginationApply : true,searchApply     : false},
		    "tableHeading"              :{
		    							 TripID : "TripID",
		    							 Type: "Type",
		    							 CompanyName:"Company Name",
		    							 EmployeeDetail:"Employee Detail",
		    							 TripDate:"Trip Date",
		    							 LocationDetail:"Location Detail",
		    							 CarDetails:"Car Details", 
		    							 TotalKmTravelled:"Total KM Travelled",
		    							 TotalTimetaken:"Total Time Taken",
		    							 PackageApplied:"Package Applied",
		    							 RateApplied:"Rate Applied",
		    							 TotalTravelCost:"Total Travel Cost",
		    							 Toll:"Toll", 
		    							 Parking:"Parking", 
		    							 DriverAllowance:"Driver Allowance", 
		    							 NightCharges:"Night Charges", 
		    							 EarlyMorningCharges:"Early Morning Charges", 
		    							 OtherCharges:"Other Charges", 
		    							 TotalEstimatedAmount:"Total Estimated Amount", 
		    							}
		}
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

export default withRouter(CancelledBills);