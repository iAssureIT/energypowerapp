import React, { Component }       	from 'react';
import {Route, withRouter} 			from 'react-router-dom';
import swal                     	from 'sweetalert';
import axios 						from 'axios';
import $ 							from 'jquery';
import jQuery 						from 'jquery';
import 'jquery-validation';


class BillView extends Component {
	constructor(props){
		super(props);
		this.state = {
			data : [],
			notes:'',
			terms:''
		}
	}
	handleChange(event) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: event.target.value
        });   
    }

	download(){}

	print(event){
		event.preventDefault();
        $('#headerid').hide();
        $('#sidebar').toggleClass('active');
        $('#headerid').toggleClass('headereffect');
        $('#dashbordid').toggleClass('dashboardeffect')
        var sideBar = $("#sidebar").hasClass("active")
        localStorage.setItem('sideBar', sideBar);
        $('#sidebar').hide();
        $('#widgets').hide();
        $('.dots').hide();
        $('.button2').hide();
        $('.main-footer').hide();
        $(".box-header").hide();
        // document.getElementById("viewcontract").scale(2, 2);

        window.print();

        $('#headerid').show();
        $('#sidebar').toggleClass('active')
        $('#headerid').toggleClass('headereffect');
        $('#dashbordid').toggleClass('dashboardeffect')
        var sideBar = $("#sidebar").hasClass("active")
        localStorage.setItem('sideBar', sideBar);
        $('#sidebar').show();
        $('#widgets').show();
        $('#printButton').show();
        $('.button2').show();
        $('.main-footer').show();
        $(".box-header").show();
	}

	email(){}
  
	render() {
		
		return (
         <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
         	 <section className="Content">
         	 	<div className="row">
         	 		<div className="col-md-12">
         	 			<div className="invoiceWrapper">
         	 				<div className="box-header with-border invoice-title">
			          			<h4 className="invoiceTitle">Invoice</h4>
			          		</div>
			          		<div className="box-body">
			          			<div className="dots dropdown1 marginAjt col-lg-12 col-md-6 col-sm-6 col-xs-6">
                                    <i className="fa fa-ellipsis-h dropbtn1 dropbtn2 buttonDrop3" aria-hidden="true"></i>
                                    <div className="dropdown-content1 dropdown2-content2">
                                        <ul className="pdcls ulbtm">
                                            <li className="styleContactActbtn" data-index  onClick={this.download.bind(this)}> 
                                                <a><i className="fa fa-download" aria-hidden="true" ></i>&nbsp;&nbsp;<span className="mrflfedit">Download</span></a>
                                            </li>
                                            <li className="styleContactActbtn" data-index onClick={this.print.bind(this)} >
                                                <a className="pull-left"><i className="fa fa-print " aria-hidden="true" ></i>&nbsp;&nbsp;Print</a>
                                            </li>
                                            <li className="styleContactActbtn" data-index onClick={this.email.bind(this)} >
                                                <a className="pull-left"><i className="fa fa-envelope " aria-hidden="true" ></i>&nbsp;&nbsp;Email</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
			          			<div className="col-lg-12 col-md-12">
			          			<div className="col-lg-10 col-md-10">
			          				<h5 className="detailtitle">Fivebees</h5>
                                    <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                        <li><i className="fa fa-globe"></i> ABC</li>
                                        <li><i className="fa fa-envelope "></i> abc@fivebees.com</li>
                                        <li>GST: HGJ123490</li>
                                        <li>PAN: AUYYUI1234</li>
                                    </ul>
			          				
			          			</div>
			          			<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 detailBoxImg" style={{ "backgroundImage": 'url("/images/logonotfound.jpg")' }}></div>
			          			
			          			</div>
			          			<div className="col-lg-12">
			          			<div className="col-lg-8 col-md-8">
			          				<h5 className="detailtitle">IBM</h5>
                                    <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                        <li><i className="fa fa-globe"></i> ABC</li>
                                        <li><i className="fa fa-envelope "></i> abc@ibm.com</li>
                                        <li>GST: HGJ123490</li>
                                        <li>PAN: AUYYUI1234</li>
                                    </ul>
			          			</div>
			          			<div className="col-lg-4 col-md-4">
			          				<ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
			          				<li>Invoice# : 1234</li>
			          				<li>Date :20/04/2020</li>
			          				</ul>
			          			</div>
			          			</div>
			          			<div className="col-lg-12">
			          				<div className="col-lg-12 marginStyle">
			          					<div className="table-responsive col-lg-12 col-md-12">
				          					<table className="table table-bordered">
				          						<thead>
				                            <tr style={{"background":"#eee"}}>
		              							<td><strong>Item Type</strong></td>
		              							<td><strong>Description</strong></td>
		              							<td><strong>Quantity</strong></td>
		              							<td><strong>Unit Cost(Rs)</strong></td>
		              							<td><strong>Line Total(Rs)</strong></td>
				                            </tr>
				          						</thead>
				          						<tbody className="tableBody" id="tableBody">
				          							<tr>
				          							<td>Pune-Hinjewadi Trip</td>
				          							<td>
				          								Trip ID# : 1234 <br/>
				          								Sedan car<br/>
				          								White Honda City <br/>
				          								MH-12-DE-1234<br/>
				          								Driver: ABC(ID:12)
				          							</td>
				          							<td>175KM</td>
				          							<td>10</td>
				          							<td>1650</td>
				          							</tr>
				          							
											        <tr className="footerTR borderTop">
							                            <th className="" colSpan="4"> SUB TOTAL </th>
							                            <th className="" colSpan="2"> 1650 </th>
							                        </tr>
							                        <tr className="footerTR">
							                            <th className="bg-warning" colSpan="4"> DISCOUNT </th>
							                            <th className="bg-warning" colSpan="2">2%</th>
							                        </tr>
							                        <tr className="footerTR">
							                            <th className="" colSpan="4"> CGST </th>
							                            <th className="" colSpan="2"> 2.5 </th>
							                        </tr>
							                        <tr className="footerTR">
							                            <th className="" colSpan="4"> SGST </th>
							                            <th className="" colSpan="2"> 2.5 </th>
							                        </tr>
							                        <tr className="footerTR">
							                            <th className="" colSpan="4"> Grand Total </th>
							                            <th className="" colSpan="2">  </th>
							                        </tr>
				          						</tbody>
				          					</table>
				          				</div>
				          				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                            <div className="terminfo col-lg-12 col-md-12 col-sm-12 col-xs-12">NOTES</div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marbtm30 termDiv">
                                                <div>This is sample notes
                                            	</div>    	
                                            </div>
                                        </div>
				          				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                            <div className="terminfo col-lg-12 col-md-12 col-sm-12 col-xs-12">TERMS AND CONDITIONS</div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marbtm30 termDiv">
                                                <div>Terms of service are the legal agreements between a service provider and a person who wants to use that service. The person must agree to abide by the terms of service in order to use the offered service. Terms of service can also be merely a disclaimer, especially regarding the use of websites.</div>
                                            </div>
                                        </div>
			          				</div>
			          			</div>
			          		</div>
         	 			</div>
         	 		</div>
         	 	</div>
		    </section>
	     </div>
	    );
		
	} 

}

export default withRouter(BillView);

