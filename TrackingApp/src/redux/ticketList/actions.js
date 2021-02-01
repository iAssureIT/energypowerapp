import {
    SET_TICKETS_LIST,
    SET_LOADING
  } from './types';
import {Dispatch} from 'redux';
import Axios from 'axios';


export const getClientTicketsList = (client_id,status) => {
  console.log("client_id",client_id);
  return async (dispatch, getState) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    const store = getState();
    Axios.get('/api/tickets/get/client_list/'+client_id+"/"+status) 
    .then(res => {
      console.log("client_list",res);
      dispatch({
        type: SET_TICKETS_LIST,
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

export const getTechnicianTicketsList = (technican_id,status) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    const store = getState();
    Axios.get('/api/tickets/get/technician_list/'+technican_id+"/"+status) 
    .then(res => {
      console.log("res",res);
      dispatch({
        type: SET_TICKETS_LIST,
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