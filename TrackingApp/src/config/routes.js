import React                      from 'react';
import { createSwitchNavigator }  from 'react-navigation';
import { createDrawerNavigator }  from 'react-navigation-drawer';
import { createStackNavigator }   from 'react-navigation-stack';
import { createAppContainer }     from '@react-navigation/native';
import Home                       from '../components/Home.js';
import StartLocationDetails       from '../Screens/Attendance//StartLocationDetails.js';
import MyTravelHistory            from '../components/MyTravelHistory/MyTravelHistory.js';
import FuelReimbursement          from '../components/FuelReimbursement/FuelReimbursement.js';
import {AuthLoadingScreen}        from '../layouts/AuthLoading/AuthLoading.js'; 
import {SideMenu}                 from '../layouts/SideMenu/SideMenu.js';
import {InAppNotification}          from '../layouts/InAppNotification/InAppNotification.js';
// import EmployeeProfile            from '../components/EmployeeProfile/EmployeeProfileView.js';
// import EmployeeProfileEdit        from '../components/EmployeeProfile/EmployeeProfileEdit/EmployeeProfileEdit.js';
import ResetPassword              from '../components/SystemSecurity/ResetPassword/ResetPassword1.js';
import Signup                     from '../components/SystemSecurity/Signup/Signup1.js';
import ForgotPasswordOTP          from '../components/SystemSecurity/ForgotPasswordOTP/ForgotPasswordOTP1.js';
import ClientDashboard            from '../Screens/Dashboard/ClientDashboard.js';
import {TechnicianDashboard}        from '../Screens/Dashboard/TechnicianDashboard.js';
import ListOfClientTickets        from '../Screens/ListOfTickets/ListOfClientTickets.js';
import ListOfTechnicianTickets    from '../Screens/ListOfTickets/ListOfTechnicianTickets.js';
import  ClientTicketDetails       from '../Screens/TicketDetails/ClientTicketDetails.js';
import {TechnicianTicketDetails}    from '../Screens/TicketDetails/TechnicianTicketDetails.js';
import {ServiceRequest}           from '../Screens/ServiceRequest/ServiceRequest.js';
import Profile                    from '../Screens/Profile/Profile.js';
import {EmployeeProfile}            from '../Screens/Profile/EmployeeProfile.js';
import {Attendance}                 from '../Screens/Attendance/Attendance.js';
import AttendanceHistory                 from '../Screens/Attendance/AttendanceHistory.js';
import LocationDetails                 from '../Screens/Attendance/LocationDetails.js';
import {RequestForConsumbales}    from '../Screens/RequestForConsumbales/RequestForConsumbales.js';
import {HeaderBar}                from '../layouts/Header/Header.js';
import {Chat}                     from '../Screens/Chat/Chat.js';
//System Security
import {Login}                    from '../Screens/SystemSecurity/Login.js';
import ChangePassword             from '../Screens/SystemSecurity/ChangePassword.js';
import {ForgotPassword}             from '../Screens/SystemSecurity/ForgotPassword.js';
import {OTPVerification}            from '../Screens/SystemSecurity/OTPVerification.js';
const ClientStack = createStackNavigator({
  ClientDashboard:{
    screen:ClientDashboard,
    navigationOptions:{
      header: null,
    }
  },
  ServiceRequest:{
    screen:ServiceRequest,
    navigationOptions:{
      header: null,
    }
  },
   ListOfClientTickets:{
    screen:ListOfClientTickets,
    navigationOptions:{
      header: null,
    }
  },
   ClientTicketDetails:{
    screen:ClientTicketDetails,
    navigationOptions:{
      header: null,
    }
  }, 
  RequestForConsumbales:{
    screen:RequestForConsumbales,
    navigationOptions:{
      header: null,
    }
  },
  Profile:{
    screen:Profile,
    navigationOptions:{
      header: null,
    }
  },
  EmployeeProfile:{
    screen:EmployeeProfile,
    navigationOptions:{
      header: null,
    }
  },
  Home: {
    screen: Home,
    navigationOptions: {
      header: null
    }
  },
   ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      header: null
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      header: null
    }
  },
  InAppNotificationClient: {
    screen: InAppNotification,
    navigationOptions: {
      header: null
    }
  }
});

const TechnicianStack = createStackNavigator({
  TechnicianDashboard:{
    screen:TechnicianDashboard,
    navigationOptions:{
      header: null,
    }
  },
  Attendance:{
    screen:Attendance,
    navigationOptions:{
      header: null,
    }
  },
  AttendanceHistory:{
    screen:AttendanceHistory,
    navigationOptions:{
      header: null,
    }
  },
  LocationDetails:{
    screen:LocationDetails,
    navigationOptions:{
      header: null,
    }
  },
  ListOfTechnicianTickets:{
    screen:ListOfTechnicianTickets,
    navigationOptions:{
      header: null,
    }
  },
  TechnicianTicketDetails:{
    screen:TechnicianTicketDetails,
    navigationOptions:{
      header: null,
    }
  }, 
  RequestForConsumbales:{
    screen:RequestForConsumbales,
    navigationOptions:{
      header: null,
    }
  },
  Profile:{
    screen:Profile,
    navigationOptions:{
      header: null,
    }
  },
  EmployeeProfile:{
    screen:EmployeeProfile,
    navigationOptions:{
      header: null,
    }
  },
  Home: {
    screen: Home,
    navigationOptions: {
      header: null
    }
  },
   ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      header: null
    }
  },
  LocationDetails: {
    screen: LocationDetails,
    navigationOptions: {
      header: null
    }
  },
  StartLocationDetails: {
    screen: StartLocationDetails,
    navigationOptions: {
      header: null
    }
  },
  MyTravelHistory: {
    screen: MyTravelHistory,
    navigationOptions: {
      header: null
    }
  },
  FuelReimbursement: {
    screen: FuelReimbursement,
    navigationOptions: {
      header: null
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      header: null
    }
  },
  InAppNotification: {
    screen: InAppNotification,
    navigationOptions: {
      header: null
    }
  }
});


const AuthStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header: null
    }
  },
   ResetPassword: {
    screen: ResetPassword,
    navigationOptions: {
      header: null
    }
  },

  OTPVerification: {
    screen: OTPVerification,
    navigationOptions: {
      header: null
    }
  },
  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: {
      header: null
    }
  },
  ForgotPasswordOTP: {
    screen: ForgotPasswordOTP,
    navigationOptions: {
      header: null
    }
  },
  Signup: {
    screen: Signup,
    navigationOptions: {
      header: null
    }
  },
});

const ClientDrawer = createDrawerNavigator(
  {
    Home: {
      screen: ClientStack,
    },
  },
  {
    drawerLockMode: 'locked-closed',
    contentComponent: SideMenu,
    drawerPosition: 'left',
  },
);

const TechnicianDrawer = createDrawerNavigator(
  {
    Home: {
      screen: TechnicianStack,
    },
  },
  {
    drawerLockMode: 'locked-closed',
    contentComponent: SideMenu,
    drawerPosition: 'left',
  },
);

// export default HomeStack;
export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      ClientApp: ClientDrawer,
      TechnicianApp: TechnicianDrawer,
      AuthStack: AuthStack,
    },
    {
      unmountInactiveRoutes: true,
      initialRouteName: 'AuthLoading',
    },
  ),
);