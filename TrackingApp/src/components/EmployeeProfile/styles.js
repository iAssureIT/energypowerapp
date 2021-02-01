import {StyleSheet, Dimensions,Platform} from 'react-native';
import {colors} from '../../config/styles.js';

const window = Dimensions.get('window');

export default StyleSheet.create({
 container:{
    backgroundColor: '#fff',
    minHeight:'90%',
    width: window.width,
    paddingVertical:20,
    // justifyContent:"center"
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
   buttonText:{
    color: colors.white,
    fontSize: 16,
    fontFamily:"Roboto-Regular",
  },
   button:{
    width:'100%',
    backgroundColor: colors.button,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:4  
  },
    buttonContainer:{
    width:'50%',
    // backgroundColor:"#aaa",
    height:45,
    borderRadius:3,
    ...Platform.select({
      ios:{
        justifyContent:'center',
         shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
      },
      android : {
        alignItems:'center'
      }
    })
  },

});

