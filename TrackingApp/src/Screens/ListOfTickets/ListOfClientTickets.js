import React, {useState} from 'react';
import {View, ImageBackground,Dimensions,Text,StyleSheet,TouchableOpacity,ScrollView} 	from 'react-native';
import {Button, Icon, Card}  	from 'react-native-elements';
import { colors, sizes }        from '../../config/styles.js';
import commonStyle              from '../../config/commonStyle.js';
import {HeaderBar}              from '../../layouts/Header/Header.js';
import {useNavigation}         	from '../../config/useNavigation.js';
import * as Yup                 from 'yup';
import {connect, useDispatch}   from 'react-redux';
import { Menu, MenuOptions,
         MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Loading                  from '../../layouts/Loading/Loading.js';
import { getS3Details } 		from '../../redux/s3Details/actions';
import { robotoWeights } 		from 'react-native-typography';
import ActionButton            	from 'react-native-action-button';
import { getDropDownList } 		from '../../redux/list/actions';

const window = Dimensions.get('window');


const ListOfClientTickets = (props) =>  {
	const dispatch 		= useDispatch();
  	const navigation 	= useNavigation();
  	const title         = navigation.getParam("title","No Title")
    const status        = navigation.getParam('status','No status')   ;
  return (
     <React.Fragment>
		<HeaderBar navigation={navigation} showBackBtn={true} title={title} />
		 {props.loading ? (
	        <Loading />
	      ) : (
            props.ticketList && props.ticketList.length > 0 ?
            <ScrollView style={{marginBottom:20}}>
			{props.ticketList.map((item,index)=>{
				return(
						<Card containerStyle={styles.sliderView} key={index} >
							<View style={{flexDirection:"row"}}>
								<View style={{flex:0.95,padding:15}}>
									<View style={{flexDirection:"row",marginVertical:2,flex:1}}>
										<Icon name="file-document-outline" size={20} color="black" type="material-community" iconStyle={{marginHorizontal:5}}/>
										<Text style={[commonStyle.label,{flex:1}]}>{item.ticketId+" - "+item.typeOfIssue}</Text>
									</View>
									<View style={{flexDirection:"row",marginVertical:2}}>
										<Icon name="user" size={20} color="black" type="entypo" iconStyle={{marginHorizontal:5}}/>
										<Text style={commonStyle.normalText}>{item.clientName}</Text>
									</View>	
									<View style={{flexDirection:"row",marginVertical:2}}>
										<Icon name="location" size={20} color="black" type="entypo" iconStyle={{marginHorizontal:5}}/>
										<Text style={commonStyle.normalText}>{item.projectLocationName}</Text>
									</View>	
									{item.equipmentLocationName ? <View style={{flexDirection:"row",marginVertical:2}}>
										<Icon name='location' type='entypo' size={20} color="black" iconStyle={{marginHorizontal:5}}/>
										<Text style={commonStyle.normalText}>{item.equipmentLocationName}</Text>
                                    </View>:null}	
                                    <View style={{flexDirection:"row",marginVertical:2,justifyContent:"flex-end"}}>
                                    {
                                        item.statusValue === "New" || item.statusValue === "Reopen" ?    
                                            <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.primary}]}>{item.statusValue}</Text>
                                        :
                                        item.statusValue === "Acknowledged" ?    
                                            <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.info}]}>{item.statusValue}</Text>
                                        :
                                         item.statusValue === "Paid Service Request"?
                                            <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.orange}]}>{item.statusValue}</Text>
                                        :
                                        item.statusValue === "Allocated" ?
                                            <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.lightGreen}]}>{item.statusValue}</Text>
                                        :
                                        item.statusValue === "Work Started" || item.statusValue=== "Work In Progress"?  
                                            <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.warning}]}>{item.statusValue}</Text>
                                        :
                                        item.statusValue === "Paid Service Approved"?    
                                            <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.purple}]}>{item.statusValue}</Text>
                                        :
                                        item.statusValue=== "Assignee Accepted"?    
                                            <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.fuchsia}]}>{item.statusValue}</Text>
                                        :
                                        item.statusValue === "Resolved" ?   
                                            <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.success}]}>{item.statusValue}</Text>
                                        :
                                        item.statusValue === "Assignee Rejected" || item.statusValue === "Paid Service Rejected" ?  
                                            <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.danger}]}>{item.statusValue}</Text>
                                          :
                                        item.statusValue === "Closed" ? 
                                            <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.teal}]}>{item.statusValue}</Text>
                                        :
                                            <Text style={[commonStyle.normalText,{backgroundColor:colors.grey}]}>{item.statusValue}</Text>
                                    }                   
                                    </View>	
								</View>				
								{
                                    item.statusValue === "New" || item.statusValue === "Reopen"  ?  
                                    <TouchableOpacity style={[styles.viewBookingTickets,{backgroundColor:colors.primary}]} onPress={()=>{navigation.navigate('ClientTicketDetails',{ticketDetails:item,status:status}),dispatch(getS3Details())}}>
                                        <Icon name='chevrons-right' size={20} color={colors.white} type='feather'/>
                                    </TouchableOpacity>
                                    :
                                    item.statusValue === "Acknowledged" ?    
                                    <TouchableOpacity style={[styles.viewBookingTickets,{backgroundColor:colors.info}]} onPress={()=>{navigation.navigate('ClientTicketDetails',{ticketDetails:item,status:status}),dispatch(getS3Details())}}>
                                        <Icon name='chevrons-right' size={20} color={colors.white} type='feather'/>
                                    </TouchableOpacity>
                                    :
                                    item.statusValue === "Paid Service Request"?
                                    <TouchableOpacity style={[styles.viewBookingTickets,{backgroundColor:colors.orange}]} onPress={()=>{navigation.navigate('ClientTicketDetails',{ticketDetails:item,status:status}),dispatch(getS3Details())}}>
                                        <Icon name='chevrons-right' size={20} color={colors.white} type='feather'/>
                                    </TouchableOpacity>
                                    :
                                    item.statusValue === "Allocated" ?
                                    <TouchableOpacity style={[styles.viewBookingTickets,{backgroundColor:colors.lightGreen}]} onPress={()=>{navigation.navigate('ClientTicketDetails',{ticketDetails:item,status:status}),dispatch(getS3Details())}}>
                                        <Icon name='chevrons-right' size={20} color={colors.white} type='feather'/>
                                    </TouchableOpacity>
                                    :
                                    item.statusValue === "Work Started" || item.statusValue=== "Work In Progress"?  
                                    <TouchableOpacity style={[styles.viewBookingTickets,{backgroundColor:colors.warning}]} onPress={()=>{navigation.navigate('ClientTicketDetails',{ticketDetails:item,status:status}),dispatch(getS3Details())}}>
                                        <Icon name='chevrons-right' size={20} color={colors.white} type='feather'/>
                                    </TouchableOpacity>
                                    :
                                    item.statusValue === "Paid Service Approved"?   
                                    <TouchableOpacity style={[styles.viewBookingTickets,{backgroundColor:colors.purple}]} onPress={()=>{navigation.navigate('ClientTicketDetails',{ticketDetails:item,status:status}),dispatch(getS3Details())}}>
                                        <Icon name='chevrons-right' size={20} color={colors.white} type='feather'/>
                                    </TouchableOpacity>
                                    :
                                    item.statusValue=== "Assignee Accepted"?    
                                    <TouchableOpacity style={[styles.viewBookingTickets,{backgroundColor:colors.fuchsia}]} onPress={()=>{navigation.navigate('ClientTicketDetails',{ticketDetails:item,status:status}),dispatch(getS3Details())}}>
                                        <Icon name='chevrons-right' size={20} color={colors.white} type='feather'/>
                                    </TouchableOpacity>
                                    :
                                    item.statusValue === "Resolved" ?   
                                    <TouchableOpacity style={[styles.viewBookingTickets,{backgroundColor:colors.success}]} onPress={()=>{navigation.navigate('ClientTicketDetails',{ticketDetails:item,status:status}),dispatch(getS3Details())}}>
                                        <Icon name='chevrons-right' size={20} color={colors.white} type='feather'/>
                                    </TouchableOpacity>
                                    :
                                    item.statusValue === "Assignee Rejected" || item.statusValue === "Paid Service Rejected" ?  
                                    <TouchableOpacity style={[styles.viewBookingTickets,{backgroundColor:colors.danger}]} onPress={()=>{navigation.navigate('ClientTicketDetails',{ticketDetails:item,status:status}),dispatch(getS3Details())}}>
                                        <Icon name='chevrons-right' size={20} color={colors.white} type='feather'/>
                                    </TouchableOpacity>
                                      :
                                    item.statusValue === "Closed" ? 
                                    <TouchableOpacity style={[styles.viewBookingTickets,{backgroundColor:colors.teal}]} onPress={()=>{navigation.navigate('ClientTicketDetails',{ticketDetails:item,status:status}),dispatch(getS3Details())}}>
                                        <Icon name='chevrons-right' size={20} color={colors.white} type='feather'/>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={[styles.viewBookingTickets,{backgroundColor:colors.grey}]} onPress={()=>{navigation.navigate('ClientTicketDetails',{ticketDetails:item,status:status}),dispatch(getS3Details())}}>
                                    </TouchableOpacity>
                                }      
							</View>
						</Card>
				)
            })}
   		 </ScrollView>
        :
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text style={commonStyle.subHeaderText}>No Tickets Found</Text>
        </View> 
        )}    
	</React.Fragment>
  );
};

const styles = StyleSheet.create({
    statusView:{
        alignSelf:'flex-end',
        paddingHorizontal:10,
        paddingVertical:2,
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
        borderBottomRightRadius:10,
        borderBottomLeftRadius:10,
        marginVertical:'2%',
    },

    container:{
        backgroundColor: '#f9f9f9',
        minHeight:'90%',
        width: window.width,
      },


    boxhead: {
        flex: 0.4,
    },
    boxheads: {
        flex: 0.6,
    },
    tabviews: {
        backgroundColor: '#fff',  borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    txtside: {
        flex: 0.5,
        flexDirection : "row",
    },
    daysago: {
        flex: 0.2,
        borderRightWidth:0.5,
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:5,
        paddingVertical:10,
    },
    carsbookings: {
        flex: 0.7,
        paddingHorizontal:5,
        paddingVertical:10,
    },
    sliderView: {
        borderWidth: 1,
        borderRadius: 10,
        padding:0,
        backgroundColor:"#fff",
    },
    itemtitlename: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 14,
        color: '#333',
    },
    itemtitle: {
        fontFamily: "Montserrat-Regular",
        fontSize: 14,
        color: '#333',
    },
    itemprice: {
        alignSelf : "flex-end",
        marginRight : 5,
        paddingTop : 5,
        color : "#333",
    },
    itemdetails: {
        alignSelf : "flex-start",
        marginRight : 5,
        paddingTop : 5,
        color : "#333",
        fontFamily: "Montserrat-SemiBold",
        fontSize: 16,
    },
    carprice: {
        flex : 0.5,
        // backgroundColor : "#3E70D7",
        marginTop       : -15,
        marginBottom    : 15,
        marginRight     : -15,
        height          : 30,
        borderBottomLeftRadius : 30,
    },
    bookingdetails: {
        flex : 0.5,
        marginTop       : -15,
    },
    dateText:{
        fontSize:18,
        color: '#333',
        fontFamily:'Montserrat-SemiBold',
        alignSelf:"center"
    },
    historyBoxLeft:{
        height:78,
        borderRightWidth:1,
        flex:0.3,
        justifyContent:"center"
    },
    viewBookingTickets:{
        flex:0.1,
        backgroundColor:"#ddd",
        alignItems:"center",
        justifyContent:"center",
        borderTopRightRadius:10,
        borderBottomRightRadius:10
    },
});


const mapStateToProps = (store)=>{
	return {
		ticketList		 : store.ticketList.list,
		loading          : store.ticketList.loading,
		clientDetails    : store.clientDetails.data,
	}
  
};
export default connect(mapStateToProps,{})(ListOfClientTickets);