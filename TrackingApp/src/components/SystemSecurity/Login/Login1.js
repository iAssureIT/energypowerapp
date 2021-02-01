import React, {Component} from 'react';
import {
  ScrollView,
  Text,
  View,
  BackHandler,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image, TextInput,
  Platform,
  Alert,
  AsyncStorage
} from 'react-native';
import { KeyboardAwareScrollView }  from 'react-native-keyboard-aware-scroll-view';
import RootLogin                    from './RootLogin.js';
import styles                       from './styles.js';
import { colors, sizes }            from '../../../config/styles.js';
import HeaderBar                    from '../../../layouts/Header/Header.js';

const window = Dimensions.get('window');

export default class Login1 extends Component {
  render() {
    const { navigate } = this.props.navigation;
    const { navigation } = this.props;
    return (
      <React.Fragment>
        <ImageBackground source={{}}  style={styles.container} resizeMode="cover" >
          <View style={{paddingHorizontal:20,paddingVertical:20}}>
            <View style={{paddingVertical:20,backgroundColor:'#fff',marginTop:15, borderBottomWidth: 0,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 1,borderRadius:10}}>
              <RootLogin navigation={navigate} />
            </View>
          </View>
        </ImageBackground>
      </React.Fragment>
    );
  }
}

