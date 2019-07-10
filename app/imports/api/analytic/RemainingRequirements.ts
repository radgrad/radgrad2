import { Meteor } from 'meteor/meteor';
import { CourseInstances } from '../course/CourseInstanceCollection';

export function remainingRequirements(student) {
  console.log('Meteor is server: ', Meteor.isServer);
  if (Meteor.isServer) {
    console.log('student: ', student.student, 'academic plan: ', student.studentAcademicPlanDoc);
    const coursesCompleted = [];
     coursesCompleted.push(CourseInstances.find({'studentID': student.student.userID}).fetch());
      console.log(coursesCompleted);
      // check if user has taken courses in their academic plan
    return coursesCompleted;

  }
}
