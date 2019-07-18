import { createStore, combineReducers } from 'redux';
import admin from './admin';
import advisor from './advisor';
import shared from './shared';
import student from './student';

const rootReducer = combineReducers({
  admin,
  advisor,
  shared,
  student,
});

const store = createStore(rootReducer);
export default store;
