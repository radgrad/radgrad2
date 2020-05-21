import { combineReducers } from 'redux';
import home from './home';
import academicPlan from './academic-plan';

const advisor = combineReducers({
  home,
  academicPlan,
});

export default advisor;
