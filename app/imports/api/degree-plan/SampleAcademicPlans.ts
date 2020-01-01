import faker from 'faker';
import _ from 'lodash';
import { makeSampleDesiredDegree } from './SampleDesiredDegrees';
import { Slugs } from '../slug/SlugCollection';
import { DesiredDegrees } from './DesiredDegreeCollection';
import { AcademicPlans } from './AcademicPlanCollection';
import { makeSampleAcademicTerm } from '../academic-term/SampleAcademicTerms';
import { AcademicTerms } from '../academic-term/AcademicTermCollection';
import { getRandomCourseSlugForDept, getRandomDepartment } from '../course/CourseUtilities';

const buildCourseList = (coursesPerAcademicTerm: number[]) => {
  const numChoices = _.sum(coursesPerAcademicTerm);
  const dept = getRandomDepartment();
  const courseList = [];
  for (let i = 0; i < numChoices; i++) {
    courseList.push(`${getRandomCourseSlugForDept(dept)}-1`);
  }
  return courseList;
};

export function makeSampleAcademicPlan() {
  const desiredDegreeID = makeSampleDesiredDegree({});
  const degreeDoc = DesiredDegrees.findDoc(desiredDegreeID);
  const name = faker.lorem.words();
  const slug = `academic-plan-${name}`;
  const degreeSlug = Slugs.getNameFromID(degreeDoc.slugID);
  const description = faker.lorem.paragraph();
  const academicTermID = makeSampleAcademicTerm();
  const academicTerm = AcademicTerms.getSlug(academicTermID);
  const coursesPerAcademicTerm = [2, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0];
  const courseList = buildCourseList(coursesPerAcademicTerm);
  return AcademicPlans.define({
    name,
    slug,
    degreeSlug,
    description,
    academicTerm,
    coursesPerAcademicTerm,
    courseList,
  });
}
