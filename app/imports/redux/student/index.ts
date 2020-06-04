import { combineReducers } from 'redux';
import degreePlanner from './degree-planner';

const student = combineReducers({
  degreePlanner,
});

export default student;
