import axios                                  from 'axios';
import React, {useState, useEffect}           from 'react';
import {StatusBar}                            from 'react-native';
import {Provider as ProviderPaper, Snackbar}  from 'react-native-paper';
import {Provider, connect}                    from 'react-redux';
import {UseFetchProvider}                     from 'use-fetch-lib';
import AppContainer                           from './src/config/routes';
import store                                  from './src/redux/store';
import {setToast}                             from './src/redux/AppState';
import { MenuProvider } from 'react-native-popup-menu';
import { request,check,PERMISSIONS,RESULTS }  from 'react-native-permissions';
import codePush from "react-native-code-push";

console.disableYellowBox = true;
// const BASE_URL = 'http://192.168.0.107:5026';
const BASE_URL = 'http://qaapi.energypowerworld.com';
// const BASE_URL = 'http://staapi.iassureit.com/';
// const BASE_URL = 'http://uatapi.isecuretechnology.com/';
axios.defaults.baseURL = BASE_URL;
console.log("BASE_URL",BASE_URL);
const App = () => {
  const [token, setToken] = useState('');
  const [toast, setAppToast] = React.useState(null);

  useEffect(() => {
    const unSubscribe = store.subscribe(() => {
      setToken(store.getState()?.userReducer?.token || '');
      setAppToast(store.getState()?.appStateReducer?.toastState);
       request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log('This feature is not available (on this device / in this context)');
              break;

            case RESULTS.DENIED:
              console.log('The permission has not been requested / is denied but requestable');
              break;
            case RESULTS.GRANTED:
              break;
            case RESULTS.BLOCKED:
              console.log('The permission is denied and not requestable anymore');
              break;
            }
          })
          .catch(error => {
            console.log("error=>",error);
          });
        });
    return () => {
      unSubscribe();
    };
  }, []);
  return (
    <Provider store={store}>
      <ProviderPaper>
        <MenuProvider>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
            <UseFetchProvider
              baseUrl={BASE_URL}
              authorizationToken={`Bearer ${token}`}>
              <AppContainer />
              <ToastProvider toast={toast} />
            </UseFetchProvider>
         </MenuProvider >   
      </ProviderPaper>
    </Provider>
  );
};
const ToastProviderComponent = props => {
  return (
    <Snackbar
      visible={!!props.toast}
      style={{backgroundColor: props.toast?.color}}
      duration={5000}
      onDismiss={() => props.setToast(null)}>
      {props.toast?.text}
    </Snackbar>
  );
};

const ToastProvider = connect(
  null,
  dispatch => ({
    setToast: payload => dispatch(setToast(payload)),
  }),
)(ToastProviderComponent);

// const codePushOptions = {
//  checkFrequency: codePush.CheckFrequency.ON_APP_START 
// };

export default App;