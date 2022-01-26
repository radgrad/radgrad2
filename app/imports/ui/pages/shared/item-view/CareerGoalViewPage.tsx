import React from 'react';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Teasers } from '../../../../api/teaser/TeaserCollection';
import {
  CareerGoal,
  ProfileCareerGoal,
  Profile,
  Opportunity, Course, Interest, Teaser, Internship,
} from '../../../../typings/radgrad';
import { PAGEIDS } from '../../../utilities/PageIDs';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Users } from '../../../../api/user/UserCollection';
import { ProfileCareerGoals } from '../../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import PageLayout from '../../PageLayout';
import AddCareerToProfileButton from '../../../components/shared/explorer/item-view/AddCareerToProfileButton';
import { getAssociationRelatedCourses, getAssociationRelatedOpportunities } from '../utilities/getExplorerRelatedMethods';
import { EXPLORER_TYPE } from '../../../utilities/ExplorerUtils';
import ExplorerItemView from '../../../components/shared/explorer/item-view/ExplorerItemView';
import RelatedCourses from '../../../components/shared/RelatedCourses';
import RelatedOpportunities from '../../../components/shared/RelatedOpportunities';
import RelatedInterests from '../../../components/shared/RelatedInterests';
import RelatedInternships from '../../../components/shared/RelatedInternships';
import { Internships } from '../../../../api/internship/InternshipCollection';

interface CareerGoalViewPageProps {
  profileCareerGoals: ProfileCareerGoal[];
  careerGoal: CareerGoal;
  opportunities: Opportunity[];
  profile: Profile;
  courses: Course[];
  interests: Interest[];
  teaser: Teaser[];
}

const getRelatedInternships = (careerGoal: CareerGoal) => {
  const internships = Internships.find().fetch();
  return internships.filter((internship: Internship) => internship.interestIDs.filter(x => careerGoal.interestIDs.includes(x)).length > 0);
};

const CareerGoalViewPage: React.FC<CareerGoalViewPageProps> = ({
  careerGoal,
  profileCareerGoals,
  profile,
  courses,
  opportunities,
  interests,
  teaser,
}) => {
  const careerGoalID = careerGoal._id;
  const relatedCourses = getAssociationRelatedCourses(CareerGoals.findRelatedCourses(careerGoalID), profile.userID);
  const relatedOpportunities = getAssociationRelatedOpportunities(CareerGoals.findRelatedOpportunities(careerGoalID), profile.userID);
  const relatedInternships = getRelatedInternships(careerGoal);
  const headerPaneTitle = careerGoal.name;
  const careerPicture = careerGoal.picture;
  const added = ProfileCareerGoals.findNonRetired({ userID: profile.userID, careerGoalID }).length > 0;
  return (
    <PageLayout id={PAGEIDS.CAREER_GOAL} headerPaneTitle={headerPaneTitle} headerPaneImage={careerPicture}
      headerPaneButton={<AddCareerToProfileButton profile={profile} userID={profile.userID}
        careerGoal={careerGoal} added={added} inverted floated="left" />}>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={5}>
            <RelatedInterests item={careerGoal} />
            <RelatedCourses relatedCourses={relatedCourses} profile={profile} />
            <RelatedOpportunities relatedOpportunities={relatedOpportunities} profile={profile} />
            <RelatedInternships internships={relatedInternships} userID={profile.userID} />
          </Grid.Column>
          <Grid.Column width={11}>
            <ExplorerItemView profile={profile} item={careerGoal} opportunities={opportunities} courses={courses}
              explorerType={EXPLORER_TYPE.CAREERGOALS} interests={interests} teaser={teaser} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </PageLayout>
  );
};

export default withTracker(() => {
  const { careergoal, username } = useParams();
  const profile = Users.getProfile(username);
  const profileCareerGoals = ProfileCareerGoals.findNonRetired({ userID: profile.userID });
  const careerGoalDoc = CareerGoals.findDocBySlug(careergoal);
  const courses = Courses.findNonRetired({});
  const opportunities = Opportunities.findNonRetired({});
  const interests = Interests.findNonRetired({});
  const teaser = Teasers.findNonRetired({ targetSlugID: careerGoalDoc.slugID });
  return {
    careerGoal: careerGoalDoc,
    profileCareerGoals,
    courses,
    opportunities,
    profile,
    interests,
    teaser,
  };
})(CareerGoalViewPage);
