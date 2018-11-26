import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import FirstMenuContainer from '../../pages/shared/FirstMenu';
import { Reviews } from '../../../api/review/ReviewCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import SecondMenu from '../../pages/shared/SecondMenu';

/** A simple static component to render some text for the landing page. */
class AdvisorPageMenuWidget extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    let numMod = 0;
    numMod += MentorQuestions.find({ moderated: false }).fetch().length;
    numMod += Reviews.find({ moderated: false }).fetch().length;
    let moderationLabel = 'Moderation';
    if (numMod > 0) {
      moderationLabel = `${moderationLabel} (${numMod})`;
    }
    let numRequests = 0;
    numRequests += VerificationRequests.find({ status: 'Open' }).fetch().length;
    let requestsLabel = 'Verification Requests';
    if (numRequests > 0) {
      requestsLabel = `${requestsLabel} (${numRequests})`;
    }
    const menuItems = [
      { label: 'Home', route: 'home' },
      { label: requestsLabel, route: 'verification-requests' },
      { label: moderationLabel, route: 'moderation' },
      { label: 'Academic Plan', route: 'academic-plan' },
      { label: 'Course Scoreboard', route: 'course-scoreboard' },
    ];
    return (
      <div>
        <FirstMenuContainer/>
        <SecondMenu menuItems={menuItems} numItems={menuItems.length}/>
      </div>
    );
  }
}

export default AdvisorPageMenuWidget;
