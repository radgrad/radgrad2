import { Meteor } from 'meteor/meteor';
import { AdminProfiles } from '../AdminProfileCollection';
import { AdvisorProfiles } from '../AdvisorProfileCollection';
import { FacultyProfiles } from '../FacultyProfileCollection';
import { StudentProfiles } from '../StudentProfileCollection';
import { Profile } from '../../../typings/radgrad';

export const getProfileDoc = (username: string): Profile => AdminProfiles.findOne({ username }) || AdvisorProfiles.findOne({ username }) || FacultyProfiles.findOne({ username }) || StudentProfiles.findOne({ username });

export const checkUsername = (username: string): void => {
  const doc = getProfileDoc(username);
  if (doc) {
    throw new Meteor.Error(`Attempt to redefine user: ${username}`);
  }
};
