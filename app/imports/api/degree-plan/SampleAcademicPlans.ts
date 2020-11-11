import faker from 'faker';
import _ from 'lodash';
import moment from 'moment';
import slugify from '../slug/SlugCollection';
import { AcademicPlans } from './AcademicPlanCollection';
import { makeSampleAcademicTerm } from '../academic-term/SampleAcademicTerms';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { getRandomCourseSlugForDept, getRandomDepartment } from '../course/CourseUtilities';

const buildRandomCoursesPerTerm = () => {
  const coursesPerAcademicTerm = [];
  for (let i = 0; i < 12; i++) {
    coursesPerAcademicTerm.push(faker.random.number({
      min: 0,
      max: 4,
    }));
  }
  return coursesPerAcademicTerm;
};

export const makeSampleCoursesPerTerm = () => buildRandomCoursesPerTerm();

const buildCourseList = (coursesPerAcademicTerm: number[]) => {
  const numChoices = _.sum(coursesPerAcademicTerm);
  const dept = getRandomDepartment();
  const choiceList = [];
  for (let i = 0; i < numChoices; i++) {
    const slug = getRandomCourseSlugForDept(dept);
    choiceList.push(`${slug}-1`);
  }
  return choiceList;
};

export const makeSampleChoiceList = (coursesPerAcademicTerm: number[]) => buildCourseList(coursesPerAcademicTerm);

export const makeSampleAcademicPlan = () => {
  const name = faker.lorem.words();
  const slug = slugify(`academic-plan-${name}-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`);
  const description = faker.lorem.paragraph();
  const academicTermID = makeSampleAcademicTerm();
  const academicTerm = AcademicTerms.findSlugByID(academicTermID);
  const coursesPerAcademicTerm = buildRandomCoursesPerTerm();
  const choiceList = buildCourseList(coursesPerAcademicTerm);
  return AcademicPlans.define({
    name,
    slug,
    description,
    academicTerm,
    coursesPerAcademicTerm,
    choiceList,
  });
};
