import React,{Component}      from 'react';
import { render }             from 'react-dom';
import { Route , withRouter}  from 'react-router-dom';
import Rightsidebar           from '../rightSidebar/Rightsidebar.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import './Header.css';

export default class systemHeader extends Component{
  
  constructor(props) {
   super(props);
    this.state = {
        loggedIn : false,
    }
  }

  render(){

    return(
    <div>
      <header className="pageHeader">
        <div>
          <div className="col-lg-12 logoHead1">
            <a href="/admin/dashboard">
                 <img src="/images/SEAS.png"/>
              </a>
          </div>
          <div className="col-lg-12 container-fluid logoHead2">
            {/* Logo */}
            <a href="/admin/dashboard" className=" row col- lg-12 ">
              <div className="col-lg-12 logoName">Smart Employee Analytics System</div>
            </a>
          </div>
        </div>
      </header>
    </div>
    );
  }
}
