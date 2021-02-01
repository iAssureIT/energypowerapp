import React from 'react';
import MessageForm from './Components/MessageForm.js';
import "./BroadcastSystem.css";

export default class BroadcastSystem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="pageContent">
				<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
					<div className="boxhead text-center">
						<h1>Five Bees Broadcast System</h1>

					</div>
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					
						<ul className="nav nav-pills col-lg-8 col-lg-offset-4">
						    <li className="active broadcastbtns"><a data-toggle="pill" href="#home">SMS</a></li>
						    <li className="broadcastbtns"><a data-toggle="pill" href="#menu1">EMAIL</a></li>
						    <li className="broadcastbtns"><a data-toggle="pill" href="#menu2">IN-APP</a></li>
						    
						</ul>
					</div>
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">	
						<div className="tab-content mtop25">
						    <div id="home" className="tab-pane fade in active">
						    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						    		<MessageForm id="sms"/>
						    	</div>

						    </div>
						    <div id="menu1" className="tab-pane">
						    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						    		<MessageForm Cc="Cc" id="email"/>
						    	</div>
						    </div>
						    <div id="menu2" className="tab-pane">
						        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						    		<MessageForm />
						    	</div></div>
						    
						  </div>

						
					</div>

				</div>
				
			</div>
		);
	}
}
