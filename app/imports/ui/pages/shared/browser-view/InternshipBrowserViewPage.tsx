import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { CareerGoal } from '../../../../typings/radgrad';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';

interface InternshipBrowserViewPage {
  careerGoals: CareerGoal[];
}

const headerPaneTitle = 'Find an internship';
const headerPaneBody = `
This page will eventually show Internships that match your Interests and Career Goals.
`;
const headerPaneImage = 'images/header-panel/header-career.png';

const InternshipBrowserViewPage: React.FC<InternshipBrowserViewPage> = ({ careerGoals }) => (
  <PageLayout id={PAGEIDS.INTERNSHIP_BROWSER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    Coming soon!
  </PageLayout>
);

export default withTracker(() => {
  const careerGoals = CareerGoals.findNonRetired();
  return {
    careerGoals,
  };
})(InternshipBrowserViewPage);
