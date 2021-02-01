import React, { Component } from 'react';
import axios                from 'axios';
import swal                 from 'sweetalert';
import Moment               from 'react-moment';
import moment               from 'moment';

import "./OrderPage.css";

export default class OrderPage extends Component {

  constructor(props) {
    super(props);
        this.state = {
          date            : "24/09/2019",
          orderNumber     : "123456",
          planName        : "Gold Plan",
          amount          : 35000,
          validityPeriod  : "3 Months",
          endsOn          : "Ends on 12/6/2020",
          offeringName    : "Gold Plan",
          orderResponse   : "",
        };
    }
  ScrollTop(event){
    window.scrollTo(0,0);
  }
  componentDidMount()
  {
    var user_ID = localStorage.getItem('user_ID')      
    axios
        .get('/api/subscriptionorders/paymentOrderDetailsUser/'+user_ID)
        .then((orderResponse)=>{ 

          this.setState({
            orderResponse : orderResponse.data,
          })

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
    const loggedIn = localStorage.getItem("user_ID");
    return (
            loggedIn ?

            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 backColorWhite  ">
              {
                this.state.orderResponse.length>0 ?
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding  ">
                      <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 selectedPlanOP noPadding">
                          <label> My Orders</label>
                      </div>
                      <div className="col-lg-7 col-lg-offset-1  col-md-12 col-sm-12 col-xs-12 ">
                          <div className="row">
                          {
                            this.state.orderResponse && this.state.orderResponse.length>0 ?
                            this.state.orderResponse.map((data, index)=>{
                              return(
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 PlanDetailsOP" key={index} >
                                <a href={"/invoicePageView/"+data.paymentOrderId}>
                                  <span className="centreDetaillistItemOP  col-lg-8  col-md-12 col-sm-12 col-xs-12">Order Number :<span className="noBold hoverEffect"> {data.invoiceNum}</span></span>
                                  <span className="centreDetaillistItemOP col-lg-4  col-md-12 col-sm-12 col-xs-12"><span className="pull-right ">Date : <span className="noBold">   <Moment format="DD/MM/YYYY">{data.createdAt}</Moment></span></span></span>
                                  <span className="centreDetaillistItemOP col-lg-12  col-md-12 col-sm-12 col-xs-12">Plan Name :<span className="noBold hoverEffect">  {data.planName}</span></span>
                                  <span className="centreDetaillistItemOP col-lg-12  col-md-12 col-sm-12 col-xs-12">Amount : <span className="noBold"> <i class="fa fa-rupee">&nbsp;</i> {(data.amountPaid)/100}</span></span>
                                  <span className="centreDetaillistItemOP col-lg-12  col-md-12 col-sm-12 col-xs-12">Validity Period : 
                                    
                                    <span className="noBold">{data.planName} &nbsp;
                                      ( {
                                         moment( moment(data.createdAt).add(data.validityPeriod, 'M')._d).format("DD-MM-YYYY")
                                      } )
                                    </span>
                                 
                                  </span>
                                  <span className="centreDetaillistItemOP col-lg-12  col-md-12 col-sm-12 col-xs-12">Payment Status: <span className="noBold">{data.paymentStatus !== "Paid" ?  "Failed" : "Success" } </span></span>
                                </a>
                                </div>
                            )
                            })
                            :
                            null
                          }
                          
                      </div>
                      
                      </div>
                     
                    </div>
                    :
                    <div className="selectedPlanNoOrders"><label>No orders yet!</label></div>
                  }
            </div>
             :
            <div>
              {this.props.history.push("/login")}
            </div>
            
    );
  }
}
