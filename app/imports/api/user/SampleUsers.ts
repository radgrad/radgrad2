import faker from 'faker';
import { Meteor } from 'meteor/meteor';
import { StudentProfiles } from './StudentProfileCollection';
import { AdvisorProfiles } from './AdvisorProfileCollection';
import { FacultyProfiles } from './FacultyProfileCollection';
import { ROLE } from '../role/Role';
import { Users } from './UserCollection';

const makeSampleStudent = () => {
  const username = `student.${new Date().getTime()}.${faker.internet.email()}`;
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const picture = faker.image.avatar();
  const website = faker.internet.url();
  const interests = [];
  const careerGoals = [];
  const level = 6;
  const declaredAcademicTerm = 'Spring-2017';
  const profileID = StudentProfiles.define({
    username, firstName, lastName, picture, website, interests,
    careerGoals, level, declaredAcademicTerm,
  });
  return StudentProfiles.getUserID(profileID);
};

const makeSampleAdvisor = () => {
  const username = `advisor.${new Date().getTime()}.${faker.internet.email()}`;
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const picture = faker.image.avatar();
  const website = faker.internet.url();
  const interests = [];
  const careerGoals = [];
  const profileID = AdvisorProfiles.define({ username, firstName, lastName, picture, website, interests, careerGoals });
  return AdvisorProfiles.getUserID(profileID);
};

const makeSampleFaculty = () => {
  const username = `faculty.${new Date().getTime()}.${faker.internet.email()}`;
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const picture = faker.image.avatar();
  const website = faker.internet.url();
  const interests = [];
  const careerGoals = [];
  const profileID = FacultyProfiles.define({ username, firstName, lastName, picture, website, interests, careerGoals });
  return FacultyProfiles.getUserID(profileID);
};

/**
 * Creates a User based upon the specified role.
 * If role is not supplied, it defaults to ROLE.STUDENT.
 * @returns { String } The docID of the newly generated User.
 * @memberOf api/user
 */
export const makeSampleUser = (role: string = ROLE.STUDENT) => {
  if (role === ROLE.STUDENT) {
    return makeSampleStudent();
  }
  if (role === ROLE.FACULTY) {
    return makeSampleFaculty();
  }
  if (role === ROLE.ADVISOR) {
    return makeSampleAdvisor();
  }
  throw new Meteor.Error(`Unexpected role: ${role}`);
};

/**
 * Returns an array of defined usernames.
 * @param num the number of user to define. Defaults to 1.
 * @param role the Role of the users. Defaults to STUDENT.
 * @return an array of defined usernames.
 */
export const makeSampleUserArray = (num = 1, role: string = ROLE.STUDENT) => {
  const retVal = [];
  for (let i = 0; i < num; i++) {
    retVal.push(Users.getProfile(makeSampleUser(role)).username);
  }
  return retVal;
};
