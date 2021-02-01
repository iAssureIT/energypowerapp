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
        clientData             : false,
        employeenData         : false,
        recordingData          : false,
        cameraData             : false,
        masterData             : false,
        ticketData             : false,
        attendance             : false
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
    let {dashboard,clientData,employeenData,recordingData,ticketData,cameraData,masterData,attendance} = this.state.menuValues;

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
              <a href="/multitracking"  title="Daily Tracking" onClick={()=>this.openMenu("dashboard")}>
                <i className="fa fa-circle-o dashr" aria-hidden="true"></i>
                <span className="sidebarMenuTitle">Daily Tracking</span>
              </a>
            </li>
            <li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
              <a href="/ticketlist"  title="Ticket Management" onClick={()=>this.openMenu("cameraData")}>
                <i className="fa fa-ticket" aria-hidden="true"></i>
                <span className="sidebarMenuTitle">Ticket Management</span>
              </a>
            </li>
             <li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
              <a href="/client/list"  title="Client Master" onClick={()=>this.openMenu("clientData")}>
                <i className="fa fa-file dashr" aria-hidden="true"></i>
                <span className="sidebarMenuTitle">Client Master</span>
              </a>
            </li>
              <li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
              <a href="/employee/lists"  title="Employee Master" onClick={()=>this.openMenu("employeenData")}>
                <i className="fa fa-file dashr" aria-hidden="true"></i>
                <span className="sidebarMenuTitle">Employee Master</span>
              </a>
            </li>
             {/*<li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
              <a href="/listrecordingloc"  title="Recording Location" onClick={()=>this.openMenu("recordingData")}>
                <i className="fa fa-dashboard" aria-hidden="true"></i>
                <span className="sidebarMenuTitle">Recording Location</span>
              </a>
            </li>
             <li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
              <a href="/listofcameraloc"  title="Camera Location" onClick={()=>this.openMenu("cameraData")}>
                <i className="fa fa-camera" aria-hidden="true"></i>
                <span className="sidebarMenuTitle">Camera Location</span>
              </a>
            </li>
            <li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
              <a href="/locationmap" title="Location Map" onClick={()=>this.openMenu("locationmap")}>
                <i className="fa fa-map" aria-hidden="true"></i>
                <span className="sidebarMenuTitle">Location Map</span>
              </a>
            </li>*/}
            <li className="treeview" >
              <a href="JavaScript:void(0);" title="Locations" onClick={()=>this.openMenu("report")}>
                <i className="fa fa-map" aria-hidden="true"></i>
                <span className="smsidenames sidebarMenuTitle">Locations</span>
                <span className="pull-right-container">
                  <i className={"fa pull-right menu-icon-toggle "+(masterData?this.openIcon:this.closeIcon)} />
                </span>
              </a>
              <ul className="treeview-menu" >                    
                <li className="noPadLR"> 
                  <a href="/listrecordingloc" title="Recording Locations" data-id="/listrecordingloc" title="Recording Location" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Recording Locations
                  </a> 
                </li>  
                <li className="noPadLR"> 
                  <a href="/listofcameraloc" title="Camera Locations" data-id="/listofcameraloc" title="Camera Location" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Camera Locations
                  </a> 
                </li>
                <li className="noPadLR"> 
                  <a href="/locationmap" title="Location Map" data-id="/locationmap" title="Location Map" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Location Map
                  </a> 
                </li>
               
              </ul>
            </li>
             <li className="treeview" >
              <a href="JavaScript:void(0);" title="Reporting System" onClick={()=>this.openMenu("report")}>
                <i className="fa fa-database" aria-hidden="true"></i>
                <span className="smsidenames sidebarMenuTitle">Reporting System </span>
                <span className="pull-right-container">
                  <i className={"fa pull-right menu-icon-toggle "+(masterData?this.openIcon:this.closeIcon)} />
                </span>
              </a>
              <ul className="treeview-menu" >                    
                <li className="noPadLR"> 
                  <a href="/DailyReport" title="Daily Report"  data-id="/DailyReport" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Daily Report
                  </a> 
                </li>  
                <li className="noPadLR"> 
                  <a href="/EmployeeWiseTicketReport" title="Employee Wise Tickets" data-id="/EmployeeWiseTicketReport" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Employee Wise Tickets
                  </a> 
                </li>
                <li className="noPadLR"> 
                  <a href="/MonthlyReimbursementReport" title="Monthly Reimbursement" data-id="/MonthlyReimbursementReport" onClick={this.activeMenu.bind(this)}>
                    <i className="fa fa-circle-o dashr" />Monthly Reimbursement
                  </a> 
                </li>  
              </ul>
            </li>
            <li className="singleTreeview" onClick={this.clickDashboard.bind(this)}>
              <a href="/project-master-data" title="Master Data" onClick={()=>this.openMenu("masterData")}>
                <i className="fa fa-th-large" aria-hidden="true"></i>
                <span className="sidebarMenuTitle">Master Data</span>
              </a>
            </li>
            <li className="singleTreeview">
              <a  title="Version 2.0">
                <span className="sidebarMenuTitle">Version 2.0</span>
              </a>
            </li>
            
          </ul>
        </section>
      </aside>
    );
  }
}
