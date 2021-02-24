import React, {useState} from 'react';
import {View, ImageBackground,Image,Dimensions,Text,StyleSheet,TouchableOpacity,ScrollView,Linking} 	from 'react-native';
import {Button, Icon, AirbnbRating,Rating}  	from 'react-native-elements';
import { colors, sizes }        from '../../config/styles.js';
import commonStyle              from '../../config/commonStyle.js';
import {HeaderBar}              from '../../layouts/Header/Header.js';
import {useNavigation}         	from '../../config/useNavigation.js';
import * as Yup                 from 'yup';
import {connect, useDispatch}   from 'react-redux';
import { Menu, MenuOptions,
         MenuOption, MenuTrigger } from 'react-native-popup-menu';
import {FormButton}             from '../../components/FormButton/FormButton.js';
import {FormInput}              from '../../components/FormInput/FormInput.js';
import {Formik, ErrorMessage}   from 'formik';
import axios                    from 'axios';
import { getClientTicketsList }  from '../../redux/ticketList/actions';
import ImageView                from 'react-native-image-view';
import Dialog                   from 'react-native-dialog';
import ImagePicker              from 'react-native-image-crop-picker';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import { RNS3 }                 from 'react-native-aws3';
import TicketDetails          from './TicketDetails.js'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import StatusTracking           from './StatusTracking.js'
import {withCustomerToaster}    from '../../redux/AppState.js';
import {getClientDasboardCount} from '../../redux/clientDashboardCount/actions';
import DocumentPicker from 'react-native-document-picker';
import {DownloadModal}              from '../../components/DonloadModal/DownloadModal.js';

import moment from 'moment';

const window = Dimensions.get('window');

const TicketDetailsSchema = Yup.object().shape({
  comment: Yup.string().required(),
  status: Yup.string().notRequired(),
  reason: Yup.string().notRequired()
  .when('status', {
  is: (val) => val === "Reopen",
  then: Yup.string().required('This field is required'),
  otherwise: Yup.string().notRequired()
  })
});

const ClientTicketDetails = withCustomerToaster((props) => {
  const {setToast} = props;
  const [btnLoading, setLoading]  = useState(false);
    const dispatch          = useDispatch();
    const navigation        = useNavigation();
    const ticketDetails     = navigation.getParam('ticketDetails');
    const AllStatus         = ticketDetails.status;
    return (
      <React.Fragment>
        <Formik
            onSubmit={data => {
              setLoading(true);
              let {review, reason, status, rating,images,comment} = data;
              console.log("data",data);
              if(status === "Reopen"){
                  if(reason === undefined || reason ==="" ){
                      return false;
                  }
                }  
              let payload ={};
              if(status === "Closed"){
                 payload = {
                    ticket_id :ticketDetails._id,
                    status    : {
                                  value    : status,
                                  statusBy : props.userDetails.user_id,
                                  review   : review,
                                  rating   : rating, 
                                  statusAt : new Date(),     
                                },
                    updatedBy : props.userDetails.user_id            
                };
                axios.patch('/api/tickets/patch/status', payload)
                .then((response)=>{
                    dispatch(getClientTicketsList(props.userDetails.company_id,"Pending"))
                    dispatch(getClientDasboardCount(props.userDetails.company_id));
                    var sendData = {
                      "event": "Event10",  //Event Name
                      "company_id": ticketDetails.client_id, //company_id(ref:entitymaster)
                      "otherAdminRole":'client',
                      "variables": {
                        'Username' : props.userDetails.firstName + " "+props.userDetails.lastName,
                        'TicketId': ticketDetails.ticketId,
                        'CompanyName': ticketDetails.clientName,
                        'RaisedBy' :ticketDetails.contactPerson,
                        'TypeOfIssue': ticketDetails.typeOfIssue,
                        'ClosedDate': moment().format("DD/MM/YYYY"),
                      }
                    }
                    console.log("sendData",sendData);
                    axios.post('/api/masternotifications/post/sendNotification', sendData)
                    .then((res) => {
                    console.log('sendDataToUser in result==>>>', res.data)
                    })
                    navigation.navigate('ListOfClientTickets',);
                    
                })
                .catch((error)=>{
                    setToast({text: 'Something went wrong.', color: 'red'});
                });
              }else if(status === "Reopen"){
                payload = {
                    ticket_id :ticketDetails._id,
                    status    : {
                                  images    : images ? images : [],
                                  value    : status,
                                  statusBy : props.userDetails.user_id,
                                  remark   : reason,
                                  statusAt : new Date(),     
                                },
                    updatedBy : props.userDetails.user_id
                };
                axios.patch('/api/tickets/patch/reopen_ticket', payload)
                .then((response)=>{
                    dispatch(getClientTicketsList(props.userDetails.company_id,"Pending"))
                    dispatch(getClientDasboardCount(props.userDetails.company_id)); var sendData = {
                      "event": "Event8",  //Event Name
                      "company_id": ticketDetails.client_id, //company_id(ref:entitymaster)
                      "otherAdminRole":'client',
                      "variables": {
                        'Username' : props.userDetails.firstName + " "+props.userDetails.lastName,
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
                    .catch((error)=>{
                      console.log("error",error)
                  });
                    navigation.navigate('ListOfClientTickets',);
                })
                .catch((error)=>{
                  console.log("error",error)
                    setToast({text: 'Something went wrong.', color: 'red'});
                });
              }else if(status === "Paid Service Approved" || status === "Paid Service Rejected"){
                payload = {
                    ticket_id :ticketDetails._id,
                    status    : {
                                  value    : status,
                                  statusBy : props.userDetails.user_id,
                                  statusAt : new Date(),     
                                },
                    updatedBy : props.userDetails.user_id
                };
                  axios.patch('/api/tickets/patch/status', payload)
                  .then((response)=>{
                      dispatch(getClientTicketsList(props.userDetails.company_id,"Pending"))
                      navigation.navigate('ListOfClientTickets',"Pending");
                      dispatch(getClientDasboardCount(props.userDetails.company_id));
                  })
                  .catch((error)=>{
                      setToast({text: 'Something went wrong.', color: 'red'});
                  });  
              }else if(status === "Add_Comment"){
                payload = {
                  ticket_id :ticketDetails._id,
                  comment   :  comment,
                  updatedBy : props.userDetails.user_id
                };
                console.log("payload",payload);
                  // axios.patch('/api/tickets/patch/comment', payload)
                  // .then((response)=>{
                  //     dispatch(getClientTicketsList(props.userDetails.company_id,"Pending"))
                  //     navigation.navigate('ListOfClientTickets',"Pending");
                  //     dispatch(getClientDasboardCount(props.userDetails.company_id));
                  // })
                  // .catch((error)=>{
                  //     setToast({text: 'Something went wrong.', color: 'red'});
                  // });  
              
              }
            }}
            validationSchema={TicketDetailsSchema}
            initialValues={{
              review       : '',
              reason       : '',
              comment      : ''
            }}>
            {formProps => 
              <FormBody 
                btnLoading={btnLoading}  
                ticketDetails={ticketDetails} 
                navigation={navigation} 
                s3Details={props.s3Details}
                AllStatus={AllStatus}
                setToast={setToast}
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
    navigation,
    ticketDetails,
    AllStatus,
    s3Details,
    setToast
  } = props;

  const [ClosedBtn, ClosedSelected]   = useState(false);
  const [reopenBtn, reopenSelected] = useState(false);
  const [imageVisible, setImageVisible]   = useState(false);
  const [image, setImage]         = useState([]);
  const [openModal, setModal]       = useState(false);
  const [gallery, setGallery]       = useState([]);
  const [imageLoading, setImageLoading]   = useState(false);
  const [deleteDialogImg,setDeleteDialogImg]  = useState(false);
  const [deleteIndex,setDeleteIndex]          = useState(false);
  const [collapse,setCollapse]                = useState(true);
  const [imageUrl, setImageUrl]   = useState('');

  const selectValue = props =>{
      if(props==="Closed"){
        ClosedSelected(true)
        setFieldValue('status','Closed')
        reopenSelected(false)
    }else if(props==="Reopen"){
        ClosedSelected(false)
        setFieldValue('status','Reopen')
        reopenSelected(true)
    }else if(props==="Paid Service Approved" || props==="Paid Service Rejected"){
      setFieldValue('status',props)
      handleSubmit();
    }else if(props==="Add_Comment"){
      setFieldValue('status',props)
      handleSubmit();
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


  return (
    <React.Fragment>
      <HeaderBar navigation={navigation} showBackBtn={true} title={"Ticket Details"} />
      <KeyboardAwareScrollView  behavior="padding" getTextInputRefs={() => { return [this._textInputRef];}}>
    		<View style={{alignItems:"center",margin:10,flexDirection:'row'}}>
          <View style={{flex:0.9,justifyContent:"center"}}>  
          </View>
         {/* <Menu style={[{alignSelf:"flex-end",flex:0.05},commonStyle.subHeaderText]}>
            <MenuTrigger>
            <Icon name='dots-three-vertical' type='entypo' size={18} />
          </MenuTrigger>
            <MenuOptions >
                  <MenuOption onSelect={()=>{navigation.navigate('ServiceRequest',{ticketDetails:ticketDetails})}} text="Edit Ticket" />
                  <MenuOption onSelect={{}}  text="Delete" />
          </MenuOptions>
        </Menu>*/}
       </View>   
      	<ScrollView style = {commonStyle.modalView}>
          <TicketDetails ticketDetails={ticketDetails} />
          <TouchableOpacity style={{flexDirection:'row',borderTopWidth:1,borderColor:"#ccc",paddingVertical:15}} onPress={()=>{setCollapse(!collapse)}}>
              <Text style={[commonStyle.label,{flex:0.95}]} >Ticket Tracking</Text>
              <Icon size={22}  name={collapse?'chevron-up':'chevron-down'} type='material-community' color='#333' />
          </TouchableOpacity>
          {!collapse?<StatusTracking AllStatus={AllStatus}/>:null}
          {ticketDetails.statusValue === "Paid Service Request" ?
            <View style={{borderTopWidth:1,borderColor:"#ccc",paddingVertical:15}}> 
              <View style={{height:50,justifyContent:"center",alignItems:"center",borderWidth:1,borderColor:"#ccc"}}> 
                <Text style={{alignSelf:"center",fontFamily:"MontSerrat-Bold"}}>Paid Service Request ₹ {ticketDetails.cost}</Text>
              </View>
              <View style={{flexDirection:"row",flex:1,justifyContent:'space-between'}}>
                <FormButton
                  title       = {"Approve"}
                  background  = {ClosedBtn}
                  onPress     = {() =>selectValue('Paid Service Approved')}
                />
                <FormButton
                  title       = {"Reject"}
                  background  = {reopenBtn}
                  onPress     = {() =>selectValue('Paid Service Rejected')}
                />
              </View> 
            </View>  
            :
            null
          } 
          {ticketDetails.statusValue === "Work Started" || ticketDetails.statusValue === "Work In Progress" &&
          <View>
            <View style={{paddingVertical:15}}>
              <FormInput
                labelName     = "Comment"
                placeholder   = "Write a comment here..."
                onChangeText  = {handleChange('comment')}
                errors        = {errors}
                name          = "comment"
                required      = {true}
                touched       = {touched}
                multiline     = {true}
                numberOfLines = {4}
              />
            
            </View>
            <View style={{paddingVertical:15}}>
            <FormButton
                title       = {"Submit"}
                background  = {ClosedBtn}
                onPress     = {() =>selectValue('Add_Comment')}
              />
            </View> 
          </View>}
          {ticketDetails.statusValue === "Resolved" || ticketDetails.statusValue === "Reopen" ?  
            <View style={{flexDirection:"row",flex:1,justifyContent:'space-between',borderTopWidth:1,borderColor:"#ccc",paddingVertical:15}}>
              <FormButton
                title       = {"Closed"}
                background  = {ClosedBtn}
                onPress     = {() =>selectValue('Closed')}
              />
              <FormButton
                title       = {"Reopen"}
                background  = {reopenBtn}
                onPress     = {() =>selectValue('Reopen')}
              />
            </View> 
            :
            null
          }  
          {
              ClosedBtn ?
              <View style={{borderTopWidth:1,borderColor:"#ccc",paddingVertical:15}}>
                <Text style={commonStyle.label}>Feedback</Text>
                <AirbnbRating 
                  defaultRating={0}
                  size={30}
                  onFinishRating={(rating)=>setFieldValue('rating',rating)}
                />
        
                <FormInput
                    labelName     = "Review"
                    placeholder   = "Write a review..."
                    onChangeText  = {handleChange('review')}
                    errors        = {errors}
                    name          = "review"
                    required      = {false}
                    touched       = {touched}
                    multiline     = {true}
                    numberOfLines = {4}
                />
                
              </View>  
              :
              reopenBtn ?
              <View>
                <FormInput
                    labelName     = "Reason for Reopening Tickets"
                    placeholder   = "Write a reason..."
                    onChangeText  = {handleChange('reason')}
                    errors        = {errors}
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
                    if(ext === "pdf" || ext === "PDF"){
                      return(
                        <TouchableOpacity key={index} style={commonStyle.image} 
                        onPress={() => { setImageUrl(item),setImageVisible(true)}}>
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
                    }else if(ext === "xls" || ext === "XLS"){
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
                              <Icon size={20} name='close' type='font-awesome' color='#f00'  onPress = {()=>{setDeleteDialogImg(true),setDeleteIndex(index)}} />
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
              </View>  
              :
              null
          }  
          {ClosedBtn || reopenBtn ?
            <View style={{paddingVertical:15}}>  
              <FormButton
                title       = {"Submit"}
                onPress     = {handleSubmit}
                background  = {true}
              />
            </View>  
            :
            null
          }  
     		</ScrollView>
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
           <Dialog.Container visible={deleteDialogImg}>
            <Dialog.Title>Are you sure?</Dialog.Title>
            <Dialog.Description>
              Once deleted, you will not be able to recover this Image!
            </Dialog.Description>
            <Dialog.Button label="Cancel" onPress={()=>setDeleteDialogImg(false)} />
            <Dialog.Button label="Delete" onPress={()=>{setDeleteDialogImg(false),gallery.splice(deleteIndex, 1)}}/>
          </Dialog.Container>
          <DownloadModal
            setToast={setToast }
            url={ imageUrl }
            visible={ imageVisible }
            close={ () => setImageVisible(false) }
          />
      </KeyboardAwareScrollView>  
    </React.Fragment>
  );
};
const mapStateToProps = (store)=>{
  return {
    userDetails       : store.userDetails,
    s3Details         : store.s3Details.data,
  }
};
export default connect(mapStateToProps,{})(ClientTicketDetails);