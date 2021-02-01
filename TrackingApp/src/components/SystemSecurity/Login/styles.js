import { StyleSheet, Dimensions,Platform } from 'react-native';
import { colors } from '../../../config/styles.js';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
const window = Dimensions.get('window');

export default StyleSheet.create({
  container:{
    backgroundColor: '#fff',
    minHeight:'100%',
    width: window.width,
    justifyContent:"center"
  },
  formInputView: {
    width:'100%',
    paddingHorizontal:15,
  },
  button:{
    width:'60%',
    backgroundColor: colors.button,
    height: 45,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius:50
  },
  buttonText:{
    color: colors.buttonText,
    borderRadius:50,
    fontFamily:"Montserrat-Regular",
  },
  textTitleWrapper:{
    paddingHorizontal: 15, marginTop: 15, marginBottom:15
  },
  linkLightText:{
    color: colors.textLight,
    fontSize: 15,
    fontFamily:"Montserrat-Regular",
  },
  linkText:{
    color: colors.textLight,
    fontSize: 15,
    fontFamily:"Montserrat-SemiBold",
    textDecorationLine: 'underline'
  },

  marginBottom30: {
    marginBottom: 30,
  },

  marginTop30:{
    marginTop: 30
  },

  marginBottom20:{
    marginBottom: 20
  },

  buttonContainer:{
    marginTop:15,
    ...Platform.select({
      ios:{
        justifyContent:'center',
        

      },
      android : {
        justifyContent:'center'
      }
    })
  },
  errorWrapper:{
    width:'100%',
    marginBottom:-15
  },
  errorText:{
    color:'#dc3545',
    fontSize:12,
    marginTop:3,
    paddingLeft:25,
    fontFamily:'Montserrat-Regular'
  },
  eyeWrapper:{
    width:'30%',
    justifyContent:'center',
    alignItems:'center',
  },
});
