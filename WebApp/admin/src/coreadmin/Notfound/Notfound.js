import React, { Component } from 'react';
import $ from 'jquery';
import './Notfound.css';

export default class Notfound extends Component {
	constructor(props) {
	  super(props);
	  this.state = {};

	}
    componentDidMount(){
        // $('#headerid').css({"display":"none"});
        // $('#sidebar').css({"display":"none"});
        // $('.main-footer').css({"display":"none"});
        // $('#dashbordid').css({"width" : "100%"})
    }
    componentWillUnmount(){
        // $('#headerid').css({"display":"none"});
        // $('#sidebar').css({"display":"none"});
        // $('.main-footer').css({"display":"none"});
        // $('#dashbordid').css({"width" : "85%"})
    }
	render(){

       return(
            <div style={{'height': window.innerHeight+'px', 'width': window.innerWidth+'px'}} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NotfoundDiv">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 contentNot">
                    <span className="N404">404</span> <br />
                    <span className="Notfound">Not Found</span>
                </div>
            </div>
	    );

	} 

}