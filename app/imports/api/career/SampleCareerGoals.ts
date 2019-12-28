import faker from 'faker';
import { CareerGoals } from './CareerGoalCollection';
import { makeSampleInterest } from '../interest/SampleInterests';

export function makeSampleCareerGoal() {
  const name = faker.lorem.word();
  const slug = `career-goal-${name}`;
  const description = faker.lorem.paragraph();
  const interests = [makeSampleInterest()];
  return CareerGoals.define({ name, slug, description, interests });
}
