import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Segment, Header, Image, Popup } from 'semantic-ui-react';
import _ from 'lodash';
import { Users } from '../../../api/user/UserCollection';
import { getUserIdFromRoute } from '../shared/RouterHelperFunctions';
import { ROLE } from '../../../api/role/Role';
import { IRadGradMatch, IStudentProfile } from '../../../typings/radgrad';
import { studentLevelsOthersWidget } from './student-widget-names';

interface IStudentLevelsOthersWidgetProps {
  match: IRadGradMatch;
  studentLevelName: string;
  students: IStudentProfile[];
}

const studentsExist = (students): boolean => students.length > 0;

const getStudents = (userLevel: number, props: IStudentLevelsOthersWidgetProps): IStudentProfile[] => {
  const students = [];
  const profiles = Users.findProfilesWithRole(ROLE.STUDENT, {}, {});
  _.forEach(profiles, (profile) => {
    if (profile.level === userLevel) {
      if (profile.userID !== getUserIdFromRoute(props.match)) {
        students.push(profile);
      }
    }
  });
  return students;
};

const getStudentLevelNumber = (props: IStudentLevelsOthersWidgetProps): number => {
  if (getUserIdFromRoute(props.match)) {
    const profile = Users.getProfile(getUserIdFromRoute(props.match));
    if (profile.level) {
      return profile.level;
    }
  }
  return 1;
};

const getStudentLevelName = (props: IStudentLevelsOthersWidgetProps): string => {
  if (getUserIdFromRoute(props.match)) {
    const profile = Users.getProfile(getUserIdFromRoute(props.match));
    if (profile.level) {
      return `LEVEL ${profile.level}`;
    }
  }
  return 'LEVEL 1';
};

const studentPicture = (student: IStudentProfile) => student.picture;

const fullName = (student: IStudentProfile): string => Users.getFullName(student.userID);

const StudentLevelsOthersWidget = (props: IStudentLevelsOthersWidgetProps) => {
  const imageGroupStyle = { minHeight: '50%' };
  const imageStyle = {
    height: '30px',
    width: 'auto',
  };

  const { studentLevelName, students } = props;
  return (
    <Segment padded id={`${studentLevelsOthersWidget}`}>
      <Header as="h4" dividing>
OTHER
        {studentLevelName}
        {' '}
STUDENTS
      </Header>
      {
        studentsExist(students) ? (
          <Image.Group size="mini" circular style={imageGroupStyle}>
            {
              students.map((student) => (
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

export default withRouter(withTracker((props) => {
  const studentLevelName = getStudentLevelName(props);
  const studentLevelNumber = getStudentLevelNumber(props);
  const students = getStudents(studentLevelNumber, props);
  return {
    studentLevelName,
    students,
  };
})(StudentLevelsOthersWidget));
