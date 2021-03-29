import React from 'react';
import {StudentProfile} from '../../../../typings/radgrad';
import ProfileLabel from './ProfileLabel';

export interface StudentProfileLabelProps {
  studentProfile: StudentProfile;
}

const StudentProfileLabel: React.FC<StudentProfileLabelProps> = ({studentProfile}) => {
  const {firstName, lastName, picture, level, shareLevel, sharePicture } = studentProfile;
  const name = `${firstName} ${lastName}`;
  return (
    <ProfileLabel name={name} key={name} image={sharePicture && picture} level={shareLevel && level}/>
  );
};

export default StudentProfileLabel;
