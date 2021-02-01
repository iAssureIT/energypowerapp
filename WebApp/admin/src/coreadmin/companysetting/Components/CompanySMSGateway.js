import React, { Component } from 'react';
import { render } from 'react-dom';
import $ from "jquery";
import axios from 'axios';
import swal from 'sweetalert';
import PhoneInput               from 'react-phone-input-2';

class CompanySMSGateway extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authID    : "", 
      authToken : "", 
      sourceMobile : "", 
      smsid   : "",  
      SMSDetails:"" 
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeMobile = this.handleChangeMobile.bind(this);
  }

  componentDidMount(){
    this.getData();
    $.validator.addMethod("regxtax", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid tax rate.");

    $("#CompanySMSGatewayForm").validate({
    rules: {
      authID: {
        required: true,
      },
      authToken: {
        required: true,
      },
      sourceMobile: {
        required: true,
      },
      
    }
    });  
  }

  componentWillReceiveProps(nextProps){
    axios.get('/api/projectsettings/get/SMS')
      .then((response) => {
          this.setState({ 
            smsid : response.data._id,
            authID : response.data.authID,
            authToken : response.data.authToken,
            sourceMobile : response.data.sourceMobile,
          });
      })
      .catch((error) => {});
  }
 
  handleChange(event){
    const {name,value} = event.target;
    this.setState({ 
      [name]:value
    });
  }  

  handleChangeMobile(event){ 
    this.setState({
      sourceMobile : event
    },()=>{ 
      if(this.state.sourceMobile){
        this.setState({
          sourceMobileError : this.state.sourceMobile === "+" ? 'Please enter valid mobile number.' : ""
        })
      } 
    })
  }

  getData(){
    var type = 'SMS';
    axios.get('/api/projectsettings/get/'+type)
            .then((response) => {
                this.setState({ 
                  SMSDetails        : response.data,
                  smsid : response.data._id,
                  authID : response.data.authID,
                  authToken : response.data.authToken,
                  sourceMobile : response.data.sourceMobile,
                });
            })
            .catch((error) => {});
}
  submit(event){
      event.preventDefault();
        var formvalue ={
          authID    : this.state.authID, 
          authToken : this.state.authToken, 
          sourceMobile : this.state.sourceMobile, 
          type      : 'SMS',
          createdBy : localStorage.getItem("user_ID")
        }
        if($("#CompanySMSGatewayForm").valid()){
          axios.post('/api/projectsettings/post',formvalue)
          .then((response)=> {
            this.getData();
            swal({                
                  text: "SMS Gateway details added successfully!",
                });
            
            // this.setState({
            //   authID    : "", 
            //   authToken : "", 
            //   sourceMobile : "", 
            // })
            this.getData();
          })
          .catch((error)=> {
            swal({                
                  text: "Failed to add SMS Gateway details!",
                });
          })
        }
 
 
  }

  update(event){
    event.preventDefault();
      var formvalues ={
        authID    : this.state.authID, 
        authToken : this.state.authToken, 
        sourceMobile : this.state.sourceMobile, 
        type      : 'SMS',
        createdBy : localStorage.getItem("user_ID")
      }
      if($("#CompanySMSGatewayForm").valid()){
        axios.patch('/api/projectsettings/patch/SMS',formvalues)
        .then((response)=> {
          this.getData();
          swal({                
                text: "SMS Gateway details Updated successfully!",
              });
          // this.setState({
          //   smsid:"",
          //     authID    : "", 
          //     authToken : "", 
          //     sourceMobile : "", 
          // })
        })
        .catch((error)=> {
          swal({                
                text: "Failed to Updated SMS Gateway details!",
              });
        })
      }

}

  edit(event) {
    $("html,body").scrollTop(0);
    axios.get('/api/projectsettings/get/SMS')
      .then((response) => {
          this.setState({ 
            smsid : response.data._id,
            authID : response.data.authID,
            authToken : response.data.authToken,
            sourceMobile : response.data.sourceMobile,
          });
      })
      .catch((error) => {});
        
    }
  
  
  render() {
    return (
      <div className="">
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <h4 className="">SMS Gateway</h4>
          </div>
          <hr className="compySettingHr" />
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <form id="CompanySMSGatewayForm">
              <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box ">
                <label className="labelform">Auth ID <span className="requiredsign">*</span></label>
                <input type="text" style={{ textTransform: 'capitalize' }}
                  className="form-control UMname has-content"
                  id="authID" ref="authID" name="authID" placeholder="Auth ID" 
                  value={this.state.authID} onChange={this.handleChange} /> 
              </div>
              
              <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box ">
                <label className="labelform">Auth Token <span className="requiredsign">*</span></label>
                <input type="text" style={{ textTransform: 'capitalize' }}
                  className="form-control UMname has-content"
                  id="authToken" ref="authToken" name="authToken" placeholder="Auth Token" 
                  value={this.state.authToken} onChange={this.handleChange} /> 
              </div>
              
              <div className="form-margin col-lg-6 col-md-6 col-xs-12 col-sm-12  valid_box ">
                <label className="labelform">Source Mobile <span className="requiredsign">*</span></label>
               {/*} <input type="text" style={{ textTransform: 'capitalize' }}
                  className="form-control UMname has-content"
                  id="sourceMobile" ref="sourceMobile" name="sourceMobile" placeholder="Source Mobile" 
                  value={this.state.sourceMobile} onChange={this.handleChange} /> */}
                  <PhoneInput
                    country={'in'}
                    value={this.state.sourceMobile}
                    name="sourceMobile"
                    inputProps={{
                      name: 'sourceMobile',
                      required: true
                    }}
                    onChange={this.handleChangeMobile.bind(this)}
                  />
              </div>
              
              <div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                {
                    this.state.smsid === "" || this.state.smsid == undefined ?
                        <button className="col-lg-3 col-md-2 col-xs-12 col-sm-12 col-xs-12 pull-right btn button3 topMargin outlinebox" type="submit" onClick={this.submit.bind(this)} >Submit</button>
                    :
                        <button className="col-lg-3 col-md-2 col-xs-12 col-sm-12 col-xs-12 pull-right btn button3 topMargin outlinebox" type="update" onClick={this.update.bind(this)} >Update</button>
                }
                
              </div>
            </form>
           {/*} {this.state.SMSDetails && this.state.SMSDetails.message != "DATA_NOT_FOUND" ?
            <div className="table-responsive topmr40 col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <table className="table iAssureITtable-bordered table-striped table-hover">
                <thead className="tempTableHeader">
                  <tr className="">
                    <th className="umDynamicHeader srpadd textAlignCenter"> Auth ID </th>
                    <th className="umDynamicHeader srpadd textAlignCenter"> Auth Token </th>
                    <th className="umDynamicHeader srpadd textAlignCenter"> Source Mobile </th>
                    <th className="umDynamicHeader srpadd textAlignCenter"> Action </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{this.state.SMSDetails.authID}</td>
                    <td>{this.state.SMSDetails.authToken}</td>
                    <td>{this.state.SMSDetails.sourceMobile}</td>
                    <td className="textAlignCenter">
                      <span>
                          <button title="Edit"   onClick={this.edit.bind(this)}><i className="fa fa-pencil" ></i></button> &nbsp; &nbsp;
                      </span>
                      </td>
                  </tr>
                        
                </tbody>
              </table>
            </div>
            :
            null
          }
            */}
          </div>
        </div>
      </div>

    );
  }
}
export default CompanySMSGateway;







// import React, { Component } from 'react';
// import { render }           from 'react-dom';
// import $ from "jquery";
// import axios from 'axios';
// import swal from 'sweetalert';
// import PhoneInput               from 'react-phone-input-2';


// class CompanySMSGateway extends Component{
//    constructor(props) {
//     super(props);
//     this.state = {
//       authID : '',
//       authToken : '',
//       sourceMobile:''
//     };
//     this.handleChange = this.handleChange.bind(this);
//     this.handleChangeMobile = this.handleChangeMobile.bind(this);
//   }
//   handleChange(event){
//     const {name,value} = event.target;
//     this.setState({ 
//       [name]:value
//     });
//   }

//   componentWillReceiveProps(nextProps) {
//     axios.get('/api/globalmaster/get/sms_details')
//     .then((response)=>{
//       this.setState({
//         authID : response.data.authID,
//         authToken : response.data.authToken,
//         sourceMobile:response.data.sourceMobile,
//       })
//       $("#btnSubmit").html('Update');
//     })
//   }

//   handleChangeMobile(event){ 
//     this.setState({
//       sourceMobile : event
//     },()=>{ 
//       if(this.state.sourceMobile){
//         this.setState({
//           sourceMobileError : this.state.sourceMobile === "+" ? 'Please enter valid mobile number.' : ""
//         })
//       } 
//     })
//   }

//   submitSMSInfo(event){
//     event.preventDefault();
//     if (this.state.authID && this.state.authToken && this.state.sourceMobile) {
      
//       var formValues = {
//         authID : this.state.authID,
//         authToken : this.state.authToken,
//         sourceMobile : this.state.sourceMobile,
//         updatedBy : localStorage.getItem("user_ID")
//       }
//       axios.patch('/api/globalmaster/SMS',formValues)
//         .then((response) =>{
//               swal({
//                     title: "SMS Info is added successfully!",
//                     text: "SMS Info is added successfully!",
//               });
//             this.setState({
//               authID:'',
//               authToken:'',
//               sourceMobile:''
//             })
//         })
//         .catch((error)=> {
//           swal({
//                     title: "Failed to add SMS info!",
//                     text: "Failed to add SMS info!",
//               });
//         })
//     }else{
//       swal("All fields are required")
//     }
//   }

//   render(){
//     return(
//       <div className="">
//         <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
//             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
//                 <h4 className="">SMS Gateway</h4>
//             </div>
//                <hr className="compySettingHr" />
//           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
//             <form id="CompanySMSGatewayForm"  >
//               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
//                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp">
//                   <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
//                     <div className="form-group formht pdcls">
//                         <div className="form-group margin15">
//                             <label className="labelform" >Auth ID</label><span className="astrick">*</span>
//                             <input value={this.state.authID} onChange={this.handleChange} data-text="AuthID" type="text" id="authID" title="Please enter valid AuthID" name="authID" className="form-control CLcompanyAddress inputValid " required/>
//                         </div>
//                     </div> 
//                   </div>
//                   <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
//                     <div className="form-group formht pdcls">
//                         <div className="form-group margin15">
//                             <label className="labelform" >Auth Token</label><span className="astrick">*</span>
//                             <input value={this.state.authToken} onChange={this.handleChange} data-text="blockName" type="text" id="authToken" title="Please enter valid Auth Token" name="authToken" className="form-control CLcompanyAddress inputValid " required/>
//                         </div>
//                     </div> 
//                   </div>
//                   <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
//                     <div className="form-group formht pdcls">
//                         <div className="form-group margin15">
//                             <label className="labelform" >Source Number</label><span className="astrick">*</span>
//                             <PhoneInput
//                                 country={'in'}
//                                 value={this.state.sourceMobile}
//                                 name="sourceMobile"
//                                 inputProps={{
//                                   name: 'sourceMobile',
//                                   required: true
//                                 }}
//                                 onChange={this.handleChangeMobile.bind(this)}
//                               />
//                         </div>
//                     </div> 
//                   </div>
               
//                 </div>
                
//               </div>
//               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
//                   <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn button3 pull-right" id="btnSubmit" onClick={this.submitSMSInfo.bind(this)}>
//                     Submit
//                   </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       );
//   }

//  }

//  export default CompanySMSGateway;