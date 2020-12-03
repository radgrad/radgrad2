import { IDescriptionPair, Ice } from '../../../../../../../typings/radgrad';
import { isICE } from '../../../../../../../api/ice/IceProcessor';

// eslint-disable-next-line @typescript-eslint/ban-types
export const toValueArray = (pair: IDescriptionPair): any[] => {
  const value = pair.value;
  if (typeof value === 'string') {
    return [value];
  }
  if (typeof value === 'object') {
    // @ts-ignore
    return value;
  }
  return [];
};

export const toValueString = (pair: IDescriptionPair): string => {
  const value = pair.value;
  // console.log(pair);
  if (typeof value === 'string') {
    return value;
  }
  if (isICE(value as unknown as Ice)) {
    const ice: Ice = value as unknown as Ice;
    return `I: ${ice.i}, C: ${ice.c}, E: ${ice.e}`;
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return '';
};

export const toId = (pair: IDescriptionPair): string => `${pair.label}${toValueString(pair)}`;
