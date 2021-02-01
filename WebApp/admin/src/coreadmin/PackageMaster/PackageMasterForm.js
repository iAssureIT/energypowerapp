import React, { Component } from 'react';
import jQuery from 'jquery';
import IAssureTable from '../IAssureTable/IAssureTable.jsx';
import $ from 'jquery';
import './PackageMaster.css'
import 'rc-time-picker/assets/index.css';
import axios from 'axios';
import swal from 'sweetalert';

class PackageMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromTime          : "",
      toTime            : "",
      packageName       : "",
      packageTypeArray  : [],
      tableHeading      : {
        packageType     : "Package Type",
        packageName     : "Package Name",
        fixCharges      : "Fixed Charges (₹)",
        maxHours        : "Max Hours",
        maxKm           : "Max Kms",
        actions         : 'Action',
      },
      tableObjects      : {
        deleteMethod    : 'delete',
        apiLink         : '/api/packagemaster/',
        paginationApply : false,
        searchApply     : false,
        editUrl         : '/package-master'
      },
      startRange        : 0,
      limitRange        : 10,
      dayArray          : [{ 'name': 'Sunday' }, { 'name': 'Monday' }, { 'name': 'Tuesday' }, { 'name': 'Wednesday' }, { 'name': 'Thursday' }, { 'name': 'Friday' }, { 'name': 'Saterday' }]
    };
  }
  componentDidMount() {
    this.edit(this.props.match.params.packageID);
    this.getData(this.state.startRange, this.state.limitRange);
    this.getPackageType();
    $.validator.addMethod("regxA1", function (value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter valid package name");

    $.validator.addMethod("regxZ", function (value, element, regexpr) {
      return regexpr !== value;
    }, "Please select package type");

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    $("#packageMaster").validate({
      rules: {
        packageType: {
          required: true,
          regxZ   : "--Select Package Type--"
        },
        packageName: {
          required: true,
          regxA1: /^[A-za-z0-9'!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+( [A-Za-z'0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)*$/,
        },
        fixCharges: {
          required: true,
        },
        maxHours: {
          required: true,
        },
        maxKm: {
          required: true,
        },
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") === "packageType") {
          error.insertAfter("#packageType");
        }
        if (element.attr("name") === "packageName") {
          error.insertAfter("#packageName");
        }
        if (element.attr("name") === "fixCharges") {
          error.insertAfter("#fixCharges");
        }
        if (element.attr("name") === "maxHours") {
          error.insertAfter("#maxHours");
        }
        if (element.attr("name") === "maxKm") {
          error.insertAfter("#maxKm");
        }
      }
    });
  }
  componentWillReceiveProps(nextProps){
    this.edit(nextProps.match.params.packageID);
  }
  handleChange(event) {
    event.preventDefault();
    const target = event.target;
    const name = target.name;
    this.setState({
      [name]: event.target.value
    });
  }
  submitPackageMaster(event) {
    event.preventDefault();
    if ($('#packageMaster').valid()) {
      var formValues = {
        packageID     : this.props.match.params.packageID,
        packageTypeId : this.state.packageType,
        packageName   : this.state.packageName,
        fixCharges    : this.state.fixCharges,
        maxHours      : this.state.maxHours,
        maxKm         : this.state.maxKm,
      }
      if(this.props.match.params.packageID){
        axios.patch("/api/packagemaster/patch", formValues)
        .then((response) => {
          if(response.data.duplicate === true){
            swal("This package type and package name already exist");
          }else{
            document.getElementById("btnCheck").innerHTML = "Submit";
            swal("Package updated successfully.")
            this.props.history.push("/package-master");
            this.setState({
              packageType : "",
              packageName : "",
              fixCharges  : "",
              maxHours    : "",
              maxKm       : "",
            })
            this.getData(this.state.startRange, this.state.limitRange);
          }
        })
        .catch(() => {

        })
      }else{
        axios.post("/api/packagemaster/post", formValues)
        .then((response) => {
          if(response.data.duplicate === true){
            swal("This package type and package name already exist");
          }else{
            swal("Package created successfully.")
            this.setState({
              packageType : "",
              packageName : "",
              fixCharges  : "",
              maxHours    : "",
              maxKm       : "",
            })
            this.getData(this.state.startRange, this.state.limitRange);
          }
        })
        .catch(() => {

        })
      }
      this.getData(this.state.startRange, this.state.limitRange);
      
    }

  }
  fromTime(value) {
    this.setState({
      fromTime: value
    })
  }
  toTime(value) {
    this.setState({
      toTime: value
    })
  }
  earlyMorningChargesfromTime(value) {
    this.setState({
      earlyMorningChargesfromTime: value
    })
  }
  earlyMorningChargestoTime(value) {
    this.setState({
      earlyMorningChargestoTime: value
    })
  }
  edit(packageID) {
    if (packageID) {
      axios.get('/api/packagemaster/get/one/' + packageID)
      .then((response) => {
        document.getElementById("btnCheck").innerHTML = "Update";
        this.setState({
          packageType : response.data.packageTypeId,
          packageName : response.data.packageName,
          fixCharges  : response.data.fixCharges,
          maxHours    : response.data.maxHours,
          maxKm       : response.data.maxKm,
        })
      })
      .catch((error) => {
      })
    }else{
      document.getElementById("btnCheck").innerHTML = "Submit";
      this.setState({
        packageType : "--Select Package Type--",
        packageName : "",
        fixCharges  : "",
        maxHours    : "",
        maxKm       : "",
      })
    }
  }
  getMax(event) {
    var charCode = (event.which) ? event.which : event.keyCode
    if (event.target.value > 10000) {
      if (charCode !== 8) {
        event.preventDefault();
        return false;
      }
    }
    else {
      return true;
    }
  }
  getData(startRange, limitRange) {
    var formValue = {
      startRange: startRange,
      limitRange: limitRange
    }
    axios.post("/api/packagemaster/get/list", formValue)
      .then((response) => {
        var tableData = response.data.map((a, i)=>{
          return {
            _id             : a._id,
            packageType     : a.packageType,
            packageName     : a.packageName,
            fixCharges      : a.fixCharges,
            maxHours        : a.maxHours,
            maxKm           : a.maxKm,
          }
        })
        this.setState({
          tableData: tableData
        })
      })
      .catch((error) => {

      })
  }
  getPackageType(){
    axios.get("/api/packagetypemaster/get/list")
    .then((response)=>{
      this.setState({
        packageTypeArray : response.data
      })
    })
    .catch((error)=>{

    })
  }
  render() {
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
        <section className="content">
          <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
            <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
              <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Package Master</h4>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding addMarginTopPM">
              <form id="packageMaster"  >
                <div className="">
                  <div className="col-lg-12 col-md-4 col-sm-12 col-xs-12">
                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                      <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">Package Type <span className="astrick">*</span></label>
                      <select id="packageType" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.packageType} ref="packageType" name="packageType" onChange={this.handleChange.bind(this)}>
                          <option>--Select Package Type--</option>
                          {
                              this.state.packageTypeArray && this.state.packageTypeArray.length > 0 ?
                                  this.state.packageTypeArray.map((data, i)=>{
                                      return(
                                          <option key={i} value={data._id}>{data.packageType}</option>
                                      );
                                  })
                              :
                              null
                          }
                      </select>
                    </div>
                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12" >
                      <div className="" id="packageName">
                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left" >
                          Package Name <span className="astrick">*</span>
                        </label>
                        <input
                          onChange={this.handleChange.bind(this)}
                          type="text" name="packageName"
                          data-text="city"
                          ref="packageName"
                          value={this.state.packageName}
                          className="form-control" />
                      </div>
                    </div>
                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="" id="fixCharges">
                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left" >
                          Fixed Charges (<i className="fa fa-rupee" />) <span className="astrick">*</span>
                        </label>
                       {/* <div className="input-group-addon inputIcon"><i className="fa fa-rupee "></i></div>*/}

                        <input
                          onChange={this.handleChange.bind(this)}
                          type="number" name="fixCharges"
                          value={this.state.fixCharges}
                          className="form-control"
                          onKeyDown={this.getMax.bind(this)}
                          max="100000"
                        />
                      </div>
                    </div>
                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="" id="maxHours">
                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left" >
                          Max Hours <span className="astrick">*</span>
                        </label>
                        <input
                          type="number" name="maxHours"
                          value={this.state.maxHours}
                          onChange={this.handleChange.bind(this)}
                          onKeyDown={(event)=>(event.target.value > 24 ? (((event.which ? event.which : event.keyCode) !== 8) ? (event.preventDefault(), true) : false) : true)}
                          className="form-control" 
                          max="24"/>
                      </div>
                    </div>
                    <div className="form-group valid_box col-lg-4 col-md-4 col-sm-12 col-xs-12">
                      <div className="" id="maxKm">
                        <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left" >
                          Max Kms <span className="astrick">*</span>
                        </label>
                        <input
                          onChange={this.handleChange.bind(this)}
                          type="number" name="maxKm"
                          value={this.state.maxKm}
                          className="form-control"
                          onKeyDown={(event)=>(event.target.value > 1000 ? (((event.which ? event.which : event.keyCode) !== 8) ? (event.preventDefault(), true) : false) : true)}
                          max="1000" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
                  <button className="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn button3 pull-right" id="btnCheck" onClick={this.submitPackageMaster.bind(this)}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <IAssureTable
                tableHeading={this.state.tableHeading}
                twoLevelHeader={this.state.twoLevelHeader}
                dataCount={this.state.dataCount}
                tableData={this.state.tableData}
                tableObjects={this.state.tableObjects}
                getData={this.getData.bind(this)}
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default PackageMaster;