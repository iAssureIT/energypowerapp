import React, { Component } from 'react';
import $                    from 'jquery';
import jQuery               from 'jquery';
import swal                 from 'sweetalert';
import { withRouter }       from 'react-router-dom';
import _                    from 'underscore';
import 'bootstrap/js/tab.js';

class BookingRequired extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pathname : props && props.pathname ? props.pathname : '',
            'preApprovedAmount'      : props && props.editData != null ? props.editData.preApprovedAmount :0,
            'preApprovedRides' : props && props.editData != null ? props.editData.preApprovedRides : 0,
            'preApprovedKilometer' : props && props.editData != null ? props.editData.preApprovedKilometer : 0,
            // 'approvingAuthorityId1'     : props && props.editData != null ? props.editData.approvingAuthorityId1 :'',
            // 'approvingAuthorityId2'     : props && props.editData != null ? props.editData.approvingAuthorityId2 :'',
            // 'approvingAuthorityId3'     : props && props.editData != null ? props.editData.approvingAuthorityId3 :'',
            'bookingApprovalRequired'   : props && props.editData != null ? props.editData.bookingApprovalRequired :"No",
        };
        this.handleChange = this.handleChange.bind(this)
    }
    componentDidMount() {
        this.setState({
            pathname : this.props.pathname
        });
        
    }
   
    componentWillReceiveProps(nextProps) {
       
        this.setState({
            show : nextProps.show,
            pathname : nextProps.pathname
        })
    }
    handleChange(event) {
        event.preventDefault();
        const target = event.target;
        const name = target.name;
        this.setState({
            [name] : event.target.value
        }, () => {
            var data = {
                'preApprovedKilometer'     : this.state.preApprovedKilometer,
                'preApprovedAmount'         : this.state.preApprovedAmount,
                'preApprovedRides'          : this.state.preApprovedRides,
                // 'approvingAuthorityId1'     : this.state.approvingAuthorityId1,
                // 'approvingAuthorityId2'     : this.state.approvingAuthorityId2,
                // 'approvingAuthorityId3'     : this.state.approvingAuthorityId3,
                'bookingApprovalRequired'   : this.state.bookingApprovalRequired,
            }
            this.props.getData(data);
        });
    }

    keyPressNumber = (e) => {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 189]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
            (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode === 189 || e.keyCode === 32) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 58)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode === 190 || e.keyCode === 46)) {
            e.preventDefault();
        }
    }

    bookingApproval(val,event) {
        this.setState({
            bookingApprovalRequired : val
        }, () => {
            var data = {
                'preApprovedKilometer'     : this.state.preApprovedKilometer,
                'preApprovedAmount'         : this.state.preApprovedAmount,
                'preApprovedRides'          : this.state.preApprovedRides,
                // 'approvingAuthorityId1'     : this.state.approvingAuthorityId1,
                // 'approvingAuthorityId2'     : this.state.approvingAuthorityId2,
                // 'approvingAuthorityId3'     : this.state.approvingAuthorityId3,
                'bookingApprovalRequired'   : val,
            }
            this.props.getData(data);
        });
        
    }
    
    render() {
       
        return (
            <div>
            <div className="marginTop10 col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                                                    
            { this.state.pathname != "appCompany" ?
                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12">Booking Approval Required</label>
                    
                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        <label className={this.state.bookingApprovalRequired === "Yes" ? "btn toggleButton customToggleButtonPermission btn-secondary active":"btn toggleButton customToggleButtonPermission btn-secondary"} value="Yes" onClick={this.bookingApproval.bind(this,"Yes")}>
                        <input type="radio"
                            name="options" 
                            id="yes"
                            value= "Yes"
                            autoComplete="off"
                            checked
                            />Yes
                        </label>
                        <label className={this.state.bookingApprovalRequired === "No" ? "btn toggleButton customToggleButtonPermission btn-secondary active":"btn toggleButton customToggleButtonPermission btn-secondary"} value="No" onClick={this.bookingApproval.bind(this,"No")} >
                        <input type="radio" name="options" id="no"  value="no" autoComplete="off" /> No
                        </label>
                    </div>
                </div> 
                :
                <div>
                </div>
            }
                
            
        </div>
        {/*<div className="form-margin bookingApproval col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                
            {
                this.state.bookingApprovalRequired === "Yes" ? 
                    <div>
                        <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee  person">
                           <div id="approvingAuthorityId1"> 
                              <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">EmployeeID of Approving Authority #1<i className="astrick">*</i></label>
                              <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.approvingAuthorityId1} ref="approvingAuthorityId1" name="approvingAuthorityId1" onChange={this.handleChange.bind(this)} required/>
                            </div>
                        </div>

                        <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee  person">
                           <div id="approvingAuthorityId2"> 
                              <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">EmployeeID of Approving Authority #2<i className="astrick">*</i></label>
                              <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.approvingAuthorityId2} ref="approvingAuthorityId2" name="approvingAuthorityId2"   onChange={this.handleChange.bind(this)} />
                            </div>
                        </div>
                        <div className=" col-lg-4 col-md-4 col-sm-12 col-xs-12 employee  person">
                           <div id="approvingAuthorityId3"> 
                              <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding-left">EmployeeID of Approving Authority #3<i className="astrick">*</i></label>
                              <input type="text" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.state.approvingAuthorityId3} ref="approvingAuthorityId3" name="approvingAuthorityId3"   onChange={this.handleChange.bind(this)} />
                            </div>
                          </div>
                    </div>
                    
                :
                null
            
            }
        </div>*/}
        <div className="form-margin bookingApproval col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                
            {
                this.state.bookingApprovalRequired === "Yes" ? 
                    <div >
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">                        
                       
                        <div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12 NOpadding">
                            <div className="col-md-12">
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Pre Approved Amount(&#8377;)<i className="astrick">*</i></label>
                                <input type="number" min="0" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" placeholder="Enter Amount" min="0" pattern="/^[0-9]+(,[0-9]+)*$/" value={this.state.preApprovedAmount} ref="preApprovedAmount" name="preApprovedAmount" onKeyDown={this.keyPressNumber.bind(this)}  onChange={this.handleChange.bind(this)} />
                            </div>
                        </div>
                        <div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12 NOpadding">
                            <div className="col-md-12">
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Pre Approved Rides<i className="astrick">*</i></label>
                                <input type="number" min="0" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" placeholder="Enter Rides" min="0" value={this.state.preApprovedRides} ref="preApprovedRides" name="preApprovedRides" onKeyDown={this.keyPressNumber.bind(this)}  onChange={this.handleChange.bind(this)}  />
                            </div>
                        </div>
                        <div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12 NOpadding">
                            <div className="col-md-12">
                                <label className="labelform col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">Pre Approved Kilometers<i className="astrick">*</i></label>
                                  <input type="number" min="0" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12" placeholder="Enter Kilometer" min="0" value={this.state.preApprovedKilometer} ref="preApprovedKilometer" name="preApprovedKilometer" onKeyDown={this.keyPressNumber.bind(this)}  onChange={this.handleChange.bind(this)}  />
                            </div>
                        </div>
                         </div>
                    </div>
                    
                :
                null
            
            }
        </div>
        </div>
       
        );
     }   
}
export default withRouter(BookingRequired)


