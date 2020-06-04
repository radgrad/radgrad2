import { combineReducers } from 'redux';
import cloudinary from './cloudinary';
import pageTracking from './page-tracking';

const shared = combineReducers({
  cloudinary,
  pageTracking,
});

export default shared;
