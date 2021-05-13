import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import {
  CareerGoal,
  ProfileCareerGoal,
  Profile,
  Opportunity, Course,
} from '../../../../typings/radgrad';
import { PAGEIDS } from '../../../utilities/PageIDs';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Users } from '../../../../api/user/UserCollection';
import { ProfileCareerGoals } from '../../../../api/user/profile-entries/ProfileCareerGoalCollection';
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

interface CareerGoalViewPageProps {
  profileCareerGoals: ProfileCareerGoal[];
  careerGoal: CareerGoal;
  opportunities: Opportunity[];
  profile: Profile;
  courses: Course[];
}

const CareerGoalViewPage: React.FC<CareerGoalViewPageProps> = ({
  careerGoal,
  profileCareerGoals,
  profile,
  courses,
  opportunities }) => {
  const careerGoalID = careerGoal._id;
  const relatedCourses = getAssociationRelatedCourses(CareerGoals.findRelatedCourses(careerGoalID), profile.userID);
  const relatedOpportunities = getAssociationRelatedOpportunities(CareerGoals.findRelatedOpportunities(careerGoalID), profile.userID);
  const headerPaneTitle = careerGoal.name;
  const headerPaneImage = 'header-career.png';
  const added = ProfileCareerGoals.findNonRetired({ userID: profile.userID, careerGoalID }).length > 0;
  return (
    <PageLayout id={PAGEIDS.CAREER_GOAL} headerPaneTitle={headerPaneTitle} headerPaneImage={headerPaneImage}
                headerPaneButton={<AddToProfileButton type={PROFILE_ENTRY_TYPE.CAREERGOAL} studentID={profile.userID}
                item={careerGoal} added={added} inverted floated="left" />}>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={5}>
            <RelatedInterests item={careerGoal} />
            <RelatedCourses relatedCourses={relatedCourses} profile={profile} />
            <RelatedOpportunities relatedOpportunities={relatedOpportunities} profile={profile} />
          </Grid.Column>
          <Grid.Column width={11}>
            <ExplorerItemView profile={profile} item={careerGoal} opportunities={opportunities} courses={courses} explorerType={EXPLORER_TYPE.CAREERGOALS}/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </PageLayout>
  );
};

const CareerGoalViewPageContainer = withTracker(() => {
  const { careergoal, username } = useParams();
  const profile = Users.getProfile(username);
  const profileCareerGoals = ProfileCareerGoals.findNonRetired({ userID: profile.userID });
  const careerGoalDoc = CareerGoals.findDocBySlug(careergoal);
  const courses = Courses.findNonRetired({});
  const opportunities = Opportunities.findNonRetired({});
  return {
    careerGoal: careerGoalDoc,
    profileCareerGoals,
    courses,
    opportunities,
    profile,
  };
})(CareerGoalViewPage);

export default CareerGoalViewPageContainer;
