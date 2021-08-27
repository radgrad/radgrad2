import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Grid, Message, Icon, Image, Header, Button } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import { getLevelCongratsMarkdown, getLevelHintStringMarkdown } from '../../../../api/level/LevelProcessor';
import { updateMyLevelMethod } from '../../../../api/level/LevelProcessor.methods';
import { StudentProfile } from '../../../../typings/radgrad';
import { ICE, URL_ROLES } from '../../../layouts/utilities/route-constants';
import RadGradAlert from '../../../utilities/RadGradAlert';
import { getUsername } from '../../shared/utilities/router';
import { getLevelColor } from './LevelInfoTab';
import VisibleStudentsAtLevel from './VisibleStudentsAtLevel';
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
  const [checkLevelWorkingState, setCheckLevelWorking] = useState(false);

  const handleCheckLevelButton = (event) => {
    event.preventDefault();
    setCheckLevelWorking(true);
    updateMyLevelMethod
      .callPromise({})
      .then((resultText) => {
        RadGradAlert.success('Your Level has been checked.', resultText);
        setCheckLevelWorking(false);
      })
      .catch((error) => {
        RadGradAlert.failure('Error updating levels', 'A problem occurred while checking your level', error);
        setCheckLevelWorking(false);
      });
  };

  return (
    <RadGradSegment header={header}>
      <Grid>
        <Grid.Column width={3} textAlign='center'>
          <Image size="mini" style={imageStyle} src={`/images/level-icons/radgrad-level-${studentLevelNumber}-icon.png`} />
          <Header as='h2' color={color}>Level {profile.level}</Header>
          {profile.lastLeveledUp ? <Header as='h5'>Earned on {profile.lastLeveledUp}</Header> : ''}
          <Button size="mini" basic color="green" onClick={handleCheckLevelButton} loading={checkLevelWorkingState} disabled={checkLevelWorkingState}>
            Check Level
          </Button>
        </Grid.Column>
        <Grid.Column width={13}>
          <Message icon positive>
            <Icon name="rocket" />
            <Message.Content>
              <h1>Want to level up?</h1>
              <Markdown escapeHtml source={studentLevelCongrats} />
              <p>More specifically:</p>
              <Markdown escapeHtml source={studentLevelHint} />
              <Link to={`/${URL_ROLES.STUDENT}/${username}/${ICE}`} style={linkStyle}>Visit the myICE page for more details</Link>
            </Message.Content>
          </Message>
          <VisibleStudentsAtLevel students={students} level={profile.level} />
        </Grid.Column>
      </Grid>
    </RadGradSegment>
  );
};

export default StudentLevelInfo;
