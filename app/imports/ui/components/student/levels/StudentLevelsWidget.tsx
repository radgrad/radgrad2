import React from 'react';
import { withRouter } from 'react-router-dom';
import Markdown from 'react-markdown';
import { Segment, Grid, Container, Message, Icon, Image, Header } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { getUserIdFromRoute } from '../../shared/utilities/router';
import { Users } from '../../../../api/user/UserCollection';
import { studentLevelsWidget } from '../student-widget-names';
import { getLevelHintStringMarkdown } from '../../../../api/level/LevelProcessor';

// import { HelpMessages } from '../../../api/help/HelpMessageCollection';

interface IStudentLevelsWidgetProps {
  // eslint-disable-next-line react/no-unused-prop-types
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  studentLevelNumber: number;
}

const getStudentLevelNumber = (props: IStudentLevelsWidgetProps): number => {
  if (getUserIdFromRoute(props.match)) {
    const profile = Users.getProfile(getUserIdFromRoute(props.match));
    return profile.level || 1;
  }
  return 1;
};

const getStudentLevelName = (props: IStudentLevelsWidgetProps): string => {
  if (getUserIdFromRoute(props.match)) {
    const profile = Users.getProfile(getUserIdFromRoute(props.match));
    if (profile.level) {
      return `LEVEL ${profile.level}`;
    }
  }
  return 'LEVEL 1';
};

const getStudentLevelHint = (props: IStudentLevelsWidgetProps): string => {
  let levelNumber = 0;
  if (getUserIdFromRoute(props.match)) {
    const profile = Users.getProfile(getUserIdFromRoute(props.match));
    levelNumber = profile.level;
  }
  // const helpMessage = HelpMessages.findDocByRouteName('/student/:username/home/levels').text;
  // const delimiter = '<div class="header">';
  // const levelMessages = helpMessage.split(delimiter);
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

const StudentLevelsWidget = (props: IStudentLevelsWidgetProps) => {
  const imageStyle = { width: '230px' };
  const { studentLevelNumber } = props;
  const studentLevelName = getStudentLevelName(props);
  const studentLevelHint = getStudentLevelHint(props);
  return (
    <Segment padded id={`${studentLevelsWidget}`}>
      <Header as="h4" dividing>CURRENT LEVEL</Header>
      <Grid stackable>
        <Grid.Column width={16}>
          <Container>
            <Image
              size="small"
              centered
              style={imageStyle}
              src={`/images/level-icons/radgrad-level-${studentLevelNumber}-icon.png`}
            />
            <Header as="h3" textAlign="center">{studentLevelName}</Header>
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

const StudentLevelsWidgetCon = withTracker((props) => {
  const studentLevelNumber: number = getStudentLevelNumber(props);

  return {
    studentLevelNumber,
  };
})(StudentLevelsWidget);
const StudentLevelsWidgetContainer = withRouter(StudentLevelsWidgetCon);
export default StudentLevelsWidgetContainer;
