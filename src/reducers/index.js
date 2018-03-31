import {combineReducers} from 'redux';
import UserSession from './user-session';
import AllProjects from './all_projects';

/*
 * We combine all reducers into a single object before updated data is dispatched (sent) to store
 * Your entire applications state (store) is just whatever gets returned from all your reducers
 * */

const allReducers = combineReducers({
    userLoggedIn: UserSession,
    all_projects: AllProjects
});

export default allReducers