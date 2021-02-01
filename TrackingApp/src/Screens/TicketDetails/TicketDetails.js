import React, {useState} from 'react';
import {View, ImageBackground,Image,Dimensions,Text,StyleSheet,TouchableOpacity,ScrollView,Linking,Platform} 	from 'react-native';
import {Button, Icon, AirbnbRating,Rating}  	from 'react-native-elements';
import { colors, sizes }        from '../../config/styles.js';
import commonStyle              from '../../config/commonStyle.js';
import {HeaderBar}              from '../../layouts/Header/Header.js';
import {useNavigation}         	from '../../config/useNavigation.js';
import {connect, useDispatch,useSelector}   from 'react-redux';
import { Menu, MenuOptions,
         MenuOption, MenuTrigger }          from 'react-native-popup-menu';
import axios                  from 'axios';
import ImageView        from 'react-native-image-view';
import Dialog           from 'react-native-dialog';
import ImagePicker              from 'react-native-image-crop-picker';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import { RNS3 }                 from 'react-native-aws3';
import Video              from 'react-native-video';
import VideoPlayer             from '../../components/VideoPlayer/VideoPlayer.js';
import HTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';

const window = Dimensions.get('window');

export const TicketDetails = (props) => {
  const [btnLoading, setLoading]  = useState(false);
    const dispatch          = useDispatch();
    const navigation        = useNavigation();
    const ticketDetails     = navigation.getParam('ticketDetails');
    console.log('ticketDetails',ticketDetails);
    const [imageVisible, setImageVisible]   = useState(false);
    const [image, setImage]         = useState();

  const store = useSelector(store => ({
    userDetails     : store.userDetails,
  }));
  const role = store.userDetails.role;

  const goToMap = (latitude,longitude)=>{
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const label = 'Custom Label';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    Linking.openURL(url); 
  }
  const description = "<span style={{'font-size':'25px','font-family':'Montserrat-Regular'}}>"+ticketDetails.description+"</span>"
  var technician_details = ticketDetails.status.filter(a=>a.value == "Assignee Accepted");
  var unique_technician_details = [ ...new Map(technician_details.map(item => [String(item.allocatedTo), item])).values()];
  return (
    <React.Fragment>
      {/* <View style={{flexDirection:"row",borderColor:"#ccc",justifyContent:"flex-end"}}>
          {
                ticketDetails.statusValue=== "New" || ticketDetails.statusValue === "Reopen" ?   
                    <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.primary}]}>{ticketDetails.statusValue }</Text>
                :
                ticketDetails.statusValue === "Acknowledged" ?    
                    <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.info}]}>{ticketDetails.is_type === "Reopen" ? ticketDetails.is_type+"-"+ticketDetails.statusValue:ticketDetails.statusValue}</Text>
                :
                ticketDetails.statusValue === "Paid Service Request"?
                    <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.orange}]}>{ticketDetails.is_type === "Reopen" ? ticketDetails.is_type+"-"+ticketDetails.statusValue:ticketDetails.statusValue}</Text>
                :
                ticketDetails.statusValue === "Allocated" ?
                    <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.lightGreen}]}>{ticketDetails.is_type === "Reopen" ? ticketDetails.is_type+"-"+ticketDetails.statusValue:ticketDetails.statusValue}</Text>
                :
                ticketDetails.statusValue === "Work Started" || ticketDetails.statusValue=== "Work In Progress"?  
                    <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.warning}]}>{ticketDetails.is_type === "Reopen" ? ticketDetails.is_type+"-"+ticketDetails.statusValue:ticketDetails.statusValue}</Text>
                :
                ticketDetails.statusValue === "Paid Service Approved"?    
                    <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.purple}]}>{ticketDetails.is_type === "Reopen" ? ticketDetails.is_type+"-"+ticketDetails.statusValue:ticketDetails.statusValue}</Text>
                :
                ticketDetails.statusValue=== "Assignee Accepted"?    
                    <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.fuchsia}]}>{ticketDetails.is_type === "Reopen" ? ticketDetails.is_type+"-"+ticketDetails.statusValue:ticketDetails.statusValue}</Text>
                :
                ticketDetails.statusValue === "Resolved" ?   
                    <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.success}]}>{ticketDetails.is_type === "Reopen" ? ticketDetails.is_type+"-"+ticketDetails.statusValue:ticketDetails.statusValue}</Text>
                :
                ticketDetails.statusValue === "Assignee Rejected" || ticketDetails.statusValue === "Paid Service Rejected" ?  
                    <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.danger}]}>{ticketDetails.is_type === "Reopen" ? ticketDetails.is_type+"-"+ticketDetails.statusValue:ticketDetails.statusValue}</Text>
                  :
                  ticketDetails.statusValue === "Closed" ? 
                    <Text style={[commonStyle.normalText,commonStyle.textLabel,{backgroundColor:colors.teal}]}>{ticketDetails.is_type === "Reopen" ? ticketDetails.is_type+"-"+ticketDetails.statusValue:ticketDetails.statusValue}</Text>
                  :
                    <Text style={[commonStyle.normalText,{backgroundColor:colors.grey}]}>{item.statusValue}</Text>
            }        		
      </View>   */}
      <View style={{flexDirection:"row",borderColor:"#ccc",paddingVertical:10}}>
          <Icon name='ticket' type='material-community' size={20} iconStyle={{paddingHorizontal:5,flex:0.1}}/>
          <View style={{flex:0.9}}>
            <Text style={commonStyle.label}>{ticketDetails.ticketId+" - "+ticketDetails.typeOfIssue}</Text>
          </View>
      </View>
      <View style={{borderTopWidth:1,borderColor:"#ccc"}}>
      {role.includes('technician') ?
        <View style={{flexDirection:"row",paddingVertical:10}}>
            <Icon name='user' type='entypo' size={20} iconStyle={{paddingHorizontal:5,flex:0.1}}/>
            <View style={{flex:1}}>
              <Text style={commonStyle.label}>Contact Person</Text>
              <View style={{flexDirection:"row",flex:1}}>
                <Text style={[commonStyle.normalText,{flex:0.6}]}>{ticketDetails.contactPerson}</Text>
                {
                  ticketDetails.contactPerson_id && ticketDetails.contactPerson_id.contactNo!==""&&
                    <TouchableOpacity style={{flex:0.4}} onPress={() => Linking.openURL(`tel:${ticketDetails.contactPerson_id.contactNo}`)}>
                    <Text style={[commonStyle.normalText,{color:colors.theme}]}>{ticketDetails.contactPerson_id.contactNo}</Text>
                  </TouchableOpacity>
                }
              </View>  
          </View>
        </View>
        :
        role.includes('client') && unique_technician_details && unique_technician_details.length > 0 ?
        unique_technician_details.map((item,index)=>{
              return(
                   <View style={{flexDirection:"row",paddingVertical:10}}>
                      <Icon name='user' type='entypo' size={20} iconStyle={{paddingHorizontal:5,flex:0.1}}/>
                      <View style={{flex:0.9}}>
                        <Text style={commonStyle.label}>Technician</Text>
                        <View style={{flexDirection:"row",flex:1}}>
                          <Text style={[commonStyle.normalText,{flex:0.6}]}>{item.statusBy.profile.fullName}</Text>
                          <TouchableOpacity style={{flex:0.4}} onPress={() => Linking.openURL(`tel:${item.statusBy.profile.mobile}`)}>
                            <Text style={[commonStyle.label,{color:colors.theme}]}>{item.statusBy.profile.mobile}</Text>
                          </TouchableOpacity>
                        </View>  
                    </View>
                  </View>
              )
            })
            :
            null
       } 
      </View>
      <View style={{flexDirection:"row",borderColor:"#ccc",paddingVertical:10,borderTopWidth:1,borderColor:"#ccc"}}>
          <Icon name='file-document-outline' type='material-community' size={20} iconStyle={{paddingHorizontal:5,flex:0.1}}/>
          <View style={{flex:0.9}}>
            <Text style={commonStyle.label}>Description</Text>
            <HTML style={commonStyle.normalText} html={description} />
          </View>
      </View>
      <View style={{borderTopWidth:1,borderColor:"#ccc",paddingVertical :10}}>
        <View style={{flexDirection:"row",paddingVertical:5}}>  
          <Icon name='location' type='entypo' size={20} iconStyle={{paddingHorizontal:5,flex:0.1}}/>
          <View style={{flex:0.9}}>
            <Text style={commonStyle.label}>Recording Location</Text>
            <Text style={commonStyle.normalText}>{
                ticketDetails.recordingLocation_id && ticketDetails.recordingLocation_id.address && ticketDetails.recordingLocation_id.address.length > 0 ? 
                  ticketDetails.recordingLocation_id.address[0].addressLine1 
                : "NA"
            }</Text>
          </View>
          <TouchableOpacity style={{marginBottom:'1%',marginLeft:'5%',flexDirection:"row",alignItems:"flex-end"}} onPress={()=>goToMap(ticketDetails.recordingLocation_id.address[0].latitude,ticketDetails.recordingLocation_id.address[0].longitude)}>
                  <Icon size={20} name='location-arrow' type='font-awesome' color={colors.theme} />
              </TouchableOpacity> 
        </View> 
        {ticketDetails.cameraLocation_id ?
          <View style={{flexDirection:"row",paddingVertical:5}}>  
            <Icon name='camera' type='entypo' size={20} iconStyle={{paddingHorizontal:5,flex:0.1}}/>
            <View style={{flex:0.9}}>
              <Text style={commonStyle.label}>Camera Location</Text>
              <Text style={commonStyle.normalText}>{
                ticketDetails.cameraLocation_id && ticketDetails.cameraLocation_id.address && ticketDetails.cameraLocation_id.address.length > 0 ?
                  ticketDetails.cameraLocation_id.address[0].addressLine1
                  :
                  "NA"
              }</Text>
            </View>
              <TouchableOpacity style={{marginBottom:'1%',marginLeft:'5%',flexDirection:"row",alignItems:"flex-end"}} onPress={()=>goToMap(ticketDetails.cameraLocation_id.address[0].latitude,ticketDetails.cameraLocation_id.address[0].longitude)}>
                  <Icon size={20} name='location-arrow' type='font-awesome' color={colors.theme} />
              </TouchableOpacity> 
          </View>
          :
          null
        }    
      </View>
      <View style={{borderTopWidth:1,borderColor:"#ccc",paddingVertical:15}}>
        <Text style={commonStyle.label}>Attachment</Text>
        {(ticketDetails.images && ticketDetails.videos) && (ticketDetails.images.length > 0 ||ticketDetails.videos.length > 0)  ?
          <React.Fragment>
          <ScrollView contentContainerStyle={{flexDirection:"row"}} horizontal={true}>  
            {ticketDetails.images && ticketDetails.images.length > 0 ?
              ticketDetails.images.map((item,index)=>{
                return(
                  <TouchableOpacity key={index} style={commonStyle.image} 
                    onPress={() => {
                            setImage([
                              {
                                source: {
                                  uri: item,
                                },
                                title: 'Photos',
                                width: window.width-20,
                                height: window.height-20,
                              },
                            ]);
                            setImageVisible(true);
                          }}>
                    <Image
                      style={{height: 60, width: 60}}
                      source={{uri:item}}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                );
              })
              :
              null
            }
          </ScrollView>  
          {ticketDetails && ticketDetails.videos.length > 0 ?
              ticketDetails.videos.map((item,index)=>{
                return(
                  <Video 
                      source={{uri:item}}   // Can be a URL or a local file.
                      repeats
                      controls={true}
                      resizeMode={"stretch"}
                      style={{height:150}} 
                      paused={true} 
                      fullscreen={true}
                    />
                );
              })
              :
              null
            }
         </React.Fragment>   
         :
          <Image
            style={{height: 100, width: 100}}
            source={require('../../images/NoImg.png')}
            resizeMode={'contain'}
          />
       }
      </View>
      
      {imageVisible ? (
        <ImageView
          images={image}
          imageIndex={0}
          isVisible={imageVisible}
          onClose={() => setImageVisible(false)}
          isPinchZoomEnabled={true}
        />
      ) : null} 
    </React.Fragment>
   );   
};

