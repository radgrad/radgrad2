import * as React from 'react';
import { Loader } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { ILoading } from './WithGlobalSubscriptions';

import { Users } from '../../../api/user/UserCollection';
import { AcademicYearInstances } from '../../../api/degree-plan/AcademicYearInstanceCollection';
import { FeedbackInstances } from '../../../api/feedback/FeedbackInstanceCollection';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { MentorAnswers } from '../../../api/mentor/MentorAnswerCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { Feeds } from '../../../api/feed/FeedCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';

class WithInstanceSubscriptions extends React.Component<ILoading, {}> {
  /**
   * Creates a new WithInstanceSubscriptions Component.
   * @param props the Properties.
   */
  constructor(props) {
    super(props);
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (this.props.loading) ? <Loader active={true}>Getting global data</Loader> : this.renderPage();
  }

  public renderPage() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default withTracker(() => {
  const handles = [];
  if (Meteor.userId()) {  // if logged out don't subscribe
    const userID = Users.getProfile(Meteor.userId()).username;
    handles.push(Meteor.subscribe(AcademicYearInstances.publicationNames.PerStudentID, Meteor.userId()));
    handles.push(Meteor.subscribe(CourseInstances.getPublicationNames().studentID, Meteor.userId()));
  }
  handles.push(Meteor.subscribe(AdvisorLogs.getPublicationName()));
  handles.push(Meteor.subscribe(FeedbackInstances.getPublicationName()));
  handles.push(Meteor.subscribe(Feeds.getPublicationName()));
  handles.push(Meteor.subscribe(MentorAnswers.getPublicationName()));
  handles.push(Meteor.subscribe(MentorQuestions.getPublicationName()));
  handles.push(Meteor.subscribe(OpportunityInstances.publicationNames.student));
  handles.push(Meteor.subscribe(VerificationRequests.getPublicationName()));

  return {
    ready: handles.some((handle) => !handle.ready()),
  };
})(WithInstanceSubscriptions);
