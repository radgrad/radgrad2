import React from 'react';
import { useParams, useRouteMatch, Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid, Message } from 'semantic-ui-react';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { Users } from '../../../../api/user/UserCollection';
import { CareerGoal, Course, Interest, Internship, Opportunity, Profile } from '../../../../typings/radgrad';
import ExplorerInternship from '../../../components/shared/explorer/item-view/internship/ExplorerInternship';
import RelatedCareerGoals from '../../../components/shared/RelatedCareerGoals';
import RelatedCourses from '../../../components/shared/RelatedCourses';
import RelatedOpportunities from '../../../components/shared/RelatedOpportunities';
import RelatedInterests from '../../../components/shared/RelatedInterests';
import * as Router from '../../../components/shared/utilities/router';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import PageLayout from '../../PageLayout';
import { PAGEIDS } from '../../../utilities/PageIDs';
import { getAssociationRelatedCourses, getAssociationRelatedOpportunities } from '../utilities/getExplorerRelatedMethods';
import { Internships } from '../../../../api/internship/InternshipCollection';

const buildExplorerInternshipRoute = (match: Router.MatchProps): string => {
  const route = `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERNSHIPS}/`;
  return Router.buildRouteName(match, route);
};

interface InternshipViewPageProps {
  internship: Internship;
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
  profile: Profile;
  match: any;
}

const InternshipViewPage: React.FC<InternshipViewPageProps> = ({ internship, careerGoals, courses, interests, opportunities, profile, match }) => {
  // console.log(internship, careerGoals, courses, interests, opportunities, profile);
  if (!internship) {
    // console.log('internship undefined');
    return (
      <PageLayout id={PAGEIDS.INTERNSHIP} headerPaneTitle="Failed to load internship">
        <Message negative>
          <Message.Header>
            Failed to load internship. <Link to={buildExplorerInternshipRoute(match)}>Go back to the Internship explorer.</Link>
          </Message.Header>
          <Message.Content />
        </Message>
      </PageLayout>
    );
  }
  const internshipName = internship.company ? `${internship.position}: ${internship.company}` : `${internship.position}`;
  const findRelatedCourses = () => {
    const interestIDs = internship.interestIDs;
    return courses.filter((course) => course.interestIDs.filter((x) => interestIDs.includes(x)).length > 0);
  };
  const relatedCourses = getAssociationRelatedCourses(findRelatedCourses(), profile.userID);
  const findRelatedCareerGoals = () => {
    const interestIDs = internship.interestIDs;
    return careerGoals.filter((goal) => goal.interestIDs.filter((x) => interestIDs.includes(x)).length > 0);
  };
  const findRelatedOpportunities = () => {
    const interestIDs = internship.interestIDs;
    return opportunities.filter((opp) => opp.interestIDs.filter((x) => interestIDs.includes(x)).length > 0);
  };
  const relatedOpportunities = getAssociationRelatedOpportunities(findRelatedOpportunities(), profile.userID);
  return (
    <PageLayout id={PAGEIDS.INTERNSHIP} headerPaneTitle={internshipName}>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={5}>
            <RelatedInterests item={internship} />
            <RelatedCareerGoals careerGoals={findRelatedCareerGoals()} userID={profile.userID} />
            <RelatedCourses relatedCourses={relatedCourses} profile={profile} />
            <RelatedOpportunities relatedOpportunities={relatedOpportunities} profile={profile} />
          </Grid.Column>
          <Grid.Column width={11}>
            <ExplorerInternship internship={internship} profile={profile} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </PageLayout>
  );
};

export default withTracker(() => {
  const { internshipKey, username } = useParams();
  const profile = Users.getProfile(username);
  const internship = Internships.find({ guid: internshipKey }).fetch()[0];
  const careerGoals = CareerGoals.findNonRetired();
  const courses = Courses.findNonRetired();
  const interests = Interests.findNonRetired();
  const opportunities = Opportunities.findNonRetired();
  const match = useRouteMatch();
  // console.log(match);
  // console.log(internship);
  return {
    profile,
    internship,
    careerGoals,
    courses,
    interests,
    opportunities,
    match,
  };
})(InternshipViewPage);
