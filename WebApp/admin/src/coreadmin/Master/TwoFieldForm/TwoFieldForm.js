import React, { Component }     from 'react';
import $                        from 'jquery';
import jQuery                   from 'jquery';
import axios                    from 'axios';
import swal                     from 'sweetalert';
import IAssureTable             from '../../IAssureTable/IAssureTable.jsx';
import { withRouter }           from 'react-router-dom';
import OneFieldForm             from '../OneFieldForm/OneFieldForm.js';
import BulkUpload               from "../BulkUpload/BulkUpload.js";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";

import './TwoFieldForm.css'

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
            "editId"               :  '',
            gmapsLoaded: false,
        };
    }
    initMap = () => {
      this.setState({
        gmapsLoaded: true,
      })
    }

    getGoogleAPIKey(){
        axios.get("/api/projectSettings/get/GOOGLE",)
        .then((response) => {
            this.setState({
                googleAPIKey : response.data.googleapikey
            },()=>{
                window.initMap = this.initMap
                const gmapScriptEl = document.createElement(`script`)
                gmapScriptEl.src = `https://maps.googleapis.com/maps/api/js?key=`+this.state.googleAPIKey+`&libraries=places&callback=initMap`
                document.querySelector(`body`).insertAdjacentElement(`beforeend`, gmapScriptEl)
            });
        })
        .catch((error) =>{
            swal(error)
        })
    }
    componentDidMount() {
        if(this.props.fields.secondAttributeName == "cityType"){
         this.getGoogleAPIKey()
        }
        // console.log("props = ", this.props);
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
        }
        else{
            this.setState({
                attributeName                              : "",
                [this.props.fields.secondAttributeName]    : "-- Select --"
            })
            // console.log("nextProps else==>",nextProps)
        }
        this.getSecondFieldData(this.state.startRange, this.state.limitRange);

        if(this.props.fields.secondAttributeName == "cityType"){
         this.getGoogleAPIKey()
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
            var postapiurl = this.props.tableObjects.apiLink+"post";
            axios.post(postapiurl, formValues)
                .then((response) => {
                    // console.log("response = ", response.data);

                    if (response.data.created) {
                        swal(" ",this.state.attributeName+" Submitted Successfully");
                        this.getData(this.state.startRange, this.state.limitRange);
                        this.setState({
                           attributeName    : "",
                           [this.props.fields.secondAttributeName]            : "-- Select --"
                         })

                    }else{
                        swal(" ",this.state.attributeName+" Already Exist");
                    }
                })
                .catch((error) => {
                    console.log("Error in Post API of Two field = ",error);
                })
         }      
    }
    updateType(event) {
        event.preventDefault();
        // console.log("In Update two field this.props = ",this.props);
        var formValues ={
                "fieldID"       : this.state.fieldId,
                "dropdownID"    : this.state.selectedIndex,
                "fieldValue"    : this.state.attributeName,
            }
        if ($('#twoFieldFormValid').valid()) {
            axios.patch(this.props.tableObjects.apiLink+'patch', formValues)
                .then((response) => {
                    if(response.data.updated){
                        swal(" ","Record Updated Successfully");
                        this.getData(this.state.startRange, this.state.limitRange);
                        this.setState({
                           attributeName    : "",
                           [this.props.fields.secondAttributeName]            : "-- Select --"
                        })
                        console.log("this.props.history",this.props.history);
                        this.props.history.goBack();
                    }                    
                })
                .catch((error) => {
                    swal(" ","Failed to Update Record");
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
    backtoum() {
        this.props.history.push("/umlistofusers")
    }
    getData(startRange, limitRange) {
        var data = {
            startRange: startRange,
            limitRange: limitRange
        }
        axios.post(this.props.tableObjects.apiLink+'get/list', data)
            .then((response) => {
                // console.log("response = ",response.data);
                this.setState({
                    tableData: response.data
                })
            })
            .catch((error) => {          
            });
    }
    getSecondFieldData(startRange, limitRange) {
        var data = {
            startRange: startRange,
            limitRange: limitRange
        }
        axios.post(this.props.tableObjects.apiLink2+'get/list', data)
            .then((response) => {
                // console.log('=========>',response.data)
                this.setState({
                    secondFieldData: response.data,
                    secondFieldId: response.data._id
                })
            })
            .catch((error) => {         
            });
    }
    edit(id) {
        // console.log("edit id==>",id)
        var fieldName = this.props.fields.attributeName;
        var secondAttributeId = this.props.fields.secondAttributeId;
        var secondAttributeName = this.props.fields.secondAttributeName;

        // console.log("secondAttributeId==>",secondAttributeId)
        axios.get(this.props.tableObjects.apiLink+'get/one/' + id)
            .then((response) => {
                if (response.data) {
                    // console.log("fieldName response.data==>",response.data)

                    axios.get(this.props.tableObjects.apiLink2+'get/one/' + response.data[secondAttributeId])
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
    handleChangePlaces = address => {
      var array = {
          attributeName    : address,
       }
    this.setState({ attributeName : address, tripArray : array });
    };
    handleSelectLocation = address => {
    geocodeByAddress(address)
     .then((results) =>{ 

      for (var i = 0; i < results[0].address_components.length; i++) {
          for (var b = 0; b < results[0].address_components[i].types.length; b++) {
              switch (results[0].address_components[i].types[b]) {
                  case 'sublocality_level_1':
                      var area = results[0].address_components[i].long_name;
                      break;
                  case 'sublocality_level_2':
                      var area = results[0].address_components[i].long_name;
                      break;
                  case 'locality':
                      var city = results[0].address_components[i].long_name;
                      break;
                  case 'administrative_area_level_1':
                      var state = results[0].address_components[i].long_name;
                      break;
                  case 'country':
                     var country = results[0].address_components[i].long_name;
                      break;
                  case 'postal_code':
                     var pincode = results[0].address_components[i].long_name;
                      break;
              }
          }
        }
    })
    .catch(error => console.error('Error', error));
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({'fromLatLng': latLng}))
      .catch(error => console.error('Error', error));
      var array = {
          attributeName    : address,
        }
      this.setState({ attributeName : address ? address.split(",")[0] :"" , tripArray : array });
    };

    closeModal(event){
        event.preventDefault();
        $("#oneField"+this.props.oneFields.attributeName).hide(); 
        $(".modal-backdrop").remove();
        this.props.history.push(this.props.oneTableObjects.listUrl)
    }


    render() {
      const searchOptions = {
          types: ['(cities)'],
          componentRestrictions: {country: "in"}
        }
        var bulkReq = this.props.bulkRequired ? true : false 
        return (
            <div className="row">
                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                    {
                        this.props.fields.title == "Roles" ?
                            <h4 className="weighttitle col-lg-10 col-md-10 col-xs-12 col-sm-12 NOpadding-right">{this.props.fields.title === "Location Type"? this.props.fields.title+"s" : this.props.fields.title } </h4>
                        :
                            <h4 className="weighttitle col-lg-9 col-md-9 col-xs-12 col-sm-12 NOpadding-right">{this.props.fields.title === "Location Type"? this.props.fields.title+"s" : this.props.fields.title } </h4>
                    }
                    {
                        this.props.twofieldBulkRequired ?
                            <ul className="nav tabNav nav-pills col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                <li className="active col-lg-5 col-md-5 col-xs-5 col-sm-5 NOpadding text-center">
                                    <a className="fieldTab" data-toggle="tab" href={"#manual-"+this.props.fields.attributeName}>Manual</a>
                                </li>
                                <li className="col-lg-6 col-md-6 col-xs-6 col-sm-6 NOpadding  text-center">
                                    <a className="fieldTab" data-toggle="tab" href={"#bulk-"+this.props.fields.attributeName}>Bulk Upload</a>
                                </li>
                            </ul>
                        : null 
                    }
                     {
                        this.props.fields.title == "Roles" ?
                            <div className="col-lg-2 col-md-3 col-sm-12 col-xs-12 " id="rolemodalcl">
                                <button type="button" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 addexamform userbtn clickforhideshow"
                                    onClick={this.backtoum.bind(this)}
                                >
                                    <i className="fa fa-undo" aria-hidden="true"></i>
                                    <b>&nbsp;&nbsp; Back To UM List</b>
                                </button>
                            </div>
                            :
                            null
                    }
                </div>
                {   
                    this.props.oneFields ?  

                        <div className="modal" id={"oneField"+this.props.oneFields.attributeName} role="dialog">
                          <div className="adminModal adminModal-dialog marginTopModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                              <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
                                    <button type="button" className="adminCloseButton" onClick={this.closeModal.bind(this)}>&times;</button>
                               </div>
                              </div>
                            <div className="modal-body adminModal-body OneFieldModal col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <OneFieldForm fields={this.props.oneFields}
                                    tableHeading={this.props.oneTableHeading}
                                    tableObjects={this.props.oneTableObjects}
                                    editId ={this.props.oneeditId}
                                    getSecondFieldData={this.getSecondFieldData.bind(this)}
                                    bulkRequired = {bulkReq}
                                    masterFieldForm = {true}
                                    
                                    url ={this.props.onefieldurl}
                                    fileurl ={this.props.onefieldfileurl}
                                    data ={this.props.data}
                                    uploadedData ={this.props.oneFielduploadedData}
                                    getFileDetails ={this.props.getOneFieldFileDetails}
                                    fileDetails ={this.props.oneFieldfileDetails}
                                    goodRecordsHeading ={this.props.oneFieldgoodRecordsHeading}
                                    failedtableHeading ={this.props.oneFieldfailedtableHeading}
                                    failedRecordsTable ={this.props.oneFieldfailedRecordsTable}
                                    failedRecordsCount ={this.props.oneFieldfailedRecordsCount}
                                    goodRecordsTable ={this.props.oneFieldgoodRecordsTable}
                                    goodDataCount ={this.props.oneFieldgoodDataCount}
                                    history={this.props.history}
                                   />
                            </div>
                            <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                {/*<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                                    <button type="button" className="btn adminCancel-btn col-lg-7 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal" >CANCEL</button>
                                                                </div>*/}
                            </div>
                            </div>
                          </div>
                        </div>
                    :null
                }
                <section className="Content">
                    <div className="row tab-content">
                        <div id={"manual-"+this.props.fields.attributeName} className="tab-pane fade in manual active mt">
                            <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="twoFieldFormValid" >
                                {
                                    this.props.oneFields ? 
                                        <div className="form-margin form-group col-lg-6 col-md-6 col-sm-12 col-xs-12 pdcls" >
                                            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">{this.props.fields.secondtitle} <i className="astrick">*</i></label>
                                            <div className="input-group" id="selectField" >
                                                <select className="addonDiv col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state[this.props.fields.secondAttributeName]} data_name ="selectField" name={this.props.fields.secondAttributeName} onChange={this.handleSelect.bind(this)} required>
                                                    <option selected={true} disabled={true}>-- Select --</option>
                                                    {
                                                    this.state.secondFieldData && this.state.secondFieldData.length > 0 ?
                                                      this.state.secondFieldData.map((data, index)=>{
                                                        return(
                                                            <option key={index} id={data._id}>{data[this.props.fields.secondAttributeName]}</option>
                                                        );
                                                      })
                                                    :
                                                    null
                                                    }
                                                   
                                                </select>
                                                <div className="input-group-addon inputIcon plusIconBooking" data-toggle="modal"  data-target={"#oneField"+this.props.oneFields.attributeName} title={"Add "+this.props.fields.secondtitle} ><i className="fa fa-plus "></i>
                                                </div>
                                               
                                            </div>
                                        </div>
                                    :
                                    <div className="form-margin form-group col-lg-6 col-md-6 col-sm-12 col-xs-12 pdcls" >
                                        <div className="" id="selectField" >
                                            <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">{this.props.fields.secondtitle} <i className="astrick">*</i></label>
                                            <select className="addonDiv col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state[this.props.fields.secondAttributeName]} data_name ="selectField" name={this.props.fields.secondAttributeName} onChange={this.handleSelect.bind(this)} required>
                                                <option selected={true} disabled={true}>-- Select --</option>
                                                {
                                                this.state.secondFieldData && this.state.secondFieldData.length > 0 ?
                                                  this.state.secondFieldData.map((data, index)=>{
                                                    return(
                                                        <option  key={index} id={data._id}>{data[this.props.fields.secondAttributeName]}</option>
                                                    );
                                                  })
                                                :
                                                null
                                                }
                                               
                                            </select>
                                        </div>
                                    </div>
                                }

                                <div className="form-margin col-lg-6  col-md-6 col-sm-12 col-xs-12 pdcls">
                                    <div  id="textFieldOne">
                                       {/*{console.log("this.props.fields.secondAttributeName",this.props.fields.secondAttributeName)}*/}
                                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">{this.props.fields.title} <i className="astrick">*</i></label>
                                        {this.props.fields.secondAttributeName == "cityType" && this.state.gmapsLoaded == true ?
                                            <PlacesAutocomplete
                                                value={this.state.attributeName}
                                                onChange={this.handleChangePlaces}
                                                onSelect={this.handleSelectLocation}
                                                // searchOptions={searchOptions}

                                              >
                                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                  <div>
                                                    <input
                                                      {...getInputProps({
                                                        placeholder: 'Search cities ...',
                                                        className: 'location-search-input col-lg-12 form-control',
                                                      })}
                                                    />
                                                    <div className="autocomplete-dropdown-container">
                                                      {loading && <div>Loading...</div>}
                                                      {suggestions.map(suggestion => {
                                                        const className = suggestion.active
                                                          ? 'suggestion-item--active'
                                                          : 'suggestion-item';
                                                        // inline style for demonstration purpose
                                                        const style = suggestion.active
                                                          ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                          : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                        return (
                                                          <div
                                                            {...getSuggestionItemProps(suggestion, {
                                                              className,
                                                              style,
                                                            })}
                                                          >
                                                            {/*<span>{suggestion.description}</span>*/}
                                                        <span>{(suggestion.description ? suggestion.description.split(",")[0]:"")}</span>

                                                          </div>
                                                        );
                                                      })}
                                                    </div>
                                                  </div>
                                                )}
                                            </PlacesAutocomplete>
                                              :
                                            <input type={this.props.input_type === "number" ? this.props.input_type: "text"}  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.attributeName} ref={this.props.fields.attributeName} name="attributeName" onChange={this.handleChange.bind(this)} placeholder={this.props.fields.placeholder} required />
                                        }
                                    </div>
                                </div>
                                <br />
                                <div className="form-margin col-lg-6 col-lg-offset-6 col-md-6 col-sm-12 col-xs-12">

                                    {this.props.editId ?
                                        <button onClick={this.updateType.bind(this)} className="btn button3 pull-right">Update</button>
                                        :
                                        <button onClick={this.submitType.bind(this)} className="btn button3 pull-right">Submit</button>
                                    }
                                </div>
                            </form> 
                            <div className="oneFieldTable col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <IAssureTable
                                    tableHeading={this.props.tableHeading}
                                    twoLevelHeader={this.state.twoLevelHeader}
                                    dataCount={this.state.dataCount}
                                    tableData={this.state.tableData}
                                    getData={this.getData.bind(this)}
                                    tableObjects={this.props.tableObjects}
                                    getSecondFieldData={this.getSecondFieldData.bind(this)}
                                />
                            </div>
                        </div>
                        <div id={"bulk-"+this.props.fields.attributeName} className="tab-pane fade in bulk col-lg-12 col-md-12 col-sm-12 col-xs-12 mt">
                            <div className="outerForm">
                                <BulkUpload 
                                    url ={this.props.url}
                                    data ={this.props.data}
                                    uploadedData ={this.props.uploadedData}
                                    fileurl ={this.props.twofieldfileurl}
                                    getFileDetails ={this.props.getTwoFieldFileDetails}
                                    getData={this.getData.bind(this)}
                                    fileDetails ={this.props.fileDetails}
                                    goodRecordsHeading ={this.props.goodRecordsHeading}
                                    failedtableHeading ={this.props.failedtableHeading}
                                    failedRecordsTable ={this.props.failedRecordsTable}
                                    failedRecordsCount ={this.props.failedRecordsCount}
                                    goodRecordsTable ={this.props.goodRecordsTable}
                                    goodDataCount ={this.props.goodDataCount}
                                    />

                            </div>
                        </div>
                    </div>
                </section>
            </div>


        
        );
    }
}
export default TwoFieldForm;