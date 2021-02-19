import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import {Header} from 'semantic-ui-react';
import { CareerGoalsChecklist } from '../../components/checklist/CareerGoalsChecklist';
import { CoursesChecklist } from '../../components/checklist/CoursesChecklist';
import { InterestsChecklist } from '../../components/checklist/InterestsChecklist';
import { OpportunitiesChecklist } from '../../components/checklist/OpportunitiesChecklist';
import { ReviewChecklist } from '../../components/checklist/ReviewChecklist';
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

const StudentHomePage: React.FC<StudentHomePageProps> = ({ okItems, reviewItems, improveItems}) => (
  <PageLayout id="student-home-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
    <Header as="h3" color="red">Improve checklist items</Header>
    {improveItems.map((item) => item)}
    <Header as="h3" color="yellow">Review checklist items</Header>
    {reviewItems.map((item) => item)}
    <Header as="h3" color="green">OK checklist items</Header>
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
  checklists.push(new InterestsChecklist('Student Interests', currentUser));
  checklists.push(new CareerGoalsChecklist('Student Career Goals', currentUser));
  checklists.push(new CoursesChecklist('Student Courses', currentUser));
  checklists.push(new OpportunitiesChecklist('Student Opportunities', currentUser));
  checklists.push(new ReviewChecklist('Student Reviews', currentUser));
  checklists.forEach((checklist) => {
    checklist.updateState();
    switch (checklist.getState()) {
      case 'Improve':
        improveItems.push(checklist.getChecklistItem());
        break;
      case 'Review':
        reviewItems.push(checklist.getChecklistItem());
        break;
      case 'OK':
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
