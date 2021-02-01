import React, { Component } from 'react';
import { render }           from 'react-dom';
import $ from "jquery";
import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert';

const formValid = formerrors=>{
  let valid = true;
  Object.values(formerrors).forEach(val=>{
  val.length>0 && (valid = false);
  })
  return valid;
  }

const taxTypeRegex  = RegExp(/^[A-za-z']+( [A-Za-z']+)*$/);
const taxrateRegex = RegExp(/^[1-9]\d*(\.\d+)?$/);


class CompanyTaxDetails extends Component{
   constructor(props) {
    super(props);
    this.state = {
      taxRating   : '',
      taxType     : '',
      effectiveFrom   : '',
      submitVal      : true,
      deleteID:"",
      formerrors :{
        companytaxType   : "" ,
        companytaxrate   : "",
      },
      companyTaxData : []

    };
    this.handleChange = this.handleChange.bind(this);
  }

  
  componentDidMount() {
    $.validator.addMethod("regxtax", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid tax rate.");

    $("#CompanyTaxDetailsForm").validate({
    rules: {
      taxType: {
        required: true,
      },
      taxRating: {
        required: true,
        regxtax: /^[1-9]\d*(\.\d+)?$/
      },
      effectiveFrom: {
        required: true,
      }
    }
    });
    this.getData();
    
  }

  componentWillReceiveProps(nextProps){
    this.getData()
  }

  getData(){
    axios.get('/api/globalmaster/getTaxData')
    .then((response)=>{
      this.setState({companyTaxData:response.data})
    })
    .catch((error)=>{
      console.log('error: ',error)
    })
  }

  submitCompanyInformation(event){
    event.preventDefault();
   
    var companytaxinfo = {
      taxRating             : this.state.taxRating,
      taxType               : this.state.taxType,
      effectiveFrom         : this.state.effectiveFrom,
    }//close array

    var updatedtaxinfo = {
      taxId                 : this.state.taxId,
      taxRating             : this.state.taxRating,
      taxType               : this.state.taxType,
      effectiveFrom         : this.state.effectiveFrom,
    }//close array

    if($("#CompanyTaxDetailsForm").valid()){
      if (this.state.submitVal) {
        axios.post('/api/globalmaster/taxSettings',companytaxinfo)
        .then((response)=> {
          if(response.status === 200)
          {
          swal({                
                  text: "Tax details added successfully!",
          });
          } 
           this.getData() 
        })
        .catch((error)=> {
          swal({
                  text: "Failed to add tax details!",
                });
        })
      }else{
        axios.patch('/api/globalmaster/updateTaxSettings',updatedtaxinfo)
        .then((response)=> {
         
          swal({
                  text: "Tax details updated successfully!",
          });
         this.getData()
        })
        .catch((error)=> {
          swal({
                  text: "Failed to update tax details!",
                });
        })
      }
      this.setState({
            taxType : '',
            taxRating:'',
            effectiveFrom:'',
            submitVal:true
          },()=>{ this.getData();})
    }
    
   
}

handleChange(event){
  const {name,value} = event.target;
  this.setState({ 
    [name]:value
  });
}

editTax(event){
  event.preventDefault();
  this.setState({submitVal : false})
  $("html,body").scrollTop(0);
  var id = event.currentTarget.id;
  axios.get('/api/globalmaster/getSingleTaxData/'+id)
  .then((response)=>{
    this.setState({
      taxId         : response.data[0]._id,
      taxType       : response.data[0].taxType,
      taxRating     : response.data[0].taxRating,
      effectiveFrom : moment(response.data[0].effectiveFrom).format('YYYY-MM-DD'),
      effectiveTo   : response.data[0].effectiveTo,
    })
  })
  .catch((error)=>{
    swal(error)
  })
    
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

delTax(event){
  event.preventDefault();
  var targetedID = event.currentTarget.id;
  
      var formValues = {
          id : this.state.deleteID,
          updatedBy : localStorage.getItem("user_ID")
        }
        axios.patch('/api/globalmaster/patch/status',formValues)
        .then((response)=>{
          swal('Deleted successfully!');
          this.setState({deleteID:""})
           $('#deleteModal').hide();
            axios.get('/api/globalmaster/getTaxData')
            .then((response)=>{
              this.setState({companyTaxData:response.data})
            })
            .catch((error)=>{
              console.log('error: ',error)
            })
        })
        .catch((error)=>{
          swal(error)
       
        })
}

  render(){
    
    return(
      <div className="">
        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 companyDisplayForm">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <h4 className="">Tax Information</h4>
          </div>
             <hr className="compySettingHr" />
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <form id="CompanyTaxDetailsForm"  >
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm compinfotp">
                  <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="labelform" >Tax Type</label><span className="astrick">*</span>
                        <input id="taxType" value={this.state.taxType} data-text="companytaxType" onChange={this.handleChange.bind(this)} type="text" name="taxType" ref="taxType" className="form-control areaStaes" />
                    </div>  
                  </div>
                  <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="labelform" >Tax Rating</label><span className="astrick">*</span>
                        <input id="taxRating" value={this.state.taxRating} data-text="companytaxrate" onChange={this.handleChange.bind(this)} type="number" name="taxRating" ref="taxRating" className="form-control areaStaes" minLength="1" maxLength="4" />
                    </div>  
                  </div>
                  <div className="form-group formht col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="labelform" >Effective From</label><span className="astrick">*</span>
                        <input className="form-control areaStaes" data-text="effectiveFrom" id="effectiveFrom" onChange={this.handleChange.bind(this)} type="date" name="effectiveFrom" ref="effectiveFrom" value={this.state.effectiveFrom} required />
                    </div> 
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
                <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn button3 pull-right" id="btnCheck" onClick={this.submitCompanyInformation.bind(this)} >
                  { this.state.submitVal ? "Submit" : "Update" }  
                </button>
              </div>
            </form>

            <div className="table-responsive topmr40 col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <table className="table iAssureITtable-bordered table-striped table-hover">
              <thead className="tempTableHeader">
                <tr className="">
                  <th className="umDynamicHeader srpadd textAlignCenter"> Tax Type </th>
                  <th className="umDynamicHeader srpadd textAlignCenter"> Rating </th>
                  <th className="umDynamicHeader srpadd textAlignCenter"> Effective From </th>
                  <th className="umDynamicHeader srpadd textAlignCenter"> Effective To </th>
                  <th className="umDynamicHeader srpadd textAlignCenter"> Action </th>
                </tr>
              </thead>
              <tbody>
              { this.state.companyTaxData && this.state.companyTaxData.length > 0 ?
              this.state.companyTaxData.map((taxData,index)=>{
                return(
                  <tr key={index}>
                      <td className="textAlignCenter">{taxData.taxType}</td>
                      <td className="textAlignCenter">{taxData.taxRating}</td>
                      <td className="textAlignCenter">{moment(taxData.effectiveFrom, 'YYYY-MM-DD').format('DD/MM/YYYY')}</td>
                      <td className="textAlignCenter">{taxData.effectiveTo ? moment(taxData.effectiveTo, 'YYYY-MM-DD').format('DD/MM/YYYY') : null}</td>
                      <td className="textAlignCenter">
                      <span>
                          <button title="Edit" onClick={this.editTax.bind(this)} id={taxData._id}><i className="fa fa-pencil" ></i></button> &nbsp; &nbsp;
                          <button title="Delete" data-id={taxData._id}  onClick={this.delete.bind(this)}> <i className="fa fa-trash redFont" ></i></button> 
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
                                          <button type="button" className="btn examDelete-btn col-lg-7 col-lg-offset-5 col-md-7 col-md-offset-5 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal" onClick={this.delTax.bind(this)} >DELETE</button>
                                      </div>
                                  </div>
                                </div>
                            </div>
                        </div>  
                      </span>
                      </td>
                  </tr>
                )
                })
                :
                <tr><td colSpan="5" className="textAlignCenter">No Data Found</td></tr>
                }
              </tbody>
            </table>
          </div>

           
            
          </div>
        </div>
      </div>

      );
  }

 }

 export default CompanyTaxDetails;