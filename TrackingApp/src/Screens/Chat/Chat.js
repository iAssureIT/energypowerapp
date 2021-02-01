import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import {HeaderBar}              from '../../layouts/Header/Header.js';
import {useNavigation}          from '../../config/useNavigation.js';
import {View, ImageBackground,Dimensions,Text,StyleSheet,TouchableOpacity,ScrollView}   from 'react-native';
import { KeyboardAwareScrollView }      from 'react-native-keyboard-aware-scroll-view';
import commonStyle              from '../../config/commonStyle.js';
export const Chat =(props)=> {
  const [messages, setMessages] = useState([]);
 const navigation   = useNavigation();
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])
 
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])
 
  return (
    <React.Fragment>
        <HeaderBar navigation={navigation} showBackBtn={true} />
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1,
          }}
        />
     </React.Fragment>   
  )
}