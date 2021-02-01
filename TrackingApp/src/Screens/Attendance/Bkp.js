import React , {useState,useEffect} from 'react';
import {View, ImageBackground,Dimensions,Text,StyleSheet,TouchableOpacity,ScrollView}  from 'react-native';
import {Button, Icon, Input}    from 'react-native-elements';
import { colors, sizes }        from '../../config/styles.js';
import commonStyle              from '../../config/commonStyle.js';
import {HeaderBar}              from '../../layouts/Header/Header.js';
import {useNavigation}          from '../../config/useNavigation.js';
import {connect, useSelector,useDispatch}   from 'react-redux';
import {CurrentTime}                 from './CurrentTime.js';
import { request,check,PERMISSIONS,RESULTS }                    from 'react-native-permissions';
import {SET_STARTING_COORDINATES} from '../../redux/attendance/types';
import Geolocation                                              from 'react-native-geolocation-service';
import MapView, 
        { PROVIDER_GOOGLE, 
          Polyline, 
          Marker, 
          AnimatedRegion, 
          Animated 
        } from 'react-native-maps';
import axios from 'axios';
import Loading                              from '../../layouts/Loading/Loading.js';
import Dialog                               from "react-native-dialog";
import moment from 'moment';
import {FromLocation}                         from './FromLocation.js';
import {FormButton}             from '../../components/FormButton/FormButton.js';
const haversine = require('haversine')
const window = Dimensions.get('window');
 const StartLocationDetails = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const store = useSelector(store => ({
      attendance      : store.attendance,
    }));
     console.log("store.attendance.attendance_id]",store.attendance.attendance_id)
    const [ coordinate, setCoordinate ] = useState(new AnimatedRegion({
          latitude: store.attendance.latitude,
          longitude: store.attendance.longitude,
          latitudeDelta: store.attendance.longitude*4,
          longitudeDelta: store.attendance.longitude*4
        })) 
    const [routeCoordinates, setRouteCoordinates] = useState([{
                                                      latitude          : store.attendance.latitude,
                                                      longitude         : store.attendance.longitude,
                                                      distanceTravelled : 0
                                                    }]);
    const [tempRouteCoordinates, setTempCoordinates] = useState([]);
    const [idVar, setIdVar] = useState(0);
    const [startDetails, setStartDetails] = useState('');
    const [modal, setModal] = useState(false);
    console.log("store.attendance.attendance_id",store.attendance.attendance_id);
    useEffect(() => {
   

       axios.get('/api/attendance/get/startDetails/'+store.attendance.attendance_id)
          .then((startDetails)=>{
            console.log("startDetails",startDetails);
            setStartDetails(startDetails.data)
          })
        .catch(error=>{
          console.log("error=>",error)
        })
        setIdVar(setInterval(function(){
          watchPosition();
        }, 3000));
    }, [])
  

    const watchPosition = (props) => {
      Geolocation.getCurrentPosition(position => {
        console.log("position",position);
        const prevLatLng = routeCoordinates[routeCoordinates.length-1]; 
        const newCoordinate = {
          latitude          : position.coords.latitude,
          longitude         : position.coords.longitude,
          distanceTravelled : calcDistance(prevLatLng, position.coords),
        };
        console.log("prevLatLng",prevLatLng)
        console.log("newCoordinate",newCoordinate)

        if(prevLatLng.longitude !== newCoordinate.longitude &&  prevLatLng.latitude !== newCoordinate.latitude){
          var tempCoordinate = tempRouteCoordinates.concat(newCoordinate);
          console.log("tempCoordinate",tempCoordinate);
          if(tempCoordinate.length >= 5){
             setRouteCoordinates(routeCoordinates.concat(tempCoordinate))
             var locValues = {
              tracking_id       : store.attendance.tracking_id,
              routeCoordinates  : tempCoordinate,
            }
            axios
              .patch("/api/tracking/patch/routeCoordinates",locValues)
              .then((locResponse)=>{
                if(locResponse){
                  setTempCoordinates([]);
                }
              })
              .catch((error)=>{
                console.log("error = ",error.message);
              });
          }else{
            setTempCoordinates(tempRouteCoordinates)
           }
        }else{
          console.log("same coordinate");
        }
      },
      (error) => {console.log(error.code, error.message)},
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    const calcDistance = (prevLatLng, newLatLng) =>{
      var distTravelled = haversine(prevLatLng, newLatLng);
      return distTravelled;
    }

   const endTracking = () =>{
    console.log("click");
    clearInterval(idVar);
    setIdVar(0);
     const endTrackingValues={
        endDateAndTime : new Date(),
        tracking_id    : store.attendance.attendance_id,
      }
       axios
        .patch("/api/attendance/patch/endDetails",endTrackingValues)
        .then((locResponse)=>{
          if(locResponse){
              navigation.navigate('LocationDetails')
          }
        })
        .catch((error)=>{
          console.log("error = ",error.message);
        });
    };
    console.log("startDetails",startDetails);
    return (
      <React.Fragment>
        <HeaderBar navigation={navigation} showBackBtn={false} title="Start Details"/>
          {startDetails.startLocation? 
            <ScrollView contentContainerStyle={[commonStyle.container,{alignItems:'center'}]}>
              <CurrentTime />
              <View style={{height:60,width:"100%",paddingHorizontal:50}}>
                <View style={{flexDirection:"row"}}>
                  <View style={{flex:0.85}}>
                      <View style={{flexDirection:"row"}}>
                        <Icon size={25} name='map-marker' type='font-awesome' color='#376bff' />
                        <Text style={{fontSize:20,color:"#376bff",paddingHorizontal:5}}>Started At</Text>
                      </View>  
                    <Text style={{fontSize:18}}>{moment(startDetails.startDateAndTime).format('LTS')+" From Location"}</Text>
                  </View> 
                </View>
              </View> 
              <View style={{marginBottom:50}}>
                <FromLocation coordinates={startDetails.startLocation} />
              </View>
              <Button
                title       = {"End"}
                onPress     = {() =>endTracking()}
                buttonStyle ={styles.startButton}
                titleStyle  ={{fontSize:25}}
                icon={{
                  name: "stop-circle",
                  size: 40,
                  color: colors.white,
                  type: "font-awesome"
                }}
                iconContainerStyle={{marginLeft:30}}
                iconRight
              />
            </ScrollView> 
            :
            <Loading />
          } 
        </React.Fragment>  
    );
};

const styles = StyleSheet.create({
  amenitiesWrapper : {
    // backgroundColor: "#ff0",
  },
  container:{
    backgroundColor: '#fff',
    minHeight:'100%',
    width: window.width,
  },
  startButton:{
    height:70,
    width:200,
    backgroundColor:"#283593",
    alignItems:"center",
    justifyContent:"center",
    borderRadius:100,
    flexDirection:"row"
  },
  textHeader:{
    fontSize:30,
    color:"#376bff",
    fontFamily: 'Roboto-Regular',
  },

});
const mapStateToProps = (store)=>{
  return {
    userDetails : store.userDetails,
  }
  
};
export default connect(mapStateToProps,{})(StartLocationDetails);
