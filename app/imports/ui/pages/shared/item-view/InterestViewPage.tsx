import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Courses } from '../../../../api/course/CourseCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { PROFILE_ENTRY_TYPE } from '../../../../api/user/profile-entries/ProfileEntryTypes';
import { ProfileInterests } from '../../../../api/user/profile-entries/ProfileInterestCollection';
import { Users } from '../../../../api/user/UserCollection';
import { Course, Interest, Opportunity, Profile } from '../../../../typings/radgrad';
import AddToProfileButton from '../../../components/shared/explorer/item-view/AddToProfileButton';
import InterestedRelated from '../../../components/shared/explorer/item-view/interest/InterestedRelated';
import * as Router from '../../../components/shared/utilities/router';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import {
  getAssociationRelatedCourses,
  getAssociationRelatedOpportunities,
  getBaseURL,
} from '../utilities/getExplorerRelatedMethods';
import ExplorerItemView from '../../../components/shared/explorer/item-view/ExplorerItemView';
import { EXPLORER_TYPE } from '../../../utilities/ExplorerUtils';

interface InterestViewPageProps {
  courses: Course[];
  profileInterests: Interest[];
  interest: Interest;
  opportunities: Opportunity[];
  profile: Profile;
}

const InterestViewPage: React.FC<InterestViewPageProps> = ({
  courses,
  profileInterests,
  interest,
  opportunities,
  profile,
}) => {
  const interestID = interest._id;
  const relatedCourses = getAssociationRelatedCourses(Interests.findRelatedCourses(interestID), profile.userID);
  const relatedOpportunities = getAssociationRelatedOpportunities(Interests.findRelatedOpportunities(interestID), profile.userID);
  const match = useRouteMatch();
  const headerPaneTitle = interest.name;
  const headerPaneImage = 'header-interests.png';
  const added = ProfileInterests.findNonRetired({ userID: profile.userID, interestID }).length > 0;
  return (
    <PageLayout id={PAGEIDS.INTEREST} headerPaneTitle={headerPaneTitle} headerPaneImage={headerPaneImage}
                headerPaneButton={<AddToProfileButton type={PROFILE_ENTRY_TYPE.INTEREST} studentID={profile.userID}
                                                      item={interest} added={added} inverted floated="left" />}>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={5}>
            <InterestedRelated relatedCourses={relatedCourses} relatedOpportunities={relatedOpportunities}
                               isStudent={Router.getRoleByUrl(match) === 'student'} baseURL={getBaseURL(match)}
                               profile={profile} />
          </Grid.Column>
          <Grid.Column width={11}>
            <ExplorerItemView profile={profile} item={interest} opportunities={opportunities} courses={courses} explorerType={EXPLORER_TYPE.INTERESTS} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </PageLayout>
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
