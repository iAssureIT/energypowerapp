import React, { Component } from 'react';
import { render } from 'react-dom';
import $ from "jquery";
import axios from 'axios';
import swal from 'sweetalert';
class AmazonS3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key    : '',
      secret : '',
      bucket :'',
      region :'',
      s3id   : "",    
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
    var type = 'S3';
    axios.get('/api/projectsettings/get/'+type)
            .then((response) => {
              var s3id   = response.data._id;
              var key    = response.data.key;
              var secret = response.data.secret;
              var bucket = response.data.bucket;
              var region = response.data.region;
                this.setState({
                  s3id    : s3id,
                  s3key   : key,
                  s3secret: secret,
                  s3bucket: bucket,
                  s3region: region,
                });
            })
            .catch((error) => {});
}
  submit(event){
      event.preventDefault();
        var formvalue ={
          key    : this.state.key,
          secret : this.state.secret,
          bucket : this.state.bucket,
          region : this.state.region,
          type      : 'S3',
          createdBy : localStorage.getItem("user_ID")
        }
        console.log("formvalue===>",formvalue);
          axios.post('/api/projectsettings/post',formvalue)
          .then((response)=> {
            console.log("response===>",response.data);
            this.getData();
            swal({                
                  text: "S3 details added successfully!",
                });
              this.setState({
                key    : "",
                secret : "",
                bucket : "",
                region : "",
              })
            this.getData();
          })
          .catch((error)=> {
            swal({                
                  text: "Failed to add S3 details!",
                });
          })
        
  
      // }
  
  }
  update(event){
    event.preventDefault();
      var formvalues ={
        key    : this.state.key,
        secret : this.state.secret,
        bucket : this.state.bucket,
        region : this.state.region,
        type   : 'S3',
        createdBy : localStorage.getItem("user_ID")
      }
        axios.patch('/api/projectsettings/patch/S3',formvalues)
        .then((response)=> {
          this.getData();
          swal({                
                text: "S3 details Updated successfully!",
              });
              this.setState({
                key    : "",
                secret : "",
                bucket : "",
                region : "",
              })
        })
        .catch((error)=> {
          swal({                
                text: "Failed to Updated S3 details!",
              });
        })
      

    // }

}
  edit(event) {
        this.getData();
        var key    = this.state.s3key;
        var secret = this.state.s3secret;
        var bucket = this.state.s3bucket;
        var region = this.state.s3region;
        this.setState({
          key   : key,
          secret: secret,
          bucket: bucket,
          region: region,
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
            <h4 className="">Amazon S3</h4>
          </div>
          <hr className="compySettingHr" />
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
             <form id="AmazonS3Form"  >
               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp">
                   <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
                     <div className="form-group formht pdcls">
                        <div className="form-group margin15">
                             <label className="labelform" >Key</label><span className="astrick">*</span>
                             <input value={this.state.key} onChange={this.handleChange}  type="text" id="key" title="Please enter valid key" name="key" className="form-control CLcompanyAddress inputValid " required/>
                        </div>
                     </div> 
                   </div>
                   <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
                     <div className="form-group formht pdcls">
                         <div className="form-group margin15">
                             <label className="labelform" >Secret</label><span className="astrick">*</span>
                             <input value={this.state.secret} onChange={this.handleChange}  type="text" id="secret" title="Please enter valid secret" name="secret" className="form-control CLcompanyAddress inputValid " required/>
                         </div>
                     </div> 
                   </div>
                   <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
                     <div className="form-group formht pdcls">
                         <div className="form-group margin15">
                             <label className="labelform" >Bucket</label><span className="astrick">*</span>
                             <input value={this.state.bucket} onChange={this.handleChange}  type="text" id="bucket" title="Please enter valid bucket" name="bucket" className="form-control CLcompanyAddress inputValid " required/>
                         </div>
                     </div> 
                   </div>
                   <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
                     <div className="form-group formht pdcls">
                         <div className="form-group margin15">
                             <label className="labelform" >Region</label><span className="astrick">*</span>
                             <input value={this.state.region} onChange={this.handleChange}  type="text" id="region" title="Please enter valid region" name="region" className="form-control CLcompanyAddress inputValid " required/>
                         </div>
                     </div> 
                   </div>
                 </div>
               </div>
              <div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                {
                    this.state.s3id === undefined ?
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
                    <th className="umDynamicHeader srpadd textAlignCenter"> Key </th>
                    <th className="umDynamicHeader srpadd textAlignCenter"> Secret </th>
                    <th className="umDynamicHeader srpadd textAlignCenter"> Bucket </th>
                    <th className="umDynamicHeader srpadd textAlignCenter"> region </th>
                    <th className="umDynamicHeader srpadd textAlignCenter"> Action </th>
                  </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="textAlignCenter">{1}</td>
                    <td className="textAlignCenter">{this.state.s3key}</td>
                    <td className="textAlignCenter">{this.state.s3secret}</td>
                    <td className="textAlignCenter">{this.state.s3bucket}</td>
                    <td className="textAlignCenter">{this.state.s3region}</td>
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

export default AmazonS3;










// import React, { Component } from 'react';
// import { render }           from 'react-dom';
// import $ from "jquery";
// import axios from 'axios';
// import swal from 'sweetalert';


// class AmazonS3 extends Component{
//    constructor(props) {
//     super(props);
//     this.state = {
//       key    : '',
//       secret : '',
//       bucket :'',
//       region :'',
//     };
//     this.handleChange = this.handleChange.bind(this);
//   }

//   componentDidMount(){
//     this.getS3Details()
//     $("#AmazonS3Form").validate({
//       rules: {
//         key: {
//           required: true,
//         },
//         secret: {
//           required: true,
//         },
//         bucket: {
//           required: true,
//         },
//         region: {
//           required: true,
//         }
//       }
//     });
//   }
//   handleChange(event){
//     const {name,value} = event.target;
//     this.setState({ 
//       [name]:value
//     });
//   }
//   getS3Details(){
//     axios.get('/api/projectsettings/get/S3')
//       .then((response) =>{
//         console.log('response',response);
//           this.setState({
//             key      : response.data.key, 
//             secret   : response.data.secret, 
//             bucket   : response.data.bucket, 
//             region   : response.data.region, 
//           })
//       })
//       .catch((error)=> {
//         console.log('error',error);
//       })
//   }
//   edit(event) {
//     this.getS3Details();
//         this.setState({ 
//           key    : this.state.key,
//           secret : this.state.secret,
//           bucket : this.state.bucket,
//           region : this.state.region,
//         });
//     }
//   submitData(event){
//     event.preventDefault();
//      if($("#AmazonS3Form").valid()){
      
//       var formValues = {
//         key    : this.state.key,
//         secret : this.state.secret,
//         bucket : this.state.bucket,
//         region : this.state.region,
//         updatedBy : localStorage.getItem("user_ID")
//       }
//       axios.patch('/api/projectsettings/S3',formValues)
//         .then((response) =>{
//           console.log('response',response);
//           this.getS3Details()
//           swal({
//             title: " ",
//             text: response.data.message,
//           });
//         })
//         .catch((error)=> {
//           swal({
//             title: " ",
//             text: "Failed to add S3 info!",
//           });
//         })
//     }else{
//       swal(" ","All fields are required")
//     }
//   }

//   render(){
//     return(
//       <div className="">
//         <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
//             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
//                 <h4 className="">Amazon S3</h4>
//             </div>
//                <hr className="compySettingHr" />
//           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
//             <form id="AmazonS3Form"  >
//               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
//                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp">
//                   <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
//                     <div className="form-group formht pdcls">
//                         <div className="form-group margin15">
//                             <label className="labelform" >Key</label><span className="astrick">*</span>
//                             <input value={this.state.key} onChange={this.handleChange} data-text="key" type="text" id="key" title="Please enter valid key" name="key" className="form-control CLcompanyAddress inputValid " required/>
//                         </div>
//                     </div> 
//                   </div>
//                   <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
//                     <div className="form-group formht pdcls">
//                         <div className="form-group margin15">
//                             <label className="labelform" >Secret</label><span className="astrick">*</span>
//                             <input value={this.state.secret} onChange={this.handleChange} data-text="secret" type="text" id="secret" title="Please enter valid secret" name="secret" className="form-control CLcompanyAddress inputValid " required/>
//                         </div>
//                     </div> 
//                   </div>
//                   <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
//                     <div className="form-group formht pdcls">
//                         <div className="form-group margin15">
//                             <label className="labelform" >Bucket</label><span className="astrick">*</span>
//                             <input value={this.state.bucket} onChange={this.handleChange} data-text="blockName" type="text" id="bucket" title="Please enter valid bucket" name="bucket" className="form-control CLcompanyAddress inputValid " required/>
//                         </div>
//                     </div> 
//                   </div>
//                   <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopadding">
//                     <div className="form-group formht pdcls">
//                         <div className="form-group margin15">
//                             <label className="labelform" >Region</label><span className="astrick">*</span>
//                             <input value={this.state.region} onChange={this.handleChange} data-text="blockName" type="text" id="region" title="Please enter valid region" name="region" className="form-control CLcompanyAddress inputValid " required/>
//                         </div>
//                     </div> 
//                   </div>
//                 </div>
//               </div>
//               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
//                   <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn button3 pull-right" id="btnCheck" onClick={this.submitData.bind(this)}>
//                     Submit
//                   </button>
//               </div>
//             </form>
//             <div className="table-responsive topmr40 col-lg-12 col-md-12 col-sm-12 col-xs-12">
//               <table className="table iAssureITtable-bordered table-striped table-hover">
//                 <thead className="tempTableHeader">
//                   <tr className="">
//                     <th className="umDynamicHeader srpadd textAlignCenter"> Sr No. </th>
//                     <th className="umDynamicHeader srpadd textAlignCenter"> Key </th>
//                     <th className="umDynamicHeader srpadd textAlignCenter"> Secret </th>
//                     <th className="umDynamicHeader srpadd textAlignCenter"> Bucket </th>
//                     <th className="umDynamicHeader srpadd textAlignCenter"> Region </th>
//                     <th className="umDynamicHeader srpadd textAlignCenter"> Action </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                 <tr>
//                     <td className="textAlignCenter">{1}</td>
//                     <td className="textAlignCenter">{this.state.key}</td>
//                     <td className="textAlignCenter">{this.state.secret}</td>
//                     <td className="textAlignCenter">{this.state.bucket}</td>
//                     <td className="textAlignCenter">{this.state.region}</td>
//                     <td className="textAlignCenter">
//                     <span>
//                         <button title="Edit"   onClick={this.edit.bind(this)}><i className="fa fa-pencil" ></i></button> &nbsp; &nbsp;
//                         {/* <button title="Delete" onClick={this.deletegooglekeyapi.bind(this)}> <i className="fa fa-trash redFont" ></i></button>  */}
//                     </span>
//                     </td>
//                 </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       );
//   }

//  }

//  export default AmazonS3;
