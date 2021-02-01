import React, {useState} from 'react';
import {StyleSheet,View} from 'react-native';
import {Input, Button, Icon} from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import {
  Text,
  
} from 'react-native';
import { colors, sizes }        from '../../config/styles.js';

export const FormDropDown = props => {
  const {errors, touched, name,data} = props;
  return (
    <View style={styles.formInputView}>
      <Text style={{fontFamily:'Montserrat-SemiBold', fontSize: 14,paddingVertical:2}}>
        <Text>{props.labelName}</Text>{' '}
        <Text style={{color: 'red', fontSize: 12}}>
          {props.required && '*'}
        </Text>
      </Text>
      <View style={[styles.inputWrapper]}>
        <View style={styles.inputImgWrapper}>
          <Icon name={props.iconName} size={20} color="black" type={props.iconType} />
        </View>
        <View style={styles.inputTextWrapper}>
          <Dropdown
            placeholder         = {props.labelName}
            data                = {data}
            containerStyle      = {styles.ddContainer}
            dropdownOffset      = {{top:0, left: 0}}
            itemTextStyle       = {styles.ddItemText}
            inputContainerStyle = {styles.ddInputContainer}
            labelHeight         = {10}
            tintColor           = {'#FF8800'}
            labelFontSize       = {15}
            fontSize            = {15}
            baseColor           = {'#666'}
            textColor           = {'#333'}
            labelTextStyle      = {{left:5}}
            style               = {styles.ddStyle}
            disabledLineType    = 'none'
            {...props}
          />
        </View>
      </View>
      <Text style={{fontSize:12,marginTop:2,color:"#f00"}}>{touched[name] && errors[name] ? errors[name] : ''}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
   inputWrapper : {
    width:'100%',
    borderColor:'#ccc',
    borderRadius:5,
    borderWidth:1,
    flexDirection:'row',

 },
  inputImgWrapper : {
    width:'15%',
    justifyContent:'center',
    alignItems:'center',
    borderRightWidth:1,
    borderColor:"#ccc",
  },
  inputTextWrapper : {
    width:'85%',
    borderColor:'#ccc',
  },
  ddItemText:{
    fontFamily:"Montserrat-Regular",
  },
   ddLabelText:{
    backgroundColor:'#fff',
    top:0,
    left:5,
    fontFamily:"Montserrat-Regular",
    fontSize:15,
    paddingHorizontal:4,
  },
 ddInputContainer:{
    borderBottomColor: 'transparent',
    paddingLeft:5,
    // backgroundColor:'#ff0',
    borderBottomWidth: 0,
  },
  formInputView: {
    width:'100%',
    marginBottom:10,
    paddingHorizontal:10
  },
});