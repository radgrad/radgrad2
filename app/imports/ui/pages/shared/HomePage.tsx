import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { useRouteMatch } from 'react-router';
import { CareerGoalsChecklist } from '../../components/checklist/CareerGoalsChecklist';
import { CareerGoalsWithoutRelatedChecklists } from '../../components/checklist/CareerGoalsWithoutRelatedChecklists';
import { CHECKSTATE } from '../../components/checklist/Checklist';
import { InterestsChecklist } from '../../components/checklist/InterestsChecklist';
import { InterestsWithoutRelatedChecklists } from '../../components/checklist/InterestsWithoutRelatedChecklists';
import { ManageOpportunitiesChecklist } from '../../components/checklist/ManageOpportunitiesChecklist';
import { ManageReviewsChecklist } from '../../components/checklist/ManageReviewsChecklist';
import { ManageVerificationRequestsChecklist } from '../../components/checklist/ManageVerificationRequestsChecklist';
import { OutOfDateOpportunitiesChecklist } from '../../components/checklist/OutOfDateOpportunitiesChecklist';
import { ReviewCareerGoalsChecklist } from '../../components/checklist/ReviewCareerGoalsChecklist';
import { ReviewInterestsChecklist } from '../../components/checklist/ReviewInterestsChecklist';
import { VisibilityChecklist } from '../../components/checklist/VisibilityChecklist';
import { TermsAndConditionsChecklist } from '../../components/checklist/TermsAndConditionsChecklist';
import { CoursesChecklist } from '../../components/checklist/CoursesChecklist';
import { ReviewChecklist } from '../../components/checklist/ReviewChecklist';
import { OpportunitiesChecklist } from '../../components/checklist/OpportunitiesChecklist';
import { VerificationChecklist } from '../../components/checklist/VerificationChecklist';
import { LevelChecklist } from '../../components/checklist/LevelChecklist';
import HomePageChecklistSegment from '../../components/shared/HomePageChecklistSegment';
import { HomePageProps } from '../../utilities/HomePageProps';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import { getRoleByUrl } from '../../components/shared/utilities/router';
import { URL_ROLES } from '../../layouts/utilities/route-constants';
import '../student/style.css';

const headerPaneTitle = 'Make the most of RadGrad';
const headerPaneBody = `
<p>This page contains your personal To Do list, which is designed to help RadGrad help you! It's divided into three sections.</p>
<p><span class="headerLabel redBG">HIGH PRIORITY</span> &nbsp; Please act on these right away. They make a significant difference. </p>
<p><span class="headerLabel yellowBG">MEDIUM PRIORITY</span> &nbsp; These are requests to review your settings or things that might have changed recently. </p>
<p><span class="headerLabel greenBG">COMPLETED</span>  &nbsp; All of these look good for now!</p>
`;
const headerPaneImage = 'images/header-panel/header-home.png';

const HomePage: React.FC<HomePageProps> = ({ okItems, reviewItems, improveItems, pageID }) => (
  <PageLayout id={pageID} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <HomePageChecklistSegment okItems={okItems} reviewItems={reviewItems} improveItems={improveItems} />
  </PageLayout>
);

export default withTracker(() => {
  const currentUser = Meteor.user() ? Meteor.user().username : '';
  const okItems = [];
  const reviewItems = [];
  const improveItems = [];
  const checklists = [];
  const match = useRouteMatch();
  const role = getRoleByUrl(match);
  let pageID = '';
  checklists.push(new InterestsChecklist(currentUser));
  checklists.push(new CareerGoalsChecklist(currentUser));
  checklists.push(new VisibilityChecklist(currentUser));
  switch (role)  {
    case URL_ROLES.ADMIN:
      pageID = PAGEIDS.ADMIN_HOME;
      checklists.push(new OutOfDateOpportunitiesChecklist(currentUser));
      checklists.push(new ManageVerificationRequestsChecklist(currentUser));
      checklists.push(new ManageOpportunitiesChecklist(currentUser));
      checklists.push(new ManageReviewsChecklist(currentUser));
      checklists.push(new ReviewInterestsChecklist(currentUser));
      checklists.push(new ReviewCareerGoalsChecklist(currentUser));
      checklists.push(new InterestsWithoutRelatedChecklists(currentUser));
      checklists.push(new CareerGoalsWithoutRelatedChecklists(currentUser));
      break;
    case URL_ROLES.ADVISOR:
      pageID = PAGEIDS.ADVISOR_HOME;
      checklists.push(new OutOfDateOpportunitiesChecklist(currentUser));
      checklists.push(new ManageVerificationRequestsChecklist(currentUser));
      checklists.push(new ManageOpportunitiesChecklist(currentUser));
      checklists.push(new ManageReviewsChecklist(currentUser));
      checklists.push(new ReviewInterestsChecklist(currentUser));
      checklists.push(new ReviewCareerGoalsChecklist(currentUser));
      checklists.push(new InterestsWithoutRelatedChecklists(currentUser));
      checklists.push(new CareerGoalsWithoutRelatedChecklists(currentUser));
      checklists.push(new TermsAndConditionsChecklist(currentUser));
      break;
    case URL_ROLES.FACULTY:
      pageID = PAGEIDS.FACULTY_HOME_PAGE;
      checklists.push(new OutOfDateOpportunitiesChecklist(currentUser));
      checklists.push(new ManageVerificationRequestsChecklist(currentUser));
      checklists.push(new ManageOpportunitiesChecklist(currentUser));
      checklists.push(new ManageReviewsChecklist(currentUser));
      checklists.push(new ReviewInterestsChecklist(currentUser));
      checklists.push(new ReviewCareerGoalsChecklist(currentUser));
      checklists.push(new TermsAndConditionsChecklist(currentUser));
      break;
    case URL_ROLES.STUDENT:
      pageID = PAGEIDS.STUDENT_HOME;
      checklists.push(new CoursesChecklist(currentUser));
      checklists.push(new OpportunitiesChecklist(currentUser));
      checklists.push(new ReviewChecklist(currentUser));
      checklists.push(new VerificationChecklist(currentUser));
      checklists.push(new LevelChecklist(currentUser));
      checklists.push(new TermsAndConditionsChecklist(currentUser));
      break;
    default:
  }

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
    pageID,
  };
})(HomePage);
