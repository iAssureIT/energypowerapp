import axios from 'axios';

export function getRoleWiseAccessToModule(moduleName) {

  return dispatch =>{

  var roles = localStorage.getItem('roles');
  roles = roles.split(',');
      var formValues = {
        roles   : roles,
        module  : moduleName
      }
      return axios.post("/api/accessmaster/getRolewiseAccessToModule",formValues)
        .then((response)=>{
         
            dispatch(fetchRolewiseAccess(response.data));
        })
        .catch((error)=>{
              console.log('error', error);
        })
    
  }  
}

export function getAccessToFacility(moduleName, facilityName) {

  return dispatch =>{

  var roles = localStorage.getItem('roles');
  roles = roles.split(',');
      var formValues = {
        roles         : roles,
        module        : moduleName,
        facility      : facilityName
      }
      return axios.post("/api/accessmaster/getAccessToFacilityOfModule",formValues)
        .then((response)=>{
         
            dispatch(fetchAccessToFacility(response.data));
        })
        .catch((error)=>{
              console.log('error', error);
        })
    
  }  
}
export const fetchRolewiseAccess = rolewiseAccessToModule => ({
  type: 'FETCH_ROLEWISE_ACCESS',
  rolewiseAccessToModule: rolewiseAccessToModule
});

export const fetchAccessToFacility = accessToFacility => ({
  type: 'FETCH_ACCESS_FACILITY',
  accessToFacility: accessToFacility
});

