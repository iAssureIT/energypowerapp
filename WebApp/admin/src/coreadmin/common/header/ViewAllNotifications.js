import React, { Component }       	from 'react';
import {Route, withRouter} 			from 'react-router-dom';
import $ 							from 'jquery';
import jQuery 						from 'jquery';
import axios from 'axios';
import swal                     	from 'sweetalert';


class ViewAllNotifications extends Component {
	constructor(props){
		super(props);
		this.state = {
			inAppNotifications:[],	
		}
	}


  componentDidMount() {
    const user_ID = localStorage.getItem("user_ID");
    axios.get('/api/notifications/get/allList/'+user_ID)
      .then(notifications => {
        this.setState({ 
          inAppNotifications: notifications.data ,
        })
      })
      .catch(error => {
      })
  }

  delete(event){
  	event.preventDefault();
		var id = event.target.id;
		axios.delete('/api/notifications/delete/'+id)
		.then((response)=> {
			 const user_ID = localStorage.getItem("user_ID");
			    axios.get('/api/notifications/get/allList/'+user_ID)
			      .then(notifications => {
			        this.setState({ 
			          inAppNotifications: notifications.data ,
			        })
			      })
			      .catch(error => {
			      })
	    	swal({
				title: "Deleted successfully",
			});
		}).catch((error)=> {
		});
  }

	
	render() {
		
		return (
         <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
         	 <section className="Content">
         	 	<div className="row">
         	 		<div className="col-md-12">
         	 			<div className="invoiceWrapper">
         	 				<div className="box-header with-border invoice-title">
			          			<h4 className="invoiceTitle">Notification List</h4>
			          		</div>
			          		<div className="box-body">
			          			<div className="col-lg-12">
			          				
			          				<div className="col-lg-12 marginStyle">
			          					<div className="table-responsive col-lg-12 col-md-12">
				          					<table className="table table-bordered table-striped">
				          						<thead>
					                            <tr style={{"background":"#eee"}}>
			              							<td className="textCenter"><strong> Notification </strong></td>
			              							<td className="textCenter"><strong> Status </strong></td>
			              							<td className="textCenter"><strong>Action</strong></td>
					                            </tr>
				          						</thead>
				          						<tbody className="tableBody" id="tableBody">
				          							{this.state.inAppNotifications && this.state.inAppNotifications.length > 0 ?
				          								this.state.inAppNotifications.map((data,index)=>{
				          									return(
				          										<tr key={index}>
				          										<td dangerouslySetInnerHTML={{ __html: data.notifBody }} />
				          										<td>{data.status}</td>
				          										<td className="textCenter"><i className="fa fa-trash btn btn-sm btn-danger" aria-hidden="true" id={data._id} data-toggle="modal" data-target={`#${data._id}-rm`} ></i>
				          											<div className="modal col-lg-12 col-md-12 col-sm-12 col-xs-12" id={`${data._id}-rm`}  role="dialog">
													                    <div className=" modal-dialog adminModal adminModal-dialog">
													                         <div className="modal-content adminModal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
													                                <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
																		        		<h4 className="CreateTempModal col-lg-11 col-md-11 col-sm-11 col-xs-11" id="exampleModalLabel"></h4>
																		        		<div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
																					        <button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
																					          <span aria-hidden="true">&times;</span>
																					        </button>
																				        </div>
																		      		</div>
													                              <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">

													                                 <h4 className="blackFont textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 examDeleteFont">Are you sure you want to delete this?</h4>
													                              </div>
													                              
													                              <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
													                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
													                                        <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
													                                   </div>
													                                   <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
													                                        <button id={data._id} onClick={this.delete.bind(this)} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
													                                   </div>
													                              </div>
													                         </div>
													                    </div>
													               </div>
				          										</td>
				          										</tr>
				          									)
				          								})
				          							:
				          							<tr><td colSpan="3" className="textAlignCenter">No Data Found</td></tr>
				          							}
				          						</tbody>
				          					</table>
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

export default withRouter(ViewAllNotifications);

