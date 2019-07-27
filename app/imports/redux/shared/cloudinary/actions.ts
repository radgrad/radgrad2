interface IAction {
  type: string;
}

interface ISetIsCloudinaryUsedAction extends IAction {
  payload: boolean;
}

interface ISetCloudinaryUrlAction extends IAction {
  payload: string;
}

export const setIsCloudinaryUsed = (type: string, isCloudinaryUsed: boolean): ISetIsCloudinaryUsedAction => ({
  type: type,
  payload: isCloudinaryUsed,
});

export const setCloudinaryUrl = (type: string, cloudinaryUrl: string): ISetCloudinaryUrlAction => ({
  type: type,
  payload: cloudinaryUrl,
});
