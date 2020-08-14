import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import * as TYPES from './types';

export const setCardsShowIndex = (explorerType: string, index: number) => {
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
