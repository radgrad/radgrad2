import { combineReducers } from 'redux';
import dataModel from './data-model';
import database from './database';
import analytics from './analytics';

const admin = combineReducers({
  dataModel,
  database,
  analytics,
});

export default admin;
