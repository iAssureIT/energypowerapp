
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
import moment                               from 'moment'
const window = Dimensions.get('window');
const haversine = require('haversine')
  

export default class CurrentTime extends React.Component {
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
      curTime : new Date()
    };
  }

  componentDidMount(){
    setInterval( () => {
      this.setState({
        curTime : new Date()
      })
    },1000)


  }

  render(){
      return(
          <View style={styles.digitalClock}>
            <Text style={styles.time}>{moment(this.state.curTime).format('LTS')}</Text>
             <View style={{alignItems:"center"}}>
              <Text style={[styles.textHeader]}>{moment(this.state.date).format('DD/MM/YYYY')}</Text>
            </View>
          </View>  
      );
  }

}