import {
    SET_CLIENT_DETAILS,
    SET_LOADING
  } from './types';
import {Dispatch} from 'redux';
import Axios from 'axios';


export const getClientDetails = entity_id => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    const store = getState();

    Axios.get('/api/entitymaster/get/one/'+entity_id) 
    .then(res => {
    console.log("client details",res);
      dispatch({
        type: SET_CLIENT_DETAILS,
        payload: res.data[0],
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