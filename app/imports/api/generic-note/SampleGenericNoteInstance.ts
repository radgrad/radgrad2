import faker from 'faker';
import { GenericNoteInstances } from "./GenericNoteInstanceCollection";

export const makeRandomTitle = () => {
  return faker.lorem.words();
};

export const makeRandomBody = () => {
  return faker.lorem.words()
};
