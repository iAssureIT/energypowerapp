import React 			   from 'react';
import ReactDOM            from 'react-dom';
import './index.css';
import App from './App.js';
import * as serviceWorker  from './serviceWorker';
import { Provider } 	from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';


const configureStore = () => {   
  return createStore( reducer, applyMiddleware(thunk)) ;
}

const store = configureStore();

ReactDOM.render( <Provider store={store}> <App /> </Provider>,  document.getElementById('root'));
serviceWorker.unregister();
