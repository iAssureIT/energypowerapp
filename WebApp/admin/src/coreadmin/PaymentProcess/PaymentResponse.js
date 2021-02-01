import React  				       from 'react';
import axios                 from 'axios';
import swal                  from 'sweetalert';
import Moment                from 'moment';
import "./PaymentResponse.css";

var CurrentURL="";

export default class PaymentResponse extends React.Component {
	constructor(props) {
		super(props);
    this.state = {
      paymentDetails  : "",
      date            : "",
      orderDetails    : "",
    }
	}
	componentDidMount(){
		var order_id = this.props.match.params.orderId;
    CurrentURL = window.location.href;
    this.setState({
      date: Moment(new Date()).format("DD-MM-YYYY")
    }) 
        /* get orderDetails */
        axios
        .get('/api/subscriptionorders/paymentOrderDetails/'+order_id)
        .then((orderDetails)=>{ 
          this.setState({
            orderDetails : orderDetails.data,
          }) 

        })
        .catch(function(error){
            if(error.message === "Request failed with status code 401")
            {
               swal("Your session is expired! Please login again.","", "error");
               this.props.history.push("/");
            }
        })
        /* get company settings value*/
      axios
        .get('/api/companysettings/list')
        .then((response)=>{ 
          this.setState({
            companysettings : response.data,
          })
          
        })
        .catch(function(error){
            if(error.message === "Request   failed with status code 401")
            {
               swal("Your session is expired! Please login again.","", "error");
               this.props.history.push("/");
            }
        })
	}
  printContent(event){
    window.print();

  }
	render() {
		  return (
           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 backColorWhite ">
              <div className="col-lg-8 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 ">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt100 outerBorder noPadding">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectedPlanPR">
                  {  
                    this.state.companysettings && this.state.companysettings.length >0?
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 companyDetails "><b> </b>{this.state.companysettings?this.state.companysettings[0].companyEmail:null}
                      <div className=""><b></b>{this.state.companysettings?this.state.companysettings[0].companywebsite:null}</div>
                      <div className=""><b></b>{this.state.companysettings?this.state.companysettings[0].companyaddress :null}</div>
                      <div className=""><b></b>{this.state.companysettings?this.state.companysettings[0].state+" "+this.state.companysettings[0].country+" "+this.state.companysettings[0].pincode:null}</div>
                    </div>
                    :
                    null
                  }
                    {
                      this.state.companysettings&& this.state.companysettings.length >0?
                      <img src="/images/WealthyVia_Logo.png" className="col-lg-5 pull-right"/>

                      :
                      null
                    }
                
                </div>
                  <div className="col-lg-12">

                  {
                    this.state.orderDetails && 
                    this.state.orderDetails.paymentStatus === "Paid" ?
                    <label className="note mt20"> Thank you for your payment.</label>
                    :
                    <label className="noteRed mt20"> Something went wrong</label>

                  }
                   
                  </div>
                  <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 PlanDetails mt20">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noPadding ">
                        <ul className="customUlIP">
                          <li><b>Transaction Status</b></li>
                          <li><b>Transaction Number</b></li>
                          <li><b>Transaction Date</b></li>
                          <li><b>name</b></li>
                          <li><b>Mobile Number</b></li>
                          <li><b>Email Id</b></li>
                          <li><b>Amount</b></li>
                         
                        </ul>                     
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noPadding">
                      {this.state.orderDetails ?
                       <ul className="customUlIP">
                          {
                            this.state.orderDetails.paymentStatus === "Paid" ? 
                            <li className="successPay"><b>Success </b></li>
                            :
                            <li className="failPay"><b>Failed </b></li>
                          }

                          <li>{this.state.orderDetails.invoiceNum?this.state.orderDetails.invoiceNum :"-"}</li>
                          <li>{this.state.date}</li>
                          <li>{this.state.orderDetails.userName}</li>
                          <li>{this.state.orderDetails.mobileNumber}</li>
                          <li>{this.state.orderDetails.email}</li>
                          <li>{(this.state.orderDetails.amountPaid)/100}</li>
                         
                        </ul>
                        :
                        null
                        }

                    </div>

                   </div>
                </div>
                 <div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 btnContainer noPadding NoPrint">                
                    <div className="col-lg-2  col-md-12 col-sm-12 col-xs-12 makePaymentButton " >
                      <a href="/allblogs"> Back </a>
                    </div>
                     <div className="col-lg-2 pull-right  col-md-12 col-sm-12 col-xs-12 makePaymentButton NoPrint" onClick={this.printContent.bind(this)}>
                       Print
                    </div>
                  </div>  
              </div>
            </div>
         )
	}
}
