import faker from 'faker';
import moment from 'moment';
import { DesiredDegrees } from './DesiredDegreeCollection';
import slugify from '../slug/SlugCollection';

export function makeSampleDesiredDegree(args) {
  const name = faker.lorem.words();
  const shortName = faker.lorem.word();
  const slug = slugify(`degree-${shortName}-${moment().format('YYYY-MM-DD-HH-mm-ss-SSSSS')}`);
  const description = args && args.description ? args.description : faker.lorem.paragraph();
  return DesiredDegrees.define({ name, shortName, slug, description });
}
