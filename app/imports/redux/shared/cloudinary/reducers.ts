import * as TYPES from './types';

interface ICloudinaryState {
  isCloudinaryUsed: boolean;
  cloudinaryUrl: string;
}

interface IState {
  adminDataModelFeeds: ICloudinaryState;
  adminDataModelUsers: ICloudinaryState;
}

const initialState: IState = {
  adminDataModelFeeds: {
    isCloudinaryUsed: false,
    cloudinaryUrl: '',
  },
  adminDataModelUsers: {
    isCloudinaryUsed: false,
    cloudinaryUrl: '',
  },
};

function reducer(state: IState = initialState, action: { [props: string]: any }): IState {
  let s: IState;
  let otherKeys: ICloudinaryState;
  switch (action.type) {
    case TYPES.SET_ADMIN_DATAMODEL_FEEDS_IS_CLOUDINARY_USED:
      otherKeys = state.adminDataModelFeeds;
      s = {
        ...state,
        adminDataModelFeeds: {
          ...otherKeys,
          isCloudinaryUsed: action.payload,
        },
      };
      return s;
    case TYPES.SET_ADMIN_DATAMODEL_FEEDS_CLOUDINARY_URL:
      otherKeys = state.adminDataModelFeeds;
      s = {
        ...state,
        adminDataModelFeeds: {
          ...otherKeys,
          cloudinaryUrl: action.payload,
        },
      };
      return s;
    case TYPES.SET_ADMIN_DATAMODEL_USERS_IS_CLOUDINARY_USED:
      otherKeys = state.adminDataModelUsers;
      s = {
        ...state,
        adminDataModelUsers: {
          ...otherKeys,
          isCloudinaryUsed: action.payload,
        },
      };
      return s;
    case TYPES.SET_ADMIN_DATAMODEL_USERS_CLOUDINARY_URL:
      otherKeys = state.adminDataModelUsers;
      s = {
        ...state,
        adminDataModelUsers: {
          ...otherKeys,
          cloudinaryUrl: action.payload,
        },
      };
      return s;
    default:
      return state;
  }
}

export default reducer;
