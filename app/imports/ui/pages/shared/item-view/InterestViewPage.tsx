import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Courses } from '../../../../api/course/CourseCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { InterestTypes } from '../../../../api/interest/InterestTypeCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { getInternshipsMethod } from '../../../../api/internship/InternshipCollection.methods';
import { PROFILE_ENTRY_TYPE } from '../../../../api/user/profile-entries/ProfileEntryTypes';
import { ProfileInterests } from '../../../../api/user/profile-entries/ProfileInterestCollection';
import { Users } from '../../../../api/user/UserCollection';
import { Course, Interest, InterestType, Opportunity, Profile, Internship } from '../../../../typings/radgrad';
import AddToProfileButton from '../../../components/shared/explorer/item-view/AddToProfileButton';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import {
  getAssociationRelatedCourses,
  getAssociationRelatedOpportunities,
} from '../utilities/getExplorerRelatedMethods';
import ExplorerItemView from '../../../components/shared/explorer/item-view/ExplorerItemView';
import { EXPLORER_TYPE } from '../../../utilities/ExplorerUtils';
import RelatedCareerGoals from '../../../components/shared/RelatedCareerGoals';
import RelatedCourses from '../../../components/shared/RelatedCourses';
import RelatedOpportunities from '../../../components/shared/RelatedOpportunities';
import { ClientSideInternships } from '../../../../startup/client/collections';


interface InterestViewPageProps {
  courses: Course[];
  profileInterests: Interest[];
  interest: Interest;
  opportunities: Opportunity[];
  profile: Profile;
  interestTypes: InterestType[];
  interests: Interest[];
  internships: Internship[];
}

const InterestViewPage: React.FC<InterestViewPageProps> = ({
  courses,
  profileInterests,
  interest,
  opportunities,
  profile,
  interestTypes,
  interests,
  internships,
}) => {
  const interestID = interest._id;
  const relatedCourses = getAssociationRelatedCourses(Interests.findRelatedCourses(interestID), profile.userID);
  const relatedOpportunities = getAssociationRelatedOpportunities(Interests.findRelatedOpportunities(interestID), profile.userID);
  const relatedCareerGoals = Interests.findRelatedCareerGoals(interestID);
  const headerPaneTitle = interest.name;
  const headerPaneImage = interest.picture;
  const added = ProfileInterests.findNonRetired({ userID: profile.userID, interestID }).length > 0;
  return (
    <PageLayout id={PAGEIDS.INTEREST} headerPaneTitle={headerPaneTitle} headerPaneImage={headerPaneImage}
      headerPaneButton={<AddToProfileButton type={PROFILE_ENTRY_TYPE.INTEREST} userID={profile.userID}
        item={interest} added={added} inverted floated="left" />}>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={5}>
            <RelatedCareerGoals careerGoals={relatedCareerGoals} userID={profile.userID} />
            <RelatedCourses relatedCourses={relatedCourses} profile={profile} />
            <RelatedOpportunities relatedOpportunities={relatedOpportunities} profile={profile} />
          </Grid.Column>
          <Grid.Column width={11}>
            <ExplorerItemView profile={profile} item={interest} opportunities={opportunities} courses={courses} internships={internships}
              explorerType={EXPLORER_TYPE.INTERESTS} interestTypes={interestTypes}
              interests={interests} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </PageLayout>
  );
};

export default withTracker(() => {
  const { interest, username } = useParams();
  const interestDoc = Interests.findDocBySlug(interest);
  const profile = Users.getProfile(username);
  const studentID = profile.userID;
  getInternshipsMethod.callPromise({ studentID })
    .then(result => {
      // console.log(result);
      result.forEach((internship) => {
        if (ClientSideInternships.find({ _id: internship._id }).fetch().length === 0) { // stop duplicate inserts
          ClientSideInternships.insert(internship);
        }
      });
    });
  const internships = ClientSideInternships.find().fetch();
  const courses = Courses.findNonRetired({});
  const opportunities = Opportunities.findNonRetired({});
  const allInterests = Users.getInterestIDs(profile.userID);
  const profileInterests = allInterests.map((id) => Interests.findDoc(id));
  const interestTypes = InterestTypes.findNonRetired();
  const interests = Interests.findNonRetired({});
  return {
    courses,
    profileInterests,
    interest: interestDoc,
    opportunities,
    profile,
    interestTypes,
    interests,
    internships,
  };
})(InterestViewPage);
