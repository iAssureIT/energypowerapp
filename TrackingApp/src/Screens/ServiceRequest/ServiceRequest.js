import React, {useState,useEffect}         from 'react';
import {View, ImageBackground,Dimensions,Text,StyleSheet,TouchableOpacity,ScrollView,Image} 	from 'react-native';
import {Button, Icon, Input}  	from 'react-native-elements';
import { colors, sizes }        from '../../config/styles.js';
import commonStyle              from '../../config/commonStyle.js';
import {HeaderBar}              from '../../layouts/Header/Header.js';
import {useNavigation}         	from '../../config/useNavigation.js';
import {FormInput}              from '../../components/FormInput/FormInput.js';
import {FormButton}             from '../../components/FormButton/FormButton.js';
import VideoPlayer             from '../../components/VideoPlayer/VideoPlayer.js';
import {FormDropDown}           from '../../components/FormDropDown/FormDropDown.js';
import {Formik, ErrorMessage}   from 'formik';
import {
  specialCharacterValidator,
  passwordValidator,
  emailValidator,
  mobileValidator,
} 										from '../../config/validators.js';
import * as Yup                 		from 'yup';
import {useSelector, useDispatch}   	from 'react-redux';
import Dialog 							from 'react-native-dialog';
import ImagePicker              		from 'react-native-image-crop-picker';
import {PERMISSIONS, request, RESULTS} 	from 'react-native-permissions';
import ImageView 						from 'react-native-image-view';
import {withCustomerToaster} 			from '../../redux/AppState.js';
import axios              				from 'axios';
import { getClientTicketsList } 		from '../../redux/ticketList/actions';
import { RNS3 }                 		from 'react-native-aws3';
import { KeyboardAwareScrollView }      from 'react-native-keyboard-aware-scroll-view';
import HTML 							from 'react-native-render-html';
// import CKEditor from 'react-native-ckeditor';
import { WebView } from 'react-native-webview';
import Video 							from 'react-native-video';
import {
    SET_EQUIPMENT_LOCATIONS}               from '../../redux/list/types';
import Loading                 	 		from '../../layouts/Loading/Loading.js';

const window = Dimensions.get('window');

const ServiceRequestSchema = Yup.object().shape({
  department 		: Yup.string().required('This field is required'),
//   project 			: Yup.string().required('This field is required'),
  site 				: Yup.string().required('This field is required'),
  typeOfIssue 		: Yup.string().required('This field is required'),
  projectLocation : Yup.string().required('This field is required'),
//   equipmentLocation 	: Yup.string().required('This field is required'),
  description 		: Yup.string().required('This field is required'),
});

export const ServiceRequest = withCustomerToaster((props) => {
	const [btnLoading, setLoading] 	= useState(false);
  	const dispatch 					= useDispatch();
  	const navigation 				= useNavigation();
  	const store = useSelector(store => ({
	    userDetails         : store.userDetails,
		clientDetails 		: store.clientDetails,
	}));
  	const {setToast} = props;
  	const {clientDetails,userDetails} = store;
  	const [gallery, setGallery] 			= useState([]);
  	const [videoLib, setVideoLib] 			= useState([]);
  	const ticket = navigation.getParam('ticketDetails',null)
  	return (
  		<React.Fragment>
  			<Formik
		        onSubmit={(values,fun) => {
					console.log("values",values);
              		fun.resetForm(values);
					setLoading(true);
					let {department,project,site,typeOfIssue, projectLocation,projectLocation_id,equipmentLocation_id, equipmentLocation, description, equipmentPath,images,videos} = values;
					const payload = {
				      client_id             :  clientDetails.data._id,
				      clientName            :  clientDetails.data.companyName,
				      site                  :  site.split("-")[0],
				      department            :  department.split("-")[0],
				      project               :  department.split("-")[1],
				      contactPerson         :  userDetails.firstName + " " + userDetails.lastName ,
     				  contactPerson_id      :  userDetails.person_id,
				      projectLocationName :  projectLocation.split("-")[0], 
				      projectLocation_id  :  projectLocation_id!=='' ? projectLocation_id :projectLocation.split("-")[1], 
				      equipmentLocationName    :  equipmentLocation.split("-")[0], 
				      equipmentLocation_id     :  equipmentLocation_id!=='' ? equipmentLocation_id: equipmentLocation.split("-")[1], 
				      description           :  description,
				      images                :  images,
				      typeOfIssue           :  typeOfIssue,
				      videos                :  videos,
				      status                :   {
				                                  value : "New",
				                                  statusBy : userDetails.user_id,
				                                  statusAt : new Date()
				                                }					
					};
					console.log("payload",payload);
					if(ticket){
						axios.patch('/api/tickets/update/'+ticket._id,payload)
				      	.then((response)=>{
	                		setToast({text: "Ticket details updated", color:'green'});
	                		dispatch(getClientTicketsList(clientDetails.data._id,"Pending"))
							navigation.navigate('ListOfClientTickets',{title:"Pending Request"});
							setLoading(false);
							setGallery([]);
							setVideoLib([]);
					     })
				      	.catch((error)=>{
	              			setToast({text: 'Something went wrong.', color: 'red'});
				   		}); 
					}else{
						axios.post('/api/tickets/post', payload)
				      	.then((response)=>{
	                		setToast({text: response.data.message, color:'green'});
	                		dispatch(getClientTicketsList(clientDetails.data._id,"Pending"))
							navigation.navigate('ListOfClientTickets',{title:"Pending Request"});
							setLoading(false);
							setGallery([]);
							setVideoLib([]);
					     })
				      	.catch((error)=>{
	              			setToast({text: 'Something went wrong.', color: 'red'});
				   		}); 
					}
					 	
		        }}
		        validationSchema={ServiceRequestSchema}
		       
		        initialValues={{
		        	department        	: ticket ? ticket.department :'',
		        	// project             : ticket ? ticket.project :'',
		        	site                : ticket ? ticket.site :'',
		          	typeOfIssue 	  	: ticket ? ticket.typeOfIssue :'',
		          	projectLocation 	: ticket ? ticket.projectLocationName : "",
		          	projectLocation_id : ticket ? ticket.projectLocation_id : "",
		          	equipmentLocation_id   : ticket ? ticket.equipmentLocation_id : "",
		          	equipmentLocation 		: ticket ? ticket.equipmentLocationName : "",
		          	description       	: ticket ? ticket.description :'',
		          	images              : ticket ? ticket.images :[],
		          	videos              : ticket ? ticket.videos :[],

		        }}>
		        {formProps => 
		        	<FormBody 
	    				btnLoading		=	{btnLoading} 
	    				navigation 		= 	{navigation} 
	    				setToast        =   {setToast}
	    				gallery={gallery}
				        setGallery={setGallery}
				        videoLib={videoLib}
				        setVideoLib={setVideoLib}
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
    setToast,
    values,
    gallery,
    setGallery,
    videoLib,
    setVideoLib
  } = props;
    const store = useSelector(store => ({
		clientDetails 		: store.clientDetails,
		list 				: store.list,
		s3Details       	: store.s3Details.data,
	}));
	console.log("list store",store);
  	const {list,clientDetails,s3Details} = store;

	var issues				=  [];
  	var projectLocations 	=  [];
	
  	var departments			=  [];		
  	var projects		    =  [];		
  	var siteArray	        =  [];
  	const dispatch 					= useDispatch();
  	if(!list.loading && !clientDetails.loading && clientDetails.data[0]!==''){
  		 issues				    = list.typeOfIssue && list.typeOfIssue.length > 0 ? list.typeOfIssue.map((a,i)=>{return{label  : a.taskType,value  : a.taskType}}) : [];
  		 projectLocations 	= list.projectLocations && list.projectLocations.length > 0 ? list.projectLocations.map((a,i)=>{return{label  : a.locationName,value  : a.locationName+"-"+a._id}}) : [];
  		 departments			= clientDetails.data.departments && clientDetails.data.departments.length > 0 ?clientDetails.data.departments.map((a,i)=>{return{label  : a.departmentName+" - "+a.projectName,value  : a.departmentName+"-"+a.projectName}}) : [];		
  		 projects			    = clientDetails.data.departments && clientDetails.data.departments.length > 0 ? clientDetails.data.departments.map((a,i)=>{return{label  : a.projectName,value  : a.projectName+"-"+a._id}}) : [];		
  		 siteArray				= clientDetails.data.locations && clientDetails.data.locations.length > 0 ? clientDetails.data.locations.map((a,i)=>{return{label  : a.addressLine1,value  : a.addressLine1+"-"+a._id,department:a.department}}): [];		
  	}
 	departments = [...new Set(departments.map(({label}) => label))].map(e => departments.find(({label}) => label == e));	
  	const [image, setImage] 				= useState('');
  	const [imageLoading, setImageLoading] 	= useState(false);
  	const [videoLoading, setVideoLoading] 	= useState(false);
  	const [video, setVideo] 				= useState('');

  	const [equipmentLocations, setEquipmentLoaction] 		= useState([]);
  	const [openModal, setModal] 					= useState(false);
  	const [openModalVideo, setModalVideo] 			= useState(false);
  	const [imageVisible, setImageVisible] 			= useState(false);
  	const [deleteDialogImg,setDeleteDialogImg]    	= useState(false);
  	const [deleteDialogVideo,setDeleteDialogVideo]  = useState(false);
  	const [deleteIndex,setDeleteIndex]      		= useState(false);
  	const [sites,setSites]      		            = useState([]);

  	const getEquipmentLoc=(project_id)=>{
  		
  		axios.get('api/equipmentlocation/get/list/project/'+project_id.split("-")[1]) 
	    .then(res => {
			console.log("res===>",res);
	      var equipmentList = res.data && res.data.length > 0 ? res.data.map((a,i)=>{return{label  : a.locationName,value  : a.locationName+"-"+a._id}}):[];
	      setEquipmentLoaction(equipmentList);
	    })
	    .catch(err => {
	      dispatch({
	        type: SET_LOADING,
	        payload: false,
	      });
	    });
  	}

  	 const recFunction = (e) => {
	    getEquipmentLoc(e);
	    setFieldValue('projectLocation',e)
	    setFieldValue('equipmentLocation_id',"")
	    setFieldValue('equipmentLocation',"")
  	};
	  
	  const departmentFun = (e) => {
	    getEquipmentLoc(e);
		setFieldValue('department',e)
		var department = e.split("-")[0]+" - "+e.split("-")[1];
		var siteFilterArray = siteArray.filter(a=> a.department === department);
		setSites(siteFilterArray);
		setFieldValue('site',"")
  	};

	const chooseFromLibrary = (props) => {
	    var openType = props === 'openEquipment' ? ImagePicker.openEquipment : ImagePicker.openPicker;
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
		            response =  props === 'openEquipment' ? [response] : response;
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
				                  //         	setGallery([
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
	      	console.log("err",error)
	      	setImageLoading(false);
		    setToast({text: 'Something went wrong.', color: 'red'});
	      });
	  };

	  const chooseFromLibraryVideo = (openType) => {
	    var openType = openType === 'openEquipment' ? ImagePicker.openEquipment : ImagePicker.openPicker;
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

  return(
  	<React.Fragment>
		<HeaderBar navigation={navigation} showBackBtn={true} title="New Support Ticket" />
	  	<KeyboardAwareScrollView  behavior="padding"  keyboardShouldPersistTaps='always'  getTextInputRefs={() => { return [this._textInputRef];}}>
	    	<ScrollView contentContainerStyle={commonStyle.container}>
				<View style={commonStyle.modalView}>
					<FormDropDown
						data            = {departments}
				        labelName       = "Department & Project"
				        placeholder 	= "Select department..."
				        onChangeText 	= {departmentFun}
				        errors 			= {errors}
				        name 			= "department"
				        value           = {values.department}
				        required  		= {true}
				        touched 		= {touched}
			        	iconName     	= "building"
			        	iconType     	= "font-awesome"
				    />
				    {/* <FormDropDown
						data            = {projects}
				        labelName       = "Project Name"
				        placeholder 	= "Select project..."
				        onChangeText 	= {handleChange('project')}
				        errors 			= {errors}
				        name 			= "project"
				        value           = {values.project}
				        required  		= {true}
				        touched 		= {touched}
			        	iconName     	= "sitemap"
			        	iconType     	= "font-awesome"
				    /> */}
				    <FormDropDown
						data            = {sites}
				        labelName       = "Location Name"
				        placeholder 	= "Select location..."
				        onChangeText 	= {handleChange('site')}
				        errors 			= {errors}
				        name 			= "site"
				        value           = {values.site}
				        required  		= {true}
				        touched 		= {touched}
			        	iconName     	= "location"
			        	iconType     	= "entypo"
				    />
				    <FormDropDown
						data            = {issues}
				        labelName       = "Type of issue"
				        placeholder 	= "Type of issue..."
				        onChangeText 	= {handleChange('typeOfIssue')}
				        errors 			= {errors}
				        name 			= "typeOfIssue"
				        value           = {values.typeOfIssue}
				        required  		= {true}
				        touched 		= {touched}
			        	iconName     	= "exclamation-circle"
			        	iconType     	= "font-awesome"
				    />
				    <FormDropDown
				    	data            = {projectLocations}
				        labelName 		= "Project Location"
				        placeholder 	= "Project Location..."
				        onChangeText 	= {recFunction}
				        errors 			= {errors}
				        name 			= "projectLocation"
				        value           = {values.projectLocation}
				        required 		= {true}
				        touched 		= {touched}
			        	iconName     	= "location"
			        	iconType     	= "entypo"
				    />
				    <FormDropDown
				    	data            = {equipmentLocations}
				        labelName 		= "Equipment Location"
				        placeholder 	= "Equipment Location..."
				        onChangeText 	= {handleChange('equipmentLocation')}
				        errors 			= {errors}
				        name 			= "equipmentLocation"
				        value           = {values.equipmentLocation}
				        // required 		= {true}
				        touched 		= {touched}
			        	iconName     	= "cogs"
			        	iconType     	= "font-awesome"
				    />
				    <FormInput
				        labelName 		= "Description"
				        placeholder 	= "Description..."
				        onChangeText  	= {handleChange('description')}
				        value           = {values.description}
				        errors 			= {errors}
				        name 			= "description"
				        required 		= {true}
				        touched 		= {touched}
				        multiline 		= {true}
				        numberOfLines 	= {4}
				    />
				    <View style={{flexDirection:"row",marginTop:25}}>
				    	{imageLoading ?
				    		<TouchableOpacity style={{height:60,width:80,backgroundColor:"#999",justifyContent:"center",borderRadius:10,margin:15}}>
					    		<Loading />
					    	</TouchableOpacity>
					    	:
					    	<TouchableOpacity style={{height:60,width:80,backgroundColor:"#999",justifyContent:"center",borderRadius:10,margin:15}} onPress={() => setModal(true)}>
					    		<Icon name="camera" size={30} color="white" type="font-awesome"/>
					    	</TouchableOpacity>
					    }
					    <ScrollView  horizontal={true}>
					    		
					    	{gallery && gallery.length > 0 ?
					    		gallery.map((item,index)=>{
					    			return(
					    				<TouchableOpacity key={index} style={commonStyle.image} 
					    				onPress={() => {
						                    setImage([
						                      {
						                        source: {
						                          uri: item,
						                        },
						                        title: 'Photos',
						                        width: window.width,
						                        height: window.height,
						                      },
						                    ]);
						                    setImageVisible(true);
						                  }}>
						    				<ImageBackground
						    					style={{height: 60, width: 60}}
								   				source={{uri:item}}
								   				resizeMode={'cover'}>
								   				<View style={{alignItems:'flex-end'}}>
					                            	<Icon size={20} name='close' type='font-awesome' color='#f00'  onPress = {()=>{setDeleteDialogImg(true),setDeleteIndex(index)}} />
					                          </View>
								    		</ImageBackground>
								    		
					    				</TouchableOpacity>
					    			);
					    		})
					    		:
					    		[]
					    	}
					    	
					    </ScrollView>
					</View>    
				    <ScrollView contentContainerStyle={{minHeight:100}} >
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
				                            style={{height:200,width:window.width}} 
				                            paused={true} 
				                            fullscreen={true}
				                          />
										<TouchableOpacity
										    style={{
										        position: 'absolute',
										        left:"95%",
										        zIndex:100,
										    }}>
										    <Icon size={20} name='close' type='font-awesome' color='#f00'  onPress = {()=>{setDeleteDialogVideo(true),setDeleteIndex(index)}} />
										</TouchableOpacity> 
				                    </View>      
			                          
				    			);
				    		})
				    		:
				    		[]
				    	}
				    </ScrollView>
				    <FormButton
				    	title={"Submit"}
				    	onPress={handleSubmit}
				    	background={true}
				    	loading={btnLoading}
				    />
				</View>    
	    	</ScrollView>
	    	<Dialog.Container
		        visible={openModal}
		        container={{borderRadius: 30}}
		        onDismiss={() => setModal(!openModal)}>
		        <Dialog.Title style={{alignSelf: 'center'}}>
		          Select an image
		        </Dialog.Title>
		        <View style={{flexDirection: 'row'}}>
		          <TouchableOpacity
		            style={commonStyle.block1}
		            onPress={() => chooseFromLibrary('openEquipment')}>
		            <Icon
		              name="equipment"
		              type="material-community"
		              size={50}
		              color={'#aaa'}
		              style={{}}
		            />
		            <Text>Equipment</Text>
		          </TouchableOpacity>
		          <TouchableOpacity
		            style={commonStyle.block1}
		            onPress={() => chooseFromLibrary('openPicker',)}>
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
		            onPress={() => chooseFromLibraryVideo('openEquipment')}>
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
		     {imageVisible ? (
	        <ImageView
	          images={image}
	          imageIndex={0}
	          isVisible={imageVisible}
	          onClose={() => setImageVisible(false)}
	        />
	      ) : null} 
		</KeyboardAwareScrollView>
	</React.Fragment>		
  );
};
;

