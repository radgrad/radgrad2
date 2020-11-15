import React from 'react';
import { withRouter } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Grid, Header, Loader, Segment } from 'semantic-ui-react';
import { Courses } from '../../../api/course/CourseCollection';
import ExplorerMenuBarContainer from '../../components/landing/explorer/LandingExplorerMenuBar';
import { ICourse } from '../../../typings/radgrad';
import LandingExplorerCardContainer from '../../components/landing/explorer/LandingExplorerCard';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import BackToTopButton from '../../components/shared/BackToTopButton';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';

interface ICoursesCardExplorerProps {
  // eslint-disable-next-line react/no-unused-prop-types
  ready: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  courses: ICourse[];
  // eslint-disable-next-line react/no-unused-prop-types
  count: number;
}

const renderPage = (props:ICoursesCardExplorerProps) => {
  const inlineStyle = {
    maxHeight: 750,
    marginTop: 10,
  };
  return (
    <div>
      <ExplorerMenuBarContainer />
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
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
                <span>COURSES</span> ({props.count})
              </Header>
              <Card.Group stackable itemsPerRow={2} style={inlineStyle}>
                {props.courses.map((goal) => (
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

// eslint-disable-next-line react/prop-types
const LandingCoursesCardExplorerPage = (props: ICoursesCardExplorerProps) => ((props.ready) ? renderPage(props) : <Loader>Loading Courses</Loader>);

const LandingCoursesCardExplorerCon = withRouter(LandingCoursesCardExplorerPage);

const LandingCoursesCardExplorerContainer = withTracker(() => {
  const sub1 = Meteor.subscribe(Courses.getPublicationName());
  const sub2 = Meteor.subscribe(Slugs.getPublicationName());
  return {
    ready: sub1.ready() && sub2.ready(),
    courses: Courses.findNonRetired({}, { sort: { shortName: 1 } }),
    count: Courses.countNonRetired(),
  };
})(LandingCoursesCardExplorerCon);

export default LandingCoursesCardExplorerContainer;
