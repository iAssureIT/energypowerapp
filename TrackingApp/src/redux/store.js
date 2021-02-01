
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import userDetails from './user';
import list from './list';
import clientDetails from './clientDetails';
import ticketList from './ticketList';
import s3Details from './s3Details';
import techDashboardCount from './technicianDashboardCount';
import clientDashboardCount from './clientDashboardCount';
import personDetails from './personDetails';
import attendance from './attendance';
import {AppStateReducer} from './AppState';
const appReducer = combineReducers({
  userDetails,
  list,
  ticketList,
  clientDetails,
  s3Details,
  techDashboardCount,
  clientDashboardCount,
  personDetails,
  attendance,
  appStateReducer: AppStateReducer,
});

export const USER_LOGOUT = 'USER_LOGOUT';

const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default createStore(
  rootReducer,
  {},
  composeWithDevTools(applyMiddleware(thunk)),
);