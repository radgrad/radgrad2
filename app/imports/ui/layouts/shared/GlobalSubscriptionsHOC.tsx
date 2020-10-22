import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { Dimmer, Loader, Responsive } from 'semantic-ui-react';
import { AdminProfiles } from '../../../api/user/AdminProfileCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
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
import { StudentParticipations } from '../../../api/public-stats/StudentParticipationCollection';
// import PageLoader from '../../components/shared/PageLoader';
import PageLoaderMobile from '../../components/shared/PageLoaderMobile';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { PageInterestsDailySnapshots } from '../../../api/page-tracking/PageInterestsDailySnapshotCollection';

interface ILoading {
  loading: boolean;
}

// cacheLimit default is 10, so increased to handle all our subscriptions.
// expireLimit set to 30 minutes because: why not.
const globalSubs = new SubsManager({ cacheLimit: 30, expireIn: 30 });

function withGlobalSubscription(WrappedComponent) {
  // eslint-disable-next-line react/prop-types
  const GlobalSubscription = (props: ILoading) => ((props.loading) ? (
    <React.Fragment>
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <Dimmer active inverted>
          <Loader>Loading global data</Loader>
        </Dimmer>
      </Responsive>

      <Responsive {...Responsive.onlyMobile}>
        <PageLoaderMobile />
      </Responsive>
    </React.Fragment>
      )
        :
    <WrappedComponent {...props} />);

  return withTracker(() => {
    const handles = [
      globalSubs.subscribe(AcademicPlans.getPublicationName()),
      globalSubs.subscribe(AcademicTerms.getPublicationName()),
      globalSubs.subscribe(AdminProfiles.getPublicationName()),
      globalSubs.subscribe(AdvisorProfiles.getPublicationName()),
      globalSubs.subscribe(CareerGoals.getPublicationName()),
      globalSubs.subscribe(CourseInstances.publicationNames.scoreboard),
      globalSubs.subscribe(Courses.getPublicationName()),
      globalSubs.subscribe(FacultyProfiles.getPublicationName()),
      globalSubs.subscribe(Feeds.getPublicationName()),
      globalSubs.subscribe(HelpMessages.getPublicationName()),
      globalSubs.subscribe(Interests.getPublicationName()),
      globalSubs.subscribe(InterestTypes.getPublicationName()),
      globalSubs.subscribe(Opportunities.getPublicationName()),
      globalSubs.subscribe(OpportunityInstances.publicationNames.scoreboard),
      globalSubs.subscribe(OpportunityTypes.getPublicationName()),
      globalSubs.subscribe(PageInterestsDailySnapshots.getPublicationName()),
      globalSubs.subscribe(PlanChoices.getPublicationName()),
      globalSubs.subscribe(PublicStats.getPublicationName()),
      globalSubs.subscribe(Reviews.getPublicationName()),
      globalSubs.subscribe(StudentParticipations.getPublicationName()),
      globalSubs.subscribe(StudentProfiles.getCollectionName()),
      globalSubs.subscribe(Slugs.getPublicationName()),
      globalSubs.subscribe(Teasers.getPublicationName()),
      globalSubs.subscribe(Users.getPublicationName()),
    ];
    const loading = handles.some((handle) => !handle.ready());
    return {
      loading,
    };
  })(GlobalSubscription);
}

export default withGlobalSubscription;
