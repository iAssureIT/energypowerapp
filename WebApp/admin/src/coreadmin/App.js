import React from 'react';
import './coreadmin/css/root.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './lib/router.js';
import Layout from './Layout.js';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

axios.defaults.headers.post['Content-Type'] = 'application/json';

function App() {

  return (
    <div>
      <Layout />
    </div>
  );
}

export default App;
