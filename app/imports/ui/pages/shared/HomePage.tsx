import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { useRouteMatch, Redirect } from 'react-router';
import { useParams } from 'react-router-dom';
import { CareerGoalsChecklist } from '../../components/checklist/CareerGoalsChecklist';
import { CareerGoalsWithoutRelatedChecklists } from '../../components/checklist/CareerGoalsWithoutRelatedChecklists';
import { CHECKSTATE } from '../../components/checklist/Checklist';
import { InterestsChecklist } from '../../components/checklist/InterestsChecklist';
import { InterestsWithoutRelatedChecklists } from '../../components/checklist/InterestsWithoutRelatedChecklists';
import { ManageOpportunitiesChecklist } from '../../components/checklist/ManageOpportunitiesChecklist';
import { ManageReviewsChecklist } from '../../components/checklist/ManageReviewsChecklist';
import { ManageVerificationRequestsChecklist } from '../../components/checklist/ManageVerificationRequestsChecklist';
import { OutOfDateOpportunitiesChecklist } from '../../components/checklist/OutOfDateOpportunitiesChecklist';
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
let refusedTerms;

const HomePage: React.FC<HomePageProps> = ({ okItems, reviewItems, improveItems, pageID, username }) => {

  if (refusedTerms) {
    return <Redirect to={{ pathname: '/signout-refused' }} key={`${username}-refused-terms`} />;
  }
  return <PageLayout id={pageID} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <HomePageChecklistSegment okItems={okItems} reviewItems={reviewItems} improveItems={improveItems} />
  </PageLayout>;
};

export default withTracker(() => {
  const { username } = useParams();
  const okItems = [];
  const reviewItems = [];
  const improveItems = [];
  const checklists = [];
  const match = useRouteMatch();
  const role = getRoleByUrl(match);
  let pageID = '';
  switch (role) {
    case URL_ROLES.ADMIN:
      pageID = PAGEIDS.ADMIN_HOME;
      checklists.push(new OutOfDateOpportunitiesChecklist(username));
      checklists.push(new ManageVerificationRequestsChecklist(username));
      checklists.push(new ManageReviewsChecklist(username));
      checklists.push(new InterestsWithoutRelatedChecklists(username));
      checklists.push(new CareerGoalsWithoutRelatedChecklists(username));
      break;
    case URL_ROLES.ADVISOR:
      pageID = PAGEIDS.ADVISOR_HOME;
      checklists.push(new InterestsChecklist(username));
      checklists.push(new CareerGoalsChecklist(username));
      checklists.push(new VisibilityChecklist(username));
      checklists.push(new OutOfDateOpportunitiesChecklist(username));
      checklists.push(new ManageVerificationRequestsChecklist(username));
      checklists.push(new ManageOpportunitiesChecklist(username));
      checklists.push(new ManageReviewsChecklist(username));
      checklists.push(new InterestsWithoutRelatedChecklists(username));
      checklists.push(new CareerGoalsWithoutRelatedChecklists(username));
      checklists.push(new TermsAndConditionsChecklist(username));
      break;
    case URL_ROLES.FACULTY:
      pageID = PAGEIDS.FACULTY_HOME_PAGE;
      checklists.push(new InterestsChecklist(username));
      checklists.push(new CareerGoalsChecklist(username));
      checklists.push(new VisibilityChecklist(username));
      checklists.push(new ManageOpportunitiesChecklist(username));
      checklists.push(new TermsAndConditionsChecklist(username));
      break;
    case URL_ROLES.STUDENT:
      pageID = PAGEIDS.STUDENT_HOME;
      checklists.push(new InterestsChecklist(username));
      checklists.push(new CareerGoalsChecklist(username));
      checklists.push(new VisibilityChecklist(username));
      checklists.push(new CoursesChecklist(username));
      checklists.push(new OpportunitiesChecklist(username));
      checklists.push(new ReviewChecklist(username));
      checklists.push(new VerificationChecklist(username));
      checklists.push(new LevelChecklist(username));
      checklists.push(new TermsAndConditionsChecklist(username));
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
        if (checklist.getChecklistItem().key === `${username}-refused-terms`) {
          refusedTerms = true;
        }
        okItems.push(checklist.getChecklistItem());
        break;
      default:
    // do nothing
    }
  });
  // sort each group alphabetically
  const itemCompare = (a, b) => a.key.localeCompare(b.key);
  improveItems.sort(itemCompare);
  reviewItems.sort(itemCompare);
  okItems.sort(itemCompare);
  return {
    okItems,
    reviewItems,
    improveItems,
    pageID,
    username,
  };
})(HomePage);
