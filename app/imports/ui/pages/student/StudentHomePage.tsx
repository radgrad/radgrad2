import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { CareerGoalsChecklist } from '../../components/checklist/CareerGoalsChecklist';
import { CoursesChecklist } from '../../components/checklist/CoursesChecklist';
import { InterestsChecklist } from '../../components/checklist/InterestsChecklist';
import { LevelChecklist } from '../../components/checklist/LevelChecklist';
import { OpportunitiesChecklist } from '../../components/checklist/OpportunitiesChecklist';
import { VisibilityChecklist } from '../../components/checklist/VisibilityChecklist';
import { ReviewChecklist } from '../../components/checklist/ReviewChecklist';
import { TermsAndConditionsChecklist } from '../../components/checklist/TermsAndConditionsChecklist';
import { VerificationChecklist } from '../../components/checklist/VerificationChecklist';
import HomePageChecklistSegment from '../../components/shared/HomePageChecklistSegment';
import { HomePageProps } from '../../utilities/HomePageProps';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import { CHECKSTATE } from '../../components/checklist/Checklist';
import './style.css';

const headerPaneTitle = 'Make the most of RadGrad';
const headerPaneBody = `
<p>This page contains your personal To Do list, which is designed to help RadGrad help you! It's divided into three sections.</p>
<p><span class="headerLabel redBG">HIGH PRIORITY</span> &nbsp; Please act on these right away. They make a significant difference. </p>
<p><span class="headerLabel yellowBG">MEDIUM PRIORITY</span> &nbsp; These are requests to review your settings or things that might have changed recently. </p>
<p><span class="headerLabel greenBG">COMPLETED</span>  &nbsp; All of these look good for now!</p>
`;
const headerPaneImage = 'header-home.png';

const StudentHomePage: React.FC<HomePageProps> = ({ okItems, reviewItems, improveItems }) => (
  <PageLayout id={PAGEIDS.STUDENT_HOME} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}
              headerPaneImage={headerPaneImage}>
    <HomePageChecklistSegment okItems={okItems} reviewItems={reviewItems} improveItems={improveItems} />
  </PageLayout>
);

export default withTracker(() => {
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const okItems = [];
  const reviewItems = [];
  const improveItems = [];
  const checklists = [];
  checklists.push(new TermsAndConditionsChecklist(currentUser));
  checklists.push(new InterestsChecklist(currentUser));
  checklists.push(new CareerGoalsChecklist(currentUser));
  checklists.push(new CoursesChecklist(currentUser));
  checklists.push(new OpportunitiesChecklist(currentUser));
  checklists.push(new ReviewChecklist(currentUser));
  checklists.push(new VerificationChecklist(currentUser));
  checklists.push(new LevelChecklist(currentUser));
  checklists.push(new VisibilityChecklist(currentUser));
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
    okItems,
    reviewItems,
    improveItems,
  };
})(StudentHomePage);
