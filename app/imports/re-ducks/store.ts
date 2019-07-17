import { createStore, combineReducers } from 'redux';
import advisor from './advisor';
import student from './student';

const rootReducer = combineReducers({
  advisor,
  student,
});

const store = createStore(rootReducer);
export default store;
