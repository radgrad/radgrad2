import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { useRouteMatch } from 'react-router';
import { CareerGoal, Course, Interest, Internship, Opportunity, ProfileCareerGoal, ProfileCourse, ProfileInterest, ProfileOpportunity } from '../../../../typings/radgrad';
import InternshipBrowserView from '../../../components/shared/explorer/browser-view/InternshipBrowserView';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import { getEntities } from './utilities/getEntities';
import { Internships } from '../../../../api/internship/InternshipCollection';

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
This page shows Internships that match your Interests.
`;
const headerPaneImage = 'images/header-panel/header-career.png';

const InternshipBrowserViewPage: React.FC<InternshipBrowserViewPageProps> = ({ internships, careerGoals, courses, interests, opportunities, profileCareerGoals, profileCourses, profileInterests, profileOpportunities }) => (
  <PageLayout id={PAGEIDS.INTERNSHIP_BROWSER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
    <InternshipBrowserView internships={internships} careerGoals={careerGoals} courses={courses} interests={interests} opportunities={opportunities} profileCareerGoals={profileCareerGoals} profileCourses={profileCourses} profileInterests={profileInterests} profileOpportunities={profileOpportunities} />
  </PageLayout>
);

export default withTracker(() => {
  const match = useRouteMatch();
  const entities: any = getEntities(match);
  const internships = Internships.findNonRetired();
  entities.internships = internships;
  // console.log(internships);
  return entities;
})(InternshipBrowserViewPage);
