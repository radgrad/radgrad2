import { combineReducers } from 'redux';
import home from './home';
import degreePlanner from './degree-planner';

const student = combineReducers({
  home,
  degreePlanner,
});

export default student;
