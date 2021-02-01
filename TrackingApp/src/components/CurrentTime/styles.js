import {StyleSheet, Dimensions,Platform} from 'react-native';
import {colors} from '../../config/styles.js';

const window = Dimensions.get('window');

export default StyleSheet.create({
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
    marginTop:30,
    justifyContent:"center",
    marginBottom:50,
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

