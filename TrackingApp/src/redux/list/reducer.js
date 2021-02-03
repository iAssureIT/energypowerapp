import {
  SET_EQUIPMENT_LOCATIONS,
  SET_PROJECT_LOCATIONS,
  SET_TYPE_OF_ISSUE,
  SET_LOADING,
} from './types';

const initialUserState = {
  equipmentLocations: [],
  projectLocations: [],
  typeOfIssue: [],
  loading : false,
};
export default (state = initialUserState, {type, payload}) => {
  switch (type) {
    case SET_EQUIPMENT_LOCATIONS:
      return {
        ...state,
        equipmentLocations : payload,
      };
      case SET_PROJECT_LOCATIONS:
      return {
        ...state,
        projectLocations : payload,
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