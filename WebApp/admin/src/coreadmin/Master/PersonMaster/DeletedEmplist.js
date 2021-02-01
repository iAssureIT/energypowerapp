import React, { Component } from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import $ from 'jquery';
import jQuery from 'jquery';
import 'jquery-validation';
// import DeletedUsers from './DeletedUsers.js';
import '../../IAssureTableUM/IAssureTable.css';
import moment from 'moment';
import { Route, withRouter } from 'react-router-dom';

var sum = 0;
class IAssureTableUM extends Component {
	constructor(props) {
		super(props);
		this.state = {
			"tableData": props && props.tableData ? props.tableData : [],
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
	}
	componentDidMount() {
		$("html,body").scrollTop(0);

		console.log("this.props.tableHeading==>", this.props.tableHeading);
		this.setState({
			tableHeading: this.props.tableHeading,
			tableData: this.props.tableData,
			completeDataCount: this.props.completeDataCount
		})
		const user_ID = localStorage.getItem("user_ID");
		this.setState({
			user_ID: user_ID
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
				completeDataCount: nextProps.completeDataCount,
			}, () => {
				this.paginationFunction();
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
		this.props.getData(startRange, limitRange);
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
		if (this.refs.limitRange.value === 'All') {
			var limitRange = '';
		} else {
			var limitRange = parseInt(this.refs.limitRange.value);
		}
		var startRange = 0;
		this.setState({
			"limitRange": limitRange,
		}, () => {
			if (this.state.normalData === true) {
				this.props.getData(startRange, this.state.limitRange);
			}
			if (this.state.searchData === true) {
				this.tableSearch();
				// this.tableSearchfordelete();
			}
		});
	}
	tableSearch() {
		var searchText = this.refs.tableSearch.value.trim();

		if (searchText && searchText.length !== 0) {
			var data = {
				searchText: searchText,
				startRange: this.state.startRange,
				limitRange: this.state.limitRange
			}

			if (this.props.DeletedUsersTable) {
				axios.post('/api/users/get/searchlist/delete', data)
					.then((res) => {
						console.log("Res in searchtext delete==>", res)
						var tableData = res.data.map((a, i) => {
							return {
								_id: a._id,
								fullName: '<p>' + '<b>' + a.fullName + '</b>' + '&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp' + '<medium>' + a.companyName + '&nbsp | &nbsp' + a.companyID + '</medium>' + '</div></p>' + '</p>' + '<p><i class="fa fa-envelope"></i> ' + a.email + '&nbsp  | &nbsp <i class="fs16 fa fa-mobile"></i> ' + a.mobNumber,
								roles: a.role.map((b, j) => '  <span>' + b + ' </span>').toString(),
								status: a.status,
								createdAt: moment(a.createdAt).format("DD-MMM-YYYY"),
								lastLogin: a.lastLogin !== "-" ? moment(a.lastLogin).format("DD-MMM-YY LT") : "-",
								deletedOn: a.statusupdatedAt !== "-" ? moment(a.statusupdatedAt).format("DD-MMM-YY LT") : "-",
								deletedBy: a.statusupdatedBy,
							}
						})
						this.setState({
							completeDataCount: res.data.length,
							tableData: tableData,
						})
					})
					.catch((error) => {
					})
			} else {
				axios.post('/api/users/get/searchlist', data)
					.then((res) => {
						var tableData = res.data.filter((data, i) => {
							return (data.status !== 'deleted-active' && data.status !== 'deleted-blocked');
						});
						console.log("Res in searchtext==>", res)
						var tableData = [];
						tableData = res.data.map((a, i) => {
							// if(a.status !== "deleted-active" && a.status !== "deleted-blocked"){
							return {
								_id: a._id,
								fullName: '<p>' + '<b>' + a.fullName + '</b>' + '&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp' + '<medium>' + a.companyName + '&nbsp | &nbsp' + a.companyID + '</medium>' + '</div></p>' + '</p>' + '<p><i class="fa fa-envelope"></i> ' + a.email + '&nbsp  | &nbsp <i class="fs16 fa fa-mobile"></i> ' + a.mobNumber,
								status: a.status === "active" ? '<span class="label label-success statusLabel">' + a.status + "</span>" : '<span class="label label-default statusLabel">' + a.status + "</span>",
								roles: a.role.map((b, j) => '  <span>' + b + ' </span>').toString(),
								createdAt: moment(a.createdAt).format("DD-MMM-YY") + '<br/>' + moment(a.createdAt).fromNow(true),
								lastLogin: a.lastLogin !== "-" ? moment(a.lastLogin).format("DD-MMM-YY") : "-",
							}
						})
						this.setState({
							completeDataCount: res.data.length,
							tableData: tableData,
						})
					})
					.catch((error) => {
					})
			}
			this.setState({
				tableData: []
			});
		} else {
			this.setState({
				tableHeading: this.props.tableHeading,
				tableData: this.props.tableData,
				completeDataCount: this.props.completeDataCount
			})
		}
	}

	tableSearchfordelete() {
		var searchText = this.refs.tableSearch.value.trim();

		if (searchText && searchText.length !== 0) {
			var data = {
				searchText: searchText,
				startRange: this.state.startRange,
				limitRange: this.state.limitRange
			}
			// axios.post('/api/users/get/searchlist', data)
			axios.post('/api/users/get/searchlist/delete', data)
				.then((res) => {
					console.log("Res in searchtext delete==>", res)
					var tableData = res.data.map((a, i) => {
						return {
							_id: a._id,
							// fullName: '<div class="wraptext"><p>' + a.fullName + '</p>' + '<p><i class="fa fa-envelope"></i> ' + a.email + '</p>' + '<p><i class="fs16 fa fa-mobile"></i> ' + a.mobNumber + '</p></div>',
							fullName: '<p>' + '<b>' + a.fullName + '</b>' + '&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp' + '<medium>' + a.companyName + '&nbsp | &nbsp' + a.companyID + '</medium>' + '</div></p>' + '</p>' + '<p><i class="fa fa-envelope"></i> ' + a.email + '&nbsp  | &nbsp <i class="fs16 fa fa-mobile"></i> ' + a.mobNumber,
							roles: a.role.map((b, j) => '  <span>' + b + ' </span>').toString(),
							createdAt: moment(a.createdAt).format("DD-MMM-YY"),
							lastLogin: a.lastLogin !== "-" ? moment(a.lastLogin).format("DD-MMM-YY") : "-",
							deletedOn: a.statusupdatedAt !== "-" ? moment(a.statusupdatedAt).format("DD-MMM-YY") : "-",
							deletedBy: a.statusupdatedBy,
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
	deleteUser(event) {
		event.preventDefault();
		var id = event.target.id;
		const token = '';
		console.log('id', id);
		const url = '/api/personmaster/delete/' + id;
		const headers = {
			"Authorization": token,
			"Content-Type": "application/json",
		};

		axios({
			method: "DELETE",
			url: url,
			headers: headers,
			timeout: 3000,
			data: null,
		})
			.then((response) => {
				const url = '/api/users/delete/' + id;
				const headers = {
					"Authorization": token,
					"Content-Type": "application/json",
				};
				axios({
					method: "DELETE",
					url: url,
					headers: headers,
					timeout: 3000,
					data: null,
				})
					.then((response) => {
						swal({
							title: " ",
							text: "User permanently deleted.",
						}).then((success) => {
							if (success) {
								//  window.location.reload();

							}
						});

						var data = {
							"startRange": this.props.startRange,
							"limitRange": this.props.limitRange,
							"companyID": this.props.companyID
						}
						this.props.getData(data)
					}).catch((error) => { });
				var data = {
					"startRange": this.state.startRange,
					"limitRange": this.state.limitRange,
				}
				this.props.getData(this.state.startRange, this.state.limitRange);
			}).catch((error) => {
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
				// if (password.length >= 6) {
				axios.patch('/api/auth/patch/change_password_withoutotp/id/' + id, formValues)
					.then((res) => {

						swal({
							title: " ",
							text: "Password has been changed successfully!!",
						}).then((success) => {
							if (success) {
								window.location.reload();
							}
						});
						var modalid = "RestpwdModal-" + id;
						var modal = document.getElementById(modalid);
						modal.style.display = "none";
						$('.modal-backdrop').remove();
					})
					.catch((error) => {

						swal({
							title: " ",
							text: "Sorry! Something went wrong",
						});
						var modalid = "RestpwdModal-" + id;
						var modal = document.getElementById(modalid);
						modal.style.display = "none";
						$('.modal-backdrop').remove();

					});
				// } else {

				// 	swal({
				// 		title: "Password should be at least 6 characters long",
				// 		text: "Password should be at least 6 characters long",
				// 	});
				// }
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
	showprofile(e) {
		e.preventDefault();

		this.props.history.push('/edituserprofile/' + e.currentTarget.id);
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

		mainActive().then(response => {
			if (response) {
				this.setState({
					activeswal: true,
					checkedUser: [],
					unCheckedUser: true
				}, () => {
					this.props.getData(this.state.startRange, this.state.limitRange)
					checkedUsersList = [];
					if (this.state.activeswal === true) {
						swal(" ", "Account activated successfully").then((success) => {
							if (success) {
								this.props.getpersons();
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
					personID_toberecover: selectedId,
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
				function updateStatus(formValues) {
					return new Promise(function (resolve, reject) {
						axios
							.patch('/api/personmaster/patch/restorestatus', formValues)
							.then((response) => {
								console.log("response in person patch ==>",response);
								resolve(response);
								var formValues = {
									user_id_toberecover: this.state.personID_toberecover,
									username: this.state.username,
								}
								console.log("response before formValues ==>",formValues);
								axios
									.patch('/api/users/patch/restorestatus', formValues)
									.then((response) => {
										console.log("response in restore ==>",response.data);
									})
									.catch(function (error) {
									})
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
			}
		}
	}

	deleteStatusOfUser(event) {
		console.log("===== Delete user ====")
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

		mainBlock()
			.then(response => {
				if (response) {
					this.setState({
						blockswal: true,
						checkedUser: [],
						unCheckedUser: true
					}, () => {
						this.props.getData(this.state.startRange, this.state.limitRange)
						checkedUsersList = [];
						if (this.state.blockswal === true) {
							swal(" ", "Account deleted successfully");
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

		function updateStatus(formValues) {
			console.log('formValues===>>>', formValues);
			return new Promise(function (resolve, reject) {
				axios
					.patch('/api/users/patch/deletestatus', formValues)
					.then((response) => {
						console.log('responseStatus', response);
						resolve(response);
						this.props.getData(this.state.startRange, this.state.limitRange)
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
						// console.log('responsegetUserDetails====>'.response.data);
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
						// console.log('responsesend-mail'.response);
						resolve(response);
					})
					.catch(function (error) {
					})
			})
		}
	}
	showUserDetails(event) {
		var id = event.target.id;
		console.log('id', id);
		axios.get('/api/users/get/' + id)
			.then((res) => {
				console.log('Details', res);
				this.setState({
					userMail: res.data.email,
					fullName: res.data.fullName,
					logDetails: res.data.logDetails,
				})
			})
			.catch((error) => {
			});
	}
	render() {
		return (
			<div id="tableComponent" className="col-lg-12 col-sm-12 col-md-12 col-xs-12">
				{
					this.props.DeletedUsersTable ?
						<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 NOpadding-left">

						</div>
						:
						<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 NOpadding-left">
							<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginTop17 NOpadding labelform text-left">Users Per Page</label>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
								<select onChange={this.setLimit.bind(this)} value={this.state.limitRange} id="limitRange" ref="limitRange" name="limitRange" className="col-lg-12 col-md-12 col-sm-6 col-xs-12  noPadding form-control">
									<option value="Not Selected" disabled>Select Limit</option>
									<option value={10}>10</option>
									<option value={25}>25</option>
									<option value={50}>50</option>
									<option value={100}>100</option>
									<option value={500}>500</option>
									<option value={500}>1000</option>
									<option value={500}>1500</option>
									<option value={500}>2000</option>
								</select>
							</div>
						</div>
				}
				<div className="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-xs-12 col-sm-12 marginTop17 NOpadding-right">
					<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding labelform text-left">Search</label>
					<div className="input-group inputBox-main">
						<input type="text" placeholder="Enter text..." onChange={this.tableSearch.bind(this)} className="NOpadding-right zzero form-control" ref="tableSearch" id="tableSearch" name="tableSearch" />
						<span className="input-group-addon input_status"><i className="fa fa-search"></i></span>
					</div>
				</div>
				<div className="col-lg-12 col-sm-12 col-md-12 col-xs-12 NOpadding marginTop17">
					<div className="table-responsive  ">
						<div className="scrolltbl">
							<table className="table iAssureITtable-bordered table-striped table-hover  ">
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
										{
											this.props.DeletedUsersTable ?

												null
												:
												<th className="umDynamicHeader srpadd textAlignLeft">
													<div className="uMDetailContainer">
														<input type="checkbox" className="allSelector col-lg-1 col-md-1 col-sm-3 col-xs-1 umchksett" name="allSelector" onChange={this.checkAll.bind(this)} />
														<span className="uMDetailCheck"></span>
													</div>
												</th>
										}
										{this.state.tableHeading ?
											Object.entries(this.state.tableHeading).map(
												([key, value], i) => {
													if (key === 'actions') {
														return (
															<th key={i} className="umDynamicHeader srpadd textAlignLeft">{value}</th>
														);
													} else {
														return (
															<th key={i} className="umDynamicHeader srpadd textAlignLeft">{value} <span onClick={this.sort.bind(this)} id={key} className="fa fa-sort tableSort"></span></th>
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
														{
															this.props.DeletedUsersTable ?

																null
																:
																<td className="textAlignCenter">
																	<div className="uMDetailContainer">
																		<input type="checkbox" ref="userCheckbox" name="userCheckbox" className="userCheckbox" checked={this.state[value._id] ? true : false} id={value._id} onChange={this.selectedId.bind(this)} />
																		<span className="uMDetailCheck"></span>
																	</div>
																</td>
														}
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
														{
															this.props.Actioncol ?
																""
																:

																<td className="textAlignCenter">
																	{
																		this.props.UsersTable
																			?
																			<span className="pointer pointerCls">
																				<i className="fa fa-pencil " title="Edit" id={value._id} onClick={this.showprofile.bind(this)} ></i>&nbsp; &nbsp;
																					{this.props.editId && this.props.editId === value._id ? null : <i className={"fa fa-trash redFont " + value._id} id={value._id + '-Delete'} data-toggle="modal" title="Delete" data-target={`#${value._id}-deleteStatusofUser`} ></i>}&nbsp; &nbsp;
																				<i className="fa fa-key" title="Reset Password" id={value._id} data-toggle="modal" data-target={"#RestpwdModal-" + value._id}></i>
																			</span>
																			: null
																	}
																	{
																		this.props.DeletedUsersTable ?
																			<div>
																				{this.props.editId && this.props.editId === value._id ? null : <button className="btn deleteBtn btn-primary" id={value._id + '-Delete'} data-toggle="modal" title="Delete" data-target={`#${value._id}-rm`} >Delete Permanently</button>}{"\n"}
																				{this.props.editId && this.props.editId === value._id ? null : <button className="btn restoreBtn btn-primary" id={value._id} onClick={this.restoreUser.bind(this)}>Restore User</button>}
																			</div>
																			: null
																	}
																	<div className="modal" id={`${value._id}-userDetails`} role="dialog">
																		<div className="adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
																			<div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
																				<div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
																					<p className="modal-title row " id="exampleModalLabel">Login History for User:  {this.state.fullName ? this.state.fullName : "-"}</p>
																					<p className="modal-title row " id="exampleModalLabel">UserID :  {this.state.userMail ? this.state.userMail : "-"}</p>
																					<div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding-left NOpadding-right">
																						<button type="button" className="adminCloseButton" data-dismiss="modal" aria-label="Close">
																							<span aria-hidden="true">&times;</span>
																						</button>
																					</div>
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
																												var date1 = log.loginTimeStamp ? log.loginTimeStamp : "-"
																												var date2 = log.logoutTimeStamp ? log.logoutTimeStamp : "-"
																												console.log('log.logoutTimeStamp', new Date(date2));
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


																												console.log('difference', difference);



																												return (
																													<tr key={index}>
																														<td className="textAlignLeft">{log.loginTimeStamp ? moment(log.loginTimeStamp).format("DD-MMM-YY LT") : "-"}</td>
																														<td className="textAlignLeft">{log.profilelogoutTimeStamp ? moment(log.logoutTimeStamp).format("DD-MMM-YY LT") : "-"}</td>
																														<td className="textAlignLeft">{difference}</td>
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
																	<div className="modal col-lg-12 col-md-12 col-sm-12 col-xs-12" id={`${value._id}-rm`} role="dialog">
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
																						<button id={value._id} onClick={this.deleteUser.bind(this)} type="button" className="btn examDelete-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
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
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(IAssureTableUM);

