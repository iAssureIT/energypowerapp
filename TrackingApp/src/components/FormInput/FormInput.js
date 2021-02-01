import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Input, Button, Icon} from 'react-native-elements';
import {
  Text,
  
} from 'react-native';
export const FormInput = props => {
  const {errors, touched, name} = props;
  return (
    <Input
      placeholderTextColor={'#bbb'}
      inputStyle={{fontSize: 16}}
      errorMessage={touched[name] && errors[name] ? errors[name] : ''}
      label={
        <Text style={{fontFamily:'Montserrat-SemiBold', fontSize: 14,}}>
          <Text>{props.labelName}</Text>{' '}
          <Text style={{color: 'red', fontSize: 12}}>
            {props.required && '*'}
          </Text>
        </Text>
      }
      leftIcon={props.iconName ?<Icon name={props.iconName} size={20} color="black" type={props.iconType} /> : null}
      {...props}
      inputContainerStyle= {styles.containerStyle}
      containerStyle={{height:100}}
      leftIconContainerStyle={styles.leftIconContainerStyle}
      errorStyle={{ color: 'red' ,margin:0}}
      inputStyle={{textAlignVertical: "top"}}
    />
  );
};

const styles = StyleSheet.create({
  containerStyle:{
    borderWidth:1,
    borderRadius:5,
    marginVertical:5,
    borderColor:"#ccc",
    paddingHorizontal:0,
    
  },
  leftIconContainerStyle:{
    borderRightWidth:1,
    borderColor:"#ccc",
    paddingLeft:5,
    paddingRight:15,
    margin:0
  }
  
});