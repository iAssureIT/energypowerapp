import React, {useState,useEffect} from 'react';
import {
  Dimensions,
  ImageBackground,
  Platform,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';

import axios                          from 'axios';
import Dialog                         from 'react-native-dialog';
import {Button, Icon, Input}          from 'react-native-elements';
import ValidationComponent            from 'react-native-form-validator';
import ImagePicker                    from 'react-native-image-crop-picker';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {withNavigation}               from 'react-navigation';
import {useSelector,useDispatch}         from 'react-redux';
import commonStyle                    from '../../config/commonStyle.js';
import {Formik, ErrorMessage}         from 'formik';
import * as Yup                       from 'yup';
import {useNavigation}                from '../../config/useNavigation.js';
import {setToken, setUserDetails}     from '../../redux/user/actions';
import AsyncStorage                   from '@react-native-community/async-storage';
import { colors, sizes }              from '../../config/styles.js';
import { getClientTicketsList }       from '../../redux/ticketList/actions';
import { getTechnicianTicketsList }   from '../../redux/ticketList/actions';
import { getDropDownList }            from '../../redux/list/actions';
import {getDasboardCount}             from '../../redux/technicianDashboardCount/actions';
import {getClientDasboardCount}       from '../../redux/clientDashboardCount/actions';
import {getPersonDetails}             from '../../redux/personDetails/actions';

const window = Dimensions.get('window');

export const SideMenu = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const store = useSelector(store => ({
    userDetails     : store.userDetails,
    clientDetails   : store.clientDetails,
    dashboardCount  : store.techDashboardCount.data,
    clientDashboardCount  : store.clientDashboardCount.data,
    personDetails : store.personDetails.data,
  }));
  console.log("store",store);
  const dashboardCount = store.dashboardCount;
  const clientDashboardCount = store.clientDashboardCount;

  const logout = () => {
    AsyncStorage.getItem('user_id')
    .then(user_id=>{
      console.log("user_id",user_id);
        axios.patch('/api/auth/patch/logout/'+user_id)
        .then(res=>{
          AsyncStorage.removeItem('user_id');
          AsyncStorage.removeItem('token');
          AsyncStorage.removeItem('person_id');
          navigation.closeDrawer();
          navigation.navigate('Login');
        })
        .catch(err=>{
          console.log("err",err);
        })
    })
    .catch(err=>{
      console.log("err",err);
    })
  };

  return (
    <React.Fragment>
     <View style={{backgroundColor: '#fff', flex: 1}}>
      <TouchableOpacity
         onPress={() => {
            navigation.navigate('Profile'),
            dispatch(getPersonDetails(store.userDetails.person_id))
          }}  
        style={{
          flexDirection: 'row',
          height: 100,
          margin: 20,
          borderBottomWidth: 1,
          alignItems: 'center',
        }}>
        <ImageBackground
          style={{height: 60, width: 60, borderRadius: 100}}
          source={store.personDetails!=="" &&store.personDetails.profilePhoto &&store.personDetails.profilePhoto !== "" ? {uri:store.personDetails.profilePhoto} : require('../../images/user.jpg')}
          imageStyle={{borderRadius: 100}}
        />
        <View style={{marginLeft: 20,flex:1}}>
          <Text style={commonStyle.label}>
            {store.personDetails.firstName + " " +store.personDetails.lastName}
          </Text>
          <Text numberOfLines={1}  style={[commonStyle.normalText,{textTransform: 'lowercase',flexWrap:'wrap'}]}>
            {store.personDetails.email}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{marginLeft: 5}}>
        { store.userDetails.role && store.userDetails.role.includes("client") ?
          <React.Fragment>
           <TouchableOpacity
              onPress={() => {navigation.navigate('ClientDashboard');dispatch(getClientDasboardCount(store.userDetails.company_id))}}
              style={{flexDirection: 'row', alignItems: 'center', paddingTop: 15}}>
              <View style={styles.iconContainer}>
                <Icon size={18} name="user" type='font-awesome' color={colors.theme} />
              </View>
              <Text style={commonStyle.normalText}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {navigation.navigate('ServiceRequest');dispatch(getDropDownList(store.clientDetails.data._id))}}
              style={{flexDirection: 'row', alignItems: 'center', paddingTop: 15}}>
              <View style={styles.iconContainer}>
                <Icon size={18} name="cog" type='font-awesome' color={colors.theme} />
              </View>
              <Text style={commonStyle.normalText}>Service Request</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {navigation.navigate('ListOfClientTickets',{title:"Pending Tickets"});dispatch(getClientTicketsList(store.clientDetails.data._id,'Pending'))}}
              style={{flexDirection: 'row', alignItems: 'center', paddingTop: 15}}>
              <View style={styles.iconContainer}>
                <Icon size={18} name="ticket" type='font-awesome' color={colors.theme} />
              </View>
              <Text style={commonStyle.normalText}>Pending Tickets ({clientDashboardCount.pendingCount})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {navigation.navigate('ListOfClientTickets',{title:"Closed Tickets"});dispatch(getClientTicketsList(store.clientDetails.data._id,'Closed'))}}
              style={{flexDirection: 'row', alignItems: 'center', paddingTop: 15}}>
              <View style={styles.iconContainer}>
                <Icon size={18} name="ticket" type='font-awesome' color={colors.theme} />
              </View>
              <Text style={commonStyle.normalText}>Closed Tickets ({clientDashboardCount.closedCount})</Text>
            </TouchableOpacity>
          </React.Fragment>
          :
          <React.Fragment>
           <TouchableOpacity
              onPress={() => {navigation.navigate('TechnicianDashboard');dispatch(getDasboardCount(store.userDetails.person_id))}}
              style={{flexDirection: 'row', alignItems: 'center', paddingTop: 15}}>
              <View style={styles.iconContainer}>
                <Icon size={18} name="user" type='font-awesome' color={colors.theme} />
              </View>
              <Text style={commonStyle.normalText} >Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
             onPress={()=>{
                navigation.navigate('ListOfTechnicianTickets',{status:"New"}),
                dispatch(getTechnicianTicketsList(store.userDetails.person_id,'Allocated'))
                navigation.closeDrawer();
              }}
              style={{flexDirection: 'row', alignItems: 'center', paddingTop: 15}}>
              <View style={styles.iconContainer}>
                <Icon size={18} name="ticket" type='font-awesome' color={colors.theme} />
              </View>
              <Text style={commonStyle.normalText}>New Tickets ({dashboardCount.newCount})</Text>
            </TouchableOpacity>
            <TouchableOpacity
             onPress={()=>{
                navigation.navigate('ListOfTechnicianTickets',{status:"WIP"}),
                dispatch(getTechnicianTicketsList(store.userDetails.person_id,'Work In Progress')),
                navigation.closeDrawer();
              }}
              style={{flexDirection: 'row', alignItems: 'center', paddingTop: 15}}>
              <View style={styles.iconContainer}>
                <Icon size={18} name="ticket" type='font-awesome' color={colors.theme} />
              </View>
              <Text style={commonStyle.normalText}>WIP Tickets ({dashboardCount.wipCount})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{
                navigation.navigate('ListOfTechnicianTickets',{status:"Completed"}),
                dispatch(getTechnicianTicketsList(store.userDetails.person_id,'Resolved')),
                navigation.closeDrawer();
              }}
              style={{flexDirection: 'row', alignItems: 'center', paddingTop: 15}}>
              <View style={styles.iconContainer}>
                <Icon size={18} name="ticket" type='font-awesome' color={colors.theme} />
              </View>
              <Text style={commonStyle.normalText}>Completed Tickets ({dashboardCount.completedCount})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{
                navigation.navigate('ListOfTechnicianTickets',{status:"Rejected"}),
                dispatch(getTechnicianTicketsList(store.userDetails.person_id,'Assignee Rejected')),
                navigation.closeDrawer();
              }}
              style={{flexDirection: 'row', alignItems: 'center', paddingTop: 15}}>
              <View style={styles.iconContainer}>
                <Icon size={18} name="ticket" type='font-awesome' color={colors.theme} />
              </View>
              <Text style={commonStyle.normalText}>Rejected Tickets ({dashboardCount.rejectedCount})</Text>
            </TouchableOpacity>
            <TouchableOpacity
             onPress={()=>{
                navigation.navigate('ListOfTechnicianTickets',{status:"Total"}),
                dispatch(getTechnicianTicketsList(store.userDetails.person_id,'All')),
                navigation.closeDrawer();
              }}
              style={{flexDirection: 'row', alignItems: 'center', paddingTop: 15}}>
              <View style={styles.iconContainer}>
                <Icon size={18} name="ticket" type='font-awesome' color={colors.theme} />
              </View>
              <Text style={commonStyle.normalText}>Total Tickets ({dashboardCount.totalCount})</Text>
            </TouchableOpacity>
            <TouchableOpacity
             onPress={()=>{
                navigation.navigate('AttendanceHistory'),
                dispatch(getTechnicianTicketsList(store.userDetails.person_id,'All')),
                navigation.closeDrawer();
              }}
              style={{flexDirection: 'row', alignItems: 'center', paddingTop: 15}}>
              <View style={styles.iconContainer}>
                <Icon size={18} name="calendar" type='font-awesome' color={colors.theme} />
              </View>
              <Text style={commonStyle.normalText}>My Attendance</Text>
            </TouchableOpacity>
          </React.Fragment>
        }
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profile'),
            dispatch(getPersonDetails(store.userDetails.person_id))
          }}  
          style={{flexDirection: 'row', alignItems: 'center', paddingTop: 15}}>
          <View style={styles.iconContainer}>
            <Icon size={18} name="user" type='font-awesome' color={colors.theme} />
          </View>
          <Text style={commonStyle.normalText}>Account Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>logout()}
          style={{flexDirection: 'row', alignItems: 'center', paddingTop: 15}}>
          <View style={styles.iconContainer}>
            <Icon size={18} name="logout" type='material-community' color={colors.theme} />
          </View>
          <Text style={commonStyle.normalText}>Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{marginTop: 45, marginLeft: 25}}>
          <Text style={commonStyle.normalText}>Version 1.0.5</Text>
        </TouchableOpacity>
      </View>
    </View>
    </React.Fragment>
  );
};
const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#fff',
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    marginLeft: 25,
    borderWidth: 1,
    borderColor: '#f1f1f1',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
});