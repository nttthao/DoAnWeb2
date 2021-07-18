import * as actionType from '../constants/actionType';


var initialState = {};

var rdcUser = (state = initialState, action) => {
    switch(action.type){
        case actionType.FETCH_USER_LOGIN:
            state = action.user;
            break;
        case actionType.UPDATE_STATE_USER_LOGIN: 
            state = action.user;
            break;
        case actionType.UPDATE_STATE_USER_LOGOUT:
            state = action.user;
            break;
        default:
            break;
    }

    return state;
}

export default rdcUser;