import React, {useState} from 'react';
import {View, ImageBackground,Dimensions,Text,StyleSheet,TouchableOpacity,ScrollView,Image} 	from 'react-native';
import {Button, Icon, Input}  	from 'react-native-elements';
import { colors, sizes }        from '../../config/styles.js';
import commonStyle              from '../../config/commonStyle.js';
import {HeaderBar}              from '../../layouts/Header/Header.js';
import {useNavigation}         	from '../../config/useNavigation.js';
import {FormInput}              from '../../components/FormInput/FormInput.js';
import {FormButton}             from '../../components/FormButton/FormButton.js';
import {FormDropDown}           from '../../components/FormDropDown/FormDropDown.js';
import {Formik, ErrorMessage}   from 'formik';
import {
  specialCharacterValidator,
  passwordValidator,
  emailValidator,
  mobileValidator,
} 								from '../../config/validators.js';
import * as Yup                 from 'yup';
import {connect, useDispatch}   from 'react-redux';
import Modal                  from "react-native-modal";

const window = Dimensions.get('window');

const ServiceRequestForConsumeBales = Yup.object().shape({
  typeOfProduct 	: Yup.string().required('This field is required'),
  modelName 		: Yup.string().required('This field is required'),
  selectAccessories	: Yup.string().required('This field is required'),
  quantity 			: Yup.string().required('This field is required'),
});


export const RequestForConsumbales = () => {
	const [btnLoading, setLoading] 	= useState(false);
	const [modal,setModal]          = useState(false);
  	const dispatch 					= useDispatch();
  	const navigation 				= useNavigation();
  	return (
  		<React.Fragment>
  			<Formik
		        onSubmit={data => {
					setLoading(true);
					let {typeOfProduct, modelName, selectAccessories, quantity} = data;
					const payload = {
					  typeOfProduct 	: typeOfProduct,
					  modelName 		: modelName,
					  selectAccessories	: selectAccessories,
					  quantity 			: quantity
					};
					setModal(true)
		        }}
		        validationSchema={ServiceRequestForConsumeBales}
		        initialValues={{
		          typeOfProduct 	  	: '',
		          modelName 			: '',
		          selectAccessories 	: '',
		          quantity       		: '',
		        }}>
		        {formProps => <FormBody btnLoading={btnLoading} {...formProps} navigation={navigation} modal={modal} setModal={setModal} />}
		      </Formik>
  			
  		</React.Fragment>
  	);
};


const FormBody = props => {
  const {
    handleChange,
    handleSubmit,
    errors,
    touched,
    btnLoading,
    setFieldValue,
    navigation,
    modal,
    setModal
  } = props;


  const images = ['../../images/cctv1.jpeg','../../images/cctv2.jpeg','../../images/cctv3.jpg','../../images/cctv4.jpeg','../../images/cctv5.jpeg']
  const issues   = [
  					{label:"Camera not working",value:"Camera not working"},
  					{label:"Recording stop",value:"Recording stop"},
  					{label:"Wire Break",value:"Wire Break"}
  				];
  const recordingLocation = [
  					{label:"Hadapsar",value:"Hadapsar"},
  					{label:"Kothrud",value:"Kothrud"},
  					{label:"Bavdhan",value:"Bavdhan"},
  					{label:"Shivajinagar",value:"Shivajinagar"},
  					{label:"Kharadi",value:"Kharadi"},
  				];
	const cameraLocation = [
  					{label:"Main Gate",value:"Main Gate"},
  					{label:"Entrance Door",value:"Entrance Door"},
  					{label:"Office",value:"Office"},
  					{label:"First Floor",value:"First Floo"},
  					{label:"Parking",value:"Parking"},
  				]  				
  return (
        
     <ImageBackground  style={commonStyle.container} source={require('../../images/Background.png')}>
		<HeaderBar navigation={navigation} showBackBtn={false} />
		<Text style={commonStyle.subHeaderText}>Request for Consumbales</Text>
    	<ScrollView >
			<View style={commonStyle.formInputBox}>
				<FormDropDown
					data            = {issues}
			        labelName       = "Type of product"
			        placeholder 	= "Type of product..."
			        onChangeText 	= {handleChange('typeOfProduct')}
			        errors 			= {errors}
			        name 			= "typeOfProduct"
			        required  		= {true}
			        touched 		= {touched}
		        	iconName     	= "cube"
		        	iconType     	= "font-awesome"
			    />
			    <FormDropDown
			    	data            = {recordingLocation}
			        labelName 		= "Model Name"
			        placeholder 	= "Model Name..."
			        onChangeText 	= {handleChange('modelName')}
			        errors 			= {errors}
			        name 			= "modelName"
			        required 		= {true}
			        touched 		= {touched}
		        	iconName     	= "cubes"
		        	iconType     	= "font-awesome"
			    />
			    <FormDropDown
			    	data            = {cameraLocation}
			        labelName 		= "Select Accessories"
			        placeholder 	= "Select Accessories..."
			        onChangeText 	= {handleChange('selectAccessories')}
			        errors 			= {errors}
			        name 			= "selectAccessories"
			        required 		= {true}
			        touched 		= {touched}
		        	iconName     	= "sitemap"
		        	iconType     	= "font-awesome"
			    />
			    <FormDropDown
			    	data            = {cameraLocation}
			        labelName 		= "Qunatity"
			        placeholder 	= "Qunatity..."
			        onChangeText  	= {handleChange('quantity')}
			        errors 			= {errors}
			        name 			= "quantity"
			        required 		= {true}
			        touched 		= {touched}
			        multiline 		= {true}
			        numberOfLines 	= {4}
			        iconName     	= "stack-overflow"
		        	iconType     	= "font-awesome"
			    />
		
			    <FormButton
			    	title={"Submit"}
			    	onPress={handleSubmit}
			    	background={true}
			    />
			</View>    
    	</ScrollView>
    	<Modal isVisible={modal}
            onBackdropPress={() => setModal(false)}
            coverScreen={true}
            hideModalContentWhileAnimating={true}
            style={{ paddingHorizontal: '5%', zIndex: 999 }}
            animationOutTiming={500}>
            <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10 }}>
              <View style={{ justifyContent: 'center', backgroundColor: colors.success, width: 50, height: 50, borderRadius: 25, overflow: 'hidden' }}>
                  <Icon size={28} name='check' type='fontAwesome5' color='#fff' style={{}} />
                </View>
                 <Text style={commonStyle.subHeaderText}>
                	Thanks for your Request!
              	</Text>
              	<Text style={commonStyle.label}>
                	Our representative will call you shortly
              	</Text>
              	<Text style={commonStyle.label}>
                	with more details.
              	</Text>
              	<Text style={[commonStyle.label,{marginTop:10}]}>
                	Your Service PRN No. is as below
              	</Text>
              	<Text style={[commonStyle.subHeaderText,{color:colors.theme}]}>
                	RQ2017PR
              	</Text>
            </View>
          </Modal>
	</ImageBackground>
  );
};
