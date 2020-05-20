import faker from 'faker';
import moment from 'moment';
import { CareerGoals } from './CareerGoalCollection';
import { makeSampleInterest } from '../interest/SampleInterests';
import slugify from '../slug/SlugCollection';

export function makeSampleCareerGoal() {
  const name = faker.lorem.word();
  const slug = slugify(`career-goal-${name}-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`);
  const description = faker.lorem.paragraph();
  const interests = [makeSampleInterest()];
  return CareerGoals.define({ name, slug, description, interests });
}
