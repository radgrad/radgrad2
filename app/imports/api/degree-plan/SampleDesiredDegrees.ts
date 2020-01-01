import faker from 'faker';
import { DesiredDegrees } from './DesiredDegreeCollection';

export function makeSampleDesiredDegree(args) {
  const name = faker.lorem.words();
  const shortName = faker.lorem.word();
  const slug = `degree-${shortName}`;
  const description = args && args.description ? args.description : faker.lorem.paragraph();
  return DesiredDegrees.define({ name, shortName, slug, description });
}
