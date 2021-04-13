import _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Courses } from '../../../../api/course/CourseCollection';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import { PROFILE_ENTRY_TYPE } from '../../../../api/user/profile-entries/ProfileEntryTypes';
import { ProfileInterests } from '../../../../api/user/profile-entries/ProfileInterestCollection';
import { Users } from '../../../../api/user/UserCollection';
import { Course, Interest, Opportunity, Profile, RelatedCoursesOrOpportunities } from '../../../../typings/radgrad';
import AddToProfileButton from '../../../components/shared/explorer/item-view/AddToProfileButton';
import ExplorerInterest from '../../../components/shared/explorer/item-view/interest/ExplorerInterest';
import InterestedRelated from '../../../components/shared/explorer/item-view/interest/InterestedRelated';
import * as Router from '../../../components/shared/utilities/router';
import PageLayout from '../../PageLayout';

interface InterestViewPageProps {
  courses: Course[];
  profileInterests: Interest[];
  interest: Interest;
  opportunities: Opportunity[];
  profile: Profile;
}

const getObjectsThatHaveInterest = (objects, interestID: string) => _.filter(objects, (obj) => _.includes(obj.interestIDs, interestID));

const getRelatedCourses = (courses: Course[], interestID: string) => getObjectsThatHaveInterest(courses, interestID);

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

const getRelatedOpportunities = (opportunities: Opportunity[], interestID: string) => getObjectsThatHaveInterest(opportunities, interestID);

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

const InterestViewPage: React.FC<InterestViewPageProps> = ({
  courses,
  profileInterests,
  interest,
  opportunities,
  profile,
}) => {
  const interestID = interest._id;
  const relatedCourses = getAssociationRelatedCourses(getRelatedCourses(courses, interestID), profile.userID);
  const relatedOpportunities = getAssociationRelatedOpportunities(getRelatedOpportunities(opportunities, interestID), profile.userID);
  const match = useRouteMatch();
  const headerPaneTitle = interest.name;
  const headerPaneImage = 'header-interests.png';
  const added = ProfileInterests.findNonRetired({ userID: profile.userID, interestID }).length > 0;
  return (
    <PageLayout id="interest-view-page" headerPaneTitle={headerPaneTitle} headerPaneImage={headerPaneImage}
                headerPaneButton={<AddToProfileButton type={PROFILE_ENTRY_TYPE.INTEREST} studentID={profile.userID}
                                                      item={interest} added={added} inverted floated="left" />}>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={5}>
            <InterestedRelated relatedCourses={relatedCourses} relatedOpportunities={relatedOpportunities}
                               isStudent={Router.getRoleByUrl(match) === 'student'} baseURL={getBaseURL(match)}
                               profile={profile} />
            {/* <ExplorerMenu menuAddedList={menuAddedList} type="interests" /> */}
          </Grid.Column>
          <Grid.Column width={11}>
            <ExplorerInterest profile={profile} interest={interest} opportunities={opportunities} courses={courses} />
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
