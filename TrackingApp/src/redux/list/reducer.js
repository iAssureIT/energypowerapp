import {
  SET_CAMERA_LOCATIONS,
  SET_RECORDING_LOCATIONS,
  SET_TYPE_OF_ISSUE,
  SET_LOADING,
} from './types';

const initialUserState = {
  cameraLocations: [],
  recordingLocations: [],
  typeOfIssue: [],
  loading : false,
};
export default (state = initialUserState, {type, payload}) => {
  switch (type) {
    case SET_CAMERA_LOCATIONS:
      return {
        ...state,
        cameraLocations : payload,
      };
      case SET_RECORDING_LOCATIONS:
      return {
        ...state,
        recordingLocations : payload,
      };
      case SET_TYPE_OF_ISSUE:
      return {
        ...state,
        typeOfIssue : payload,
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