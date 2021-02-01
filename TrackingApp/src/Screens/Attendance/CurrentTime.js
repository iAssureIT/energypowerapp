import React, {useState,useEffect}         from 'react';
import {View, ImageBackground,Dimensions,Text,StyleSheet,TouchableOpacity}  from 'react-native';
import {Button, Icon, Input}    from 'react-native-elements';
import { colors, sizes }        from '../../config/styles.js';
import commonStyle              from '../../config/commonStyle.js';
import {HeaderBar}              from '../../layouts/Header/Header.js';
import moment from 'moment';
const window = Dimensions.get('window');


export const CurrentTime = (props) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    setInterval( () => {
        setCurrentTime(new Date());
      },1000)
  }, [])
    return (
      <View style={styles.digitalClock}>
        <Text style={styles.time}>{moment(currentTime).format('LTS')}</Text>
         <View style={{alignItems:"center"}}>
          <Text style={[styles.textHeader]}>{moment(currentTime).format('DD/MM/YYYY')}</Text>
        </View>
      </View> 
    );
};

const styles = StyleSheet.create({
  amenitiesWrapper : {
    // backgroundColor: "#ff0",
  },
  container:{
    backgroundColor: '#fff',
    minHeight:'90%',
    width: window.width,
    padding:20,
  },
  digitalClock:{
    height:100,
    width:300,
    justifyContent:"center",
    marginBottom:30,
    backgroundColor:colors.theme,
    borderRadius:10
  },
  time:{
    fontSize:30,
    textAlign:"center",
    color:"#fff"
  },
  textHeader:{
    color:"#fff",
    fontSize:15
  }
});