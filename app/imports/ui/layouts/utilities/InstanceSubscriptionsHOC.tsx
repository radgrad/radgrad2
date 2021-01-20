import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { Dimmer, Loader } from 'semantic-ui-react';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { getUserIdFromRoute } from '../../components/shared/utilities/router';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';
import { FavoriteCourses } from '../../../api/favorite/FavoriteCourseCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { FavoriteOpportunities } from '../../../api/favorite/FavoriteOpportunityCollection';
import { PageInterests } from '../../../api/page-tracking/PageInterestCollection';

interface Loading {
  loading: boolean;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

// cacheLimit default is 10, so no change.
// expireLimit set to 30 minutes because: why not.
const instanceSubs = new SubsManager({ cacheLimit: 15, expireIn: 30 });

function withInstanceSubscriptions(WrappedComponent) {
  const InstanceSubscriptions: React.FC<Loading> = (props) => ((props.loading) ? (
    <React.Fragment>
      <Dimmer active inverted><Loader>Loading user-specific data</Loader></Dimmer>
    </React.Fragment>
  )
    :
    <WrappedComponent {...props} />);

  return withTracker((props) => {
    const handles = [];
    if (props.match) {
      const userID = getUserIdFromRoute(props.match);
      if (userID) { // if logged out don't subscribe
        handles.push(instanceSubs.subscribe(AcademicYearInstances.getPublicationName(), userID));
        handles.push(instanceSubs.subscribe(CourseInstances.getPublicationName(), userID));
        handles.push(instanceSubs.subscribe(FeedbackInstances.getPublicationName(), userID));
        handles.push(instanceSubs.subscribe(OpportunityInstances.getPublicationName(), userID));
        handles.push(instanceSubs.subscribe(VerificationRequests.getPublicationName(), userID));
        handles.push(instanceSubs.subscribe(FavoriteCareerGoals.getPublicationName(), userID));
        handles.push(instanceSubs.subscribe(FavoriteCourses.getPublicationName(), userID));
        handles.push(instanceSubs.subscribe(FavoriteInterests.getPublicationName(), userID));
        handles.push(instanceSubs.subscribe(FavoriteOpportunities.getPublicationName(), userID));
        handles.push(instanceSubs.subscribe(PageInterests.getPublicationName(), userID));
      }
    }
    const loading = handles.some((handle) => !handle.ready());
    return {
      loading,
    };
  })(InstanceSubscriptions);
}

export default withInstanceSubscriptions;
