import {
  SET_USER_DETAILS, 
  SET_LOADING
} from './types';

const initialUserState = {
  firstName   : '',
  lastName    : '',
  fullName    : '',
  email       : '',
  mobile      : '',
  companyName : '',
  user_id     : '',
  token       : '',
  company_id  : '',
  companyID   : '',
  fullName    : '',
  status      : '',
  person_id   : ''
};
export default (state = initialUserState, {type, payload}) => {
  switch (type) {
    case SET_USER_DETAILS:
      return {
        ...state,
        token       : payload.token,
        firstName   : payload.firstName,
        lastName    : payload.lastName,
        fullName    : payload.fullName,
        email       : payload.email,
        mobile      : payload.mobile,
        companyName : payload.companyName,
        user_id     : payload.user_id,
        company_id  : payload.company_id,
        companyID   : payload.companyID,
        status      : payload.status,
        person_id   : payload.person_id,
        role        : payload.role,
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