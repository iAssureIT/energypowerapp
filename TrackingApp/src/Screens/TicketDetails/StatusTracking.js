import React, {useState,useEffect} from 'react';
import {View, ImageBackground,Image,Dimensions,Text,StyleSheet,TouchableOpacity,ScrollView}   from 'react-native';
import {Button, Icon, AirbnbRating,Rating}   from 'react-native-elements';
import { colors, sizes }        from '../../config/styles.js';
import commonStyle              from '../../config/commonStyle.js';
import {HeaderBar}              from '../../layouts/Header/Header.js';
import {useNavigation}          from '../../config/useNavigation.js';
import * as Yup                 from 'yup';
import {connect, useDispatch}   from 'react-redux';
import { Menu, MenuOptions,
         MenuOption, MenuTrigger }from 'react-native-popup-menu';
import {FormButton}             from '../../components/FormButton/FormButton.js';
import {FormInput}              from '../../components/FormInput/FormInput.js';
import {Formik, ErrorMessage}   from 'formik';
import StepIndicator            from 'react-native-step-indicator';
import ImagePicker              from 'react-native-image-crop-picker';
import Video              from 'react-native-video';
import { robotoWeights } from 'react-native-typography';
import ImageView                from 'react-native-image-view';
import axios                  from 'axios';
import moment from 'moment';

const window = Dimensions.get('window');


const StatusTracking = (props) => {
    const AllStatus = props.AllStatus;
    const {collapse,setCollapse} = useState(false);
    const [image, setImage]         = useState([]);
    const [imageVisible, setImageVisible]   = useState(false);
    console.log("imageVisible",imageVisible);
    return (
      <React.Fragment>
        {AllStatus && AllStatus.length > 0 &&
          AllStatus.map((item, index)=>{
            return(
                  <View key={index} style={{marginTop:15}}>
                    <View style={{flexDirection:'row'}}>
                      <View style={{flex:.1,flexDirection:'row',}}>
                        
                        {item.value === "New"    ||  item.value === "Reopen"?
                        <View style={{alignSelf:'center',justifyContent:'center'}}>
                          <Icon name="progress-clock" type="material-community" size={20} color={colors.primary} />
                        </View>
                        :
                        item.value === "Acknowledged" ?
                        <View style={{alignSelf:'center',justifyContent:'center'}}>
                          <Icon name="progress-clock" type="material-community" size={20} color={colors.info} />
                        </View>
                        :
                        item.value === "Work In Progress" || item.value === "Work Started"?
                        <View style={{alignSelf:'center',justifyContent:'center'}}>
                          <Icon name="progress-clock" type="material-community" size={20} color={colors.warning} />
                        </View>
                        :
                        item.value === "Paid Service Approved"?
                        <View style={{alignSelf:'center',justifyContent:'center'}}>
                          <Icon name="progress-clock" type="material-community" size={20} color={colors.purple} />
                        </View>
                        :
                        item.value === "Assignee Accepted"?
                        <View style={{alignSelf:'center',justifyContent:'center'}}>
                          <Icon name="progress-clock" type="material-community" size={20} color={colors.fuchsia} />
                        </View>
                        :
                       item.value === "Paid Service Request"?
                        <View style={{alignSelf:'center',justifyContent:'center'}}>
                          <Icon name="progress-clock" type="material-community" size={20} color={colors.orange} />
                        </View>
                        :
                        item.value === "Allocated"  ?
                        <View style={{alignSelf:'center',justifyContent:'center'}}>
                          <Icon name="progress-clock" type="material-community" size={20} color={colors.lightGreen} />
                        </View>
                        :
                        item.value === "Resolved" ?
                        <View style={{alignSelf:'center',justifyContent:'center'}}>
                          <Icon name="progress-check" type="material-community" size={20} color={colors.success} />
                        </View>
                        :
                        item.value === "Closed" ?
                        <View style={{alignSelf:'center',justifyContent:'center'}}>
                          <Icon name="check-circle-o" type="font-awesome" size={20} color={colors.teal} />
                        </View>
                        :
                        item.value === "Assignee Rejected" || item.value === "Paid Service Rejected"?
                        <View style={{alignSelf:'center',justifyContent:'center'}}>
                          <Icon name="check-circle-o" type="font-awesome" size={20} color={colors.danger} />
                        </View>
                        :
                        null
                      }
                      </View>
                      <View style={{flex:.45,}}>
                      {item.value === "New"    ||  item.value === "Reopen" ?
                        <View style={[styles.createdBtn,{backgroundColor:colors.primary}]}>  
                          <Text style={styles.createdText}>{item.value}</Text>
                          <Text style={[commonStyle.normalText,{alignSelf:'center',color:"#fff"}]}>{moment(item.statusAt).format('DD-MM-YYYY LT')}</Text>
                        </View>
                        :
                        item.value === "Acknowledged" ?
                        <View style={[styles.createdBtn,{backgroundColor:colors.info}]}>  
                          <Text style={styles.createdText}>{item.value}</Text>
                          <Text style={[commonStyle.normalText,{alignSelf:'center',color:"#fff"}]}>{moment(item.statusAt).format('DD-MM-YYYY LT')}</Text>
                        </View>
                        :
                        item.value === "Work In Progress" || item.value === "Work Started"?
                        <View style={[styles.createdBtn,{backgroundColor:colors.warning}]}>  
                          <Text style={styles.createdText}>{item.value}</Text>
                          <Text style={[commonStyle.normalText,{alignSelf:'center',color:"#fff"}]}>{moment(item.statusAt).format('DD-MM-YYYY LT')}</Text>
                        </View>
                        :
                        item.value === "Paid Service Approved" ?
                        <View style={[styles.createdBtn,{backgroundColor:colors.purple}]}>  
                          <Text style={styles.createdText}>{item.value}</Text>
                          <Text style={[commonStyle.normalText,{alignSelf:'center',color:"#fff"}]}>{moment(item.statusAt).format('DD-MM-YYYY LT')}</Text>
                        </View>
                        :
                        item.value === "Assignee Accepted"?
                        <View style={[styles.createdBtn,{backgroundColor:colors.fuchsia}]}>  
                          <Text style={styles.createdText}>{item.value}</Text>
                          <Text style={[commonStyle.normalText,{alignSelf:'center',color:"#fff"}]}>{moment(item.statusAt).format('DD-MM-YYYY LT')}</Text>
                        </View>
                        :
                       item.value === "Paid Service Request" ?
                        <View style={[styles.createdBtn,{backgroundColor:colors.orange}]}> 
                          <Text style={styles.createdText}>{item.value}</Text>
                          <Text style={[commonStyle.normalText,{alignSelf:'center',color:"#fff"}]}>{moment(item.statusAt).format('DD-MM-YYYY LT')}</Text>
                        </View>
                        :
                        item.value === "Allocated"  ?
                        <View style={[styles.createdBtn,{backgroundColor:colors.lightGreen}]}> 
                          <Text style={styles.createdText}>{item.value}</Text>
                          <Text style={[commonStyle.normalText,{alignSelf:'center',color:"#fff"}]}>{moment(item.statusAt).format('DD-MM-YYYY LT')}</Text>
                        </View>
                        :
                        item.value === "Resolved" ?
                        <View style={[styles.createdBtn,{backgroundColor:colors.success}]}> 
                          <Text style={styles.createdText}>{item.value}</Text>
                          <Text style={[commonStyle.normalText,{alignSelf:'center',color:"#fff"}]}>{moment(item.statusAt).format( 'DD-MM-YYYY HH:MM')}</Text>
                        </View>
                        :
                        item.value === "Closed" ?
                        <View style={[styles.createdBtn,{backgroundColor:colors.teal}]}> 
                          <Text style={styles.createdText}>{item.value}</Text>
                          <Text style={[commonStyle.normalText,{alignSelf:'center',color:"#fff"}]}>{moment(item.statusAt).format( 'DD-MM-YYYY HH:MM')}</Text>
                        </View>
                        :
                        item.value === "Assignee Rejected" || item.value === "Paid Service Rejected"?
                        <View style={[styles.createdBtn,{backgroundColor:colors.danger}]}> 
                          <Text style={styles.createdText}>{item.value}</Text>
                          <Text style={[commonStyle.normalText,{alignSelf:'center',color:"#fff"}]}>{moment(item.statusAt).format( 'DD-MM-YYYY HH:MM')}</Text>
                        </View>
                        :
                        null
                      }
                      </View>
                      <View style={{flex:.5,justifyContent:'center'}}>
                         <Text style={[commonStyle.normalText,{paddingHorizontal:10}]}>By {item.statusBy.profile ? item.statusBy.profile.fullName : props.userDetails.firstName + " " +props.userDetails.lastName }</Text>
                      </View>
                    </View>
                    {item.remark ?
                        <View style={{flex:1,flexDirection:'row',marginTop:5}}>
                           <View style={{flex:0.1,flexDirection:'row'}}></View>
                           <View style={{flex:0.9,flexDirection:'row'}}>
                            <Text style={commonStyle.label}>Remark : 
                              <Text style={[((Platform.OS === 'ios') ? sanFranciscoWeights.regular :robotoWeights.regular),commonStyle.normalText]}> {item.remark}</Text> 
                            </Text>
                          </View>
                        </View>
                       
                      :
                      null
                    }
                      <View style={{flex:1,flexDirection:'row'}}>
                        <View style={{flex:0.1,flexDirection:'row'}}></View>
                        <View style={{flex:0.9}}>
                          <ScrollView contentContainerStyle={{flexDirection:"row"}} horizontal={true}>
                          {item.images && item.images.length  > 0?
                            item.images.map((item,index)=>{
                              return(
                                <TouchableOpacity key={index} style={commonStyle.image} 
                                onPress={() => {
                                  setImage([
                                    {
                                      source: {
                                        uri: item,
                                      },
                                      title: 'Photos',
                                      // width: window.width,
                                      // height: window.height,
                                    },
                                  ]),
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
                          []
                          }
                          </ScrollView> 
                          {item.videos && item.videos.length  > 0?
                            item.videos.map((item,index)=>{
                              return(
                                <View >
                                  <Video 
                                    source={{uri:item}}   // Can be a URL or a local file.
                                    repeats
                                    controls={true}
                                    resizeMode={"stretch"}
                                    style={{height:150,width:window.width-100}} 
                                    paused={true} 
                                    fullscreen={true}
                                  />
                                </View>  
                              );
                            })
                            :
                            []
                          }
                        </View>  
                      </View>  
                      
                    {item.review ?
                        <View style={{flex:1,flexDirection:'row',marginTop:5}}>
                           <View style={{flex:0.1,flexDirection:'row'}}></View>
                           <View style={{flex:0.9,flexDirection:'row'}}>
                            <Text style={commonStyle.label}>Review :
                              <Text style={[((Platform.OS === 'ios') ? sanFranciscoWeights.regular :robotoWeights.regular),commonStyle.normalText]}> {item.review}</Text>
                            </Text>
                          </View>
                        </View>
                       
                      :
                      null
                    }
                    {
                      item.rating ?
                        <View style={{flex:1,justifyContent:'flex-end'}}>
                           <Rating 
                            startingValue={item.rating}
                            imageSize={30}
                            readOnly
                            showRating
                          />
                        </View>
                      :
                      null
                    }
                  </View>
              );
          })
        }
       <ImageView
            images={image}
            imageIndex={0}
            isVisible={imageVisible}
            onClose={() => setImageVisible(false)}
          />
      </React.Fragment>
    );
};

const styles = StyleSheet.create({  
  createdBtn: {
    padding:5,
    backgroundColor:'#E0E0E0',
    borderWidth: 1,
    borderRadius:5,
    borderColor: '#E0E0E0',
    justifyContent:'center',
    alignSelf:'center',
    width:'100%'
  },
  createdText:{
    color:'#fff',
    textAlign:'center',
    fontSize:14,
    fontWeight:'bold',
  },
});
const mapStateToProps = (store)=>{
  return {
    userDetails       : store.userDetails,
  }
};
export default connect(mapStateToProps,{})(StatusTracking);
