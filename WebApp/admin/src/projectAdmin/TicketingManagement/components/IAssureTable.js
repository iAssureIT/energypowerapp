import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import axios from 'axios';
import $ from 'jquery';
import jQuery from 'jquery';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import './IAssureTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import { CheckBoxSelection, Inject, MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import ReactPaginate from 'react-paginate';
import Loader           from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import moment from 'moment';

var sum = 0;
const openStatus = [
    'New',
    'Acknowledged',
    'Allocated',
    'Assignee Accepted',
    'Assignee Rejected',
    'Resolved',
    'Work Started',
    'Work In Progress',
    'Reopen',
    'Paid Service Request',
    'Paid Service Approved',
    'Paid Service Rejected',
    'Resolved'
    ];

// import MyMap from '/imports/admin/map/MyMap.js'; 
 const filterData = {
      pageNumber    : 0,
      nPerPage      : 10,
      ticketId      : '',
      client_id     : '',
      issue         : '', 
      status        : openStatus,
      serviceRequest: ['Free','Paid',null],
      technician_id : '',     
      searchText    : '', 
      date          : ''
  }

class IAssureTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			"dataCount" 			: props && props.dataCount ? props.dataCount : [],
			"tableData" 			: props && props.tableData ? props.tableData : [],
			"tableName" 			: props && props.tableName ? props.tableName : [],
			"tableHeading" 			: props && props.tableHeading ? props.tableHeading : {},
			"twoLevelHeader" 	  	: props && props.twoLevelHeader ? props.twoLevelHeader : {},
			"tableObjects" 		  	: props && props.tableObjects ? props.tableObjects : {},
			"deleteMethod" 		  	: props && props.deleteMethod ? props.deleteMethod : {},
			"id" 				  	: props && props.id ? props.id : {},
			"reA" 				  	: /[^a-zA-Z]/g,
			"reN" 				  	: /[^0-9]/g,
			"sort"				  	: true,
			"examMasterData2"     	: '',
			"activeClass"		  	: 'activeCircle',
			"paginationArray" 	  	: [],
			"startRange"		  	: 0,
			"activeClass"		  	: 'activeCircle',
			"normalData"		  	: true,
			"printhideArray"	  	: [],
			searchData            	: '',
			clientArray           	: [],
			typeOfIssueArray      	: [],
			technicianList        	: [],
			client_id             	: '',
			clientName            	: '',
			serviceRequest          : '',
			status                	: '',
			date                  	: '',
			ticketId              	: '',
			issue                 	: '',
			checkedTickets        	: [],
			assignToTechnician 	  	: "",
			nPerPage               	: props && props.nPerPage ? props.nPerPage : 10,
			pageNumber              : 0,
			selected                : 0,

		}
		this.delete = this.delete.bind(this);
		this.printTable = this.printTable.bind(this);
		if (props.tableHeading) {
			var tableHeading = Object.keys(props.tableHeading);
			var index = 0;
			if (props.twoLevelHeader) {
				if (props.twoLevelHeader.firstHeaderData && props.twoLevelHeader.firstHeaderData.length > 0) {
					for (let j = 0; j < props.twoLevelHeader.firstHeaderData.length; j++) {
						var mergCol = props.twoLevelHeader.firstHeaderData[j].mergedColoums;
						if (j === 1) {
							mergCol--;
						}

						for (let k = 0; k < mergCol; k++) {
							if (props.twoLevelHeader.firstHeaderData[j].hide) {
								var phElem = { col: tableHeading[index], printhide: "printhide" };
							} else {
								var phElem = { col: tableHeading[index], printhide: "" };
							}

							this.state.printhideArray.push(phElem);
							index++;
						}
					}

					if (index === tableHeading.length) {
					}

				}
			}
		}
	}

	componentDidMount() {
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token");
		$("html,body").scrollTop(0);
		
		const center_ID = localStorage.getItem("center_ID");
		const centerName = localStorage.getItem("centerName");
		this.setState({
			center_ID: center_ID,
			centerName: centerName,
		}, () => {
			this.props.getData(this.state.startRange, this.state.limitRange, this.state.center_ID);
		});
		this.setState({
			tableHeading: this.props.tableHeading,
			tableData: this.props.tableData,
			tableName: this.props.tableName,
			dataCount: this.props.dataCount,
			id: this.props.id,
		});
		$("#table-to-xls").attr('title', 'Download Table');
		 this.getClientName();
    	 this.getTypeOfIssues();
    	 this.getTechnicianList();
	}


	setLimit(event) {
		event.preventDefault();
		if(this.refs.nPerPage.value === 'All') {
		  var nPerPage = '';
		}else{
		  var nPerPage = parseInt(this.refs.nPerPage.value);
		}
		this.setState({nPerPage:nPerPage})
		filterData.nPerPage = nPerPage;
		this.props.getData(filterData)
	}



	componentWillReceiveProps(nextProps) {
		this.setState({
			id: nextProps.id,
			tableData: nextProps.tableData,
			tableName: nextProps.tableName,
			dataCount: nextProps.dataCount,
		}, () => {
			this.paginationFunction();
		})
		$("#table-to-xls").attr('title', 'Download Table');
	}

	componentWillUnmount() {
		$("script[src='/js/adminSide.js']").remove();
		$("link[href='/css/dashboard.css']").remove();
	}
	edit(event) {
		event.preventDefault();
		$("html,body").scrollTop(0);
		var tableObjects = this.props.tableObjects;
		var id = event.currentTarget.id;
		this.props.history.push(tableObjects.editUrl + "/" + id);
	}
	delete(e) {
		e.preventDefault();
		var tableObjects = this.props.tableObjects;
		let id = (e.target.id).replace(".", "/");
		axios({
			method: tableObjects.deleteMethod,
			url: tableObjects.apiLink + 'temp/delete/' + id
		}).then((response) => {
			this.props.getData(filterData);
			this.props.history.push(tableObjects.listUrl);
			swal({
				title : " ",
				text  : "Record deleted successfully",
			});
		}).catch((error) => {
		});
	}
	sortNumber(key, tableData) {
		var nameA = '';
		var nameB = '';
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
			if (this.state.sort === true) {
				this.setState({
					sort: false
				})
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
			} else if (this.state.sort === false) {
				this.setState({
					sort: true
				})
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
			}
		});
		this.setState({
			tableData: sortedData,
		});
	}
	sortString(key, tableData) {
		var nameA = '';
		var nameB = '';
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
			if (this.state.sort === true) {
				this.setState({
					sort: false
				})
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			} else if (this.state.sort === false) {
				this.setState({
					sort: true
				})
				if (nameA > nameB) {
					return -1;
				}
				if (nameA < nameB) {
					return 1;
				}
				return 0;
			}
		});
		this.setState({
			tableData: sortedData,
		});
	}
	sort(event) {
		event.preventDefault();
		var key = event.target.getAttribute('id');
		var tableData = this.state.tableData;
		if (key === 'number') {
			this.sortNumber(key, tableData);
		} else {
			this.sortString(key, tableData);
		}
	}
	paginationFunction(event) {
		var dataLen = this.state.dataCount > 20 || this.state.dataCount === 20 ? 20 : this.state.dataCount;
		var dataLength = this.state.dataCount;
		this.setState({
			dataLength: dataLen,
		}, () => {
			$('li').removeClass('activeCircle');
			$(".queDataCircle:first").addClass('activeCircle');
			const maxRowsPerPage = this.state.limitRange;
			var paginationNum = dataLength / maxRowsPerPage;
			var pageCount = Math.ceil(paginationNum) > 20 ? 20 : Math.ceil(paginationNum);

			var paginationArray = [];
			for (var i = 1; i <= pageCount; i++) {
				var countNum = maxRowsPerPage * i;
				var startRange = countNum - maxRowsPerPage;
				if (i === 1) {
					var activeClass = 'activeCircle';
				} else {
					activeClass = '';
				}
				paginationArray.push(
					<li key={i} className={"queDataCircle page-link " + activeClass + " parseIntagination" + i} id={countNum + '|' + startRange} onClick={this.getStartEndNum.bind(this)} title={"Click to jump on " + i + " page"}>{i}</li>
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
	getStartEndNum(event) {
		var limitRange = $(event.target).attr('id').split('|')[0];
		var limitRange2 = parseInt(limitRange);
		var startRange = parseInt($(event.target).attr('id').split('|')[1]);
		this.props.getData(startRange, limitRange);
		this.setState({
			startRange: startRange,
		});
		$('li').removeClass('activeCircle');
		$(event.target).addClass('activeCircle');
		var counter = $(event.target).text();
	}

	tableSearch() {
		var searchText = this.refs.tableSearch.value;
		if (searchText && searchText.length !== 0) {
			this.setState({
				"normalData": false,
				"searchData": true,
			}, () => {
				this.props.getSearchText(searchText, this.state.startRange, this.state.limitRange);
			});
		} else {
			this.props.getData(this.state.startRange, this.state.limitRange);
		}
	}
	printTable(event) {
		// event.preventDefault();
		$('#ActionContent').hide();
		$('.modal').hide();
		var DocumentContainer = document.getElementById('section-to-print');
		var WindowObject = window.open('', 'PrintWindow', 'height=500,width=600');
		WindowObject.document.write(DocumentContainer.innerHTML);
		WindowObject.document.close();
		WindowObject.focus();
		WindowObject.print();
		WindowObject.close();
		if (WindowObject.print()) { // shows print preview.
			$('#ActionContent').hide();
		}else{
			$('#ActionContent').show();
		}
	}

	setlectTicket(event){
		$(".selectAllCheckBox").attr("checked", false);
		var id=event.currentTarget.id;
		var tableData=this.state.tableData;
		if(event.target.checked){
			for(let i=0; i <tableData.length; i++){
				if(tableData[i]._id === id){
					tableData[i].checked = true;
				}
			}
		}else{
			for(let i=0; i <tableData.length; i++){
				if(tableData[i]._id === id){
					tableData[i].checked = false;
				}
			}
		}
		this.setState({
			tableData : tableData,
		});
	}

	selectAllCheckBox(event){
		var tableData=this.state.tableData;
		if(event.target.checked){
			for(let i=0; i <tableData.length; i++){
				if(tableData[i].serviceRequest){
					tableData[i].checked = true;
				}
			}
		}else{
			for(let i=0; i <tableData.length; i++){
				if(tableData[i].serviceRequest){
					tableData[i].checked = false;
				}
			}
		}
		this.setState({
			tableData : tableData,
		});
	}

  
	handlePageClick = data => {
		filterData.pageNumber = data.selected;
		this.setState({pageNumber:data.selected})
		this.props.getData(filterData);
		// this.setState({startRange:this.state.startRange})
	};

	paidRequest(event){
      event.preventDefault()
      var formValues ={
          ticket_id  : event.currentTarget.id,
          status      : {
                          value         : 'Paid Service Request',
                          statusBy      : localStorage.getItem("user_ID"),
                          statusAt      :  new Date(),
                        },
          cost          : parseInt(this.state.cost),              
          updatedBy   : localStorage.getItem("user_ID")  
		}
		var ticket = this.props.ticketList.find(elem=>elem._id ===event.currentTarget.id);
        axios.patch('/api/tickets/patch/status', formValues)
        .then((response)=>{
		  this.props.getData(filterData);
		  var sendData = {
			"event": "Event3", //Event Name
			"company_id": ticket.client_id, //company_id(ref:entitymaster)
			"otherAdminRole":'client',
			"variables": {
			  'TicketId': ticket.ticketId,
			  'CompanyName': ticket.clientName,
			  'RaisedBy' :ticket.contactPerson,
			  'TypeOfIssue': ticket.typeOfIssue,
			  'Amount':parseInt(this.state.cost),
			  'CreatedAt': moment().format("DD/MM/YYYY"),
			}
		  }
		  console.log("sendData",sendData);
		  axios.post('/api/masternotifications/post/sendNotification', sendData)
		  .then((res) => {
		  console.log('sendDataToUser in result==>>>', res.data)
		  })
        })
        .catch((error)=>{
              console.log('error', error);
         });
    }

    serviceRequest(event){
      event.preventDefault()
      var formValues ={
          ticket_id  : event.currentTarget.id,
          serviceRequest : event.currentTarget.value,
          updatedBy   : localStorage.getItem("user_ID")  
		}
        axios.patch('/api/tickets/patch/service_request', formValues)
        .then((response)=>{
		  this.props.getData(filterData);
        })
        .catch((error)=>{
              console.log('error', error);
         });
    }

 handleChange(event){
    const name   = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  }

   handleTechnicianChange(event){
	   console.log("event",event);
    this.setState({
	  allocatedTo: event.value,
    },()=>{
		console.log("allocatedTo",this.state.allocatedTo);
	});
  }

	selectClient(event){
    event.preventDefault();
    if(this.refs.client.value === 'All') {
      var client_id = '';
    }else{
      var e = document.getElementById("clientId");
      var client_id = e.options[e.selectedIndex].id;
    }
    this.setState({clientName:this.refs.client.value})
    filterData.client_id = client_id;
    this.props.getData(filterData)
  }

  selectStatus(event){
    event.preventDefault();
    if(this.refs.status.value === 'All' ) {
      var status = openStatus;
    }else{
      var status = [this.refs.status.value];
    }
    this.setState({status:this.refs.status.value})
    filterData.status = status;
    this.props.getData(filterData)
  } 

  selectServiceRequest(event){
    event.preventDefault();
    if(this.refs.serviceRequest.value === 'All' ) {
      var serviceRequest = ['Free','Paid',null];
    }else{
      var serviceRequest = [this.refs.serviceRequest.value];
    }
    this.setState({serviceRequest:this.refs.serviceRequest.value})
    filterData.serviceRequest = serviceRequest;
    this.props.getData(filterData)
  }

  handleStatus(event){
    event.preventDefault();
    var tableObjects = this.state.tableObjects
    $('.toggleTicketStatus').removeClass('btntoggle');
     $(event.target).addClass('btntoggle');
    if($(event.target).attr('status') === "Open"){
      var status = openStatus;
      tableObjects.checkedBox = true;
    }else if($(event.target).attr('status') === "Close"){
      var status = ['Closed'];
      tableObjects.checkedBox = false;
    }
    filterData.status =status;
    this.props.getData(filterData)
    this.setState({tableObjects:tableObjects})
  }

  selectIssue(event){
    event.preventDefault();
    if(this.refs.issue.value === 'All') {
      var issue = '';
    }else{
      var issue = this.refs.issue.value;
    }
    this.setState({issue:this.refs.issue.value})
    filterData.issue = issue;
    this.props.getData(filterData)
  }

  tableSearch(event){
    event.preventDefault();
    var searchText = this.refs.tableSearch.value.trim();
    if (searchText && searchText.length !== 0) {
      filterData.searchText = searchText;
      this.props.getData(filterData);
    }  
  }
  ticketIdSearch(event){
    event.preventDefault();
    var ticketId = this.refs.ticketId.value.trim();
    this.setState({ticketId});
    filterData.ticketId = ticketId;
    this.props.getData(filterData);
  }

  selectDate(event){
    event.preventDefault();
    var date = this.refs.date.value;
    this.setState({date});
    filterData.date = date;
    this.props.getData(filterData);
  }

  handleTechnician(event){
    event.preventDefault();
    if(this.refs.technician.value === 'All') {
      var technician_id = '';
    }else{
      var e = document.getElementById("technician");
      var technician_id = e.options[e.selectedIndex].id;
    }
    this.setState({technician:this.refs.technician.value})
    filterData.technician_id = technician_id;
    this.props.getData(filterData);
  }

    resetFilter(event){
    event.preventDefault();
    filterData.startRange     = 0;
    filterData.limitRange     = 10;
    filterData.ticketId       = '';
    filterData.serviceRequest = ['Free','Paid',null];
    filterData.client_id      = '';
    filterData.issue          = ''; 
    filterData.status         = openStatus;
    filterData.technician_id  = '';     
    filterData.searchText     = ''; 
    filterData.date           = '';
    this.setState({
      date      : '',
      ticketId  : '',
      clientName: '',
      serviceRequest : '',
      technician : '',
      issue     : '',
      status    : ''
    })
    document.getElementById("open").classList.add("active");
    document.getElementById("close").classList.remove("active");
    this.props.getData(filterData);
  }


  getTypeOfIssues(){
      axios.post("/api/taskTypeMaster/get/list")
        .then((response)=>{
          this.setState({
            typeOfIssueArray : response.data
          },()=>{
          })
        })
        .catch((error)=>{
            console.log('error', error);
        })
    }  
  getTechnicianList(){
    axios.get('api/personmaster/get/personlist/technician')        
    .then((response) => {
      var technicianList = response.data.map((a, i)=>{
        return {
          label  : a.firstName +" "+ (a.middleName ? a.middleName : "")+" "+a.lastName,
          id     : a._id+"-"+a.firstName +" "+ (a.middleName ? a.middleName : "")+" "+a.lastName
        } 
      })
      this.setState({technicianList:technicianList})
    })
    .catch((error)=>{
          console.log("error = ",error);
    });
  }

    getClientName(){
      axios.get("/api/entitymaster/get/client")
        .then((response)=>{
          this.setState({
              clientArray   : response.data,
          })
          $('#Clientdata').val(this.state.clientName);
    })
    .catch((error)=>{
      console.log('error', error);
    })
    }


    assignTechnician=async(event)=>{
	  var technician_id = this.state.allocatedTo;
      var tickets_id = this.state.tableData.filter(e=>e.checked===true).map(e=>e._id);
      var ticketsID = this.state.tableData.filter(e=>e.checked===true).map(e=>e.ticketID);
      if(technician_id && technician_id.length > 0){
        if(tickets_id.length > 0){
			var i = technician_id.length - 1
        	for (i; i >= 0; i--) {
        		var formValues ={
		          tickets_id  : tickets_id,
		          status      : {
		                          value         : 'Allocated',
		                          statusBy      : localStorage.getItem("user_ID"),
		                          allocatedTo   : technician_id[i].split("-")[0],
		                          statusAt      :  new Date(),
		                        },
		          updatedBy   : localStorage.getItem("user_ID")  
		        }
		        await axios.patch('/api/tickets/patch/ticket_allocation', formValues)
		        .then((response)=>{
		        	if(response.data.updated){
	  					console.log("technician_id",technician_id,"i",i);
						var sendData = {
							"event": "Event4", //Event Name
							"intendedUser_id": technician_id[i].split("-")[0], //To user_id(ref:users)
							"intendedUserRole":"technician",
							"variables": {
							  'TechnicianName': technician_id[i].split("-")[1],
							  'TicketId' : ticketsID
							}
						  }
						  console.log("sendData",sendData)
						axios.post('/api/masternotifications/post/sendNotification', sendData)
						.then((res) => {
						console.log('sendDataToUser in result==>>>', res.data)
						})
						.catch((error) => { console.log('notification error: ',error)})
			          for(let i=0; i <this.state.tableData.length; i++){
			            this.state.tableData[i].checked = false;
			          }
			          this.props.getData(filterData);
			          $(".selectAllCheckBox").prop('checked', false); 
			          this.setState({technician:'',allocatedTo:''})
			          swal(response.data.message)
			      }else{
			      	swal(response.data.message)
			      }
		        })
		        .catch((error)=>{
		              console.log('error', error);
		         });
        	}
      }else{
        this.setState({allocatedTo:''})
        swal("Please select at least one ticket.")
      }
    }else{
      swal("Please select technician.")
    }
  }


  onKeyPress(){
	var number = document.getElementById('cost');
	console.log("number",number);
	number.onkeydown = function(e) {
			console.log("e",e);
			if(!((e.keyCode > 95 && e.keyCode < 106)
			|| (e.keyCode > 47 && e.keyCode < 58) 
			|| e.keyCode === 8|| e.keyCode === 190)) {
			return false;
		}
		}
	}
  
	
	render() {
		var ticketsLength = this.state.tableData.filter(e=>e.checked===true).length;

		const allocatedTo: object = { text: 'label', value: 'id' };
		return (
			<div id="tableComponent" className="col-lg-12 col-sm-12 col-md-12 col-xs-12 NOpadding ">
				{
					this.state.tableObjects.searchApply === true ?
						<div className="col-lg-4 col-md-4  col-xs-12 col-sm-12 pull-left">

							<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding labelform">Search</label>
							<div className="input-group inputBox-main">
								<input type="text" onChange={this.tableSearch.bind(this)} className="NOpadding-right form-control inputBox" ref="tableSearch" id="tableSearch" name="tableSearch" />
								<span className="input_status input-group-addon "><i className="fa fa-search"></i></span>
							</div>
						</div>
						:
						null
				}
				
				<div className="col-lg-3 col-md-3 col-xs-12 col-sm-12 NOpadding-right">
                  <button className="btntoggle btn toggleTicketStatus" style={{'border-radius':'0px'}} id="open"  status="Open" onClick={this.handleStatus.bind(this)}>Open Tickets</button>
                  <button className="btn toggleTicketStatus" style={{'border-radius':'0px'}}  id="close"  status="Close" onClick={this.handleStatus.bind(this)}>Closed Tickets</button>
                </div>
                <div className="col-lg-2 col-md-2 col-sm-12 col-xs-12 noPadding">
	                 <h5 className="col-lg-12 col-md-12 col-sm-11 col-xs-12 nopadding"><b>{ticketsLength}</b> Ticket Selected</h5>
	              </div>
				<span className="col-lg-2 col-md-2 col-sm-6 col-xs-12 noPadding">
                  <MultiSelectComponent id="allocatedTo" name="allocatedTo" ref={(scope) => { this.technicianList = scope; }} 
                        dataSource={this.state.technicianList}
                        change={this.handleTechnicianChange.bind(this)} mode='mode' 
                        fields={allocatedTo} placeholder="Allocate Ticket To Technician" mode="CheckBox" 
                        selectAllText="Select All" unSelectAllText="Unselect All" 
                        value={this.state.allocatedTo}
                        showSelectAll={true}>
                        <Inject services={[CheckBoxSelection]} />
                    </MultiSelectComponent>
                </span>
                <div className="col-lg-1 col-md-1 col-xs-12 col-sm-12">
                  <button className="btn btn-primary" style={{'border-radius':'0px'}} onClick={this.assignTechnician.bind(this)}>Allocate</button>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 pull-right">
					{
						this.state.tableObjects.paginationApply === true ?
						<div className="col-lg-8 col-md-2 col-sm-12 col-xs-12 ">
			                <label className="col-lg-2 col-md-2 col-sm-12 col-xs-12 labelform marginTop8">View</label>
			                <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 ">
			                  <select onChange={this.setLimit.bind(this)} value={this.state.nPerPage} id="nPerPage" ref="nPerPage" name="nPerPage" className="col-lg-12 col-md-12 col-sm-6 col-xs-12  noPadding form-control">
			                    <option value="Not Selected" disabled>Select Limit</option>
			                    <option value={10}>10</option>
			                    <option value={15}>15</option>
			                    <option value={25}>25</option>
			                    <option value={50}>50</option>
			                    <option value={100}>100</option>
			                    <option value={500}>500</option>
			                    <option value={1000}>1000</option>
			                    <option value={1500}>1500</option>
			                    <option value={2000}>2000</option>
			                    <option value={5000}>5000</option>
			                    <option value={10000}>10000</option>
			                  </select>
			                </div>
			                <label className="col-lg-4 col-md-3 col-sm-12 col-xs-12 labelform marginTop8 ">Per Page</label>
			              </div>
							:
							null
					}
					{this.state.tableObjects.downloadApply === true ?
						this.state.tableData && this.state.id && this.state.tableName && this.state.tableData.length !== 0 ?
							<div className="col-lg-4 NOpadding">
								<div className="col-lg-12 col-md-2 col-xs-12 col-sm-12 pull-right">
									<button type="button" className="btn pull-left tableprintincon" title="Print Table" onClick={this.printTable}><i className="fa fa-print" aria-hidden="true"></i></button>
									<ReactHTMLTableToExcel
										id="table-to-xls"
										className="download-table-xls-button fa fa-download tableicons pull-right"
										table={"Download-"+this.state.id}
										sheet="tablexls"
										filename={this.state.tableName}
										buttonText="" />
								</div>
							</div>		
							: null

						: null
					}
				</div>
				
				<div className="col-lg-12 col-sm-12 col-md-12 col-xs-12  marginTop8 ">
					<div className="table-responsive" id="section-to-print">
						<table className="table iAssureITtable-bordered table-striped table-hover fixedTable" id={this.state.id}>
							<thead className="tempTableHeader fixedHeader">
								<tr className="tempTableHeader">
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
									{this.state.tableObjects.checkedBox ?
										<th className="umDynamicHeader srpadd text-center">Select</th>

										:
										<th className="umDynamicHeader srpadd text-center">Select</th>
									}
									{this.state.tableObjects.serialNo ?
										<th className="umDynamicHeader srpadd text-center">Sr. No.</th>
										:
										null
									}		
									{this.state.tableHeading ?
										Object.entries(this.state.tableHeading).map(
											([key, value], i) => {
												if (key === 'actions') {
													return (
														<th key={i} className="umDynamicHeader srpadd text-center" id="ActionContent">{value}</th>
													);
												} else {
													return (
														<th key={i} className="umDynamicHeader srpadd textAlignLeft" >{value} <span onClick={this.sort.bind(this)} id={key} className="fa fa-sort tableSort" ></span></th>
													);
												}

											}
										)
										:
										<th className="umDynamicHeader srpadd textAlignLeft"></th>
									}
								</tr>
								{<tr className="bg-info">
									{this.state.tableObjects.checkedBox ?
										<th className="umDynamicHeader checkAll srpadd text-center"><input type="checkbox"  className='selectAllCheckBox' id="selectAllCheckBox" onClick={this.selectAllCheckBox.bind(this)}/></th>

										:
										<td className="textAlignCenter"><input type="checkbox" className='check individual pointer propCheck' disabled /></td>
									}
									{this.state.tableHeading.ticketId ?
										<th className="umDynamicHeader srpadd text-center"> <input type="text" placeHolder="" value={this.state.ticketId} onChange={this.ticketIdSearch.bind(this)} className="form-control" ref="ticketId" id="ticketId" name="ticketId"  /></th>
										:
										null
									}
									{this.state.tableHeading.client ?
										<th className="umDynamicHeader srpadd text-center "> 
											<select onChange={this.selectClient.bind(this)} value={this.state.clientName} id="clientId" ref="client" name="client" className=" noPadding form-control" s>
	                                            <option value="Not Selected" disabled>Select Limit</option>
	                                            <option value='All'>All</option>
	                                            {
	                                                this.state.clientArray && this.state.clientArray.length > 0 ?
	                                                this.state.clientArray.map((client, index)=>{
	                                                  return(      
	                                                      <option key={index} id={client._id} value={client.companyName}>{client.companyName}</option>
	                                                  );
	                                                }
	                                              ) : ''
	                                            }   
	                                        </select>
										</th>
										:
										null
									}
									{/*this.state.tableHeading.project ?
										<th className="umDynamicHeader srpadd text-center"> 
											<select onChange={this.selectClient.bind(this)} value={this.state.project} id="client" ref="client" name="client" className="  noPadding form-control" >
	                                            <option value="Not Selected" disabled>Select Limit</option>
	                                            <option value='All'>All</option>
	                                            {
	                                                this.state.clientArray && this.state.clientArray.length > 0 ?
	                                                this.state.clientArray.map((client, index)=>{
	                                                  return(      
	                                                      <option key={index} id={client._id} value={client.companyName}>{client.companyName}</option>
	                                                  );
	                                                }
	                                              ) : ''
	                                            }   
	                                        </select>
										</th>
										:
										null
									*/}
									{this.state.tableHeading.typeOfIssue ?
										<th className="umDynamicHeader srpadd text-center"> 
											 <select onChange={this.selectIssue.bind(this)} value={this.state.issue} id="issue" ref="issue" name="issue" className="noPadding form-control">
		                                          <option value="Not Selected" disabled>Select issue</option>
		                                          <option value='All'>All</option>
		                                          {
		                                              this.state.typeOfIssueArray && this.state.typeOfIssueArray.length > 0 ?
		                                              this.state.typeOfIssueArray.map((issue, index)=>{
		                                                return(      
		                                                    <option key={index} value={issue.taskType}>{issue.taskType}</option>
		                                                );
		                                              }
		                                            ) : ''
		                                          }   
		                                        </select>
										</th>
										:
										null
									}	
									{this.state.tableHeading.displayStatus ?
										<th className="umDynamicHeader srpadd text-center"> 
											 <select onChange={this.selectStatus.bind(this)} value={this.state.status} id="status" ref="status" name="status" className="noPadding form-control" >
		                                          <option value="Not Selected" disabled>Select Status</option>
		                                          <option value='All'>All</option>
		                                          <option value='New'>New</option>
		                                          <option value='Acknowledged'>Acknowledged</option>
		                                          <option value='Allocated'>Allocated</option>
		                                          <option value='Assignee Accepted'>Assignee Accepted</option>
		                                          <option value='Assignee Rejected'>Assignee Rejected</option>
		                                          <option value='Resolved'>Resolved</option>
		                                          <option value='Work Started'>Work Started</option>
		                                          <option value='Work In Progress'>Work In Progress</option>
		                                          <option value='Reopen'>Reopen</option>
		                                          <option value='Paid Service Request'>Paid Service Request</option>
		                                          <option value='Paid Service Approved'>Paid Service Approved</option>
		                                          <option value='Paid Service Rejected'>Paid Service Rejected</option>
		                                          <option value='Closed'>Closed</option>
		                                       </select>
										</th>
										:
										null
									}	
									{this.state.tableHeading.displayServiceReq ?
										<th className="umDynamicHeader srpadd text-center"> 
											 <select onChange={this.selectServiceRequest.bind(this)} value={this.state.serviceRequest} id="serviceRequest" ref="serviceRequest" name="serviceRequest" className="noPadding form-control" >
		                                          <option value="Not Selected" disabled>Select Request</option>
		                                          <option value='All'>All</option>
		                                          <option value='Free'>Free</option>
		                                          <option value='Paid'>Paid</option>
		                                       </select>
										</th>
										:
										null
									}
									{this.state.tableHeading.assignTo ?
										<th className="umDynamicHeader srpadd text-center" > 
											 <select onChange={this.handleTechnician.bind(this)} value={this.state.technician} id="technician" ref="technician" name="technician" className="noPadding form-control">
	                                            <option value="Not Selected" disabled>Select Technician</option>
	                                            <option value='All'>All</option>
	                                            {
	                                                this.state.technicianList && this.state.technicianList.length > 0 ?
	                                                this.state.technicianList.map((result, index)=>{
	                                                  return(      
	                                                      <option key={index} id={result.id} value={result.label}>{result.label}</option>
	                                                  );
	                                                }
	                                              ) : ''
	                                            }   
	                                          </select>
										</th>
										:
										null
									}
									{this.state.tableHeading.createdAt ?
										<th className="umDynamicHeader srpadd text-center"> 
											 <input type='date' ref='date' name='date' value={this.state.date} onChange={this.selectDate.bind(this)} className="form-control" style={{'width':'170px'}}/>
										</th>
										:
										null
									}
									{this.state.tableHeading.actions ?
										<th colSpan={2} className="umDynamicHeader srpadd text-center col-lg-1"> 
										<span className="glyphicon glyphicon-repeat btn tempTableHeader"   onClick={this.resetFilter.bind(this)}/>
										</th>
										:
										null
									}		
								</tr>}
							</thead>
							<tbody className="scrollContent">
							{this.props.isLoading ?
	                           	<tr className="trAdmin"><td colSpan={this.state.tableHeading ? Object.keys(this.state.tableHeading).length+1 : 1} className="noTempData textAlignCenter">
									<Loader
							         type="TailSpin"
							         color={'var(--blue-color )'}
							         height="50"
							         width="50"
							      /> 
							      </td>
							    </tr>  
							    :  
	                            (this.state.tableData && this.state.tableData.length > 0 ?
									this.state.tableData.map(
										(value, i) => {
											return (
												<tr key={i} className="">
													{
														this.state.tableObjects.checkedBox  && (value.status ===  "New"  ||value.status === "Acknowledged")? 	
															value.status === "Acknowledged" && value.serviceRequest==="Free" ?
															<td className="textAlignCenter"><input type="checkbox" className='check individual pointer propCheck'  checked={value.checked} id={value._id} onClick={this.setlectTicket.bind(this)} value={value._id}/></td>
															:
															<td className="textAlignCenter"><input type="checkbox" className='check individual pointer propCheck' disabled checked={value.checked} id={value._id} onClick={this.setlectTicket.bind(this)} value={value._id}/></td>
														:
														value.status === "Resolved" || value.status === "Closed" ?
														<td className="textAlignCenter"><input type="checkbox" className='check individual pointer propCheck' disabled checked={value.checked} id={value._id} onClick={this.setlectTicket.bind(this)} value={value._id}/></td>
														:
														<td className="textAlignCenter"><input type="checkbox" className='check individual pointer propCheck' checked={value.checked} id={value._id} onClick={this.setlectTicket.bind(this)} value={value._id}/></td>
													}
													{this.state.tableObjects.serialNo ?
														<td className="textAlignCenter">{this.state.startRange + 1 + i}</td>
														:
														null
													}
													{
														Object.entries(value).map(
															([key, value1], i) => {
																if ($.type(value1) === 'string') {
																	var regex = new RegExp(/(<([^>]+)>)/ig);
																	var value2 = value1 ? value1.replace(regex, '') : '';
																	var aN = value2.replace(this.state.reA, "");
																	if (aN && $.type(aN) === 'string') {
																		var textAlign = 'textAlignLeft noWrapText'
																	} else {
																		var bN = value1 ? parseInt(value1.replace(this.state.reN, ""), 10) : '';
																		if (bN) {
																			var textAlign = 'textAlignLeft';
																		} else {
																			var textAlign = 'textAlignLeft noWrapText';
																		}
																	}
																} else {
																	var textAlign = 'textAlignLeft';
																}
																var found = Object.keys(this.state.tableHeading).filter((k) => {
																	return k === key;
																});
																if (found.length > 0) {
																	if (key !== 'id') {
																		if(key==="displayServiceReq"){
																			return(
																				<td className={textAlign} key={i}>
																					{value.status === "Acknowledged"  && value.serviceRequest === "Paid" ?
																						null
																						:
																						<div className={textAlign} dangerouslySetInnerHTML={{ __html: value1 }}></div>

																					}
																					{
																						value.status === "New" ? 
																						<button className='btn btn-primary' style={{'width':'100%'}} id={value._id} onClick={this.props.updateStatus.bind(this)}>Acknowlege</button>
																						:
																						value.status === "Acknowledged" &&  !value.serviceRequest?
																						<div className='col-lg-12 noPadding tdWrap'>
																								<button class="col-lg-5 btn btn-success pull-left text-center"  style={{'padding':'5px 0px'}} type="button" value="Free"   id={value._id} onClick={this.serviceRequest.bind(this)}>Free</button>
																								<button class="col-lg-5 btn btn-primary pull-right text-center" style={{'padding':'5px 0px'}} type="button" value="Paid"  id={value._id} onClick={this.serviceRequest.bind(this)}>Paid</button>
																						</div>
																						:
																						value.status === "Acknowledged"  && value.serviceRequest === "Paid"?
																						<div className='input-group' style={{'width':'100%'}}>
																								<span className="input-group-addon"><i className="fa fa-rupee"></i></span>
														                                    	<input type="number" className="form-control" ref="cost" name="cost" value={this.state.cost} min="0" onKeyDown={this.onKeyPress.bind(this)} id="cost" onChange={this.handleChange.bind(this)} style={{'width':"80px"}}/>
																								<span class="input-group-btn" id={value._id} onClick={this.paidRequest.bind(this)}>
																									<button class="btn btn-primary" type="button">Paid</button>
																								</span>
																						</div>
																						:
																						!value.serviceRequest ?
																						"NA"
																						:
																						null
																					}
																				</td>
																			);
																		}else if(key==="ticketId"){
																			return(<td className="textAlignCenter" key={i} ><div className="textAlignCenter" dangerouslySetInnerHTML={{ __html:value1}}></div></td>);
																		}else{
																			return(<td className={textAlign} key={i} ><div className={textAlign} dangerouslySetInnerHTML={{ __html:value1}}></div></td>);
																		}		
																	}
																}

															}
														)
													}
													{this.state.tableHeading && this.state.tableHeading.actions ?
														<td className="textAlignLeft" id="ActionContent">
															<div style={{'width':'60px'}}>
																<i className="fa fa-eye" title="View" id={value._id.split("-").join("/")} onClick={()=>this.props.history.push('/ticketview/'+value._id)}></i>&nbsp; &nbsp;
																	{this.props.tableObjects.editUrl ?
																	<i className="fa fa-pencil" title="Edit" id={value._id.split("-").join("/")} onClick={this.edit.bind(this)}></i> : null}&nbsp; &nbsp;
																	{this.props.editId && this.props.editId === value._id ? null : <i className={"fa fa-trash redFont " + value._id} id={value._id + '-Delete'} data-toggle="modal" title="Delete" data-target={"#showDeleteModal-" + value._id}></i>}
															</div>
															{/*<div className=" dropdown col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding  marginTop12">
																<div className=" col-lg-4 col-md-8 col-sm-8 col-xs-8">
																	<i className="fa fa-ellipsis-v" aria-hidden="true"></i>
														    		<div className="dropdown-content" >
																		<ul className="pdcls ulbtm">
																			<li id={value._id.split("-").join("/")} title="View Ticket"  onClick={()=>this.props.history.push('/ticketview/'+value._id)}>
																				<a><i className="fa fa-eye "aria-hidden="true"></i>&nbsp;&nbsp;View Ticket</a>
																			</li>
																			<li id={value._id.split("-").join("/")} title="Edit Ticket"  onClick={this.edit.bind(this)}>
																				<a><i className="fa fa-pencil "aria-hidden="true"></i>&nbsp;&nbsp;Edit Ticket</a>
																			</li>
																			<li id={value._id.split("-").join("/")} title="Delete Ticket"  id={value._id + '-Delete'} data-toggle="modal"  data-target={"#showDeleteModal-" + value._id}>
																				<a><i className="fa fa-trash redFont"aria-hidden="true"></i>&nbsp;&nbsp;Delete Ticket</a>
																			</li>
																			
																		</ul>
																	</div>
																</div>
															</div>*/}
															<div className="modal" id={"showDeleteModal-" + value._id} role="dialog">
																<div className=" adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
																	<div className="modal-content adminModal-content col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
																		<div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
																			<div className="adminCloseCircleDiv pull-right  col-lg-1 col-lg-offset-11 col-md-1 col-md-offset-11 col-sm-1 col-sm-offset-11 col-xs-12 NOpadding-left NOpadding-right">
																				<button type="button" className="adminCloseButton" data-dismiss="modal" data-target={"#showDeleteModal-" + value._id}>&times;</button>
																			</div>

																		</div>
																		<div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
																			<h4 className="blackLightFont textAlignCenter examDeleteFont col-lg-12 col-md-12 col-sm-12 col-xs-12">Are you sure you want to delete?</h4>
																		</div>

																		<div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
																			<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
																				<button type="button" className="btn adminCancel-btn col-lg-7 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
																			</div>
																			<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
																				<button onClick={this.delete.bind(this)} id={(value._id).replace(/-/g, "/")} type="button" className="btn examDelete-btn col-lg-7 col-lg-offset-5 col-md-7 col-md-offset-5 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">DELETE</button>
																			</div>
																		</div>
																	</div>
																</div>
															</div>

														</td>
														:
														null
													}
												</tr>
											);
										}
									)
									:
									<tr className="trAdmin"><td colSpan={this.state.tableHeading ? Object.keys(this.state.tableHeading).length + 2 : 1} className="noTempData textAlignCenter">No Record Found!</td></tr>
								)}
							</tbody>
						</table>

					</div>

				{/*Export To Excel*/}
					<div className="table-responsive" id="HideTable">
						<table className="table iAssureITtable-bordered table-striped table-hover fixedTable" id={"Download-"+this.state.id}>
							<thead className="tempTableHeader fixedHeader">
								<tr className="tempTableHeader">
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
									<th className="umDynamicHeader srpadd text-center">Sr. No.</th>
									{this.state.tableHeading ?
										Object.entries(this.state.tableHeading).map(
											([key, value], i) => {
												if (key === 'actions') {
													return (
														null
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
													<td className="textAlignCenter">{this.state.startRange + 1 + i}</td>
													{
														Object.entries(value).map(
															([key, value1], i) => {
																if ($.type(value1) === 'string') {
																	var regex = new RegExp(/(<([^>]+)>)/ig);
																	var value2 = value1 ? value1.replace(regex, '') : '';
																	var aN = value2.replace(this.state.reA, "");
																	if (aN && $.type(aN) === 'string') {
																		var textAlign = 'textAlignLeft noWrapText'
																	} else {
																		var bN = value1 ? parseInt(value1.replace(this.state.reN, ""), 10) : '';
																		if (bN) {
																			var textAlign = 'textAlignRight';
																		} else {
																			var textAlign = 'textAlignLeft noWrapText';
																		}
																	}
																} else {
																	var textAlign = 'textAlignRight';
																}
																var found = Object.keys(this.state.tableHeading).filter((k) => {
																	return k === key;
																});
																if (found.length > 0) {
																	if (key !== 'id') {
																		return (<td className={textAlign} key={i}><div className={textAlign} dangerouslySetInnerHTML={{ __html: value1 }}></div></td>);
																	}
																}

															}
														)
													}
													
												</tr>
											);
										}
									)
									:
									<tr className="trAdmin"><td colSpan={this.state.tableHeading ? Object.keys(this.state.tableHeading).length + 1 : 1} className="noTempData textAlignCenter">No Record Found!</td></tr>
								}
							</tbody>
						</table>
					</div>
					<div className="col-lg-12">
						<div className="noPadding  pull-left" style={{marginTop:'25px'}}>
							Showing {(this.state.pageNumber*this.state.nPerPage)+1} to {(this.state.pageNumber*this.state.nPerPage)+this.state.tableData.length} of {this.state.dataCount} entries
					    </div>   
						<div className="noPadding pull-right">
							<ReactPaginate
					          previousLabel={'Previous'}
					          nextLabel={'Next'}
					          breakLabel={'...'}
					          breakClassName={'break-me'}
					          pageCount={this.state.dataCount/this.state.nPerPage}
					          marginPagesDisplayed={2}
					          pageRangeDisplayed={5}
					          onPageChange={this.handlePageClick}
					          containerClassName={'pagination'}
					          subContainerClassName={'pages pagination'}
					          activeClassName={'active'}
					        />
					    </div>    
					</div>
				</div>
			</div>
		);

	}

}

export default withRouter(IAssureTable);