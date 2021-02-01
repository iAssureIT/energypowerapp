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
          TextInput
        } from 'react-native';

import axios                                                    from 'axios';
import styles                                                   from './styles.js';
import {HeaderBar}                    from '../../layouts/Header/Header.js';
import { Header, Icon, Button  }                                from 'react-native-elements';
import {colors,sizes}                                           from '../../config/styles.js';
import AsyncStorage                                             from '@react-native-community/async-storage';
import Loading                                                  from '../../layouts/Loading/Loading.js';
import {EmployeeProfileTabView}                                   from './EmployeeProfileTabView.js'
import { connect }                                              from 'react-redux';
import {useNavigation}                                           from '../../config/useNavigation.js';
import { bindActionCreators }                                   from 'redux';
// import { fgetProfileDetails }                                    from '../../actions/index.js';

export const EmployeeProfile = (props) => {
    const navigation = useNavigation();

      return(
        <React.Fragment>
          <HeaderBar navigation={navigation} showBackBtn={true} title="My Profile"/>  
          <EmployeeProfileTabView navigation={navigation}/>
        </React.Fragment>  
      );
}
