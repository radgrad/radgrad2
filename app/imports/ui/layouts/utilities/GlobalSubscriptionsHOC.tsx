import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { Loader } from 'semantic-ui-react';
import { InterestKeywords } from '../../../api/interest/InterestKeywordCollection';
import { AdminProfiles } from '../../../api/user/AdminProfileCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';

interface Loading {
  loading: boolean;
}

// cacheLimit default is 10, so increased to handle all our subscriptions.
// expireLimit set to 30 minutes because: why not.
const globalSubs = new SubsManager({ cacheLimit: 30, expireIn: 30 });

const withGlobalSubscription = (WrappedComponent) => {
  // console.log('withGlobalSubscriptionHOC', Meteor.user(), Meteor.userId(), Users.count());
  const GlobalSubscription: React.FC<Loading> = ({ loading, ...rest }) =>
    (loading ? (
      <Loader active>Loading global data</Loader>
    ) : (
      <WrappedComponent {...rest} />
    ));

  return withTracker(() => {
    const handles = [
      globalSubs.subscribe(AcademicTerms.getPublicationName()),
      globalSubs.subscribe(AdminProfiles.getPublicationName()),
      globalSubs.subscribe(AdvisorProfiles.getPublicationName()),
      globalSubs.subscribe(CareerGoals.getPublicationName()),
      globalSubs.subscribe(Courses.getPublicationName()),
      globalSubs.subscribe(FacultyProfiles.getPublicationName()),
      globalSubs.subscribe(Interests.getPublicationName()),
      globalSubs.subscribe(InterestKeywords.getPublicationName()),
      globalSubs.subscribe(InterestTypes.getPublicationName()),
      globalSubs.subscribe(Opportunities.getPublicationName()),
      globalSubs.subscribe(OpportunityTypes.getPublicationName()),
      globalSubs.subscribe(PublicStats.getPublicationName()),
      globalSubs.subscribe(Reviews.getPublicationName()),
      globalSubs.subscribe(StudentProfiles.getCollectionName()),
      globalSubs.subscribe(Slugs.getPublicationName()),
      globalSubs.subscribe(Teasers.getPublicationName()),
      globalSubs.subscribe(Users.getPublicationName()),
    ];
    const loading = handles.some((handle) => !handle.ready());
    // console.log('withGlobalSubscription', loading, Meteor.user());
    return {
      loading,
    };
  })(GlobalSubscription);
};

export default withGlobalSubscription;
