	import {StyleSheet, Dimensions,Platform} from 'react-native';
import {colors} from '../../config/styles.js';

const window = Dimensions.get('window');

export default StyleSheet.create({
	container:{
    width:'100%',
    height:window.height,
  },
  bgImage: {
    width:"100%",
    height:250,
    borderBottomWidth:2,
    borderColor:'#ff0'
  },
  logoImage:{
  	height:60,
  	width:60,
  	borderRadius:100,
  },
  menuWrapper:{
  	width:'100%',
  	paddingTop: 15,
    height:window.height*0.62,
  },
  menu:{
  	width:'100%',
  	flexDirection:'row',
  	paddingVertical:5,
  	alignItems:'center',
  },
  iconContainer:{
  	backgroundColor:'#fff',
  	height: 35,
  	width: 35,
  	alignItems:'center',
  	justifyContent: 'center',
  	marginRight:15,
  	marginLeft:25,
  	borderWidth: 1,
  	borderColor: '#f1f1f1',
  	borderRadius: 3,
  	shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.18,
		shadowRadius: 1.00,

		// elevation: 0.5,
  },
    iconContainer1:{
    // backgroundColor:'#fff',
    color:"#fff",
    height: 35,
    width: 15,
    alignItems:'center',
    justifyContent: 'center',
    marginRight:5,
    marginLeft:20,

    // elevation: 0.5,
  },
  menuText:{
  	color: colors.primary,
  	fontFamily: 'Roboto-Regular',
  	fontSize: 14
  },
  sliderCrossIcon:{
    marginLeft:"85%",
       ...Platform.select({
      ios:{
        marginTop:35,
      },
      android : {
        marginTop:10,
      }
    })
  }
});