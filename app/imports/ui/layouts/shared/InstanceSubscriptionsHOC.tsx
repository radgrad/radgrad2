import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { SubsManager } from 'meteor/meteorhacks:subs-manager';
import { Users } from '../../../api/user/UserCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';

interface ILoading {
  loading: boolean;
}

// cacheLimit default is 10, so no change.
// expireLimit set to 30 minutes because: why not.
const instanceSubs = new SubsManager({ cacheLimit: 10, expireIn: 30 });

function withInstanceSubscriptions(WrappedComponent) {
  class InstanceSubscriptions extends React.Component<ILoading> {
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
    const handles = [];
    if (Meteor.userId()) {  // if logged out don't subscribe
      const userID = Users.getProfile(Meteor.userId()).username;
      handles.push(instanceSubs.subscribe(AcademicYearInstances.publicationNames.PerStudentID, Meteor.userId()));
      handles.push(instanceSubs.subscribe(CourseInstances.getPublicationNames().studentID, Meteor.userId()));
    }
    handles.push(instanceSubs.subscribe(AdvisorLogs.getPublicationName()));
    handles.push(instanceSubs.subscribe(FeedbackInstances.getPublicationName()));
    handles.push(instanceSubs.subscribe(Feeds.getPublicationName()));
    handles.push(instanceSubs.subscribe(MentorAnswers.getPublicationName()));
    handles.push(instanceSubs.subscribe(MentorQuestions.getPublicationName()));
    handles.push(instanceSubs.subscribe(OpportunityInstances.publicationNames.student));
    handles.push(instanceSubs.subscribe(VerificationRequests.getPublicationName()));
    const loading = handles.some((handle) => !handle.ready());
    return {
      loading,
    };
  })(InstanceSubscriptions);
}

export default withInstanceSubscriptions;
