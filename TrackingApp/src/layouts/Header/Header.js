import React,{useEffect,useState} from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import { Header, Icon  }                     from 'react-native-elements';
import { NavigationActions, StackActions, }  from 'react-navigation'
import { DrawerActions }                     from 'react-navigation-drawer';
import styles                                from "./styles.js";
import commonStyle                           from '../../config/commonStyle.js';
import {useSelector, useDispatch}            from 'react-redux';
import axios                                 from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export const HeaderBar = (props) => {
  const store = useSelector(store => ({
    userDetails     : store.userDetails,
    attendance      : store.attendance,
  }));
  const [showMenu,toggleManu] = useState(true);
  const [inAppNotificationsCount,setInAppNotificationsCount] = useState()


  const routeInApp = async (props) => {
    const user_id = await AsyncStorage.getItem('user_id');
    const person_id = await AsyncStorage.getItem('person_id');
    const role = JSON.parse(await AsyncStorage.getItem('role'));
    console.log("role",role);
    if(role.includes('technician')){
     props.navigation.navigate('InAppNotification')
    }else{
      props.navigation.navigate('InAppNotificationClient')
    }
  };
  useEffect(() => {
    getNotificationList();
  }, [store.userDetails.user_id])  

  const getNotificationList=async()=>{
    const user_id = await AsyncStorage.getItem('user_id');
      axios.get('/api/notifications/get/list/Unread/' + user_id)
      .then(notifications => {
        setInAppNotificationsCount(notifications.data.length)
      })
      .catch(error => {
          console.log('error', error)
      })
  }
  return (
    <React.Fragment>
      <Header
        placement="center"
        leftComponent={
          <View style={{flexDirection:"row"}}>
            {
              
              showMenu ?
                <TouchableOpacity style={{width:40}} onPress={()=> props.navigation.toggleDrawer()}>
                  <Icon size={28} name='menu' type='material-community' color='#fff' />
                </TouchableOpacity>
              :
              null
            } 
            {
              props.showBackBtn && showMenu  ?
              <TouchableOpacity onPress={()=> props.navigation.dispatch(NavigationActions.back())}>
                <Icon size={28} name='arrow-left' type='feather' color='#fff' />
              </TouchableOpacity>
              :
              null  
          }
          </View> 
        }
        centerComponent={
          /*<TouchableOpacity onPress={()=>props.navigation.navigate('Dashboard')}>*/
            <Text style={{fontSize:20,color:"#fff",fontFamily: 'Montserrat-Bold'}}>{props.title ? props.title : "Energy Power"}</Text>
          /*</TouchableOpacity>*/
        }
        rightComponent={
          <View style={{flexDirection:"row"}}>
          <TouchableOpacity style={{width:50} } onPress={()=> routeInApp(props)}>
             <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 6, alignSelf: 'flex-start',}}>
                <Icon size={wp("7%")} name='bell' type='material-community' color='#fff' />
                {
                 inAppNotificationsCount > 0 ?
                    inAppNotificationsCount < 9 ?
                      <View style={styles.notificationText}>
                        <Text style={styles.notificationTextbellicon}>
                          {inAppNotificationsCount}
                        </Text>
                      </View>
                      :
                      <View style={styles.notificationText}>
                        <Text style={styles.notificationTextbelliconplus}>
                            9
                        </Text>
                        <Icon name="plus" type={'material-community'} size={12} color="#fff" iconStyle={styles.bellplus} />
                      </View>
                    
                    :
                    null
                } 
              </View>
          </TouchableOpacity>
            {/* <TouchableOpacity style={{justifyContent:"center",height:40,width:40,borderRadius:100,backgroundColor:this.state.color}} onPress={()=>this.sosNotification()}>
                <Text style={{color:"#fff",alignSelf:"center",fontFamily: 'Montserrat-Bold'}}>S</Text>
              </TouchableOpacity> */}
          </View>
        }
        containerStyle={styles.container}
      />
     {/* <View style={{flexDirection:"row",marginBottom:30}}>
         <View style={{flex:1,alignItems:"flex-end",paddingHorizontal:10}}> 
          <Image
            style={{height:50,width:50,alignItems:"flex-end"}}
            source={require('../../images/Logo.png')}
            resizeMode={'contain'}
          />
        </View>  
      </View>*/}
    </React.Fragment>
  );
}


