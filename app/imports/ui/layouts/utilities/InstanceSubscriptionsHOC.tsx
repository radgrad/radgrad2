import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { Loader } from 'semantic-ui-react';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { getUserIdFromRoute } from '../../components/shared/utilities/router';
import { ProfileCareerGoals } from '../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { ProfileCourses } from '../../../api/user/profile-entries/ProfileCourseCollection';
import { ProfileInterests } from '../../../api/user/profile-entries/ProfileInterestCollection';
import { ProfileOpportunities } from '../../../api/user/profile-entries/ProfileOpportunityCollection';
import { Internships } from '../../../api/internship/InternshipCollection';

interface Loading {
  loading: boolean;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    };
  };
}

// cacheLimit default is 10, so no change.
// expireLimit set to 30 minutes because: why not.
const instanceSubs = new SubsManager({ cacheLimit: 20, expireIn: 30 });

const withInstanceSubscriptions = (WrappedComponent) => {
  // console.log('withInstanceSubscriptionsHOC');
  const InstanceSubscriptions: React.FC<Loading> = (props) =>
    (props.loading ? (
      <Loader active>Loading user-specific data</Loader>
    ) : (
      <WrappedComponent {...props} />
    ));

  return withTracker((props) => {
    const handles = [];
    if (props.match) {
      const userID = getUserIdFromRoute(props.match);
      if (userID) {
        // if logged out don't subscribe
        handles.push(instanceSubs.subscribe(AcademicYearInstances.getPublicationName(), userID));
        handles.push(instanceSubs.subscribe(CourseInstances.getPublicationName(), userID));
        handles.push(instanceSubs.subscribe(OpportunityInstances.getPublicationName(), userID));
        handles.push(instanceSubs.subscribe(VerificationRequests.getPublicationName(), userID));
        handles.push(instanceSubs.subscribe(ProfileCareerGoals.getPublicationName(), userID));
        handles.push(instanceSubs.subscribe(ProfileCourses.getPublicationName(), userID));
        handles.push(instanceSubs.subscribe(ProfileInterests.getPublicationName(), userID));
        handles.push(instanceSubs.subscribe(ProfileOpportunities.getPublicationName(), userID));
        handles.push(instanceSubs.subscribe(Internships.getPublicationName(), userID));
      }
    }
    const loading = handles.some((handle) => !handle.ready());
    // console.log('withInstanceSubscription', loading);
    return {
      loading,
    };
  })(InstanceSubscriptions);
};

export default withInstanceSubscriptions;
