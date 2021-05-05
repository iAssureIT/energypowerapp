import React, {useState, useEffect} from 'react';
import {View, ImageBackground,Image,Dimensions,Text,StyleSheet,TouchableOpacity,ScrollView,Linking}   from 'react-native';
import {Icon}         from 'react-native-elements';
import commonStyle                          from '../../config/commonStyle.js';
import {HeaderBar}                          from '../../layouts/Header/Header.js';
import {useNavigation}                      from '../../config/useNavigation.js';
import * as Yup                             from 'yup';
import {useDispatch,useSelector}   from 'react-redux';
import {FormButton}                         from '../../components/FormButton/FormButton.js';
import {FormInput}                          from '../../components/FormInput/FormInput.js';
import {Formik}               from 'formik';
import ImagePicker                          from 'react-native-image-crop-picker';
import StatusTracking                       from './StatusTracking.js'
import TicketDetails                       from './TicketDetails.js'
import moment                               from 'moment';
import axios                                from 'axios';
import { getTechnicianTicketsList }         from '../../redux/ticketList/actions';
import {getDasboardCount}                   from '../../redux/technicianDashboardCount/actions';
import { KeyboardAwareScrollView }          from 'react-native-keyboard-aware-scroll-view';
import {withCustomerToaster}                from '../../redux/AppState.js';
import Geolocation                          from 'react-native-geolocation-service';
import Dialog                               from 'react-native-dialog';
import {PERMISSIONS, request, RESULTS}      from 'react-native-permissions';
import { RNS3 }                             from 'react-native-aws3';
import Loading                              from '../../layouts/Loading/Loading.js';
import Video                                from 'react-native-video';
import DocumentPicker from 'react-native-document-picker';
import {DownloadModal}              from '../../components/DonloadModal/DownloadModal.js';
import {connect}   from 'react-redux';
const window = Dimensions.get('window');



const TicketDetailsSchema = Yup.object().shape({
  status: Yup.string().notRequired(),
  reason: Yup.string().notRequired()
  .when('status', {
  is: (val) => val === "Work In Progress" || val === "Resolved" || val === "Assignee Rejected",
  then: Yup.string().required('This field is required'),
  otherwise: Yup.string().notRequired()
  })
});

	


 const TechnicianTicketDetails = withCustomerToaster((props) => {
  const {setToast} = props;
  const store = useSelector(store => ({
    userDetails     : store.userDetails,
    s3Details     
      : store.s3Details,
   }));
  const [btnLoading, setLoading]      = useState(false);
  const dispatch                    = useDispatch();
  const navigation                  = useNavigation();
  const ticketDetails               = navigation.getParam('ticketDetails');
  const displayStatus               = navigation.getParam('status');
  const [gallery, setGallery]       = useState([]);
  const [videoLib, setVideoLib]     = useState([]);
  const [attendance,setAttendance]  = useState(true);
  const [loading,isLoading]         = useState(true);

  const AllStatus = ticketDetails.status;
  const myStatusArray = AllStatus.filter(a=>a.allocatedTo === store.userDetails.person_id);
  const myStatus = myStatusArray[myStatusArray.length-1].value; 

    useEffect(() => {
      axios
      // .get('/api/attendance/get/get_tracking_status/'+store.userDetails.user_id+"/"+new Date())
      .get('/api/attendance/get/get_tracking_status/'+store.userDetails.user_id)
        .then((attendance)=>{
          isLoading(false)
          console.log("attendance",attendance);
          if(attendance.data && !attendance.data.tracking_status){
            setAttendance(false) ;
          }
        })
        .catch(error=>{
          console.log("error=>",error)
        })
      }, [attendance])

    return (
      <React.Fragment>
        <Formik
            onSubmit={(values,fun) => {
                setLoading(true);
                let {reason, status,images,videos} = values;
                console.log("reason",reason);
                let payload ={};
                if(status === "Assignee Rejected" || status === "Work In Progress" || status ==="Resolved"){
                  if(reason === undefined || reason ==="" ){
                      return false;
                  }
                }  
                Geolocation.getCurrentPosition(position => {
                  if(status === "Assignee Accepted" || status === "Work Started"){
                     payload = {
                        ticket_id :ticketDetails._id,
                        status    : {
                                      allocatedTo   : store.userDetails.person_id,
                                      value         : status,
                                      longitude     : position.coords.longitude,
                                      latitude      : position.coords.latitude,
                                      statusBy      : store.userDetails.user_id,
                                      statusAt      : new Date(),     
                                    },
                        updatedBy : store.userDetails.user_id            
                    };
                    var sendData = {
                      "event": status === "Assignee Accepted" ? "Event5" : "Event9",  //Event Name
                      "company_id": ticketDetails.client_id, //company_id(ref:entitymaster)
                      "intendedUser_id": store.userDetails.person_id, //To user_id(ref:users)
							        "intendedUserRole":"technician",
                      "otherAdminRole":'client',
                      "variables": {
                        'TechnicianName' : store.userDetails.firstName+" "+store.userDetails.firstName,
                        'TicketId': ticketDetails.ticketId,
                        'CompanyName': ticketDetails.clientName,
                        'RaisedBy' :ticketDetails.contactPerson,
                        'TypeOfIssue': ticketDetails.typeOfIssue,
                        'CreatedAt': moment().format("DD/MM/YYYY"),
                      }
                    }
                    console.log("sendData",sendData);
                    axios.post('/api/masternotifications/post/sendNotification', sendData)
                    .then((res) => {
                    console.log('sendDataToUser in result==>>>', res.data)
                    })
                  }else if(status === "Assignee Rejected" || status === "Work In Progress" || status ==="Resolved"){
                    payload = {
                        ticket_id :ticketDetails._id,
                        status    : {
                                      allocatedTo   : store.userDetails.person_id,
                                      value         : status,
                                      images        : images ? images : [],
                                      videos        : videos ? videos : [],
                                      longitude     : position.coords.longitude,
                                      latitude      : position.coords.latitude,
                                      statusBy      : store.userDetails.user_id,
                                      remark        : reason,
                                      statusAt      : new Date(),     
                                    },
                        updatedBy : store.userDetails.user_id
                    };
                    var sendData = {
                      "event": status === "Assignee Rejected" ? "Event6" : "Event7",  //Event Name
                      "company_id": ticketDetails.client_id, //company_id(ref:entitymaster)
                      "intendedUser_id": store.userDetails.person_id, //To user_id(ref:users)
							        "intendedUserRole":"technician",
                      "otherAdminRole":'client',
                      "variables": {
                        'TechnicianName' : store.userDetails.firstName+" "+store.userDetails.firstName,
                        'TicketId': ticketDetails.ticketId,
                        'CompanyName': ticketDetails.clientName,
                        'RaisedBy' :ticketDetails.contactPerson,
                        'TypeOfIssue': ticketDetails.typeOfIssue,
                        'CreatedAt': moment().format("DD/MM/YYYY"),
                      }
                    }
                    console.log("sendData",sendData);
                    axios.post('/api/masternotifications/post/sendNotification', sendData)
                    .then((res) => {
                    console.log('sendDataToUser in result==>>>', res.data)
                    })
                  }
                  axios.patch('/api/tickets/patch/status', payload)
                  .then((response)=>{
                      fun.resetForm(values);
                      setGallery([]);
                      setVideoLib([]);
                      ticketDetails.status.push(payload.status);
                      ticketDetails.statusValue = payload.status.value;
                      dispatch(getDasboardCount(store.userDetails.person_id));
                      fun.resetForm(values);
                      if(displayStatus === "New"){
                        dispatch(getTechnicianTicketsList(store.userDetails.person_id,'Allocated'))
                      }
                      else if(displayStatus === "WIP"){
                        dispatch(getTechnicianTicketsList(store.userDetails.person_id,'Work In Progress'))
                      }
                      else if(displayStatus === "Completed"){
                        dispatch(getTechnicianTicketsList(store.userDetails.person_id,'Completed'))
                      }
                      else if(displayStatus === "Rejected"){
                        dispatch(getTechnicianTicketsList(store.userDetails.person_id,'Rejected'))
                      } 
                      else if(displayStatus === "Total"){
                        dispatch(getTechnicianTicketsList(store.userDetails.person_id,'Total'))
                      }
                      if(payload.status.value === "Resolved"){
                        navigation.navigate('TechnicianDashboard');
                      }
                   })
                  .catch((error)=>{
                        setToast({text: 'Something went wrong.', color: 'red'});
                    }); 
                  error => console.log(error)
                });
            }}
            validationSchema={TicketDetailsSchema}
            initialValues={{
              reason : '',
              images : [],
              setToast:setToast,
            }}>
            {formProps => <FormBody 
                btnLoading      = {btnLoading} 
                loading      = {loading} 
                ticketDetails   = {ticketDetails}
                statusValue     = {displayStatus}
                myStatus        = {myStatus} 
                AllStatus       = {AllStatus}
                s3Details       = {store.s3Details.data}
                gallery         = {gallery}
                setGallery      = {setGallery}
                videoLib        = {videoLib}
                setVideoLib     = {setVideoLib}
                navigation      = {navigation} 
                attendance      = {attendance}
                userDetails={props.userDetails}
                {...formProps} 
              />
            }
          </Formik>
        
      </React.Fragment>
    );
});

const FormBody = props => {
  const {
    handleChange,
    handleSubmit,
    errors,
    touched,
    btnLoading,
    setFieldValue,
    ticketDetails,
    statusValue,
    navigation,
    myStatus,
    s3Details,
    AllStatus,
    values,
    gallery,
    setGallery,
    videoLib,
    setVideoLib,
    attendance,
    loading,
    userDetails
  } = props;

  const {setToast}=values;


  const [acceptBtn, acceptSelected]           = useState(false);
  const [rejectBtn, rejectSelected]           = useState(false);
  const [wipBtn, wipSelected]                 = useState(false);
  const [completedBtn, completedSelected]     = useState(false);
  const [currentPosition, setCurrentPosition] = useState(5);
  const [imageVisible, setImageVisible]       = useState(false);
  const [image, setImage]                     = useState([]);
  const [openModal, setModal]                 = useState(false);
  const [openModalVideo, setModalVideo]       = useState(false);
  const [imageLoading, setImageLoading]       = useState(false);
  const [videoLoading, setVideoLoading]       = useState(false);
  const [deleteDialogImg,setDeleteDialogImg]  = useState(false);
  const [deleteDialogVideo,setDeleteDialogVideo]  = useState(false);
  const [deleteIndex,setDeleteIndex]          = useState(false);
  const [collapse,setCollapse]                = useState(true);
  const [collapse1,setCollapse1]                = useState(true);
  const [imageUrl, setImageUrl]   = useState('');
  const selectValue = props =>{
    if(props === "Accept"){
        handleSubmit();
        acceptSelected(true);
        rejectSelected(false);
        setFieldValue('status','Assignee Accepted');
    }else if(props === "Reject"){
        acceptSelected(false);
        setFieldValue('status','Assignee Rejected');
        rejectSelected(true);
    }else if(props === "Start"){
        handleSubmit();
        setFieldValue('status','Work Started');
    }else if(props === "WIP"){
      handleSubmit();
      wipSelected(true);
      setFieldValue('status','Work In Progress');
    }else if(props === "Resolved"){
      handleSubmit();
      wipSelected(false);
      completedSelected(true);
      setFieldValue('status','Resolved');
    }
  }

    const chooseFromLibrary = (props) => {
      var openType = props === 'openCamera' ? ImagePicker.openCamera : ImagePicker.openPicker;
      request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      )
        .then(result => {
          setModal(false);
              switch (result) {
                case RESULTS.GRANTED:
                  openType({
                    multiple      : true,
                    waitAnimationEnd: false,
                    includeExif: true,
                    forceJpg: true,
                  }).then(response => {
                  setImageLoading(true);
                    response =  props === 'openCamera' ? [response] : response;
                    for (var i = 0; i<response.length; i++) {
                        if(response[i].path){
                  const file = {
                    uri  : response[i].path,
                    name : response[i].path.split('/').pop().split('#')[0].split('?')[0],
                    type : 'image/jpeg',
                  }
                    if(file) {
                          var fileName = file.name; 
                          var ext = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2); 
                          if(ext=="jpg" || ext=="png" || ext=="jpeg" || ext=="JPG" || ext=="PNG" || ext=="JPEG"){  
                            if(file){
                                RNS3
                                .put(file,s3Details)
                                .then((Data)=>{
                          //          setGallery([
                              //   ...gallery,
                              //   Data.body.postResponse.location,
                              // ]);
                              gallery.push(Data.body.postResponse.location) ; 
                              setFieldValue('images', gallery);
                              setImageLoading(false);
                                })
                                .catch((error)=>{
                                  setToast({text: 'Something went wrong.', color: 'red'});
                                  setImageLoading(false);
                                });
                            }else{       
                                setToast({text: 'File not uploaded.', color: 'red'});
                                setImageLoading(false);
                            }
                          }else{
                              setToast({text: 'Only Upload  images format (jpg,png,jpeg).', color: 'red'});
                              setImageLoading(false);
                          }
                        }
                     }    
                   }       
                  });
                  break;
                  case RESULTS.UNAVAILABLE:
                console.log(
                  'This feature is not available (on this device / in this context)',
                );
                break;
              case RESULTS.DENIED:
                console.log(
                  'The permission has not been requested / is denied but requestable',
                );
                break;
                case RESULTS.BLOCKED:
                console.log('The permission is denied and not requestable anymore');
                break;
              }
        })
        .catch(error => {
          setImageLoading(false);
          setToast({text: 'Something went wrong.', color: 'red'});
        });
    };
    const chooseFromDocument = async(props) => {
      setImageLoading(true);
      
          try {
            const response = await DocumentPicker.pickMultiple({
              type: [DocumentPicker.types.pdf,DocumentPicker.types.xls],
            });
            setModal(false);
           for (var i = 0; i<response.length; i++) {
             if(response[i].uri){
              const file = {
                uri  : response[i].uri,
                name : response[i].name,
                type : response[i].type,
              }
              console.log("file",file);
              if(file) {
                    var fileName = file.name; 
                    var ext = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2); 
                    if(ext=="pdf" || ext=="xls" || ext=="PDF" || ext=="XLS"){  
                      if(file){
                          RNS3
                          .put(file,s3Details)
                          .then((Data)=>{
                            console.log("Data",Data);
                    //          setGallery([
                        //   ...gallery,
                        //   Data.body.postResponse.location,
                        // ]);
                        gallery.push(Data.body.postResponse.location) ; 
                        setFieldValue('images', gallery);
                        setImageLoading(false);
                          })
                          .catch((error)=>{
                            console.log("error",error)
                            setToast({text: 'Something went wrong.', color: 'red'});
                            setImageLoading(false);
                          });
                      }else{       
                          setToast({text: 'File not uploaded.', color: 'red'});
                          setImageLoading(false);
                      }
                    }else{
                        setToast({text: 'Only Upload  images format (jpg,png,jpeg).', color: 'red'});
                        setImageLoading(false);
                    }
                  }
               }    
             }   
          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              // User cancelled the picker, exit any dialogs or menus and move on
            } else {
              throw err;
            }
          }
    };

    const chooseFromLibraryVideo = (openType) => {
      var openType = openType === 'openCamera' ? ImagePicker.openCamera : ImagePicker.openPicker;
      request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      )
        .then(result => {
      setModalVideo(false);
          switch (result) {
            case RESULTS.GRANTED:
              openType({
                mediaType     : 'video',
              }).then(response => {
            setVideoLoading(true);
                const file = {
                  uri  : response.path,
                  name : response.path.split('/').pop().split('#')[0].split('?')[0],
                  type : response.mime,
                }
                if(file) {
                      var fileName = file.name; 
                      var ext = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2); 
                      if(ext=="mp4" || ext=="avi" || ext=="ogv"){  
                        if(file){
                            RNS3
                            .put(file,s3Details)
                            .then((Data)=>{
                                setVideoLib([
                            ...videoLib,
                            Data.body.postResponse.location,
                          ]);
                          setFieldValue('videos', [
                            ...videoLib,
                            Data.body.postResponse.location,
                          ]);
                          setVideoLoading(false);
                            })
                            .catch((error)=>{
                              setToast({text: 'Something went wrong.', color: 'red'});
                            });
                        }else{       
                            setToast({text: 'File not uploaded.', color: 'red'});
                        }
                      }else{
                          setToast({text: 'Only Upload  videos format (mp4,avi,ogv).', color: 'red'});
                      }
                  }
              });
              break;
              case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
            case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
          }
        })
        .catch(error => {
        setToast({text: 'Something went wrong.', color: 'red'});
        });
    };
    console.log("ticketDetails",ticketDetails.statusValue);
  return (
    <React.Fragment>
      <HeaderBar navigation={navigation} showBackBtn={true} title={"Ticket Details"} />
      {!loading ? 
      <KeyboardAwareScrollView  behavior="padding" getTextInputRefs={() => { return [this._textInputRef];}}>
        <ScrollView contentContainerStyle = {commonStyle.modalView}  enabled>      
          <TicketDetails ticketDetails={ticketDetails} />
          <TouchableOpacity style={{flexDirection:'row',borderTopWidth:1,borderColor:"#ccc",paddingVertical:15}} onPress={()=>{setCollapse(!collapse)}}>
              <Text style={[commonStyle.label,{flex:0.95}]} >Ticket Tracking</Text>
              <Icon size={22}  name={collapse?'chevron-up':'chevron-down'} type='material-community' color='#333' />
          </TouchableOpacity>
          {!collapse?<StatusTracking AllStatus={AllStatus}/>:null}
          {ticketDetails.commentArray && ticketDetails.commentArray.length > 0 ?
           <TouchableOpacity style={{flexDirection:'row',borderTopWidth:1,borderColor:"#ccc",paddingVertical:15}} onPress={()=>{setCollapse1(!collapse1)}}>
              <Text style={[commonStyle.label,{flex:0.95}]} >Comments</Text>
              <Icon size={22}  name={collapse1?'chevron-up':'chevron-down'} type='material-community' color='#333' />
          </TouchableOpacity>:null}
          {!collapse1?ticketDetails.commentArray && ticketDetails.commentArray.length > 0 ?
            ticketDetails.commentArray.map((item,index)=>{
              return(
                <View style={{flex:1,padding:15,backgroundColor:"#eee",marginVertical:5}} key={index}>
                  <Text style={commonStyle.normalText}>{item.comment}</Text>
              <Text style={commonStyle.normalText}>- By {item.commentBy && item.commentBy.profile ? item.commentBy.profile.fullName : userDetails.firstName + " " +userDetails.lastName } ( {moment(item.commonAt).format('DD-MM-YYYY LT')} ) </Text>
                </View> 
              )
            })
            :[]
            :null
          }
          {attendance ?
            <React.Fragment>
            {myStatus === "Allocated" ||myStatus === "Reopen"  ?
              ticketDetails.statusValue==="Resolved" || ticketDetails.statusValue==="Closed" ?
              null
              :
              <View style={{flexDirection:"row",flex:1,justifyContent:'space-between',paddingVertical:15,borderTopWidth:1,borderColor:"#ccc",paddingVertical:15}}>
                <FormButton
                  title       = {"Accept"}
                  background  = {acceptBtn}
                  onPress     = {() =>{selectValue('Accept')}}
                />
                <FormButton
                  title       = {"Reject"}
                  background  = {rejectBtn}
                  onPress     = {() =>selectValue('Reject')}
                />
              </View> 
              :
              null
            }  
            {
                myStatus === "Assignee Accepted" ?
                  <FormButton
                    title       = {"Start"}
                    background  = {rejectBtn}
                    onPress     = {() =>selectValue('Start')}
                  />
                  :
                  null
            }      
            { 
                rejectBtn && (myStatus === "Allocated" || myStatus === "Reopen")?
                <View style={{borderTopWidth:1,borderColor:"#ccc",paddingVertical:15}}>
                  <FormInput
                      labelName     = "Reason for Rejecting Ticket"
                      placeholder   = "Write a reason..."
                      onChangeText  = {handleChange('reason')}
                      errors        = {errors}
                      name          = "reason"
                      required      = {true}
                      touched       = {touched}
                      multiline     = {true}
                      numberOfLines = {4}
                      ref={(r) => { this._textInputRef = r; }}
                  />
                  <View style={{paddingVertical:25}}>  
                    <FormButton
                      title       = {"Submit"}
                      background  = {true}
                      onPress    = {handleSubmit}
                    />
                  </View>
                </View>  
                :
                null
            }
            {myStatus === "Work Started" || myStatus === "Work In Progress" ? 
              <View style={{borderTopWidth:1,borderColor:"#ccc",paddingVertical:15,marginTop:15}}>
                <FormInput
                    labelName     = "Ticket Resolution"
                    placeholder   = "Write a remark here..."
                    onChangeText  = {handleChange('reason')}
                    errors        = {errors}
                    value         = {values.reason}
                    name          = "reason"
                    required      = {true}
                    touched       = {touched}
                    multiline     = {true}
                    numberOfLines = {4}
                />
                <ScrollView contentContainerStyle={{flexDirection:"row",paddingVertical:25}} horizontal={true}>
                  <TouchableOpacity style={{height:60,width:80,backgroundColor:"#999",justifyContent:"center",borderRadius:10,margin:15}} onPress={() => setModal(true)}>
                    <Icon name="upload" size={30} color="white" type="font-awesome"/>
                  </TouchableOpacity>
                  {gallery && gallery.length > 0 ?
                    gallery.map((item,index)=>{
                      var ext = item.slice((item.lastIndexOf(".") - 1 >>> 0) + 2);
                      console.log("ext",ext);
                      if(ext === "pdf"){
                        return(
                          <TouchableOpacity key={index} style={commonStyle.image} 
                          onPress={() => { setImageUrl(item);setImageVisible(true)}}>
                            <ImageBackground
                              style={{height: 60, width: 60}}
                              source={require('../../images/pdf.png')}
                              resizeMode={'contain'}
                            >
                            <View style={{alignItems:'flex-end'}}>
                                <Icon size={15} name='close' type='font-awesome' color='#f00'  onPress = {()=>{setDeleteDialogImg(true),setDeleteIndex(index)}} />
                            </View>
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
                            <View style={{alignItems:'flex-end'}}>
                                <Icon size={15} name='close' type='font-awesome' color='#f00'  onPress = {()=>{setDeleteDialogImg(true),setDeleteIndex(index)}} />
                            </View>
                            </ImageBackground>
                          </TouchableOpacity>
                        );
                      }else{
                      return(
                        <TouchableOpacity key={index} style={commonStyle.image} 
                        onPress={() => {
                            setImageUrl(item);
                            setImageVisible(true);
                          }}>
                          <ImageBackground
                            style={{height: 60, width: 60}}
                            source={{uri:item}}
                            resizeMode={'contain'}
                          >
                          <View style={{alignItems:'flex-end'}}>
                              <Icon size={15} name='close' type='font-awesome' color='#f00'  onPress = {()=>{setDeleteDialogImg(true),setDeleteIndex(index)}} />
                          </View>
                          </ImageBackground>
                        </TouchableOpacity>
                      );
                       }
                    })
                  :
                  []
                }
              </ScrollView> 
              <ScrollView contentContainerStyle={{}} >
                {videoLib.length === 1 ?
                  null
                  :
                  videoLoading ?
                  <TouchableOpacity style={{height:60,width:80,backgroundColor:"#999",justifyContent:"center",borderRadius:10,margin:15}} onPress={() => setModalVideo(true)}>
                    <Loading />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={{height:60,width:80,backgroundColor:"#999",justifyContent:"center",borderRadius:10,margin:15}} onPress={() => setModalVideo(true)}>
                    <Icon name="video" size={30} color="white" type="material-community"/>
                  </TouchableOpacity>
                } 
                {videoLib && videoLib.length > 0 ?
                  videoLib.map((item,index)=>{
                    return(
                      <View >
                        <Video 
                          source={{uri:item}}   // Can be a URL or a local file.
                          repeats
                          controls={true}
                          resizeMode={"stretch"}
                          style={{height:150,width:window.width}} 
                          paused={true} 
                          fullscreen={true}
                        />
                        <TouchableOpacity
                          style={{
                              position: 'absolute',
                              left:"95%",
                              zIndex:100,
                          }}>
                          <Icon size={15} name='close' type='font-awesome' color='#f00'  onPress = {()=>{setDeleteDialogVideo(true),setDeleteIndex(index)}} />
                        </TouchableOpacity> 
                      </View>  
                    );
                  })
                  :
                  []
                }
              </ScrollView>
                <View style={{flexDirection:"row",flex:1,justifyContent:'space-between',paddingVertical:15}}>
                  <FormButton
                    title       = {"WIP"}
                    background  = {wipBtn}
                    onPress     = {() =>selectValue('WIP')}
                  />
                  <FormButton
                    title       = {"Resolved"}
                    background  = {completedBtn}
                    onPress     = {() =>selectValue('Resolved')}
                  />
                </View> 
              </View>  
              :
              null
            }
            </React.Fragment>
            :
            <React.Fragment>
            <Text style={{alignSelf:"center",color:"red"}}>Please marked attendance before you proceed</Text>
              <FormButton
                title       = {"Attendance"}
                background  = {false}
                onPress     = {() =>navigation.navigate('Attendance',{'backButton':false})}
              />
            </React.Fragment>  
          }    
        </ScrollView>
        </KeyboardAwareScrollView> 
        :
        <Loading /> 
        }
       <Dialog.Container
            visible={openModal}
            container={{borderRadius: 30}}
            onDismiss={() => setModal(!openModal)}>
            <Dialog.Title style={{alignSelf: 'center'}}>
              Select an option
            </Dialog.Title>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={commonStyle.block1}
                onPress={() => chooseFromLibrary('openCamera')}>
                <Icon
                  name="camera"
                  type="material-community"
                  size={50}
                  color={'#aaa'}
                  style={{}}
                />
                <Text>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={commonStyle.block1}
                onPress={() => chooseFromLibrary('openPicker')}>
                <Icon
                  name="image"
                  type="font-awesome"
                  size={50}
                  color="#aaa"
                  style={{}}
                />
                <Text>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={commonStyle.block1}
                onPress={() => chooseFromDocument('openPicker')}>
                <Icon
                  name="file"
                  type="font-awesome"
                  size={50}
                  color="#aaa"
                  style={{}}
                />
                <Text>Document</Text>
              </TouchableOpacity>
            </View>
            <Dialog.Button label="Cancel" onPress={() => setModal(false)} />
          </Dialog.Container>
          <Dialog.Container
            visible={openModalVideo}
            container={{borderRadius: 30}}
            onDismiss={() => setModalVideo(!openModalVideo)}>
            <Dialog.Title style={{alignSelf: 'center'}}>
              Select an video
            </Dialog.Title>
                   <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={commonStyle.block1}
                onPress={() => chooseFromLibraryVideo('openCamera')}>
                <Icon
                  name="video"
                  type="material-community"
                  size={50}
                  color={'#aaa'}
                  style={{}}
                />
                <Text>Video</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={commonStyle.block1}
                onPress={() => chooseFromLibraryVideo('openPicker')}>
                <Icon
                  name="upload"
                  type="font-awesome"
                  size={50}
                  color="#aaa"
                  style={{}}
                />
                <Text>Gallery</Text>
              </TouchableOpacity>
            </View>
     
            <Dialog.Button label="Cancel" onPress={() => setModalVideo(false)} />
          </Dialog.Container>

          <Dialog.Container visible={deleteDialogImg}>
            <Dialog.Title>Are you sure?</Dialog.Title>
            <Dialog.Description>
              Once deleted, you will not be able to recover this Image!
            </Dialog.Description>
            <Dialog.Button label="Cancel" onPress={()=>setDeleteDialogImg(false)} />
            <Dialog.Button label="Delete" onPress={()=>{setDeleteDialogImg(false),gallery.splice(deleteIndex, 1)}}/>
          </Dialog.Container>
          <Dialog.Container visible={deleteDialogVideo}>
            <Dialog.Title>Are you sure?</Dialog.Title>
            <Dialog.Description>
              Once deleted, you will not be able to recover this Image!
            </Dialog.Description>
            <Dialog.Button label="Cancel" onPress={()=>setDeleteDialogVideo(false)} />
            <Dialog.Button label="Delete" onPress={()=>{setDeleteDialogVideo(false),videoLib.splice(deleteIndex, 1)}}/>
          </Dialog.Container>
           <DownloadModal
            setToast={setToast }
            url={ imageUrl }
            visible={ imageVisible }
            close={ () => setImageVisible(false) }
          />
    </React.Fragment>
  );
};
const mapStateToProps = (store)=>{
  return {
    userDetails       : store.userDetails,
    s3Details         : store.s3Details.data,
  }
};
export default connect(mapStateToProps,{})(TechnicianTicketDetails);