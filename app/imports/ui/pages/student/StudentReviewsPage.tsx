import React from 'react';
import { Segment } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { Users } from '../../../api/user/UserCollection';
import { CourseInstance, OpportunityInstance, Review } from '../../../typings/radgrad';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';
import StudentReviewsTab from '../../components/student/reviews/StudentReviewsTab';
import WriteReviews from '../../components/student/reviews/WriteReviews';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';


const headerPaneTitle = 'Pay it forward with reviews';
const headerPaneBody = `
Providing reviews helps future students make the most of their courses and opportunities.

And, providing reviews is important to reaching higher Levels in RadGrad. 
`;
const headerPaneImage = 'images/header-panel/header-review.png';

const header = <RadGradHeader title='write reviews' icon='edit' />;

interface StudentReviewsPageProps {
  courseReviews: Review[];
  opportunityReviews: Review[];
  unreviewedCourses: CourseInstance[];
  unreviewedOpportunities: OpportunityInstance[];
  username: string;
}

const StudentReviewsPage: React.FC<StudentReviewsPageProps> = ({
  courseReviews,
  unreviewedCourses,
  opportunityReviews,
  unreviewedOpportunities,
  username,
}) => (
  <PageLayout id={PAGEIDS.STUDENT_REVIEWS} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}
    headerPaneImage={headerPaneImage}>
    <RadGradSegment header={header}>
      <WriteReviews username={username} unreviewedCourses={unreviewedCourses}
        unreviewedOpportunities={unreviewedOpportunities} />
    </RadGradSegment>
    <Segment basic>
      <StudentReviewsTab courseReviews={courseReviews} opportunityReviews={opportunityReviews} username={username} />
    </Segment>
  </PageLayout>
);

export default withTracker(() => {
  const { username } = useParams();
  const studentID: string = Users.getProfile(username).userID;
  const reviews = Reviews.findNonRetired({ studentID });
  const courseReviews = reviews.filter((r) => r.reviewType === Reviews.COURSE);
  const opportunityReviews = reviews.filter((r) => r.reviewType === Reviews.OPPORTUNITY);
  const revieweeIDs = reviews.map((r) => r.revieweeID);
  let unreviewedCourses = CourseInstances.findNonRetired({ studentID, verified: true });
  unreviewedCourses = unreviewedCourses.filter((ci) => !revieweeIDs.includes(ci.courseID));
  let unreviewedOpportunities = OpportunityInstances.findNonRetired({ studentID, verified: true });
  unreviewedOpportunities = unreviewedOpportunities.filter((oi) => !revieweeIDs.includes(oi.opportunityID));
  return {
    username,
    courseReviews,
    unreviewedCourses,
    opportunityReviews,
    unreviewedOpportunities,
  };
})(StudentReviewsPage);
