import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { CareerGoalsChecklist } from '../../components/checklist/CareerGoalsChecklist';
import { CHECKSTATE } from '../../components/checklist/Checklist';
import { InterestsChecklist } from '../../components/checklist/InterestsChecklist';
import { ManageOpportunitiesChecklist } from '../../components/checklist/ManageOpportunitiesChecklist';
import { ManageReviewsChecklist } from '../../components/checklist/ManageReviewsChecklist';
import { ManageVerificationRequestsChecklist } from '../../components/checklist/ManageVerificationRequestsChecklist';
import { ReviewCareerGoalsChecklist } from '../../components/checklist/ReviewCareerGoalsChecklist';
import { ReviewInterestsChecklist } from '../../components/checklist/ReviewInterestsChecklist';
import { TermsAndConditionsChecklist } from '../../components/checklist/TermsAndConditionsChecklist';
import { VisibilityChecklist } from '../../components/checklist/VisibilityChecklist';
import HomePageChecklistSegment from '../../components/shared/HomePageChecklistSegment';
import { HomePageProps } from '../../utilities/HomePageProps';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'Help students make the most of RadGrad';
const headerPaneBody = `
This page contains a personalized set of recommendations to help you configure RadGrad to best support students.

<span style="color:red">The red section:</span> Please act on these right away.

<span style="color:yellow">The yellow section:</span> Requests for you to review your settings or areas of the site that might have changed recently. 

<span style="color:green">The green section:</span>  Looks good for now!
`;

const AdvisorHomePage: React.FC<HomePageProps> = ({ okItems, reviewItems, improveItems }) => (
  <PageLayout id={PAGEIDS.FACULTY_HOME_PAGE} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
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
  checklists.push(new VisibilityChecklist(currentUser));
  checklists.push(new ManageOpportunitiesChecklist(currentUser));
  checklists.push(new ManageVerificationRequestsChecklist(currentUser));
  checklists.push(new ManageReviewsChecklist(currentUser));
  checklists.push(new ReviewInterestsChecklist(currentUser));
  checklists.push(new ReviewCareerGoalsChecklist(currentUser));
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
})(AdvisorHomePage);
