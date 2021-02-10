import React from 'react';
import AdminPageMenu from '../../../components/admin/AdminPageMenu';
import * as Router from '../../../components/shared/utilities/router';
import { URL_ROLES } from '../../../layouts/utilities/route-constants';
import StudentPageMenu from '../../../components/student/StudentPageMenu';
import FacultyPageMenu from '../../../components/faculty/FacultyPageMenu';
import AdvisorPageMenu from '../../../components/advisor/AdvisorPageMenu';

export const getMenuWidget = (match): JSX.Element => {
  const role = Router.getRoleByUrl(match);
  switch (role) {
    case URL_ROLES.ADMIN:
      return <AdminPageMenu />;
    case URL_ROLES.STUDENT:
      return <StudentPageMenu />;
    case URL_ROLES.FACULTY:
      return <FacultyPageMenu />;
    case URL_ROLES.ADVISOR:
      return <AdvisorPageMenu />;
    default:
      return <React.Fragment />;
  }
};
