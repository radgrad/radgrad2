import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Segment, Header, Image, Popup } from 'semantic-ui-react';
import _ from 'lodash';
import { Users } from '../../../../api/user/UserCollection';
import { getUserIdFromRoute } from '../../shared/utilities/router';
import { ROLE } from '../../../../api/role/Role';
import { IStudentProfile } from '../../../../typings/radgrad';

interface IStudentLevelsOthersWidgetProps {
  students: IStudentProfile[];
}

const studentsExist = (students): boolean => students.length > 0;

const getStudents = (userLevel: number, match): IStudentProfile[] => {
  const students = [];
  const profiles = Users.findProfilesWithRole(ROLE.STUDENT, {}, {});
  _.forEach(profiles, (profile) => {
    if (profile.level === userLevel) {
      if (profile.userID !== getUserIdFromRoute(match)) {
        students.push(profile);
      }
    }
  });
  return students;
};

const getStudentLevelNumber = (match): number => {
  if (getUserIdFromRoute(match)) {
    const profile = Users.getProfile(getUserIdFromRoute(match));
    if (profile.level) {
      return profile.level;
    }
  }
  return 1;
};

const getStudentLevelName = (match): string => {
  if (getUserIdFromRoute(match)) {
    const profile = Users.getProfile(getUserIdFromRoute(match));
    if (profile.level) {
      return `LEVEL ${profile.level}`;
    }
  }
  return 'LEVEL 1';
};

const studentPicture = (student: IStudentProfile) => student.picture;

const fullName = (student: IStudentProfile): string => Users.getFullName(student.userID);

const StudentLevelsOthersWidget: React.FC<IStudentLevelsOthersWidgetProps> = () => {
  const match = useRouteMatch();
  const imageGroupStyle = { minHeight: '50%' };
  const imageStyle = {
    height: '30px',
    width: 'auto',
  };
  const studentLevelName = getStudentLevelName(match);
  const studentLevelNumber: number = getStudentLevelNumber(match);
  const students: IStudentProfile[] = getStudents(studentLevelNumber, match);
  return (
    <Segment padded id="studentLevelsOthersWidget">
      <Header as="h4" dividing>
        OTHER {studentLevelName} STUDENTS
      </Header>
      {
        studentsExist(students) ? (
          <Image.Group size="mini" circular style={imageGroupStyle}>
            {
              students.map((student) => (
                // FIXME the <Image circular> gives a console warning:
                // "Warning: Received `true` for a non-boolean attribute `circular`."
                // Not really our problem, more of a Semantic UI React problem as "circular" is a boolean attribute.
                // This has happened for other Semantic UI React components in the past but after a while those warnings
                // disappear for whatever reason. So no need to really fix this, just putting this here that this warning
                // can pop up.
                <Popup
                  key={student._id}
                  trigger={<Image circular src={studentPicture(student)} style={imageStyle} />}
                  position="bottom left"
                  content={fullName(student)}
                />
              ))
            }
          </Image.Group>
        )
          :
          <i>No students to display.</i>
      }
    </Segment>
  );
};

export default StudentLevelsOthersWidget;
