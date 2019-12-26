import { IDescriptionPair } from '../../typings/radgrad';

export const toValueArray = (pair: IDescriptionPair): any[] => {
  const value = pair.value;
  if (typeof value === 'string') {
    return [value];
  }
  return [];
};

export const toValueString = (pair: IDescriptionPair): string => {
  const value = pair.value;
  if (typeof value === 'string') {
    return value;
  }
  return value.join(', ');
};

export const toId = (pair: IDescriptionPair): string => `${pair.label}${toValueString(pair)}`;
