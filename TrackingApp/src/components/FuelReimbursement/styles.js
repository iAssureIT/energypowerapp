import {StyleSheet, Dimensions,Platform} from 'react-native';
import {colors} from '../../config/styles.js';

const window = Dimensions.get('window');

export default StyleSheet.create({
 container:{
    backgroundColor: '#fff',
    minHeight:'100%',
    width: window.width,
  },
  startButton:{
    height:70,
    width:200,
    backgroundColor:"#283593",
    borderRadius:100,
    flexDirection:"row"
  },
  textHeader:{
    fontSize:30,
    color:"#376bff",
    fontFamily: 'Roboto-Regular',
  },
  myHistory:{
    marginTop:30,
    padding:30,
    height:500
  },
  historyBox:{
    height:80,
    borderWidth:1,
    flexDirection:"row",
    marginBottom:30,
    borderRadius:5
  },
  historyBoxLeft:{
    height:78,
    borderRightWidth:1,
    flex:0.3,
    justifyContent:"center"
  },
  historyBoxRight:{
    height:78,
    flex:0.7,
  },
  historyNavigate:{
    height:78,
    flex:0.1,
    justifyContent:"flex-end"
  },
  dateText:{
    fontSize:18,
    color: '#333',
    fontFamily:'Montserrat-SemiBold',
    alignSelf:"center"
  },
  historyDetail:{
    flexDirection:'row',
    padding:5
  },
  historyText:{
    fontSize:15,
  }
});

