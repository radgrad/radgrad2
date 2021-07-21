import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useRouteMatch } from 'react-router';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { getInternshipsMethod } from '../../../../api/internship/InternshipCollection.methods';
import { Users } from '../../../../api/user/UserCollection';
import { ClientSideInternships } from '../../../../startup/client/collections';
import BrowserView from '../../../components/shared/explorer/browser-view/BrowserView';
import { EXPLORER_TYPE } from '../../../utilities/ExplorerUtils';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import { BrowserViewPageProps } from './utilities/BrowserViewPageProps';
import { getEntities } from './utilities/getEntities';

const headerPaneTitle = 'Find an internship';
const headerPaneBody = `
This page will eventually show Internships that match your Interests and Career Goals.
`;
const headerPaneImage = 'images/header-panel/header-career.png';

const InternshipBrowserViewPage: React.FC<BrowserViewPageProps> = ({ internships, opportunities, profileCareerGoals, profileCourses, profileInterests, profileOpportunities, careerGoals, courses, interests }) => (
  <PageLayout id={PAGEIDS.INTERNSHIP_BROWSER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <BrowserView items={internships} explorerType={EXPLORER_TYPE.INTERNSHIPS} profileCareerGoals={profileCareerGoals} profileCourses={profileCourses} profileInterests={profileInterests} profileOpportunities={profileOpportunities} careerGoals={careerGoals} courses={courses} interests={interests} opportunities={opportunities} />
  </PageLayout>
);

export default withTracker(() => {
  const { username } = useParams();
  const profile = Users.getProfile(username);
  const studentID = profile.userID;
  getInternshipsMethod.callPromise({ studentID })
    .then(result => {
      // console.log(result);
      result.forEach((internship) => {
        if (ClientSideInternships.find({ _id: internship._id }).fetch().length === 0) { // stop duplicate inserts
          ClientSideInternships.insert(internship);
        }
      });
    });
  const careerGoals = CareerGoals.findNonRetired();
  const internships = ClientSideInternships.find().fetch();
  console.log(internships);

  const match = useRouteMatch();
  const entities = getEntities(match);
  return {
    ...entities,
    careerGoals,
    internships,
  };
})(InternshipBrowserViewPage);
