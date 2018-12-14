import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { MentorProfiles } from '../../../api/user/MentorProfileCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Users } from '../../../api/user/UserCollection';
import { DesiredDegrees } from '../../../api/degree-plan/DesiredDegreeCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import { FacultyProfiles } from '../../../api/user/FacultyProfileCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import { Reviews } from '../../../api/review/ReviewCollection';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { InterestTypes } from '../../../api/interest/InterestTypeCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { PublicStats } from '../../../api/public-stats/PublicStatsCollection';
import { RadGradSettings } from '../../../api/radgrad/RadGradSettingsCollection';

interface ILoading {
  loading: boolean;
}

// cacheLimit default is 10, so increased to handle all our subscriptions.
// expireLimit set to 30 minutes because: why not.
const globalSubs = new SubsManager({ cacheLimit: 22, expireIn: 30 });

function withGlobalSubscription(WrappedComponent) {
  class GlobalSubscription extends React.Component<ILoading> {
    constructor(props) {
      super(props);
    }

    /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
    public render() {
      return (this.props.loading) ? <Loader active={true}>Getting data</Loader> :
        <WrappedComponent {...this.props}/>;
    }
  }

  return withTracker(() => {
    const handles = [
      globalSubs.subscribe(AcademicPlans.getPublicationName()),
      globalSubs.subscribe(AcademicTerms.getPublicationName()),
      globalSubs.subscribe(AdvisorProfiles.getPublicationName()),
      globalSubs.subscribe(CareerGoals.getPublicationName()),
      globalSubs.subscribe(Courses.getPublicationName()),
      globalSubs.subscribe(DesiredDegrees.getPublicationName()),
      globalSubs.subscribe(FacultyProfiles.getPublicationName()),
      globalSubs.subscribe(HelpMessages.getPublicationName()),
      globalSubs.subscribe(Interests.getPublicationName()),
      globalSubs.subscribe(InterestTypes.getPublicationName()),
      globalSubs.subscribe(MentorProfiles.getPublicationName()),
      globalSubs.subscribe(Opportunities.getPublicationName()),
      globalSubs.subscribe(OpportunityTypes.getPublicationName()),
      globalSubs.subscribe(PlanChoices.getPublicationName()),
      globalSubs.subscribe(PublicStats.getPublicationName()),
      globalSubs.subscribe(RadGradSettings.getPublicationName()),
      globalSubs.subscribe(Reviews.getPublicationName()),
      globalSubs.subscribe(StudentProfiles.getPublicationName()),
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
