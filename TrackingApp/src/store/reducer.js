const initialState = {
	openModal	:false,
	message   	:"",
	messageType :"",
	tracking_id :"",
	longitude   :"",
	latitude    :"",
	user_id     :"",
	token       :"",
}

const reducer = (state = initialState,action) => {
	const newState = {...state};
	if(action.type === "MODAL"){
		newState.openModal 			= action.openModal;
		newState.messageHead 		= action.messageHead;
		newState.messagesSubHead 	= action.messagesSubHead;
		newState.messageType 		= action.messageType;
	}	
	if(action.type === "SET_USER_ID"){
		newState.user_id 		= action.user_id;
	}
	if(action.type === "TRACKING_ID"){
		newState.tracking_id 		= action.tracking_id;
	}
	if(action.type === "SET_STARTING_COORDINATES"){
		newState.tracking_id 		= action.tracking_id;
		newState.longitude 		    = action.longitude;
		newState.latitude 			= action.latitude;
	}
	if(action.type === "SET_SECURITY_DETAILS"){
		newState.user_id 		= action.user_id;
		newState.token 		    = action.token;
	}
	return newState;
}

export default reducer;