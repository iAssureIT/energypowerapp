import {
  SET_DASHBOARD_COUNT, 
  SET_LOADING
} from './types';

const initialUserState = {
  data : '',
};
export default (state = initialUserState, {type, payload}) => {
  switch (type) {
    case SET_DASHBOARD_COUNT:
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