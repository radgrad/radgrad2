import faker from 'faker';
import _ from 'lodash';
import { makeSampleDesiredDegree } from './SampleDesiredDegrees';
import slugify, { Slugs } from '../slug/SlugCollection';
import { DesiredDegrees } from './DesiredDegreeCollection';
import { AcademicPlans } from './AcademicPlanCollection';
import { makeSampleAcademicTerm } from '../academic-term/SampleAcademicTerms';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { getRandomCourseSlugForDept, getRandomDepartment } from '../course/CourseUtilities';

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

export function makeSampleAcademicPlan() {
  const desiredDegreeID = makeSampleDesiredDegree({});
  const degreeDoc = DesiredDegrees.findDoc(desiredDegreeID);
  const name = faker.lorem.words();
  const slug = slugify(`academic-plan-${name}`);
  const degreeSlug = Slugs.getNameFromID(degreeDoc.slugID);
  const description = faker.lorem.paragraph();
  const academicTermID = makeSampleAcademicTerm();
  const academicTerm = AcademicTerms.findSlugByID(academicTermID);
  const coursesPerAcademicTerm = [2, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0];
  const choiceList = buildCourseList(coursesPerAcademicTerm);
  return AcademicPlans.define({
    name,
    slug,
    degreeSlug,
    description,
    academicTerm,
    coursesPerAcademicTerm,
    choiceList,
  });
}
