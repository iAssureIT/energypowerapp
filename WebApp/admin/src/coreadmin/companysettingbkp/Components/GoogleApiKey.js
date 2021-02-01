import React, { Component } from 'react';
import { render } from 'react-dom';
import $ from "jquery";
import axios from 'axios';
import swal from 'sweetalert';
class GoogleApiKey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      namepayg    : "",
      environment : "",
      status      : "",
      secretkey   : "",
      partnerid   : "",    
      paymentgatewayid   : "",    
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount(){
    this.getData();
  }
 
  handleChange(event){
    const {name,value} = event.target;
    this.setState({ 
      [name]:value
    });
  }  
  getData(){
    var type = 'GOOGLE';
    axios.get('/api/projectsettings/get/'+type)
            .then((response) => {
                
                this.setState({ googleapikeyInfo: response.data.googleapikey },()=>{
                    console.log(" response.data Post google==>", this.state.googleapikeyInfo);
                });
            })
            .catch((error) => {});
}
  submit(event){
      event.preventDefault();
        var formvalue ={
          googleapikey : this.state.googleapikey,
          type      : 'GOOGLE',
          createdBy : localStorage.getItem("user_ID")
        }
        console.log("formvalue===>",formvalue);
          axios.post('/api/projectsettings/post',formvalue)
          .then((response)=> {
            console.log("response===>",response.data);
            this.getData();
            swal({                
                  text: "Google API Key details added successfully!",
                });
            
            this.setState({
                googleapikey    : "",
            })
            this.getData();
          })
          .catch((error)=> {
            swal({                
                  text: "Failed to add Google API Key details!",
                });
          })
        
  
      // }
  
  }
  update(event){
    event.preventDefault();
      var formvalues ={
        googleapikey : this.state.googleapikey,
        type      : 'GOOGLE',
        createdBy : localStorage.getItem("user_ID")
      }
        axios.patch('/api/projectsettings/patch/GOOGLE',formvalues)
        .then((response)=> {
          this.getData();
          swal({                
                text: "Google API Key details Updated successfully!",
              });
          
          this.setState({
            googleapikey    : "",
          })
        })
        .catch((error)=> {
          swal({                
                text: "Failed to Updated Google API Key details!",
              });
        })
      

    // }

}
  edit(event) {
    var googleapikey=  this.state.googleapikeyInfo;
        this.getData();
        this.setState({ 
            googleapikey: googleapikey,
        });
    }
  
  deletegooglekeyapi(event){
    // event.preventDefault();
    console.log("this.getData();")
    // this.setState({deleteID: event.currentTarget.getAttribute('data-id')})
    $('#deleteModal').show();
  }
  closeModal(event){
    event.preventDefault();
    $('#deleteModal').hide(); 
  }
  confirmDelete(event){
    event.preventDefault();
    axios.delete('/api/paymentgateway/delete/'+this.state.deleteID)
    .then((response)=> {
      swal({                
            text: "Payment Gateway details Deleted successfully!",
          });
      $('#deleteModal').hide(); 
      this.getData();
    })
    .catch((error)=> {
      swal({                
            text: "Failed to Delete payment gateway details!",
          });
    })
    
  }
  render() {
    return (
      <div className="">
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <h4 className="">Goolge Api Key</h4>
          </div>
          <hr className="compySettingHr" />
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <form id="CompanyPaymentGatewayForm">
              <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box ">
                <label className="labelform">Goolge Api Key <span className="requiredsign">*</span></label>
                <input type="text" style={{ textTransform: 'capitalize' }}
                  className="form-control UMname has-content"
                  id="googleapikey" ref="googleapikey" name="googleapikey" placeholder="Goolge Api googleapikey" 
                  value={this.state.googleapikey} onChange={this.handleChange} /> 
              </div>
              
              <div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                {
                    this.state.googleapikey === "" ?
                        <button className="col-lg-3 col-md-2 col-xs-12 col-sm-12 col-xs-12 pull-right btn button3 topMargin outlinebox" type="submit" onClick={this.submit.bind(this)} >Submit</button>
                    :
                        <button className="col-lg-3 col-md-2 col-xs-12 col-sm-12 col-xs-12 pull-right btn button3 topMargin outlinebox" type="update" onClick={this.update.bind(this)} >Update</button>
                }
                
              </div>
            </form>
            <div className="table-responsive topmr40 col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <table className="table iAssureITtable-bordered table-striped table-hover">
                <thead className="tempTableHeader">
                  <tr className="">
                    <th className="umDynamicHeader srpadd textAlignCenter"> Sr No. </th>
                    <th className="umDynamicHeader srpadd textAlignCenter"> Google API Key </th>
                    <th className="umDynamicHeader srpadd textAlignCenter"> Action </th>
                  </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="textAlignCenter">{1}</td>
                    <td className="textAlignCenter">{this.state.googleapikeyInfo}</td>
                    <td className="textAlignCenter">
                    <span>
                        <button title="Edit"   onClick={this.edit.bind(this)}><i className="fa fa-pencil" ></i></button> &nbsp; &nbsp;
                        {/* <button title="Delete" onClick={this.deletegooglekeyapi.bind(this)}> <i className="fa fa-trash redFont" ></i></button>  */}
                    </span>
                    </td>
                </tr>
                </tbody>
              </table>
            </div>
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
          </div>
        </div>
      </div>

    );
  }

}

export default GoogleApiKey;
