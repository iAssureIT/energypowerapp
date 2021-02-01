import React, { Component }     from 'react';
import { render }               from 'react-dom';
import $ from "jquery";
import swal from 'sweetalert';
import InputMask      		from 'react-input-mask';
import axios from 'axios';


const accountnumberRegex  = RegExp(/^[0-9]{9,18}$|^$/);
const companyAddressRegex = RegExp(/^[a-zA-Z0-9\s,'/.-]*$/);
const ifsccodeRegex = RegExp(/^([ a-zA-Z0-9&/\(\)\.'-]+)$/);
const companynameRegex = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);


class CompanyBankDetails extends Component{
    constructor(props) {
        super(props);
        this.state = {
          accHolderName  : this.props.accHolderName,
          accNickName    : this.props.accNickName,
          accType        : this.props.accType,
          bankName       : this.props.bankName,
          branchName     : this.props.branchName,
          accNumber      : this.props.accNumber,
          ifscCode       : this.props.ifscCode,
          submitVal      : true,
          subscription : {
           
          }
        };
    this.handleChange = this.handleChange.bind(this);
       
  }
  componentDidMount(){
    $.validator.addMethod("regexifsc", function (value, element, regexpr) {
        return regexpr.test(value);
    }, "Please enter valid IFSC Code.");

    $("#bankDetailForm").validate({
      rules: {
        accHolderName: {
          required: true,
        },
        bankName: {
          required: true,
        },
        accNumber: {
          required: true,
        },
        branchName: {
          required: true,
        },
        ifscCode: {
          required: true,
          regexifsc : /^[A-Z|a-z]{4}[0][\d]{6}$/
        }
      }
    });
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.companyInfo && nextProps.companyInfo.bankDetails){
      if (nextProps.companyInfo.bankDetails.length==0) {
        this.setState({ companyId      : nextProps.companyInfo._id });
      }else{
        this.setState({
          companyId      : nextProps.companyInfo._id,
          bankDetailsId  : nextProps.companyInfo.bankDetails[0]._id,
          submitVal      : false, 
          accHolderName  : nextProps.companyInfo.bankDetails[0].accHolderName,
          accNickName    : nextProps.companyInfo.bankDetails[0].accNickName,
          accType        : nextProps.companyInfo.bankDetails[0].accType,
          bankName       : nextProps.companyInfo.bankDetails[0].bankName,
          branchName     : nextProps.companyInfo.bankDetails[0].branchName,
          accNumber      : nextProps.companyInfo.bankDetails[0].accNumber,
          ifscCode       : nextProps.companyInfo.bankDetails[0].ifscCode
        });
      }
    }
  }
  submitBankDetail(event){
    event.preventDefault();
      var companyBankDetailsFormValue ={
        companyId      : this.state.companyId,
        accHolderName  : this.state.accHolderName,
        accNickName    : this.state.accNickName,
        accType        : this.state.accType,
        bankName       : this.state.bankName,
        branchName     : this.state.branchName,
        accNumber      : this.state.accNumber,
        ifscCode       : this.state.ifscCode
      }//close array
      var bankDetailsUpdateFormValue = {
        companyId      : this.state.companyId,
        bankDetailsId  : this.state.bankDetailsId,
        accHolderName  : this.state.accHolderName,
        accNickName    : this.state.accNickName,
        accType        : this.state.accType,
        bankName       : this.state.bankName,
        branchName     : this.state.branchName,
        accNumber      : this.state.accNumber,
        ifscCode       : this.state.ifscCode
      }
     
    if($("#bankDetailForm").valid()){
      if (this.state.submitVal) {
        axios.patch('/api/companysettings/bankDetails',companyBankDetailsFormValue)
        .then(function (response) {
          // handle success
          swal({                
                text: "Bank details added successfully!",
              });

          this.setState({
            accNickName : "",
            accType     : "",
            bankName    : "",
            accNumber   : "",
            ifscCode    : "",
            submitVal   : false
          })
          
        })
        .catch(function (error) {
          swal({                
                text: "Failed to add bank details!",
              });
        })
      }else{
        axios.patch('/api/companysettings/updateBankDetails',bankDetailsUpdateFormValue)
        .then(function (response) {
          swal({                
                text: "Bank details updated successfully!",
              });
        })
        .catch(function (error) {
          if (error.response.status==404) {
            swal({                
                text: "Nothing to update!",
              });
          }
          
        })
      }

    }
}

handleChange(event){
  const {name,value} = event.target;
  this.setState({ 
    [name]:value
  });
}
  
  render(){
   
    return(
      <div className="">
          <section className="NotificationContent">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyDisplayForm">
                <div className="">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h4 className="">Bank Details</h4>
                  </div>
                  <hr className="compySettingHr" />
                    <div className="tablebdy">
                      <form id="bankDetailForm" className="bankDetailForm">
                           <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                              <div className="form-group">
                                  <label className="labelform" >Enter Account Holder Name</label><span className="astrick">*</span>
                                  <input id="accHolderName" value={this.state.accHolderName} placeholder="Eg. Abc Xyz" data-text="accountholdername" onChange={this.handleChange.bind(this)} type="text" name="accHolderName" ref="accHolderName" className="form-control areaStaes" />
                              </div>  
                          </div>
                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="labelform" >Enter Account Nick Name</label><span className="astrick"></span>
                                <input id="accNickName" value={this.state.accNickName} onChange={this.handleChange.bind(this)} type="text" name="accNickName" ref="accNickName" className="form-control areaStaes"/>
                            </div>  
                          </div>
                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="labelform" >Enter Account Type</label><span className="astrick"></span>
                                <input id="accType" value={this.state.accType} placeholder="Eg. Saving Account" onChange={this.handleChange.bind(this)} type="text" name="accType" ref="accType" className="form-control areaStaes" />
                              
                            </div>  
                          </div>
                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="labelform" >Enter Bank Name</label><span className="astrick">*</span>
                                <input id="bankName" value={this.state.bankName} placeholder="Eg. State Bank Of India" data-text="bankname" onChange={this.handleChange.bind(this)} type="text" name="bankName" className="form-control areaStaes"  />
                            </div>  
                          </div>

                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="labelform" >Enter Account Number</label><span className="astrick">*</span>
                                <input id="accNumber" value={this.state.accNumber} placeholder="Eg. 801901456" data-text="accountnumber" onChange={this.handleChange.bind(this)} type="text" name="accNumber" className="form-control areaStaes" />
                            </div>  
                          </div>

                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="labelform" >Enter Branch Name</label><span className="astrick">*</span>
                                <input id="branchName" value={this.state.branchName} placeholder="Eg. Pune Branch" data-text="branchname" onChange={this.handleChange.bind(this)} type="text" name="branchName" className="form-control areaStaes" />
                            </div>  
                          </div>

                          <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <label className="labelform" >Enter IFSC Code</label><span className="astrick">*</span>
                                <a title="Please enter valid IFSC Code(Eg.SBIN0123456)." className="pull-right"> <i className="fa fa-question-circle"></i> </a>
                                <input id="ifscCode"placeholder="Eg. SBIN0123456" value={this.state.ifscCode} data-text="ifsccode" onChange={this.handleChange.bind(this)} type="text" name="ifscCode" className="form-control areaStaes" />
                            </div>  
                          </div>
                          
                        
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">

                          <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn button3 pull-right" id="btnCheck"  onClick={this.submitBankDetail.bind(this)}>
                            {this.state.submitVal
                              ?
                                "Submit"
                              : 
                                "Update"
                            }  
                          </button>
                        </div>
                      </form>
                     
                    </div>
                  </div>
                </div>
              </div>
            </section>
              
        </div>


      );
  }

 }

export default CompanyBankDetails;
