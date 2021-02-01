import React, { Component } from 'react';
import axios from 'axios';
import _ from 'underscore';
import swal from 'sweetalert';
import $ from 'jquery';
import moment from 'moment';
import './userManagement.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/js/modal.js';
import DeletedusersTable from '../../IAssureTableUM/DeletedUsersTable.js';
import Loader from '../../common/Loader/Loader.js';
class DeletedUsers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allPosts: [],
			"twoLevelHeader": {
				apply: false,
			},
			"tableHeading": {
				fullName: 'User Details',
				companyDetails: 'Company Details',
				status: 'Status',

				roles: 'Role',
				createdAt: 'Registered Since',
				lastLogin: "Last Login",
				deletedOn: "Deleted On",
				deletedBy: "Deleted By",
				actions: 'Action',
			},
			"tableObjects": {
				paginationArray: true
			},
			"startRange": 0,
			"limitRange": 10,
			blockActive: "all",
			"listofRoles": "",
			adminRolesListData: [],
			checkedUser: [],
			activeswal: false,
			blockswal: false,
			confirmDel: false,
			unCheckedUser: false
		}
		this.handleChange = this.handleChange.bind(this);

	}
	handleChange(event) {
		event.preventDefault();
		const target = event.target;
		const name = target.name;
	}
	backtoum() {
		this.props.history.push("/umlistofusers")
	}
	componentDidMount() {
		const user_ID = localStorage.getItem("user_ID");
		var userDetails = (localStorage.getItem('userDetails'));
		var userData = JSON.parse(userDetails);
		console.log("userData = ", userData);
		const companyID = parseInt(userData.companyID);
		this.setState({
			user_ID: user_ID,
			companyID: companyID
		}, () => {
			var data = {
				"startRange": this.state.startRange,
				"limitRange": this.state.limitRange,
				"companyID": this.state.companyID
			}
			this.getData(data);

		})

	}
	getData(data) {
			axios.post('/api/users/post/deleteduser/list', data)
				.then((res) => {
					console.log("res.data in getdata==>", res.data);
					if (res.data.message == "COMPANYID_NOT_AVAILABLE") {
						swal({
							title: '',
							text: "Company Id not found.",
						});
					} else {
						var tableData = res.data.filter((data, i) => {
							return (data.status !== 'active' && data.status !== 'blocked' && data.status !== 'deleted');
						});
						var tableData = tableData.map((a, i) => {
							console.log('tableData A==>>>', a);
							return {
								_id: a._id,
								fullName: '<div class="col-lg-12 col-md-12 col-sm-6 col-xs-6 pull-left"><b>' + a.fullName + '</b>' +
									'<p><i class="fa fa-envelope"></i> ' + a.email + '&nbsp   &nbsp <br /><i class="fs16 fa fa-mobile"></i> ' + a.mobNumber + '</p>',
								companyDetails: a.companyName + ' | ' + a.companyID,
								status: a.status === "active" ? '<span class="label label-success statusLabel">' + a.status + '</span>' : '<span class="label label-default statusLabel">' + a.status + "</span>",
								roles: a.role.map((b, j) => '  <span>' + b + ' </span>').toString(),
								createdAt: moment(a.createdAt).format("DD MMM YY") + '<br/>' + moment(a.createdAt).fromNow(true),
								lastLogin: a.lastLogin === null 
									? '<p class="btn" style="font-size:13px;" title="Login Details">User not logged in yet</p>'									
									: moment(a.lastLogin).format("llll") ,
								deletedOn: a.statusupdatedAt !== "-" ? moment(a.statusupdatedAt).format("DD-MMM-YY") : "-",
								deletedBy: a.statusupdatedBy
							}
						})
						this.setState({
							completeDataCount: res.data.length,
							tableData: tableData,
						})
					}
				})
				.catch((error) => {
				});
	
	}
	// getData(data) {
	// 	axios.post('/api/users/post/list', data)
	// 		.then((res) => {
	// 			// console.log("res.data in getdata==>", res.data);
	// 			if (res.data.message == "COMPANYID_NOT_AVAILABLE") {
	// 				swal({
	// 					title: '',
	// 					text: "Company Id not found.",
	// 				});
	// 			} else {
	// 				var tableData = res.data.filter((data, i) => {
	// 					return (data.status !== 'active' && data.status !== 'blocked' && data.status !== 'deleted');
	// 				});
	// 				var tableData = tableData.map((a, i) => {
	// 					// console.log('tableData A==>>>', a.lastLogin);
	// 					return {
	// 						_id: a._id,
	// 						fullName: '<div class="col-lg-10 col-md-10 col-sm-6 col-xs-6 pull-left"><b>' + a.fullName + '</b>' +
	// 							'<p><i class="fa fa-envelope"></i> ' + a.email + '&nbsp  | &nbsp <i class="fs16 fa fa-mobile"></i> ' + a.mobNumber + '</p>',
	// 						companyDetails: a.companyName == undefined || "" ? "-" : a.companyName + ' | ' + a.companyID,
	// 						status: a.status === "active" ? '<span class="label label-success statusLabel">' + a.status + '</span>' : '<span class="label label-default statusLabel">' + a.status + "</span>",
	// 						roles: a.role.map((b, j) => '  <span>' + b + ' </span>').toString(),
	// 						createdAt: moment(a.createdAt).format("DD MMM YY") + '<br/>' + moment(a.createdAt).fromNow(true),
	// 						lastLogin: a.lastLogin === null 
	// 							? '<p class="btn" style="font-size:13px;" title="Login Details">User not logged in yet</p>'									
	// 							: moment(a.lastLogin).format("llll") ,
	// 						deletedOn: a.statusupdatedAt !== "-" ? moment(a.statusupdatedAt).format("DD-MMM-YY") : "-",
	// 						deletedBy: a.statusupdatedBy
	// 					}

	// 				})
	// 				this.setState({
	// 					completeDataCount: res.data.length,
	// 					tableData: tableData,
	// 				})
	// 			}
	// 		})
	// 		.catch((error) => {
	// 		});
	// }
	// getData() {
	// 	var data = {
	// 		"startRange": this.state.startRange,
	// 		"limitRange": this.state.limitRange,
	// 		"companyID": this.state.companyID
	// 	}
	// 	console.log("1 data before delete this.state.companyID=>", data)
	// 	if (data.companyID > 0) {
	// 		$('.fullpageloader').hide()
	// 		axios.post('/api/users/post/deleteduser/list', data)
	// 			.then((res) => {
	// 				console.log("res.data in getdata==>", res.data);
	// 				if (res.data.message == "COMPANYID_NOT_AVAILABLE") {
	// 					swal({
	// 						title: '',
	// 						text: "Company Id not found.",
	// 					});
	// 				} else {
	// 					var tableData = res.data.filter((data, i) => {
	// 						return (data.status !== 'active' && data.status !== 'blocked' && data.status !== 'deleted');
	// 					});
	// 					var tableData = tableData.map((a, i) => {
	// 						console.log('tableData A==>>>', a);
	// 						return {
	// 							_id: a._id,
	// 							// fullName: '<div class="col-lg-12 col-md-12 col-sm-6 col-xs-6 pull-left"><b>' + a.fullName + '</b>' +
	// 							// 			'<p><i class="fa fa-envelope"></i> ' + a.email + '&nbsp   &nbsp <br /><i class="fs16 fa fa-mobile"></i> ' + a.mobNumber + '</p>',
	// 							// companyDetails: a.companyName + ' | ' + a.companyID,
	// 							// status: a.status === "active" ? '<span class="label label-success statusLabel">' + a.status + '</span>' : '<span class="label label-default statusLabel">' + a.status + "</span>",
	// 							// roles: a.role.map((b, j) => '  <span>' + b + ' </span>').toString(),
	// 							// createdAt: moment(a.createdAt).format("DD MMM YY") + '<br/>' + moment(a.createdAt).fromNow(true),
	// 							// lastLogin: a.lastLogin !== "-" ? moment(a.lastLogin).format("DD-MMM-YY") : "-",
	// 							// deletedOn: a.statusupdatedAt !== "-" ? moment(a.statusupdatedAt).format("DD-MMM-YY") : "-",
	// 							// deletedBy: a.statusupdatedBy
	// 							fullName: '<div class="col-lg-10 col-md-10 col-sm-6 col-xs-6 pull-left"><b>' + a.fullName + '</b>' +
	// 							'<p><i class="fa fa-envelope"></i> ' + a.email + '&nbsp  | &nbsp <i class="fs16 fa fa-mobile"></i> ' + a.mobNumber + '</p>',
	// 							companyDetails: a.companyName == undefined || "" ? "-" : a.companyName + ' | ' + a.companyID,
	// 							status: a.status === "active" ? '<span class="label label-success statusLabel">' + a.status + '</span>' : '<span class="label label-default statusLabel">' + a.status + "</span>",
	// 							roles: a.role.map((b, j) => '  <span>' + b + ' </span>').toString(),
	// 							createdAt: moment(a.createdAt).format("DD MMM YY") + '<br/>' + moment(a.createdAt).fromNow(true),
	// 							lastLogin: a.lastLogin === null 
	// 								? '<p class="btn" style="font-size:13px;" title="Login Details">User not logged in yet</p>'									
	// 								: moment(a.lastLogin).format("llll") ,
	// 							deletedOn: a.statusupdatedAt !== "-" ? moment(a.statusupdatedAt).format("DD-MMM-YY") : "-",
	// 							deletedBy: a.statusupdatedBy
	// 						}
	// 					})
	// 					this.setState({
	// 						completeDataCount: res.data.length,
	// 						tableData: tableData,
	// 					})
	// 				}
	// 			})
	// 			.catch((error) => {
	// 			});
	// 	} else {
	// 		$('.fullpageloader').show();
	// 	}
	// }
	getSearchText(searchText, startRange, limitRange) {
		var data = {
			searchText: searchText,
			startRange: startRange,
			limitRange: limitRange
		}
		axios.post('/api/users/get/searchlist', data)
			.then((res) => {
				var tableData = res.data.filter((data, i) => {
					return (data.status !== 'deleted-active' && data.status !== 'deleted-blocked' && data.status !== 'deleted');
				});
				var tableData = tableData.map((a, i) => {
					return {
						_id: a._id,
						fullName: '<div class="col-lg-10 col-md-10 col-sm-6 col-xs-6 pull-left"><b>' + a.fullName + '</b>' +
							'<p><i class="fa fa-envelope"></i> ' + a.email + '&nbsp  | &nbsp <i class="fs16 fa fa-mobile"></i> ' + a.mobNumber + '</p>',
						companyDetails: a.companyName + ' | ' + a.companyID,
						status: a.status === "active" ? '<span class="label label-success statusLabel">' + a.status + '</span>' : '<span class="label label-default statusLabel">' + a.status + "</span>",
						roles: a.role.map((b, j) => '  <span>' + b + ' </span>').toString(),
						createdAt: moment(a.createdAt).format("DD MMM YY") + '<br/>' + moment(a.createdAt).fromNow(true),
						lastLogin: a.lastLogin !== "-" ? moment(a.lastLogin).format("DD-MMM-YY") : "-",
						deletedon: a.statusupdatedAt !== "-" ? moment(a.statusupdatedAt).format("DD-MMM-YY") : "-",
						deletedby: a.statusupdatedBy,
					}
				})
				console.log('tableData', tableData);
				this.setState({
					completeDataCount: res.data.length,
					tableData: tableData,
				})
			})
			.catch((error) => {
			})
		this.setState({
			tableData: []
		});
	}

	render() {
		var adminRolesListDataList = this.state.adminRolesListData;
		console.log("companyIDcompanyID==>>>",this.state.companyID)
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="formWrapper">
						<section className="content">
							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
								<div className="row">
									<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
										<div className="col-lg-10 col-md-10 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
											Deleted Users
                						</div>
										<div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 " id="rolemodalcl">
												<button type="button" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 addexamform userbtn clickforhideshow"
													onClick={this.backtoum.bind(this)}
													>
													<i className="fa fa-undo" aria-hidden="true"></i>
													<b>&nbsp;&nbsp; Back To UM List</b>
												</button>
											</div>
										<hr className="hr-head container-fluid row" />
									</div>
									<form className="newTemplateForm">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<DeletedusersTable
												// completeDataCount={this.state.completeDataCount}
												// twoLevelHeader={this.state.twoLevelHeader}
												getData={this.getData.bind(this)}
												companyID={this.state.companyID}
												tableHeading={this.state.tableHeading}
												tableData={this.state.tableData}
												tableObjects={this.state.tableObjects}
											// selectedUser={this.selectedUser.bind(this)}
											// setunCheckedUser={this.setunCheckedUser.bind(this)}
											// unCheckedUser={this.state.unCheckedUser}
											// DeletedUsersTable = {true}
											/>
										</div>
									</form>
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>

		);
	}

}
export default DeletedUsers;












// import React, { Component }   from 'react';
// import $                      from "jquery";
// import jQuery                 from 'jquery';
// import axios                  from 'axios';
// import moment                 from 'moment';
// // import IAssureTableUM            from '../../IAssureTableUM/IAssureTable.jsx';
// import DeletedusersTable            from '../../IAssureTableUM/DeletedUsersTable.js';
// import swal                   from 'sweetalert';
// import 'font-awesome/css/font-awesome.min.css';
// import 'bootstrap/js/modal.js';
// import './userManagement.css';

// class DeletedUsers extends Component {


//   constructor(props) {
//     super(props);
//     this.state = {
//       "tableData"         : props && props.tableData ? props.tableData : [],
//       "startRange"        : 0,
//       "limitRange"        : 10000,
//       "twoLevelHeader"    : {
//           apply           : false,
//       },
//       "tableHeading"     : {
//         fullName        : 'User Details',
//         roles           : 'Role',
//         createdAt       : 'Registered Since',
//         lastLogin       : "Last Login",
//         deletedOn       : "Deleted On",
//         deletedBy       : "Deleted By",
//         actions         : 'Action',
//       },
//       "tableObjects"    : {
//         paginationApply : false,
//       },
//       checkedUser  : [],
//       activeswal : false,
//       blockswal : false,
//       confirmDel : false,
//       unCheckedUser:false
//     };
//     this.handleChange = this.handleChange.bind(this);
//   }

//   handleChange(event) {
//     const datatype = event.target.getAttribute('data-text');
//     const { name, value } = event.target;
//     this.setState({
//       [name]: value
//     });
//   }
//   componentDidMount() {
//     var data = {
//       "startRange"        : parseInt(this.state.startRange),
//       "limitRange"        : parseInt(this.state.limitRange),
//       "companyID"         : parseInt(this.props.companyID)
//     }   
//     this.props.getuserData(this.state.startRange, this.state.limitRange)
//     this.getData(data);
//     this.setState({
//       tableData     : this.props.tableData ,         
//     })
//   }
//   componentWillReceiveProps(nextprops) {
//     var data = {
//       "startRange"        : parseInt(this.state.startRange),
//       "limitRange"        : parseInt(this.state.limitRange),
//       "companyID"         : parseInt(this.props.companyID)
//     }
//     this.getData(data);
//     this.setState({
//       tableData     : nextprops.tableData ,         
//     })
//   }
//   getData(startRange, limitRange){   
//     var data = {
//       "startRange"        : parseInt(startRange),
//       "limitRange"        : parseInt(limitRange),
//       "companyID"         : parseInt(this.props.companyID)
//     }   
//     axios.post('/api/users/post/list', data)
//       .then( (res)=>{
//         var statusArr = ['deleted-active','deleted-blocked'];
//                 var tableData=res.data.filter((data,i)=>{
//                     if(statusArr.includes(data.status))
//                         return data
//                 });
//           console.log('deleteres',tableData);
//         var tableData = tableData.map((a, i)=>{
//           return {
//             _id             : a._id,
//             fullName: '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pull-left"><b>'+a.fullName + '</b></div><div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 pull-right"><medium>' + a.companyName + ' | ' + a.companyID + '</medium></div>' + 
// 								      '<p><i class="fa fa-envelope"></i> ' + a.email + '&nbsp  | &nbsp <i class="fs16 fa fa-mobile"></i> ' + a.mobNumber+'</p>',
//             roles           : a.role.map((b,j)=> '  <span>'+b+' </span>').toString(),
//             createdAt       : moment(a.createdAt).format("DD-MMM-YY LT"),
//             lastLogin       : a.lastLogin !=="-" ? moment(a.lastLogin).format("DD-MMM-YY LT") : "-",
//             deletedOn       : a.statusupdatedAt !=="-" ? moment(a.statusupdatedAt).format("DD-MMM-YY LT") : "-",
//             deletedBy       : a.statusupdatedBy,
//           }
//         })
//         this.setState({
//           completeDataCount : res.data.length,
//           tableData     : tableData,         
//         })
//     })
//     .catch((error)=>{});
//   }

//   setunCheckedUser(value){
//     this.setState({
//       unCheckedUser : value,
//     })
//   }
//   selectedUser(checkedUsersList){
//     this.setState({
//       checkedUser : checkedUsersList,
//     },()=>{
//       console.log('checkedUser',this.state.checkedUser);
//     })
//   }
//   close(event){
//     this.setState({
//       firstname: "",
//       lastname: "",
//       signupEmail: "",
//       mobile: "",
//       role: "",
//     });
//     var modal = document.getElementById("DeletedUsersModal");
//     modal.style.display = "none";

//     $('.modal-backdrop').remove();
//     $("#userInfo").validate().resetForm();
//   }
//   render() {
//     return (
//       <div className="modal" id="DeletedUsersModal" role="dialog">
//         <div className="adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
//           <div className="modal-content adminModal-content col-lg-10 col-lg-offset-1 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
//             <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
//                 <button type="button" onClick={this.close.bind(this)} className="close " data-dismiss="modal" aria-label="Close">
//                 <span aria-hidden="true">&times;</span>
//               </button>
//               <h4 className="modal-title row deleteTitle" id="exampleModalLabel">Deleted Users</h4>
//             </div>
//             <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
//               <DeletedusersTable
//                 // completeDataCount={this.state.completeDataCount}
//                 // twoLevelHeader={this.state.twoLevelHeader}
//                 getData={this.getData.bind(this)}
//                 companyID = {this.props.companyID}
//                 tableHeading={this.state.tableHeading}
//                 tableData={this.state.tableData}
//                 // tableObjects={this.state.tableObjects}
//                 // selectedUser={this.selectedUser.bind(this)}
//                 // setunCheckedUser={this.setunCheckedUser.bind(this)}
//                 // unCheckedUser={this.state.unCheckedUser}
//                 // DeletedUsersTable = {true}
//               />     
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default DeletedUsers;
