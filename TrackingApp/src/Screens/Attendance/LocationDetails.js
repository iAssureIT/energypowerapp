import React , {useState,useEffect}        from 'react';
import {View, ImageBackground,Dimensions,Text,StyleSheet,TouchableOpacity,Modal,Image,ActivityIndicator}  from 'react-native';
import {Button, Icon, Input}    from 'react-native-elements';
import { colors, sizes }        from '../../config/styles.js';
import commonStyle              from '../../config/commonStyle.js';
import {HeaderBar}              from '../../layouts/Header/Header.js';
import {useNavigation}          from '../../config/useNavigation.js';
import {connect, useSelector,useDispatch}   from 'react-redux';
import {CurrentTime}                 from './CurrentTime.js';
import {FormButton}             from '../../components/FormButton/FormButton.js';
import { request,check,PERMISSIONS,RESULTS }                    from 'react-native-permissions';
import {SET_STARTING_COORDINATES} from '../../redux/attendance/types';
import Geolocation                                              from 'react-native-geolocation-service';
import axios from 'axios';
import {FromLocation}                         from './FromLocation.js';
import {LocationRoute}                         from './LocationRoute.js';
import ImageView                    from 'react-native-image-view';
import moment from 'moment';
const window = Dimensions.get('window');

 const LocationDetails = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showMap, setShowMap] = useState(false)
  const store = useSelector(store => ({
    userDetails     : store.userDetails,
    clientDetails   : store.clientDetails,
    dashboardCount  : store.techDashboardCount.data,
    attendance      : store.attendance,
  }));
  console.log("store",store)
  const [startDetails, setStartDetails] = useState('');
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageView, setImageView]         = useState();
  const [imageVisible, setImageVisible]   = useState(false);
  const attendance_id = navigation.getParam('attendance_id')
  useEffect(() => {
    axios
      .get('/api/attendance/get/startDetails/'+attendance_id)
      .then((startDetails)=>{
       setStartDetails(startDetails.data); 
       setLoading(false);
      })
      .catch(error=>{
        console.log("error=>",error)
      })
  }, [store.attendance.attendance_id])

   const msToTime = (duration)=>{
      var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;

      return hours + ":" + minutes;
    }

    console.log("startDetails",startDetails);

    return (
       <React.Fragment>
          <HeaderBar navigation={navigation} showBackBtn={true} title="Location Details"/>
          {loading ? (
             <ActivityIndicator />
          ):(
          <View style={[commonStyle.container]}>
            {
              startDetails!=="" && startDetails.startLocation  ?
              <View style={commonStyle.modalView}>
                <View style={{marginHorizontal:20,paddingVertical:10,borderBottomWidth:0.5}}>
                  <Text style={[commonStyle.subHeaderText,{alignSelf:'flex-start'}]}>Start Details</Text>
                   <View style={{flexDirection:"row",marginLeft:15}}>
                      <Text style={[commonStyle.label,{flex:0.5}]}>Started At </Text>
                      <Text style={[commonStyle.normalText,{flex:0.5}]}>: {startDetails.startDateAndTime ? moment(startDetails.startDateAndTime).format('LT') :"--"}</Text>
                   </View>
                   <View style={{flexDirection:"row",marginLeft:15}}>
                      <Text style={[commonStyle.label,{flex:0.5}]}>Odometer Reading </Text>
                      <Text style={[commonStyle.normalText,{flex:0.5}]}>: {startDetails.startOdometer.Reading + "Km"}</Text>
                   </View>  
                   <View style={{flexDirection:"row",alignItems:'center',marginLeft:15}}>
                      <Text style={[commonStyle.label,{flex:0.5}]}>Odometer Proof </Text>
                      <View style={{flex:0.5}}>
                      <TouchableOpacity style={styles.imageView} 
                        onPress={() => {
                                setImageView([
                                  {
                                    source: {
                                      uri: startDetails.startOdometer.Proof,
                                    },
                                    title: 'Photos',
                                    width: window.width-20,
                                    height: window.height-20,
                                  },
                                ]);
                                setImageVisible(true);
                              }}>
                          <Image
                            style={{width:50,height:50}}
                            source={{uri:startDetails.startOdometer.Proof}}
                            resizeMode={'cover'}
                          />
                       </TouchableOpacity> 
                      </View>  
                   </View> 
                </View>
                <View style={{marginHorizontal:20,paddingVertical:10,borderBottomWidth:0.5}}>
                  <Text style={[commonStyle.subHeaderText,{alignSelf:'flex-start'}]}>End Details</Text>
                   <View style={{flexDirection:"row",marginLeft:15}}>
                      <Text style={[commonStyle.label,{flex:0.5}]}>Ended At </Text>
                      <Text style={[commonStyle.normalText,{flex:0.5}]}>: {startDetails.startDateAndTime ? moment(startDetails.endDateAndTime).format('LT') :"--"}</Text>
                   </View> 
                   <View style={{flexDirection:"row",marginLeft:15}}>
                      <Text style={[commonStyle.label,{flex:0.5}]}>Odometer Reading </Text>
                      <Text style={[commonStyle.normalText,{flex:0.5}]}>: {startDetails.endOdometer.Reading + " Km"}</Text>
                   </View> 
                    <View style={{flexDirection:"row",alignItems:'center',marginLeft:15}}>
                      <Text style={[commonStyle.label,{flex:0.5}]}>Odometer Proof </Text>
                      <View style={{flex:0.5}}>
                      <TouchableOpacity style={styles.imageView} 
                        onPress={() => {
                          setImageView([
                            {
                              source: {
                                uri: startDetails.endOdometer.Proof,
                              },
                              title: 'Photos',
                              width: window.width-20,
                              height: window.height-20,
                            },
                          ]);
                          setImageVisible(true);
                        }}>
                        <Image
                          style={{width:50,height:50}}
                          source={{uri:startDetails.endOdometer.Proof}}
                          resizeMode={'cover'}
                        />
                       </TouchableOpacity>  
                      </View>  
                   </View> 
                </View>
                 <View style={{marginHorizontal:20,paddingVertical:10,borderBottomWidth:0.5}}>
                  <Text style={[commonStyle.subHeaderText,{alignSelf:'flex-start'}]}>Total</Text>
                   <View style={{flexDirection:"row",marginLeft:15}}>
                      <Text style={[commonStyle.label,{flex:0.5}]}>Time </Text>
                      <Text style={[commonStyle.normalText,{flex:0.5}]}>: {startDetails.totalTime ? msToTime(startDetails.totalTime) : "--"}</Text>
                   </View> 
                   <View style={{flexDirection:"row",marginLeft:15}}>
                      <Text style={[commonStyle.label,{flex:0.5}]}>Distance </Text>
                      <Text style={[commonStyle.normalText,{flex:0.5}]}>: {startDetails.totalDistanceTravelled ? startDetails.totalDistanceTravelled.toFixed(6)+" Km" : "0 Km"}</Text>
                   </View> 
                </View>
                <View style={{alignItems:"center",}}>
                  <Button
                    title='Click here to view map'
                    buttonStyle={{backgroundColor:colors.theme,marginVertical:35,height:50,}}
                    titleStyle  ={{fontSize:15,paddingVertical:10}}
                    icon={{
                      name: "location",
                      size: 20,
                      color: colors.white,
                      type: "entypo"
                    }}
                    iconLeft
                    onPress={()=>setShowMap(true)}
                  />
                  <Button
                    title       = {"Next"}
                    onPress     = {()=>{navigation.navigate('AttendanceHistory')}}
                    buttonStyle ={styles.startButton}
                    titleStyle  ={{fontSize:25}}
                    icon={{
                      name: "chevrons-right",
                      size: 40,
                      color: colors.white,
                      type: "feather"
                    }}
                    iconContainerStyle={{marginLeft:30}}
                    iconRight
                  />
                </View>  
              </View>
              :
              <Text style={{fontSize:20,justifyContent:"center",alignSelf:"center"}}>No data found</Text>  
         }
        </View>
        )}
        <Modal
        visible={showMap}
        animationType={'slide'}
        onDismiss={() => setShowMap(false)}
        onRequestClose={() => setShowMap(false)}>
        <View Style={commonStyle.container}>
                <LocationRoute trackingDetails={startDetails} />
          </View>
      </Modal>
      {imageVisible ? (
          <ImageView
            images={imageView}
            imageIndex={0}
            isVisible={imageVisible}
            onClose={() => setImageVisible(false)}
          />
        ) : null} 
        </React.Fragment>  
    );
};

const styles = StyleSheet.create({
 container:{
    backgroundColor: '#fff',
    minHeight:'100%',
    width: window.width,
  },
  startButton:{
    height:70,
    width:200,
    backgroundColor:colors.theme,
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
export default connect(mapStateToProps,{})(LocationDetails);
