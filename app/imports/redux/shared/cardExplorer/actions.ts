import { EXPLORER_TYPE } from '../../../ui/layouts/utilities/route-constants';
import * as TYPES from './types';

export const setShowIndex = (explorerType: string, index: number) => {
  const retVal: { type?: string, payload?: number } = {};
  retVal.payload = index;
  switch (explorerType) {
    case EXPLORER_TYPE.OPPORTUNITIES:
      retVal.type = TYPES.SET_OPPORTUNITIES_SHOW_INDEX;
      break;
    default:
      break;
  }
  return retVal;
};
