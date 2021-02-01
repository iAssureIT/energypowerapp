import React,{Component}  from 'react';
import { render }         from 'react-dom';
import $                  from "jquery";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './Footer.css';

export default class Header2 extends Component{
  componentDidMount(){
    if ( !$('body').hasClass('adminLte')) {
      var adminLte = document.createElement("script");
      adminLte.type="text/javascript";
      adminLte.src = "/js/adminLte.js";
      $("body").append(adminLte);
    }
  }
    
  componentWillUnmount(){
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();
  }
  render(){
    return(
        <footer className="main-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="pull-right hidden-xs hidden-sm">
              <strong className="WebsiteName"> Designed & Developed By <a href="http://iassureit.com/" className="comnm" target="_blank">iAssure International Technologies Pvt.Ltd.</a></strong>
                
            </div>
            <div className="">
              <strong className="footerTwoMargin">Copyright &copy; 2020 <a href="http://iassureit.com">iAssureIT</a>.</strong>  All rights
              reserved.
            </div>
        </footer>
    );
  }
}