import { combineReducers } from 'redux';
import explorer from './explorer';
import cloudinary from './cloudinary';

const shared = combineReducers({
  explorer,
  cloudinary,
});

export default shared;
