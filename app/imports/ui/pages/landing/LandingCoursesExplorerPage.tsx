import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Card } from 'semantic-ui-react';
import { Courses } from '../../../api/course/CourseCollection';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { Course } from '../../../typings/radgrad';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerCard from '../../components/landing/explorer/LandingExplorerCard';
import { EXPLORER_TYPE } from '../../utilities/ExplorerUtils';
import { Interests } from '../../../api/interest/InterestCollection';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';

interface LandingCoursesExplorerPageProps {
  courses: Course[];
  count: number;
}

const headerPaneTitle = 'The Course Explorer';
const headerPaneBody = `
The RadGrad course explorer provides helpful information about courses, including reviews by students from previous semesters, as well as the number of students planning to take the course in an upcoming semester. 

This public explorer does not show reviews or the forecasts for future semesters, but does provide an overview of the courses currently available in the system.
`;
const headerPaneImage = 'images/header-panel/header-courses.png';

const LandingCoursesExplorerPage: React.FC<LandingCoursesExplorerPageProps> = ({ courses, count }) => (
  <div>
    <LandingExplorerMenuBar/>
    <PageLayout id={PAGEIDS.LANDING_COURSES_EXPLORER} headerPaneTitle={headerPaneTitle}
      headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <RadGradSegment header={<RadGradHeader title="COURSES" count={count} dividing />}>
        <Card.Group stackable itemsPerRow={4} id="browserCardGroup" style={{ margin: '0px' }}>
          {courses.map((course) => (
            <LandingExplorerCard key={course._id} type={EXPLORER_TYPE.COURSES} item={course}/>
          ))}
        </Card.Group>
      </RadGradSegment>
    </PageLayout>
  </div>
);

const LandingCoursesCardExplorerContainer = withTracker(() => {
  const courses = Courses.findNonRetired({}, { sort: { num: 1 } });
  const count = Courses.countNonRetired();
  return {
    courses,
    count,
  };
})(LandingCoursesExplorerPage);

export default withListSubscriptions(LandingCoursesCardExplorerContainer, [
  Courses.getPublicationName(),
  Interests.getPublicationName(),
  Slugs.getPublicationName(),
]);
