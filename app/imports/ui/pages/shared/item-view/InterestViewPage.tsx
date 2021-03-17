import React from 'react';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Grid } from 'semantic-ui-react';
import _ from 'lodash';
import { Course, Interest, Opportunity, Profile } from '../../../../typings/radgrad';
import { getMenuWidget } from '../utilities/getMenuWidget';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Users } from '../../../../api/user/UserCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import ExplorerMenu from '../../../components/shared/explorer/item-view/ExplorerMenu';
import ExplorerInterestWidget from '../../../components/shared/explorer/item-view/interest/ExplorerInterestWidget';
import InterestedRelatedWidget from '../../../components/shared/explorer/item-view/interest/InterestedRelatedWidget';
import * as Router from '../../../components/shared/utilities/router';
import {CourseInstances} from '../../../../api/course/CourseInstanceCollection';
import {OpportunityInstances} from '../../../../api/opportunity/OpportunityInstanceCollection';

interface InterestViewPageProps {
  courses: Course[];
  profileInterests: Interest[];
  interest: Interest;
  opportunities: Opportunity[];
  profile: Profile;
}

const getObjectsThatHaveInterest = (objects, interestID: string) => _.filter(objects, (obj) => _.includes(obj.interestIDs, interestID));

const getRelatedCourses = (courses: Course[], interestID: string) => getObjectsThatHaveInterest(courses, interestID);

const getAssociationRelatedCourses = (courses: Course[], studentID: string) => {
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

const getAssociationRelatedOpportunities = (opportunities: Opportunity[], studentID: string) => {
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

const InterestViewPage: React.FC<InterestViewPageProps> = ({ courses, profileInterests, interest, opportunities, profile }) => {
  const interestID = interest._id;
  const relatedCourses = getAssociationRelatedCourses(getRelatedCourses(courses, interestID), profile.userID);
  const relatedOpportunities = getAssociationRelatedOpportunities(getRelatedOpportunities(opportunities, interestID), profile.userID);
  const match = useRouteMatch();
  const pushDownStyle = { paddingTop: 15 };
  return (
    <div id="interest-view-page">
      {getMenuWidget(match)}
      <Container style={pushDownStyle}>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <InterestedRelatedWidget relatedCourses={relatedCourses} relatedOpportunities={relatedOpportunities} isStudent={Router.getRoleByUrl(match) === 'student'} baseURL={getBaseURL(match)} />
              {/* <ExplorerMenu menuAddedList={menuAddedList} type="interests" /> */}
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
