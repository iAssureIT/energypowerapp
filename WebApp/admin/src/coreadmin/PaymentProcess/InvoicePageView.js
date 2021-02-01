import React, { Component }  from 'react';
import axios                 from 'axios';
import swal                  from 'sweetalert';
import Moment                from 'moment';

var CurrentURL="";
export default class InvoicePageView extends Component {

  constructor(props) {
    super(props);
        this.state = {
          paymentDetails : "",
          companysettings : "",
          CurrentURL     : "",
          user_ID        : "",
          date           : "",
          orderDetails   : "",
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
    CurrentURL = window.location.href;
    var order_id = this.props.match.params.order_Id;
    this.getDate();
    this.setState({
      CurrentURL : CurrentURL,
    })
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
  makePayment(event)
  {
    event.preventDefault();
  }

  render() {
    const loggedIn = localStorage.getItem("user_ID");
        
          return (
           loggedIn ?
            <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 backColorWhite  ">
             
                <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 selectedPlan">
                  <div className="col-lg-2 col-md-12 col-sm-12 col-xs-12 logoContainerIP">
                  {
                  this.state.companysettings && this.state.companysettings.length>0?
                      <img src="/images/WealthyVia_Logo.png" className=""/>
                    :
                    null
                  }
                  </div>
                  {this.state.orderDetails?
                  <div className="col-lg-6 col-lg-offset-4 col-md-12 col-sm-12 col-xs-12 iconContainerIP">
                      <label className="col-lg-12 invoiceHead "><span className="pull-right">INVOICE</span></label>
                      <label className="col-lg-12 dateContain "><span className="pull-right">Date : <span className="noBold">{this.state.date}</span></span></label>
                      <label className="col-lg-12 dateContain "><span className="pull-right">Invoice No. : <span className="noBold">{this.state.orderDetails.invoiceNum}</span></span></label>

                  </div>
                  :
                  null
                  }
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadding mt20">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 userDetails noPadding">
                        {
                        this.state.userinfo
                        ?
                          <ul className="customUlIP col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <li className="userName">&nbsp;{this.state.userinfo.fullName}</li>
                            <li className="dateContain">&nbsp;{this.state.userinfo.email}</li>
                            <li className="dateContain">&nbsp;{this.state.userinfo.mobNumber}</li>
                          </ul>
                      :
                      null
                      }
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
                      {this.state.orderDetails?
                      <tr >
                        <td className="customTableIPTD">{this.state.orderDetails.planName} </td>
                        <td className="customTableIPTD">1</td>
                        <td className="customTableIPTD"><i class="fa fa-rupee">&nbsp;</i>{(this.state.orderDetails.amountPaid)/100 }</td>
                        <td className="customTableIPTD"><i class="fa fa-rupee">&nbsp;</i>{(this.state.orderDetails.amountPaid)/100 }</td>
                      </tr>
                      :
                      null
                    }
                     
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
                      {this.state.orderDetails ?
                      <ul className="customUlIP textAlignRight col-lg-2 col-md-12 col-sm-6 col-xs-6">
                        <li className="dateContain"><i class="fa fa-rupee"></i>&nbsp;{parseInt(((this.state.orderDetails.amountPaid)/100)/1.18)}</li>
                        <li className="dateContain"><i class="fa fa-rupee"></i>&nbsp;{parseInt((this.state.orderDetails.amountPaid/100)-((this.state.orderDetails.amountPaid/100)/1.18))}</li>
                        <li className="dateContain"><i class="fa fa-rupee"></i>&nbsp;{(this.state.orderDetails.amountPaid/100)}</li>
                      </ul>
                      :
                      null
                      }
                  </div>  
                  <div className="bottomDiv col-lg-12  noPadding">
                      <div className=" thankYouDiv col-lg-3 pull-right">
                        <label className="">THANK YOU !</label>
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
             
            </div>
            :
            <div>
              {this.props.history.push("/login")}
            </div>
            
          );
        
            
                        
  }
}
