import React, { Component }  from 'react';
import axios                 from 'axios';
import swal                  from 'sweetalert';
import Moment                from 'moment';

import "./InvoicePage.css";
var CurrentURL="";
export default class InvoicePage extends Component {

  constructor(props) {
    super(props);
        this.state = {
          paymentDetails : "",
          orderDetails : "",
          companysettings : "",
          CurrentURL     : "",
          user_ID        : "",
          date           : "",
        };
    }
  ScrollTop(event){
    window.scrollTo(0,0);
  }
    getDate() {

    this.setState({
      date: Moment(new Date()).format("DD-MM-YYYY")
    });
  }
  componentDidMount(){
    var order_id = this.props.match.params.order_id;
    CurrentURL = window.location.href;
    this.getDate();

    this.setState({
      CurrentURL : CurrentURL,
    })

    axios
      .get('/api/companysettings/list')
      .then((response)=>{ 
        this.setState({
          companysettings : response.data,
        },()=>{
        })
      })
      .catch(function(error){
          if(error.message === "Request failed with status code 401"){
             swal("Your session is expired! Please login again.","", "error");
             this.props.history.push("/");
          }
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
  }
  makePayment(event)
  {
    event.preventDefault();
   
  }

  render() {
    // const loggedIn = localStorage.getItem("user_ID"); change here
    const loggedIn = true;
      return (
      loggedIn ?
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
           <section className="content">
              <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 backColorWhite  ">
                  {
                  !(this.state.orderDetails.paymentOrderId) ? 
                    <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 selectedPlan">
                      <div className="col-lg-2 col-md-12 col-sm-12 col-xs-12 logoContainerIP">
                      {
                      this.state.companysettings && this.state.companysettings.length>0?
                        <img src={this.state.companysettings[0].logoFilename} className=""/>
                        :
                        null
                      }
                      </div>
                      <div className="col-lg-6 col-lg-offset-4 col-md-12 col-sm-12 col-xs-12 iconContainerIP">
                        <label className="col-lg-12 invoiceHead "><span className="pull-right">INVOICE</span></label>
                        <label className="col-lg-12 dateContain "><span className="pull-right">Date : <span className="noBold">{this.state.date}</span></span></label>
                        <label className="col-lg-12 dateContain "><span className="pull-right">Invoice No. : <span className="noBold">{this.state.orderDetails.invoiceNum}</span></span></label>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding mt20">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 userDetails noPadding">
                          <ul className="customUlIP col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <li className="userName">&nbsp;{this.state.orderDetails.userName}</li>
                            <li className="dateContain">&nbsp;{this.state.orderDetails.email}</li>
                            <li className="dateContain">&nbsp;{this.state.orderDetails.mobileNumber}</li>
                          </ul>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 paymentDetails">
                          <ul className="customUlIP col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                            <li className="PaymentContainer pull-right">Payment Method</li><br/>
                            <li className="dateContain "><span className="pull-right"><span className="noBold">Online Payment</span></span></li><br/>
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding mt20">
                        <table className="customTableIP col-lg-12">
                          <tr>
                            <th>ITEM</th>
                            <th>QTY</th>
                            <th>PRICE</th>
                            <th>TOTAL</th>
                          </tr>
                          <tr >
                            <td className="customTableIPTD">{this.state.orderDetails.planName} </td>
                            <td className="customTableIPTD">1</td>
                            <td className="customTableIPTD"><i class="fa fa-rupee">&nbsp;</i>{(this.state.orderDetails.amountPaid)/100}</td>
                            <td className="customTableIPTD"><i class="fa fa-rupee">&nbsp;</i>{(this.state.orderDetails.amountPaid)/100}</td>
                          </tr>
                        </table>
                      </div> 
                      <div className=" col-lg-12 mt20 noPadding">
                        <ul className="customUlIPFeatures col-lg-4 col-md-12 col-sm-12 col-xs-12">
                          <li className="listStyleNone"><b>Features</b></li>
                          <li className="dateContain">Unlimited blogs for 6 months</li>
                          <li className="dateContain">Lastest blogs to read</li> 
                        </ul>
                        <ul className="customUlIP col-lg-2 col-lg-offset-3 col-md-12 col-sm-6 col-xs-6">
                          <li className="dateContain">Subtotal</li>
                          <li className="dateContain">Tax (18%)</li>
                          <li className="dateContain"><b>Grand Total</b></li>
                        </ul>
                        <ul className="customUlIP textAlignRight col-lg-2 col-md-12 col-sm-6 col-xs-6">
                          <li className="dateContain"><i class="fa fa-rupee"></i>&nbsp;{parseInt(((this.state.orderDetails.amountPaid)/100)/1.18)}</li>
                          <li className="dateContain"><i class="fa fa-rupee"></i>&nbsp;{parseInt((this.state.orderDetails.amountPaid/100)-((this.state.orderDetails.amountPaid/100)/1.18))}</li>
                          <li className="dateContain"><i class="fa fa-rupee"></i>&nbsp;{(this.state.orderDetails.amountPaid/100)}</li>
                        </ul>
                      </div>  
                      <div className="bottomDiv col-lg-12  noPadding">
                        <div className="col-lg-8 col-lg-offset-4  col-md-12 col-sm-12 col-xs-12 btnContainer">
                           <div>
                              <form method="POST" action="https://api.razorpay.com/v1/checkout/embedded">
                                <input type="hidden" name="key_id" value="rzp_test_lQNmCUfCX3Wkh4"/>
                                <input type="hidden" name="order_id" value={this.state.orderDetails.paymentOrderId}/>
                                <input type="hidden" name="name" value="Five Bees"/>
                                <input type="hidden" name="description" value=""/>
                                <input type="hidden" name="image" value="https://cdn.razorpay.com/logos/BUVwvgaqVByGp2_large.png"/>
                                <input type="hidden" name="prefill[name]" value="Gaurav Kumar"/>
                                <input type="hidden" name="prefill[contact]" value="9123456780"/>
                                <input type="hidden" name="prefill[email]" value="gaurav.kumar@example.com"/>
                                <input type="hidden" name="callback_url" value={axios.defaults.baseURL+"/api/subscriptionorders/payment-response/"+this.state.orderDetails._id}/>
                                <input type="hidden" name="cancel_url" value={CurrentURL}/>
                                <button className="col-lg-4 pull-right btn col-md-12 col-sm-12 col-xs-12 makePaymentButton NoPrint">
                                   Make Payment
                                </button>
                              </form>
                           </div>    
                        </div>
                      </div> 
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 receiptFooter ">
                        {this.state.companysettings && this.state.companysettings.length>0?
                
                           <label className="noBold">{this.state.companysettings?this.state.companysettings[0].companywebsite:null} - {this.state.companysettings?this.state.companysettings[0].companyaddress :null} </label>
                          :
                          null
                        }
                      </div>
                    </div>
                  : 
                  <div className="loadingImageContainer col-lg-4 col-lg-offset-4"><img src="/images/Loadingsome.gif"/></div>
                  }
                </div>
              </div>
            </section>
          </div>
        :
        <div>
          {this.props.history.push("/login")}
        </div>
    );
  }
}
