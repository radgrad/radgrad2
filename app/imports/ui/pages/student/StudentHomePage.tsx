import { withTracker } from 'meteor/react-meteor-data';
import { Card, Menu, Tab } from 'semantic-ui-react';
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
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';
import RadGradTabHeader from '../../components/shared/RadGradTabHeader';
import { PAGEIDS } from '../../utilities/PageIDs';
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
<p>This page contains your personal To Do list, which is designed to help RadGrad help you! It's divided into three sections.</p>
<p><span class="headerLabel redBG">HIGH PRIORITY</span> Please act on these right away. They make a significant difference. </p>
<p><span class="headerLabel yellowBG">MEDIUM PRIORITY</span> These are requests to review your settings or things that might have changed recently. </p>
<p><span class="headerLabel greenBG">LOW PRIORITY</span>  All of these look good for now!</p>
`;
const headerPaneImage = 'header-home.png';

const StudentHomePage: React.FC<StudentHomePageProps> = ({ okItems, reviewItems, improveItems }) => {
  const improveTabHeader = <RadGradTabHeader title={`High Priority: Please fix (${improveItems.length})`} icon='exclamation circle' />;
  const reviewTabHeader = <RadGradTabHeader title={`Medium Priority: For review (${reviewItems.length})`} icon='question circle' />;
  const okTabHeader = <RadGradTabHeader title={`Low Priority: Looks good (${okItems.length})`} icon='check circle' />;

  const improvePane = {
    menuItem: <Menu.Item key='improveTab'>{improveTabHeader}</Menu.Item>,
    render: () => (
      <Tab.Pane key='ImprovePane'>
        <Card.Group style={{ marginTop: '0px' }}>
          {improveItems}
        </Card.Group>
      </Tab.Pane>
    ),
  };

  const reviewPane = {
    menuItem: <Menu.Item key='reviewTab'>{reviewTabHeader}</Menu.Item>,
    render: () => (
      <Tab.Pane key='ReviewPane'>
        <Card.Group style={{ marginTop: '0px' }}>
          {reviewItems}
        </Card.Group>
      </Tab.Pane>
    ),
  };

  const okPane = {
    menuItem: <Menu.Item key='okTab'>{okTabHeader}</Menu.Item>,
    render: () => (
      <Tab.Pane key='OKPane'>
        <Card.Group style={{ marginTop: '0px' }}>
          {okItems}
        </Card.Group>
      </Tab.Pane>
    ),
  };

  let activeIndex = 0;
  if ((improveItems.length === 0) && (reviewItems.length > 0)) {
    activeIndex = 1;
  } else if ((improveItems.length === 0) && (reviewItems.length === 0)) {
    activeIndex = 2;
  }

  const header = <RadGradHeader title='To Do' />;

  return (
    <PageLayout id={PAGEIDS.STUDENT_HOME} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <RadGradSegment header={header}>
        <Tab panes={[improvePane, reviewPane, okPane]} defaultActiveIndex={activeIndex} />
      </RadGradSegment>
    </PageLayout>
  );
};

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
