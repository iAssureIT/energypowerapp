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
          TextInput
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
import axios                                                    from 'axios';
import styles                                                   from './styles.js';
import HeaderBar                                                from '../../layouts/Header/Header.js';
import { Header, Icon, Button  }                                from 'react-native-elements';
import UploadPic                                                from './UploadPic/UploadPic.js';
import EmployeeAddress                                          from './EmployeeAddress/EmployeeAddress.js';
import { TextField }                                            from 'react-native-material-textfield';
import {colors,sizes}                                           from '../../config/styles.js';
import FromLocation                                             from '../FromLocation/FromLocation.js'
import Geolocation                                              from 'react-native-geolocation-service';
import AsyncStorage                                             from '@react-native-community/async-storage';
import Loading                                                  from '../../layouts/Loading/Loading.js';
import { KeyboardAwareScrollView }  from 'react-native-keyboard-aware-scroll-view';

const window = Dimensions.get('window');
const haversine = require('haversine')
  
export default class EmployeeProfile extends React.Component {
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
      openModal         : false,
      coordinate        : "",
      firstName          : "",
      lastName          : "",
      mobileNumber      : "",
      email             : "",
      userData          : ""
    };
  }

  componentDidMount(){
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.getUserData();
    })
  }

  componentWillUnmount () {
    this.focusListener.remove();
  }

  getUserData(){
    AsyncStorage.getItem('user_id')
    .then((userId)=>{
      axios.get('/api/users/get/'+userId)
      .then((user)=>{
        console.log('user',user);
        this.setState({
          firstName      : user.data.firstname,
          lastName       : user.data.lastname,
          mobileNumber   : user.data.mobile,
          email          : user.data.email,
          user_id        : userId,
          userData       : user.data  
        })
      })
      .catch((error)=>{
        console.log("error=>",error)
      })
    })
  }

  watchPosition(){
    Geolocation.getCurrentPosition(position => {
      console.log("position=>",position)
      const newCoordinate = {
        latitude          : position.coords.latitude,
        longitude         : position.coords.longitude,
      }
      this.setState({coordinate:newCoordinate})
    },
    (error) => {console.log(error.code, error.message)},
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };


  render(){
      const { navigation } = this.props;
      const { firstName, lastName, mobileNumber, email } = this.state;
      const { navigate } = this.props.navigation;

      return(
        <React.Fragment>
          <HeaderBar navigation={navigation} showBackBtn={true} headerName={"My Profile"}/>  
          <ImageBackground source={{}}  style={styles.container} resizeMode="cover" >
            {
              firstName, lastName, mobileNumber, email ?
              <KeyboardAwareScrollView enabled>
              <View style={{paddingHorizontal:20}}>
                <View style={{paddingVertical:10,backgroundColor:'#fff', borderBottomWidth: 0,paddingHorizontal:10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 1,borderRadius:10}}>
                  <View style={{flexDirection:'row', alignItems:"center",borderBottomWidth:1,paddingVertical:10}}>
                    <UploadPic />
                    <View style={{paddingHorizontal:10}}>
                      <Text style={{fontSize:20}}>{this.state.firstName+" "+this.state.lastName}</Text>
                      <Text style={{fontSize:15}}>{this.state.email}</Text>
                      <Text style={{fontSize:15}}>{this.state.mobileNumber}</Text>
                      <Text style={{fontSize:15,color:"#283593"}} onPress={()=>this.props.navigation.navigate('EmployeeProfileEdit')}>Edit Details</Text>
                    </View> 
                  </View>
                  {/*<View style={{alignItems:"center",marginTop:20}}>
                    <Button
                      onPress         = {this.watchPosition.bind(this)}
                      titleStyle      = {styles.buttonText}
                      title           = " Get Home Location"
                      buttonStyle     = {styles.button}
                      containerStyle  = {[styles.buttonContainer,styles.marginBottom15]}
                      icon = {<Icon
                        name="map-marker" 
                        type="font-awesome"
                        size={22}
                        color="white"
                        />}
                    /> 
                    <Text style={{alignItems:"center",paddingVertical:5,color:"#f00",fontSize:12}}>(Note: Please click above button if you are at home location.)</Text>
                  </View>*/ }
                  <EmployeeAddress navigation={navigation} userData={this.state.userData}/>

                </View>    
              </View>
              </KeyboardAwareScrollView>
              :
              <Loading />  
            }
            </ImageBackground>
        </React.Fragment>  
      );
  }

}