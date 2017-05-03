import {combineReducers} from 'redux';

let defaultState = {
	isLogin : false,
	userInfo:null
}



function reducer(state = defaultState,action){

	switch(action.type){
		case login : state.isLogin = true;break;
	}
	return state;
}


export default reducer;

