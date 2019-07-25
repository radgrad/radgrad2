import * as TYPES from './types';

export const setIsCloudinaryUsed = (isCloudinaryUsed: boolean) => {
  const retVal: { type: string, payload: boolean } = {
    type: TYPES.SET_IS_CLOUDINARY_USED,
    payload: isCloudinaryUsed,
  };
  return retVal;
};

export const setCloudinaryUrl = (cloudinaruUrl: string) => {
  const retVal: { type: string, payload: string } = {
    type: TYPES.SET_CLOUDINARY_URL,
    payload: cloudinaruUrl,
  };
  return retVal;
};
