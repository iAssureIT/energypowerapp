import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../../../config/styles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({

  container:{
    backgroundColor: '#fff',
    minHeight:'100%',
    justifyContent:"center"
  },

  formContainer:{
    width:'100%',
    paddingHorizontal:15
  },
  formInputView: {
    width:'100%',
    paddingHorizontal:15,
  },
  headertitle:{
     fontSize: 20,
     marginTop:20
  },
    linkText:{
    color: colors.textLight,
    fontSize: 17,
    fontFamily:"Montserrat-Bold",
    fontWeight:600,
    textDecorationLine: 'underline'
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
  marginTB:{
    marginVertical: 5,
  },
  linkWrap:{
    width: '100%',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  linkText:{
    color: colors.primary,
    fontSize: 15,
    fontFamily:"Montserrat-Regular",
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
    ...Platform.select({
      ios:{
        justifyContent:'center',


      },
      android : {
        alignItems:'center'
      }
    })
  },
  buttonContainer1:{
    width:'100%',
  },
 
  errorWrapper:{
    width:'100%',
    marginBottom:-10
  },
  errorText:{
    color:'#dc3545',
    fontSize:12,
    fontFamily:'Montserrat-Regular',
  
  },
  successText:{
    color:'#28a745',
    fontSize:13,
    fontFamily:'Montserrat-Regular'
  },
  eyeWrapper:{
    width:'30%',
    justifyContent:'center',
    alignItems:'center',
  },
  button1Container:{
    width:'45%',
    ...Platform.select({
      ios:{
        justifyContent:'center',

      },
      android : {
        alignItems:'center'
      }
    })
  },
   buttonSignUp:{
     width:'85%',
    backgroundColor: colors.buttonSignUp,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:50,
    borderWidth:1,
    borderColor:'#333'

  },
   buttonSignInText:{
    color: colors.buttonText1,
    borderRadius:50,
    fontSize:13,
    fontFamily:"Montserrat-Regular",
  },
});
