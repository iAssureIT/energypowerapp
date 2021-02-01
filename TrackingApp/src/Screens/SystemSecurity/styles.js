import { StyleSheet, Dimensions,Platform } from 'react-native';
import { colors } from '../../config/styles.js';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import styles               from './styles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({
  container:{
    backgroundColor: '#fff',
    minHeight:'100%',
    width: window.width,
    justifyContent:"center"
  },
 formInputView: {
        width: '100%',
        paddingHorizontal: 15
    },
    labelText:{
        top:6,
        paddingLeft:2,
    },
    button:{
        width:'75%',
        backgroundColor: colors.button,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius:50
    },
    marginTB:{
        marginVertical: 10,
    },
    buttonText:{
        color: colors.buttonText,
        fontSize: 13,
        fontFamily:"Montserrat-Regular",
    },
    linkWrap:{
        width: '100%',
        flexDirection:'row',
        justifyContent:'space-between',
    },
    linkText:{
        fontSize: 15,
        fontFamily:"Montserrat-Regular",
    },
   
    otpWrap:{
        marginBottom:30,
    },
    otpText:{
        fontFamily:"Montserrat-Regular",
        fontSize: 15
    },
    otpInputWrap:{
        flexDirection:'row',
        paddingTop:10,
        justifyContent:"center"
    },

    otpInput:{
        width:40,
        height:40,
        borderWidth:1,
        borderColor:colors.border,
        borderRadius: 3,
        marginRight: 5,
    },
    loginTitleTxt:{
        fontSize: 22,
        color:'#333',
        fontFamily:"Montserrat-Bold",
    },
    buttonContainer:{
        ...Platform.select({
            ios:{
                justifyContent:'center',

            },
            android : {
                justifyContent:'center',

            }
        })
    },
    marginBottom20:{
        marginBottom : 20
    },
    button1Container:{
        ...Platform.select({
            ios:{
                justifyContent:'center',

            },
            android : {
                justifyContent:'center',
                marginLeft:15
            }
        })
    },
    buttonSignUp:{
        width:'75%',
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
    textTitleWrapper:{
        paddingHorizontal: 15, marginTop: 15, marginBottom:15
    },
     overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.layoutColor,
        height: 400,
        borderBottomLeftRadius : 20,
        borderBottomRightRadius : 20,
    },
     borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },

  underlineStyleBase: {
    width: 40,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color:"#333"
  },

  underlineStyleHighLighted: {
    borderColor: "#03DAC6",
  },
});
