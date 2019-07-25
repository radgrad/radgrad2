import * as TYPES from './types';

interface IState {
  isCloudinaryUsed: boolean;
  cloudinaryUrl: string;
}

const initialState: IState = {
  isCloudinaryUsed: false,
  cloudinaryUrl: '',
};

export function reducer(state: IState = initialState, action): IState {
  let s;
  switch (action.type) {
    case TYPES.SET_IS_CLOUDINARY_USED:
      s = {
        ...state,
        isCloudinaryUsed: action.payload,
      };
      return s;
    case TYPES.SET_CLOUDINARY_URL:
      s = {
        ...state,
        cloudinaryUrl: action.payload,
      };
      return s;
    default:
      return state;
  }
}

export default reducer;
