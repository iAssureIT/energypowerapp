import React from 'react';
import {  StyleSheet,
          ScrollView,
          View,
          Text,
          TouchableOpacity,
          Alert,
          ImageBackground,
          Image,
          Platform,
          Dimensions,
          FlatList,
          RefreshControl
        } from 'react-native';


import  MapView, 
        { PROVIDER_GOOGLE, 
          Polyline, 
          Marker, 
          AnimatedRegion, 
          Animated 
        } from 'react-native-maps';

import { NavigationActions,StackActions, withNavigationFocus }  from 'react-navigation';
import { request,check,PERMISSIONS,RESULTS }                    from 'react-native-permissions';
import Geolocation                                              from 'react-native-geolocation-service';
import axios                                                    from 'axios';
import HeaderBar                                                from '../../layouts/Header/Header.js';
import styles                                                   from './styles.js';
import {colors,sizes}                                           from '../../config/styles.js';
import Dialog                               from "react-native-dialog";
import LocationRoute                        from '../LocationRoute/LocationRoute.js'
import moment                               from 'moment';
import { Header, Icon  }                    from 'react-native-elements';
import AsyncStorage                         from '@react-native-community/async-storage';

const window = Dimensions.get('window');
const haversine = require('haversine')
  

export default class FuelReimbursement extends React.Component {
 navigateScreen=(route)=>{
      const navigateAction = NavigationActions.navigate({
      routeName: route,
      params: {},
      action: NavigationActions.navigate({ routeName: route }),
    });
    this.props.navigation.dispatch(navigateAction);
  }


constructor(props) {
  super(props);
      this.state = {
        openModal:false,
        date     : new Date(),
        myHistory:[]
    };
  }

  componentDidMount(){ 
       AsyncStorage.multiGet(['userId','tracking_id'])
      .then((data)=>{
         userId = data[0][1],
         tracking_id = data[1][1]
          this.setState({
            userId : userId,
            tracking_id : tracking_id
         },()=>{
            axios
            .get('/api/tracking/get/daywiseLocationDetails/'+this.state.userId)
              .then((myHistory)=>{
                  this.setState({
                   myHistory   : myHistory.data
                 });
              })
              .catch(error=>{
                console.log("error=>",error)
              })
         })
      })   
    
  }

 handleCancel = () => {
    this.setState({
      openModal      : false,
    });
  };

  msToTime(duration){
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }

   _renderItem = ({item,index}) => (
      <TouchableOpacity style={styles.historyBox} key={index} onPress={()=>{this.getData(item._id)}}>
       <View style={styles.historyBoxLeft}>
          <Text style={styles.dateText}>{moment(item.createdAt).format('DD')}</Text>
          <Text style={styles.dateText}>{moment(item.createdAt).format('MMMM')}</Text>
        </View>
        <View style={styles.historyBoxRight}>
           <View style={styles.historyDetail}>
              <Text style={styles.historyText}>Total Time : </Text>
              <Text style={styles.historyText}>{item.totalTime ? this.msToTime(item.totalTime) : "00:00:00"}</Text>
            </View> 
            <View style={styles.historyDetail}>
              <Text style={styles.historyText}>Total Distance : </Text>
              {item.distanceTravelled ?
                <Text style={styles.historyText}>{item.distanceTravelled}</Text>
                :
                <Text style={styles.historyText}>0 Km</Text>
              }  
            </View> 
        </View>
     </TouchableOpacity>
  );

   onRefresh() {
    this.setState({refresh: true});
    setTimeout(() => {
      this.setState({refresh: false});
    }, 2000);
  }

  getData(locationId){
     axios
    .get('/api/tracking/get/startDetails/'+locationId)
      .then((startDetails)=>{
        this.setState({
          openModal       : true,
          trackingDetails : startDetails.data
        }) 
      })
      .catch(error=>{
        console.log("error=>",error)
      })
  }

  render(){
    // console.log("this.state.date=>",this.state.date);
    const { navigation } = this.props;
    const { myHistory } = this.state;
      return(
        <React.Fragment>
          <ImageBackground source={{}}  style={styles.container} resizeMode="cover" >
          <HeaderBar navigation={navigation} showBackBtn={true} headerName={"Fuel Reimbursement"}/>
           <View style={styles.myHistory} >
              <FlatList
                data={this.state.myHistory}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refresh}
                    onRefresh={() => this.onRefresh()}
                  />
                }
              />
          </View>    
          </ImageBackground>
          <Dialog.Container visible={this.state.openModal}>
            <LocationRoute trackingDetails={this.state.trackingDetails}/>
            <Dialog.Button label="Ok" onPress={this.handleCancel} />
          </Dialog.Container>
        </React.Fragment>  
      );
  }

}