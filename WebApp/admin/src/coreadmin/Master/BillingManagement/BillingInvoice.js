import React, { Component }       	from 'react';
import {Route, withRouter} 			from 'react-router-dom';
import swal                     	from 'sweetalert';
import axios 						from 'axios';
import $ 							from 'jquery';
import jQuery 						from 'jquery';
import moment                   from 'moment';

import 'jquery-validation';


class BillingInvoice extends Component {
	constructor(props){
		super(props);
		this.state = {
			data : [],
			// date:moment().format('DD/MM/YYYY'),
			notes:'',
			terms:'',
			companyData:"",
			expenseData:"",
			companyCGST:0,
			tripCGST:0,
			tripSGST:0,
			companySGST:0,
			tripFrom:"",
			tripTo:"",
			tripEstimatedCost:"",
			bookingId:"",
			driverName:"",
			tripDetail:"",
			tripDescription:"",
			CGST:0,
			SGST:0
		}
	}

	componentDidMount(){
		var id = this.props.match.params.id;
		axios.get('/api/bookingmaster/get/getSingleBookingListForGenerateBill/'+id)
		.then((response)=>{
			this.setState({
				tripEstimatedCost: response.data[0].estimatedCost,
				tripFrom:response.data[0].from,
				tripTo:response.data[0].to,
				tripDetail:response.data[0].from.area+'-'+response.data[0].to.city+' Trip',
				bookingId:response.data[0].bookingId,
				driverName:response.data[0].driver[0].firstName+' '+response.data[0].driver[0].lastName,
			})
			if(response.data[0].tripExpenses && response.data[0].tripExpenses.length > 0){
				var tableData = response.data[0].tripExpenses.map((a,i)=>{
					var expenseType = a.ticketName;
					var expensePrice = a.ticketPrice ;
					 axios.get('/api/expensetypemaster/getDataByType/'+expenseType)
					  .then((response)=>{
					  		this.setState({
					  			CGST:response.data[0].CGSTRate,
								SGST:response.data[0].SGSTRate,
					  		})
					  	
					  })
					  .catch((error)=>{
					    swal(error)
					  })
					  return{
								tditemType:a.ticketName,
								tditemDesc:'-',
								tditemqty:1,
								tditemCost:a.ticketPrice,
								tditemCGST:this.state.CGST,
								tditemSGST:this.state.SGST,
							}
				})
				console.log('tableData=>',tableData)
			}
		})
		.catch((err)=>{swal(err)})

		//get company details
		axios.post('/api/entitymaster/get/getAdminCompany')
	    .then((res)=>{
	      this.setState({'companyData':res.data[0]})
	    })
	    .catch((err)=>{swal(err)})

	    //get expense type details
		axios.get('/api/expensetypemaster/showAllData')
	    .then((res)=>{
	      this.setState({'expenseData':res.data})
	    })
	    .catch((err)=>{swal(err)})

	    //get tax details
	    axios.get('/api/globalmaster/TaxData/CGST')
	    .then((response)=>{
	      this.setState({companyCGST:response.data[0].taxRating})
	    })
	    .catch((error)=>{
	      swal(error)
	    })

	    axios.get('/api/globalmaster/TaxData/SGST')
	    .then((response)=>{
	      this.setState({companySGST:response.data[0].taxRating})
	    })
	    .catch((error)=>{
	      swal(error)
	    })

	}

	handleChange(event) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: event.target.value
        });   
    }

    typehandleChange(index,event){
    	console.log('id:',index)
    	this.setState({
    		['itemType'+index] : event.target.value,
    	})
    	axios.get('/api/expensetypemaster/getDataByType/'+event.target.value)
		  .then((response)=>{
		  		this.setState({
		  			['itemCGST'+index]:response.data[0].CGSTRate,
					['itemSGST'+index]:response.data[0].SGSTRate,
		  		})
		  	
		  })
		  .catch((error)=>{
		    swal(error)
		  })
    }

	addNew(event){
		event.preventDefault();
		let { data } = this.state;
	    data.push(data.length); // data.length is one more than actual length since array starts from 0.
	    // Every time you call append row it adds new element to this array. 
	    // You can also add objects here and use that to create row if you want.
	    this.setState({data});
	}

	removeRow(event){
		event.preventDefault();
		var value = $(event.currentTarget).closest('tr')
		swal({
          title: "Are you sure you want to delete this row?",
          text: "Once deleted, you will not be able to recover this row!",
          buttons: true,
          dangerMode: true,
        })
        .then((success) => {
          if (success) {
            value.remove()
          } else {
	        }
	      });
		
	}

	saveBill(event){
		event.preventDefault();
		this.props.history.push('/view-bill')
	}

  
	render() {
		const Row = ({ id }) => (
		  <tr>
			<td>
				<select onChange={this.typehandleChange.bind(this,id)} id={"itemType"+id} name={"itemType"+id} value={this.state[`itemType${id}`]} className="col-lg-12 col-md-12 col-sm-12 col-xs-12  noPadding  form-control">
					<option disabled selected>Select Type</option>
					{this.state.expenseData && this.state.expenseData.length > 0 ?
						this.state.expenseData.map((data,index)=>{
							return(
								<option key={index}>{data.type}</option>
								)
						})
						:
						null
					}
					
				</select>
			</td>
			<td><textarea type="text" className="form-control tdtextboxstyle" name={"itemDescription"+id} id={"itemDescription"+id} value={this.state[`itemDescription${id}`]} onChange={this.handleChange.bind(this)} /></td>
			<td><input autoComplete="off" className="input form-control tdtextboxstyle" name={"quantity"+id} type="number"  id={"quantity"+id} value={this.state[`quantity${id}`]} onChange={this.handleChange.bind(this)} required /></td>
			<td><input autoComplete="off" className="input form-control tdtextboxstyle" name={"unitCost"+id} type="number"  id={"unitCost"+id} value={this.state[`unitCost${id}`]} onChange={this.handleChange.bind(this)} required /></td>
			<td>{this.state[`itemCGST${id}`]}</td>
			<td>{this.state[`itemSGST${id}`]}</td>
			<td></td>
			<td><i className="fa fa-remove deleteTableRow" aria-hidden="true" onClick={this.removeRow.bind(this)}></i></td>
		  </tr>
		);
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
			          			<div className="col-lg-12">
			          			<div className="col-lg-10">
			          			<ul className="col-lg-12 col-md-12">
			          				<li className="companyNameFontStyle"><strong>{this.state.companyData.companyName}</strong></li>
			          				<li><b>Address</b></li>
			          				<li><i className="fa fa-envelope" aria-hidden="true"></i> {this.state.companyData.companyEmail} || <i className="fa fa-phone" aria-hidden="true"></i> {this.state.companyData.companyPhone}</li>
			          				<li>PAN:HGJ123490</li>
			          				<li>GST: AUYYUI1234</li>
			          			</ul>
			          			</div>
			          			<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 ImgBox" style={{ "backgroundImage": `url(` + (this.state.companyData.companyLogo ? this.state.companyData.companyLogo : "/images/logonotfound.jpg") + `)` }}></div>
			          			</div>
			          			<div className="col-lg-12 col-md-12 hiddenDiv"></div>
			          			<div className="col-lg-12">
			          			<div className="col-lg-10">
			          				<div className="col-lg-6 col-md-6 billTo"><b>BILL TO</b></div>
			          				<ul className="col-lg-12 col-md-12">
				          				<li className="companyNameFontStyle"><strong>To Company Name</strong></li>
				          				<li><b>Address</b></li>
				          				<li> <i className="fa fa-envelope" aria-hidden="true"></i> email || <i className="fa fa-phone" aria-hidden="true"></i> phone</li>
				          				<li>PAN:HGJ123490</li>
				          				<li>GST: AUYYUI1234</li>
				          			</ul>
			          			</div>
			          			{/*<div className="col-lg-6">
			          				<div className="pull-right">
			          				<span className="col-lg-12">Invoice# : 1234</span>
			          				<span className="col-lg-12">Date :{this.state.date}</span>
			          				</div>
			          			</div>*/}
			          			</div>
			          			<div className="col-lg-12">
			          				<button className="btn btn-primary pull-right btn-sm" onClick={this.addNew.bind(this)}>Add New Line</button>
			          				<div className="col-lg-12 marginStyle">
			          					<div className="table-responsive">
				          					<table className="table table-bordered">
				          						<thead>
				                            <tr className="tableHeadingStyle">
		              							<td><strong>Item Type</strong></td>
		              							<td><strong>Description</strong></td>
		              							<td><strong>Quantity</strong></td>
		              							<td><strong>Unit Cost(Rs)</strong></td>
		              							<td><strong>CGST</strong></td>
		              							<td><strong>SGST</strong></td>
		              							<td><strong>Line Total(Rs)</strong></td>
		              							<td><strong>Action</strong></td>
				                            </tr>
				          						</thead>
				          						<tbody className="tableBody" id="tableBody">
				          							<tr>
				          							<td><textarea className="form-control tdtextboxstyle" onChange={this.handleChange.bind(this)} name="tripDetail" type="text" value={this.state.tripDetail} id="tripDetail" required /></td>
				          							<td>
				          							<div className="editable" contentEditable="true">
												        <ul className="nopadding">
												            <li onChange={this.handleChange.bind(this)} name="bookingId" id="bookingId">Trip ID# :{this.state.bookingId}</li>
												        	<li>Sedan car</li>
												        	<li>White Honda City</li>
												        	<li>MH-12-DE-1234</li>
												        	<li onChange={this.handleChange.bind(this)} name="driverName" id="driverName">Driver:{this.state.driverName}</li>
												        </ul>
												    </div>
				          							</td>
				          							<td><input autoComplete="off" className="input form-control tdtextboxstyle" name="quantity" type="number"  id="quantity" required />175KM</td>
				          							<td><input autoComplete="off" className="input form-control tdtextboxstyle" name="tripEstimatedCost" type="number"  id="tripEstimatedCost" onChange={this.handleChange.bind(this)} value={this.state.tripEstimatedCost} required /></td>
				          							<td><input autoComplete="off" className="input form-control tdtextboxstyle" name="tripCGST" type="number"  id="tripCGST" onChange={this.handleChange.bind(this)} value={this.state.tripCGST} /></td>
				          							<td><input autoComplete="off" className="input form-control tdtextboxstyle" name="tripSGST" type="number"  id="tripSGST" onChange={this.handleChange.bind(this)} value={this.state.tripSGST} /></td>
				          							<td>1650</td>
				          							<td><i className="fa fa-remove deleteTableRow" aria-hidden="true" onClick={this.removeRow.bind(this)}></i></td>
				          							</tr>
				          							{this.state.data && this.state.data.length > 0 ?
				          								this.state.data.map((index,id) => (
											            <Row key={index} id = {id} />
											        	))
											        	:
											        	null
											        }
											        <tr className="footerTR borderTop">
							                            <th className="" colSpan="6"> SUB TOTAL </th>
							                            <th className="" colSpan="2">  </th>
							                        </tr>
							                        <tr className="footerTR">
							                            <th className="bg-warning" colSpan="6"> DISCOUNT </th>
							                            <th className="bg-warning"> <input autoComplete="off" className="tdtextboxstyle" name="discount" type="number"  id="discount" /> </th>
							                            <th className="bg-warning"><i className="fa fa-remove deleteTableRow" aria-hidden="true" onClick={this.removeRow.bind(this)}></i>  </th>
							                        </tr>
							                        <tr className="footerTR">
							                            <th className="" colSpan="6"> CGST ({this.state.companyCGST}%)</th>
							                            <th className="" colSpan="2">  </th>
							                        </tr>
							                        <tr className="footerTR">
							                            <th className="" colSpan="6"> SGST ({this.state.companySGST}%)</th>
							                            <th className="" colSpan="2">  </th>
							                        </tr>
							                        <tr className="footerTR">
							                            <th className="" colSpan="6"> Grand Total </th>
							                            <th className="" colSpan="2">  </th>
							                        </tr>
				          						</tbody>
				          					</table>
				          				</div>
				          				<div className="col-lg-12 col-md-12 nopadding">
				          					<div className="form-group valid_box col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
								                <div className="form-group">
								                  <label className="labelform" >Notes</label>
								                  <textarea onChange={this.handleChange} 
								                    type="text" name="notes" id="notes"
								                    placeholder="Please enter your notes if any"
								                    className="form-control" value={this.state.notes}></textarea>
								                  
								                </div>  
								              </div>
				          				</div>
				          				<div className="col-lg-12 col-md-12 nopadding">
				          					<div className="form-group valid_box col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadding">
								                <div className="form-group">
								                  <label className="labelform" >Terms & Conditions</label>
								                  <textarea onChange={this.handleChange} 
								                    type="text" name="terms" id="terms"
								                    placeholder="Please enter Terms & Conditions if any"
								                    className="form-control" value={this.state.terms}></textarea>
								                  
								                </div>  
								              </div>
				          				</div>
			          				</div>
			          			</div>
			          			<div className="col-lg-12 col-md-12 reportWrapper">
			          				<button className="col-lg-2 pull-right btn btn-primary" onClick={this.saveBill.bind(this)}>Save Bill</button>
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

export default withRouter(BillingInvoice);

