import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import _ from 'lodash';
import {
  CareerGoal,
  ProfileCareerGoal,
  Profile,
  Opportunity, Course, RelatedCoursesOrOpportunities,
} from '../../../../typings/radgrad';
import { PAGEIDS } from '../../../utilities/PageIDs';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Users } from '../../../../api/user/UserCollection';
import { ProfileCareerGoals } from '../../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import PageLayout from '../../PageLayout';
import AddToProfileButton from '../../../components/shared/explorer/item-view/AddToProfileButton';
import { PROFILE_ENTRY_TYPE } from '../../../../api/user/profile-entries/ProfileEntryTypes';
import CareerGoalRelated from '../../../components/shared/explorer/item-view/career-goal/CareerGoalRelated';
import * as Router from '../../../components/shared/utilities/router';
import ExplorerCareerGoal from '../../../components/shared/explorer/item-view/career-goal/ExplorerCareerGoal';

interface CareerGoalViewPageProps {
  profileCareerGoals: ProfileCareerGoal[];
  careerGoal: CareerGoal;
  opportunities: Opportunity[];
  profile: Profile;
  courses: Course[];
}

const getObjectsThatHaveCareerGoal = (objects, careerGoalID: string) => _.filter(objects, (obj) => _.includes(obj.careerGoalIDs, careerGoalID));

const getRelatedCourses = (courses: Course[], careerGoalID: string) => getObjectsThatHaveCareerGoal(courses, careerGoalID);

const getAssociationRelatedCourses = (courses: Course[], studentID: string): RelatedCoursesOrOpportunities => {
  const inPlanInstances = CourseInstances.findNonRetired({
    studentID,
    verified: false,
  });
  const inPlanIDs = _.uniq(_.map(inPlanInstances, 'courseID'));

  const completedInstance = CourseInstances.findNonRetired({
    studentID,
    verified: true,
  });
  const completedIDs = _.uniq(_.map(completedInstance, 'courseID'));

  const relatedIDs = _.uniq(_.map(courses, '_id'));
  const relatedInPlanIDs = _.intersection(relatedIDs, inPlanIDs);
  const relatedCompletedIDs = _.intersection(relatedIDs, completedIDs);
  const relatedNotInPlanIDs = _.difference(relatedIDs, relatedInPlanIDs, relatedCompletedIDs);

  const relatedCourses = {
    completed: relatedCompletedIDs,
    inPlan: relatedInPlanIDs,
    notInPlan: relatedNotInPlanIDs,
  };
  return relatedCourses;
};

const getRelatedOpportunities = (opportunities: Opportunity[], careerGoalID: string) => getObjectsThatHaveCareerGoal(opportunities, careerGoalID);

const getAssociationRelatedOpportunities = (opportunities: Opportunity[], studentID: string): RelatedCoursesOrOpportunities => {
  const inPlanInstances = OpportunityInstances.find({
    studentID,
    verified: false,
  }).fetch();
  const inPlanIDs = _.uniq(_.map(inPlanInstances, 'opportunityID'));

  const completedInstances = OpportunityInstances.find({
    studentID,
    verified: true,
  }).fetch();
  const completedIDs = _.uniq(_.map(completedInstances, 'opportunityID'));

  const relatedIDs = _.uniq(_.map(opportunities, '_id'));
  const relatedInPlanIDs = _.intersection(relatedIDs, inPlanIDs);
  const relatedCompletedIDs = _.intersection(relatedIDs, completedIDs);
  const relatedNotInPlanIDs = _.difference(relatedIDs, relatedInPlanIDs, relatedCompletedIDs);

  const relatedOpportunities = {
    completed: relatedCompletedIDs,
    inPlan: relatedInPlanIDs,
    notInPlan: relatedNotInPlanIDs,
  };
  return relatedOpportunities;
};

const getBaseURL = (match) => {
  const split = match.url.split('/');
  const temp = [];
  temp.push(split[0]);
  temp.push(split[1]);
  temp.push(split[2]);
  temp.push(split[3]);
  return temp.join('/');
};

const CareerGoalViewPage: React.FC<CareerGoalViewPageProps> = ({
  careerGoal,
  profileCareerGoals,
  profile,
  courses,
  opportunities }) => {
  const match = useRouteMatch();
  const careerGoalID = careerGoal._id;
  const relatedCourses = getAssociationRelatedCourses(getRelatedCourses(courses, careerGoalID), profile.userID);
  const relatedOpportunities = getAssociationRelatedOpportunities(getRelatedOpportunities(opportunities, careerGoalID), profile.userID);
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
            <CareerGoalRelated relatedCourses={relatedCourses} relatedOpportunities={relatedOpportunities} careerGoal={careerGoal}
                               isStudent={Router.getRoleByUrl(match) === 'student'} baseURL={getBaseURL(match)}
                               profile={profile} />
          </Grid.Column>
          <Grid.Column width={11}>
            <ExplorerCareerGoal profile={profile} careerGoal={careerGoal} opportunities={opportunities} courses={courses} />
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
