import * as TYPES from './types';

interface Action {
  type: string;
}

interface SetIsCloudinaryUsedAction extends Action {
  payload: boolean;
}

interface SetCloudinaryUrlAction extends Action {
  payload: string;
}

// Admin Data Model Users Page
export const setAdminDataModelUsersIsCloudinaryUsed = (isCloudinaryUsed: boolean): SetIsCloudinaryUsedAction => ({
  type: TYPES.SET_ADMIN_DATAMODEL_USERS_IS_CLOUDINARY_USED,
  payload: isCloudinaryUsed,
});

export const setAdminDataModelUsersCloudinaryUrl = (cloudinaryUrl: string): SetCloudinaryUrlAction => ({
  type: TYPES.SET_ADMIN_DATAMODEL_USERS_CLOUDINARY_URL,
  payload: cloudinaryUrl,
});
