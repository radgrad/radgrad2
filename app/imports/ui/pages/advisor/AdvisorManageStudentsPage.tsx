import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
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

const AdvisorManageStudentsPage: React.FC<AdvisorManageStudentsProps> = ({ students, alumni }) => (
  <PageLayout id={PAGEIDS.MANAGE_STUDENTS} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}
              headerPaneImage={headerPaneImage}>
    <AdvisorManageStudents students={students} alumni={alumni} />
  </PageLayout>
);

const AdvisorManageStudentsTracker = withTracker(() => {
  const students = StudentProfiles.findNonRetired({ isAlumni: false }, { sort: { username: 1 } });
  const alumni = StudentProfiles.findNonRetired({ isAlumni: true }, { sort: { username: 1 } });
  return {
    students,
    alumni,
  };
})(AdvisorManageStudentsPage);

export default AdvisorManageStudentsTracker;
