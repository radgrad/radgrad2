import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { ProfileCareerGoals } from '../../../api/user/profile-entries/ProfileCareerGoalCollection';
import { ProfileInterests } from '../../../api/user/profile-entries/ProfileInterestCollection';
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
const headerPaneImage = 'images/header-panel/header-manage.png';

const AdvisorManageStudentsPage: React.FC<AdvisorManageStudentsProps> = ({
  students,
  alumni,
  careerGoals,
  courses,
  interests,
  opportunities,
  profileCareerGoals,
  profileInterests,
}) => (
  <PageLayout id={PAGEIDS.MANAGE_STUDENTS} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}
    headerPaneImage={headerPaneImage}>
    <AdvisorManageStudents students={students} alumni={alumni} careerGoals={careerGoals} courses={courses}
      interests={interests} opportunities={opportunities} profileCareerGoals={profileCareerGoals}
      profileInterests={profileInterests} />
  </PageLayout>
);

export default withTracker(() => {
  const students = StudentProfiles.find({ isAlumni: false }, { sort: { username: 1 } }).fetch();
  const alumni = StudentProfiles.find({ isAlumni: true }, { sort: { username: 1 } }).fetch();
  const careerGoals = CareerGoals.findNonRetired({}, { sort: { name: 1 } });
  const courses = Courses.findNonRetired({}, { sort: { num: 1 } });
  const interests = Interests.findNonRetired({}, { sort: { name: 1 } });
  const opportunities = Opportunities.findNonRetired({}, { sort: { name: 1 } });
  const profileCareerGoals = ProfileCareerGoals.findNonRetired({});
  const profileInterests = ProfileInterests.findNonRetired({});
  // console.log(students, alumni);
  return {
    students,
    alumni,
    careerGoals,
    courses,
    interests,
    opportunities,
    profileCareerGoals,
    profileInterests,
  };
})(AdvisorManageStudentsPage);
