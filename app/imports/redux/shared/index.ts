import { combineReducers } from 'redux';
import cloudinary from './cloudinary';

const shared = combineReducers({
  cloudinary,
});

export default shared;
