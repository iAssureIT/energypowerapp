import {
		SET_DASHBOARD_COUNT, 
		SET_LOADING
	} from './types';
import {Dispatch} from 'redux';
import Axios from 'axios';

export const getDasboardCount = (technician_id) => {
  console.log("technician_id",technician_id);
  return async (dispatch, getState) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    const store = getState();
    Axios.get('api/tickets/get/technician_dashboard_count/'+technician_id) 
    .then(response => {
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
        console.log('err', err);
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
      });
  };
};