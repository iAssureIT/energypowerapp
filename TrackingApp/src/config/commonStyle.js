import {StyleSheet, Dimensions,Platform} from 'react-native';
import {colors} from '../config/styles.js';

const window = Dimensions.get('window');

export default StyleSheet.create({
  container:{
    flex:1,
  },
  button: {
      alignItems: "center",
      backgroundColor: colors.theme,
      padding: 10
  },
  headerText:{
    fontSize:20,
    fontFamily:'Montserrat-SemiBold',
    paddingVertical:10,
    color:colors.theme,
  },
  subHeaderText:{
    fontSize:18,
    fontFamily:'Montserrat-Bold',
    alignSelf:"center",
  },
  label:{
    fontSize:15,
    fontFamily:'Montserrat-SemiBold',
  },
  normalText:{
    fontSize:15,
    fontFamily:'Montserrat-Regular',
  },
  formInputBox:{
    paddingVertical:15
  },
    overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.theme,
    height: 400,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  modalView:{
    padding:'2%',
    backgroundColor:'#fff',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    borderRadius:10,
    marginHorizontal:'5%',
    marginVertical:15,
  },
    block1: {
    flex: 0.5,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image:{
    height:60,
    width:60,
    alignItems:"center",
    backgroundColor:"#eee",
    margin:15
  },
  textLabel:{
    paddingHorizontal:5,
    color:colors.white,
    borderRadius:3
  }
});

