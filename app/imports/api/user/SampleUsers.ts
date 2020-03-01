import faker from 'faker';
import { Meteor } from 'meteor/meteor';
import { StudentProfiles } from './StudentProfileCollection';
import { AdvisorProfiles } from './AdvisorProfileCollection';
import { MentorProfiles } from './MentorProfileCollection';
import { FacultyProfiles } from './FacultyProfileCollection';
import { ROLE } from '../role/Role';

function makeSampleStudent() {
  const username = `student.${faker.internet.email()}`;
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
}

function makeSampleMentor() {
  const username = `mentor.${faker.internet.email()}`;
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const picture = faker.image.avatar();
  const website = faker.internet.url();
  const interests = [];
  const careerGoals = [];
  const company = faker.company.companyName();
  const career = faker.name.title();
  const location = faker.address.city();
  const linkedin = faker.lorem.word();
  const motivation = faker.company.bs();
  const profileID = MentorProfiles.define({
    username, firstName, lastName, picture, website, interests,
    careerGoals, company, career, location, linkedin, motivation,
  });
  return MentorProfiles.getUserID(profileID);
}

function makeSampleAdvisor() {
  const username = `advisor.${faker.internet.email()}`;
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const picture = faker.image.avatar();
  const website = faker.internet.url();
  const interests = [];
  const careerGoals = [];
  const profileID = AdvisorProfiles.define({ username, firstName, lastName, picture, website, interests, careerGoals });
  return AdvisorProfiles.getUserID(profileID);
}

function makeSampleFaculty() {
  const username = `faculty.${faker.internet.email()}`;
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const picture = faker.image.avatar();
  const website = faker.internet.url();
  const interests = [];
  const careerGoals = [];
  const profileID = FacultyProfiles.define({ username, firstName, lastName, picture, website, interests, careerGoals });
  return FacultyProfiles.getUserID(profileID);
}

/**
 * Creates a User based upon the specified role.
 * If role is not supplied, it defaults to ROLE.STUDENT.
 * @returns { String } The docID of the newly generated User.
 * @memberOf api/user
 */
export function makeSampleUser(role: string = ROLE.STUDENT) {
  if (role === ROLE.STUDENT) {
    return makeSampleStudent();
  }
  if (role === ROLE.FACULTY) {
    return makeSampleFaculty();
  }
  if (role === ROLE.ADVISOR) {
    return makeSampleAdvisor();
  }
  if (role === ROLE.MENTOR) {
    return makeSampleMentor();
  }
  throw new Meteor.Error(`Unexpected role: ${role}`);
}
