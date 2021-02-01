import {
  SET_LOADING,
  SET_TICKETS_LIST
} from './types';

const initialUserState = {
  list : [],
  loading : false,
};
export default (state = initialUserState, {type, payload}) => {
  switch (type) {

      case SET_TICKETS_LIST:
      return {
        ...state,
        list : payload,
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