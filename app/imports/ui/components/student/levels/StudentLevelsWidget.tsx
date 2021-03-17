import React from 'react';
import Markdown from 'react-markdown';
import { Segment, Grid, Container, Message, Icon, Image, Header } from 'semantic-ui-react';
import { getLevelHintStringMarkdown } from '../../../../api/level/LevelProcessor';
import { StudentProfile } from '../../../../typings/radgrad';

export interface StudentLevelsWidgetProps {
  profile: StudentProfile;
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

const StudentLevelsWidget: React.FC<StudentLevelsWidgetProps> = ({ profile }) => {
  const imageStyle = { width: '230px' };
  const studentLevelNumber: number = profile.level || 1;
  const studentLevelName = getStudentLevelName(profile);
  const studentLevelHint = getStudentLevelHint(profile);
  return (
    <Segment padded id="studentLevelsWidget">
      <Header as="h4" dividing>
        CURRENT LEVEL
      </Header>
      <Grid stackable>
          <Grid.Column width={3}>
              <Image size="small" centered style={imageStyle} src={`/images/level-icons/radgrad-level-${studentLevelNumber}-icon.png`} />
          </Grid.Column>
        <Grid.Column width={16}>
          <Container>
            <Header as="h3" textAlign="center">
              {studentLevelName}
            </Header>
          </Container>
        </Grid.Column>
      </Grid>
      <Message icon>
        <Icon name="rocket" />
        <Message.Content>
          <Markdown escapeHtml source={studentLevelHint} />
        </Message.Content>
      </Message>
    </Segment>
  );
};

export default StudentLevelsWidget;
