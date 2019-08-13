import * as TYPES from './types';

interface IAction {
  type: string;
}

interface ISetIsCloudinaryUsedAction extends IAction {
  payload: boolean;
}

interface ISetCloudinaryUrlAction extends IAction {
  payload: string;
}

// Admin Data Model Feeds Page
export const setAdminDataModelFeedsIsCloudinaryUsed = (isCloudinaryUsed: boolean): ISetIsCloudinaryUsedAction => ({
  type: TYPES.SET_ADMIN_DATAMODEL_FEEDS_IS_CLOUDINARY_USED,
  payload: isCloudinaryUsed,
});

export const setAdminDataModelFeedsCloudinaryUrl = (cloudinaryUrl: string): ISetCloudinaryUrlAction => ({
  type: TYPES.SET_ADMIN_DATAMODEL_FEEDS_CLOUDINARY_URL,
  payload: cloudinaryUrl,
});

// Admin Data Model Users Page
export const setAdminDataModelUsersIsCloudinaryUsed = (isCloudinaryUsed: boolean): ISetIsCloudinaryUsedAction => ({
  type: TYPES.SET_ADMIN_DATAMODEL_USERS_IS_CLOUDINARY_USED,
  payload: isCloudinaryUsed,
});

export const setAdminDataModelUsersCloudinaryUrl = (cloudinaryUrl: string): ISetCloudinaryUrlAction => ({
  type: TYPES.SET_ADMIN_DATAMODEL_USERS_CLOUDINARY_URL,
  payload: cloudinaryUrl,
});

// Mentor Home Page
export const setMentorHomeIsCloudinaryUsed = (isCloudinaryUsed: boolean): ISetIsCloudinaryUsedAction => ({
  type: TYPES.SET_MENTOR_HOME_IS_CLOUDINARY_USED,
  payload: isCloudinaryUsed,
});

export const setMentorHomeCloudinaryUrl = (cloudinaryUrl: string): ISetCloudinaryUrlAction => ({
  type: TYPES.SET_MENTOR_HOME_CLOUDINARY_URL,
  payload: cloudinaryUrl,
});
