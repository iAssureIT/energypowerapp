import React,{useEffect,useState} from "react";
import {Text, View } from "react-native";
import { ScrollView, Dimensions } from 'react-native';
import axios from "axios";
import Loading from '../Loading/Loading.js';
import HTML from 'react-native-render-html';
import styles from './styles.js';
import {HeaderBar}              from '../../layouts/Header/Header.js';
var moment = require('moment');
import AsyncStorage                 from '@react-native-community/async-storage';

 export const InAppNotification =(props)=>{
    const [inAppNotifications,setInAppNotifications] = useState([]);
    const [loading,seLoading] = useState(true);
    useEffect(() => {
        getNotificationList();
      }, [])  

      const getNotificationList=()=>{
        AsyncStorage.multiGet(['token', 'user_id'])
        .then((data) => {
          console.log("data",data);
          token = data[0][1]
          user_id = data[1][1]
          axios.get('/api/notifications/get/allList/' + user_id)
          .then(notifications => {
              console.log("notifications",notifications);
              setInAppNotifications(notifications.data);
              seLoading(false)
          })
          .catch(error => {
            console.log('error', error)
          })
              
          axios.patch('/api/notifications/patch/list/Read/'+user_id)
          .then(res => {
          })
          .catch(error => {
              // console.log('error', error)
          })
        })
      }
      



        return (
            <ScrollView keyboardShouldPersistTaps="handled" >
               <HeaderBar navigation={props.navigation} showBackBtn={true} title="Notifications"/>
                <View style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
                    {!loading?
                      inAppNotifications && inAppNotifications.length > 0 ?
                            inAppNotifications.map((data, index) => {
                                return (
                                <View style={{flexDirection:'row',marginBottom:5,borderWidth:1,borderColor:'#aaa',borderRadius:5,shadowRadius: 5,}}>
                                    <View style={[styles.packageIndex]}>
                                        <Text style={styles.dateText}>{moment(data.createdAt).format('DD')}</Text>
                                        <Text style={{alignSelf:"center",fontFamily:"Montserrat-Regular"}}>{moment(data.createdAt).format('MMM')}</Text>
                                    </View>
                                    <View style={{flex:.8,flexDirection:'row',borderLeftWidth:1,borderColor:'#ccc',paddingLeft:15,}}>
                                        <View style={{flex: 1,fontFamily:"Montserrat-Regular"}}>
                                            <HTML  html={data.notifBody}  />
                                        </View>                                    
                                    </View>
                                </View>     

                                )
                            })
                            :
                            <View style={{ paddingHorizontal: 0, borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 20 }}>
                                <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 15, alignSelf: 'center', justifyContent: 'center', alignItem: 'center' }}>
                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', color: '#333', fontSize: 16 }}>You have no notifications</Text>
                                </View>

                            </View>
                        :
                        <Loading />
                    }
                </View>
            </ScrollView>
        );
    }