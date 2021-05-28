import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Header, Segment } from 'semantic-ui-react';
import { Courses } from '../../../api/course/CourseCollection';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { Course } from '../../../typings/radgrad';
import LandingExplorerCardContainer from '../../components/landing/explorer/LandingExplorerCard';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import { Slugs } from '../../../api/slug/SlugCollection';

interface LandingCoursesExplorerPageProps {
  courses: Course[];
  count: number;
}

const headerPaneTitle = 'The Course Explorer';
const headerPaneBody = `
The RadGrad course explorer provides helpful information about courses, including reviews by students from previous semesters, as well as the number of students planning to take the course in an upcoming semester. 

This public explorer does not show reviews or the forecasts for future semesters, but does provide an overview of the courses currently available in the system.
`;

const LandingCoursesExplorerPage: React.FC<LandingCoursesExplorerPageProps> = ({ courses, count }) => (
  <div>
    <LandingExplorerMenuBar/>
    <PageLayout id={PAGEIDS.LANDING_COURSES_EXPLORER} headerPaneTitle={headerPaneTitle}
      headerPaneBody={headerPaneBody}>
      <Segment>
        <Header as="h4" dividing>
          <span>COURSES</span> ({count})
        </Header>
        <Card.Group stackable>
          {courses.map((goal) => (
            <LandingExplorerCardContainer key={goal._id} type="courses" item={goal}/>
          ))}
        </Card.Group>
      </Segment>
    </PageLayout>
  </div>
);

const LandingCoursesCardExplorerContainer = withTracker(() => ({
  courses: Courses.findNonRetired({}, { sort: { shortName: 1 } }),
  count: Courses.countNonRetired(),
}))(LandingCoursesExplorerPage);

export default withListSubscriptions(LandingCoursesCardExplorerContainer, [Courses.getPublicationName(), Slugs.getPublicationName()]);
