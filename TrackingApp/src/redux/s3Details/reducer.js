import {
  SET_S3_DETAILS, 
  SET_LOADING
} from './types';

const initialUserState = {
  data : '',
};
export default (state = initialUserState, {type, payload}) => {
  switch (type) {
    case SET_S3_DETAILS:
      return {
        ...state,
        data  : payload,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: payload,
    };  
    default:
      return {...state};
  }
};