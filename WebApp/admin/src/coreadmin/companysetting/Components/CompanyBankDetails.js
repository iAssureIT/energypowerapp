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
          accHolderName  : "",
          accNickName    : "",
          accType        : "",
          bankName       : "",
          branchName     : "",
          accNumber      : "",
          ifscCode       : "",
          bankDetails    :[],
          submitVal   : true
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
        }
      }
    });
  }
  componentWillReceiveProps(nextProps){
    this.getData()
  }
  getData(){
    axios.get('/api/companysettings/list')
    .then((response)=>{
      this.setState({
        bankDetails:response.data
      })
    })
  }
  submitBankDetail(event){
    event.preventDefault();
      var companyBankDetailsFormValue ={
        accHolderName  : this.state.accHolderName,
        accNickName    : this.state.accNickName,
        accType        : this.state.accType,
        bankName       : this.state.bankName,
        branchName     : this.state.branchName,
        accNumber      : this.state.accNumber,
        ifscCode       : this.state.ifscCode,
        createdBy      : localStorage.getItem("user_ID")
      }//close array
      var bankDetailsUpdateFormValue = {
        companyId      : this.state.companyId,
        accHolderName  : this.state.accHolderName,
        accNickName    : this.state.accNickName,
        accType        : this.state.accType,
        bankName       : this.state.bankName,
        branchName     : this.state.branchName,
        accNumber      : this.state.accNumber,
        ifscCode       : this.state.ifscCode,
        updatedBy      : localStorage.getItem("user_ID")
      }
     
    if($("#bankDetailForm").valid()){
      if(this.state.submitVal) {
        axios.post('/api/companysettings/bankDetails',companyBankDetailsFormValue)
        .then((response)=>{
          // handle success
          swal({                
                text: "Bank details added successfully!",
              });

          this.getData();

          this.setState({
            accNickName : "",
            accHolderName:"",
            accType     : "",
            bankName    : "",
            accNumber   : "",
            ifscCode    : "",
            submitVal   : false
          })
          
        })
        .catch((error)=>{
          swal({                
                text: "Failed to add bank details!",
              });
        })
      }else{
        console.log('bankDetailsUpdateFormValue: ',bankDetailsUpdateFormValue)
        axios.patch('/api/companysettings/updateBankDetails',bankDetailsUpdateFormValue)
        .then((response)=>{
          swal({                
                text: "Bank details updated successfully!",
              });
          this.getData();
          this.setState({
            accNickName : "",
            accHolderName : "",
            accType     : "",
            bankName    : "",
            accNumber   : "",
            ifscCode    : "",
            submitVal   : true,
            companyId:""
          })
        })
        .catch((error)=>{
          if (error.response.status==404) {
            swal({                
                text: "Nothing to update!",
              });
          }
          
        })
      }

    }
}

edit(event){
  event.preventDefault();
  $("html,body").scrollTop(0);
  var id = $(event.currentTarget).attr('id');
  axios.get('/api/companysettings/get/one/'+id)
  .then((response)=>{
    this.setState({
      companyId      : response.data._id,
      accHolderName  : response.data.accHolderName,
      accNickName    : response.data.accNickName,
      accType        : response.data.accType,
      bankName       : response.data.bankName,
      branchName     : response.data.branchName,
      accNumber      : response.data.accNumber,
      ifscCode       : response.data.ifscCode,
      submitVal   : false
    })
  })
  .catch((error)=>{
    console.log(error)
  })
}

handleChange(event){
  const {name,value} = event.target;
  this.setState({ 
    [name]:value
  });
}

delete(event){
  event.preventDefault();
  this.setState({deleteID: event.currentTarget.getAttribute('data-id')})
  $('#deleteModal').show();
}

closeModal(event){
    event.preventDefault();
    $('#deleteModal').hide(); 
}
confirmDelete(event){
  event.preventDefault();
  axios.delete('/api/companysettings/delete/'+this.state.deleteID)
  .then((response)=> {
    swal({                
          text: "Bank details Deleted successfully!",
        });
    this.setState({deleteID:""})
    $('#deleteModal').hide(); 
    this.getData();
  })
  .catch((error)=> {
    swal({                
          text: "Failed to Delete payment gateway details!",
        });
  })
  
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

                      <div className="table-responsive topmr40 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <table className="table iAssureITtable-bordered table-striped table-hover">
                          <thead className="tempTableHeader">
                            <tr className="">
                              <th className="umDynamicHeader srpadd textAlignCenter"> Bank Name </th>
                              <th className="umDynamicHeader srpadd textAlignCenter"> Account Type </th>
                              <th className="umDynamicHeader srpadd textAlignCenter"> Branch Name </th>
                              <th className="umDynamicHeader srpadd textAlignCenter"> Account Holder Name </th>
                              <th className="umDynamicHeader srpadd textAlignCenter"> Account Number </th>
                              <th className="umDynamicHeader srpadd textAlignCenter"> IFSC Code </th>
                              <th className="umDynamicHeader srpadd textAlignCenter"> Action </th>
                            </tr>
                          </thead>
                          <tbody>
                          {this.state.bankDetails.map((data,index)=>{
                            return(
                              <tr key={index}>
                                  <td className="textAlignCenter">{data.bankName}</td>
                                  <td className="textAlignCenter">{data.accType}</td>
                                  <td className="textAlignCenter">{data.branchName}</td>
                                  <td className="textAlignCenter">{data.accHolderName}</td>
                                  <td className="textAlignCenter">{data.accNumber}</td>
                                  <td className="textAlignCenter">{data.ifscCode}</td>
                                  <td className="textAlignCenter">
                                  <span>
                                      <button title="Edit" id={data._id}  onClick={this.edit.bind(this)}><i className="fa fa-pencil" ></i></button> &nbsp; &nbsp;
                                      <button title="Delete" data-id={data._id}  onClick={this.delete.bind(this)}> <i className="fa fa-trash redFont" ></i></button> 
                                      <div className="modal" id="deleteModal" role="dialog">
                                        <div className="adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div className="modal-content adminModal-content col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                                              <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                  <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                                                    <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.closeModal.bind(this)}>&times;</button>
                                                  </div>
                                                </div>
                                                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                  <h4 className="blackLightFont textAlignCenter examDeleteFont col-lg-12 col-md-12 col-sm-12 col-xs-12">Are you sure, do you want to delete?</h4>
                                              </div>
                                                <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                            <button type="button" className="btn adminCancel-btn col-lg-7 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal" onClick={this.closeModal.bind(this)}>CANCEL</button>
                                                          </div>
                                                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                      <button type="button" className="btn examDelete-btn col-lg-7 col-lg-offset-5 col-md-7 col-md-offset-5 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal" onClick={this.confirmDelete.bind(this)} >DELETE</button>
                                                  </div>
                                              </div>
                                            </div>
                                        </div>
                                    </div>  
                                  </span>
                                  </td>
                              </tr>
                            )
                          })}
                          </tbody>
                        </table>
                      </div>
                     
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
