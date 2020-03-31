import faker from 'faker';
import { getRandomCourseSlugForDept, getRandomDepartment } from '../course/CourseUtilities';

export interface ImakeSinglePlanChoiceArgs {
  dept?: string;
  courseNum?: number;
  choiceNum?: number;
}

export const makeSinglePlanChoice = (args: ImakeSinglePlanChoiceArgs): string => {
  const dept = args.dept ? args.dept : getRandomDepartment(faker.random.number({
    min: 2,
    max: 4,
  }));
  const courseNum = args.courseNum ? args.courseNum : faker.random.number({
    min: 100,
    max: 800,
  });
  const choiceNum = args.choiceNum ? args.choiceNum : faker.random.number({
    min: 1,
    max: 6,
  });
  return `${dept}_${courseNum}-${choiceNum}`;
};

export interface ImakeSimplePlanChoice {
  dept?: string;
  choice1?: string;
  choice2?: string;
  choiceNum?: number;
}

export const makeSimplePlanChoice = (args: ImakeSimplePlanChoice) => {
  const dept = args.dept ? args.dept : getRandomDepartment(faker.random.number({
    min: 2,
    max: 4,
  }));
  const choice1 = args.choice1 ? args.choice1 : getRandomCourseSlugForDept(dept);
  const choice2 = args.choice2 ? args.choice2 : getRandomCourseSlugForDept(dept);
  const choiceNum = args.choiceNum ? args.choiceNum : faker.random.number({ min: 1, max: 6 });
  return `${choice1},${choice2}-${choiceNum}`;
};

export interface ImakeComplexPlanChoice {
  dept?: string;
  choice1?: string;
  choice2?: string;
  choice3?: string;
  choice4?: string;
  choiceNum?: number;
}

export const makeComplexPlanChoice = (args: ImakeComplexPlanChoice) => {
  const dept = args.dept ? args.dept : getRandomDepartment(faker.random.number({
    min: 2,
    max: 4,
  }));
  const choice1 = args.choice1 ? args.choice1 : getRandomCourseSlugForDept(dept);
  const choice2 = args.choice2 ? args.choice2 : getRandomCourseSlugForDept(dept);
  const choice3 = args.choice3 ? args.choice3 : getRandomCourseSlugForDept(dept);
  const choice4 = args.choice4 ? args.choice4 : getRandomCourseSlugForDept(dept);
  const choiceNum = args.choiceNum ? args.choiceNum : faker.random.number({ min: 1, max: 6 });
  return `(${choice1},${choice2}),(${choice3},${choice4})-${choiceNum}`;
};
