import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import $ from 'jquery';
import jQuery from 'jquery';
import swal from 'sweetalert';
// import ListOfProject from './ListOfProject.js';
import '../css/SupplierOnboardingForm.css';
import OneFieldForm         from '../../../../masterData/components/OneFieldForm/OneFieldForm.js';
import IAssureTable         from '../../../../IAssureTable/IAssureTable.jsx';


export default class AddDepartment extends Component{
 constructor(props) {
    super(props); 
    this.state = {
      'entityID'     : this.props.match.params ? this.props.match.params.entityID : '',
      
      "pathname"     : this.props.match.params.entity,
       departmentArray :[],
      fieldValue      :"",
      departmentName  :'--Select--',
      project         :"",
      editID          :'',
      "editId"              : props.match.params ? props.match.params.fieldID : '',
 
      "tableHeading": {
     
          department    : "Department Name",
          actions       : 'Action',
      },
      "tableObjects"  : 
      {
          deleteMethod   : 'delete',
          apiLink        : '/api/department/',
          paginationApply: false,
          searchApply    : false,
          editUrl        : '/addDepartment/'
      },
          "startRange"   : 0,
          "limitRange"   : 10,
          "fields"       : 
      {
            placeholder   : "Add New Department Here ..",
            title         : "Department Name",
            attributeName : "department"
      }
    }; 
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

openForm() {
    this.setState({
      openForm: this.state.openForm == false ? true : false
    }, () => {
      if (this.state.openForm == true) {
        this.validations();
      }
    })
  }
  componentWillReceiveProps(nextProps){
    if(nextProps){
      var editId = nextProps.match.params.fieldID;
      if(nextProps.match.params.fieldID){
        this.setState({
          editId : editId
        },()=>{
          this.edit(this.state.editId);
        })
      }
    }
  }
 
  modalClickEvent(){
    console.log("click event")
    $('#modalId').addClass('in');
    $('#modalId').css('display','block');
    
    // $('#modalId').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  componentDidMount(){

    this.getData();
    this.getDepartments();
     this.setState({
      entityID: this.props.match.params.entityID
    }, () => {
      this.edit();
    })
    this.setState({
                 "department"      : this.state.department,
                 "projectname"      : this.state.projectname,
            })
    var editId = this.props.match.params.fieldID;
      console.log('editId', editId);
      if(editId){     
        this.edit(editId);
      }

    window.scrollTo(0, 0);
    $.validator.addMethod("regxA1", function (value, element, arg) {
      return arg !== value;
    }, "Please select Department name");

    $.validator.addMethod("regxA5", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter Project name");

     jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    $("#projectValid").validate({
      rules: {
        departmentName: {
          required: true,
          regxA1  : "--Select--"
        },
        projectname: {
          required: true,
          regxA5: /^[A-Za-z][A-Za-z0-9\-\s]/,
        },
        errorPlacement: function (error, element) {
        if (element.attr("name") == "departmentName") {
          error.insertAfter("#departmentName");
        }
        if (element.attr("name") == "projectname") {
          error.insertAfter("#projectname");
        }
      }
    }
    });

     
  }


  handleSubmit(event){
    event.preventDefault()
     if(this.props.editId)
        {
        var formValues = {

                 
                "fieldValue"      : this.state.fieldValue,
                "fieldID"         : this.props.editId,
            
            
        }
        axios.patch('/api/department/patch', formValues)
                 .then((response) => {
                    this.setState({
                        fieldValue: "",
                        fieldID: ""
                    },()=>{
                        if(!this.state.editId)
                        {
                            this.props.history.push(this.props.tableObjects.editUrl);
                        }
                    })
                    this.getData();
                    swal(response.data.message);
                })
                .catch((error) => {
                    console.log("error",error)  
                })

       }else
       {
        axios.post('/api/department/post', formValues)
                .then((response)=>{
                  console.log("Dept Data--->",response);
                  swal("Good job!", "Information submitted!!!!", "success");
                })

                .catch((error)=>{
                    console.log('error', error)
                });
              }



  }

  update_data(event){
    event.preventDefault();
      var formValues= {
        "fieldValue"      : this.state.fieldValue,
        "fieldID"         : this.state.editID,
      };
          console.log("formValues",formValues);
      axios.patch('/api/department/patch',formValues)
        .then((response)=>{
          console.log("update_data",response);
       /* if(response.data){
          this.setState({
          },()=>{
            this.getData();
             /*window.location.reload()
            swal({
              title : response.data.message,
              text  : response.data.message
            });
          })
        }*/
      })
      .catch(function(error){
        console.log("error = ",error);
      });
    
  }
  
  supplier(event) {
    event.preventDefault();
       var entityID = this.props.match.params.entityID;
       console.log("dept entity id",entityID);
       if ($('#projectValid').valid()) {
          var formValues = {
            'entityID'          : entityID,
             'departmentDetails':       
                                {
                                   "departmentName"    : this.state.departmentName,           
                                   "projectname"       : this.state.projectname,     
                                }
                                
          
          }
          console.log("formValues",formValues);
           axios.patch('/api/entitymaster/patch/addDepartment', formValues)
            .then((response)=>{
              console.log("department id",response);
              swal(this.state.pathname+" created successfully.");
              this.props.history.push('/'+this.state.pathname+'/location-details/'+entityID)
            })
            .catch((error)=>{

            })
 
              
           
        }else{
      $(event.target).parent().parent().find('.inputText.error:first').focus();
      this.setState({
        companyPhoneError : 'This field is required.'
      })
    }
   } 

  

  getDepartments(){
      axios.post("/api/department/get/list")
            .then((response)=>{
            console.log("response====>",response);
              this.setState({
                  departmentArray : response.data
              })
              $('#DepartmentData').val(this.state.department);
            })
            .catch((error)=>{
                console.log('error', error);
            })
    }

getData(){
    axios.post('/api/department/get/list')

    .then((response)=>{
      console.log("tabledata===>",response);
      this.setState({
        tableData : response.data
      })
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }


camelCase(str){
     /* return str
      
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');*/
    }
  

    closeModal(){
      window.location.reload()
    }

  handleChange(event){
     const target = event.target;
     const name   = target.name;
     this.setState({
      [name]: event.target.value,
     });
  }

  edit(id){
    axios({
      method: 'get',
      url: '/api/department/get/one/'+id,
    }).then((response)=> {
      var editData = response.data;  
        console.log("editData",editData);  
      this.setState({
          fieldValue  : editData.department,
          editID :  id,
      },()=>{
        console.log("department",this.state.fieldValue)
      });
    }).catch(function (error) {
    });
  }

  render() {
   return (
      <div className="content-wrapper">
        <section className="content-header">
          <h1> Client Management </h1> 
          {/*<ol className="breadcrumb">
            <li>
              <a href="#"><i className="fa fa-user" /> Client</a></li>
            <li className="active">Add Project</li>
          </ol>*/}
        </section>
         <section className="content">
           <div className="row">
             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
               <div className="box box-primary">
                  <div className="box-header with-border">
                   {/*<h2 className="box-title">Add Project</h2>  */}
                  </div>
                  <div className="box-body">
                  <div className="nav-center OnboardingTabs col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <ul className="nav nav-pills vendorpills col-lg-8 col-lg-offset-2 col-md-12  col-sm-12 col-xs-12">
                    
                    <li className="col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn2 disabled">
                      <div className="triangletwo" id="triangle-right"></div>
                      <a href="/client/basic-details" className="basic-info-pillss backcolor">
                        <i className="fa fa-map-marker iconMarginLeft" aria-hidden="true"></i> &nbsp;
                        Basic Info
                      </a>
                      <div className="trianglethree  forActive" id="triangle-right4"></div>
                    </li>
                    <li className="active col-lg-3 col-md-3 col-sm-12 col-xs-12 pdcls pdclsOne btn1 NOpadding-left">
                     <div className="triangletwo" id="triangle-right1"></div>
                      <a href="/client/department" className="basic-info-pillss pills">
                        <i className="fa fa-info-circle" aria-hidden="true"></i> &nbsp;
                       Department
                      </a>
                      <div className="triangleone triangleones" id="triangle-right"></div>
                    </li>
                    <li className="col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn2 disabled">
                      <div className="triangletwo" id="triangle-right1"></div>
                      <a href="/client/location-details" className="basic-info-pillss backcolor">
                        <i className="fa fa-map-marker iconMarginLeft" aria-hidden="true"></i> &nbsp;
                        Location
                      </a>
                      <div className="trianglethree forActive" id="triangle-right"></div>
                    </li>
                    <li className="col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab noRightPadding pdcls btn4 disabled">
                      <div className="trianglesix" id="triangle-right2"></div>
                      <a href="/client/contact-details" className="basic-info-pillss backcolor">
                        <i className="fa fa-phone phoneIcon" aria-hidden="true"></i> &nbsp;
                        Contact
</a>
                    </li>
                  </ul>
                </div>
                  <div class="col-lg-12 col-md-12 col-sm-12"><br/></div>
                    <div className="col-lg-10 col-sm-12 col-xs-12 col-md-12 departmentform">
                      <form id="projectValid" >
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                          <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 shippingInput">
                           <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding new_statelabel">Department Name  <span className="astrick">*</span></label>
                             <select ref="departmentName" name="departmentName" id="departmentName"
                              value={this.state.departmentName}  onChange={this.handleChange.bind(this)}
                               className="form-control department_input col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox" >
                                <option disabled>--Select--</option>
                                {console.log("deptData==>",this.state.departmentArray)}
                                 {
                                  this.state.departmentArray && this.state.departmentArray.length > 0 ?
                                  this.state.departmentArray.map((departmentData, index)=>{
                                    return(      
                                        <option key={index} value={departmentData.department}>{departmentData.department}</option>
                                    );
                                  }
                                ) : ''
                              }
                          </select>
                          {/*</div>*/}

                         </div>
                         <div className="col-lg-2 col-md-2 col-sm-3 com-xs-3">
                          <div className="contactBar_input plussignpos" data-toggle="modal" data-target="#modalId" onClick={this.modalClickEvent.bind(this)}>
                            <div className="fixedContactBar">
                              <i class="fa fa-plus-circle addbutton" title="Click to add New Department"></i>
                            </div>
                          </div>
                         </div> 
                          <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 shippingInput">
                           <label className=" NOpadding new_statelabel">Project Name <span className="astrick">*</span></label>
                             <input ref="projectname" name="projectname" id="projectname" required
                              value={this.state.projectname}  onChange={this.handleChange.bind(this)}
                               className="form-control department_input col-lg-12 col-md-12 col-sm-12 col-xs-12 selectbox"/>
                               
                          {/*</div>*/}
                         </div>
                         
                        <div className="modal" id="modalId" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                         <div className="modal-dialog modal-lg " role="document">
                           <div className="modal-content ContactmodalContent col-lg-10 col-lg-offset-1 col-md-8 col-md-offset-2 col-sm-12 col-xs-12   ">
              {/*              <button type="button" className="close closeButton" data-dismiss="modal">&times;</button>*/}
                            <div className="modal-body contactModalBody row ">
                             <div className="row">
                              <div className="cuformWall">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 contactHeader lightbluebg text-center">
                                   
                                    <button type="button" className="close closeBtn" data-dismiss="modal" onClick={this.closeModal.bind(this)}>&times;</button>
                                </div>
                                 <div>
                               <OneFieldForm
                                fields        ={this.state.fields}
                                tableHeading  ={this.state.tableHeading}
                                tableObjects  ={this.state.tableObjects}
                                editId        ={this.state.editId}
                                history       ={this.props.history} />
                              </div>
                              
                             </div>                
                              </div>   
                            </div>        
                          </div>
                        </div>
                      </div>        
                      </div>
                       <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 mt">
                              <button className="btn button3 pull-right" onClick={this.supplier.bind(this)} >Save & Next&nbsp;
                                <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                              </button>
                            </div>
                        </div>
                      </form>
                    </div>
                    {/*<ListOfProject customerList={this.props.customers} />*/}
                  </div>
                </div>
              </div>
            </div>
         </section>
      </div> 
    );
  } 


}
