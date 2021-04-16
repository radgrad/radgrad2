import React from 'react';
import Markdown from 'react-markdown';
import { Segment, Grid, Container, Message, Icon, Image, Header } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import { getLevelCongratsMarkdown, getLevelHintStringMarkdown } from '../../../../api/level/LevelProcessor';
import { StudentProfile } from '../../../../typings/radgrad';
import { ICE, URL_ROLES } from '../../../layouts/utilities/route-constants';
import { getUsername } from '../../shared/utilities/router';
import StudentLevelsOthersWidget from './StudentLevelsOthersWidget';
import { LevelChecklist } from '../../checklist/LevelChecklist';
import { CHECKSTATE } from '../../checklist/Checklist';


export interface StudentLevelsWidgetProps {
  profile: StudentProfile;
  students: StudentProfile[];
}

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
  const studentLevelHint = getStudentLevelHint(profile);
  const studentLevelCongrats = getStudentLevelCongrats(profile);
  const match = useRouteMatch();
  const username = getUsername(match);
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const checklist = new LevelChecklist(currentUser);
  return (
    <Segment padded id="studentLevelsWidget">
      <Header as="h4" dividing>
        MY CURRENT LEVEL
          {(checklist.getState() === CHECKSTATE.IMPROVE || checklist.getState() === CHECKSTATE.REVIEW)  ?
              <span style={{ float: 'right' }}><Icon name='exclamation triangle' color='orange' /> {checklist.getTitleText()}</span> : ''}
      </Header>
      <Grid>
          <Grid.Column width={3}>
              <Image size="mini" centered style={imageStyle} src={`/images/level-icons/radgrad-level-${studentLevelNumber}-icon.png`} />
              {profile.lastLeveledUp ? <Header as='h3' textAlign="center">Earned on {profile.lastLeveledUp}</Header> : ''}
          </Grid.Column>
        <Grid.Column width={13}>
          <Container>
              <Header as="h3"><Markdown escapeHtml source={studentLevelCongrats} /></Header>
              <Message icon positive>
                  <Icon name="rocket" />
                  <Message.Content>
                      <h1>Want to level up?</h1>
                      <Markdown escapeHtml source={studentLevelHint} />
                      <Link to={`/${URL_ROLES.STUDENT}/${username}/${ICE}`} style={{ textDecoration: 'underline' }}>Visit ICE page for more details</Link>
                  </Message.Content>
              </Message>
              <StudentLevelsOthersWidget students={students} profile={profile} />
          </Container>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default StudentLevelsWidget;
