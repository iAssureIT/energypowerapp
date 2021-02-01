import React , {useState,useEffect} from 'react';
import {View, ImageBackground,Dimensions,Text,StyleSheet,TouchableOpacity}  from 'react-native';
import {Button, Icon, Input}    from 'react-native-elements';
import { colors, sizes }        from '../../config/styles.js';
import commonStyle              from '../../config/commonStyle.js';
import {HeaderBar}              from '../../layouts/Header/Header.js';
import {useNavigation}          from '../../config/useNavigation.js';
import {connect, useSelector,useDispatch}   from 'react-redux';
import {CurrentTime}                 from './CurrentTime.js';
import {FormButton}             from '../../components/FormButton/FormButton.js';
import { request,check,PERMISSIONS,RESULTS }                    from 'react-native-permissions';
import {SET_STARTING_COORDINATES} from '../../redux/attendance/types';
import Geolocation                                              from 'react-native-geolocation-service';
import MapView, {PROVIDER_GOOGLE,Marker} from 'react-native-maps';
import axios from 'axios';
import Loading                              from '../../layouts/Loading/Loading.js';
import Dialog                               from "react-native-dialog";
import moment from 'moment';
const window = Dimensions.get('window');

 export const FromLocation = (props) => {
 	const {coordinates} = props;
 	const store = useSelector(store => ({
		userDetails     : store.userDetails,
		clientDetails   : store.clientDetails,
		dashboardCount  : store.techDashboardCount.data,
		attendance      : store.attendance,
	}));
 	const getMapRegion ={
	    latitude: coordinates.latitude,
	    longitude: coordinates.longitude,
	    latitudeDelta: coordinates.latitude/10000,
	    longitudeDelta:coordinates.longitude/10000
  };
 	console.log("getMapRegion",getMapRegion);
 	return(
 		<MapView
            ref={map => map = map}
            initialRegion={getMapRegion}
            style={[{width:window.width,height:window.height}]}
            provider={PROVIDER_GOOGLE}
          >
            <MapView.Marker
                coordinate={coordinates}
              />
            
          </MapView>
 	)
};

