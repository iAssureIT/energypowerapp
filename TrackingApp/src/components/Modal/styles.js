import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '../../config/styles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({

    container:{
    backgroundColor: '#fff',
    minHeight:'100%',
    justifyContent:"center"
  },
    formInputView: {
        width: '100%',
        paddingHorizontal: 15
    },
    loginTitleTxt: {
        fontSize: 22,
        color: '#333',
        fontFamily: "Montserrat-Bold",
    },
    inputText: {
        borderWidth: 1,
        borderColor: '#aaa',
        height: 40,
        paddingLeft: 10,
        textAlignVertical: 'center',
        paddingTop: 0,
        paddingBottom: 0,
    },
    labelText: {
        top: 6,
        paddingLeft: 2,
    },
    button: {
        width: '75%',
        backgroundColor: colors.button,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    marginTB: {
        marginVertical: 20,
        // marginBottom: 20,
    },
    buttonText: {
        color: colors.buttonText,
        fontSize: 13,
        fontFamily: "Montserrat-Regular",
    },
    linkWrap: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    marginBottom30: {
        marginBottom: 30,
    },
    marginBottom20: {
        marginBottom: 20,
    },

    buttonContainer1: {
        width: '100%',
        ...Platform.select({
          ios:{
            justifyContent:'center',
          },
          android : {
            alignItems:'center'
          }
        }),
      
    },
    
    linkText: {
        fontSize: 15,
        fontFamily: "Montserrat-Regular",
    },
    errorWrapper: {
        width: '100%',
        marginBottom: -15
    },
    errorText: {
        color: '#dc3545',
        fontSize: 13,
        fontFamily: 'Montserrat-Regular'
    },
   
    button2: {
        width: '88%',
        backgroundColor: colors.buttonSignUp,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#f1f1f1',

    },
    buttonSignInText: {
        color: colors.buttonText1,
        borderRadius: 50,
        fontSize: 13,
        fontFamily: "Montserrat-Regular",
    },
    textTitleWrapper:{
        paddingHorizontal: 15, marginTop: 15, marginBottom:15
    },
   
});