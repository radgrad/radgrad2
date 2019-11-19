import * as React from 'react';
import FirstMenuContainer from '../../pages/shared/FirstMenu';
import { Reviews } from '../../../api/review/ReviewCollection';
import { MentorQuestions } from '../../../api/mentor/MentorQuestionCollection';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import SecondMenu from '../../pages/shared/SecondMenu';

const AdvisorPageMenuWidget = () => {
  const divStyle = { marginBottom: 30 };
  const firstMenuStyle = { minHeight: 78 };
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
    { label: 'Student Configuration', route: 'home' },
    { label: requestsLabel, route: 'verification-requests' },
    { label: moderationLabel, route: 'moderation' },
    { label: 'Academic Plan', route: 'academic-plan' },
    { label: 'Scoreboard', route: 'scoreboard', regex: 'scoreboard' },
  ];
  return (
    <div style={divStyle}>
      <FirstMenuContainer style={firstMenuStyle}/>
      <SecondMenu menuItems={menuItems} numItems={menuItems.length}/>
    </div>
  );
};

export default AdvisorPageMenuWidget;
