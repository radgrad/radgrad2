import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { Interests } from '../../../../api/interest/InterestCollection';
import { InterestTypes } from '../../../../api/interest/InterestTypeCollection';
import { Internships } from '../../../../api/internship/InternshipCollection';
import { ProfileCareerGoals } from '../../../../api/user/profile-entries/ProfileCareerGoalCollection';
import {
  CareerGoal,
  Profile,
  Opportunity, Course, Interest, Internship,
} from '../../../../typings/radgrad';
import ProfileInternships from '../../../components/student/degree-planner/ProfileInternships';
import { PAGEIDS } from '../../../utilities/PageIDs';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { getInternshipsMethod } from '../../../../api/internship/InternshipCollection.methods';
import { ClientSideInternships } from '../../../../startup/client/collections';
import { Users } from '../../../../api/user/UserCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import PageLayout from '../../PageLayout';
import AddToProfileButton from '../../../components/shared/explorer/item-view/AddToProfileButton';
import { PROFILE_ENTRY_TYPE } from '../../../../api/user/profile-entries/ProfileEntryTypes';
import { getAssociationRelatedCourses, getAssociationRelatedOpportunities } from '../utilities/getExplorerRelatedMethods';
import { EXPLORER_TYPE } from '../../../utilities/ExplorerUtils';
import ExplorerItemView from '../../../components/shared/explorer/item-view/ExplorerItemView';
import RelatedCourses from '../../../components/shared/RelatedCourses';
import RelatedOpportunities from '../../../components/shared/RelatedOpportunities';
import RelatedInterests from '../../../components/shared/RelatedInterests';

interface InternshipViewPageProps {
  careerGoals: CareerGoal[];
  opportunities: Opportunity[];
  profile: Profile;
  courses: Course[];
  interests: Interest[];
  internship: Internship;
}

const InternshipViewPage: React.FC<InternshipViewPageProps> = ({
  careerGoals,
  profile,
  courses,
  opportunities,
  interests,
  internship,
}) => {
  const internshipID = internship._id;
  const relatedCourses = getAssociationRelatedCourses(CareerGoals.findRelatedCourses(internshipID), profile.userID);
  const relatedOpportunities = getAssociationRelatedOpportunities(CareerGoals.findRelatedOpportunities(internshipID), profile.userID);
  const headerPaneTitle = internship.position;
  const added = ProfileInternships.findNonRetired({ userID: profile.userID, careerGoalID }).length > 0;
  return (
    <PageLayout id={PAGEIDS.CAREER_GOAL} headerPaneTitle={headerPaneTitle}
      headerPaneButton={<AddToProfileButton type={PROFILE_ENTRY_TYPE.} userID={profile.userID}
        item={internship} added={added} inverted floated="left" />}>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={5}>
            <RelatedInterests item={internship} />
            <RelatedCourses relatedCourses={relatedCourses} profile={profile} />
            <RelatedOpportunities relatedOpportunities={relatedOpportunities} profile={profile} />
          </Grid.Column>
          <Grid.Column width={11}>
            <ExplorerItemView profile={profile} item={internship} opportunities={opportunities} courses={courses} carrerGoals = {careerGoals}
              explorerType={EXPLORER_TYPE.CAREERGOALS} interests={interests} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </PageLayout>
  );
};

export default withTracker(() => {
  const { username } = useParams();
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
    opportunities,
    profile,
    interestTypes,
    interests,
    internships,
  };
})(InternshipViewPage);
