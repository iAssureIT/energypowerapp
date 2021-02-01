// utils/API.js

import axios from "axios";

export default axios.create({
  baseURL: "http://staapi.iassureit.com/",
  responseType: "json"
  

});
