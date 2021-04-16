import React from 'react';
import {  Header, Label } from 'semantic-ui-react';
import { Users } from '../../../../api/user/UserCollection';
import { StudentProfile } from '../../../../typings/radgrad';
import ProfileLabel from "../../shared/profile/ProfileLabel";

interface StudentLevelsOthersWidgetProps {
  students: StudentProfile[];
  profile: StudentProfile;
}

const studentsExist = (students): boolean => students.length > 0;

const getStudentLevelName = (profile: StudentProfile): string => {
  if (profile.level) {
    return `LEVEL ${profile.level}`;
  }
  return 'LEVEL 1';
};

const studentPicture = (student: StudentProfile) => student.picture;

const fullName = (student: StudentProfile): string => Users.getFullName(student.userID);

const StudentLevelsOthersWidget: React.FC<StudentLevelsOthersWidgetProps> = ({ students, profile }) => {
  const imageGroupStyle = { minHeight: '50%' };
  const studentLevelName = getStudentLevelName(profile);
  return (
    <div>
        <Header as="h4" dividing>
            OTHER {studentLevelName} STUDENTS
        </Header>
        {studentsExist(students) ? (
            <Label.Group size="mini" circular style={imageGroupStyle}>
                {students.map((student) => (
                    // FIXME the <Image circular> gives a console warning:
                    // "Warning: Received `true` for a non-boolean attribute `circular`."
                    // Not really our problem, more of a Semantic UI React problem as "circular" is a boolean attribute.
                    // This has happened for other Semantic UI React components in the past but after a while those warnings
                    // disappear for whatever reason. So no need to really fix this, just putting this here that this warning
                    // can pop up.
                    <ProfileLabel image={studentPicture(student)} name={fullName(student)} level={profile.level}/>
                ))}
            </Label.Group>
        ) : (
            <i>No students to display.</i>
        )}
    </div>
  );
};

export default StudentLevelsOthersWidget;
