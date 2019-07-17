import { createStore, combineReducers } from 'redux';
import advisor from './advisor';

const rootReducer = combineReducers({
  advisor,
});

const store = createStore(rootReducer);
export default store;
