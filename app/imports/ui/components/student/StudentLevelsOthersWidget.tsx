import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Segment, Header, Image, Popup } from 'semantic-ui-react';
import * as _ from 'lodash';
import { Users } from '../../../api/user/UserCollection';
import { getUserIdFromRoute } from '../shared/RouterHelperFunctions';
import { ROLE } from '../../../api/role/Role';
import { IStudentProfile } from '../../../typings/radgrad'; // eslint-disable-line

interface IStudentLevelsOthersWidgetProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      opportunity: string;
    }
  };
}

class StudentLevelsOthersWidget extends React.Component<IStudentLevelsOthersWidgetProps> {
  constructor(props) {
    super(props);
  }

  private getUserIdFromRoute = (): string => getUserIdFromRoute(this.props.match);

  private studentsExist = (students): boolean => students.length > 0;

  private students = (userLevel: number): IStudentProfile[] => {
    const students = [];
    const profiles = Users.findProfilesWithRole(ROLE.STUDENT, {}, {});
    _.forEach(profiles, (profile) => {
      if (profile.level === userLevel) {
        if (profile.userID !== this.getUserIdFromRoute()) {
          students.push(profile);
        }
      }
    });
    return students;
  }

  private studentLevelNumber = (): number => {
    if (this.getUserIdFromRoute()) {
      const profile = Users.getProfile(this.getUserIdFromRoute());
      if (profile.level) {
        return profile.level;
      }
    }
    return 1;
  }

  private studentLevelName = (): string => {
    if (this.getUserIdFromRoute()) {
      const profile = Users.getProfile(this.getUserIdFromRoute());
      if (profile.level) {
        return `LEVEL ${profile.level}`;
      }
    }
    return 'LEVEL 1';
  }

  private studentPicture = (student: IStudentProfile) => student.picture;

  private fullName = (student: IStudentProfile): string => Users.getFullName(student.userID);

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const imageGroupStyle = { minHeight: '50%' };
    const imageStyle = {
      height: '30px',
      width: 'auto',
    };

    const studentLevelName = this.studentLevelName();
    const studentLevelNumber = this.studentLevelNumber();
    const students = this.students(studentLevelNumber);
    const studentsExist = this.studentsExist(students);
    return (
      <Segment padded={true}>
        <Header as="h4" dividing={true}>OTHER {studentLevelName} STUDENTS</Header>
        {
          studentsExist ?
            <Image.Group size="mini" circular={true} style={imageGroupStyle}>
              {
                students.map((student) => {
                  const fullName = this.fullName(student);
                  const studentPicture = this.studentPicture(student);
                  return (
                    <Popup key={student._id} trigger={<Image circular={true} src={studentPicture} style={imageStyle}/>}
                           position="bottom left" content={fullName}/>
                  );
                })
              }
            </Image.Group>
            :
            <i>No students to display.</i>
        }
      </Segment>
    );
  }
}

export default withRouter(StudentLevelsOthersWidget);
