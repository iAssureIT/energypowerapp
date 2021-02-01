const initialState = {
	rolewiseAccessToModule 		: false,
	accessToFacility 			: false,

	userDetails : {
		firstName : "", 
		lastName  : "", 
		email 		: "", 
		phone 		: "", 
		city 			: "",
		companyID : "",
		locationID: "",
		user_id   : "",
		roles 		: [],
		token 		: "", 
	}

}

const reducer = (state = initialState, action) => {
	const newState = {...state}; 
	//Create Global userDetails Variable
	if(action.type === "SET_GLOBAL_USER"){
		newState.userDetails 	= action.userDetails;
		console.log("newState.userDetails in store = ",newState.userDetails);
	}

	if(action.type === "FETCH_ROLEWISE_ACCESS"){
		newState.rolewiseAccessToModule 	= action.rolewiseAccessToModule;
	}
	if(action.type === "FETCH_ACCESS_FACILITY"){
		newState.accessToFacility 	= action.accessToFacility;
	}
	return newState;
}

export default reducer;