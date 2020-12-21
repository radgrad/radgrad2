import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Segment } from 'semantic-ui-react';
import { Courses } from '../../../api/course/CourseCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import ExplorerMenuBarContainer from '../../components/landing/explorer/LandingExplorerMenuBar';
import { Course, HelpMessage } from '../../../typings/radgrad';
import LandingExplorerCardContainer from '../../components/landing/explorer/LandingExplorerCard';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import BackToTopButton from '../../components/shared/BackToTopButton';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import { withListSubscriptions } from '../../layouts/utilities/SubscriptionListHOC';

interface CoursesCardExplorerProps {
  courses: Course[];
  count: number;
  helpMessages: HelpMessage[];
}

const LandingCoursesCardExplorerPage: React.FC<CoursesCardExplorerProps> = ({ courses, count, helpMessages }) => {
  const inlineStyle = {
    maxHeight: 750,
    marginTop: 10,
  };
  return (
    <div id="landing-courses-card-explorer-page">
      <ExplorerMenuBarContainer />
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={3}>
            <LandingExplorerMenuContainer />
          </Grid.Column>

          <Grid.Column width={11}>
            <Segment padded style={{ overflow: 'auto', maxHeight: 750 }}>
              <Header as="h4" dividing>
                <span>COURSES</span> ({count})
              </Header>
              <Card.Group stackable itemsPerRow={2} style={inlineStyle}>
                {courses.map((goal) => (
                  <LandingExplorerCardContainer key={goal._id} type="courses" item={goal} />
                ))}
              </Card.Group>
            </Segment>
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
      </Grid>

      <BackToTopButton />
    </div>
  );
};

const WithSubs = withListSubscriptions(LandingCoursesCardExplorerPage, [
  Courses.getPublicationName(),
  HelpMessages.getPublicationName(),
]);

const LandingCoursesCardExplorerContainer = withTracker(() => ({
  courses: Courses.findNonRetired({}, { sort: { shortName: 1 } }),
  count: Courses.countNonRetired(),
  helpMessages: HelpMessages.findNonRetired({}),
}))(WithSubs);

export default LandingCoursesCardExplorerContainer;
