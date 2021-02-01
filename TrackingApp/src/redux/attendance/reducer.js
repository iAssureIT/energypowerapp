import {
  SET_STARTING_COORDINATES,
  SET_LOADING,
} from './types';

const initialUserState = {
  attendance_id:'',
  latitude:'',
  longitude:'',
  loading:false,
};
export default (state = initialUserState, {type, payload}) => {
  console.log("type",type,"payload",payload);
  switch (type) {
    case SET_STARTING_COORDINATES:
      return {
        ...state,
        latitude      : payload.latitude,
        longitude      : payload.longitude,
        attendance_id : payload.attendance_id,
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