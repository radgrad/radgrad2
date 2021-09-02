import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Loader } from 'semantic-ui-react';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { getInternshipFromKeyMethod } from '../../../../api/internship/InternshipCollection.methods';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../../api/user/UserCollection';
import { CareerGoal, Course, Interest, Internship, Opportunity, Profile } from '../../../../typings/radgrad';

import RelatedCourses from '../../../components/shared/RelatedCourses';
import RelatedOpportunities from '../../../components/shared/RelatedOpportunities';
import RelatedInterests from '../../../components/shared/RelatedInterests';
import PageLayout from '../../PageLayout';
import { PAGEIDS } from '../../../utilities/PageIDs';

interface InternshipViewPageProps {
  internship: Internship;
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
  profile: Profile;
}

const InternshipViewPage: React.FC<InternshipViewPageProps> = ({ internship, careerGoals, courses, interests, opportunities, profile }) => {
  // console.log(internship, careerGoals, courses, interests, opportunities, profile);
  const internshipName = `${internship?.position}: ${internship?.company}`;
  if (!internship) {
    return (<Loader>Loading data</Loader>);
  }
  return (
    <PageLayout id={PAGEIDS.INTERNSHIP} headerPaneTitle={internshipName} >
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={5}>
            <RelatedInterests item={internship} />
          </Grid.Column>
          <Grid.Column width={11}>Details</Grid.Column>
        </Grid.Row>
      </Grid>
    </PageLayout>
  );
};

export default withTracker(() => {
  const { internshipKey, username } = useParams();
  const profile = Users.getProfile(username);
  let internshipDoc;
  getInternshipFromKeyMethod.callPromise({ internshipKey })
    // eslint-disable-next-line no-return-assign
    .then(result => internshipDoc = result);
  const careerGoals = CareerGoals.findNonRetired();
  const courses = Courses.findNonRetired();
  const interests = Interests.findNonRetired();
  const opportunities = Opportunities.findNonRetired();
  console.log(internshipDoc);
  return {
    profile,
    internship: internshipDoc,
    careerGoals,
    courses,
    interests,
    opportunities,
  };
})(InternshipViewPage);
