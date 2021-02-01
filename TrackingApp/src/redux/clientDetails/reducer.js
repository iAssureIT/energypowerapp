import {
  SET_CLIENT_DETAILS,
  SET_LOADING,
} from './types';

const initialUserState = {
  data:'',
  loading:false,
};
export default (state = initialUserState, {type, payload}) => {
  switch (type) {
    case SET_CLIENT_DETAILS:
      return {
        ...state,
        data : payload,
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