import React, {useEffect}					from 'react';
import {View, ImageBackground,Dimensions,Text,StyleSheet,TouchableOpacity,ScrollView,BackHandler,Alert} 	from 'react-native';
import {Button, Icon, Input}  	from 'react-native-elements';
import { colors, sizes }        from '../../config/styles.js';
import commonStyle              from '../../config/commonStyle.js';
import {HeaderBar}              from '../../layouts/Header/Header.js';
import {useNavigation}         	from '../../config/useNavigation.js';
import {connect, useDispatch, useSelector}   from 'react-redux';
import { getTechnicianTicketsList }       from '../../redux/ticketList/actions';
import Loading                  from '../../layouts/Loading/Loading.js';
import { getS3Details } 		from '../../redux/s3Details/actions';
import {SET_STARTING_COORDINATES} from '../../redux/attendance/types';
import axios 					from 'axios';
const window = Dimensions.get('window');

export const TechnicianDashboard = (props) => {
	const dispatch 		= useDispatch();
	const navigation = useNavigation();
	const store = useSelector(store => ({
	    userDetails     : store.userDetails,
	    clientDetails   : store.clientDetails,
		dashboardCount  : store.techDashboardCount.data,
		personDetails : store.personDetails.data,
  	}));
	const {dashboardCount,userDetails,personDetails} = store;

	const myAttendance = (props) =>{
	axios
      .get('/api/attendance/get/get_tracking_status/'+store.userDetails.user_id)
      .then((attendance)=>{
        if(attendance.data && !attendance.data.endDateAndTime){
           dispatch({
              type:SET_STARTING_COORDINATES,
              payload:{
                attendance_id:attendance.data._id,
                longitude:attendance.data.startLocation.longitude,
				latitude:attendance.data.startLocation.latitude,
				
              }
            })
          	navigation.navigate('StartLocationDetails')
        }else{
          	navigation.navigate('Attendance')
        }
      })
      .catch(error=>{
        console.log("error=>",error)
      })
	} 

	//  useEffect(() => {
	//     const backAction = () => {
	//        Alert.alert(
	// 	        'Confirmation',
	// 	        'Do you want to exit the application?',
	// 	        [
	// 	          {
	// 	            text: 'Cancel',
	// 	            onPress: () => console.log('Cancel Pressed'),
	// 	            style: 'cancel'
	// 	          },
	// 	          {
	// 	            text: 'confirm',
	// 	            onPress: () => BackHandler.exitApp()
	// 	          }
	// 	        ],
	// 	        {
	// 	          cancelable: false
	// 	        }
	// 	      );
	// 	      return true;
	//     };

	//     const backHandler = BackHandler.addEventListener(
	//       "hardwareBackPress",
	//       backAction
	//     );

	//     return () => backHandler.remove();
	//   }, []);
	 
  	return (
  		<React.Fragment>
				<HeaderBar navigation={navigation} showBackBtn={false} />
				 {props.loading ? (
		        <Loading />
		      	) : (
		      		<ScrollView contentContainerStyle={[commonStyle.container,{justifyContent:'center'}]} >
	  				<Text style={commonStyle.subHeaderText}>Welcome {personDetails.firstName ? personDetails.firstName+" "+personDetails.lastName : "User"}</Text>
			  			<View style={{flexDirection:"row"}}>
			  				<TouchableOpacity style={styles.dasboradBox} 
			  					onPress={()=>{
			  						navigation.navigate('ListOfTechnicianTickets',{status:"New"}),
			  						dispatch(getTechnicianTicketsList(userDetails.person_id,'Allocated'))
			  					}}
			  				>
			  					<Text style={commonStyle.label}>NEW</Text>
			  					<Text style={commonStyle.label}>TICKETS</Text>
			  					<Text style={commonStyle.headerText}>{dashboardCount.newCount}</Text>
			  				</TouchableOpacity>

			  				<TouchableOpacity style={styles.dasboradBox}
			  					onPress={()=>{
			  						navigation.navigate('ListOfTechnicianTickets',{status:"WIP"}),
			  						dispatch(getTechnicianTicketsList(userDetails.person_id,'Work In Progress'))
			  					}}
			  				>
			  					<Text style={commonStyle.label}>WORK IN</Text>
			  					<Text style={commonStyle.label}>PROGRESS</Text>
			  					<Text style={commonStyle.headerText}>{dashboardCount.wipCount}</Text>
			  				</TouchableOpacity>
			  			</View>
			  			<View style={{flexDirection:"row"}}>
			  				<TouchableOpacity style={styles.dasboradBox}
			  					onPress={()=>{
			  						navigation.navigate('ListOfTechnicianTickets',{status:"Completed"}),
			  						dispatch(getTechnicianTicketsList(userDetails.person_id,'Resolved'))
			  					}}
			  				>
			  					<Text style={commonStyle.label}>COMPLETED</Text>
			  					<Text style={commonStyle.label}>TICKETS</Text>
			  					<Text style={commonStyle.headerText}>{dashboardCount.completedCount}</Text>
			  				</TouchableOpacity>
			  				<TouchableOpacity style={styles.dasboradBox}
			  					onPress={()=>{
			  						navigation.navigate('ListOfTechnicianTickets',{status:"Rejected"}),
			  						dispatch(getTechnicianTicketsList(userDetails.person_id,'Assignee Rejected'))
			  					}}
			  				>
			  					<Text style={commonStyle.label}>REJECTED</Text>
			  					<Text style={commonStyle.label}>TICKETS</Text>
			  					<Text style={commonStyle.headerText}>{dashboardCount.rejectedCount}</Text>
			  				</TouchableOpacity>
			  			</View>
			  			<View style={{flexDirection:"row"}}>
			  				<TouchableOpacity style={styles.dasboradBox}
			  					onPress={()=>{
			  						navigation.navigate('ListOfTechnicianTickets',{status:"Total"}),
			  						dispatch(getTechnicianTicketsList(userDetails.person_id,'All'))
			  					}}
			  				>
			  					<Text style={commonStyle.label}>TOTAL TICKETS</Text>
			  					<Text style={commonStyle.label}>ALLOCATED</Text>
			  					<Text style={commonStyle.headerText}>{dashboardCount.totalCount}</Text>
			  				</TouchableOpacity>
			  				<TouchableOpacity style={styles.dasboradBox}
			  					onPress={()=>{
			  						dispatch(getS3Details());
			  						myAttendance();
			  					}}
			  				>
			  					<Text style={commonStyle.label}>My</Text>
			  					<Text style={commonStyle.label}>ATTENDANCE</Text>
			  				</TouchableOpacity>
			  			</View>
		  			</ScrollView>
	  		)}	
  		</React.Fragment>
  	);
};

const styles = StyleSheet.create({
  dasboradBox:{
  		borderWidth     : 1,
        borderColor 	: "#ccc",
        borderRadius 	: 10,
		justifyContent  : "center",
		alignItems 		: "center",
		height 			: 150,
		flex 			: 0.5,
		margin 			: 15,
		backgroundColor : "#fff",
		shadowColor 	: '#000',
	    shadowOffset 	: { width: 0, height: 2 },
	    shadowOpacity 	: 0.8,
	    shadowRadius 	: 2,
	    elevation 		: 1,
	},	
});

