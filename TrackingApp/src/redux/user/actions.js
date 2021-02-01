import {
		SET_USER_DETAILS, 
		SET_LOADING
	} from './types';
import {Dispatch} from 'redux';
import Axios from 'axios';
import {getClientDetails} from '../clientDetails/actions';

export const setUserDetails = (payload) => {
  return {
    type: SET_USER_DETAILS,
    payload: payload,
  };
};

export const getUserDetails = (user_id,person_id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    const store = getState();
    Axios.get('/api/users/get/user_details/'+user_id) 
    .then(res => {
      console.log("res",res);
      dispatch({
        type: SET_USER_DETAILS,
        payload: {
          user_id     : res.data._id,
          person_id   : person_id,
          firstName   : res.data.profile.firstname,
          lastName    : res.data.profile.lastname,
          email       : res.data.profile.email,
          mobile      : res.data.profile.mobile,
          fullName    : res.data.profile.fullName,
          company_id  : res.data.profile.company_id,
          companyID   : res.data.profile.companyID,
          companyName : res.data.profile.companyName,
          status      : res.data.profile.status,
          role        : res.data.roles,
        },
      });
      if(res.data.roles[0] === 'client'){
        dispatch(getClientDetails(res.data.profile.company_id));
      }
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