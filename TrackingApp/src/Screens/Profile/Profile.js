import React, {useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  Platform,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView
} from 'react-native';

import axios                          from 'axios';
import {Button, Icon, Input}          from 'react-native-elements';
import {withNavigation}               from 'react-navigation';
import {connect, useDispatch}         from 'react-redux';
import commonStyle                    from '../../config/commonStyle.js';
import {Formik, ErrorMessage}         from 'formik';
import {
  specialCharacterValidator,
  passwordValidator,
  emailValidator,
  mobileValidator,
} from '../../config/validators.js';
import * as Yup                       from 'yup';
import {useNavigation}                from '../../config/useNavigation.js';
import { colors, sizes }              from '../../config/styles.js';
import {HeaderBar}                    from '../../layouts/Header/Header.js';
import moment                           from 'moment';
import Loading                      from '../../layouts/Loading/Loading.js'; 
import ImageView                  from 'react-native-image-view';      
const window = Dimensions.get('window');

const Profile = (props) => {
  const personDetails =props.personDetails;
  const navigation = useNavigation();
  const [imageVisible, setImageVisible] = useState(false);
  const [image, setImage] = useState([]);

  const toConvertAddress = (obj) =>{
     var adddress = Object.keys(obj).map(function (key) { 
          if(key!=='latitude' && key!=='longitude' && key!=='_id'){
              return obj[key];
          }
      }).join(" ");
     return adddress;
  }


  return (
    <React.Fragment>
      <HeaderBar navigation={navigation} showBackBtn={true} title="My Profile"/>
      {props.loading ?
          <Loading />
        :
        <ScrollView contentContainerStyle = {commonStyle.modalView}>
        {<TouchableOpacity
          onPress={() => navigation.navigate('EmployeeProfile')}
          style={{alignSelf: 'flex-end'}}>
          <Icon type='font-awesome' name="pencil" size={18}/>
          {/* <Text >Edit Profile</Text> */}
        </TouchableOpacity>}
        <ImageBackground
          style={{
            height: 100,
            width: 100,
            borderRadius: 100,
            alignSelf: 'center',
          }}
          source={personDetails.profilePhoto &&personDetails.profilePhoto !== "" ? {uri:personDetails.profilePhoto} : require('../../images/user.jpg')}
          imageStyle={{borderRadius: 100}}
        />
        <View style={{paddingVertical:'5%'}}>
          <View style={{flexDirection: 'row',marginBottom: '5%'}}>
            <View style={{flex: 0.3}}>
              <Text >Name : </Text>
            </View>
            <View style={{flex: 0.7}}>
              <Text >{personDetails.firstName +" "+ (personDetails.middleName ? personDetails.middleName : "")+" "+personDetails.lastName}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginBottom: '5%'}}>
            <View style={{flex: 0.3}}>
              <Text >Email ID : </Text>
            </View>
            <View style={{flex: 0.7}}>
              <Text >{personDetails.email}</Text>
            </View>
          </View>
           <View style={{flexDirection: 'row',marginBottom: '5%'}}>
            <View style={{flex: 0.3}}>
              <Text type={['bold']}>Mobile No : </Text>
            </View>
            <View style={{flex: 0.7}}>
              <Text type={['bold']}>{personDetails.contactNo!=="" ? personDetails.contactNo : "-"}</Text>
            </View>
          </View>
           {personDetails.companyName!=="" && <View style={{flexDirection: 'row',marginBottom: '5%'}}>
            <View style={{flex: 0.3}}>
              <Text type={['bold']}>Company : </Text>
            </View>
            <View style={{flex: 0.7}}>
              <Text type={['bold']}>{personDetails.companyName}</Text>
            </View>
          </View>}
          {personDetails.whatsappNo!=="" && <View style={{flexDirection: 'row',marginBottom: '5%'}}>
            <View style={{flex: 0.3}}>
              <Text type={['bold']}>WhatsApp No : </Text>
            </View>
            <View style={{flex: 0.7}}>
              <Text type={['bold']}>{personDetails.whatsappNo}</Text>
            </View>
          </View>}
          {personDetails.gender!=="" && <View style={{flexDirection: 'row',marginBottom: '5%'}}>
            <View style={{flex: 0.3}}>
              <Text type={['bold']}>Gender : </Text>
            </View>
            <View style={{flex: 0.7}}>
              <Text type={['bold']}>{personDetails.gender}</Text>
            </View>
          </View>}
          {personDetails.DOB &&<View style={{flexDirection: 'row',marginBottom: '5%'}}>
            <View style={{flex: 0.3}}>
              <Text type={['bold']}>Date of Birth : </Text>
            </View>
            <View style={{flex: 0.7}}>
              <Text type={['bold']}>{moment(personDetails.DOB).format('YYYY-MM-DD')}</Text>
            </View>
          </View>
          }
          {personDetails.address && personDetails.address.length > 0  && <View style={{flexDirection: 'row',marginBottom: '5%'}}>
            <View style={{flex: 0.3}}>
              <Text type={['bold']}>Address : </Text>
            </View>
            <View style={{flex: 0.7}}>
              <Text type={['bold']}>{personDetails.address[0].addressLine1}</Text>
            </View>
          </View>}
          {personDetails.workLocation && <View style={{flexDirection: 'row',marginBottom: '5%'}}>
            <View style={{flex: 0.3}}>
              <Text type={['bold']}>Work Location : </Text>
            </View>
            <View style={{flex: 0.7}}>
              <Text type={['bold']}>{personDetails.workLocation}</Text>
            </View>
          </View>}
          {personDetails.workImages && personDetails.workImages.length > 0 && <View style={{marginBottom: '5%'}}>
            <View style={{flex: 1}}>
              <Text type={['bold']}>Work Images : </Text>
            </View>
            <View style={{flexDirection:"row",flexWrap:"wrap"}} >  
                  {
                    personDetails.workImages.map((item,index)=>{
                      return(
                        <TouchableOpacity key={index} style={{padding:15}} 
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
                          <ImageBackground
                            style={{height:100, width: (window.width-120)/2}}
                            source={{uri:item}}
                            resizeMode={'cover'}
                          >
                          </ImageBackground>
                        </TouchableOpacity>
                      );
                    })
                }
              </View> 
          </View>}
          {personDetails.socialMediaArray && personDetails.socialMediaArray.length > 0 && <View style={{marginBottom: '5%'}}>
            <View style={{flex: 1}}>
              <Text type={['bold']}>Social Media : </Text>
            </View>
            <View style={{flex:1,flexDirection:"row",flexWrap:"wrap"}} >  
              { 
                personDetails.socialMediaArray.map((item,index)=>{
                  return(
                    <TouchableOpacity key={index} style={{padding:5}} 
                    onPress={() => {Linking.openURL(item.url)}}>
                      <ImageBackground
                        style={{height:50, width:50}}
                        source={{uri:item.icon}}
                        resizeMode={'cover'}
                      >
                      </ImageBackground>
                    </TouchableOpacity>
                  );
                })
            }
           </View> 
          </View>}
        </View>
       </ScrollView>} 
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
  iconContainer: {
    backgroundColor: '#fff',
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    marginLeft: 25,
    borderWidth: 1,
    borderColor: '#f1f1f1',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
});
const mapStateToProps = (state)=>{
  console.log("state",state);
  return {
    personDetails : state.personDetails.data,
    loading: state.personDetails.loading
  }
  
};
export default connect(mapStateToProps,{})(Profile);