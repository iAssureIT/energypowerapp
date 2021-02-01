import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

// Section: 1 - SystemSecurity ******************************************************
import Login from './coreadmin/systemSecurity/Login.js';
import ConfirmOtp from './coreadmin/systemSecurity/ConfirmOtp.js';
import ForgotPassword from './coreadmin/systemSecurity/ForgotPassword.js';
import ResetPassword from './coreadmin/systemSecurity/ResetPassword.js';
import SignUp from './coreadmin/systemSecurity/SignUp.js';


import Header from './coreadmin/common/header/Header.js'; 
import Footer from './coreadmin/common/footer/Footer.js';
import Leftsidebar from './coreadmin/common/leftSidebar/Leftsidebar.js';

// ============ Contract Management =========================== 
import Contract                                 from "./fivebees/ContractManagement/Contract/Contract.js";
import Package                                  from "./fivebees/ContractManagement/Package/Package.js";
import Condition                                from "./fivebees/ContractManagement/Condition/Condition.js";
import Viewcontract                             from './fivebees/ContractManagement/View/Viewcontract.js';
import List                                     from './fivebees/ContractManagement/List/List.js';


import CoreLayout from './coreadmin/CoreLayout/CoreLayout.js';



class Layout extends Component  {

    constructor(props) {
        super();
        this.state = {
            loggedIn: false,
        }
    }

    componentDidMount() {
        const token = localStorage.getItem("token");
        if (token !== null && token !== "undefined") {
            this.setState({
                loggedIn: true
            })
        } else { }

    }

    logout() {
        var token = localStorage.removeItem("token");
        if (token !== null && token !== "undefined") {
            this.setState({
                loggedIn: false
            })
        }
    }

    render() {
        if (this.state.loggedIn) {
            return (
            <Router>
                <div className="App container-fluid" >
                    <div className="row" >
                        <div id="headerid" className="headerbackgroundcolor" >
                            <div className="" >
                                <Header />
                            </div> 
                        </div>
                        <div id="dashbordid" className="col-lg-10 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 NOpadding" >
                            <div className="" >
                                <div className=" mainContentBottom NOpadding" >
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding mainContentBackground" >
                                        <CoreLayout />
                                        <Switch >
                                            {/* ContractManagement */}
                                            <Route path="/contract-management"                         exact strict component={Contract}  />
                                            <Route path="/contract-management/:contractID"             exact strict component={Contract}  />
                                            <Route path="/package-details/:contractID"                 exact strict component={Package}  />
                                            <Route path="/package-details/:contractID/:packageID"      exact strict component={Package}  />
                                            <Route path="/condition/:contractID"                       exact strict component={Condition}  />
                                            <Route path="/condition/:contractID/:packageID"            exact strict component={Condition}  />
                                            <Route path="/viewcontract/:contractID"                    exact strict component={Viewcontract}  />
                                            <Route path="/contract-list"                               exact strict component={List}  />  
                                        </Switch>
                                    </div>
                                </div>
                            </div>
                            <div className="footerCSS col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" >
                                <Footer />
                            </div>
                        </div>
                        <div className="leftsidebarbackgroundcolor" >
                            <div className="row" >
                                <Leftsidebar />
                            </div>
                        </div>
                    </div>
                </div>
            </Router>
            );
        } else {
            return (
                <div>
                    <Router >
                        <Switch >
                            <Route path="/" exact strict component={Login} />
                            <Route path="/login" exact strict component={Login} />
                            <Route path="/signup" exact strict component={SignUp} />
                            <Route path="/forgotpassword" exact strict component={ForgotPassword} />
                            <Route path="/reset-pwd/:user_ID" exact strict component={ResetPassword} />
                            <Route path="/confirm-otp/:userID" exact strict component={ConfirmOtp} />
                        </Switch>
                    </Router>
                </div>
            );
        }
    }
}

 
export default Layout;