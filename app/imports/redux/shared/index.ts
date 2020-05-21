import { combineReducers } from 'redux';
import explorer from './explorer';
import cloudinary from './cloudinary';
import pageTracking from './page-tracking';

const shared = combineReducers({
  explorer,
  cloudinary,
  pageTracking,
});

export default shared;
