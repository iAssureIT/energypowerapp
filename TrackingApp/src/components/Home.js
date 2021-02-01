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
import { Header, Icon  }                                        from 'react-native-elements';
import { NavigationActions,StackActions, withNavigationFocus }  from 'react-navigation';
import { request,check,PERMISSIONS,RESULTS }                    from 'react-native-permissions';
import Geolocation                                              from 'react-native-geolocation-service';
import axios                                                    from 'axios';
import { Dropdown }                                             from 'react-native-material-dropdown';
import styles                                                   from './styles.js';
import {colors,sizes}                                           from '../config/styles.js';
import Geocoder                                                 from 'react-native-geocoding';
import moment                                                   from 'moment';
import HeaderBar                                                from '../layouts/Header/Header.js';
import AsyncStorage                                             from '@react-native-community/async-storage';
import CurrentTime                                              from './CurrentTime/CurrentTime.js';
import { connect }                                              from 'react-redux';

const window = Dimensions.get('window');
const haversine = require('haversine')
  
class Home extends React.Component {
constructor(props) {
  super(props);
    this.state = {
      startTime       : "",
      startLocation   : "",
      date            : new Date(),
      user_id         : ","
    };
   AsyncStorage.multiGet(['user_id','token'])
    .then((data)=>{
      console.log("data app",data);
      this.setState({
        user_id : data[0][1],
        token  : data[1][1],
      })
    })
  }

  componentDidMount(){

  }


  startTracking(){
    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    .then(result => {
      console.log("result",result);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('This feature is not available (on this device / in this context)');
          break;

        case RESULTS.DENIED:
          console.log('The permission has not been requested / is denied but requestable');
          break;

        case RESULTS.GRANTED:
         console.log('The permission is granted');
          
          // Geolocation.getCurrentPosition(initialPosition => {this.setState({ initialPosition })});
          Geolocation.getCurrentPosition(position => {
           const formValues = {
              startDateTime: new Date(),
              startLocation :{
                  longitude : position.coords.longitude,
                  latitude  : position.coords.latitude
              },
              userId : this.state.user_id,
            };

            console.log("formValues=>",formValues);
            axios
            .post('/api/tracking/post/startDetails',formValues)
              .then((tracking)=>{
                console.log("tracking",tracking);
                this.props.setStartingCoordinates(tracking.data.tracking_id,position.coords.longitude,position.coords.latitude)
                this.props.navigation.navigate('StartLocationDetails')
              })
              .catch(error=>{
                console.log("error=>",error)
              })
                error => console.log(error)
            });
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
        }
    })
    .catch(error => {
      console.log("error = ",error);
    });  
  }

  render(){
    const {navigation}=this.props;
      return(
        <ImageBackground source={{}}  style={styles.container} resizeMode="cover" >
          <HeaderBar navigation={navigation} showBackBtn={false} headerName={"Home"}/>  
          <View style={{height:"80%",alignItems:"center",justifyContent:"center"}}>
            <CurrentTime /> 
            <TouchableOpacity onPress = {this.startTracking.bind(this)} style= {styles.startButton}>
              <View style={{flex:0.6,alignItems:"flex-end"}}>
                <Text style={{fontSize:25,color:"#fff",}}>Start</Text>
              </View> 
              <View style={{flex:0.4}}>
                <Icon size={40} name='play-circle' type='font-awesome' color='#fff' />
              </View>  
            </TouchableOpacity>
          </View> 
        </ImageBackground>
      );
  }
}

const mapStateToProps = (state)=>{
  return {
    user_id   : state.user_id,
  }
};
const mapDispatchToProps = (dispatch)=>{
  return {
      setStartingCoordinates  : (tracking_id,longitude,latitude)=> dispatch({type: "SET_STARTING_COORDINATES",
                            tracking_id : tracking_id,
                            longitude   : longitude,
                            latitude    : latitude,
                  }),
  }
};
export default connect(mapStateToProps,mapDispatchToProps)(Home);