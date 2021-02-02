import axios from 'axios';
import {Formik} from 'formik';
import React, {useState,useEffect,useRef} from 'react';
import {Text, TouchableOpacity, View, ImageBackground,StyleSheet,Dimensions,Modal} from 'react-native';
import {Icon,ButtonGroup} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import * as Yup from 'yup';
import {FormButton} from '../../components/FormButton/FormButton.js';
import {FormInput} from '../../components/FormInput/FormInput.js';
import commonStyle from '../../config/commonStyle.js';
import {useNavigation} from '../../config/useNavigation.js';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import {setUserDetails} from '../../redux/user/actions';
import {HeaderBar}                    from '../../layouts/Header/Header.js';
import {
  emailValidator,
  mobileValidator,
  passwordValidator,
  specialCharacterValidator,
} from '../../config/validators.js';
import Dialog from 'react-native-dialog';
import {withCustomerToaster} from '../../redux/AppState.js';
import { ScrollView } from '@react-navigation/native';
import {SET_PERSON_DETAILS}   from '../../redux/personDetails/types';
import { RNS3 }                 		from 'react-native-aws3';
import DateTimePickerModal          from "react-native-modal-datetime-picker";
import DatePicker from 'react-native-datepicker';
import moment from 'moment';                 
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import styles from './styles.js';
import MapView, {PROVIDER_GOOGLE,Marker} from 'react-native-maps';
import { KeyboardAwareScrollView }      from 'react-native-keyboard-aware-scroll-view';
import Geocoder from 'react-native-geocoding';
const window = Dimensions.get('window');
const EditAddressSchema = Yup.object().shape({
  address: Yup.string()
    .required('This field is required')
});

export const EditAddress = withCustomerToaster((props) => {
  const [btnLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {setToast} = props;

  const navigation = useNavigation();
  const store = useSelector((store) => ({
    personDetails: store.personDetails.data,
    userDetails  : store.userDetails,
    loading:store.loading,
    s3Details       	: store.s3Details.data,
  }));
 
  console.log("store",store.personDetails);
  return (
    <React.Fragment>
      <Formik
        onSubmit={(data) => {
          console.log("DAta",data);
          // setLoading(true);
          let {address,addressLine2,landmark,area,city,country,pincode,state,latitude,longitude,disrict} = data;
          var formValues = {
              person_id : store.personDetails._id,
              addressLine2: addressLine2,
              landmark: landmark,
              addressLine1: address,
              addressProof: [],
              city: city,
              state:state,
              country: country,
              district: disrict,
              latitude: latitude,
              longitude: longitude,
              pincode: pincode,
          };
          console.log("formValues",formValues);
          axios
            .patch('/api/personmaster/patch/addressInfo', formValues)
            .then((response) => {
              setLoading(false);
              if(response.data.updated){
                axios.get('/api/personmaster/get/one/'+store.personDetails._id)
                .then(personInfo => {
                  dispatch({
                    type: SET_PERSON_DETAILS,
                    payload: personInfo.data
                  });
                  setToast({text: "Updated Successfully", color: 'green'});
                })  
                .catch((error) => {
                  setLoading(false);
                  setToast({text: "Something went wrong.", color: 'red'});
                });
              }
                // navigation.goBack();
            })
            .catch((error) => {
              setLoading(false);
              setToast({text: "Something went wrong.", color: 'red'});
            });
        }}
        validationSchema={EditAddressSchema}
        initialValues={{
          address :store.personDetails.address && store.personDetails.address.length > 0 && store.personDetails.address[0].addressLine1 ? store.personDetails.address[0].addressLine1 : "",
          addressLine2: store.personDetails.address && store.personDetails.address.length > 0 ? store.personDetails.address[0].addressLine2 : "",
          landmark: store.personDetails.address && store.personDetails.address.length > 0 ? store.personDetails.address[0].landmark : "",
          addressProof: store.personDetails.address && store.personDetails.address.length > 0 &&  store.personDetails.address[0].addressProof && store.personDetails.address[0].addressProof.length > 0 ? store.personDetails.address[0].addressProof: [],
          city: store.personDetails.address && store.personDetails.address.length > 0 ? store.personDetails.address[0].city: "",
          state: store.personDetails.address && store.personDetails.address.length > 0 ?store.personDetails.address[0].state: "",
          country: store.personDetails.address && store.personDetails.address.length > 0 ? store.personDetails.address[0].country: "",
          district:  store.personDetails.address && store.personDetails.address.length > 0 ?store.personDetails.address[0].disrict: "",
          latitude:  store.personDetails.address && store.personDetails.address.length > 0 ?store.personDetails.address[0].latitude: "",
          longitude: store.personDetails.address && store.personDetails.address.length > 0 ? store.personDetails.address[0].longitude: "",
          pincode:store.personDetails.address && store.personDetails.address.length > 0 ? store.personDetails.address[0].pincode: ""
        }}>
        {(formProps) => <FormBody btnLoading={btnLoading} setToast={setToast} store={store} {...formProps} />}
      </Formik>
    </React.Fragment>
  );
});

const FormBody = (props) => {
  const {
    handleChange,
    handleSubmit,
    errors,
    touched,
    btnLoading,
    setFieldValue,
    values,
    setToast,
    store,
  } = props;
 
  const navigation = useNavigation();
  const [value, setValue] = useState('');
  const [coordinate, setCoordinate] = useState({latitude:values.latitude,longitude:values.longitude});
  const [address, setModal] = useState(false);

 
  console.log("value",value);
  const getMapRegion = {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    latitudeDelta: Math.abs(coordinate.latitude * 0.0001),
    longitudeDelta: Math.abs(coordinate.longitude * 0.0001) 
  };

  const addMarker=(coordinate)=>{
    console.log("coordinate",coordinate);
      axios.get("/api/projectSettings/get/GOOGLE",)
        .then((response) => {
          Geocoder.init(response.data.googleapikey);
         console.log("e.coordinate",coordinate);
         if(coordinate){
            Geocoder.from(coordinate.latitude,coordinate.longitude).then(
            response => {
              console.log("response",response);
              var details =response.results[0];
              const latlong = details.geometry.location;
              for (var i = 0; i < details.address_components.length; i++) {
                for (var b = 0; b < details.address_components[i].types.length; b++) {
                  switch (details.address_components[i].types[b]) {
                    case 'sublocality_level_2':
                    var address = details.address_components[i].long_name;
                    break;
                  case 'sublocality_level_1':
                    var area = details.address_components[i].long_name;
                    break;
                  case 'locality':
                    var city = details.address_components[i].long_name;
                    break;
                  case 'administrative_area_level_2':
                  var district = details.address_components[i].long_name;
                  break;  
                  case 'administrative_area_level_1':
                    var state = details.address_components[i].long_name;
                    break;
                  case 'country':
                    var country = details.address_components[i].long_name;
                    break;
                  case 'postal_code':
                    var pincode = details.address_components[i].long_name;
                    break;
                  }
                }
              }
                    
                setFieldValue("area",area);
                  setFieldValue("city",city);
                  setFieldValue("district",district);
                  setFieldValue("state",state);
                  setFieldValue("country",country);
                  setFieldValue("pincode",pincode);
                  setFieldValue("landmark",address);
                  setFieldValue("address",details.formatted_address);
                  setFieldValue("latitude",latlong.lat);
                  setFieldValue("longitude",latlong.lng);
                  setCoordinate({latitude:latlong.lat,longitude:latlong.lng})
            },
            error => {
              console.error("err1",error);
            }
          );}
        })
      .catch((error) =>{
          console.log("err2",error);
      })

  }

  return (
    <React.Fragment>
      <KeyboardAwareScrollView  behavior="padding"  keyboardShouldPersistTaps='always'  getTextInputRefs={() => { return [this._textInputRef];}}>
				<View style={commonStyle.modalView}>
          <FormInput
            onChangeText={handleChange('addressLine2')}
            required={true}
            placeholder="Flat/Block No."
            labelName="Flat/Block No."
            name="addressLine2"
            errors={errors}
            touched={touched}
            value={values.addressLine2}
            iconName={'address-book'}
            iconType={'font-awesome'}
          />
          <FormInput
            onChangeText={handleChange('landmark')}
            required={true}
            placeholder="landmark"
            labelName="landmark"
            name="landmark"
            errors={errors}
            touched={touched}
            value={values.landmark}
            iconName={'address-book'}
            iconType={'font-awesome'}
          />
          <FakeInput
            onAddressSelect={(data) => {
              console.log("data",data);
                setFieldValue("area",data.area);
                setFieldValue("city",data.city);
                setFieldValue("district",data.district);
                setFieldValue("state",data.state);
                setFieldValue("country",data.country);
                setFieldValue("pincode",data.pincode);
                setFieldValue("address",data.addressLine1);
                setFieldValue("latitude",data.latitude);
                setFieldValue("longitude",data.longitude);
                setCoordinate({latitude:data.latitude,longitude:data.longitude})
            }}
            required={true}
            name="address"
            placeholder={"Enter address"}
            errors={errors}
            touched={touched}
            handleSubmit={handleSubmit}
            style={{fontFamily:"Montserrat-Bold"}}
            values={values}
          />
          {coordinate.latitude!=="" ?
          <MapView
            ref={map => map = map}
            region = {getMapRegion}
            style={[{height:300,width:window.width-60,marginTop:30, alignSelf:"center",zIndex:10}]}
            provider={PROVIDER_GOOGLE}
          >
           {coordinate.latitude!==""&&<MapView.Marker
                coordinate={coordinate}
                draggable={true}
                onDragEnd={(e) =>addMarker(e.nativeEvent.coordinate)}
              />}
          </MapView>
          :
          <MapView
            ref={map => map = map}
            style={[{height:300,width:window.width-60,marginTop:30, alignSelf:"center",zIndex:10}]}
            provider={PROVIDER_GOOGLE}
          >
          </MapView>
          }
        <FormButton
          title={'Save Changes'}
          onPress={handleSubmit}
          background={true}
          loading={btnLoading}
          style={{zIndex:1,}}
        />
        </View>
        </KeyboardAwareScrollView>
    </React.Fragment>
  );
};

const FakeInput = (props) => {
  const {
    required,
    placeholder,
    onAddressSelect,
    errors,
    touched,
    name,
    values,
    handleSubmit,
  } = props;
  const [value, setValue] = useState('');
  const [address, setModal] = useState(false);
  const ref = useRef();
  useEffect(() => {
    ref.current?.setAddressText(values.address);
  }, []);
  console.log("props",props);
  const setDetails = (details) => {
    const latlong = details.geometry.location;
    setModal(false);
   
    console.log("details.address_components",details.address_components);
    for (var i = 0; i < details.address_components.length; i++) {
      for (var b = 0; b < details.address_components[i].types.length; b++) {
        switch (details.address_components[i].types[b]) {
           case 'sublocality_level_2':
          var address = details.address_components[i].long_name;
          break;
        case 'sublocality_level_1':
          var area = details.address_components[i].long_name;
          break;
        case 'locality':
          var city = details.address_components[i].long_name;
          break;
        case 'administrative_area_level_2':
        var district = details.address_components[i].long_name;
        break;  
        case 'administrative_area_level_1':
          var state = details.address_components[i].long_name;
          break;
        case 'country':
          var country = details.address_components[i].long_name;
          break;
        case 'postal_code':
          var pincode = details.address_components[i].long_name;
          break;
        }
      }
    }
    
      return onAddressSelect({
        addressLine1 : details.formatted_address,
        area,
        city,
        district,
        state,
        country,
        pincode,
        address,
        latitude:latlong.lat,
        longitude:latlong.lng,
      });
  };
  return (
    <View style={{}}>
     <TouchableOpacity onPress={() => setModal(true)}>
        <FormInput
          required={true}
          placeholder="Address."
          labelName="Address"
          name="addressLine2"
          errors={errors}
          touched={touched}
          value={values.address}
          multiline={true}
          editable={false}
        />
      </TouchableOpacity>  
      {/*<Text style={{fontSize: 12, color: 'red'}}>
        {touched[name] && errors[name] ? errors[name] : ''}
      </Text>*/}
      <Modal
        visible={address}
        animationType={'slide'}
        onDismiss={() => setModal(false)}
        onRequestClose={() => setModal(false)}>
        <View Style={commonStyle.container}>
          <View style={commonStyle.modalView}>
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={{alignItems: 'flex-start'}}>
                <Icon name="arrow-back" />
              </TouchableOpacity>
            )}
            <View style={{padding: '5%', height: window.height * 0.9}}>
              <GooglePlacesAutocomplete
                placeholder={placeholder}
                minLength={2} // minimum length of text to search
                autoFocus={false}
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                listViewDisplayed={false} // true/false/undefined
                fetchDetails={true}
                currentLocation={true}
                onChangeText={() => {}}
                enablePoweredByContainer={false}
                GoogleReverseGeocodingQuery={
                  {
                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                  }
                }
                renderDescription={(row) => row.description} // custom description render
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  setDetails(details);
                  setValue(details.formatted_address);
                }}
                getDefaultValue={() => ''}
                query={{
                  key: 'AIzaSyA4P7G_n4iRBp9flTUKoDbIBLg1vs8s300',
                }}
                styles={{
                  textInputContainer: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderTopWidth: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: '#aaa',
                    zIndex: 1000,
                  },
                  textInput: {
                    marginTop: 10,
                  },
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
