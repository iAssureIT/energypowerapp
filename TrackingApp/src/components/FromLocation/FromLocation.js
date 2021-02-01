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

const window = Dimensions.get('window');
const haversine = require('haversine')
  

export default class FromLocation extends React.Component {
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
        latitude: 18.5182404,
        longitude: 73.9368982,
        latitudeDelta: 0.04864195044303443*4,
        longitudeDelta: 0.040142817690068*4
      }),
      routeCoordinates:[],
      distanceTravelled: 0,
      prevLatLng: {},
    };
  }

  componentDidMount(){ 
    // console.log("this.props.coordinates",this.props.coordinates);
  }

  calcDistance = newLatLng => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  getMapRegion = () => ({
    latitude: this.props.coordinates?this.props.coordinates.latitude:this.state.latitude,
    longitude: this.props.coordinates? this.props.coordinates.longitude: this.state.longitude,
    latitudeDelta: 0.0043,
    longitudeDelta: 0.0034
  });


  render(){
      console.log("coordinate=>",this.props.coordinates);

      return(
         <MapView
            ref={map => this.map = map}
            region = {this.getMapRegion()}
            style={[{height:300,width:300}]}
            provider={PROVIDER_GOOGLE}
          >
            <MapView.Marker
                coordinate={this.props.coordinates ? this.props.coordinates : this.state.coordinate}
              />
            
          </MapView>
      );
  }

}