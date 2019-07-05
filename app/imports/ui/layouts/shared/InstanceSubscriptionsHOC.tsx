import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { Responsive } from 'semantic-ui-react';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { getUserIdFromRoute } from '../../components/shared/RouterHelperFunctions';
import PageLoader from '../../components/shared/PageLoader';
import PageLoaderMobile from '../../components/shared/PageLoaderMobile';

interface ILoading {
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
  class InstanceSubscriptions extends React.Component<ILoading> {
    constructor(props) {
      super(props);
    }

    /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
    public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
      return (this.props.loading) ?
        <React.Fragment>
          <Responsive minWidth={Responsive.onlyTablet.minWidth}>
            <PageLoader/>
          </Responsive>

          <Responsive {...Responsive.onlyMobile}>
            <PageLoaderMobile/>
          </Responsive>
        </React.Fragment>
        :
        <WrappedComponent {...this.props}/>;
    }
  }

  return withTracker((props) => {
    const handles = [];
    if (props.match) {
      const userID = getUserIdFromRoute(props.match);
      if (userID) { // if logged out don't subscribe
        handles.push(instanceSubs.subscribe(AcademicYearInstances.publicationNames.PerStudentID, userID));
        handles.push(instanceSubs.subscribe(CourseInstances.getPublicationNames().studentID, userID));
        handles.push(instanceSubs.subscribe(OpportunityInstances.getPublicationNames().studentID, userID));
      }
    }
    handles.push(instanceSubs.subscribe(AdvisorLogs.getPublicationName()));
    handles.push(instanceSubs.subscribe(CourseInstances.publicationNames.scoreboard));
    handles.push(instanceSubs.subscribe(FeedbackInstances.getPublicationName()));
    handles.push(instanceSubs.subscribe(Feeds.getPublicationName()));
    handles.push(instanceSubs.subscribe(MentorAnswers.getPublicationName()));
    handles.push(instanceSubs.subscribe(MentorQuestions.getPublicationName()));
    handles.push(instanceSubs.subscribe(VerificationRequests.getPublicationName()));
    const loading = handles.some((handle) => !handle.ready());
    return {
      loading,
    };
  })(InstanceSubscriptions);
}

export default withInstanceSubscriptions;
