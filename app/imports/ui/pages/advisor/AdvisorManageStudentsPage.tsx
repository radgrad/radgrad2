import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { ProfileCareerGoals } from '../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { ProfileCourses } from '../../../api/user/profile-entries/ProfileCourseCollection';
import { ProfileInterests } from '../../../api/user/profile-entries/ProfileInterestCollection';
import { ProfileOpportunities } from '../../../api/user/profile-entries/ProfileOpportunityCollection';
import AdvisorManageStudents from '../../components/advisor/manage/AdvisorManageStudents';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import { AdvisorManageStudentsProps } from './utilities/AdvisorManageStudentsProps';


const headerPaneTitle = 'Manage students';
const headerPaneBody = `
Use this page to add students to RadGrad and/or help them during advising sessions.

For more details, please see [RadGrad Advisor User Guide](https://www.radgrad.org/docs/users/advisors/overview)
`;
const headerPaneImage = 'header-manage.png';

const AdvisorManageStudentsPage: React.FC<AdvisorManageStudentsProps> = ({
  students,
  alumni,
  careerGoals,
  courses,
  interests,
  opportunities,
  profileCareerGoals,
  profileCourses,
  profileInterests,
  profileOpportunities,
}) => (
  <PageLayout id={PAGEIDS.MANAGE_STUDENTS} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}
              headerPaneImage={headerPaneImage}>
    <AdvisorManageStudents students={students} alumni={alumni} careerGoals={careerGoals} courses={courses}
                           interests={interests} opportunities={opportunities} profileCareerGoals={profileCareerGoals}
                           profileCourses={profileCourses} profileInterests={profileInterests}
                           profileOpportunities={profileOpportunities} />
  </PageLayout>
);

const AdvisorManageStudentsTracker = withTracker(() => {
  const students = StudentProfiles.findNonRetired({ isAlumni: false }, { sort: { username: 1 } });
  const alumni = StudentProfiles.findNonRetired({ isAlumni: true }, { sort: { username: 1 } });
  const careerGoals = CareerGoals.findNonRetired({}, { sort: { name: 1 } });
  const courses = Courses.findNonRetired({}, { sort: { num: 1 } });
  const interests = Interests.findNonRetired({}, { sort: { name: 1 } });
  const opportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
  const profileCareerGoals = ProfileCareerGoals.findNonRetired({});
  const profileCourses = ProfileCourses.findNonRetired({});
  const profileInterests = ProfileInterests.findNonRetired({});
  const profileOpportunities = ProfileOpportunities.findNonRetired({});
  return {
    students,
    alumni,
    careerGoals,
    courses,
    interests,
    opportunities,
    profileCareerGoals,
    profileCourses,
    profileInterests,
    profileOpportunities,
  };
})(AdvisorManageStudentsPage);

export default AdvisorManageStudentsTracker;
