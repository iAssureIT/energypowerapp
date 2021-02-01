import React from 'react';
import {  StyleSheet,
          ScrollView,
          View,
          Text,
          TouchableOpacity,
          Alert,
          ImageBackground,
          Image,
          Platform,
          Dimensions,
        } from 'react-native';


import  MapView, 
        { PROVIDER_GOOGLE, 
          Polyline, 
          Marker, 
          AnimatedRegion, 
          Animated 
        } from 'react-native-maps';

import { NavigationActions,StackActions, withNavigationFocus }  from 'react-navigation';
import { request,check,PERMISSIONS,RESULTS }                    from 'react-native-permissions';
import Geolocation                                              from 'react-native-geolocation-service';
import axios                                                    from 'axios';
// import { RNCamera, FaceDetector } from 'react-native-camera';
import ImagePicker                            from 'react-native-image-crop-picker';
import styles                               from './styles.js';
// import { RNCamera }                         from 'react-native-camera';
import AsyncStorage                         from '@react-native-community/async-storage';
import { RNS3 }                             from 'react-native-aws3';
import Dialog                               from "react-native-dialog";
import { Header, Icon, Button  }            from 'react-native-elements';
import Loading                              from '../../../layouts/Loading/Loading.js';

const window = Dimensions.get('window');
const haversine = require('haversine')
  
const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Waiting</Text>
  </View>
);

export default class FromLocation extends React.Component {
 navigateScreen=(route)=>{
      const navigateAction = NavigationActions.navigate({
      routeName: route,
      params: {},
      action: NavigationActions.navigate({ routeName: route }),
    });
    this.props.navigation.dispatch(navigateAction);
  }


constructor(props) {
  super(props);

    this.state = {
      config    : '',
      imgPath   : '',
      user_id   : '',
      openModal : false,
      isLoading:false,
    }
     
  }

  componentDidMount(){ 
    this.getS3config();
    this.getUserData();
  }

  getUserData(){
    AsyncStorage.getItem('user_id')
    .then((userId)=>{
      axios.get('/api/users/get/'+userId)
      .then((user)=>{
        console.log('user',user);
        this.setState({
          imgPath      : user.data.image,
          user_id      : userId,  
        })
      })
      .catch((error)=>{
        console.log("error=>",error)
      })
    })
  }


  getS3config(){
    axios
      .get('/api/projectsettings/get/S3')
      .then((response)=>{
        // console.log("s3_response.............",response);
        const config = {
                          bucket              : response.data.bucket,
                          keyPrefix           : 'UserProfile',
                          region              : response.data.region,
                          accessKey           : response.data.key,
                          secretKey           : response.data.secret,
                          successActionStatus : 201
                       };
        this.setState({
          config : config
        })
      })
     .catch((error)=>{
              console.log(error);
        });
  }

  get_url_extension( url ) {
    return url.split(/\#|\?/)[0].split('.').pop().trim();
  }

  setImage(){
    var imgPath ={
      userImg : this.state.imgPath,
    }
    axios
      .patch('/api/users/patch/userimg/'+this.state.user_id,imgPath)
      .then((response)=>{
        console.log("response",response)
      })
     .catch((error)=>{
              console.log(error);
        });
  }

  takePicture = async function(camera) {
    const options = { quality: 0.5, base64: true };
    const data = await camera.takePictureAsync(options);
    if(data.uri){
      const file = {
        uri  : data.uri,
        name : data.uri.split('/').pop().split('#')[0].split('?')[0],
        type : 'image/jpeg',
      }
      if(file) {
        var fileName = data.uri; 
        var ext = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2); 
        console.log("ext=>",ext);
        if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){  
          if (file) {
            this.setState({
              isLoading:true,
                  openModal     : false,
            })
            RNS3
            .put(file,this.state.config)
            .then((Data)=>{
                this.setState({
                  imgPath       : Data.body.postResponse.location,
                  isLoading     : false,
                },()=>{
                  this.setImage();
                })
            })
            .catch((error)=>{
              this.setState({isLoading:false});
              console.log("error=>",error);
            });
          }else{       
            this.setState({isLoading:false})
            Alert.alert("File not uploaded","Something went wrong","error");  
          }
        }else{
          this.setState({isLoading:false})
          Alert.alert("Please upload file","Only Upload  images format (jpg,png,jpeg)");   
        }
      }
    }
  };


  handleCancel = () => {
    this.setState({
     openModal      : false,
   });
  };

  openModal(){
    console.log("Inside")
    this.setState({
     openModal      : true,
   });
  };

  render(){
      const { navigation } = this.props;

      return(
        <React.Fragment>
          <View styles={styles.container}>
            <View style={{height:100,width:100,borderRadius:100,backgroundColor:"#eee",alignItems:'center',justifyContent:"center",}}>
            {this.state.imgPath === "" ?
              <ImageBackground
                source={require('../../../images/user.jpg') }
                style={{width:100,height:100,borderRadius:100}}
                imageStyle={{ borderRadius: 100 }}
              >
                <TouchableOpacity style={{width:30,height:30,backgroundColor:"#283593",justifyContent:"center",marginTop:60,marginLeft:60,borderRadius:100}} onPress={this.openModal.bind(this)}>
                  <Icon size={15} name='camera' type='font-awesome' color='#fff' />
                </TouchableOpacity> 
              </ImageBackground>
              :
              <ImageBackground
                source={{ uri: this.state.imgPath }}
                style={{width:100,height:100,borderRadius:100}}
                imageStyle={{ borderRadius: 100 }}
              >
                <TouchableOpacity style={{width:30,height:30,backgroundColor:"#283593",justifyContent:"center",marginTop:60,marginLeft:60,borderRadius:100}} onPress={this.openModal.bind(this)}>
                  <Icon size={15} name='camera' type='font-awesome' color='#fff' />
                </TouchableOpacity> 
              </ImageBackground>
            }
            </View>
          </View>
          <Dialog.Container visible={this.state.openModal}>
          {!this.state.isLoading ?
            <RNCamera
              style       = {styles.preview}
              type        = {RNCamera.Constants.Type.back}
              flashMode   = {RNCamera.Constants.FlashMode.on}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              type        = 'front'
              mirrorImage = {false}
            >
              {({ camera, status, recordAudioPermissionStatus }) => {
                if (status !== 'READY') return <PendingView />;
                return (
                  <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
                      <Text style={{ fontSize: 14 }}> SNAP </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            </RNCamera>
            :
            <Loading style  = {styles.preview}/>
          }
            <Dialog.Button label="Cancel" onPress={this.handleCancel} />
          </Dialog.Container>  
        </React.Fragment>  
      );
  }

}