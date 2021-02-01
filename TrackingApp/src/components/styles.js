import {StyleSheet, Dimensions,Platform} from 'react-native';
import {colors} from '../config/styles.js';

const window = Dimensions.get('window');

export default StyleSheet.create({
  amenitiesWrapper : {
    // backgroundColor: "#ff0",
  },
  container:{
    backgroundColor: '#fff',
    minHeight:'100%',
    width: window.width,
  },
  startButton:{
    height:70,
    width:200,
    backgroundColor:"#283593",
    alignItems:"center",
    justifyContent:"center",
    borderRadius:100,
    flexDirection:"row"
  },
  textHeader:{
    fontSize:30,
    color:"#376bff",
    fontFamily: 'Roboto-Regular',
  },

});

