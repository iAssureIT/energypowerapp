import React, { Component } from 'react';
import $ from 'jquery';
import jQuery from 'jquery';
import axios from 'axios';
import swal from 'sweetalert';
import 'bootstrap/js/tab.js';
import S3FileUpload from 'react-s3';
import { withRouter } from 'react-router-dom';
import OneFieldForm             from '../../../../../coreadmin/Master/OneFieldForm/OneFieldForm.js';
import IAssureTable         from '../../../../../coreadmin/IAssureTable/IAssureTable.jsx';
import Department from  '../../../../../coreadmin/Master/Department/DepartmentMaster-GlobalMaster.js';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";


class DepartmentDetails extends Component{
 constructor(props) {
    super(props); 
    this.state = {
      'pathname'        : this.props.entity,
      'entityID'        : this.props.match.params ? this.props.match.params.entityID : '',
      'locationID'      : this.props.match.params ? this.props.match.params.locationID : '',
       departmentArray  : [],
      fieldValue        : "",
      departmentName    : '--Select--',
      project           : "",
      "editId"          : this.props.match.params ? this.props.match.params.departmentID : '',
      "tableHeading"    : {
                              department    : "Department Name",
                              actions       : 'Action',
                          },
      "fields"          : {
                            placeholder     : "Enter department type..",
                            title           : "Department",
                            attributeName   : "department"
                        },
      departmentDetails : [],
      "tableObjects"    : {
                            deleteMethod: 'delete',
                            apiLink: '/api/departmentmaster/',
                            paginationApply: false,
                            searchApply: false,
                            editUrl: '/'+this.props.url+'/department-details-modal/'+this.props.match.params.entityID,
                            listUrl: '/'+this.props.url+'/department-details/'+this.props.match.params.entityID
                          },
      "startRange"      : 0,
      "limitRange"      : 10,
      "fields"          : {
                                placeholder   : "Add New Department Here ..",
                                title         : "Department Name",
                                attributeName : "department"
                          },

      "tableHeading2"    : {
                              departmentName        : "Department",
                              projectName           : "Project",
                              actions               : 'Action'
                            },
      tableObjects2       : {
                              deleteMethod   : 'delete',
                              apiLink        : '/api/entitymaster/department',
                              paginationApply: false,
                              searchApply    : false,
                              editUrl        : '/'+this.props.url+'/department-details/'+this.props.match.params.entityID,
                              listUrl        : '/'+this.props.url+'/department-details/'+this.props.match.params.entityID
                            },
    }; 
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps){
      var editId = nextProps.match.params.departmentID;
      this.getData();
      this.setState({
        editId : editId
      },()=>{
        this.edit();
      })
    }
  }


  modalClickEvent(){
    $('#departementModalId').addClass('in');
    $('#departementModalId').css('display','block');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  componentDidMount(){
    this.getDepartments();
     this.setState({
      entityID: this.props.match.params.entityID,
    }, () => {
      this.getData();
    })
    this.setState({
                 "department"      : this.state.department,
                 "projectName"      : this.state.projectName,
            })
    var editId = this.props.match.params.departmentID;
      if(editId){     
        this.edit();
      }

    window.scrollTo(0, 0);
    $.validator.addMethod("regxA1", function (value, element, arg) {
      return arg !== value;
    }, "Please select Department name");

    $.validator.addMethod("regxA5", function (value, element, arg) {
      return arg !== value;
    }, "Please enter Project name");

     jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    $("#projectValid").validate({
      rules: {
        departmentName: {
          // required: true,
        },
        projectName: {
          required: true,
          regxA5: /^[A-Za-z][A-Za-z0-9\-\s]/,
        },
     },
     errorPlacement: function (error, element) {
        if (element.attr("name") === "departmentName") {
          error.insertAfter("#departmentName");
        }
        if (element.attr("name") === "projectName") {
          error.insertAfter("#projectName");
        }
      }
    });
  }

  next(event) {
    event.preventDefault();
     var entityID = this.props.match.params.entityID;
     this.props.history.push('/'+this.state.pathname+'/location-details/'+entityID)
  } 

  getDepartments(){
    axios.get("/api/departmentmaster/get/list")
    .then((response)=>{
      this.setState({
          departmentArray : response.data,
      })
      $('#DepartmentData').val(this.state.department);
    })
    .catch((error)=>{})
  }


  handleChange(event){
     const target = event.target;
     const name   = target.name;
     this.setState({
      [name]: event.target.value,
     });
  }

  edit(){
    var entityID = this.state.entityID;
    if (entityID !== '') {
      axios.get('/api/entitymaster/get/one/' + entityID)
      .then((response)=>{
        var editData = response.data[0].departments.find(a=> a._id === this.state.editId)
        this.setState({
          departmentName : editData.departmentName,
          projectName : editData.projectName,
        })
      })
      .catch(function(error){});
    }
  }

   getData(){
    var entityID = this.state.entityID ? this.state.entityID : this.props.entityID;
    if (entityID && entityID !== '') {
      axios.get('/api/entitymaster/get/one/' + entityID)
      .then((response)=>{
        var tabledata = response.data[0].departments.map((a,i)=>{
          return{
            _id                    : a._id,
            departmentName         : a.departmentName,
            projectName            : a.projectName,
          }
        })
        this.setState({
          tableData2 : tabledata,
        })
      })
      .catch(function(error){
      });
    }
  }

  departmentdetailBack(event) {
    event.preventDefault();
    var entityID = this.props.match.params.entityID;

    if (this.state.departmentName === "" || this.state.projectName === "") {
      swal({
        // title: 'abc',
        text: "It seems that you are trying to enter a department. Click 'Cancel' to continue entering location. Click 'Ok' to go to back page. But you may lose values if already entered in the location form",
        buttons: {
          cancel: {
            text: "Cancel",
            value: false,
            visible: true,
            className: "CancelButtonSwal"
          },
          confirm: {
            text: "OK",
            value: true,
            visible: true,
            className: "OkButtonSwal",
            closeModal: true
          }
        },
      })
        .then((value) => {
          if (value) {
            if (entityID) {
              this.props.history.push("/" +this.state.pathname + "/basic-details/" + entityID);
            } else {
              this.props.history.push("/" + this.state.pathname + "/basic-details");
            }
          } else {
            this.props.history.push("/" +this.state.pathname + "/location-details/" + entityID);
          }
        })
      $(".OkButtonSwal").parents('.swal-button-container').addClass('postionSwalRight');
      $(".CancelButtonSwal").parents('.swal-button-container').addClass('postionSwalLeft');

    } else {
      if (entityID && entityID != undefined) {
        this.props.history.push("/" +this.state.pathname+ "/basic-details/" + entityID);
      } else {
        this.props.history.push("/" +this.state.pathname+ "/basic-details");
      }
    }
  }



  addDepartment(event){
    event.preventDefault();
     var entityID = this.props.match.params.entityID ? this.props.match.params.entityID : this.props.entityID;
    if ($('#projectValid').valid()){
      var formValues = {
        'entityID'          : entityID,
        'departmentDetails' : {
                                "departmentName"    : this.state.departmentName,           
                                "projectName"       : this.state.projectName,     
                              },      
      }
      axios.patch('/api/entitymaster/patch/addDepartment', formValues)
      .then((response)=>{
        if(response.data.created){
          this.getData();
          this.setState({
            departmentName  : '--Select--',
            projectName:''
          });
          swal('Department details added successfully.');
        }else if(response.data.duplicate){
          swal('Department details already exist')
        }
      })
      .catch((error)=>{})
    }                         
  }

  updateDepartment(event){
    event.preventDefault();
     var entityID = this.props.match.params.entityID;
    if ($('#projectValid').valid()) {
      var formValues = {
        'department_id'     : this.state.editId,
        "departmentName"    : this.state.departmentName,           
        "projectName"       : this.state.projectName,     
      }
      axios.patch('/api/entitymaster/patch/updateDocument', formValues)
      .then((response)=>{
        if(response.data.updated === true){
          this.getData();
          this.setState({
            departmentName  : '--Select--',
            projectName:'',
            editId:'',
          });
          swal('Department details updated successfully.');
          this.props.history.push('/'+this.state.pathname+'/department-details/'+entityID)
        }else{
          swal('Department details already exist')
        }
      })
      .catch((error)=>{})
    }else{
      $(event.target).parent().parent().find('.inputText.error:first').focus();
      this.setState({
        companyPhoneError : 'This field is required.'
      })
    }                           
  }

  deleteDepartment(event){
    event.preventDefault();
    var entityID = this.state.entityID;
    var departmentID = this.state.departmentID;
    axios.delete('/api/entitymaster/deleteDepartment/' + entityID + "/" + departmentID)
      .then((response) => {
        this.setState({
          departmentName:'',
          projectName:''
        });
        this.getData();
        $('#deleteEntityModal').hide(); 
        $(".swal-text").css("font-family", "sans-serif");
        swal('Department deleted successfully.');
      })
      .catch((error) => {
      })
  }  

  render() {
     const searchOptions = {
      componentRestrictions: {country: "in"}
     }
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
            <section className="content OrgSettingFormWrapper">
              
              <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                   {this.state.pathname !="appCompany" ?
                      <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">{this.state.pathname ? this.state.pathname : "Entity"} Master</h4>
                      :
                      <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Organizational Settings</h4>
      
                    }
                  <div title="Go to Admin" className="col-lg-1 col-md-1 col-xs-1 col-sm-1 NOpadding-right">
                    {this.props.vendorData ? <div onClick={this.admin.bind(this)} className="redirectToAdmin col-lg-5 col-lg-offset-7 col-md-10 col-xs-10 col-sm-10 fa fa-arrow-right"></div> : null}
                  </div>
                </div>
                {!this.props.modal ?
                  <div className="nav-center OnboardingTabs col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <ul className="nav nav-pills vendorpills col-lg-10 col-lg-offset-1 col-md-8 col-md-offset-3 col-sm-12 col-xs-12">
                     <li className=" col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne  NOpadding-left btn1 disabled">
                        <a href={this.props.match.params.entityID ? "/"+this.props.entity+"/basic-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/basic-details"} className="basic-info-pillss pills backcolor">
                          <i className="fa fa-info-circle" aria-hidden="true"></i> &nbsp;
                          Basic Info
                        </a>
                        <div className="triangleone " id="triangle-right"></div>
                      </li>
                      <li className="active col-lg-3 col-md-3 col-sm-12 col-xs-12 pdcls pdclsOne btn1 ">
                       <div className="triangletwo" id="triangle-right1"></div>
                        <a href={this.props.match.params.entityID ? "/"+this.props.entity+"/department-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/department-details"} className="basic-info-pillss pills">
                          <i className="fa fa-info-circle" aria-hidden="true"></i> &nbsp;
                         Departments
                        </a>
                        <div className="triangleone triangleones" id="triangle-right"></div>
                      </li>
                      <li className="col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab pdcls pdclsOne btn2 disabled">
                        <div className="triangletwo" id="triangle-right1"></div>
                        <a href={this.props.match.params.entityID ? "/"+this.props.entity+"/location-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/location-details" } className="basic-info-pillss backcolor">
                          <i className="fa fa-map-marker iconMarginLeft" aria-hidden="true"></i> &nbsp;
                          Locations
                        </a>
                        <div className="trianglethree forActive" id="triangle-right"></div>
                      </li>
                      <li className="col-lg-3 col-md-3 col-sm-12 col-xs-12 transactionTab noRightPadding pdcls btn4 disabled">
                        <div className="trianglesix" id="triangle-right2"></div>
                        <a href={this.props.match.params.entityID ? "/"+this.props.entity+"/contact-details/"+this.props.match.params.entityID : "/"+this.props.entity+"/contact-details"} className="basic-info-pillss backcolor">
                          <i className="fa fa-phone phoneIcon" aria-hidden="true"></i> &nbsp;
                          Contacts
                        </a>
                      </li>
                    </ul>
                  </div>
                  :
                  null
                }  
                <section className="Content">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                     <form id="projectValid" >
                        <div className="col-lg-8 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 ">
                            <div className="form-margin form-group col-lg-5 col-md-5 col-sm-12 col-xs-12 pdcls" >
                               <div id="departmentName">
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Department Name<i className="astrick">*</i></label>
                                <div className={!this.props.modal&& "input-group"} >
                                    <select className="addonDiv col-lg-12 col-md-12 col-sm-12 col-xs-12" ref="departmentName" name="departmentName" id="dept" value={this.state.departmentName}  onChange={this.handleChange.bind(this)} required>
                                        <option selected={true} disabled={true}>--Select--</option>
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
                                    {!this.props.modal&& <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"   data-target="#departementModalId"  onClick={this.modalClickEvent.bind(this)} title="Add Department" ><i className="fa fa-plus "></i>
                                    </div>}
                                </div>
                              </div>  
                            </div>
                            <div className="form-margin form-group col-lg-4 col-md-4 col-sm-12 col-xs-12">
                              <label className=" NOpadding labelform">Project Name <span className="astrick">*</span></label>
                              <input type="text" ref="projectName" name="projectName" id="projectName" required
                                value={this.state.projectName}  onChange={this.handleChange.bind(this)}
                                className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12"
                              />
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 mt20" style={{"marginTop":"33px"}}>
                            {!this.state.editId || this.props.modal? 
                              <div className="button4 col-lg-8" onClick={this.addDepartment.bind(this)}>
                                <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                 &nbsp;Add                                
                              </div>
                              :
                              <div className="button4 col-lg-8" onClick={this.updateDepartment.bind(this)}>
                                <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                 &nbsp;Update                                
                              </div>
                            } 
                            </div>

                          </div>
                         
                      <div className="col-lg-8 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12">
                      <IAssureTable
                          tableHeading={this.state.tableHeading2}
                          dataCount={this.state.dataCount}
                          tableData={this.state.tableData2}
                          getData={this.getData.bind(this)}
                          tableObjects={this.state.tableObjects2}
                        />
                      </div>
                      {!this.props.modal&&<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
                        <button className="button2" onClick={this.departmentdetailBack.bind(this)}><i className="fa fa-angle-double-left" aria-hidden="true"></i>&nbsp;Basic Info</button>
                        <button className="button1 pull-right" onClick={this.next.bind(this)}>Next&nbsp;<i className="fa fa-angle-double-right" aria-hidden="true"></i></button>
                      </div>}
                      </form>
                    </div>
                  </div>
                </section>
              </div>
            </section>
          </div>
        </div>
        {!this.props.modal&& <div className="modal" id="departementModalId" role="dialog">
          <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
              <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                    <button type="button" className="adminCloseButton" data-dismiss="modal" onClick={this.getDepartments.bind(this)}>&times;</button>
               </div>
              </div>
              <div className="modal-body adminModal-body OneFieldModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
             <Department  
                          editId  =   {this.props.match.params.fieldID} 
                          editUrl =   {
                                  this.props.match.params.entityID && this.props.match.params.contactID ?
                                  '/'+this.props.url+'/department-details-modal/'+this.props.match.params.entityID+"/"+this.props.match.params.departmentID 
                                  :this.props.match.params.entityID ?
                                  '/'+this.props.url+'/department-details-modal/'+this.props.match.params.entityID
                                  :!this.props.modal ?
                                  '/'+this.props.url+'/department-details-modal'
                                  :
                                  '/'+this.props.url
                                } 
                        />
              </div>
           </div>
          </div>
        </div> }
      </div>
    );
  }
}
export default withRouter(DepartmentDetails);
