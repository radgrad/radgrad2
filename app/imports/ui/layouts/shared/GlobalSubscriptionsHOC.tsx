import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { Dimmer, Loader, Responsive } from 'semantic-ui-react';
import _ from 'lodash';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
// import PageLoader from '../../components/shared/PageLoader';
import PageLoaderMobile from '../../components/shared/PageLoaderMobile';
// import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
// import { Feeds } from '../../../api/feed/FeedCollection';
// import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { getGlobalPubSubLiteHandles } from '../../../startup/both/pub-sub';

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
    let handles = [
      // globalSubs.subscribe(AcademicPlans.getPublicationName()),
      // globalSubs.subscribe(AcademicTerms.getPublicationName()),
      // globalSubs.subscribe(AdminProfiles.getPublicationName()),
      // globalSubs.subscribe(AdvisorProfiles.getPublicationName()),
      // globalSubs.subscribe(CareerGoals.getPublicationName()),
      // globalSubs.subscribe(CourseInstances.publicationNames.scoreboard),
      // globalSubs.subscribe(Courses.getPublicationName()),
      // globalSubs.subscribe(DesiredDegrees.getPublicationName()),
      // globalSubs.subscribe(FacultyProfiles.getPublicationName()),
      // globalSubs.subscribe(Feeds.getPublicationName()),
      // globalSubs.subscribe(HelpMessages.getPublicationName()),
      // globalSubs.subscribe(Interests.getPublicationName()),
      // globalSubs.subscribe(InterestTypes.getPublicationName()),
      // globalSubs.subscribe(MentorAnswers.getPublicationName()),
      // globalSubs.subscribe(MentorProfiles.getPublicationName()),
      // globalSubs.subscribe(MentorQuestions.getPublicationName()),
      // globalSubs.subscribe(Opportunities.getPublicationName()),
      // globalSubs.subscribe(OpportunityInstances.publicationNames.scoreboard),
      // globalSubs.subscribe(OpportunityTypes.getPublicationName()),
      // globalSubs.subscribe(PageInterestsDailySnapshots.getPublicationName()),
      // globalSubs.subscribe(PlanChoices.getPublicationName()),
      // globalSubs.subscribe(PublicStats.getPublicationName()),
      // globalSubs.subscribe(Reviews.getPublicationName()),
      // globalSubs.subscribe(StudentParticipations.getPublicationName()),
      globalSubs.subscribe(StudentProfiles.getCollectionName()),
      // globalSubs.subscribe(Slugs.getPublicationName()),
      // globalSubs.subscribe(Teasers.getPublicationName()),
      globalSubs.subscribe(Users.getPublicationName()),
      // Users.subscribe(),
    ];
    const pubSubLiteHandles = getGlobalPubSubLiteHandles();
    // console.log('globalSubs', _.some(handles, (h) => !h.ready()));
    // console.log('PubSub', _.some(pubSubLiteHandles, (h) => !h.ready()));
    handles = _.concat(handles, pubSubLiteHandles);
    // console.log(handles);
    const loading = _.some(handles, (handle) => !handle.ready());
    return {
      loading,
    };
  })(GlobalSubscription);
}

export default withGlobalSubscription;
