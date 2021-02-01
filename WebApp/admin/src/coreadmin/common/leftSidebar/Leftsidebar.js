import React,{Component}                              from 'react';
import { render }                                     from 'react-dom';
import $                                              from "jquery";
import { BrowserRouter, Route, Switch,Link  } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css'; 
import './Leftsidebar.css';
import './dashboard.css';


export default class AdminDashboard extends Component{

  constructor(props){
    super(props);
    this.state = {
      menuValues : {
        vendorData             : false,
        supplierData           : false,
        corporateData          : false,
        contractmanagement     : false,
        masterData             : false
      }
    };
    this.closeIcon   = 'fa-angle-left';
    this.openIcon    = 'fa-angle-down';
    this.activeMenu = this.activeMenu.bind(this)
  }

  componentDidMount(){
    if (!$('body').hasClass('adminLte')) {
      var adminLte = document.createElement("script");
      adminLte.type="text/javascript";
      adminLte.src = "/js/adminLte.js";
      $("body").append(adminLte);
    }
      $("html,body").scrollTop(0);
      var getCurrentUrl = window.location.pathname;
      // console.log("getCurrentUrl",getCurrentUrl);

    $(".sidebar-menu .singleTreeview a").filter(function(a, b){
      if($(this).attr('href') === getCurrentUrl){
        // console.log("b",b);
        // console.log($(this).attr('href') === getCurrentUrl);
        $(b).addClass('active');
        // console.log(b);
      }
    })
     $(".sidebar-menu .treeview li a").filter(function(a, b){
      if($(this).attr('href') === getCurrentUrl){
        $(b).addClass('active');
        $($($(b).parent()).parent()).parent().addClass('menu-open');
        ($($(b).parent()).parent()).css("display", "block");
        // $($($($($($($(b).parent()).parent()).children('menu-open')).children("pull-right-container")).children("i"))).addClass("fa-angle-down");
      }
    })
  }
   
  componentWillUnmount(){
      $("script[src='/js/adminLte.js']").remove();
      $("link[href='/css/dashboard.css']").remove();
  }

  activeMenu(event){
    // console.log('event.currentTarget',event.currentTarget);
    event.preventDefault();
    var a =event.currentTarget
    var pathname = event.currentTarget.getAttribute("data-id"); 
    // console.log('pathname',pathname);
    window.location = pathname
    $(".sidebar-menu .treeview-menu li a").removeClass("active-submenu");
    $(event.currentTarget).addClass("active-submenu");
    // event.currentTarget.href = pathname;
    // var currentEvent =  event.currentTarget
    // var getCurrentUrl = window.location.pathname;
    // localStorage.setItem("getCurrentUrl", pathname);
    // localStorage.setItem("currentEvent",currentEvent);
    // console.log("getCurrentUrl",getCurrentUrl);
    // console.log("currentURL",localStorage.getItem("currentURL"));
  }

  openMenu = (key) => {
    let {menuValues} = this.state;
    Object.keys(menuValues).map((data) => {
      menuValues[data] = (data==key) ? !menuValues[key] :false;
    });
    this.setState({menuValues});
    $('.singleTreeview').removeClass('active')
  }

  eventclk1(event){
    $(event.currentTarget).children(".menuContent").children(".rotate").toggleClass("down");
    var currentEvent =  event.currentTarget
    var getCurrentUrl = window.location.pathname;
    // console.log("getCurrentUrl",getCurrentUrl);
    localStorage.setItem("currentURL",getCurrentUrl)
    localStorage.setItem("currentEvent",currentEvent)
    /*
    var x = document.getElementById(targetId);
    var targetId = $(event.currentTarget).children('.activeClass').attr("id");
    var getValue = x.getAttribute('aria-expanded');
    $('.activeClass').removeClass('in');
    $(event.currentTarget).children('.activeClass').addClass('in')
    */
  } 

  clickDashboard(event){
    $('.treeview').not(event.currentTarget).removeClass('menu-open')
    $('.treeview-menu').css({'display':'none'})
    $(event.currentTarget).addClass('active')

  }

  render(){
    let {dashboard,vendorData,supplierData,corporateData,contractmanagement,masterData} = this.state.menuValues;

    return(
      <aside className="main-sidebar control-sidebar sidebarWrapper scrollBox">
        <section className="sidebar noPadLR sidebar-menu-wrapper">
          <ul className="sidebar-menu" data-widget="tree">

            <li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
              <a href="/dashboard"  title="Dashboard" onClick={()=>this.openMenu("dashboard")}>
                <i className="fa fa-dashboard" aria-hidden="true"></i>
                <span className="sidebarMenuTitle">Dashboard</span>
              </a>
            </li>
            <li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
              <a href="/All_Bookings"  title="All Booking" onClick={()=>this.openMenu("dashboard")}>
                <i className="fa fa-ticket" aria-hidden="true"></i>
                <span className="sidebarMenuTitle">All Bookings</span>
              </a>
            </li>
            <li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
              <a href="/changeRequest"  title="All Booking" onClick={()=>this.openMenu("dashboard")}>
                <i className="fa fa-ticket" aria-hidden="true"></i>
                <span className="sidebarMenuTitle">Change Request</span>
              </a>
            </li>
            <li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
              <a href="/BillingManagement" title="Billing Management" onClick={()=>this.openMenu("dashboard")}>
                <i className="fa fa-money" aria-hidden="true"></i>
                <span className="sidebarMenuTitle">Billing Management</span>
              </a>
            </li>
            <li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
              <a href="/coming_soon" title="Reporting System" onClick={()=>this.openMenu("dashboard")}>
                <i className="fa fa-database" aria-hidden="true"></i>
                <span className="sidebarMenuTitle">Reporting System</span>
              </a>
            </li>
            <li className="treeview" >
              <a href="JavaScript:void(0);" onClick={()=>this.openMenu("contractmanagement")} title="Contract Management">
                <i className="fa fa-file" aria-hidden="true"></i>
                <span className="smsidenames sidebarMenuTitle">Contract Management</span>
                <span className="pull-right-container">
                  <i className={"fa pull-right menu-icon-toggle "+(contractmanagement?this.openIcon:this.closeIcon)} />
                </span>
              </a>
              <ul className="treeview-menu" >
                <li className="noPadLR"> 
                  <a href="/contract-management" data-id="/contract-management" onClick={this.activeMenu.bind(this)} title="Make Contract">
                    <i className="fa fa-circle-o dashr" />Make Contract
                  </a> 
                </li>  
                <li className="noPadLR"> 
                  <a href="/contract-list" data-id="/contract-list" title="Contract List" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Contract List
                  </a> 
                </li>    
                <li className="noPadLR"> 
                  <a href="/package-master" data-id="/package-master" title="Package Master" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Package Master
                  </a> 
                </li>                      
              </ul>
            </li>
            <li className="treeview" >
              <a href="JavaScript:void(0);" onClick={()=>this.openMenu("corporateData")} title="Corporate Master">
                <i className="fa fa-users" aria-hidden="true"></i>
                <span className="smsidenames sidebarMenuTitle"> Corporate </span>
                <span className="pull-right-container">
                  <i className={"fa pull-right menu-icon-toggle "+(corporateData?this.openIcon:this.closeIcon)} />
                </span>
              </a>
              <ul className="treeview-menu" >                    
                <li className="noPadLR"> 
                  <a href="/corporate/list" data-id="/corporate/list" title="Corporate List" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Corporate Master
                  </a> 
                </li>  
                <li className="noPadLR"> 
                  <a href="/employee/lists" data-id="/employee/lists" title="Employee List" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Employee Master
                  </a> 
                </li>  
                <li className="noPadLR"> 
                  <a href="/guest/lists" data-id="/guest/lists" title="Guest List" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Guest Master
                  </a> 
                </li>  
              </ul>
            </li>
            <li className="treeview" >
              <a href="JavaScript:void(0);" onClick={()=>this.openMenu("vendorData")} title="Vendor Master">
                <i className="fa fa-book" aria-hidden="true"></i>
                <span className="smsidenames sidebarMenuTitle"> Vendors </span>
                <span className="pull-right-container">
                  <i className={"fa pull-right menu-icon-toggle "+(vendorData?this.openIcon:this.closeIcon)} />
                </span>
              </a>
              <ul className="treeview-menu" >                    
                <li className="noPadLR"> 
                  <a href="/vendor/list" data-id="/vendor/list" title="Vendor List" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Vendor Master
                  </a> 
                </li>  
                <li className="noPadLR"> 
                  <a href="/mapping-list" data-id="/mapping-list" title="Mapped List" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Vendor Mapping
                  </a> 
                </li>    
              { /* <li className="noPadLR"> 
                  <a href="/supplier/list" data-id="/supplier/list" title="Supplier List" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Supplier Master
                  </a> 
                </li> */}    
                <li className="noPadLR"> 
                  <a href="/vehicle-list" data-id="/vehicle-list" title="Vehicle List" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Vehicle Master
                  </a> 
                </li>    
                <li className="noPadLR"> 
                  <a href="/driver/lists" data-id="/driver/lists" title="Driver List" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Driver Master
                  </a> 
                </li>  
              </ul>
            </li>
            <li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
              <a href="/project-master-data" title="Master Data" onClick={()=>this.openMenu("dashboard")}>
                <i className="fa fa-th-large" aria-hidden="true"></i>
                <span className="sidebarMenuTitle">Master Data</span>
              </a>
            </li>
          </ul>
        </section>
      </aside>
    );
  }
}
