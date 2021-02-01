import React, { Component }  from 'react';
import axios                 from 'axios';
import swal                  from 'sweetalert';
import Moment                from 'moment';

import "./PlanPage.css";

export default class PlanPage extends Component {

  constructor(props) {
    super(props);
        this.state = {
            paymentDetails : "",
        };
    }
  ScrollTop(event){
    window.scrollTo(0,0);
  }
  componentDidMount()
  {
   var user_ID = localStorage.getItem('user_ID')
   this.setState({
    user_ID : user_ID,
   })
   axios.get("/api/users/get/"+user_ID)
    .then((response)=>{ 
        this.setState({
            userinfo : response.data
        })
    })
    .catch((error)=>{
      // console.log("error",error)
    })
  }
  placeOrder(event){
    event.preventDefault();
    var planName         = event.currentTarget.getAttribute("data-planname");
    var price            = event.currentTarget.getAttribute("data-price");
    var validityinmonths = event.currentTarget.getAttribute("data-validityinmonths");
     var options = {
        amount            : (price*100),  // amount in the smallest currency unit
        currency          : "INR",
        receipt           : "order_rcptid_11",
        payment_capture   : '0',
        "plan_ID"         : "",
        "userID"          : this.state.user_ID,
        "planName"        : planName,
        "planAmount"      : price, 
        "validityPeriod"  : validityinmonths, 
        "purchaseDate"    : Moment(new Date()).format("YYYY-MM-DD"),
        "startDate"       : Moment(new Date()).format("YYYY-MM-DD"),
        "endDate"         : "27-08-2020",
        "paymentOrderId"   : "",
        "amountPaid"      : 0,
    };   

    axios
      .post('/api/subscriptionorders/post',options)
      .then((response)=>{ 
        this.setState({
          paymentDetails : response.data,
        })
        this.props.history.push("/invoicePage/"+this.state.paymentDetails.id);
      })
      .catch(function(error){
          if(error.message === "Request failed with status code 401")
          {
             swal("Your session is expired! Please login again.","", "error");
             this.props.history.push("/");
          }
      })
  }
  render() {
    return (
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <section className="content">
            <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectedPlanPP noPadding">
                  <label className="col-lg-12"> Select Plan</label>
              </div>
              <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 ">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 PlanDetailsPlan">
                   <label className="planName"> <i class="fa fa-rupee">&nbsp;</i>999</label><br/>
                   <label className="">was <strike><i class="fa fa-rupee">&nbsp;</i>1499</strike></label><br/>
                   <label className="timePeriod mt20">for 6 months</label><br/>
                   <button className="btn btn-primary buyNowPlan" data-planname="6 Months" data-price="999" data-validityinmonths="6" onClick={this.placeOrder.bind(this)}> Buy Now </button>
                </div> 
              </div>
              <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 ">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 PlanDetailsPlan">
                   <label className="planName"> <i class="fa fa-rupee">&nbsp;</i>1499</label><br/>
                   <label className="">was <strike><i class="fa fa-rupee">&nbsp;</i>1999</strike></label><br/>
                   <label className="timePeriod mt20">for 1 year</label><br/>
                   <button className="btn btn-primary buyNowPlan" data-planname="1 Year" data-price="1499" data-validityinmonths="12" onClick={this.placeOrder.bind(this)}> Buy Now </button>
                </div>  
              </div>
              <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 ">
               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 PlanDetailsPlan">
                 <label className="planName"> <i class="fa fa-rupee">&nbsp;</i>1999</label><br/>
                 <label className="">was <strike><i class="fa fa-rupee">&nbsp;</i>2500</strike></label><br/>
                 <label className="timePeriod mt20">for 2 year</label><br/>
                 <button className="btn btn-primary buyNowPlan" data-planname="2 Year" data-price="1999" data-validityinmonths="24" onClick={this.placeOrder.bind(this)}> Buy Now </button>
              </div>  
            </div>               
        </div>
      </section>
    </div>
    );
  }
}
