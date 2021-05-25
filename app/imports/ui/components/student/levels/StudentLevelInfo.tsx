import React from 'react';
import Markdown from 'react-markdown';
import { Grid, Message, Icon, Image, Header } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import { getLevelCongratsMarkdown, getLevelHintStringMarkdown } from '../../../../api/level/LevelProcessor';
import { StudentProfile } from '../../../../typings/radgrad';
import { ICE, URL_ROLES } from '../../../layouts/utilities/route-constants';
import { getUsername } from '../../shared/utilities/router';
import { getLevelColor } from './StudentLevelExplainerWidget';
import OtherStudentsAtLevel from './OtherStudentsAtLevel';
import { LevelChecklist } from '../../checklist/LevelChecklist';
import { CHECKSTATE } from '../../checklist/Checklist';
import RadGradSegment from '../../shared/RadGradSegment';
import RadGradHeader from '../../shared/RadGradHeader';

export interface StudentLevelInfoProps {
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

const getStudentLevelCongrats = (profile: StudentProfile): string => (profile.level ? getLevelCongratsMarkdown(profile.level) : 'No level for this student');

const StudentLevelInfo: React.FC<StudentLevelInfoProps> = ({ profile, students }) => {
  const imageStyle = { width: '160px' };
  const linkStyle = { textDecoration: 'underline' };
  const studentLevelNumber: number = profile.level || 1;
  const studentLevelHint = getStudentLevelHint(profile);
  const studentLevelCongrats = getStudentLevelCongrats(profile);
  const match = useRouteMatch();
  const username = getUsername(match);
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const checklist = new LevelChecklist(currentUser);
  // TODO: when rightside present, causes bad layout of Message component in mobile resolution.
  let rightside = <p />;
  if (checklist.getState() === CHECKSTATE.IMPROVE || checklist.getState() === CHECKSTATE.REVIEW)
    rightside = <span><Icon name='exclamation triangle' color='orange' /> {checklist.getTitleText()}</span>;
  const header = <RadGradHeader title={`Congrats! You're at Level ${profile.level}`} rightside={rightside} />;
  const color = getLevelColor(profile.level);
  return (
    <RadGradSegment header={header}>
      <Grid>
        <Grid.Column width={3}>
          <Image size="mini" centered style={imageStyle} src={`/images/level-icons/radgrad-level-${studentLevelNumber}-icon.png`} />
          <Header textAlign="center" as='h2' color={color}>Level {profile.level}</Header>
          {profile.lastLeveledUp ? <Header as='h3' textAlign="center">Earned on {profile.lastLeveledUp}</Header> : ''}
        </Grid.Column>
        <Grid.Column width={13}>
          <Message icon positive>
            <Icon name="rocket" />
            <Message.Content>
              <h1>Want to level up?</h1>
              <Markdown escapeHtml source={studentLevelCongrats} />
              <p>More specifically:</p>
              <Markdown escapeHtml source={studentLevelHint} />
              <Link to={`/${URL_ROLES.STUDENT}/${username}/${ICE}`} style={linkStyle}>Visit the ICE page for more details</Link>
            </Message.Content>
          </Message>
          <OtherStudentsAtLevel students={students} profile={profile} />
        </Grid.Column>
      </Grid>
    </RadGradSegment>
  );
};

export default StudentLevelInfo;
