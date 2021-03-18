import * as TYPES from './types';

interface CloudinaryState {
  isCloudinaryUsed: boolean;
  cloudinaryUrl: string;
}

interface State {
  adminDataModelFeeds: CloudinaryState;
  adminDataModelUsers: CloudinaryState;
}

const initialState: State = {
  adminDataModelFeeds: {
    isCloudinaryUsed: false,
    cloudinaryUrl: '',
  },
  adminDataModelUsers: {
    isCloudinaryUsed: false,
    cloudinaryUrl: '',
  },
};

const reducer = (state: State = initialState, action: { [props: string]: any }): State => {
  let s: State;
  let otherKeys: CloudinaryState;
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
};

export default reducer;
