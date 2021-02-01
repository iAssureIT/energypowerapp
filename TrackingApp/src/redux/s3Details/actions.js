import {
		SET_S3_DETAILS, 
		SET_LOADING
	} from './types';
import {Dispatch} from 'redux';
import Axios from 'axios';
import {getClientDetails} from '../clientDetails/actions';



export const getS3Details = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    const store = getState();

    Axios.get('api/projectsettings/get/S3') 
    .then(response => {
      dispatch({
        type: SET_S3_DETAILS,
        payload: {
          bucket: response.data.bucket,
          keyPrefix: 'ticketImages',
          region: response.data.region,
          accessKey: response.data.key,
          secretKey: response.data.secret,
          successActionStatus : 201
        },
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