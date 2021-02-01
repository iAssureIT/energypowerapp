import React,{useEffect,useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './coreadmin/css/root.css';
// import LayoutS	ystemSecurity from './coreAdmin/LayoutSystemSecurity/LayoutSystemSecurity.js';
import Layout from './Layout.js';
import './lib/router.js';
import axios from 'axios';
import $ from 'jquery';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import ReactDependentScript from "react-dependent-script";
// axios.defaults.baseURL = 'http://localhost:5026';
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
console.log("axios.defaults.baseURL",axios.defaults.baseURL);
// axios.defaults.baseURL = 'http://iogapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json'; 
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

export const App = () => {
	const [initMap,setInitMap]=useState(false)
	const [googleAPIKey,setGoogleAPIKey]=useState()
	useEffect(() => {
	 	axios.get("/api/projectSettings/get/GOOGLE",)
	    .then((response) => {
	      	setGoogleAPIKey(response.data.googleapikey)
	        window.initMap = setInitMap(true);
	    })
	    .catch((error) =>{
	        console.log(error)
	    })
	}, []);
  return (
    <div>
    	{
		initMap ?
  		<ReactDependentScript
	      scripts={[
	        "https://maps.googleapis.com/maps/api/js?key="+googleAPIKey+"&libraries=geometry,drawing,places&callback=initMap"
	      ]}
	    >
	      <Layout />
	    </ReactDependentScript>
  		:
  		null
      }
    </div>
    
    );  
}