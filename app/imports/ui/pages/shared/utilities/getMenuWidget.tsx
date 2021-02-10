import React from 'react';
import AdminPageMenuWidget from '../../../components/admin/AdminPageMenuWidget';
import * as Router from '../../../components/shared/utilities/router';
import { URL_ROLES } from '../../../layouts/utilities/route-constants';
import StudentPageMenu from '../../../components/student/StudentPageMenu';
import FacultyPageMenu from '../../../components/faculty/FacultyPageMenu';
import AdvisorPageMenuWidget from '../../../components/advisor/AdvisorPageMenuWidget';

export const getMenuWidget = (match): JSX.Element => {
  const role = Router.getRoleByUrl(match);
  switch (role) {
    case URL_ROLES.ADMIN:
      return <AdminPageMenuWidget />;
    case URL_ROLES.STUDENT:
      return <StudentPageMenu />;
    case URL_ROLES.FACULTY:
      return <FacultyPageMenu />;
    case URL_ROLES.ADVISOR:
      return <AdvisorPageMenuWidget />;
    default:
      return <React.Fragment />;
  }
};
