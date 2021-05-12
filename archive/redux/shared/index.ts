import { combineReducers } from 'redux';
import cloudinary from './cloudinary';
import scrollPosition from './scrollPosition';
import cardExplorer from './cardExplorer';

const shared = combineReducers({
  cardExplorer,
  cloudinary,
  scrollPosition,
});

export default shared;
