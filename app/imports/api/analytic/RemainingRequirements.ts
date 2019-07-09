import * as React from 'react';
import { Meteor } from 'meteor/meteor';

export function remainingRequirements(student, academicPlan) {
  console.log('Meteor is server: ', Meteor.isServer);
  if (Meteor.isServer) {
    console.log('student document: ', student, 'academic plan document', academicPlan);
  }
}
