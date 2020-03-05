import faker from 'faker';
import { GenericNoteInstances } from './GenericNoteInstanceCollection';
import { makeSampleUser } from '../user/SampleUsers';
import { makeSampleAcademicTerm } from '../academic-term/SampleAcademicTerms';

/**
 * Creates a GenericNoteInstance
 * @returns { String } The docID of the newly generated NoteInstance
 * @memberOf api/generic-note
 */
export const makeSampleGenericNoteInstance = () => {
  const title = faker.lorem.words();
  const body = faker.lorem.words();
  const academicTerm = makeSampleAcademicTerm();
  const student = makeSampleUser('STUDENT');
  return GenericNoteInstances.define({ title, body, academicTerm, student });
};

/**
 * @returns { String } random title
 */
export const makeRandomTitle = () => faker.lorem.words();

export const makeRandomBody = () => faker.lorem.sentences();
