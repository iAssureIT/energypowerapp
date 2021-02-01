import fp from 'lodash/fp';
import {connect} from 'react-redux';
import {withToaster} from '../config/withToaster';

export const SET_TOAST_STATE = 'SET_TOAST_STATE';
export const SET_LOGGEDIN_MODAL = 'SET_LOGGEDIN_MODAL';
export const SET_NON_LOGGED_MODAL = 'SET_NON_LOGGED_MODAL';
export const setToast = (payload) => ({
  type: SET_TOAST_STATE,
  payload,
});
const initialState = {
  toastState: null,
  isModalActive: false,
};
export const AppStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOAST_STATE:
      return {
        ...state,
        toastState: action.payload,
      };

    case SET_LOGGEDIN_MODAL:
      return {
        ...state,
        isModalActive: action.payload,
      };

    default:
      return state;
  }
};

export const withCustomerToaster = fp.compose(
  connect(null, (dispatch) => ({
    setToast: (payload) => dispatch(setToast(payload)),
  })),
  withToaster,
);