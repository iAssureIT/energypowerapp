import React , {useState,useEffect}        from 'react';
import {View, ImageBackground,Dimensions,Text,StyleSheet,TouchableOpacity,FlatList,RefreshControl,ActivityIndicator,Modal, Alert}  from 'react-native';
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
import localization from 'moment/locale/de'
import moment from 'moment';
import {withCustomerToaster}                from '../../redux/AppState.js';
const window = Dimensions.get('window');

 const AttendanceHistory = withCustomerToaster((props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const store = useSelector(store => ({
    userDetails     : store.userDetails,
    clientDetails   : store.clientDetails,
    dashboardCount  : store.techDashboardCount.data,
    attendance      : store.attendance,
  }));

  const monthNames  = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const d           = new Date();
  console.log("localization",localization);
  const [date, setDate] = useState(new Date());
  const [monthNumber, setMonthNumber] = useState(d.getMonth());
  const [month, setMonth] = useState(monthNames[monthNumber]);
  const [year, setYear] = useState(d.getFullYear());
  const [monthNow, setMonthNow] = useState(month);
  const [yearNow, setYearNow] = useState(year);
  const [monthYear, setMonthYear] = useState(month+" "+year);
  const [myHistory, setHistory] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading,setLoading] =useState(false);
  const [showMap, setShowMap] = useState(false)
  const [startDetails, setStartDetails] = useState('');

  useEffect(() => {
   getUserDataMonthWise(year+"-"+("0" + (monthNumber+1)).slice(-2));
  }, [store.attendance.attendance_id])


  const priviousDate = (prev)=>{
    if(monthNumber > 0){
        setMonth(monthNames[monthNumber-1]);
        setMonthNumber(monthNumber-1);
        setMonthYear(monthNames[monthNumber-1]+" "+year);
        getUserDataMonthWise(year+"-"+("0" + (monthNumber)).slice(-2));
    }else{
        setMonth(monthNames[monthNumber+11]);
        setYear(year-1);
        setMonthYear(monthNames[monthNumber+11]+" "+(year-1));
        setMonthNumber(monthNumber+11);
        getUserDataMonthWise((year-1)+"-"+("0" + (monthNumber+11)).slice(-2));
    }
  };

  const nextDate = (next)=>{
    if(monthNumber < 11){
      if(monthNames[monthNumber] !== monthNow || yearNow !== year ){
          setMonth(monthNames[monthNumber+1]);
          setMonthNumber(monthNumber+1);
          setMonthYear(monthNames[monthNumber+1]+" "+year);
          getUserDataMonthWise(year+"-"+("0" + (monthNumber+2)).slice(-2));
      }
      
    }else{
        setMonth(monthNames[monthNumber-11]);
        setYear(year+1);
        setMonthYear(monthNames[monthNumber-11]+" "+(year+1));
        setMonthNumber(monthNumber-11);
        getUserDataMonthWise((year+1)+"-"+("0" + (monthNumber-11)).slice(-2));
    }
  };

  const getUserDataMonthWise = (monthYearData)=>{
    setLoading(true);
    axios
    .get('/api/reports/get/daywiseUserdetails/'+monthYearData+'/'+store.userDetails.person_id)
    .then((myHistory)=>{
      console.log("myHistory",myHistory);
        setHistory(myHistory.data);
        setRefresh(false);
        setLoading(false);
    })
    .catch(error=>{
      setRefresh(false);
      setLoading(false);
      console.log("error=>",error)
    })
  }


   const msToTime = (duration)=>{
      var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;
      return hours + ":" + minutes + ":" + seconds;
    }


  const renderItem = ({item,index}) => (
      <TouchableOpacity style={styles.historyBox} key={index} 
        onPress={()=>{
          item.startDateAndTime ?
            item.tracking_status === false ?
              navigation.navigate('LocationDetails',{attendance_id:item.tracking_id})
            : 
            (navigation.navigate('StartLocationDetails'),
            dispatch({type:SET_STARTING_COORDINATES,payload:{attendance_id:item.tracking_id,longitude:item.longitude,latitude:item.latitude}}))
          :
          props.setToast({text: 'No Data Found', color: colors.warning});
        }}>
       <View style={item.present?[styles.historyBoxLeft,{backgroundColor:"#7DC78A"}]:[styles.historyBoxLeft,{backgroundColor:"#e25e77"}]}>
          <Text style={styles.dateText}>{moment(item.createdAt).format('DD')}</Text>
          <Text style={styles.dateText}>{moment(item.createdAt).locale("en", localization).format('MMMM')}</Text>
          <Text style={styles.dateText}>{moment(item.createdAt).format('YYYY')}</Text>
        </View>
        <View style={styles.historyBoxRight}>
           <View style={styles.historyDetail}>
              <Text style={styles.historyText}>Start Time : </Text>
              <Text style={styles.historyText}>{item.startDateAndTime ?  moment(item.startDateAndTime).format('LT') : "NA"}</Text>
            </View>
            <View style={styles.historyDetail}>
              <Text style={styles.historyText}>End Time : </Text>
              <Text style={styles.historyText}>{item.endDateAndTime ?  moment(item.endDateAndTime).format('LT') : "NA"}</Text>
            </View> 
            <View style={styles.historyDetail}>
              <Text style={styles.historyText}>Total Distance : </Text>
              {item.totalDistanceTravelled ?
                <Text style={styles.historyText}>{item.totalReimbursementDistance.toFixed(6)+" Km"}</Text>
                :
                <Text style={styles.historyText}>0 Km</Text>
              }  
            </View> 
        </View>
     </TouchableOpacity>
  );

    return (
       <React.Fragment>
          <HeaderBar navigation={navigation} showBackBtn={false} title="My Attendance"/>
          <View style={commonStyle.container}>
           <View style={{flexDirection:"row",justifyContent:"center",marginTop:20}}>
                <TouchableOpacity style={{alignItems:"center",justifyContent:"flex-start",flex:0.3}} onPress={priviousDate}>
                  <Icon size={40} name='chevrons-left' type='feather' color='#333' />
                </TouchableOpacity>
                <View style={{alignItems:"center",justifyContent:"center",flex:0.4}}>
                  <Text style={{fontSize:20}}>
                    {monthYear}
                  </Text>               
               </View>
                {month !== monthNow ?
                <TouchableOpacity style={{alignItems:"center",justifyContent:"flex-end",flex:0.3}} onPress={nextDate}>
                  <Icon size={40} name='chevrons-right' type='feather' color='#333' />
                </TouchableOpacity>
                :
                  <View style={{alignItems:"center",justifyContent:"flex-end",flex:0.3}} onPress={nextDate}>
                  <Icon size={40} name='chevrons-right' type='feather' color='#d1d1d1' />
                </View>
                }
                
              </View>
              <View style={{padding:15}}>
                  <View style={{marginVertical:5,flexDirection:'row'}}>
                      <Text style={[commonStyle.label,{flex:0.5}]}>Total Distance Travelled</Text>
                      <Text style={[commonStyle.normalText,{flex:0.5}]}>: {myHistory.totalDistanceTravelled ? myHistory.totalDistanceTravelled.toFixed(5)+"0 Km." : "0 Km."}</Text>
                  </View>
                  <View style={{marginVertical:5,flexDirection:'row'}}>
                      <Text style={[commonStyle.label,{flex:0.5}]}>Total Reimbursement</Text>
                      <Text style={[commonStyle.normalText,{flex:0.5}]}>: {myHistory.totalReimbursement ? myHistory.totalReimbursement.toFixed(5)+"0 Rs." : "0 Rs."}</Text>
                  </View>  
              </View>
              <View>  
                {loading ? (
                   <ActivityIndicator />
                  ):(
                  myHistory.staffAttendance && myHistory.staffAttendance.length > 0 ?
                  <View style={styles.myHistory} >
                    <FlatList
                      data={myHistory.staffAttendance}
                      renderItem={renderItem}
                      showsVerticalScrollIndicator={false}
                      refreshControl={
                        <RefreshControl
                          refreshing={refresh}
                          onRefresh={() => {setRefresh(true),getUserDataMonthWise(year+"-"+("0" + (monthNumber+1)).slice(-2))}}
                        />
                      }
                    />
                  </View> 
                  :
                  <View style={styles.myHistory}>
                    <Text style={{fontSize:20,alignSelf:"center",justifyContent:"center"}}>No data found</Text>  
                  </View>
                )}
            </View>
          </View>
          <Modal
            visible={showMap}
            animationType={'slide'}
            onDismiss={() => setShowMap(false)}
            onRequestClose={() => setShowMap(false)}>
            <View Style={commonStyle.container}>
                <LocationRoute trackingDetails={startDetails} />
              </View>
          </Modal>
        </React.Fragment>  
    );
});

const styles = StyleSheet.create({
 container:{
    backgroundColor: '#fff',
    minHeight:'100%',
    width: window.width,
  },
  startButton:{
    height:70,
    width:200,
    backgroundColor:"#283593",
    borderRadius:100,
    flexDirection:"row"
  },
  textHeader:{
    fontSize:30,
    color:"#376bff",
    fontFamily: 'Roboto-Regular',
  },
  myHistory:{
    marginVertical:10,
    padding:15,
  },
  historyBox:{
    borderWidth:1,
    flexDirection:"row",
    marginBottom:30,
    borderRadius:5
  },
  historyBoxLeft:{
    height:78,
    borderRightWidth:1,
    flex:0.3,
    justifyContent:"center"
  },
  historyBoxRight:{
    height:78,
    flex:0.7,
  },
  historyNavigate:{
    height:78,
    flex:0.1,
    justifyContent:"flex-end"
  },
  dateText:{
    fontSize:14,
    color: '#fff',
    fontFamily:'Montserrat-SemiBold',
    alignSelf:"center"
  },
  historyDetail:{
    flexDirection:'row',
    padding:3
  },
  historyText:{
    fontSize:14,
  }
});
const mapStateToProps = (store)=>{
  return {
    userDetails : store.userDetails,
  }
  
};
export default connect(mapStateToProps,{})(AttendanceHistory);
