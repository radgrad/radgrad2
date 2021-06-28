import { Selector } from 'testcafe';
import { COMPONENTIDS } from '../../imports/ui/utilities/ComponentIDs';

export const authorSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_AUTHOR}`);
export const careerGoalSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_CAREER_GOALS}`);
export const careerGoalOption = careerGoalSelector.find('div span');
export const careerGoalNames = {
  data: 'Data Scientist',
  grad: 'Graduate School',
  software: 'Software Developer',
  teacher: 'Teacher',
};
export const courseSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_COURSE}`);
export const courseOption = courseSelector.find('option');
export const creditHoursSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_CREDIT_HOURS}`);
export const descriptionSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_DESCRIPTION}`);
export const durationSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_DURATION}`);
export const errorFieldSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_ERROR_FIELD}`);
export const eventDate1Selector = new Selector(`#${COMPONENTIDS.DATA_MODEL_EVENT_DATE_1}`);
export const eventDate1LabelSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_EVENT_DATE_1_LABEL}`);
export const eventDate2Selector = new Selector(`#${COMPONENTIDS.DATA_MODEL_EVENT_DATE_2}`);
export const eventDate2LabelSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_EVENT_DATE_2_LABEL}`);
export const eventDate3Selector = new Selector(`#${COMPONENTIDS.DATA_MODEL_EVENT_DATE_3}`);
export const eventDate3LabelSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_EVENT_DATE_3_LABEL}`);
export const eventDate4Selector = new Selector(`#${COMPONENTIDS.DATA_MODEL_EVENT_DATE_4}`);
export const eventDate4LabelSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_EVENT_DATE_4_LABEL}`);
export const firstNameSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_FIRST_NAME}`);
export const gradeSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_GRADE}`);
export const gradeOption = gradeSelector.find('option');
export const iceISelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_ICE_I}`);
export const iceCSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_ICE_C}`);
export const iceESelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_ICE_E}`);
export const interestsSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_INTERESTS}`);
export const interestsOption = interestsSelector.find('div span');
export const interestTypeSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_INTEREST_TYPE}`);
export const interestTypeOption = interestTypeSelector.find('option');
export const interestNames = {
  civic_engagement: 'Civic Engagement',
  c_sharp: 'C#',
  data_science: 'Data Science',
  dot_net: '.NET',
  quantum_computing: 'Quantum Computing',
  software_engineering: 'Software Engineering',
};
export const lastNameSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_LAST_NAME}`);
export const nameSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_NAME}`);
export const numSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_NUM}`);
export const opportunitySelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_OPPORTUNITY}`);
export const opportunityOption = opportunitySelector.find('option');
export const opportunityTypeSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_OPPORTUNITY_TYPE}`);
export const opportunityTypeOption = opportunityTypeSelector.find('option');
export const pictureSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_PICTURE}`);
export const roleSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_ROLE}`);
export const roleOption = roleSelector.find('option');
export const shortNameSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_SHORT_NAME}`);
export const slugSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_SLUG}`);
export const sponsorSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_SPONSOR}`);
export const sponsorOption = sponsorSelector.find('option');
export const sponsorNames = {
  esb: 'Edo Biagioni (esb@hawaii.edu)',
  henric: 'Henri Casanova (henric@hawaii.edu)',
  johnson: 'Philip Johnson (johnson@hawaii.edu)',
  kennydq: 'Kenny Quibilan (kennydq@hawaii.edu)',
  psadow: 'Peter Sadowski (psadow@hawaii.edu)',
};
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
export const targetSlugSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_TARGET_SLUG}`);
export const targetSlugOption = targetSlugSelector.find('option');
export const termSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_ACADEMIC_TERM}`);
export const termOption = termSelector.find('option');
export const titleSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_TITLE}`);
export const usernameSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_USERNAME}`);
export const verifiedSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_VERIFIED}`);
export const websiteSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_WEBSITE}`);
export const yearSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_YEAR}`);
export const youtubeIdSelector = new Selector(`#${COMPONENTIDS.DATA_MODEL_YOUTUBE_ID}`);
