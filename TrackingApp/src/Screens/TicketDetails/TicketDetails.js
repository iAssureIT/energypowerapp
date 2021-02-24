import React, {useState} from 'react';
import {View, ImageBackground,Image,Dimensions,Text,StyleSheet,TouchableOpacity,ScrollView,Linking,Platform} 	from 'react-native';
import {Button, Icon, AirbnbRating,Rating}  	from 'react-native-elements';
import { colors, sizes }        from '../../config/styles.js';
import commonStyle              from '../../config/commonStyle.js';
import {HeaderBar}              from '../../layouts/Header/Header.js';
import {useNavigation}         	from '../../config/useNavigation.js';
import {connect, useDispatch,useSelector}   from 'react-redux';
import Video              from 'react-native-video';
import HTML from 'react-native-render-html';
import {DownloadModal}              from '../../components/DonloadModal/DownloadModal.js';
import {withCustomerToaster}    from '../../redux/AppState.js';
const window = Dimensions.get('window');

const TicketDetails = withCustomerToaster((props) => {
  const {setToast} = props;
    const navigation        = useNavigation();
    const ticketDetails     = navigation.getParam('ticketDetails');
    const [imageVisible, setImageVisible]   = useState(false);
    const [imageUrl, setImageUrl]   = useState('');

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
            <Text style={commonStyle.label}>Project Location</Text>
            <Text style={commonStyle.normalText}>{
                ticketDetails.projectLocation_id && ticketDetails.projectLocation_id.address && ticketDetails.projectLocation_id.address.length > 0 ? 
                  ticketDetails.projectLocation_id.address[0].addressLine1 
                : "NA"
            }</Text>
          </View>
          <TouchableOpacity style={{marginBottom:'1%',marginLeft:'5%',flexDirection:"row",alignItems:"flex-end"}} onPress={()=>goToMap(ticketDetails.projectLocation_id.address[0].latitude,ticketDetails.projectLocation_id.address[0].longitude)}>
                  <Icon size={20} name='location-arrow' type='font-awesome' color={colors.theme} />
              </TouchableOpacity> 
        </View> 
        {ticketDetails.equipmentLocation_id ?
          <View style={{flexDirection:"row",paddingVertical:5}}>  
            <Icon name='location' type='entypo' size={20} iconStyle={{paddingHorizontal:5,flex:0.1}}/>
            <View style={{flex:0.9}}>
              <Text style={commonStyle.label}>Equipment Location</Text>
              <Text style={commonStyle.normalText}>{
                ticketDetails.equipmentLocation_id && ticketDetails.equipmentLocation_id.address && ticketDetails.equipmentLocation_id.address.length > 0 ?
                  ticketDetails.equipmentLocation_id.address[0].addressLine1
                  :
                  "NA"
              }</Text>
            </View>
              <TouchableOpacity style={{marginBottom:'1%',marginLeft:'5%',flexDirection:"row",alignItems:"flex-end"}} onPress={()=>goToMap(ticketDetails.equipmentLocation_id.address[0].latitude,ticketDetails.equipmentLocation_id.address[0].longitude)}>
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
                var ext = item.slice((item.lastIndexOf(".") - 1 >>> 0) + 2);
                if(ext === "pdf"){
                  return(
                    <TouchableOpacity key={index} style={commonStyle.image} 
                    onPress={() => { setImageUrl(item),setImageVisible(true);}}>
                      <ImageBackground
                        style={{height: 60, width: 60}}
                        source={require('../../images/pdf.png')}
                        resizeMode={'contain'}
                      >
                      </ImageBackground>
                    </TouchableOpacity>
                  );
                }else if(ext === "xls"){
                  return(
                    <TouchableOpacity key={index} style={commonStyle.image} 
                    onPress={() => { setImageUrl(item);setImageVisible(true)}}>
                      <ImageBackground
                        style={{height: 60, width: 60}}
                        source={require('../../images/xls.png')}
                        resizeMode={'contain'}
                      >
                      </ImageBackground>
                    </TouchableOpacity>
                  );
                }else{
                  return(
                    <TouchableOpacity key={index} style={commonStyle.image} 
                    onPress={() => {
                      setImageUrl(item);
                      // setImage([
                      //   {
                      //     source: {
                      //       uri: item,
                      //     },
                      //     title: 'Photos',
                      //     // width: window.width,
                      //     // height: window.height,
                      //   },
                      // ]),
                      setImageVisible(true);
                    }}>
                      <Image
                        style={{height: 60, width: 60}}
                        source={{uri:item}}
                        resizeMode={'contain'}
                      />
                    </TouchableOpacity>
                  );
                }
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
      <DownloadModal
            setToast={setToast }
            url={ imageUrl }
            visible={ imageVisible }
            close={ () => setImageVisible(false) }
          />
    </React.Fragment>
   );   
});

export default TicketDetails;
