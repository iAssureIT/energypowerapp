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
          Button
        } from 'react-native';

import { NavigationActions,StackActions, withNavigationFocus }  from 'react-navigation';
import { request,check,PERMISSIONS,RESULTS }                    from 'react-native-permissions';
import Geolocation                                              from 'react-native-geolocation-service';
import axios                                                    from 'axios';
import { Dropdown }                                             from 'react-native-material-dropdown';
import styles                               from './styles.js';
import {colors,sizes}                       from '../../config/styles.js';
import Geocoder                             from 'react-native-geocoding';
import moment                               from 'moment';
import FromLocation                         from '../FromLocation/FromLocation.js'
import LocationRoute                        from '../LocationRoute/LocationRoute.js'
import CurrentTime                          from '../CurrentTime/CurrentTime.js'
import HeaderBar                            from '../../layouts/Header/Header.js';
import { Header, Icon  }                    from 'react-native-elements';
import Dialog                               from "react-native-dialog";
import AsyncStorage                         from '@react-native-community/async-storage';
import Loading                              from '../../layouts/Loading/Loading.js';
import { connect }        from 'react-redux';

const window = Dimensions.get('window');
const haversine = require('haversine')
  

class LocationDetails extends React.Component {
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
      startDetails     : "",
      openModalFrom    : false,
      openModalRoute   : false,
      pageLoader       : true,
      latitude         : null,
      longitude        : null,
      routeCoordinates : [],
      distanceTravelled: 0,
      prevLatLng       : {},
      user_id          : "",
      tracking_id      : "",
    };
  }

  componentDidMount(){
    console.log("this.props.tracking_id",this.props.tracking_id);
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.getTrackingDetails();
    })
  }

  componentWillUnmount () {
    this.focusListener.remove();
  }

  getTrackingDetails(){
    console.log("this.props.tracking_id",this.props.tracking_id);
    if(this.props.tracking_id){
      axios
      .get('/api/tracking/get/startDetails/'+this.props.tracking_id)
      .then((startDetails)=>{
        this.setState({startDetails:startDetails.data,pageLoader:false}); 
      })
      .catch(error=>{
        console.log("error=>",error)
      })
    }else{
      this.setState({pageLoader:false}); 
    }  
  }

  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  handleCancel = () => {
    this.setState({
     openModalFrom      : false,
     openModalRoute      : false,
   });
  };

  openModalFrom(){
    this.setState({
     openModalFrom      : true,
   });
  };
  openModalRoute(){
    this.setState({
     openModalRoute      : true,
   });
  };


  endTracking(){
   const endTrackingValues={
      endDateAndTime : new Date(),
      tracking_id    : this.props.tracking_id,
    }
     axios
      .patch("/api/tracking/patch/endDetails",endTrackingValues)
      .then((locResponse)=>{
        console.log("locResponse",locResponse.data)
        if(locResponse){
          this.props.navigation.navigate('MyTravelHistory');
          console.log("locResponse = ",locResponse);
        }
      })
      .catch((error)=>{
        console.log("error = ",error.message);
      });
  }

  msToTime(duration){
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  }


  render(){
    const { navigation } = this.props;
    const { startDetails,pageLoader } =this.state;
    console.log("startDetails",startDetails);
      return(

        <React.Fragment>
          <ImageBackground source={{}}  style={styles.container} resizeMode="cover" >
            <HeaderBar navigation={navigation} showBackBtn={true} headerName={"End Details"}/>  
            {!pageLoader ?
              startDetails!=="" && startDetails.startLocation  ?
              <View style={{height:200,marginTop:50,alignItems:"center"}}>
                <View style={{height:100,width:"100%",paddingHorizontal:50}}>
                  <View style={{flexDirection:"row"}}>
                    <View style={{flex:0.85}}>
                        <View style={{flexDirection:"row"}}>
                          <Text style={{fontSize:20,color:"#376bff"}}>Started At</Text>
                        </View>  
                      <Text style={{fontSize:18}}>{startDetails.startDateAndTime ? moment(startDetails.startDateAndTime).format('LTS') :"--"}</Text>
                    </View>
                    <View style={{flex:0.85}}>
                        <View style={{flexDirection:"row"}}>
                          <Text style={{fontSize:20,color:"#376bff",paddingHorizontal:5}}>Ended At</Text>
                        </View>  
                      <Text style={{fontSize:18}}>{startDetails.endDateAndTime ? moment(startDetails.endDateAndTime).format('LTS') : "--"}</Text>
                    </View> 
                  </View>
                </View>  
                <View style={{height:100,width:"100%",paddingHorizontal:50}}>
                  <View style={{flexDirection:"row"}}>
                    <View style={{flex:0.85}}>
                        <View style={{flexDirection:"row"}}>
                          <Text style={{fontSize:20,color:"#376bff"}}>Total Time</Text>
                        </View>  
                      <Text style={{fontSize:18}}>{startDetails.totalTime ? this.msToTime(startDetails.totalTime) : "--"}</Text>
                    </View>
                    <View style={{flex:0.85}}>
                        <View style={{flexDirection:"row"}}>
                          <Text style={{fontSize:20,color:"#376bff"}}>Total Distance</Text>
                        </View>  
                      <Text style={{fontSize:18}}>{startDetails.totalDistanceTravelled ? startDetails.totalDistanceTravelled.toFixed(4)+" Km" : "0 Km"}</Text>
                    </View>
                  </View>
                </View> 
                <View style={{marginBottom:50}}>
                  <LocationRoute trackingDetails={startDetails} />
                </View>
                <TouchableOpacity onPress = {()=>{this.props.navigation.navigate('MyTravelHistory')}} style= {styles.startButton}>
                  <View style={{flex:0.6,alignItems:"flex-end"}}>
                    <Text style={{fontSize:25,color:"#fff",}}>Next</Text>
                  </View> 
                  <View style={{flex:0.4}}>
                    <Icon size={40} name='chevrons-right' type='feather' color='#fff' />
                  </View>  
                </TouchableOpacity>
              </View>
              :
              <Text style={{fontSize:20,justifyContent:"center",alignSelf:"center"}}>No data found</Text>  
            :
          <Loading />
         }
        </ImageBackground>
          
          <Dialog.Container visible={this.state.openModalFrom}>
              <FromLocation coordinates={startDetails.startLocation} />
              <Dialog.Button label="Ok" onPress={this.handleCancel} />
           </Dialog.Container>
            <Dialog.Container visible={this.state.openModalRoute}>
              <LocationRoute trackingDetails={startDetails} />
              <Dialog.Button label="Ok" onPress={this.handleCancel} />
           </Dialog.Container>

        </React.Fragment>  
      );
  }

}
const mapStateToProps = (state)=>{
  return {
    tracking_id : state.tracking_id,
  }
  
};
export default connect(mapStateToProps)(LocationDetails);