import React,{Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import { FlowRouter} from 'meteor/ostrio:flow-router-extra';

export default class Sidebar2 extends TrackerReact(Component){

  componentDidMount(){
    if (!$('body').hasClass('adminLte')) {
          var adminLte = document.createElement("script");
          adminLte.type="text/javascript";
          adminLte.src = "/js/adminLte.js";
          $("body").append(adminLte);

    }
          $("html,body").scrollTop(0);
    }
   
  componentWillUnmount(){
      $("script[src='/js/adminLte.js']").remove();
      $("link[href='/css/dashboard.css']").remove();
  }

  accDiv(event){
    event.preventDefault();

    $(event.currentTarget).addClass('activetree');
    // console.log(' $(event.currentTarget).addClass', $(event.currentTarget).addClass('activetree'));
    $('.panel-heading').not(event.currentTarget).removeClass('activetree');

    var currVar = $( event.currentTarget ).children().children().children().siblings('.sideAngle').children('.angleArrow');
    if(currVar.hasClass('fa-angle-right')){
        $( event.currentTarget ).children().children().children().siblings('.sideAngle').children('.angleArrow').removeClass('fa-angle-right').addClass('fa-angle-down');
        $( '.panel-heading' ).not(event.currentTarget).children().children().children().siblings('.sideAngle').children('.angleArrow').removeClass('fa-angle-down').addClass('fa-angle-right');
    }else{
      $( '.panel-heading' ).children().children().children().siblings('.sideAngle').children('.angleArrow').removeClass('fa-angle-down').addClass('fa-angle-right');
    }
   
  }

  accSubmenuDiv(event){
    event.preventDefault();
    $('#search').val('');
    $(event.currentTarget).addClass('activeSubtree');
    $('.submenuBox').not(event.currentTarget).removeClass('activeSubtree');
   
  }

  render(){
    return(
        <div id="mySidenav">
        <aside className="main-sidebar control-sidebar" id="topheader">
          <section className="sidebar">
            <div className="user-panel">
              <div className="pull-left image">
                <p></p>
              </div>
              <div className="pull-left info">
                <p></p>               
              </div>
            </div>           
        
            <div className="">
               
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 sidebarWrapper">
                    <div className="panel-group" id="accordion4" role="tablist" aria-multiselectable="true">
                        <div className="panel panel-default">
                            <div className="panel-heading col-lg-12" onClick={this.accDiv.bind(this)} role="tab" id="headingOne4">
                                <h4 className="panel-title">
                                    <a role="button">
                                        <div>
                                          <a href="/admindashboard" className="active">
                                           <div className="col-lg-2">
                                            <i className="icon fa fa-globe"></i>
                                            </div>
                                            <div className="col-lg-10">
                                            Admin Dashboard
                                            </div>
                                           
                                          </a>
                                        </div>
                                    </a>
                                </h4>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading hello col-lg-12 " onClick={this.accDiv.bind(this)} role="tab" id="headingTwo4" href="#collapseTwo4" data-toggle="collapse" data-parent="#accordion4" aria-expanded="false" aria-controls="collapseTwo4">
                                <h4 className="panel-title">
                                    <a className="collapsed" role="button">
                                      <div className="col-lg-2 aa">
                                        <i className="icon fa fa-mobile"></i>
                                      </div>
                                      <div className="col-lg-8 bb">
                                        Master Data
                                      </div>
                                      <div className="col-lg-2 sideAngle">
                                        <i className="fa fa-angle-right rotate-icon angleArrow"></i>
                                      </div>
                                    </a>
                                </h4>
                            </div>
                            <div id="collapseTwo4" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo4">
                                <div className="panel-body">
                                    <div className="submenu">
                                      <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                        <a href="/ManageLocations">
                                          <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                          </div>
                                          <div className="col-lg-10">
                                            Manage Locations
                                          </div>
                                          
                                        </a>
                                      </div>
                                      <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                          <a href="/masterData/Department Name">
                                            <div className="col-lg-2">
                                              <i className="fa fa-circle-o subMenuIcon" />
                                            </div>
                                            <div className="col-lg-10">
                                              Department Name Master
                                            </div>
                                          </a>
                                      </div>
                                      <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                        <a href="/masterData/Document Type">
                                          <div className="col-lg-2">
                                            <i className="fa fa-circle-o subMenuIcon" />
                                          </div>
                                          <div className="col-lg-10">
                                            Document Type Group
                                          </div>
                                        </a>
                                      </div>
                                      <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                        <a href="/admin/documentNameMaster">
                                          <div className="col-lg-2">
                                            <i className="fa fa-circle-o subMenuIcon" />
                                          </div>
                                          <div className="col-lg-10">
                                            Document Name Master
                                          </div>
                                        </a>
                                      </div>
                                      <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                        <a href="/admin/budgetMaster">
                                          <div className="col-lg-2">
                                            <i className="fa fa-circle-o subMenuIcon" />
                                          </div>
                                          <div className="col-lg-10">
                                            Budget Master
                                          </div>
                                        </a>
                                      </div>
                                      <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                        <a href="/admin/currencyRates">
                                          <div className="col-lg-2">
                                            <i className="fa fa-circle-o subMenuIcon" />
                                          </div>
                                          <div className="col-lg-10">
                                            Currency Master
                                          </div>
                                        </a>
                                      </div>
                                      <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                        <a href="/admin/ExchangeRate">
                                          <div className="col-lg-2">
                                            <i className="fa fa-circle-o subMenuIcon" />
                                          </div>
                                          <div className="col-lg-10">
                                            Monthly Exchange Rate
                                          </div>
                                        </a>
                                      </div>
                                      <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                        <a href="/masterData/Cost Center">
                                          <div className="col-lg-2">
                                            <i className="fa fa-circle-o subMenuIcon" />
                                          </div>
                                          <div className="col-lg-10">
                                            Cost Center Group
                                          </div>
                                        </a>
                                      </div>
                                      <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                        <a href="/Cost Center Master">
                                          <div className="col-lg-2">
                                            <i className="fa fa-circle-o subMenuIcon" />
                                          </div>
                                          <div className="col-lg-10">
                                            Cost Center Master
                                          </div>
                                        </a>
                                      </div>
                                      <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                        <a href="/masterData/Designation">
                                          <div className="col-lg-2">
                                            <i className="fa fa-circle-o subMenuIcon" />
                                          </div>
                                          <div className="col-lg-10">
                                            Designation Master
                                          </div>
                                        </a>
                                      </div>
                                      <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                        <a href="/masterData/Material Category">
                                          <div className="col-lg-2">
                                            <i className="fa fa-circle-o subMenuIcon" />
                                          </div>
                                          <div className="col-lg-10">
                                            Material Category Master
                                          </div>
                                        </a>
                                      </div>
                                      <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                        <a href="/masterData/Supplier Category">
                                          <div className="col-lg-2">
                                            <i className="fa fa-circle-o subMenuIcon" />
                                          </div>
                                          <div className="col-lg-10">
                                            Supplier Category Master
                                          </div>
                                        </a>
                                      </div>
                                      <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                        <a href="/masterData/Supplier Location Type">
                                          <div className="col-lg-2">
                                            <i className="fa fa-circle-o subMenuIcon" />
                                          </div>
                                          <div className="col-lg-10">
                                            Supplier Location Type Master
                                          </div>
                                        </a>
                                      </div>
                                      <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                        <a href="/masterData/Incoterms">
                                          <div className="col-lg-2">
                                            <i className="fa fa-circle-o subMenuIcon" />
                                          </div>
                                          <div className="col-lg-10">
                                            Supplier Incoterms
                                          </div>
                                        </a>
                                      </div>
                                      <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                        <a href="/masterData/PR Type">
                                          <div className="col-lg-2">
                                            <i className="fa fa-circle-o subMenuIcon" />
                                          </div>
                                          <div className="col-lg-10">
                                            PR Type Master
                                          </div>
                                        </a>
                                      </div>
                                      <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                        <a href="/masterData/Unit">
                                          <div className="col-lg-2">
                                            <i className="fa fa-circle-o subMenuIcon" />
                                          </div>
                                          <div className="col-lg-10">
                                            Unit Master
                                          </div>
                                        </a>
                                      </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading col-lg-12" onClick={this.accDiv.bind(this)} role="tab" id="headingThree4" role="button" data-toggle="collapse" data-parent="#accordion4" href="#collapseThree4" aria-expanded="false" aria-controls="collapseThree4">
                                <h4 className="panel-title">
                                    <a className="collapsed" >
                                     <div className="col-lg-2">
                                        <i className="icon fa fa-mobile"></i>
                                      </div>
                                      <div className="col-lg-8">
                                       Knowledge Center
                                      </div>
                                      <div className="col-lg-2 sideAngle">
                                        <i className="fa fa-angle-right rotate-icon angleArrow"></i>
                                      </div>

                                    </a>
                                </h4>
                            </div>
                            <div id="collapseThree4" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree4">
                                <div className="panel-body">
                                  <div className="submenu">
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/ListOfDocuments">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         View Documents
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </div>

                          <div className="panel panel-default">
                            <div className="panel-heading col-lg-12" onClick={this.accDiv.bind(this)} role="tab" id="headingFourth4" role="button" data-toggle="collapse" data-parent="#accordion4" href="#collapseFourth4" aria-expanded="false" aria-controls="collapseFourth4">
                                <h4 className="panel-title">
                                    <a className="collapsed" >
                                     <div className="col-lg-2">
                                        <i className="icon fa fa-mobile"></i>
                                      </div>
                                      <div className="col-lg-8">
                                       Supplier Management
                                      </div>
                                      <div className="col-lg-2 sideAngle">
                                        <i className="fa fa-angle-right rotate-icon angleArrow"></i>
                                      </div>

                                    </a>
                                </h4>
                            </div>
                            <div id="collapseFourth4" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFourth4">
                                <div className="panel-body">
                                  <div className="submenu">
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/SupplierOnboardingForm">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Supplier Onboarding Form
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/ListOfSupplier">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         List of Suppliers
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                            </div>

                        </div>

                          <div className="panel panel-default">
                            <div className="panel-heading col-lg-12" onClick={this.accDiv.bind(this)} role="tab" id="headingFifth4" role="button" data-toggle="collapse" data-parent="#accordion4" href="#collapseFifth4" aria-expanded="false" aria-controls="collapseFifth4">
                                <h4 className="panel-title">
                                    <a className="collapsed" >
                                     <div className="col-lg-2">
                                        <i className="icon fa fa-mobile"></i>
                                      </div>
                                      <div className="col-lg-8">
                                       RFS Management
                                      </div>
                                      <div className="col-lg-2 sideAngle">
                                        <i className="fa fa-angle-right rotate-icon angleArrow"></i>
                                      </div>

                                    </a>
                                </h4>
                            </div>
                            <div id="collapseFifth4" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFifth4">
                                <div className="panel-body">
                                  <div className="submenu">
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/CreateRequestSourcing">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         RFS Entry
                                        </div>
                                      </a>
                                    </div>
                                     <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/showAllRFSLists">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         My RFS List
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/allRFS">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         All RFS List
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/adminHoldRFS">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         On Hold RFS
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/allAllocationRFSLists">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Allocate RFS
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/AdminShowAllocatedRFS">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Allocated RFS
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/AdminViewAllQC">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Allocate QR
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/AdminQCAllocationViewList">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Allocated QR
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/AllRFSForShortlisting">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Shortlist PO
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/AdminViewAllPORFS">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Raise PO
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/AdminViewPORaisedRFS">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Add Material Delivery
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/AdminAllMaterialDeliveryQCList">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Material QR
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/AdminApproveIndentorList">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Approve RFS
                                        </div>
                                      </a>
                                    </div>

                                  </div>
                                </div>
                            </div> 
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading col-lg-12" onClick={this.accDiv.bind(this)} role="tab" id="headingSixth4" role="button" data-toggle="collapse" data-parent="#accordion4" href="#collapseSixth4" aria-expanded="false" aria-controls="collapseSixth4">
                                <h4 className="panel-title">
                                    <a className="collapsed" >
                                     <div className="col-lg-2">
                                        <i className="icon fa fa-mobile"></i>
                                      </div>
                                      <div className="col-lg-8">
                                      PR Management
                                      </div>
                                      <div className="col-lg-2 sideAngle">
                                        <i className="fa fa-angle-right rotate-icon angleArrow"></i>
                                      </div>

                                    </a>
                                </h4>
                            </div>
                            <div id="collapseSixth4" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingSixth4">
                                <div className="panel-body">
                                  <div className="submenu">
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/CreatePR">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         PR Entry
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/allPRLists">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         My PR List
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/allPR">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         All PR List
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/adminHoldPR">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         On Hold PR
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/allAllocationPRLists">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Allocate PR
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/AdminShowAllocatedPR">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Allocated PR
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/AdminViewAllPOPR">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Shortlist PR
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/AdminViewPORaisedPR">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Add Material Delivery
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/AdminAllPRMaterialDeliveryQCList">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Material QR
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/AdminPRApproveIndentorList">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Approve PR
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                         <div className="panel panel-default">
                            <div className="panel-heading col-lg-12" onClick={this.accDiv.bind(this)} role="tab" id="headingSeventh4" role="button" data-toggle="collapse" data-parent="#accordion4" href="#collapseSeventh4" aria-expanded="false" aria-controls="collapseSeventh4">
                                <h4 className="panel-title">
                                    <a className="collapsed" >
                                     <div className="col-lg-2">
                                        <i className="icon fa fa-mobile"></i>
                                      </div>
                                      <div className="col-lg-8">
                                       RFS Reports
                                      </div>
                                      <div className="col-lg-2 sideAngle">
                                        <i className="fa fa-angle-right rotate-icon angleArrow"></i>
                                      </div>

                                    </a>
                                </h4>
                            </div>
                            <div id="collapseSeventh4" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingSeventh4">
                                <div className="panel-body">
                                  <div className="submenu">
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/StatuswiseRFSList">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Statuswise RFS List
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/BuyerwiseRFSList">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Buyerwise RFS List
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/Datewisereport">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Periodwise Reports
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/CostCenterwiseRFSList">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Cost Center wise RFS List
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                            </div>
                          </div>
                          <div className="panel panel-default">
                            <div className="panel-heading col-lg-12" onClick={this.accDiv.bind(this)} role="tab" id="headingEighth4" role="button" data-toggle="collapse" data-parent="#accordion4" href="#collapseEighth4" aria-expanded="false" aria-controls="collapseEighth4">
                                <h4 className="panel-title">
                                    <a className="collapsed" >
                                     <div className="col-lg-2">
                                        <i className="icon fa fa-mobile"></i>
                                      </div>
                                      <div className="col-lg-8">
                                       PR Reports
                                      </div>
                                      <div className="col-lg-2 sideAngle">
                                        <i className="fa fa-angle-right rotate-icon angleArrow"></i>
                                      </div>

                                    </a>
                                </h4>
                            </div>
                            <div id="collapseEighth4" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingEighth4">
                                <div className="panel-body">
                                  <div className="submenu">
                                    {/*<div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                                                          <a href="/StatuswisePRList">
                                                                            <div className="col-lg-2">
                                                                              <i className="fa fa-circle-o subMenuIcon" />
                                                                            </div>
                                                                            <div className="col-lg-8">
                                                                              Statuswise PR List
                                                                            </div>
                                                                          </a>
                                                                        </div>*/}
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/BuyerwisePRList">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Buyerwise PR List
                                        </div>
                                      </a>
                                    </div>
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/DatewisereportPR">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Periodwise Reports
                                        </div>
                                      </a>
                                    </div>
                                    {/*<div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                                                          <a href="/CostCenterwisePRList">
                                                                            <div className="col-lg-2">
                                                                              <i className="fa fa-circle-o subMenuIcon" />
                                                                            </div>
                                                                            <div className="col-lg-8">
                                                                             Cost Center wise PR List
                                                                            </div>
                                                                          </a>
                                                                        </div>*/}
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/DepartmentWise">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                         Department wise PR List
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading col-lg-12" onClick={this.accDiv.bind(this)} role="tab" id="headingNineth4" role="button" data-toggle="collapse" data-parent="#accordion4" href="#collapseNineth4" aria-expanded="false" aria-controls="collapseNineth4">
                                <h4 className="panel-title">
                                    <a className="collapsed" >
                                     <div className="col-lg-2">
                                        <i className="icon fa fa-mobile"></i>
                                      </div>
                                      <div className="col-lg-8">
                                       User Management
                                      </div>
                                      <div className="col-lg-2 sideAngle">
                                        <i className="fa fa-angle-right rotate-icon angleArrow"></i>
                                      </div>

                                    </a>
                                </h4>
                            </div>
                            <div id="collapseNineth4" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingNineth4">
                                <div className="panel-body">
                                  <div className="submenu">
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/UMListOfUsers">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                          List of All Users
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading col-lg-12" onClick={this.accDiv.bind(this)} role="tab" id="headingTenth4" role="button" data-toggle="collapse" data-parent="#accordion4" href="#collapseTenth4" aria-expanded="false" aria-controls="collapseTenth4">
                                <h4 className="panel-title">
                                    <a className="collapsed" >
                                     <div className="col-lg-2">
                                        <i className="icon fa fa-mobile"></i>
                                      </div>
                                      <div className="col-lg-8">
                                      Notification Management
                                      </div>
                                      <div className="col-lg-2 sideAngle">
                                        <i className="fa fa-angle-right rotate-icon angleArrow"></i>
                                      </div>

                                    </a>
                                </h4>
                            </div>
                            <div id="collapseTenth4" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTenth4">
                                <div className="panel-body">
                                  <div className="submenu">
                                    <div className="col-lg-12 submenuBox" onClick={this.accSubmenuDiv.bind(this)}>
                                      <a href="/admin/viewAllTemplates">
                                        <div className="col-lg-2">
                                          <i className="fa fa-circle-o subMenuIcon" />
                                        </div>
                                        <div className="col-lg-8">
                                          View All Templates
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading col-lg-12" onClick={this.accDiv.bind(this)}  role="tab" id="headingEleven4">
                                <h4 className="panel-title">
                                    <a role="button">
                                        <div>
                                          <a href="/companyinfo" className="active">
                                           <div className="col-lg-2">
                                            <i className="icon fa fa-mobile"></i>
                                            </div>
                                            <div className="col-lg-10">
                                            Company Settings
                                            </div>
                                           
                                          </a>
                                        </div>
                                    </a>
                                </h4>
                            </div>
                        </div>
                        </div>
                    </div>
                
            </div>  
          </section>
        </aside>
        </div>
    );
  }
}