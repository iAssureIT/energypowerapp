import {
  SET_PERSON_DETAILS, 
  SET_LOADING
} from './types';

const initialUserState = {
  data : '',
};
export default (state = initialUserState, {type, payload}) => {
  console.log("payload check",payload);
  switch (type) {
    case SET_PERSON_DETAILS:
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