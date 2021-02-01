import React 					from 'react';
import {View, ImageBackground,Dimensions,Text,StyleSheet,TouchableOpacity,ScrollView} 	from 'react-native';
import {Button, Icon, Input}  	from 'react-native-elements';
import { colors, sizes }        from '../../config/styles.js';
import commonStyle              from '../../config/commonStyle.js';
import {HeaderBar}              from '../../layouts/Header/Header.js';
import {useNavigation}         	from '../../config/useNavigation.js';
import {connect, useSelector,useDispatch}   from 'react-redux';
import { getDropDownList } 		from '../../redux/list/actions';
import { getS3Details } 		from '../../redux/s3Details/actions';
import {getPersonDetails}             from '../../redux/personDetails/actions';
import { getClientTicketsList }       from '../../redux/ticketList/actions';

const window = Dimensions.get('window');

 const ClientDashboard = (props) => {
	const navigation = useNavigation();
  	const dispatch = useDispatch();

  const store = useSelector(store => ({
    userDetails     : store.userDetails,
    clientDetails   : store.clientDetails,
    dashboardCount  : store.techDashboardCount.data,
	clientDashboardCount  : store.clientDashboardCount.data,
	personDetails : store.personDetails.data,
  }));
  const clientDashboardCount = store.clientDashboardCount;
  console.log("store.userDetails",store.userDetails);
  	return (
  		<React.Fragment>
  			<HeaderBar navigation={navigation} showBackBtn={false} />
  			<ScrollView contentContainerStyle={[commonStyle.container,{justifyContent:'center'}]} >
  				<Text style={commonStyle.subHeaderText}>Welcome {store.personDetails && store.personDetails.firstName ? store.personDetails.firstName+ " " + store.personDetails.lastName : "User"}</Text>
	  			<View style={{flexDirection:"row"}}>
	  				<TouchableOpacity style={styles.dasboradBox} 
	  					onPress={()=>{
	  						dispatch(getDropDownList(store.clientDetails.data._id));
	  						dispatch(getS3Details())
	  						navigation.navigate('ServiceRequest')}} 
	  					>
	  					<Icon size={40} name='cog' type='font-awesome' color={colors.theme} iconStyle={{paddingVertical:15}}/>
	  					<Text style={commonStyle.label}>SERVICE</Text>
	  					<Text style={commonStyle.label}>REQUEST</Text>
	  				</TouchableOpacity>
	  				<TouchableOpacity style={styles.dasboradBox}
		  				onPress={() => {navigation.navigate('ListOfClientTickets',{title:"Pending Tickets"});dispatch(getClientTicketsList(store.clientDetails.data._id,"Pending"))}}
		  				>
	  					<Icon size={40} name='hourglass-start' type='font-awesome' color={colors.theme} iconStyle={{paddingVertical:15}}/>
	  					<Text style={commonStyle.label}>PENDING</Text>
	  					<Text style={commonStyle.label}>TICKETS <Text style={commonStyle.headerText}>({clientDashboardCount.pendingCount})</Text></Text>
	  				</TouchableOpacity>
	  				
	  			</View>
	  			<View style={{flexDirection:"row"}}>
	  				
	  				<TouchableOpacity style={styles.dasboradBox}
	  					 onPress={() => {navigation.navigate('ListOfClientTickets',{title:"Closed Tickets"});dispatch(getClientTicketsList(store.clientDetails.data._id,'Closed'))}}
	  				>
	  					<Icon size={40} name='ticket' type='font-awesome' color={colors.theme} iconStyle={{paddingVertical:15}}/>
	  					<Text style={commonStyle.label}>Closed</Text>
	  					<Text style={commonStyle.label}>TICKETS <Text style={commonStyle.headerText}>({clientDashboardCount.closedCount})</Text></Text>
	  				</TouchableOpacity>
					  <TouchableOpacity style={styles.dasboradBox}
	  					onPress={() => {
				        navigation.navigate('Profile'),
				        dispatch(getPersonDetails(props.userDetails.person_id))
				      }} 
	  				>
	  					<Icon size={40} name='user' type='font-awesome' color={colors.theme} iconStyle={{paddingVertical:15}}/>
	  					<Text style={commonStyle.label}>MY</Text>
	  					<Text style={commonStyle.label}>ACCOUNT</Text>
	  				</TouchableOpacity>
	  				
	  				{/* <TouchableOpacity style={styles.dasboradBox}
	  					onPress={()=>{
	  						navigation.navigate('Chat')}} 
	  					>
	  					<Icon size={40} name='face-agent' type='material-community' color={colors.theme} iconStyle={{paddingVertical:15}} />
	  					<Text style={commonStyle.label}>ONLINE</Text>
	  					<Text style={commonStyle.label}>SUPPORT</Text>
	  				</TouchableOpacity> */}
	  			</View>
  			</ScrollView>
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
		margin 			: 15
	},
});
const mapStateToProps = (store)=>{
  return {
    userDetails : store.userDetails,
  }
  
};
export default connect(mapStateToProps,{})(ClientDashboard);
