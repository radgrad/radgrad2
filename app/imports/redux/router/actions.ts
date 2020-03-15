import * as TYPES from './types';

interface IAction {
  type: string;
}

interface ISetLastPathnameAction extends IAction {
  payload: string;
}

export const setLastPathname = (lastPathname: string): ISetLastPathnameAction => ({
  type: TYPES.SET_LAST_PATHNAME,
  payload: lastPathname,
});
