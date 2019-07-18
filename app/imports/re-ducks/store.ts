import { createStore, combineReducers } from 'redux';
import advisor from './advisor';
import student from './student';
import shared from './shared';

const rootReducer = combineReducers({
  advisor,
  student,
  shared,
});

const store = createStore(rootReducer);
export default store;
