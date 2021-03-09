import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
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

interface StudentHomePageProps {
  okItems: JSX.Element[];
  reviewItems: JSX.Element[];
  improveItems: JSX.Element[];
}

const headerPaneTitle = 'Make the most of RadGrad';
const headerPaneBody = `
This page contains a personalized set of recommendations to help RadGrad help you! It's divided into three sections. Not all of them might be present at any particular time.

<span style="color:red">The red section:</span> Please act on these right away. They really help RadGrad help you. 

<span style="color:yellow">The yellow section:</span> Requests for you to review your settings or areas of the site that might have changed recently. 

<span style="color:green">The green section:</span>  Looks good for now!
`;
const headerPaneImage = 'header-home.png';

const StudentHomePage: React.FC<StudentHomePageProps> = ({ okItems, reviewItems, improveItems}) => (
  <PageLayout id="student-home-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage} disableMargin>
    {improveItems.map((item) => item)}
    {reviewItems.map((item) => item)}
    {okItems.map((item) => item)}
  </PageLayout>
);

export default withTracker(() => {
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  // console.log(currentUser);
  const okItems = [];
  const reviewItems = [];
  const improveItems = [];
  const checklists = [];
  checklists.push(new TermsAndConditionsChecklist('Terms and Conditions', currentUser));
  checklists.push(new InterestsChecklist('Interests', currentUser));
  checklists.push(new CareerGoalsChecklist('Career Goals', currentUser));
  checklists.push(new CoursesChecklist('Courses', currentUser));
  checklists.push(new OpportunitiesChecklist('Opportunities', currentUser));
  checklists.push(new ReviewChecklist('Reviews', currentUser));
  checklists.push(new VerificationChecklist('Verification', currentUser));
  checklists.push(new LevelChecklist('Levels', currentUser));
  checklists.push(new PrivacyChecklist('Privacy', currentUser));
  checklists.forEach((checklist) => {
    checklist.updateState();
    switch (checklist.getState()) {
      case 'Improve':
        improveItems.push(checklist.getChecklistItem());
        break;
      case 'Review':
        reviewItems.push(checklist.getChecklistItem());
        break;
      case 'Awesome':
        okItems.push(checklist.getChecklistItem());
        break;
      default:
      // do nothing
    }

  });
  return {
    okItems,
    reviewItems,
    improveItems,
  };
})(StudentHomePage);
