import faker from 'faker';
import { getRandomDepartment } from '../course/CourseUtilities';

export interface ImakeSimplePlanChoiceArgs {
  dept?: string;
  courseNum?: number;
  choiceNum?: number;
}

export const makeSimplePlanChoice = (args: ImakeSimplePlanChoiceArgs): string => {
  const dept = args.dept ? args.dept : getRandomDepartment();
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

export interface ImakeOrPlanChoice {
  dept?: string;
  choice1?: string;
  choice2?: string;
}

export const makeOrPlanChoice = (args: ImakeOrPlanChoice) => {

};
