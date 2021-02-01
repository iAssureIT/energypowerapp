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
        axios.patch('/api/globalmaster/taxSettings',companytaxinfo)
        .then(function (response) {
          if(response.status === 200)
          {
          swal({                
                  text: "Tax details added successfully!",
          });
          }   
        })
        .catch(function (error) {
          swal({
                  text: "Failed to add tax details!",
                });
        })
      }else{
        axios.patch('/api/globalmaster/updateTaxSettings',updatedtaxinfo)
        .then(function (response) {
         
          swal({
                  text: "Tax details updated successfully!",
          });
          
        })
        .catch(function (error) {
          swal({
                  text: "Failed to update tax details!",
                });
        })
      }
    }
    this.setState({
      taxType : '',
      taxRating:'',
      effectiveFrom:'',
      submitVal:true
    })
    axios.get('/api/globalmaster/getTaxData')
    .then((response)=>{
      this.setState({companyTaxData:response.data})
    })
    .catch((error)=>{
      console.log('error: ',error)
    })
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
delTax(event){
  event.preventDefault();
  var targetedID = event.currentTarget.id;
  swal("Are you sure you want to delete this data?", {
    dangerMode: true,
    buttons: true,
  }).then((res)=>{
      if(res === true){
      var formValues = {
          id : targetedID,
          updatedBy : localStorage.getItem("user_ID")
        }
        axios.patch('/api/globalmaster/patch/status',formValues)
        .then((response)=>{
          swal({
              title: 'Deleted successfully!',
              text: "",
              type: 'success',
              showCancelButton: false,
              confirmButtonColor: '#666',
              // cancelButtonColor:'#d33',
              confirmButtonText: 'ok'});
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
      }else{}
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
                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="labelform" >Tax Type</label><span className="astrick">*</span>
                        <input id="taxType" value={this.state.taxType} data-text="companytaxType" onChange={this.handleChange.bind(this)} type="text" name="taxType" ref="taxType" className="form-control areaStaes" />
                    </div>  
                  </div>
                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <label className="labelform" >Tax Rating</label><span className="astrick">*</span>
                        <input id="taxRating" value={this.state.taxRating} data-text="companytaxrate" onChange={this.handleChange.bind(this)} type="number" name="taxRating" ref="taxRating" className="form-control areaStaes" minLength="1" maxLength="4" />
                    </div>  
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 compForm">
                  <div className="form-group formht col-lg-6 col-md-6 col-sm-12 col-xs-12">
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

            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              { this.state.companyTaxData && this.state.companyTaxData.length > 0 ?
                this.state.companyTaxData.map( (taxData,index)=>{
                return (
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 boxTx" key={index}>
                      <div className="liheader1 col-lg-1 col-md-1 col-sm-1 col-xs-1">
                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                      </div>
                      <ul className="col-lg-10 col-md-10 col-sm-10 col-xs-10 palfclr addrbox">
                        <li>{taxData.taxType}</li>
                        <li>{taxData.taxRating} %</li>
                        {/*<li>{taxData.effectiveFrom} - {taxData.effectiveTo}</li>*/}
                        <li>{moment(taxData.effectiveFrom, 'YYYY-MM-DD').format('DD/MM/YYYY')} - {taxData.effectiveTo ? moment(taxData.effectiveTo, 'YYYY-MM-DD').format('DD/MM/YYYY') : null}</li>
                      </ul>
                      {taxData.status === 'Active' ?
                      <div className="liheader1 dropdown col-lg-1 col-md-1 col-sm-1 col-xs-1">
                        <i className="fa fa-ellipsis-h dropbtn" aria-hidden="true"></i>
                        <div className="dropdown-content">
                        
                          <ul className="pdcls ulbtm">
                            <li>  
                                <a href="#" onClick={this.editTax.bind(this)} id={taxData._id}><i className="fa fa-pencil penmrleft" aria-hidden="true"></i>&nbsp;&nbsp;Edit</a>
                              </li>
                              <li>
                                <a onClick={this.delTax.bind(this)} id={taxData._id}><i className="fa fa-trash-o" aria-hidden="true"></i>&nbsp;Delete</a>
                              </li>
                            </ul>
                        </div>
                      </div>
                      :
                      null
                      }
                    </div>
                  )
                })
                :
                null
              }
            </div>
            
          </div>
        </div>
      </div>

      );
  }

 }

 export default CompanyTaxDetails;