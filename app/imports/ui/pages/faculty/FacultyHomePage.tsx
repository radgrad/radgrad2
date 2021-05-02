import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Card, Menu, Tab } from 'semantic-ui-react';
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
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';
import RadGradTabHeader from '../../components/shared/RadGradTabHeader';
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

const FacultyHomePage: React.FC<HomePageProps> = ({ okItems, reviewItems, improveItems }) => {
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

  const header = <RadGradHeader title='Your Personal To Do List' />;

  return (
    <PageLayout id={PAGEIDS.FACULTY_HOME_PAGE} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
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
})(FacultyHomePage);
