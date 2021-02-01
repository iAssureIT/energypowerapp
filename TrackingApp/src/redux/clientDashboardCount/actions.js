import {
		SET_DASHBOARD_COUNT, 
		SET_LOADING
	} from './types';
import {Dispatch} from 'redux';
import axios from 'axios';

export const getClientDasboardCount = (client_id) => {
  console.log("client_id",client_id);
  return async (dispatch, getState) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    const store = getState();
    axios.get('/api/tickets/get/client_dashboard_count/'+client_id) 
    .then(response => {
      console.log("response123",response);
      dispatch({
        type: SET_DASHBOARD_COUNT,
        payload: response.data,
      });
      dispatch({
        type: SET_LOADING,
        payload: false,
      });
      })
      .catch(err => {
        console.log('err123', err);
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
      });
  };
};