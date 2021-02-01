import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '../../../config/styles.js';
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
        width: '80%',
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
    bgImage: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    outerWrapper: {
        width: '100%',
        marginTop: ((Platform.OS === 'ios') ? 50 : 0),
        backgroundColor: 'transparent',
        padding: '6%',
        alignItems: 'center',
    },
    logoRoundWrapper: {
        height: 80,
        width: 80,
        borderRadius: 80 / 2,
        backgroundColor: '#fff',
        position: 'absolute',
        zIndex: 1,
        borderColor: colors.primary,
        borderWidth: 10,
        padding: 6,
    },
    formWrapper: {
        width: '100%',
        paddingTop: 20,
        paddingBottom: 20,
        shadowRadius: 5,
        shadowOffset: { height: 2, width: 0 },
    },

    inputWrapper: {
        width: '100%',
        borderColor: '#666',
        borderWidth: 1,
        flexDirection: 'row',
        borderRadius: 50,
    },
    inputImgWrapper: {
        width: '12%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: colors.textLight,
        marginVertical: 5
    },
    inputTextWrapper: {
        width: '88%'
    },
    marginBottom30: {
        marginBottom: 30,
    },
    marginBottom20: {
        marginBottom: 20,
    },
    buttonContainer: {
        width: '100%',

    },
    textContainer: {
        height: "auto",
        paddingLeft: 10
    },
    textInputContainer: {
        backgroundColor: 'transparent',
        // left:5,
        // fontFamily:"Montserrat-Regular",
        borderBottomColor: "transparent"
    },
    textTitle: {
        fontFamily: "Montserrat-Regular",
        top: 0
    },
    textStyle: {
        fontFamily: "Montserrat-Regular",
        backgroundColor: 'transparent',
        paddingTop: 0,
        marginTop: -6
    },
    textLabel: {
        backgroundColor: '#fff',
        fontFamily: "Montserrat-Regular",
        top: -7,
        left: 10,
        paddingHorizontal: 2
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
    buttonFrgContainer: {
        ...Platform.select({
            ios: {
                justifyContent: 'center',

            },
            android: {
                justifyContent: 'center',

            }
        })
    },
    buttonFrg1Container: {

        ...Platform.select({
            ios: {
                justifyContent: 'center',
    

            },
            android: {
                justifyContent: 'center',


            }
        })
    },
    button2: {
        width: '80%',
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
    buttonText1: {
        color: colors.buttonText,
        borderRadius: 50,
        fontSize: 15,
        fontFamily: "Montserrat-SemiBold",
    },
    buttonSignUp1: {
        width: '100%',
        backgroundColor: colors.button,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#0275D8'
    },
    rootSubWrapper:{
        paddingVertical:20,backgroundColor:'#fff',marginTop:15, borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,borderRadius:10
    },
    rootWrapper:{
        paddingHorizontal:20,paddingVertical:20,
    },
    viewWrapper:{
        width: '100%',backgroundColor:'#fff',
    }
});