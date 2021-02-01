import {StyleSheet, Dimensions,Platform} from 'react-native';
import {colors} from '../../../config/styles.js';

const window = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    // flex: 0.8,
    height:window.width,
    // width:window.height,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    // flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

