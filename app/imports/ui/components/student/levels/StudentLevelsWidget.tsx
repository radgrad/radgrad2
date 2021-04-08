import React from 'react';
import Markdown from 'react-markdown';
import {Segment, Grid, Container, Message, Icon, Image, Header, Popup} from 'semantic-ui-react';
import {getLevelCongratsMarkdown, getLevelHintStringMarkdown} from '../../../../api/level/LevelProcessor';
import { StudentProfile } from '../../../../typings/radgrad';
import {ICE, URL_ROLES} from '../../../layouts/utilities/route-constants';
import { Users } from '../../../../api/user/UserCollection';
import {getUsername} from '../../shared/utilities/router';
import { Link, useRouteMatch } from 'react-router-dom';

export interface StudentLevelsWidgetProps {
  profile: StudentProfile;
  students: StudentProfile[];
}

const getStudentLevelName = (profile: StudentProfile): string => {
  if (profile.level) {
    return `LEVEL ${profile.level}`;
  }
  return 'LEVEL 1';
};

const getStudentLevelHint = (profile: StudentProfile): string => {
  let levelNumber = 0;
  levelNumber = profile.level;
  switch (levelNumber) {
    case 1:
      return getLevelHintStringMarkdown('two');
    case 2:
      return getLevelHintStringMarkdown('three');
    case 3:
      return getLevelHintStringMarkdown('four');
    case 4:
      return getLevelHintStringMarkdown('five');
    case 5:
      return getLevelHintStringMarkdown('six');
    case 6:
      return 'Congratulations!  You have reached the top of the RadGrad mountain!  As a Level 6 RadGrad Ninja, you need not strive any further. There are no further levels to reach.';
    default:
      return 'No level available for this student';
  }
};

const studentsExist = (students): boolean => students.length > 0;

const studentPicture = (student: StudentProfile) => student.picture;

const fullName = (student: StudentProfile): string => Users.getFullName(student.userID);

const getStudentLevelCongrats = (profile: StudentProfile): string => {
  let levelNumber = 0;
  levelNumber = profile.level;
  switch (levelNumber) {
    case 1:
      return getLevelCongratsMarkdown('two');
    case 2:
      return getLevelCongratsMarkdown('three');
    case 3:
      return getLevelCongratsMarkdown('four');
    case 4:
      return getLevelCongratsMarkdown('five');
    case 5:
      return getLevelCongratsMarkdown('six');
    case 6:
      return 'Congratulations!  You have reached the top of the RadGrad mountain!  As a Level 6 RadGrad Ninja, you need not strive any further. There are no further levels to reach.';
    default:
      return 'No level available for this student';
  }
};

const StudentLevelsWidget: React.FC<StudentLevelsWidgetProps> = ({ profile, students }) => {
  const imageStyle = { width: '160px' };
  const studentLevelNumber: number = profile.level || 1;
  const studentLevelName = getStudentLevelName(profile);
  const studentLevelHint = getStudentLevelHint(profile);
  const studentLevelCongrats = getStudentLevelCongrats(profile);
  const match = useRouteMatch();
  const username = getUsername(match);
  const imageGroupStyle = { minHeight: '50%' };
  const imageStyle1 = {
    height: '30px',
    width: 'auto',
  };
  console.log(profile);
  return (
    <Segment padded id="studentLevelsWidget">
      <Header as="h4" dividing>
        MY CURRENT LEVEL
      </Header>
      <Grid>
          <Grid.Column width={3}>
              <Image size="mini" centered style={imageStyle} src={`/images/level-icons/radgrad-level-${studentLevelNumber}-icon.png`} />
              <Header as='h3' textAlign="center">Earned on March 2021</Header>
          </Grid.Column>
        <Grid.Column width={13}>
          <Container>
              <Header as="h3"><Markdown escapeHtml source={studentLevelCongrats} /></Header>
            {/*<Header as="h3" textAlign="center">*/}
            {/*  {studentLevelName}*/}
            {/*</Header>*/}
              <Message icon positive>
                  <Icon name="rocket" />
                  <Message.Content>
                      <h1>Want to level up?</h1>
                      <Markdown escapeHtml source={studentLevelHint} />
                      <Link to={`/${URL_ROLES.STUDENT}/${username}/${ICE}`} style={{textDecoration: 'underline'}}>Visit ICE page for more details</Link>
                  </Message.Content>
              </Message>
              <h3>OTHER LEVEL {studentLevelNumber} STUDENTS</h3>
              {studentsExist(students) ? (
                  <Image.Group size="mini" circular style={imageGroupStyle}>
                      {students.map((student) => (
                          // FIXME the <Image circular> gives a console warning:
                          // "Warning: Received `true` for a non-boolean attribute `circular`."
                          // Not really our problem, more of a Semantic UI React problem as "circular" is a boolean attribute.
                          // This has happened for other Semantic UI React components in the past but after a while those warnings
                          // disappear for whatever reason. So no need to really fix this, just putting this here that this warning
                          // can pop up.
                          <Popup key={student._id} trigger={<Image circular src={studentPicture(student)} style={imageStyle1} />} position="bottom left" content={fullName(student)} />
                      ))}
                  </Image.Group>
              ) : (
                  <i>No students to display.</i>
              )}
          </Container>
        </Grid.Column>
      </Grid>

    </Segment>
  );
};

export default StudentLevelsWidget;
