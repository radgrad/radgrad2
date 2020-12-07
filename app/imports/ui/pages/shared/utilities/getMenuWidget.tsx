import React from 'react';
import AdminPageMenuWidget from '../../../components/admin/AdminPageMenuWidget';
import * as Router from '../../../components/shared/utilities/router';
import { URL_ROLES } from '../../../layouts/utilities/route-constants';
import StudentPageMenuWidget from '../../../components/student/StudentPageMenuWidget';
import FacultyPageMenuWidget from '../../../components/faculty/FacultyPageMenuWidget';
import AdvisorPageMenuWidget from '../../../components/advisor/AdvisorPageMenuWidget';

export const getMenuWidget = (match): JSX.Element => {
  const role = Router.getRoleByUrl(match);
  switch (role) {
    case URL_ROLES.ADMIN:
      return <AdminPageMenuWidget />;
    case URL_ROLES.STUDENT:
      return <StudentPageMenuWidget />;
    case URL_ROLES.FACULTY:
      return <FacultyPageMenuWidget />;
    case URL_ROLES.ADVISOR:
      return <AdvisorPageMenuWidget />;
    default:
      return <React.Fragment />;
  }
};
