import faker from 'faker';
import { makeSampleInterestArray } from '../interest/SampleInterests';
import { Internships } from './InternshipCollection';

export const makeSampleLocation = () => ([{
  city: faker.address.city(),
  state: faker.address.state(),
  zip: faker.address.zipCode(),
}]);

export const makeSampleInternship = () => {
  const urls = [faker.internet.url()];
  const position = faker.name.jobTitle();
  const description = faker.name.jobDescriptor();
  const interests = makeSampleInterestArray(2);
  const location = makeSampleLocation();
  const missedUploads = faker.random.number();
  // console.log(description);
  return Internships.define({ urls, position, description, interests, location, missedUploads });
};
