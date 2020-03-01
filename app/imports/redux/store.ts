import { createStore, combineReducers } from 'redux';
import admin from './admin';
import advisor from './advisor';
import shared from './shared';
import student from './student';

/* global window */

export const rootReducer = combineReducers({
  admin,
  advisor,
  shared,
  student,
});

const store = createStore(
  rootReducer,
  // @ts-ignore
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
export default store;
