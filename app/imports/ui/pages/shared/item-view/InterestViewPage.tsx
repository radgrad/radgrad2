import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Grid } from 'semantic-ui-react';
import { Course, Interest, Opportunity, Profile } from '../../../../typings/radgrad';
import { getMenuWidget } from '../utilities/getMenuWidget';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Users } from '../../../../api/user/UserCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import ExplorerMenu from '../../../components/shared/explorer/item-view/ExplorerMenu';
import ExplorerInterestWidget from '../../../components/shared/explorer/item-view/interest/ExplorerInterestWidget';

interface InterestViewPageProps {
  courses: Course[];
  profileInterests: Interest[];
  interest: Interest;
  opportunities: Opportunity[];
  profile: Profile;
}

const InterestViewPage: React.FC<InterestViewPageProps> = ({ courses, profileInterests, interest, opportunities, profile }) => {
  const match = useRouteMatch();
  const menuAddedList = profileInterests.map((item) => ({
    item,
    count: 1,
  }));
  const pushDownStyle = { paddingTop: 15 };
  return (
    <div id="interest-view-page">
      {getMenuWidget(match)}
      <Container style={pushDownStyle}>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <ExplorerMenu menuAddedList={menuAddedList} type="interests" />
            </Grid.Column>
            <Grid.Column width={13}>
              <ExplorerInterestWidget profile={profile} interest={interest} opportunities={opportunities} courses={courses} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

const InterestViewPageContainer = withTracker(() => {
  const { interest, username } = useParams();
  const interestDoc = Interests.findDocBySlug(interest);
  const profile = Users.getProfile(username);
  const courses = Courses.findNonRetired({});
  const opportunities = Opportunities.findNonRetired({});
  const allInterests = Users.getInterestIDs(profile.userID);
  const profileInterests = allInterests.map((id) => Interests.findDoc(id));
  return {
    courses,
    profileInterests,
    interest: interestDoc,
    opportunities,
    profile,
  };
})(InterestViewPage);

export default InterestViewPageContainer;
