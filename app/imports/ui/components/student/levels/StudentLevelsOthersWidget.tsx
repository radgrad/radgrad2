import React from 'react';
import { Segment, Header, Image, Popup } from 'semantic-ui-react';
import { Users } from '../../../../api/user/UserCollection';
import { IStudentProfile } from '../../../../typings/radgrad';

interface IStudentLevelsOthersWidgetProps {
  students: IStudentProfile[];
  profile : IStudentProfile;
}

const studentsExist = (students): boolean => students.length > 0;

const getStudentLevelName = (props: IStudentLevelsOthersWidgetProps): string => {
  if (props.profile.level) {
    return `LEVEL ${props.profile.level}`;
  }
  return 'LEVEL 1';
};

const studentPicture = (student: IStudentProfile) => student.picture;

const fullName = (student: IStudentProfile): string => Users.getFullName(student.userID);

const StudentLevelsOthersWidget: React.FC<IStudentLevelsOthersWidgetProps> = (props) => {
  const imageGroupStyle = { minHeight: '50%' };
  const imageStyle = {
    height: '30px',
    width: 'auto',
  };
  const studentLevelName = getStudentLevelName(props);
  const students = props.students;
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
