import { combineReducers } from 'redux';
import explorer from './explorer';

const shared = combineReducers({
  explorer,
});

export default shared;
