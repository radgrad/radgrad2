import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { useRouteMatch } from 'react-router';
import { useParams } from 'react-router-dom';
import { getInternshipsMethod } from '../../../../api/internship/InternshipCollection.methods';
import { Users } from '../../../../api/user/UserCollection';
import { CareerGoal, Course, Interest, Internship, Opportunity, ProfileCareerGoal, ProfileCourse, ProfileInterest, ProfileOpportunity } from '../../../../typings/radgrad';
import InternshipBrowserView from '../../../components/shared/explorer/browser-view/InternshipBrowserView';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import { ClientSideInternships } from '../../../../startup/client/collections';
import { getEntities } from './utilities/getEntities';

interface InternshipBrowserViewPageProps {
  internships: Internship[];
  careerGoals: CareerGoal[];
  courses: Course[];
  interests: Interest[];
  opportunities: Opportunity[];
  profileCareerGoals: ProfileCareerGoal[];
  profileCourses: ProfileCourse[];
  profileInterests: ProfileInterest[];
  profileOpportunities: ProfileOpportunity[];
}

const headerPaneTitle = 'Find an internship';
const headerPaneBody = `
This page will eventually show Internships that match your Interests and Career Goals.
`;
const headerPaneImage = 'images/header-panel/header-career.png';

const InternshipBrowserViewPage: React.FC<InternshipBrowserViewPageProps> = ({ internships, careerGoals, courses, interests, opportunities, profileCareerGoals, profileCourses, profileInterests, profileOpportunities }) => (
  <PageLayout id={PAGEIDS.INTERNSHIP_BROWSER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <InternshipBrowserView internships={internships} careerGoals={careerGoals} courses={courses} interests={interests} opportunities={opportunities} profileCareerGoals={profileCareerGoals} profileCourses={profileCourses} profileInterests={profileInterests} profileOpportunities={profileOpportunities} />
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
  const match = useRouteMatch();
  const entities: any = getEntities(match);
  const internships = ClientSideInternships.find().fetch();
  entities.internships = internships;
  // console.log(internships);
  return entities;
})(InternshipBrowserViewPage);
