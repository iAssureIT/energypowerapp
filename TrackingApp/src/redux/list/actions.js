import {
    SET_EQUIPMENT_LOCATIONS,
    SET_PROJECT_LOCATIONS,
    SET_TYPE_OF_ISSUE,
    SET_LOADING
  } from './types';
import {Dispatch} from 'redux';
import Axios from 'axios';

export const getDropDownList = (client_id) => {
  return async (dispatch, getState) => {
    dispatch({
        type: SET_LOADING,
        payload: true,
      });
    const store = getState();

    Axios.get('/api/projectlocation/get/list/client/'+client_id) 
    .then(res => {
      dispatch({
        type: SET_PROJECT_LOCATIONS,
        payload: res.data,
      });
    })
    .catch(err => {
      console.log('err', err);
      dispatch({
        type: SET_LOADING,
        payload: false,
      });
    });

    Axios.post('/api/taskTypeMaster/get/list') 
    .then(res => {
      dispatch({
        type: SET_TYPE_OF_ISSUE,
        payload: res.data,
      });
      dispatch({
        type: SET_LOADING,
        payload: false,
      });
      })
      .catch(err => {
        console.log('err', err);
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
      });
  };
};