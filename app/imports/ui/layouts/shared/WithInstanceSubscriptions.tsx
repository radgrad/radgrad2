import * as React from 'react';
import { Loader } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { IReady } from './WithGlobalSubscriptions';

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

class WithInstanceSubscriptions extends React.Component<IReady, {}> {
  /**
   * Creates a new WithInstanceSubscriptions Component.
   * @param props the Properties.
   */
  constructor(props) {
    super(props);
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader active={true}>Getting global data</Loader>;
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
  let sub1;
  let sub2;
  if (Meteor.userId()) {  // if logged out don't subscribe
    const userID = Users.getProfile(Meteor.userId()).username;
    sub1 = Meteor.subscribe(AcademicYearInstances.publicationNames.PerStudentID, Meteor.userId());
    sub2 = Meteor.subscribe(CourseInstances.getPublicationNames().studentID, Meteor.userId());
  }
  const sub3 = Meteor.subscribe(AdvisorLogs.getPublicationName());
  const sub4 = Meteor.subscribe(FeedbackInstances.getPublicationName());
  const sub5 = Meteor.subscribe(Feeds.getPublicationName());
  const sub6 = Meteor.subscribe(MentorAnswers.getPublicationName());
  const sub7 = Meteor.subscribe(MentorQuestions.getPublicationName());
  const sub8 = Meteor.subscribe(OpportunityInstances.publicationNames.student);
  const sub9 = Meteor.subscribe(VerificationRequests.getPublicationName());

  return {
    ready: (Meteor.userId()) ? (sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready() && sub8.ready() && sub9.ready()) : (sub3.ready() && sub4.ready() && sub5.ready() && sub6.ready() && sub7.ready() && sub8.ready() && sub9.ready()),
  };
})(WithInstanceSubscriptions);
