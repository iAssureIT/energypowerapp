import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../../config/styles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({

  container:{
    backgroundColor: '#f9f9f9',
    minHeight:'90%',
    width: window.width,
    justifyContent:"center",
  },  
  pageView:{
   paddingHorizontal:20,
   paddingVertical:20,
   justifyContent:"center"
  },
 modalView:{
    paddingVertical:10,
    backgroundColor:'#fff', 
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    borderRadius:10
  },
  tabviews: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
},  
   profileImgView:{
    alignItems:'center',
    justifyContent:"center",
    paddingVertical:10
  },
  formInputDocViewLeft:{
    flex:0.8
  },
  formInputDocViewRight:{
    flex:0.2,
    borderWidth:1,
    borderLeftWidth:0,
    borderColor:"#f1f1f1",
    height:64,
    alignItems:"center",
    justifyContent:"center"
  },
  formContainer:{
    width:'100%',
    paddingHorizontal:15
  },
  formInputView : {
    // borderColor: colors.black,
    borderColor: "#666",
    borderWidth: 1,
    height:50,
    zIndex:1
  },
  formInputViewDrop: {
    flex:0.48,
    flexDirection:'row',
  },
  headertitle:{
     fontSize: 20,
     marginTop:20
  },

  searchView: {
    backgroundColor: '#fff',
    borderWidth:0.5,
    borderColor:"#aaa",
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    borderRadius: 5,
    marginTop:3,
    marginBottom:30,
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
    fontFamily:"Montserrat-Medium",
  },
  ddItemText:{
    fontFamily:"Roboto-Medium"
  },
  ddLabelText:{
    backgroundColor:'#fff',
    top:0,
    // left:5,
    fontFamily:"Roboto-Medium",
    fontSize:16,
    paddingHorizontal:2,
    fontWeight:'bold',
    color:"#aaa"
  },
  ddStyle:{
    fontFamily:"Roboto-Medium",
  },
  block1: {
    flex: 0.5,
    height:100,
    justifyContent:"center",
    alignItems:"center"
  },
  block2: {
    flex: 0.5,
    height:100,
    justifyContent:"center",
    alignItems:"center"
  },
    proofImage:{
    height:100,
    width:"100%",
    backgroundColor:"#eee",
    marginBottom:15,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  deleteIcon:{
    height:20,
    width:20,
    backgroundColor:"#eee",
    justifyContent:'center',
    borderRadius:20,
    marginRight:-9,
    marginTop:-7
  }
});
