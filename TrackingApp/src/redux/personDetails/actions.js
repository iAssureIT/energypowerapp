import {
		SET_PERSON_DETAILS, 
		SET_LOADING
	} from './types';
import {Dispatch} from 'redux';
import Axios from 'axios';

export const getPersonDetails = (person_id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    const store = getState();

    Axios.get('api/personmaster/get/one/'+person_id) 
    .then(response => {
      dispatch({
        type: SET_PERSON_DETAILS,
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

export const setPersonDetails = (payload) => {
  console.log("payload check",payload);
  return {
    type: SET_PERSON_DETAILS,
    payload: payload,
  };
};