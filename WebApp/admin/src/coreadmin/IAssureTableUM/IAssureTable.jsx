import React, { Component } from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import $ from 'jquery';
import jQuery from 'jquery';
import 'jquery-validation';
import './IAssureTable.css';
import moment from 'moment';
import { Route, withRouter } from 'react-router-dom';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

var sum = 0;
class IAssureTableUM extends Component {
	constructor(props) {
		super(props);
		this.state = {
			"tableData": props && props.tableData ? props.tableData : [],
			"DropDownfilter": props && props.DropDownfilter ? props.DropDownfilter : {},
			"tableName": props && props.tableName ? props.tableName : "User Management Table",
			"tableHeading": props && props.tableHeading ? props.tableHeading : {},
			"twoLevelHeader": props && props.twoLevelHeader ? props.twoLevelHeader : {},
			"reA": /[^a-zA-Z]/g,
			"reN": /[^0-9]/g,
			"sort": true,
			"examMasterData2": '',
			"activeClass": 'activeQueDataCircle',
			"paginationArray": [],
			"startRange": 0,
			"limitRange": 10,
			"activeClass": 'activeQueDataCircle',
			"completeDataCount": props && props.completeDataCount ? props.completeDataCount : 0,
			"normalData": true,
			"resetPassword": "",
			"resetPasswordConfirm": "",
			
			"tableObjects": {
				paginationApply: true
			},
			show: true,
			selectedUser: [],
			allid: null,
		}
		this.handleChange = this.handleChange.bind(this);
		this.showUserDetails = this.showUserDetails.bind(this);
		this.doubleclickonname = this.doubleclickonname.bind(this);
		this.doubleclickonCompany = this.doubleclickonCompany.bind(this);
		
	}
	componentDidMount() {
		$("html,body").scrollTop(0);
		window.showUserDetails = this.showUserDetails;
		window.doubleclickonname = this.doubleclickonname;
		window.doubleclickonCompany = this.doubleclickonCompany;
		console.log("this.props.tableHeading==>", this.props.tableHeading);
		this.setState({
			tableHeading: this.props.tableHeading,
			tableData: this.props.tableData,
			completeDataCount: this.props.completeDataCount
		})
		const user_ID = localStorage.getItem("user_ID");
		
		this.setState({
			user_ID: user_ID,
			"limitRange": this.state.limitRange,
		}, () => {
			var user_ID = this.state.user_ID
			axios.get('/api/users/get/' + user_ID)
				.then((res) => {
					this.setState({
						username: res.data.firstname + " " + res.data.lastname
					})
				})
				.catch((error) => {
				});
		})
	}
	componentWillReceiveProps(nextProps) {

		if (nextProps) {
			this.setState({
				tableData: nextProps.tableData,
				DropDownfilter: nextProps.DropDownfilter,
				completeDataCount: nextProps.completeDataCount,
			}, () => {
				this.paginationFunction();
				// console.log("DropDownfilter",nextProps.DropDownfilter);
				if (nextProps.unCheckedUser && this.state.tableData) {
					$('.allSelector').prop('checked', false);
					this.state.tableData.map((a, i) => {
						this.setState({
							[a._id]: false,
							allid: []
						}, () => {
							this.props.setunCheckedUser(false)
						})
					});
				}
			})
		}
	}

	componentWillUnmount() {
		window.showUserDetails = null;
		window.doubleclickonname = null;
		window.doubleclickonCompany = null;
		$("script[src='/js/adminSide.js']").remove();
		$("link[href='/css/dashboard.css']").remove();
	}
	edit(e) {
		e.preventDefault();
		$("html,body").scrollTop(0);
		this.setState({ 'edit': true });
	}
	sort(event) {
		event.preventDefault();
		var key = event.target.getAttribute('id');
		var nameA = '';
		var nameB = '';
		var tableData = this.state.tableData;
		if (this.state.sort === true) {
			if (key === 'number') {
				var reA = /[^a-zA-Z]/g;
				var reN = /[^0-9]/g;
				var aN = 0;
				var bN = 0;
				var sortedData = tableData.sort((a, b) => {
					Object.entries(a).map(
						([key1, value1], i) => {
							if (key === key1) {
								nameA = value1.replace(reA, "");
							}
						}
					);
					Object.entries(b).map(
						([key2, value2], i) => {
							if (key === key2) {
								nameB = value2.replace(reA, "");
							}
						}
					);

					if (nameA === nameB) {
						Object.entries(a).map(
							([key1, value1], i) => {
								if (key === key1) {
									aN = parseInt(value1.replace(reN, ""), 10);
								}
							}
						);

						Object.entries(b).map(
							([key1, value1], i) => {
								if (key === key1) {
									bN = parseInt(value1.replace(reN, ""), 10);
								}
							}
						);

						if (aN < bN) {
							return -1;
						}
						if (aN > bN) {
							return 1;
						}
						return 0;

					} else {

						if (nameA < nameB) {
							return -1;
						}
						if (nameA > nameB) {
							return 1;
						}
						return 0;
					}
				});
			} else {
				var sortedData = tableData.sort((a, b) => {
					Object.entries(a).map(
						([key1, value1], i) => {
							if (key === key1) {
								if (jQuery.type(value1) === 'string') {
									nameA = value1.toUpperCase();
								} else {
									nameA = value1;
								}
							}
						}
					);
					Object.entries(b).map(
						([key2, value2], i) => {
							if (key === key2) {
								if (jQuery.type(value2) === 'string') {
									nameB = value2.toUpperCase();
								} else {
									nameB = value2;
								}
							}
						}
					);

					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					return 0;
				});
			}
			this.setState({
				tableData: sortedData,
				sort: false
			});
		} else if (this.state.sort === false) {
			if (key === 'number') {
				var reA = /[^a-zA-Z]/g;
				var reN = /[^0-9]/g;
				var aN = 0;
				var bN = 0;
				var sortedData = tableData.sort((a, b) => {
					Object.entries(a).map(
						([key1, value1], i) => {
							if (key === key1) {
								nameA = value1.replace(reA, "");
							}
						}
					);
					Object.entries(b).map(
						([key2, value2], i) => {
							if (key === key2) {
								nameB = value2.replace(reA, "");
							}
						}
					);

					if (nameA === nameB) {
						Object.entries(a).map(
							([key1, value1], i) => {
								if (key === key1) {
									aN = parseInt(value1.replace(reN, ""), 10);
								}
							}
						);

						Object.entries(b).map(
							([key1, value1], i) => {
								if (key === key1) {
									bN = parseInt(value1.replace(reN, ""), 10);
								}
							}
						);

						if (aN > bN) {
							return -1;
						}
						if (aN < bN) {
							return 1;
						}
						return 0;

					} else {

						if (nameA > nameB) {
							return -1;
						}
						if (nameA < nameB) {
							return 1;
						}
						return 0;
					}
				});
			} else {
				var sortedData = tableData.sort((a, b) => {
					Object.entries(a).map(
						([key1, value1], i) => {
							if (key === key1) {
								if (jQuery.type(value1) === 'string') {
									nameA = value1.toUpperCase();
								} else {
									nameA = value1;
								}
							}
						}
					);
					Object.entries(b).map(
						([key2, value2], i) => {
							if (key === key2) {
								if (jQuery.type(value2) === 'string') {
									nameB = value2.toUpperCase();
								} else {
									nameB = value2;
								}
							}
						}
					);

					if (nameA > nameB) {
						return -1;
					}
					if (nameA < nameB) {
						return 1;
					}
					return 0;
				});
			}
			this.setState({
				tableData: sortedData,
				sort: true
			});
		}
	}
	paginationFunction(event) {
		var dataLen = this.state.completeDataCount > 20 || this.state.completeDataCount === 20 ? 20 : this.state.completeDataCount;
		var dataLength = this.state.completeDataCount;
		this.setState({
			dataLength: dataLen,
		}, () => {
			const maxRowsPerPage = this.state.limitRange;
			var paginationNum = dataLength / maxRowsPerPage;
			var pageCount = Math.ceil(paginationNum) > 20 ? 20 : Math.ceil(paginationNum);

			var paginationArray = [];
			for (var i = 1; i <= pageCount; i++) {
				var countNum = maxRowsPerPage * i;
				var startRange = countNum - maxRowsPerPage;
				if (i === 1) {
					var activeClass = 'activeQueDataCircle';
				} else {
					activeClass = '';
				}
				paginationArray.push(
					<li key={i} className={"queDataCircle page-link " + activeClass + " parseIntagination" + i} id={countNum + '|' + startRange} onClick={this.getQuestionStartEndNum.bind(this)} title={"Click to jump on " + i + " page"}>{i}</li>
				);
			}
			if (pageCount >= 1) {
				this.setState({
					paginationArray: paginationArray,
				}, () => {
				});
			}
			return paginationArray;
		});
	}
	getQuestionStartEndNum(event) {
		var limitRange = $(event.target).attr('id').split('|')[0];
		var limitRange2 = parseInt(limitRange);
		var startRange = parseInt($(event.target).attr('id').split('|')[1]);
		var data = {
			"startRange": this.state.startRange,
			"limitRange": this.state.limitRange,
			"companyID": this.props.companyID
		}
		this.props.getData(data)
		this.setState({
			startRange: startRange,
		});
		$('li').removeClass('activeQueDataCircle');
		if (limitRange2) {
			$(event.target).addClass('activeQueDataCircle');
		}
		var counter = $(event.target).text();
	}
	setLimit(event) {
		event.preventDefault();
			var limitRange = parseInt(this.refs.limitRange.value);
		this.props.Range(limitRange);
		this.setState({
				limitRange :limitRange
			})
		// var startRange = 0;
		// if (this.refs.limitRange.value === 'All') {
		// 	var limitRange = '';
		// } else {
		// }
		// console.log("this.props.limitRange==>",this.state.limitRange)
				// var data = {
				// 	"startRange": this.state.startRange,
				// 	"limitRange": parseInt(this.refs.limitRange.value),
				// 	"companyID": parseInt(this.props.companyID)
				// }
		// 	console.log("this.props.limitRange==>",data);

				// this.props.getData(data);
		// console.log("this.limitRange==>",limitRange)
		/*this.setState({
			"limitRange": limitRange,
		   }, () => {
			
			console.log("this.props.limitRange==>",this.state.limitRange)
				var data = {
					"startRange": this.state.startRange,
					"limitRange": parseInt(this.state.limitRange),
					"companyID": parseInt(this.props.companyID)
				}
			console.log("this.props.limitRange==>",data);

				this.props.getData(data);
		
		});*/
	}
	tableSearch() {
		var searchTextTable = this.refs.tableSearch.value.trim();
				
		var startRange = this.state.startRange;
		var limitRange = this.state.limitRange;
		
		this.props.getSearchText(searchTextTable,startRange,limitRange);

		console.log("searchText",searchTextTable,startRange,limitRange);
		if (this.props.getSearchText()) {

		this.props.getSearchText(searchTextTable,startRange,limitRange);
		}else{
			/*if (searchTextTable && searchTextTable.length !== 0) {
				var data = {
					searchText: searchTextTable,
					startRange: this.state.startRange,
					limitRange: this.state.limitRange,
					companyID: this.props.companyID
				}
				console.log("data",data);

				axios.post('/api/users/get/searchfilterwise', data)
					.then((res) => {
						console.log("Res in searchtext==>", res.data);
						var tableData = res.data.map((a, i) => {
							return {
								_id: a._id,
								fullName: '<div class="col-lg-10 col-md-10 col-sm-6 col-xs-6 pull-left"><b ondblclick=window.doubleclickonname("' + a._id +'")> ' + a.fullName + '</b>' +
									'<p><i class="fa fa-envelope"></i> ' + a.email + '&nbsp  | &nbsp <i class="fs16 fa fa-mobile"></i> ' + a.mobNumber + '</p>',
								companyDetails: a.companyName == undefined || "" ? "-" : '<a ondblclick=window.doubleclickonCompany("' + a.companyID +'")> ' + a.companyName  + '</a>'+ ' | ' + a.companyID,
								
								status: a.status === "active" ? '<span class="label label-success statusLabel">' + a.status + '</span>' : '<span class="label label-default statusLabel">' + a.status + "</span>",

								roles: a.role.map((b, j) => '  <span>' + b + ' </span>').toString(),
								createdAt: moment(a.createdAt).format("DD MMM YY") + '<br/>' + moment(a.createdAt).fromNow(),
								lastLogin: a.lastLogin === null
											?
											'<p style="font-size:13px;" title="Login Details">User not logged in yet</p>'
											:
											// moment(a.lastLogin).format("llll") + '<br/><div class="btn btn-link" data-toggle="modal"  onclick=window.showUserDetails("' + a._id + '") data-target=#userDetails-' + a._id + ' title="Login Details">User Login Details</div>'
											moment(a.lastLogin).format("ddd, MMM DD, YY HH:mm") + '<br/><div class="btn btn-link" data-toggle="modal"  onclick=window.showUserDetails("' + a._id + '") data-target=#userDetails-' + a._id + ' title="Login Details">User Login Details</div>'
							}
						})
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
			} else {
				this.setState({
					tableHeading: this.props.tableHeading,
					tableData: this.props.tableData,
					completeDataCount: this.props.completeDataCount
				})
			}*/
		}
		
	}

	showNextPaginationButtons() {

		var beforeDataLength = this.state.dataLength > 0 ? this.state.dataLength : 20;
		if (beforeDataLength !== this.state.completeDataCount) {
			this.setState({
				dataLength: (beforeDataLength + 20) > this.state.completeDataCount ? this.state.completeDataCount : (beforeDataLength + 20),
			}, () => {
				$('li').removeClass('activeQueDataCircle');
				$(".queDataCircle:first").addClass('activeQueDataCircle');
				const maxRowsPerPage = this.state.limitRange;
				var dataLength = this.state.dataLength;
				var paginationNum = parseInt(dataLength) / maxRowsPerPage;
				var pageCount = Math.ceil(paginationNum);

				var paginationArray = [];

				for (var i = beforeDataLength + 1; i <= pageCount; i++) {
					var countNum = maxRowsPerPage * i;
					var startRange = countNum - maxRowsPerPage;
					if (i === beforeDataLength + 1) {
						var activeClass = 'activeQueDataCircle';
					} else {
						activeClass = '';
					}
					paginationArray.push(
						<li key={i} className={"queDataCircle page-link " + activeClass + " parseIntagination" + i} id={countNum + '|' + startRange} onClick={this.getQuestionStartEndNum.bind(this)} title={"Click to jump on " + i + " page"}>{i}</li>
					);
				}
				if (pageCount >= 1) {
					this.setState({
						paginationArray: paginationArray,
					});
				}
				return paginationArray;
			});
		}
	}
	showPreviousPaginationButtons() {
		var beforeDataLength = this.state.dataLength;
		this.setState({
			dataLength: beforeDataLength > 20 ? beforeDataLength - this.state.paginationArray.length : 0,
		}, () => {
			$('li').removeClass('activeQueDataCircle');
			$(".queDataCircle:first").addClass('activeQueDataCircle');
			const maxRowsPerPage = this.state.limitRange;
			var dataLength = this.state.dataLength;
			var paginationNum = parseInt(dataLength) / maxRowsPerPage;
			if (dataLength !== 0 && paginationNum !== 0) {
				var pageCount = Math.ceil(paginationNum);
				var paginationArray = [];
				var forLoop = (beforeDataLength - this.state.paginationArray.length) < 0 ? 1 : beforeDataLength - this.state.paginationArray.length;
				for (var i = forLoop - 19; i <= pageCount; i++) {
					var countNum = maxRowsPerPage * i;
					var startRange = countNum - maxRowsPerPage;
					if (i === beforeDataLength - 39 || i === 1) {
						var activeClass = 'activeQueDataCircle';
					} else {
						activeClass = '';
					}
					paginationArray.push(
						<li key={i} className={"queDataCircle page-link " + activeClass + " parseIntagination" + i} id={countNum + '|' + startRange} onClick={this.getQuestionStartEndNum.bind(this)} title={"Click to jump on " + i + " page"}>{i}</li>
					);
				}
				if (pageCount >= 1) {
					this.setState({
						paginationArray: paginationArray,
					});
				}
				return paginationArray;
			}
		});
	}
	showFirstTweentyButtons() {
		var beforeDataLength = this.state.completeDataCount;

		this.setState({
			dataLength: 20,
		}, () => {
			$('li').removeClass('activeQueDataCircle');
			$(".queDataCircle:first").addClass('activeQueDataCircle');
			const maxRowsPerPage = this.state.limitRange;
			var dataLength = this.state.dataLength;
			var paginationNum = parseInt(dataLength) / maxRowsPerPage;
			if (dataLength !== 0 && paginationNum !== 0) {
				var pageCount = Math.ceil(paginationNum);
				var paginationArray = [];

				for (var i = 1; i <= pageCount; i++) {
					var countNum = maxRowsPerPage * i;
					var startRange = countNum - maxRowsPerPage;
					if (i === 1) {
						var activeClass = 'activeQueDataCircle';
					} else {
						activeClass = '';
					}
					paginationArray.push(
						<li key={i} className={"queDataCircle page-link " + activeClass + " parseIntagination" + i} id={countNum + '|' + startRange} onClick={this.getQuestionStartEndNum.bind(this)} title={"Click to jump on " + i + " page"}>{i}</li>
					);
				}
				if (pageCount >= 1) {
					this.setState({
						paginationArray: paginationArray,
					});
				}
				return paginationArray;
			}
		});
	}
	showLastTweentyButtons() {
		var beforeDataLength = this.state.dataLength;

		this.setState({
			dataLength: this.state.completeDataCount,
		}, () => {
			$('li').removeClass('activeQueDataCircle');
			$(".queDataCircle:first").addClass('activeQueDataCircle');
			const maxRowsPerPage = this.state.limitRange;
			var dataLength = this.state.dataLength;
			var paginationNum = parseInt(dataLength) / maxRowsPerPage;
			if (dataLength !== 0 && paginationNum !== 0) {
				var pageCount = Math.ceil(paginationNum);
				var paginationArray = [];

				for (var i = (this.state.completeDataCount - 20) + 1; i <= pageCount; i++) {
					var countNum = maxRowsPerPage * i;
					var startRange = countNum - maxRowsPerPage;
					if (i === 1 || i === (this.state.completeDataCount - 20) + 1) {
						var activeClass = 'activeQueDataCircle';
					} else {
						activeClass = '';
					}
					paginationArray.push(
						<li key={i} className={"queDataCircle page-link " + activeClass + " parseIntagination" + i} id={countNum + '|' + startRange} onClick={this.getQuestionStartEndNum.bind(this)} title={"Click to jump on " + i + " page"}>{i}</li>
					);
				}
				if (pageCount >= 1) {
					this.setState({
						paginationArray: paginationArray,
					});
				}

				return paginationArray;
			}
		});
	}
	changepassword(event) {
		event.preventDefault();
		var id = event.currentTarget.id;
		var password = this.state["resetPassword" + id];
		var conPassword = this.state["resetPasswordConfirm" + id];
		var formValues = {
			"pwd": conPassword,
		}
		console.log('password', password, 'conPassword', conPassword);
		var newID = $(event.currentTarget).attr('data-email');
		if (newID) {
			var resetPassword = newID;
		}
		console.log('valid');
		if (password && conPassword) {
			if (password === conPassword) {
				if (password.length >= 6) {
				axios.patch('/api/auth/patch/change_password_withoutotp/id/' + id, formValues)
					.then((res) => {
						axios.get('/api/users/get/' + id)
						.then((res) => {
							swal({
								title: " ",
								text: res.data.firstname+"'s"+" password has been changed successfully!!",
							}).then((success) => {
								if (success) {
									 window.location.reload();
								}
							})
							var modalid = "RestpwdModal-" + id;
							var modal = document.getElementById(modalid);
							modal.style.display = "none";
							$('.modal-backdrop').remove();
						})
						.catch((error) => {});
					
					})
					.catch((error) => {
						swal({
							title: "",
							text: "Sorry! Something went wrong",
						});
						var modalid = "RestpwdModal-" + id;
						var modal = document.getElementById(modalid);
						modal.style.display = "none";
						$('.modal-backdrop').remove();

					});
				} else {
					swal(" ", "Password should be at least 6 characters long");
				}
			} else {

				swal({
					title: " ",
					text: "Passwords don't match",
				});
			}
		} else {
			this.setState({
				["resetPassword" + id + "Error"]: "This field is required.",
				["resetPasswordConfirm" + id + "Error"]: "This field is required.",
			})
		}

	}
	handleChange(event) {
		const target = event.target.value;
		const name = event.target.name;
		this.setState({
			[name]: target
		}, () => {
		})
	}
	showSignPass() {
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('.eye').attr('type', 'text');
	}
	hideSignPass() {
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('.eye').attr('type', 'password');
	}
	showSignPassC() {
		$('.showPwdC').toggleClass('showPwd1C');
		$('.hidePwdC').toggleClass('hidePwd1C');
		return $('.eye').attr('type', 'text');
	}
	hideSignPassC() {
		$('.showPwdC').toggleClass('showPwd1C');
		$('.hidePwdC').toggleClass('hidePwd1C');
		return $('.eye').attr('type', 'password');
	}
	showprofile(id,getrole) {
		console.log("type in getrole===>",getrole.replace( /(<([^>]+)>)/ig, ''));
		var userID = id
		if (getrole.replace( /(<([^>]+)>)/ig, '') === 'admin') {
			this.props.history.push("/editadminprofile/"+userID)
		}else{
			axios.get("/api/personmaster/get/details/" +userID)
				.then((response) => {					
					console.log("type in response===>",response.data);
					var type = response.data[0].type;
					var entityType =response.data[0].entityType;
					if(entityType == "vendor") {
						if (type == "driver") {
							this.props.history.push("/vendor/driver/master/" + response.data[0]._id)
						}else{
							this.props.history.push("/vendor/employee/master/" + response.data[0]._id)
						}
					}else {
						this.props.history.push("/"+type+"/users/" + response.data[0]._id)
					}
					// this.props.history.push("/"+type+"/master/" + response.data[0]._id)
				})
				.catch((error) => {
				})
		}
		// this.props.history.push('/edituserprofile/' + e.currentTarget.id);
		// this.props.history.push("/driver/master/" + id)
	}
	checkAll(event) {
		if (event.target.checked) {
			let allid = this.state.tableData.map((a, i) => {
				this.setState({
					[a._id]: true,
				})
				return a._id;
			});
			this.setState({
				allid: allid
			}, () => {
				console.log('allid', this.state.allid);
				this.props.selectedUser(this.state.allid);
			})
		} else {
			this.state.tableData.map((a, i) => {
				this.setState({
					[a._id]: false,
				})
			});
			this.setState({
				allid: []
			}, () => {
				this.props.selectedUser(this.state.allid);
			})
		}
	}
	selectedId(event) {
		var selectedUser = this.state.allid ? this.state.allid : [];
		var data = event.target.id;
		var value = event.target.checked;
		this.setState({
			[data]: value,
		}, () => {
			if (this.state[data] === true) {
				selectedUser.push(data);
				this.setState({
					allid: selectedUser
				}, () => {
					// console.log('allidselectedId',this.state.allid);
					if (this.state.tableData.length === this.state.allid.length) {
						$('.allSelector').prop('checked', true);
					}
					this.props.selectedUser(this.state.allid);
				})
			} else {
				$('.allSelector').prop('checked', false);
				var indexVal = selectedUser.findIndex(x => x === data)
				selectedUser.splice(indexVal, 1)
				this.setState({
					allid: selectedUser
				}, () => {
					this.props.selectedUser(this.state.allid);
				})
			}
		})
	}
	resetPasswordField(event) {
		event.preventDefault()
		var id = $(event.currentTarget).attr('data-id');
		this.setState({
			['resetPassword' + id]: '',
			['resetPasswordConfirm' + id]: '',
		})
		$("#RestpwdModal-" + id).validate().resetForm();
	}
	resetPasswordChange(event) {
		var name = event.target.name;
		this.setState({
			[event.target.name]: event.target.value,
		}, () => {
			if (this.state[name]) {
				this.setState({
					[name + "Error"]: ""
				})
			} else {
				this.setState({
					[name + "Error"]: "This field is required."
				})
			}
		})
	}
	restoreUser(event) {
		event.preventDefault();
		var count = 0
		var username = this.state.username;
		var user_ID = this.state.user_ID;
		if (this.state.allid) {
			var checkedUsersList = this.state.allid
		} else {
			var checkedUsersList = []
			var selectedId = event.target.id;
			// console.log('selectedId',selectedId);
			checkedUsersList.push(selectedId)
		}
		for (var i = 0; i < checkedUsersList.length; i++) {
			var selectedId = checkedUsersList[i];
			var formValues = {
				user_id_toberecover: selectedId,
				updatedBy: user_ID,
			}
		}
		function updateStatus(formValues) {
			return new Promise(function (resolve, reject) {
				axios
					.patch('/api/users/patch/restorestatus', formValues)
					.then((response) => {
						resolve(response);
					})
					.catch(function (error) {
					})
			})
		}
		function getUserDetails(selectedId) {
			return new Promise(function (resolve, reject) {
				axios
					.get('/api/users/get/' + selectedId)
					.then((response) => {
						resolve(response);
					})
					.catch(function (error) {
					})
			})
		}
		function sendMail(inputObj) {
			return new Promise(function (resolve, reject) {
				axios
					.post('/api/masternotification/send-mail', inputObj)
					.then((response) => {
						resolve(response);
					})
					.catch(function (error) {
					})
			})
		}
		mainActive().then(response => {
			if (response) {
				this.setState({
					activeswal: true,
					checkedUser: [],
					unCheckedUser: true
				}, () => {
					var data = {
						"startRange": this.state.startRange,
						"limitRange": this.state.limitRange,
						"companyID": this.props.companyID
					}
					this.props.getData(data)
					checkedUsersList = [];
					if (this.state.activeswal === true) {
						swal(" ", "Account activated successfully").then((success) => {
							if (success) {
								//  window.location.reload();
							}
						});
					}
				});
			}
		});
		async function mainActive() {
			var count = 0
			for (var i = 0; i < checkedUsersList.length; i++) {
				var selectedId = checkedUsersList[i];
				var formValues = {
					user_id_toberecover: selectedId,
					updatedBy: user_ID,
				}

				var response = await updateStatus(formValues)
				if (response) {
					var user = await getUserDetails(selectedId)
					if (user) {
						var currentUrl = window.location.hostname
						var url = currentUrl === 'localhost' ? 'http://localhost:3001/' : currentUrl === 'qalmiscentre.iassureit.com' ? 'http://qalmiscentre.iassureit.com/' : 'http://uatlmiscenter.iassureit.com/'
						var msgvariable = {
							'[User]': user.data.firstname + ' ' + user.data.lastname,
							'[user_email_id]': user.data.email,
							'[center_application_URL]': url
						}
						var inputObj = {
							to: user.data.email,
							templateName: 'User - Login Account Activation',
							variables: msgvariable,
						}
						while ((checkedUsersList.length - 1) === i) {
							return Promise.resolve(true);
						}

					}
				}
			}
		}
	}

	deleteStatusOfUser(event) {
		// console.log("===== Delete user ====")
		event.preventDefault();
		var count = 0
		var username = this.state.username;
		var user_ID = this.state.user_ID;
		var checkedUsersList = []
		if (this.state.allid) {
			checkedUsersList = this.state.allid
		} else {
			checkedUsersList.push(event.target.id)
		}
			function updateStatus(formValues) {
				console.log('formValues===>>>', formValues.user_id_tobedeleted);
				return new Promise(function (resolve, reject) {
					
					axios
						.patch('/api/users/patch/deletestatus', formValues)
						.then((response) => {
							// console.log('responseStatus delete====>>>>', response.data);
							axios.get('/api/personmaster/get/details/'+formValues.user_id_tobedeleted)
							.then((response) => {
								
								var uservalue = {
									personID_tobedeleted: response.data[0]._id,
									updatedBy: username,
								}
								console.log('geet/details====>>>>', uservalue);
								axios.patch("/api/personmaster/patch/deletestatus", uservalue)
									.then((response) => {
										console.log('responseStatus delete====>>>>', response.data);
									})
									.catch((error) => {})
							})
							.catch(function (error) {})
							resolve(response);

						})
						.catch(function (error) {
						})
				})
			}
			function getUserDetails(selectedId) {
				return new Promise(function (resolve, reject) {
					axios
						.get('/api/users/get/' + selectedId)
						.then((response) => {
							resolve(response);
						})
						.catch(function (error) {
						})
				})
			}
			mainBlock()
			.then(response => {
				// console.log("response after delete ==>",response.data);
				var data = {
					"startRange": this.state.startRange,
					"limitRange": this.state.limitRange,
					"companyID": this.props.companyID
				}
				this.props.getData(data)
				// console.log("response Before data delete ==>",data);
				if (response) {
					this.setState({
						blockswal: true,
						checkedUser: [],
						unCheckedUser: true
					}, () => {

						checkedUsersList = [];
						if (this.state.blockswal === true) {
							swal(" ", "User removed from user's list successfully");
						}
					})
				}
			});

		async function mainBlock() {
			var count = 0;
			for (var i = 0; i < checkedUsersList.length; i++) {
				var selectedId = checkedUsersList[i];
				var formValues = {
					user_id_tobedeleted: selectedId,
					updatedBy: username,
				}
				console.log("formvalues==>", formValues);
				var response = await updateStatus(formValues);
				if (response) {
					var user = await getUserDetails(selectedId);
					if (user) {
						var msgvariable = {
							'[User]': user.data.firstname + ' ' + user.data.lastname,
							'[user_email_id]': user.data.email
						}
						var inputObj = {
							to: user.data.email,
							templateName: 'User - Login Account Deleted',
							variables: msgvariable,
						}
						while ((checkedUsersList.length - 1) === i) {
							return Promise.resolve(true);
						}
					}
				}
			}
		}
	}
	doubleclickonname(userID){
		console.log("doubleclickonname id== >",userID);
		
		axios.get('/api/personmaster/get/details/' + userID)
		.then((res) => {
			console.log("res id== >",res.data[0]);
			var personid = res.data[0]._id;
			this.props.history.push("/employee-profile/"+personid)
		})
		.catch((error) => {});
	} 
	doubleclickonCompany(companyID){
		console.log("doubleclickonname id== >",companyID);
		
		axios.get('/api/entitymaster/get/one/companyName/' + companyID)
		.then((res) => {
			console.log("res id== >",res.data);
			var entity = res.data._id;
			this.props.history.push("/company-profile/"+entity)
		})
		.catch((error) => {});
	}
	showUserDetails(id) {
		var id = id;
		console.log('id', id);
		axios.get('/api/users/get/' + id)
			.then((res) => {
				this.setState({
					userMail: res.data.email,
					fullName: res.data.fullName,
					logDetails: res.data.logDetails,
				})
			})
			.catch((error) => {});
	}
	render() {
		return (
			<div id="tableComponent" className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
				<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 NOpadding-left">
					<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17 NOpadding labelform text-left">Users Per Page</label>
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
						<select onChange={this.setLimit.bind(this)} value={this.state.limitRange} id="limitRange" ref="limitRange" name="limitRange" className="col-lg-12 col-md-12 col-sm-6 col-xs-12  noPadding form-control">
							<option value="Not Selected" disabled>Select Limit</option>
							<option value={5}>5</option>
							<option value={10}>10</option>
							<option value={20}>20</option>
							<option value={25}>25</option>
							<option value={50}>50</option>
							<option value={100}>100</option>
							<option value={500}>500</option>
							<option value={1000}>1000</option>
							<option value={1500}>1500</option>
							<option value={2000}>2000</option>
						</select>
					</div>
				</div>
				<div className="col-lg-4 col-md-4 col-md-offset-4 col-xs-12 col-sm-12 marginTop17 NOpadding-right">
					<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding labelform text-left">Search</label>
					<div className="">
						<input type="text" placeholder="Search By Name,Email and Mobile number..." onChange={this.tableSearch.bind(this)} className="NOpadding-right zzero form-control fa fa-search" ref="tableSearch" id="tableSearch" name="tableSearch" />
						<span className="input-group-addon input_status">
						{/* <i className="fa fa-search"></i> */}
						</span>
					</div>
				</div>
					<div className="col-lg-1 col-md-1 col-xs-12 col-sm-12 NOpadding  pull-right" data-toggle="tooltip" data-placement="top" title="Download Table Data">
						<ReactHTMLTableToExcel
							id="test-table-xls-button"
							className="download-table-xls-button fa fa-download tbmgtp tableicons pull-right"
							table="table-to-xls"
							filename={this.state.tableName}
							sheet="Users_Table_Data"
							
							buttonText=""/>
					</div>
				<div className="col-lg-12 col-sm-12 col-md-12 col-xs-12 NOpadding marginTop8 table-responsive UMHeaderFixTable">
				 <table id="UMTable" className="table iAssureITtable-bordered table-striped table-hover">
				 	<thead className="tempTableHeader">
									<tr className="tempTableHeader">
										{this.state.twoLevelHeader.apply === true ?
											this.state.twoLevelHeader.firstHeaderData.map((data, index) => {
												return (
													<th key={index} scope="col" id={"heading_data"+index} colSpan={data.mergedColoums} className="umDynamicHeader  srpadd textAlignCenter new_tableborder">{data.heading}</th>
												);
											})
											:
											null
										}
									</tr>
									<tr className="tempTableHeader">
										<th scope="col" className="umDynamicHeader tablebodynew srpadd textAlignLeft new_tableborder">
											<div className="uMDetailContainer">
												<input type="checkbox" className="allSelector col-lg-1 col-md-1 col-sm-3 col-xs-1 umchksett" name="allSelector" onChange={this.checkAll.bind(this)} />
												<span className="uMDetailCheck"></span>
											</div>
										</th>
										{this.state.tableHeading ?
											Object.entries(this.state.tableHeading).map(
												([key, value], i) => {
													if(key === 'actions'){
															return(
																<th key={i} scope="col" className="umDynamicHeader srpadd text-center">
																	<div className="">{value}</div>
																</th>
															);	
															
													}else{
														return(
															<th key={i} scope="col" className="umDynamicHeader srpadd textAlignLeft">
															<div>{value}</div>
															 <span onClick={this.sort.bind(this)} id={key} className="fa fa-sort tableSort"></span></th>
														);	
													}

												}
											)
											:
											<th className="umDynamicHeader srpadd textAlignLeft"></th>
										}
									</tr>
								</thead>
								<tbody>
									{this.state.tableData && this.state.tableData.length > 0 ?
										this.state.tableData.map(
											(value, i) => {
												// console.log('log.value=====>', value.roles);

												return (
													<tr key={i} className="">

														<td className="textAlignCenter">
															<div className="uMDetailContainer">
																<input type="checkbox" ref="userCheckbox" name="userCheckbox" className="userCheckbox" checked={this.state[value._id] ? true : false} id={value._id} onChange={this.selectedId.bind(this)} />
																<span className="uMDetailCheck"></span>
															</div>
														</td>
														{
															Object.entries(value).map(
																([key, value1], j) => {
																	if (value1) {
																		if ($.type(value1) === 'string') {
																			var regex = new RegExp(/(<([^>]+)>)/ig);
																			var value2 = value1 ? value1.replace(regex, '') : '';
																			var aN = value2.replace(this.state.reA, "");
																			if (aN && $.type(aN) === 'string') {
																				var textAlign = 'textAlignLeft';
																			} else {
																				var bN = value1 ? parseInt(value1.replace(this.state.reN, ""), 10) : '';
																				if (bN) {
																					var textAlign = 'textAlignRight';
																				} else {
																					var textAlign = 'textAlignLeft';
																				}
																			}
																			var found = Object.keys(this.state.tableHeading).filter((k) => {
																				return k === key;
																			});
																			if (found.length > 0) {
																				if (key !== 'id') {
																					if(value1){
																						return(<td className={textAlign} key={j}><div className={textAlign} dangerouslySetInnerHTML={{ __html:value1}}></div></td>); 						
																					}else{
																						return(<td className={textAlign} key={j}><div className={textAlign} dangerouslySetInnerHTML={{ __html:value1}}></div></td>); 						
																					}
																				} else {

																				}
																			}
																		}
																	} else {
																		return (<td  key={i}></td>);
																	}
																}
															)
														}
														{
															this.props.Actioncol ?
																""
																:
																<td className="textAlignCenter">
																	{
																		this.props.UsersTable
																			?
																			<span className="pointer pointerCls">
																					<i className="fa fa-pencil " title="Edit" id={value._id} onClick={this.showprofile.bind(this,value._id,value.roles)} ></i>&nbsp; &nbsp;
																					{this.props.editId && this.props.editId === value._id ? null : <i className={"fa fa-trash redFont " + value._id} id={value._id + '-Delete'} data-toggle="modal" title="Delete" data-target={`#${value._id}-deleteStatusofUser`} ></i>}&nbsp; &nbsp;
																					<i className="fa fa-key" title="Reset Password" id={value._id} data-toggle="modal" data-target={"#RestpwdModal-" + value._id}></i>
																				{/* <i className="fa fa-key" onClick={this.showUserDetails.bind(this)} title="Login Details" id={value._id} data-toggle="modal" data-target={"#userDetails-" + value._id}></i> */}
																			</span>
																			: null
																	}
																	{/* <div  id={`userDetails-${value._id}`} onClick={this.showUserDetails.bind(this)} className="modal" role="dialog"> */}
																	<div id={`userDetails-${value._id}`} className="modal" role="dialog">
																		<div className="adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
																			<div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
																				<div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
																				<div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
																						<button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
																							<span aria-hidden="true">&times;</span>
																						</button>
																					</div>
																					<p className="modal-title " id="exampleModalLabel">Login History for User:  <b>{this.state.fullName}</b></p>
																					<p className="modal-title " id="exampleModalLabel">User Email ID :  <b>{this.state.userMail ? this.state.userMail : "-"}</b></p>
																				</div>
																				<div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
																					{
																						this.state.logDetails != "-" ?
																							<div className="table-responsive topmr40 col-lg-12 col-md-12 col-sm-12 col-xs-12">
																								<table className="table iAssureITtable-bordered table-striped table-hover">
																									<thead className="tempTableHeader">
																										<tr className="">
																											<th className="umDynamicHeader srpadd textAlignCenter"> Login DateTime </th>
																											<th className="umDynamicHeader srpadd textAlignCenter"> LogOut DateTime </th>
																											<th className="umDynamicHeader srpadd textAlignCenter"> Total Login Hours </th>
																										</tr>
																									</thead>
																									<tbody>
																										{this.state.logDetails
																											?
																											this.state.logDetails.map((log, index) => {
																												// console.log("log",log);
																												var date1 = log.loginTimeStamp ? log.loginTimeStamp : new Date();
																												var date2 = log.logoutTimeStamp ? log.logoutTimeStamp : new Date();
																												let diffInMilliSeconds = Math.abs(new Date(date1) - new Date(date2)) / 1000;
																												const days = Math.floor(diffInMilliSeconds / 86400);
																												diffInMilliSeconds -= days * 86400;
																												const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
																												diffInMilliSeconds -= hours * 3600;
																												const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
																												diffInMilliSeconds -= minutes * 60;
																												let difference = '';
																												if (days > 0) {
																													difference += (days === 1) ? `${days} day, ` : `${days} days, `;
																												}

																												difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;
																												difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`;
																												// console.log('difference', difference);
																												// console.log('difference', difference);

																												return (
																													<tr key={index}>
																														<td className="textAlignLeft">{log.loginTimeStamp ? moment(log.loginTimeStamp).format("DD-MMM-YY LT") : "-"}</td>
																														<td className="textAlignLeft">{log.logoutTimeStamp ? moment(log.logoutTimeStamp).format("DD-MMM-YY LT") : "-"}</td>
																														<td className="textAlignLeft">{ difference }</td>
																													</tr>
																												);
																											})
																											:
																											null
																										}
																									</tbody>
																								</table>
																							</div>
																							:
																							<div className="centernote col-lg-12"> No data available </div>
																					}
																				</div>
																			</div>
																		</div>
																	</div>
																	<div className="modal modalHide passwordModal" id={"RestpwdModal-" + value._id} role="dialog" aria-labelledby="exampleModalLabel1" aria-hidden="true">
																		<div className="modal-dialog" role="document">
																			<div className="modal-content  ummodallftmg">
																				<div className="modal-header adminModal-header userHeader">
																					<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.resetPasswordField.bind(this)} id={value._id} data-id={value._id}>&times;</button>
																					<h4 className="modal-title" id="exampleModalLabel1">Reset Password</h4>
																				</div>
																				<div className="modal-body row">
																					<div className="" id={value._id}>
																						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
																							<div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12">
																								<form id='resetPassword' >
																									<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
																										<div className="col-lg-6 col-md-6  col-xs-12 col-sm-12 ">
																											<div className="form-group textAlignLeft col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
																												<label className="">New Password <span className="requiredsign">&nbsp;*</span></label>
																												<input type="password" value={this.state["resetPassword" + value._id]} onChange={this.resetPasswordChange.bind(this)} className="form-control marBtm eye" ref="resetPassword" name={"resetPassword" + value._id} id={"resetPassword" + value._id} autoComplete="off" />
																												<div className="showHideSignDiv showHideEye">
																													<i className="fa fa-eye showPwd showEyeupSign" aria-hidden="true" onClick={this.showSignPass.bind(this)}></i>
																													<i className="fa fa-eye-slash hidePwd hideEyeSignup " aria-hidden="true" onClick={this.hideSignPass.bind(this)}></i>
																												</div>
																												<label className="error">{this.state["resetPassword" + value._id + "Error"]}</label>
																											</div>
																										</div>
																										<div className="col-lg-6 col-md-6  col-xs-12 col-sm-12 ">
																											<div className="form-group textAlignLeft  col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding">
																												<label className=""> Confirm Password <span className="requiredsign">&nbsp;*</span></label>
																												<input type="password" value={this.state["resetPasswordConfirm" + value._id]} onChange={this.resetPasswordChange.bind(this)} className="form-control marBtm eye" ref="resetPasswordConfirm" name={"resetPasswordConfirm" + value._id} id={"resetPasswordConfirm" + value._id} autoComplete="off" />
																												<div className="showHideSignDiv showHideEye">
																													<i className="fa fa-eye showPwd showEyeupSign" aria-hidden="true" onClick={this.showSignPass.bind(this)}></i>
																													<i className="fa fa-eye-slash hidePwd hideEyeSignup " aria-hidden="true" onClick={this.hideSignPass.bind(this)}></i>
																												</div>
																												<label className="error">{this.state["resetPasswordConfirm" + value._id + "Error"]}</label>
																											</div>
																										</div>
																										<div className="submitButtonWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
																											<button className="btn  resetBtn pull-right  col-lg-4 col-lg-offset-3 col-md-6 col-sm-12 col-xs-12" onClick={this.changepassword.bind(this)} id={value._id} data-email={value.emailId}>Reset Password</button>
																										</div>
																									</div>
																								</form>
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</div>
																	<div className="modal col-lg-12 col-md-12 col-sm-12 col-xs-12" id={`${value._id}-deleteStatusofUser`} role="dialog">
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
																					<h4 className="blackFont textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12 examDeleteFont">Are you sure you want to delete this User?</h4>
																				</div>
																				<div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
																					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
																						<button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
																					</div>
																					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
																						<button id={value._id} onClick={this.deleteStatusOfUser.bind(this)} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
																					</div>
																				</div>
																			</div>
																		</div>
																	</div>
																</td>
														}
													</tr>
												);
											}
										)
										:
										<tr className="trAdmin"><td colSpan={Object.keys(this.state.tableHeading).length + 2} className="noTempData textAlignCenter">No Record Found!</td></tr>
									}
								</tbody>
							</table>
							{/* {
	                    	this.state.tableObjects.paginationApply === true ?
		                    	this.state.tableData && this.state.tableData.length > 0 ?
		                    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 paginationAdminWrap">
			                    	<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
				                    	{ 
					                    		this.state.limitRange >=  this.state.dataLength?		                    		
						                    	null
						                    	:
				                    			<div className="btn btn-primary" onClick={this.showFirstTweentyButtons.bind(this)} title="Fast Backward"><i className="fa fa-fast-backward"></i></div>
				                    	}
			                    	</div>
			                    	<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
				                    	{ 
				                    		this.state.limitRange >=  this.state.dataLength?                  		
					                    	null
					                    	:
					                    	<div className="btn btn-primary" onClick={this.showPreviousPaginationButtons.bind(this)} title="Previous"><i className="fa fa-caret-left"></i></div>
					                    }
				                    </div>
									<ol className="questionNumDiv paginationAdminOES col-lg-8 col-md-8 col-sm-8 col-xs-8 mainExamMinDeviceNoPad">										 
										{this.state.paginationArray}
									</ol>
									<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
										{
											this.state.paginationArray.length < 20 ?
											null
											:
											<div className="btn btn-primary" onClick={this.showNextPaginationButtons.bind(this)} title="Next"><i className="fa fa-caret-right"></i></div>
										}
									</div>
									<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
										{
											this.state.paginationArray.length < 20 ?
											null
											:
											<div className="btn btn-primary" onClick={this.showLastTweentyButtons.bind(this)} title="Fast Forward"><i className="fa fa-fast-forward"></i></div>
										}
									</div>							
								</div>
								:
								null
							:
							null
	                    } */}
						{/*Export To Excel*/}
						<div className="table-responsive" id="HideTable">
						<table id="table-to-xls" className="table iAssureITtable-bordered table-striped table-hover  ">
								<thead className="tempTableHeader">
									<tr className="">
										{this.state.twoLevelHeader.apply === true ?
											this.state.twoLevelHeader.firstHeaderData.map((data, index) => {
												return (
													<th key={index} colSpan={data.mergedColoums} className="umDynamicHeader srpadd textAlignCenter">{data.heading}</th>
												);
											})
											:
											null
										}
									</tr>
									<tr className="">
										{this.state.tableHeading ?
											Object.entries(this.state.tableHeading).map(
												([key, value], i) => {
													if (key === 'actions') {
														return (
															<th key={i} className="umDynamicHeader srpadd textAlignLeft new_tableborder">{value != "actions"}</th>
														);
													} else {
														return (
															<th key={i} className="umDynamicHeader srpadd textAlignLeft new_tableborder">{value} <span onClick={this.sort.bind(this)} id={key} className="fa fa-sort tableSort"></span></th>
														);
													}

												}
											)
											:
											<th className="umDynamicHeader srpadd textAlignLeft"></th>
										}
									</tr>
								</thead>
								<tbody className="scrollContent">
									{this.state.tableData && this.state.tableData.length > 0 ?
										this.state.tableData.map(
											(value, i) => {
												return (
													<tr key={i} className="">

														{/*<td className="textAlignCenter">
																													<div className="uMDetailContainer">
																														<input type="checkbox" ref="userCheckbox" name="userCheckbox" className="userCheckbox" checked={this.state[value._id] ? true : false} id={value._id} onChange={this.selectedId.bind(this)} />
																														<span className="uMDetailCheck"></span>
																													</div>
																												</td>*/}
														{
															Object.entries(value).map(
																([key, value1], i) => {
																	if (value1) {
																		if ($.type(value1) === 'string') {
																			var regex = new RegExp(/(<([^>]+)>)/ig);
																			var value2 = value1 ? value1.replace(regex, '') : '';
																			var aN = value2.replace(this.state.reA, "");
																			if (aN && $.type(aN) === 'string') {
																				var textAlign = 'textAlignLeft';
																			} else {
																				var bN = value1 ? parseInt(value1.replace(this.state.reN, ""), 10) : '';
																				if (bN) {
																					var textAlign = 'textAlignLeft';
																				} else {
																					var textAlign = 'textAlignLeft';
																				}
																			}
																			var found = Object.keys(this.state.tableHeading).filter((k) => {
																				return k === key;
																			});
																			if (found.length > 0) {
																				if (key !== 'id') {
																					return (<td className={textAlign} key={i}><div className={textAlign} dangerouslySetInnerHTML={{ __html: value1 }}></div></td>);
																				} else {

																				}
																			}
																		}
																	} else {
																		return (<td key={i}></td>);
																	}
																}
															)
														}
													</tr>
												);
											}
										)
										:
										<tr className="trAdmin"><td colSpan={Object.keys(this.state.tableHeading).length + 2} className="noTempData textAlignCenter">No Record Found!</td></tr>
									}
								</tbody>
							</table>
						</div>
				</div>
			</div>
		);
	}
}

export default withRouter(IAssureTableUM);