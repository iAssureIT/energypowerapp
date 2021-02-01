import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../../config/styles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({

  container:{
    backgroundColor: '#fff',
    minHeight:window.height-100,
    width: window.width,
  },  
  pageView:{
    backgroundColor: '#fff',
  },
 modalView:{
    paddingVertical:10,
    paddingHorizontal:10,
    backgroundColor:'#fff', 
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    // elevation: 1,
  },
   
    linkLightText:{
    color: colors.textLight,
    fontSize: 15,
    fontFamily:"Montserrat-Regular",
  },
    loginTitleTxt:{
    fontSize: 22,
    color:'#333',
    fontFamily:"Montserrat-Bold",
  },
  
  button:{
    width:'50%',
    backgroundColor: colors.button,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:50
  },
   buttonText:{
    color: colors.buttonText,
    fontSize: 13,
    fontFamily:"Montserrat-Regular",
  },

  linkText:{
    color: colors.primary,
    fontSize: 15,
    fontFamily:"Montserrat-Regular",
  },
  buttonStyleAccept:{
    width: '100%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor:colors.success,
  },
  buttonStyleReject:{
    width: '100%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor:colors.danger, 
  },
  buttonStyle:{
    width: '60%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor:colors.button, 
    alignSelf:'center',
    paddingVertical:20,
  },
  mainHeader:{
    borderWidth: 0,
    padding: 0,
    alignItems:"center",
    paddingVertical:15
  },
  mainHeaderText:{
    fontSize:25,
    color:"#fff",
    paddingVertical:10,
    fontFamily:'Montserrat-Bold',
  },
  subHeaderText:{
    fontSize:15,
    paddingVertical:5,
    flex:1,
    fontFamily:'Montserrat-SemiBold'
  },
  smallText:{
    fontSize:15,
    paddingVertical:3,
    fontFamily:'Montserrat-Medium'
  },
  hrLine:{
    borderWidth:0.5
  },
  viewBox:{
    borderWidth: 0,
    padding: 0,
    paddingVertical:15
  },
  overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.layoutColor,
      height: 400,
      borderBottomLeftRadius : 20,
      borderBottomRightRadius : 20,
  },
  cardView:{
    flex:1
  },
  dateText:{
  fontSize:18,
  color: '#333',
  fontFamily:'Montserrat-SemiBold',
  alignSelf:"center"
},
packageIndex:{
  flex:.2,
  // borderLeftWidth:4,
  justifyContent:'center',
  padding: 25
},
});
