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
import { Header, Icon  }                                        from 'react-native-elements';

const window = Dimensions.get('window');
const haversine = require('haversine')
  

export default class LocationRoute extends React.Component {
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
      latitude: 18.5182404,
      longitude: 73.9368982,
      coordinate:new AnimatedRegion({
        latitude: 18.5204,
        longitude: 73.8567,
        latitudeDelta: 0.04864195044303443*4,
        longitudeDelta: 0.040142817690068*4
      }),
      // routeCoordinates:[
      //   {latitude:18.5204, longitude:73.8567},
      //   {latitude:19.0760, longitude:72.8777},
      //   {latitude:19.9975, longitude:73.7898},
      //   {latitude:18.5305, longitude:73.8547},
      // ],
      // routeCoordinates : [],
      distanceTravelled: 0,
      prevLatLng: {},
      showMap:false,
    };
  }

  componentDidMount(){ 
    // console.log("this.props.trackingDetails",this.props.trackingDetails);
  }

  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  getMapRegion = (coords) => ({
    latitude: coords.latitude,
    longitude: coords.longitude,
    latitudeDelta: coords.latitude/1000,
    longitudeDelta: coords.longitude/1000
  });

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

  render(){
    const { trackingDetails } = this.props;
    console.log("trackingDetails",trackingDetails);

      return(
        <React.Fragment>
        {trackingDetails.routeCoordinates && this.state.showMap?
          <MapView
            showUserLocation
            followUserLocation
            loadingEnabled
            ref={map => this.map = map}
            region = {this.getMapRegion(trackingDetails.routeCoordinates[0])}
            style={[{width:300,height:300}]}
            provider={PROVIDER_GOOGLE}
          >
            <Polyline 
              coordinates = {trackingDetails.routeCoordinates} 
              strokeWidth = {5} 
              strokeColor = "#000" 
              geodesic    = {true} 
            />
            <Marker.Animated
              ref={marker => {
                this.marker = marker;
              }}
              coordinate={trackingDetails.routeCoordinates[0]}
            />

         </MapView>
          :
          <TouchableOpacity style={{width:300,height:300,backgroundColor:"#f1f1f1",alignItems:"center",justifyContent:"center"}} onPress={()=>this.setState({showMap:true})}>
            <Text style={{}}>Click here to view</Text>
          </TouchableOpacity>
         } 
        </React.Fragment>
        
      );
  }

}