import { withTracker } from 'meteor/react-meteor-data';
import { Card } from 'semantic-ui-react';
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
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';
import { COLORS } from '../../utilities/Colors';
import PageLayout from '../PageLayout';
import { CHECKSTATE } from '../../components/checklist/Checklist';
import './style.css';

interface StudentHomePageProps {
  okItems: JSX.Element[];
  reviewItems: JSX.Element[];
  improveItems: JSX.Element[];
}

const headerPaneTitle = 'Make the most of RadGrad';
const headerPaneBody = `
<p>This page contains a personalized set of recommendations to help RadGrad help you! It's divided into three sections. Not all of them might be present at any particular time.</p>
<p><span class="headerLabel redBG">HIGH PRIORITY (NEEDS IMPROVEMENT)</span> Please act on these right away. They really help RadGrad help you. </p>
<p><span class="headerLabel yellowBG">MEDIUM PRIORITY (PLEASE REVIEW)</span> Please review your settings or things that might have changed recently. </p>
<p><span class="headerLabel greenBG">LOW PRIORITY (LOOKS OK)</span>  Looks good for now!</p>
`;
const headerPaneImage = 'header-home.png';

const improveHeader = <RadGradHeader title='High Priority (needs improvement)' icon='exclamation circle' style={{ color: COLORS.RED }}/>;
const reviewHeader = <RadGradHeader title='Medium Priority (please review)' icon='question circle' style={{ color: COLORS.YELLOW }}/>;
const okHeader = <RadGradHeader title='Low Priority (looks OK!)' icon='check circle' style={{ color: COLORS.GREEN }}/>;

const StudentHomePage: React.FC<StudentHomePageProps> = ({ okItems, reviewItems, improveItems }) => (
  <PageLayout id="student-home-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <RadGradSegment header={improveHeader}>
      <Card.Group centered style={{ marginTop: '0px' }}>
        {improveItems || 'Awesome! No high priority items to improve right now.'}
      </Card.Group>
    </RadGradSegment>
    <RadGradSegment header={reviewHeader}>
      <Card.Group centered style={{ marginTop: '0px' }}>
        {reviewItems || 'Awesome! No items to review right now!'}
      </Card.Group>
    </RadGradSegment>
    <RadGradSegment header={okHeader}>
      <Card.Group centered style={{ marginTop: '0px' }}>
        {okItems || 'No low priority items right now.'}
      </Card.Group>
    </RadGradSegment>
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
    okItems,
    reviewItems,
    improveItems,
  };
})(StudentHomePage);
