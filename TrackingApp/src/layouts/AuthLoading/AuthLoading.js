import React, {Component, useEffect} from 'react';
import {ActivityIndicator, StatusBar, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch} from 'react-redux';
import {useNavigation} from '../../config/useNavigation';
import {SET_TOKEN} from '../../redux/user/types';
import {getUserDetails} from '../../redux/user/actions';
import {getDasboardCount} from '../../redux/technicianDashboardCount/actions';
import {getClientDasboardCount} from '../../redux/clientDashboardCount/actions';
import {getClientDetails} from '../../redux/clientDetails/actions';
import { getS3Details }     from '../../redux/s3Details/actions';
import axios from 'axios';
import {getPersonDetails}             from '../../redux/personDetails/actions';
// import styles         from '../Loading/styles.js';

export const AuthLoadingScreen = () => {
  console.log(':Inside Authstack');
  useEffect(() => {
    _bootstrapAsync();
  }, []);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const _bootstrapAsync = async () => {
    const user_id = await AsyncStorage.getItem('user_id');
    const person_id = await AsyncStorage.getItem('person_id');
    const client_id = await AsyncStorage.getItem('client_id');
    const role = JSON.parse(await AsyncStorage.getItem('role'));
    if (user_id && person_id && role) {
      goToApp(user_id, person_id,role,client_id);
    } else {
      navigation.navigate('AuthStack');
    }
  };
  goToApp = (user_id,person_id,role,client_id) => {
    dispatch(getUserDetails(user_id,person_id));
    dispatch(getPersonDetails(person_id));
    dispatch(getS3Details())
    if(role.includes("client")){
      dispatch(getClientDasboardCount(client_id))
      navigation.navigate('ClientApp');
    }else if(role.includes('technician') || role.includes('employee')){
      axios
      .get('/api/attendance/get/get_tracking_status/'+user_id)
      .then((attendance)=>{
        if(attendance.data && attendance.data.startDateAndTime){
          dispatch(getDasboardCount(person_id));
          navigation.navigate('TechnicianApp');
        }else{
          dispatch(getDasboardCount(person_id));
          navigation.navigate('Attendance');
        }
      })
      .catch(error=>{
        console.log("error=>",error)
      })
    }
  };
  return <ActivityIndicator />;
};