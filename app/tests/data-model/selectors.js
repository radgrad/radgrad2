import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../../imports/ui/utilities/ComponentIDs';

export const courseSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_COURSE}`);
export const courseOption = courseSelector.find('option');
export const creditHoursSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_CREDIT_HOURS}`);
export const descriptionSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_DESCRIPTION}`);
export const gradeSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_GRADE}`);
export const gradeOption = gradeSelector.find('option');
export const interestsSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_INTERESTS}`);
export const interestsOption = interestsSelector.find('div span');
export const nameSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_NAME}`);
export const numSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_NUM}`);
export const pictureSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_PICTURE}`);
export const shortNameSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_SHORT_NAME}`);
export const slugSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_SLUG}`);
export const studentSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_STUDENT}`);
export const studentOption = studentSelector.find('option');
export const studentNames = {
  abi: 'Abigail Kealoha (abi@hawaii.edu)',
  betty: 'Betty Keanu (betty@hawaii.edu)',
  charley: 'Charley Sherry (charley@hawaii.edu)',
  dora: 'Dora Velasquez (dora@hawaii.edu)',
  ella: 'Ella Zwick (ella@hawaii.edu)',
};
export const submitSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_SUBMIT}`);
export const syllabusSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_SYLLABUS}`);
export const termSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_ACADEMIC_TERM}`);
export const termOption = termSelector.find('option');
export const yearSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_YEAR}`);
