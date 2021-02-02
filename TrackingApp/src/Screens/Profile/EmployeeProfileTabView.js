import React,{useState}                       from 'react';
import { View, StyleSheet, Dimensions,Text }  from 'react-native';
import { TabView, SceneMap, TabBar }          from 'react-native-tab-view';
import {EditProfile}                            from './EditProfile.js' 
import {EditAddress}                            from './EditAddress.js' 
import {EditWorkImages}                        from './EditWorkImages.js' 
import { Header, Icon  }                      from 'react-native-elements';
import styles                                 from './styles.js';
import {colors,sizes}                         from '../../config/styles.js';


const EditProfileRoute = () => (
  <EditProfile/>
);
 
const EditAddressRoute = () => (
  <EditAddress />
);
const EditWorkImagesRoute = () => (
  <EditWorkImages />
);

const initialLayout = { width: Dimensions.get('window').width };
 
export const EmployeeProfileTabView=(props)=>{
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Basic Info'},
    { key: 'second', title: 'Address' },
    { key: 'third', title: 'Work Images' },
  ]);
 
  const renderScene = SceneMap({
    first: EditProfileRoute,
    second: EditAddressRoute,
    third: EditWorkImagesRoute,
  });

  const getTabBarIcon = (props) => {
    const {route, focused} = props;
    let iconColor = focused ? colors.layoutColor: "#c2c3c8";
    if(route.key === 'first'){
      return <Icon name='user' size={20} color={iconColor} type='font-awesome'/>
    }else if(route.key === 'second'){
      return <Icon name='address-book' size={20} color={iconColor} type='font-awesome'/>
    }
    else if(route.key === 'third'){
      return <Icon name='address-book' size={20} color={iconColor} type='font-awesome'/>
    }
  }

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#333' }}
      style={styles.tabviews}
      activeColor="#6d578b"
      inactiveColor="#c2c3c8"
      // scrollEnabled    = {true}
      tabStyle={{height:50}}
      renderIcon={ props => getTabBarIcon(props)}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color:"#333"}}>
          {route.title}
        </Text>
      )}
      pressColor={"#eee"}

    />
  );
  return (
    <TabView
      navigationState  =  {{ index, routes }}
      renderScene      =  {renderScene}
      renderTabBar     =  {renderTabBar}
      onIndexChange    =  {setIndex}
      initialLayout    =  {initialLayout}
      tabBarPosition   = {'bottom'}
    />
  );
}
