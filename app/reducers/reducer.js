import {combineReducers} from 'redux';
import rdcUser from './rdcUser';

var appReducers = combineReducers({
    rdcUser : rdcUser,
});

export default appReducers;