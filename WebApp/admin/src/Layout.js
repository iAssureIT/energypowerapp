import React,{Component}                         from 'react';
import { render }                                from 'react-dom';
import { Redirect }                              from 'react-router-dom';
import { BrowserRouter as Router, Route,Switch } from 'react-router-dom';
import $                 from "jquery";
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';



import Header                                     from './projectAdmin/common/header/Header.js'; 
import Footer                                     from './projectAdmin/common/footer/Footer.js';
import Leftsidebar                                from './projectAdmin/common/leftSidebar/Leftsidebar.js';
// import Dashboard                                  from './projectAdmin/common/dashboard/Dashboard.js';
import Dashboard                                  from './projectAdmin/Dashboard/Dashboard.js';

import AddEditProjectLocation                   from './projectAdmin/projectLocation/components/AddEditProjectLocation.js';
import ListOfProjectLocations                   from './projectAdmin/projectLocation/components/ListOfProjectLocations.jsx';
import AddEditEquipmentLocation                      from './projectAdmin/equipmentLocation/components/AddEditEquipmentLocation.js';
import ListOfEquipmentLocations                      from './projectAdmin/equipmentLocation/components/ListOfEquipmentLocations.jsx';
import AttendanceManagement                       from './projectAdmin/AttendanceManagement/components/AttendanceManagement.js';
import Monthlydetails                             from './projectAdmin/Reports/MonthlyDetails.js';
import DailyReport                                from './projectAdmin/Reports/DailyEmployeeTaskReport.js';
import EmployeeWiseTicketReport                   from './projectAdmin/Reports/EmployeeWiseTicketReport.js';
import MonthlyReimbursementReport                 from './projectAdmin/Reports/MonthlyReimbursementReport.js';

import EmployeeMaster                             from "./projectAdmin/EmployeeMaster/EmployeeMaster.js"
import PersonList                                 from "./projectAdmin/Master/PersonMaster/PersonList.js"

import CreateTicket                               from './projectAdmin/TicketingManagement/components/CreateTicket.js';
import TicketList                                 from './projectAdmin/TicketingManagement/components/TicketList.js';
import TicketView                                 from './projectAdmin/TicketingManagement/components/TicketView.js';
 
import ClientBasicInfo                            from './projectAdmin/ClientMaster/ClientBasicInfo.js';
import ClientDepartmentDetails                    from './projectAdmin/ClientMaster/ClientDepartmentDetails.js';
import ClientLocationDetails                      from './projectAdmin/ClientMaster/ClientLocationDetails.js';
import ClientContactDetails                       from './projectAdmin/ClientMaster/ClientContactDetails.js';
import ClientListOfEntities                       from './projectAdmin/ClientMaster/ClientListOfEntities.js';

import UMListOfEmp                                from './coreadmin/userManagement/UM/OfficeEmpList.js';

import EditUserProfile                            from './coreadmin/userManagement/UM/EditUserProfile.js';
import UMRolesList                                from './coreadmin/userManagement/Roles/UMRolesList.js';
// import OrganizationSetting                        from './coreadmin/companysetting/Components/OrganizationSetting.js';

import CoreLayout                                 from './coreadmin/CoreLayout/CoreLayout.js';
import MasterData                                 from "./projectAdmin/Master/MasterData.js";
/**************************/
import CompanyProfile                             from './projectAdmin/CompanyProfile/CompanyProfile.js';
import CompanyProfileView                         from './projectAdmin/CompanyProfile/CompanyProfileView.js';

import locationmap                               from './projectAdmin/LocationMap/LocationMap.js';
import map                                       from './projectAdmin/Map/Map.js';
import Tracking                                  from './projectAdmin/Reports/Tracking.js';
import MultiTracking                             from './projectAdmin/Tracking/Tracking.js';

// Section: 1 - SystemSecurity ******************************************************
import Login from './coreadmin/systemSecurity/Login.js';
import ConfirmOtp from './coreadmin/systemSecurity/ConfirmOtp.js';
import ForgotPassword from './coreadmin/systemSecurity/ForgotPassword.js';
import ResetPassword from './coreadmin/systemSecurity/ResetPassword.js';
import SignUp from './coreadmin/systemSecurity/SignUp.js';
import PrivacyPolicy from './coreadmin/systemSecurity/PrivacyPolicy.js'

 class Layout extends Component{
  
  constructor(props) {
    super();
    this.state = {
          loggedIn : false,
    }
  }
   
componentDidMount(){
    const token = localStorage.getItem("token");
    // console.log("Dashboard Token = ",token);
    if(token!==null){
      this.setState({
        loggedIn : true
      })
    }else{
      console.log("token is not available");
    }
              
  }

  logout(){
    var token = localStorage.removeItem("token");
      if(token!==null){
      // console.log("Header Token = ",token);
      this.setState({
        loggedIn : false
      })
    }
  }

  render(){
    if (this.state.loggedIn) {
            return (
            <Router>
                <div className="hold-transition skin-blue fixed sidebar-mini">
                    <div className="content-wrapper">
                        <div className="wrapper">
                            <Header />
                            <div className="">
                                <div className="row">
                                    <Leftsidebar/>
                                    <div className="container-fluid main-container">
                                        <div className="row">
                                            <div className="dashboardWrapper" >
                                                <div className="backColor col-lg-12 col-md-12 col-sm-12 col-xs-12" >
                                                    <CoreLayout />
                                                    <Switch>
                                                        <Route path="/"                           component={Dashboard} exact />
                                                        <Route path="/dashboard"                  component={Dashboard} exact />
                                                        <Route path="/locationmap"                component={locationmap} exact />
                                                        <Route path="/map"                        component={map} exact />
                                                        <Route path="/tracking"                   component={Tracking} exact />
                                                        <Route path="/tracking/:tracking_id"       component={Tracking} exact />
                                                        <Route path="/multitracking"  component={MultiTracking} exact />
                                  
                                                       
                                                        <Route path="/projectlocation"                exact strict component={ AddEditProjectLocation } />
                                                        <Route path="/projectlocation/:id"            exact strict component={ AddEditProjectLocation } />
                                                        <Route path="/projectlocationmodal/:fieldID"       exact strict component={ AddEditProjectLocation } />
                                                        <Route path="/projectlocationmodal/:id/:fieldID"   exact strict component={ AddEditProjectLocation } />

                                                        <Route path="/listprojectloc"             exact strict component={ ListOfProjectLocations } />
                                                        <Route path="/listprojectloc/:id"         exact strict component={ ListOfProjectLocations } />

                                                        <Route path="/equipmentlocation"               exact strict component={ AddEditEquipmentLocation } />
                                                        <Route path="/equipmentlocation/:id"           exact strict component={ AddEditEquipmentLocation } />
                                                        <Route path="/equipmentlocationmodal/:fieldID"     exact strict component={ AddEditEquipmentLocation } />
                                                        <Route path="/equipmentlocationmodal/:id/:fieldID"     exact strict component={ AddEditEquipmentLocation } />

                                                        <Route path="/listofequipmentloc"              exact strict component={ ListOfEquipmentLocations } />
                                                        <Route path="/listofequipmentloc/:id"             exact strict component={ ListOfEquipmentLocations } />


                                                        

                                                        <Route path="/ticketlist"                   exact strict component={ TicketList } />
                                                        <Route path="/ticketview/:ticket_id"        exact strict component={ TicketView } />
                                                        
                                                        <Route path="/createticket"                 exact strict component={ CreateTicket } />
                                                        <Route path="/createticket/:id"             exact strict component={ CreateTicket } />
                                                        <Route path="/createticketmodal/:fieldID"                exact strict component={ CreateTicket } />
                                                        <Route path="/createticketmodal/:id/:fieldID"                exact strict component={ CreateTicket } />

                                                        <Route path="/createticket/basic-details" exact strict component={ClientBasicInfo} />
                                                        <Route path="/createticket/basic-details/:entityID" exact strict component={ClientBasicInfo} />
                                                        <Route path="/createticket/department-details" exact strict component={ClientDepartmentDetails} />
                                                        <Route path="/createticket/department-details/:entityID" exact strict component={ClientDepartmentDetails} />
                                                        <Route path="/createticket/department-details/:entityID/:fieldID" exact strict component={ClientDepartmentDetails} url="createticket"/>
                                                        <Route path="/createticket/location-details" exact strict component={ClientLocationDetails} />
                                                        <Route path="/createticket/location-details/:entityID" exact strict component={ClientLocationDetails} />
                                                        <Route path="/createticket/location-details/:entityID/:locationID" exact strict component={ClientLocationDetails} /> 
                                                        <Route path="/createticket/location-details-modal/:fieldID" exact strict component={ClientLocationDetails} />
                                                        <Route path="/createticket/location-details-moal/:entityID/:fieldID" exact strict component={ClientLocationDetails} />
                                                        <Route path="/createticket/location-details-modal/:entityID/:locationID/:fieldID" exact strict component={ClientLocationDetails} />
                                                        <Route path="/createticket/contact-details" exact strict component={ClientContactDetails} />
                                                        <Route path="/createticket/contact-details/:entityID" exact strict component={ClientContactDetails} />
                                                        <Route path="/createticket/contact-details/:entityID/:contactID" exact strict component={ClientContactDetails} />
                                                        <Route path="/createticket/contact-details-modal/:fieldID" exact strict component={ClientContactDetails} />
                                                        <Route path="/createticket/contact-details-modal/:entityID/:fieldID" exact strict component={ClientContactDetails} />
                                                        <Route path="/createticket/contact-details-modal/:entityID/:contactID/:fieldID" exact strict component={ClientContactDetails} />

                                                        <Route path="/AttendanceManagement"         exact strict component={ AttendanceManagement } />
                                                        <Route path="/Monthlydetails/:date/:employee_id"   exact strict component={ Monthlydetails } />
                                                        <Route path="/Monthlydetails/"              exact strict component={ Monthlydetails } />
                                                        <Route path="/DailyReport"              exact strict component={ DailyReport } />
                                                        <Route path="/EmployeeWiseTicketReport"              exact strict component={ EmployeeWiseTicketReport } />
                                                        <Route path="/EmployeeWiseTicketReport/:employee_id"              exact strict component={ EmployeeWiseTicketReport } />
                                                        <Route path="/MonthlyReimbursementReport"              exact strict component={ MonthlyReimbursementReport } />
                                                        {/* Master Data */}
                                                        <Route path="/project-master-data"          render={(props)=><MasterData {...props}/> } exact />
                                                        <Route path="/project-master-data/:editId"  render={(props)=><MasterData {...props}/> } exact />
                                                        <Route path="/project-master-data/oneField/:oneFieldEditId" render={(props)=><MasterData {...props}/> } exact />

                                                        {/*Client Master*/}
                                                        <Route path="/client/basic-details" exact strict component={ClientBasicInfo} />
                                                        <Route path="/client/basic-details/:entityID" exact strict component={ClientBasicInfo} />
                                                        <Route path="/client/department-details" exact strict component={ClientDepartmentDetails} />
                                                        <Route path="/client/department-details/:entityID" exact strict component={ClientDepartmentDetails} />
                                                        <Route path="/client/department-details/:entityID/:departmentID" exact strict component={ClientDepartmentDetails} />
                                                        <Route path="/client/department-details-modal/:fieldID" exact strict component={ClientDepartmentDetails} />
                                                        <Route path="/client/department-details-modal/:entityID/:fieldID" exact strict component={ClientDepartmentDetails} />
                                                        <Route path="/client/department-details-modal/:entityID/:departmentID/:fieldID" exact strict component={ClientDepartmentDetails} />
                                                        <Route path="/client/location-details" exact strict component={ClientLocationDetails} />
                                                        <Route path="/client/location-details/:entityID" exact strict component={ClientLocationDetails} />
                                                        <Route path="/client/location-details/:entityID/:locationID" exact strict component={ClientLocationDetails} /> 
                                                        <Route path="/client/location-details-modal/:fieldID" exact strict component={ClientLocationDetails} />
                                                        <Route path="/client/location-details-modal/:entityID/:fieldID" exact strict component={ClientLocationDetails} />
                                                        <Route path="/client/location-details-modal/:entityID/:locationID/:fieldID" exact strict component={ClientLocationDetails} />
                                                        <Route path="/client/contact-details" exact strict component={ClientContactDetails} />
                                                        <Route path="/client/contact-details/:entityID" exact strict component={ClientContactDetails} />
                                                        <Route path="/client/contact-details/:entityID/:contactID" exact strict component={ClientContactDetails} />
                                                        <Route path="/client/contact-details-modal/:fieldID" exact strict component={ClientContactDetails} />
                                                        <Route path="/client/contact-details-modal/:entityID/:fieldID" exact strict component={ClientContactDetails} />
                                                        <Route path="/client/contact-details-modal/:entityID/:contactID/:fieldID" exact strict component={ClientContactDetails} />
                                                        <Route path="/client/list" exact strict component={ClientListOfEntities} /> 

                                                         { /* Employee Master */}
                                                        <Route path="/employee/master/:personID" exact strict component={EmployeeMaster} />
                                                        <Route path="/employee/users/:personID" exact strict component={EmployeeMaster} />
                                                        <Route path="/employee/master" exact strict component={EmployeeMaster} />
                                                        <Route path="/employee/lists" exact strict component={PersonList} />
                                                        <Route path="/employee/maste-modalr/:personID/:fieldID" exact strict component={EmployeeMaster} />
                                                        <Route path="/employee/master-modal/:fieldID" exact strict component={EmployeeMaster} />
                                                        <Route path="/employee/lists/:fieldID" exact strict component={PersonList} />     

                                                         <Route path="/org-profile" exact strict component={CompanyProfile} />
                                                         <Route path="/company-profile/:comp_ID" exact strict component={CompanyProfileView} />      
                                                     </Switch>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
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
                            <Route path="/privacy-policy" exact strict component={PrivacyPolicy} />
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
