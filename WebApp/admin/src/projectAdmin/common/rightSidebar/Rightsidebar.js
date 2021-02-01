import React,{Component}                      from 'react';
import {BrowserRouter as Router, Route,Link } from 'react-router-dom';
import $                                      from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './Rightsidebar.css';

export default class Rightsidebar extends Component{
  
  constructor(props) {
   super(props);
    this.state = {}
  }
 
  render(){
    return(
      <Router>
        <div>
          <aside className="leftsidebar">
            <div className="wrapper">
              <nav id="sidebar1">       
                <ul className="list-unstyled components">
                  <li className="active">
                    <div className="rightsideHeading ">
                      Admin Activities
                    </div>
                  </li>
                  <li className="sidebarMenuText">
                    <a href="/org-profile" title="Organization Settings" >
                      <i className="fa fa-building addCircle" />
                      Organization Settings
                    </a>
                  </li>
                  <li className="sidebarMenuText">
                    <a href="/ViewTemplates" title="Notification Management">
                      <i className="fa fa-envelope yellowColor" />
                      Notification Management
                    </a>
                  </li>
                  <li className="sidebarMenuText">
                    <a href="/umlistofusers"  title="User Management">
                       <i className="glyphicon fa fa-users greenColor"></i> 
                         User Management
                    </a>
                  </li>
                  <li className="sidebarMenuText">
                      <a href="/global-masters" title="Global Masters">
                        <i className="fa fa-th-large aquaColor"></i>  
                        <span className="sidebarMenuSubText">Global Masters </span>
                      </a>
                  </li>
                  <li className="sidebarMenuText">
                      <a href="/technical-master" title="Technical Masters">
                        <i className="fa fa-th-large yellowColor"></i>  
                        <span className="sidebarMenuSubText">Technical Masters </span>
                      </a>
                  </li>
     
{/*
                  <li className="sidebarMenuText">
                      <a href="/module" title="Module Master">
                        <i className="fa fa-th-large aquaColor"></i>  
                        <span className="sidebarMenuSubText">Module Master</span>
                      </a>
                  </li>
                  <li>
                      <a href="/facility" title="Facility Master">
                        <i className="fa fa-briefcase darkGreenColor"></i>
                        <span className="sidebarMenuSubText">Facility Master</span>
                      </a>
                  </li>*/}
                  
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </Router>
    );
  }
}
