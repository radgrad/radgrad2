import React from 'react';
import {StudentProfile} from '../../../../typings/radgrad';
import ProfileCard from './ProfileCard';

export interface StudentProfileCardProps {
  studentProfile: StudentProfile;
  fluid?: boolean;
}

const StudentProfileCard: React.FC<StudentProfileCardProps> = ({studentProfile, fluid = false}) => {
  const {username, firstName, lastName, picture, website, level, shareCareerGoals, shareCourses, shareInterests,
    shareLevel, shareOpportunities, sharePicture, shareWebsite } = studentProfile;
  const name = `${firstName} ${lastName}`;
  const careerGoals = shareCareerGoals && ['Data Scientist'];
  const interests = shareInterests && ['c++'];
  const courses = shareCourses && ['ICS 211'];
  const ice = {i: 66, c: 55, e: 27 };
  const opportunities =  shareOpportunities && ['hacc'];
  return (
   <ProfileCard email={username} name={name} careerGoals={careerGoals} interests={interests} courses={courses} ice={ice} image={sharePicture && picture} level={shareLevel && level} opportunities={opportunities} website={shareWebsite && website} key={username} fluid/>
  );
};

export default StudentProfileCard;
