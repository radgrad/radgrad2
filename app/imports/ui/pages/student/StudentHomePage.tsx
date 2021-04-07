import { withTracker } from 'meteor/react-meteor-data';
import { Card } from 'semantic-ui-react';
import React from 'react';
import { Users } from '../../../api/user/UserCollection';
import { StudentProfile } from '../../../typings/radgrad';
import { CareerGoalsChecklist } from '../../components/checklist/CareerGoalsChecklist';
import { CoursesChecklist } from '../../components/checklist/CoursesChecklist';
import { InterestsChecklist } from '../../components/checklist/InterestsChecklist';
import { LevelChecklist } from '../../components/checklist/LevelChecklist';
import { OpportunitiesChecklist } from '../../components/checklist/OpportunitiesChecklist';
import { PrivacyChecklist } from '../../components/checklist/PrivacyChecklist';
import { ReviewChecklist } from '../../components/checklist/ReviewChecklist';
import { TermsAndConditionsChecklist } from '../../components/checklist/TermsAndConditionsChecklist';
import { VerificationChecklist } from '../../components/checklist/VerificationChecklist';
import PageLayout from '../PageLayout';
import { CHECKSTATE } from '../../components/checklist/Checklist';
import './style.css';

interface StudentHomePageProps {
  profile: StudentProfile;
  okItems: JSX.Element[];
  reviewItems: JSX.Element[];
  improveItems: JSX.Element[];
}

const headerPaneTitle = 'Make the most of RadGrad';
const headerPaneBody = `
This page contains a personalized set of recommendations to help RadGrad help you! It's divided into three sections. Not all of them might be present at any particular time.

<span style="color:red">IMPROVE:</span> Please act on these right away. They really help RadGrad help you. 

<span style="color:yellow">REVIEW:</span> Please review your settings or things that might have changed recently. 

<span style="color:lightgreen">OK:</span>  Looks good for now!
`;
const headerPaneImage = 'header-home.png';

const StudentHomePage: React.FC<StudentHomePageProps> = ({ okItems, reviewItems, improveItems, profile }) => (
  <PageLayout id="student-home-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage} disableMargin profile={profile}>
    <div style={{ backgroundColor: '#fae9e9', paddingBottom: '25px' }}>
      <Card.Group centered style={{ marginTop: '0px' }}>
        {improveItems}
      </Card.Group>
    </div>
    <div style={{ backgroundColor: '#f9fae9', paddingBottom: '25px' }}>
      <Card.Group centered style={{ marginTop: '0px' }}>
        {reviewItems}
      </Card.Group>
    </div>
    <div style={{ backgroundColor: '#e2fbdd', paddingBottom: '25px' }}>
      <Card.Group centered style={{ marginTop: '0px' }}>
        {okItems}
      </Card.Group>
    </div>
  </PageLayout>
);

export default withTracker(() => {
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const okItems = [];
  const reviewItems = [];
  const improveItems = [];
  const checklists = [];
  const profile = Users.hasProfile(currentUser);
  checklists.push(new TermsAndConditionsChecklist(currentUser));
  checklists.push(new InterestsChecklist(currentUser));
  checklists.push(new CareerGoalsChecklist(currentUser));
  checklists.push(new CoursesChecklist(currentUser));
  checklists.push(new OpportunitiesChecklist(currentUser));
  checklists.push(new ReviewChecklist(currentUser));
  checklists.push(new VerificationChecklist(currentUser));
  checklists.push(new LevelChecklist(currentUser));
  checklists.push(new PrivacyChecklist(currentUser));
  checklists.forEach((checklist) => {
    switch (checklist.getState()) {
      case CHECKSTATE.IMPROVE:
        improveItems.push(checklist.getChecklistItem());
        break;
      case CHECKSTATE.REVIEW:
        reviewItems.push(checklist.getChecklistItem());
        break;
      case CHECKSTATE.OK:
        okItems.push(checklist.getChecklistItem());
        break;
      default:
      // do nothing
    }

  });
  return {
    profile,
    okItems,
    reviewItems,
    improveItems,
  };
})(StudentHomePage);
