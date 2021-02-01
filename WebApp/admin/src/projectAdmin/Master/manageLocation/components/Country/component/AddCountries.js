	import React, { Component } from 'react';
	import { render } from 'react-dom';
	import $              from 'jquery';
	
	
	
	import ReactTable       from "react-table";

	import swal from 'sweetalert';

	/*import {Countries} 	 		from '/imports/admin/masterData/manageLocation/components/Country/component/Countries.js';
	import AddBulkupload 		from '/imports/admin/masterData/manageLocation/components/Country/component/AddBulkupload.jsx';
	import AddCountrydatalist 	from '/imports/admin/masterData/manageLocation/components/Country/component/AddCountrydatalist.jsx';*/
	import Form from 'react-validation/build/form';


	export default class AddCountries extends Component {

		constructor(props){
			super(props);
			this.state = {
				'roleSett': '',
				'firstname':'',
				'startRange': 0,
				'limitRange':10,
				'counter': 1,
				'dataRange':10,
				'adminShowAll':'Admin',
				'negativeCounter' : 2,
				'usersListData' : false,
				'paginationArray': [],
				'department'  : 'all',
				'blockActive' : 'all',
				'roleListDropdown':'all',
				'resetPasswordConfirm' : '',
				'resetPassword': '',
				button 			: "ADD",
				country    		: '',
				countryId       : '',
				toggleUploadBtn : 'Bulk Upload',
				options 	    : 'manual',
				data 			: '',

			}
			this.handleChange = this.handleChange.bind(this);
		
		}
		countryListData(){
			// return Countries.find({}).fetch();
		}
		 handleChange(event){
	    	event.preventDefault();
	    	   const target = event.target;
			   const name   = target.name;
			   this.setState({
			    [name]: event.target.value,
			   });
	  
	    }

	    componentDidMount(){
	    	/*$.validator.addMethod("regx1", function(value, element, regexpr) {          
		      return regexpr.test(value);
		    }, "It should only contain letters.");
		     jQuery.validator.setDefaults({
		      debug: true,
		      success: "valid"
		    });
		    $("#addcountryform").validate({
		      rules: {
		        country: {
		          required: true,
	          	  regx1: /^[A-za-z']+( [A-Za-z']+)*$/,
		        },
		      },
		      messages: {
		      	country: {
		      		required: "This field is required"
		      	}
		      }
		      
		    });*/

		   
			function sortTable(n) {
					  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
					  table = document.getElementById("myTable");
					  switching = true;
					  //Set the sorting direction to ascending:
					  dir = "asc"; 
					  /*Make a loop that will continue until
					  no switching has been done:*/
					  while (switching) {
					    //start by saying: no switching is done:
					    switching = false;
					    rows = table.rows;
					    /*Loop through all table rows (except the
					    first, which contains table headers):*/
					    for (i = 1; i < (rows.length - 1); i++) {
					      //start by saying there should be no switching:
					      shouldSwitch = false;
					      /*Get the two elements you want to compare,
					      one from current row and one from the next:*/
					      x = rows[i].getElementsByTagName("TD")[n];
					      y = rows[i + 1].getElementsByTagName("TD")[n];
					      /*check if the two rows should switch place,
					      based on the direction, asc or desc:*/
					      if (dir == "asc") {
					        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
					          //if so, mark as a switch and break the loop:
					          shouldSwitch= true;
					          break;
					        }
					      } else if (dir == "desc") {
					        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
					          //if so, mark as a switch and break the loop:
					          shouldSwitch = true;
					          break;
					        }
					      }
					    }
					    if (shouldSwitch) {
					      /*If a switch has been marked, make the switch
					      and mark that a switch has been done:*/
					      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
					      switching = true;
					      //Each time a switch is done, increase this count by 1:
					      switchcount ++;      
					    } else {
					      /*If no switching has been done AND the direction is "asc",
					      set the direction to "desc" and run the while loop again.*/
					      if (switchcount == 0 && dir == "asc") {
					        dir = "desc";
					        switching = true;
					      }
					    }
					  }
					}
	    }

	      componentWillReceiveProps(nextProps){
			var country = nextProps.sortedDesc;
			if(!nextProps.loading){
      			if(nextProps.singleCountry){
      				this.setState({
      					button            : nextProps.button,
      				});
      			}
      		}else{
      			this.setState({
			            button             : "ADD",
			      });
      		}
			this.setState({
				country 		: nextProps.countryName,
			
				data 			: nextProps.sortedDesc,
			});


				// window.onscroll = function() {myFunction()};

				// 	var header = document.getElementById("myHeader0");
				// 	var sticky = header.offsetTop;

				// 	function myFunction() {
				// 	  if (window.pageYOffset > sticky) {
				// 	    header.classList.add("sticky");
				// 	  } else {
				// 	    header.classList.remove("sticky");
				// 	  }
				// 	}

			// $(function() {
			//     $(window).on("scroll", function() {
			//         if($(window).scrollTop() > 250) {
			//             $(".header1").addClass("activ");
			//         } else {
			//             //remove the background property so it comes transparent again (defined in your css)
			//            $(".header1").removeClass("activ");
			//         }
			//     });
			// });

		}

		toggleBulkBtn(event) {
			event.preventDefault();
			if (this.state.toggleUploadBtn == 'Bulk Upload') {
		
				var toggleVal = 'Country Bulk Upload';
				$("#bulkuploads").css('display', 'block');
				$("#addcountryform").css('display', 'none');
			} else {
			
				var toggleVal = 'Bulk Upload';
				$("#addcountryform").css('display', 'block');
				$("#bulkuploads").css('display', 'none');

			}
			this.setState({
				'toggleUploadBtn': toggleVal,
			});

		}

		addcountry(event){
			event.preventDefault();	
			  	var CountriesValues = {
					"country" 		: this.state.country,	
				
				}		
		     
		    if($('#addcountryform').valid()){
		    	if(this.props.post.find(e=> e.countryName.toUpperCase() == CountriesValues.country.toUpperCase())){	
		    		swal({text:"Country Already Added!",timer:1500});
		    	}else{	    		
				 /*   Meteor.call('insertCountries',CountriesValues,
				                (error, result)=> { 
				                    if (error) {
				                      
				                        swal(error.reason);
				                    } 
				                    else {
				                    	if(result == 'exist'){
				                         swal({
				                         	
				                         	text:"Country Already Added!"
				                         });
				                    	}else{
				                    	 swal({
						                    text: "Country Added Successfully!", 
						                    timer:2000
						                	});
				                    	}
				      					this.setState({
				      						country : '',
				      						countryId : ''
				      					})	
				                    }
				                }
				        );*/
		    	}	
			}

		}



	  componentDidUpdate(){
	    $('.pagination'+this.state.counter).addClass("active");
	    // Session.set('pageUMNumber',this.state.counter);
	    // if(Session.get("usermanagementcount"))
	  }
	  /*handleSubmit(event){
	  	event.preventDefault();
	  	if($('#addcountryform').valid()){
	  		
	  	var CountriesValues = {
					"country" 		: this.refs.country.value,
				}
		var id          = FlowRouter.getParam('id');
		var countryExist= Countries.findOne({"countryName": CountriesValues.country});
		if(id){
			Meteor.call('updateCountries',id,CountriesValues,(error,result)=>{
				if(error){
					console.log(error.reason);
				}else{
					swal("Done","Country updated successfully");
					this.setState({
		              brand        : '',  
		              button       : "ADD",           
		           });
				}
			});
		}else{
			if(countryExist){
				swal("Oops...!","Country is already added!");
			}else{
				Meteor.call("insertCountries",CountriesValues,(error,result)=>{
					if(error){
						console.log(error.reason);
					}else{
						swal("Done","Country added successfully");
						this.setState({
							country:"",
						});
					}
				});
			}
		}
	  }
	  	}
	}*/

		updateCountry(event){
		  event.preventDefault();
	      var countryId    = this.state.countryId;
/*	      console.log("update func countryId", countryId);
*/	      var countryName  = {
	      	"country": this.state.country,
	      }
	      if($('#addcountryform').valid()){	
	     /* Meteor.call('updateCountries', countryId, countryName,
	                (error, result)=> { 
	                    if (error) {
	                        console.log ( error ); 
	                    } //info about what went wrong 
	                    else {
	                    	swal({
				                    
				                    text: "Country Modified Successfully!",
				                    timer: 2000
				                });
	                    	this.setState({
		      						country : '',
		      						countryId : '',

		      					})
	                    }
	                }
	        	);*/
	        }
	        console.log("after update func this.state.countryId",this.state.countryId);	

		}

		
		delRole(event){
		  event.preventDefault();
		  let id = $(event.currentTarget).attr("id");
		  swal({
		  	text: "Are you sure you want to delete this Country?",
	        buttons: {confirm:'Yes',cancel:'No'},
	        confirmButtonColor: "#DD6B55",
	        className: "confirmSwal",
	        closeOnConfirm: false,
	        content: false
	    }).then((willDelete)=>{
	    	if(willDelete){
	    		/*Meteor.call('deleteCountries',id,
			        (error, result)=> { 
			            if(error){
			                swal( error.reason ); 
			            }else{
			            	swal({
			                timer: 2000,
			                text: "Country Deleted successfully!",
			            });
			                this.setState({
				      						country : '',
				      						countryId : ''
				      					})	

			            }	            
			        });	*/
	    	}
	    })
	}

		uploadCSV(event){
	        event.preventDefault();
	        
	        // UserSession.delete("progressbarSession", Meteor.userId());
	        
	        /*Papa.parse( event.target.files[0], {
			    header: true,
			    complete( results, file ) {
			    	Meteor.call( 'CSVUploadCountries', results.data, ( error, result ) => {
	                	if ( error ){
	                        swal(error.reason);
	         			} else {
	         				
	                    	if(result > 0){
	                            swal({
	                                position : 'top-right',
	                                type     : 'success',
	                                title    : 'abc',
	                                text     : "Countries Added Successfully!",
	                                showConfirmButton : false,
	                                timer    : 1500
	                            });
	                            $('#addcountrie' ).css({'display':'block'});
					              			$('#bulkuploads').css({'display':'none'});	
	    
	                            $(".uploadFileInput").val('');
	                            setTimeout(()=>{ 
	                                
	                                UserSession.delete("allProgressbarSession", Meteor.userId());
	                                UserSession.delete("progressbarSession", Meteor.userId());
	                            }, 8000);
	                    	}else{
		                            swal({
	                                position 		  : 'top-right',
	                                type     		  : 'warning',
	                                title    		  : 'Nothing to upload.',
	                                showConfirmButton : true,
	                                
	                            }); 
	                            $('#addcountrie' ).css({'display':'block'});
								$('#bulkuploads').css({'display':'none'});	                      		
	                        }       
	         			}
	      			});

			    }
	        });*/
	    }


		editCountry(event){
			/*event.preventDefault();
			$("html,body").scrollTop(0);
			$('#addcountrie' ).css({'display':'block'});
			$('#bulkuploads').css({'display':'none'});	
			$("#addcountryform").validate().resetForm();
			this.setState({
				options : 'manual'
			}) 
			var countryId = event.currentTarget.id;
			var countrydata = Countries.findOne({"_id":countryId});
			if(countrydata){
				this.setState({
					country 		: countrydata.countryName,
					countryId   	: countrydata._id
				})
			}*/
		}

		showBtn(){
			if(this.state.countryId){
				return(
					<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn updateBTN btn-temp" onClick={this.updateCountry.bind(this)}>UPDATE</button>
				)
			}else{
				return(
					<button type="submit" className="pull-right col-lg-2 col-md-2 col-sm-12 col-xs-12 btn btnSubmit btn-temp" onClick={this.addcountry.bind(this)}>ADD</button>
				)
			}
		}

		// countrysortup(){
	 //  		$("#countrysortup").css('display', 'none');
		// 	$("#countrysortdown").css('display', 'inline-block');	
			
		// 	var sortedAsc =  this.props.sortedDesc.sort(function(a, b){
		// 	  return a.countryName > b.countryName;
		// 	});
		// 	this.setState({
		// 		data : sortedAsc,
		// 	});
	 //  	} 
	 //  	countrysortdown(){
	 //  		$("#countrysortup").css('display', 'inline-block');
		// 	$("#countrysortdown").css('display', 'none');
				
	 //  		var sortedDesc = this.props.sortedDesc.sort(function(a, b){
		// 	  return a.countryName > b.countryName;
		// 	}).reverse();
		// 		// var sortedDesc = _.sortBy(this.state.usersListData, 'profile.fullName').reverse();
		// 	// console.log("sortedDesc=",sortedDesc);
		// 	this.setState({
		// 		data : sortedDesc,
		// 	});
	 //  	}
	   countrysortup(){
  		$("#countrysortup").css('display', 'none');
		$("#countrysortdown").css('display', 'inline-block');	
		
		var sortedAsc =  this.state.data.sort(function(a, b){
		  return a.countryName > b.countryName;
		});
		this.setState({
			data : sortedAsc,
		});
  	} 
  	countrysortdown(){
  		$("#countrysortup").css('display', 'inline-block');
		$("#countrysortdown").css('display', 'none');
			
  		var sortedDesc = this.state.data.sort(function(a, b){
		  return a.countryName > b.countryName;
		}).reverse();
			
		this.setState({
			data : sortedDesc,
		});
  	}
		

		handleInputChange(event) {
		    const target = event.target;
		    const name = target.name;

		    this.setState({
		      [name]: event.target.value
		    });

		}

		render(){
			
			var locationArray = [];
			if(this.state.countryId){
				var event = this.updateCountry.bind(this)
			}else{
				var event = this.addcountry.bind(this)
			}
			const data = this.props.post;
			const columns = [
				{
					Header: 'Sr. No.',
					id: 'row',
					Cell:row=>
						<span>{row.index + 1}</span>
				},
				{
					Header: 'Country',
					accessor: 'countryName'
				},
				{
					Header: 'Actions',
					accessor: '_id',
					Cell:row=>(
							<div>
								<i className="fa fa-pencil action-btn" aria-hidden="true" title="Edit Country" id={row.value} onClick={this.editCountry.bind(this)} ></i> &nbsp;  &nbsp;
								<i className="fa fa-trash redFont action-btn" aria-hidden="true" onClick={this.delRole.bind(this)} id={row.value} title="Delete Country" ></i>
							</div>
						)
				}
			]
	       return(
				<div className="">
						<div className=""  id="addcountrie">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 wrapperTitle formgroupheight pt20">
								<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 addLoc">
									<h4 className="manageLocTitle"><i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Add Countries</h4>
								</div>
								
								{/*<div className="switchField col-lg-6 col-md-6 col-sm-12 col-xs-12 manual-auto">
									 <ul className="nav nav-pills nav-pillss location pull-right">
                                        <li className="active text-center  transactionTab masterDataTab">
                                            <a href="#countryform" className="tab-align" data-toggle="tab" onClick={()=>this.changeTab('location')} >
                                            	Manual
                                            </a>
                                        </li>
                                        <li className="text-center  transactionTab masterDataTab">
                                            <a href="#csvUpload" className="tab-align" data-toggle="tab" onClick={()=>this.changeTab('area')}>
                                            	Auto
                                            </a>
                                        </li>
                                      </ul>

								</div>*/}
							</div>
							<div className='tab-content col-lg-12 col-md-12 col-sm-12 col-xs-12'>
								<div className='tab-pane active' id="countryform">
									<form id="addcountryform" onSubmit={event}>	
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls countryField padding-zero" >
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formht">
												<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 form-group ht80">
													<div className="form-group">
													    <label className="control-label statelabel col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls padding-zero" >Country<span className="astrick">*</span></label>
													    <input className="form-control areaStaes" id="country" value={this.state.country} ref="country"  type="text" name="country" title="Please enter valid country name!" onChange={this.handleChange.bind(this)} required/>
													</div>
												</div>
											</div>	
										</div>										
									</form>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pr28">
											{this.showBtn()}	
									</div>
								</div>
								{/*<div className='tab-pane' id="csvUpload">
									<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12" >
										<div className="csvDLWrap">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bulkUploadForm">
												<div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 bulkImage">
													<div className="csvIcon">
														<a href="/csv/country.csv" download>
															<img src="/images/csv.jpg" className="csvimg" title="Click to download file"/>
														</a>
													</div>
												</div>
												<div className="col-lg-11 col-md-12 col-sm-12 col-xs-12">
													<h4><b>Instructions</b></h4>
													<ul className="uploadQuesinst col-lg-10 col-md-10 col-sm-12 col-xs-12">
														<li><b>1)</b>&nbsp;&nbsp;Please use attached file format to bulkupload <b>Country Data</b> into this system.</li>
														<li><b>2)</b>  File Format must be *.CSV.</li>
														<li><b>3)</b>  Following is the format of .CSV file.</li>
																			
													</ul>
												</div>
												<div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12"><span className="control-label statelabel"><b>Upload Countries</b></span></div>
												<div className="col-lg-11 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 inputBulk">
													<div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 inputFieldBulk">
														<input type="file" onChange={this.uploadCSV.bind(this)} name="uploadCSV" ref="uploadCSV"  accept=".csv" className="form-control col-lg-6 col-md-12 col-sm-12 col-xs-12 uploadFileInput" required/>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>*/}								
							</div>							
						</div>
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  usrmgnhead">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								{/*<table id="listOfUsersDwnld" className="UMTableSAU table  myTable dataTable  no-footer formTable col-lg-12 col-md-12 col-sm-10 col-xs-12" >
									<thead className="table-head tablebodyfix "  >
										<tr className="tempTableHeader " >
											<th className="umHeader" onClick="sortTable(0)">Country
												<span className="" >
												</span>

											</th>
											
											<th className="umHeader" onClick="sortTable(1)"> Action</th>
										</tr>
									</thead>
												  
											
									{this.props.sortedDesc ?
										this.props.sortedDesc.length>0 ? 
														

											<tbody className="noLRPad tableheaderfix">
													{this.props.sortedDesc.map( (locationdata,index)=>{
														return(
															<tr key={index} className="tablebodyfix">
																<td className="txtcentr">{locationdata.countryName}</td>
															
																<td className="txtcentr">
																	<i className="fa fa-pencil action-btn" aria-hidden="true" title="Edit Country" id={locationdata._id} onClick={this.editCountry.bind(this)} ></i> &nbsp;  &nbsp;
																	<i className="fa fa-trash redFont action-btn" aria-hidden="true" onClick={this.delRole.bind(this)} id={locationdata._id} title="Delete Country" ></i>
																</td>
															</tr>
															)
													})}
													
											</tbody>
											:
												<td colSpan="9" className="ntdiaplay displayblck">Nothing to display.</td>
															
											:
												<tbody>
													<td colSpan="9" >
														<div className="loaderimgcent col-lg-12 col-md-12  "><img src="../images/loading.gif" className="loaderimgcent" alt="loading"/></div>											
													</td>
												</tbody>
													
											}

								</table>*/}
								<ReactTable
									data={data}
									columns={columns}
									sortable={false}
									defaultPageSize={5}
									showPagination={true} />
											
					            { 
					            	this.props.post && this.props.post.length>0 ? 
						                <div className="col-lg-12 col-md-12 col-sm-12 paginationWrap">
						                  <ul className="pagination paginationOES">
						                      {this.state.paginationArray}
						                  </ul>
						                </div>
						              :
						                null
					            }
							</div>
					</div>
					
				

				</div>			
		    );
		} 
	}


