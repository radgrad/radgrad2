import { combineReducers } from 'redux';
import cloudinary from './cloudinary';
import scrollPosition from './scrollPosition';

const shared = combineReducers({
  cloudinary,
  scrollPosition,
});

export default shared;
