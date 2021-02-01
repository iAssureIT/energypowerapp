import React, { Component } from 'react';
import $                    from 'jquery';
import jQuery               from 'jquery';
import axios                from 'axios';
import swal                 from 'sweetalert';
import {connect}            from 'react-redux';
import { withRouter }       from 'react-router-dom';
import _                    from 'underscore';
import 'bootstrap/js/tab.js';
class SelectVendor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "startRange": 0,
            "limitRange": 10,
            "selectedVendor"            : {},
            "selectedVendorLocation"    : {},
            "editId"    :  '',
        };
    }
    componentDidMount(){
        this.getVendor();

        window.scrollTo(0, 0);
        $.validator.addMethod("regxvendor", function (value, element, arg) {
            return arg !== value;
        }, "Please select the vendor");
        $.validator.addMethod("regxvendorLocation", function (value, element, arg) {
            return arg !== value;
        }, "Please select the vendor location");

        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });
        $("#SelectVendor").validate({
            rules: {
                vendor: {
                    required: true,
                    regxvendor: "--Select Vendor--"
                },
                vendorLocation: {
                    required: true,
                    regxvendorLocation: "--Select Vendor Location--"
                }
            },
            errorPlacement: function (error, element) {
                if (element.attr("name") == "vendor") {
                    error.insertAfter("#vendor");
                }
                if (element.attr("name") == "vendorLocation") {
                    error.insertAfter("#vendorLocation");
                }
            }
        });
    }
    handleChange(event) {
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        var value = event.target.value;
        this.setState({
            [name]: event.target.value
        },()=>{
            if(this.state[name] == this.state.vendor){
                this.getVendorLocation(value, '');
                this.setState({
                    vendorLocation : ''
                })
            }else if(this.state[name] == this.state.vendorLocation && this.state.vendor){
                this.getVendorLocation(this.state.vendor, this.state.vendorLocation);
            }
        });
    }
    getVendor(){
        axios.get('/api/entitymaster/get/vendor')
		.then((response) => {
            console.log('vendorArray', response.data)
			this.setState({
				vendorArray: response.data
			})
		})
		.catch((error) => {
			
		})
    }
    getVendorLocation(vendorId, vendorLocationId){
        axios.get('/api/entitymaster/get/one/'+vendorId)
        .then((response)=>{
            this.setState({
                selectedVendor : response.data,
                vendorLocationArray: response.data.locations
            },()=>{
                if(this.state.vendorLocationArray && this.state.vendorLocationArray.length>0){
                    var selectedVendorLocation = this.state.vendorLocationArray.filter((a)=> a._id == vendorLocationId);
                    console.log('selectedVendorLocation', selectedVendorLocation);
                    this.setState({
                        selectedVendorLocation : selectedVendorLocation[0]
                    })
                }else{
                    this.setState({
                        selectedVendorLocation : []
                    })
                }
            })
        })
        .catch((error)=>{

        })
    }
    submit(event){
        event.preventDefault();
        if($('#SelectVendor').valid()) {
            var vendorID            = this.state.vendor;
            var vendorLocationID    = this.state.vendorLocation;
            this.props.vendor(vendorID, vendorLocationID);
            this.props.history.push("/supplier/basic-details");
        }
    }
    render() {
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOPadding">
                        <section className="content">
                            <div className="pageContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                    <h4 className="weighttitle col-lg-11 col-md-11 col-xs-11 col-sm-11 NOpadding-right">Supplier Master </h4>
                                </div>
                                <section className="Content">
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <form className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12" id="SelectVendor">
                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Please select Vendor and Location to add Supplier. </label>
                                                </div>
                                                <div className="form-margin col-lg-6 col-md-6 col-sm-12 col-xs-12" >
                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Vendor <sup className="astrick">*</sup></label>
                                                    <select id="vendor" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.vendor} ref="vendor" name="vendor" onChange={this.handleChange.bind(this)}>
                                                        <option>--Select Vendor--</option>
                                                        {
                                                            this.state.vendorArray && this.state.vendorArray.length > 0 ?
                                                                this.state.vendorArray.map((data, i)=>{
                                                                    return(
                                                                        <option key={i} value={data._id}>{data.companyName}</option>
                                                                    );
                                                                })
                                                            :
                                                            null
                                                        }
                                                    </select>
                                                </div>
                                                <div className="form-margin col-lg-6 col-md-6 col-sm-12 col-xs-12 marbtm30" >
                                                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Vendor Location <sup className="astrick">*</sup></label>
                                                    <select id="vendorLocation" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.vendorLocation} ref="vendorLocation" name="vendorLocation" onChange={this.handleChange.bind(this)}>
                                                        <option>--Select Vendor Location--</option>
                                                        {
                                                            this.state.vendorLocationArray && this.state.vendorLocationArray.length > 0 ?
                                                                this.state.vendorLocationArray.map((data, i)=>{
                                                                    return(
                                                                        <option key={i} value={data._id}>{((data.locationType).match(/\b(\w)/g)).join('')} - {data.area} {data.city}, {data.stateCode} - {data.countryCode}  </option>
                                                                    );
                                                                })
                                                            :
                                                            null
                                                        }
                                                    </select>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                    {
                                                        this.state.selectedVendor.companyName ? 
                                                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 detailBox marbtm30">
                                                                    <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 detailBoxImg" style={{"backgroundImage":`url(`+this.state.selectedVendor.companyLogo+`)`}}></div>
                                                                    <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                                                                        <h5 className="detailtitle">{this.state.selectedVendor.companyName}</h5>
                                                                        <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                            <li><i className="fa fa-user-o "></i> {this.state.selectedVendor.groupName}</li>
                                                                            <li><i className="fa fa-globe"></i> {this.state.selectedVendor.website}</li>
                                                                            <li><i className="fa fa-envelope "></i> {this.state.selectedVendor.companyEmail}</li>
                                                                            <li>CIN: {this.state.selectedVendor.CIN}</li>
                                                                            <li>TAN: {this.state.selectedVendor.TAN}</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        :
                                                        null
                                                    }
                                                    {
                                                        this.state.selectedVendorLocation && this.state.selectedVendorLocation.locationType ? 
                                                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 detailBox marbtm30">
                                                                    <div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 mapIconMargin">
                                                                        <i className="fa fa-map-marker addressIcon"></i>
                                                                    </div>
                                                                    <div className="col-lg-6 col-md-1 col-sm-12 col-xs-12">
                                                                        <h4>Location Details</h4>
                                                                    </div>
                                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                        <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                            <li> {this.state.selectedVendorLocation.locationType}</li>
                                                                            <li> {this.state.selectedVendorLocation.addressLine1}</li>
                                                                            <li> {this.state.selectedVendorLocation.addressLine2}</li>
                                                                            <li> {this.state.selectedVendorLocation.area} {this.state.selectedVendorLocation.city}</li>
                                                                            <li> {this.state.selectedVendorLocation.district} {this.state.selectedVendorLocation.state} {this.state.selectedVendorLocation.country}</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        :
                                                        null
                                                    }
                                                </div>
                                                <div className="form-margin col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                    <button onClick={this.submit.bind(this)} className="btn button3 pull-right">Save & Next</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        vendor : (vendorID, vendorLocationID)=> dispatch({
            type:'VENDOR',
            vendorID : vendorID,
            vendorLocationID : vendorLocationID
        }),
    }
}
const mapStateToProps = (state)=>{
    return {
        vendorID            : state.vendorID,
        vendorLocationID    : state.vendorLocationID
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SelectVendor));