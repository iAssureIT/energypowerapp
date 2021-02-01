import React, { Component }     from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import _                        from 'underscore';
import IAssureTable             from '../../IAssureTable/IAssureTable.jsx';
import { withRouter }           from 'react-router-dom';
// import DocumentEntityMaster     from '../../../projectadmin/DocumentRequiredfor/DocumentEntityMaster.js';
import OneFieldForm             from '../OneFieldForm/OneFieldForm.js';
import BulkUpload               from "../BulkUpload/BulkUpload.js";

import 'bootstrap/js/tab.js';
import './TwoFieldForm.css'
var apiLink = "";
var apiLink2 = "";
class TwoFieldForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "user_ID"              : "",
            "secondField"          : "",
            "secondFieldData"      : [], 
            "selectedIndex"        : "",
            "startRange"           : 0,
            "limitRange"           : 10000,
             "editId"              :  ''
        };
    }
 /*   componentDidMount() {
        apiLink =  this.props.tableObjects.apiLink;
        apiLink2 =  this.props.tableObjects.apiLink2;
        const user_ID = localStorage.getItem("user_ID")
        this.setState({
            user_ID : user_ID,
        })
        this.getData(this.state.startRange, this.state.limitRange);
        this.getSecondFieldData(this.state.startRange, this.state.limitRange);
        
        $.validator.addMethod("regxonefield", function (value, element, regexpr) {
          return regexpr.test(value);
        }, "Please enter valid field value");
        
        jQuery.validator.setDefaults({
          debug: true,
          success: "valid"
        });
        $("#twoFieldFormValid").validate({
        rules: {
            selectField: {
              required: true,
            },
            textFieldOne: {
              regxonefield  :/^[-a-zA-Z0-9-()]+(\s+[-a-zA-Z0-9-()]+)*$/,
              required: true,
            },
        },
        errorPlacement: function (error, element) {
            console.log("element",element);
            if (element.attr("data_name") === "selectField") {
              error.insertAfter("#selectField");
            }
            if (element.attr("name") === "attributeName") {
              error.insertAfter("#textFieldOne");
            }
          }
        });
    }
   
    componentWillReceiveProps(nextProps) {
        if(nextProps.editId)
        {
            this.edit(nextProps.editId);
            console.log("nextProps",nextProps)

        }
        else{
            this.setState({
                attributeName                              : "",
                [this.props.fields.secondAttributeName]    : "-- Select --"
            })
            console.log("nextProps",nextProps)


        }
      
    }
    handleChange(event) {
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        this.setState({
            attributeName : event.target.value
        });

    }
    handleSelect(event){
        event.preventDefault();
        const target = event.target;
        var index = event.target.selectedIndex
        const id = event.target.options[index].id;

        const name = target.name;
        this.setState({
            [name] : event.target.value,
            "selectedIndex" : id,
        });
    }
    submitType(event) {
        event.preventDefault();
        var formValues ={ 
            "dropdownID"       : this.state.selectedIndex,
            "fieldValue"       : this.state.attributeName,
            "createdBy"        : this.state.user_ID
        }
     if ($('#twoFieldFormValid').valid()) {

        axios.post(apiLink+'post', formValues)
            .then((response) => {
                if (response.data.created) {
                    swal(this.state.attributeName+" submitted Successfully");
                    this.getData(this.state.startRange, this.state.limitRange);
                    this.setState({
                       attributeName    : "",
                       [this.props.fields.secondAttributeName]            : "-- Select --"
                     })

                }else{
                    swal(this.state.attributeName+" already exist");
                }
            })
            .catch((error) => {
                
            })
     }
      
    }
    updateType(event) {
        event.preventDefault();
        var formValues ={
                "fieldID"       : this.state.fieldId,
                "dropdownID"    : this.state.selectedIndex,
                "fieldValue"    : this.state.attributeName,
            }
        if ($('#twoFieldFormValid').valid()) {
            axios.patch(apiLink+'/patch', formValues)
                .then((response) => {
                    this.setState({
                        attributeName: "",
                        editId: "",
                        [this.props.fields.secondAttributeName]            : "-- Select --"
                    },()=>{
                    console.log("Here")
                        if(!this.state.editId)
                        {
                            this.props.history.push(this.props.tableObjects.editUrl);
                            this.setState({
                                attributeName                              : "",
                                [this.props.fields.secondAttributeName]    : "-- Select --"
                             })
                        }
                        swal("Record updated Successfully");

                    })

                    this.getData(this.state.startRange, this.state.limitRange);
                    swal(response.data.message);
                })
                .catch((error) => {
                })
        }       
    }
    getDataCount() {
        axios.get('/api/vendorLocationType/get/count')
            .then((response) => {
               
                this.setState({
                    dataCount: response.data.dataCount
                })
            })
            .catch((error) => {
                
            });
    }
    getData(startRange, limitRange) {
        var data = {
            startRange: startRange,
            limitRange: limitRange
        }
        axios.post(apiLink+'get/list', data)
            .then((response) => {
                this.setState({
                    tableData: response.data
                })
                console.log("tableData---",this.state.tableData);

            })
            .catch((error) => {
                
            });
    }
    getSecondFieldData(startRange, limitRange) {
        var data = {
            startRange: startRange,
            limitRange: limitRange
        }
        axios.post(apiLink2+'/get/list', data)
            .then((response) => {
                this.setState({
                    secondFieldData: response.data,
                    secondFieldId: response.data._id
                })

            })
            .catch((error) => {
                
            });
    }
    edit(id) {
        var fieldName = this.props.fields.attributeName;
        var secondAttributeId = this.props.fields.secondAttributeId;
        var secondAttributeName = this.props.fields.secondAttributeName;

        axios.get(apiLink+'/get/one/' + id)
            .then((response) => {

                if (response.data) {
                    axios.get(apiLink2+'/get/one/' + response.data[secondAttributeId])
                        .then((response) => {
                           if (response.data) {
                                this.setState({
                                    [this.props.fields.secondAttributeName] : response.data[this.props.fields.secondAttributeName],
                                    "selectedIndex"     : response.data._id
                                });
                            }
                        })
                    .catch((error) => {
                    });
                    this.setState({
                        "attributeName"     : response.data[fieldName],
                        "fieldId"           : response.data._id
                    });
                }
            })
        .catch((error) => {
        });

    }
    OpenModal(event){

    }*/

    render() {
        return (
            <div className="modal" id="addOneField" role="dialog">
              <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                  <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                        <button type="button" className="adminCloseButton" data-dismiss="modal" >&times;</button>
                   </div>
                  </div>
                <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                {/*console.log('this.props.',this.props)            
                    <OneFieldForm fields={this.props.oneFields}
                      tableHeading={this.props.oneTableHeading}
                      tableObjects={this.props.oneTableObjects}
                      editId ={this.props.oneeditId}
                       />
                 */}
                </div>
                <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <button type="button" className="btn adminCancel-btn col-lg-7 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal" >CANCEL</button>
                    </div>
                </div>
                </div>
              </div>
            </div>
        );
    }
}
export default TwoFieldForm;