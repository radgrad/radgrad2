import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import { List } from 'semantic-ui-react';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { getInternshipsMethod } from '../../../../api/internship/InternshipCollection.methods';
import { Users } from '../../../../api/user/UserCollection';
import { Internship } from '../../../../typings/radgrad';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import { ClientSideInternships } from '../../../../startup/client/collections';

interface InternshipBrowserViewPageProps {
  internships: Internship[];
}

const headerPaneTitle = 'Find an internship';
const headerPaneBody = `
This page will eventually show Internships that match your Interests and Career Goals.
`;
const headerPaneImage = 'images/header-panel/header-career.png';

const InternshipBrowserViewPage: React.FC<InternshipBrowserViewPageProps> = ({ internships }) => (
  <PageLayout id={PAGEIDS.INTERNSHIP_BROWSER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <List bulleted>
      {internships.map((i) => (
        <List.Item key={i._id}>{i.position}</List.Item>
      ))}
    </List>
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
  // console.log(internships);
  return {
    careerGoals,
    internships,
  };
})(InternshipBrowserViewPage);
