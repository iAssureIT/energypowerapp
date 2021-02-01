import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  ScrollView,
  Text,
  View,
  BackHandler,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  Image,
  TextInput,
  Alert,
  Linking,
  AsyncStorage
} from 'react-native';
import { Button, Icon }       from "react-native-elements";
import CheckBox               from 'react-native-check-box'
import ValidationComponent    from "react-native-form-validator";
import axios                  from "axios";
import styles                 from './styles.js';
import { colors, sizes }      from '../../config/styles.js';
import Modal                  from "react-native-modal";
import { Fumi }               from 'react-native-textinput-effects';
import FontAwesomeIcon        from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect }            from 'react-redux';

const window = Dimensions.get('window');

class OpenModal extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      openModal : false

    };
  }

  componentDidMount(){
    console.log("this.props=>",this.props)
    this.setState({
      openModal:this.props.openModal,
    })
  }

 
  render() {
    const { navigate, dispatch } = this.props.navigation;
    return (
        <React.Fragment>

        {this.props.openModal ?
          <Modal isVisible={this.props.openModal}
            onBackdropPress={() => this.props.closeModal(false,"","")}
            coverScreen={true}
            hideModalContentWhileAnimating={true}
            style={{ paddingHorizontal: '5%', zIndex: 999 }}
            animationOutTiming={500}>
            <View style={{ backgroundColor: "#fff", alignItems: 'center', borderRadius: 20, paddingVertical: 30, paddingHorizontal: 10 }}>
              {this.props.messageType === "success" ?
                <View style={{ justifyContent: 'center', backgroundColor: "#34be34", width: 50, height: 50, borderRadius: 25, overflow: 'hidden' }}>
                  <Icon size={28} name='check' type='fontAwesome5' color='#fff' style={{}} />
                </View>
                :
                this.props.messageType === "warning" ?
                <View style={{ justifyContent: 'center', backgroundColor: "#ec971f", width: 50, height: 50, borderRadius: 25, overflow: 'hidden' }}>
                  <Icon size={28} name='exclamation' type='font-awesome' color='#fff' style={{}} />
                </View>
                :
                this.props.messageType === "error" ?
                <View style={{ justifyContent: 'center', backgroundColor: "#FAD162", width: 50, height: 50, borderRadius: 25, overflow: 'hidden' }}>
                  <Icon size={28} name='close' type='font-awesome' color='#fff' style={{}} />
                </View>
                :
                null
              }  
              <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 20 }}>
                {this.props.messageHead}
              </Text>
              {this.props.messagesSubHead!==""?
                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16, textAlign: 'center', justifyContent: 'center', marginTop: 10 }}>
                  {this.props.messagesSubHead}
                </Text>
                :
                null
              }
              <View style={{borderBottomRightRadius:500,marginTop:15,flexDirection:'row'}}>
                <Button
                  onPress         = {()=>this.props.closeModal(false,"","")}
                  titleStyle      = {styles.buttonText}
                  title           = "OK"
                  buttonStyle     = {{width:'100%',height:45,alignItems:'center',justifyContent:'center',borderRadius:50}}
                  containerStyle  = {styles.buttonContainer}
                />
              </View>
            </View>
          </Modal>
          :
          null
        }
        </React.Fragment>
    );

  }
}
 const mapStateToProps = (state)=>{
  console.log("bState===",state);
  return {
    openModal             : state.openModal,
    messageHead           : state.messageHead,
    messagesSubHead       : state.messagesSubHead,
    messageType           : state.messageType,
  }
  
};

const mapDispatchToProps = (dispatch)=>{
  return {
    closeModal  : (openModal,message,messageType)=> dispatch({type: "MODAL",
                            openModal:openModal,
                            message:message,
                            messageType:messageType,
                  }),
  }
};
export default connect(mapStateToProps,mapDispatchToProps)(OpenModal);