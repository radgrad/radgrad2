import * as React from 'react';
import { Users } from '../../../api/user/UserCollection';
import StudentPageMenuWidget from '../student/StudentPageMenuWidget';
import MentorPageMenuWidget from '../mentor/MentorPageMenuWidget';
import FacultyPageMenuWidget from '../faculty/FacultyPageMenuWidget';
import AdminPageMenuWidget from '../admin/AdminPageMenuWidget';
import AdvisorPageMenuWidget from '../advisor/AdvisorPageMenuWidget';
import AlumniPageMenuWidget from '../alumni/AlumniPageMenuWidget';

interface IMatchProps {
  isExact: boolean;
  path: string;
  url: string;
  params?: {
    username: string;
  }
}

export const getUsername = (match: IMatchProps): string => match.params.username;

export const getUserIdFromRoute = (match: IMatchProps): string => {
  const username = getUsername(match);
  return username && Users.getID(username);
};

/*
 * Returns the type of the CARD explorer page. Should only be called from Card Explorer.
 * (i.e., explorer/plans, explorer/courses), NOT individual explorers (i.e. /explorer/courses/ics_111)
 */
export const getCardExplorerType = (match: IMatchProps): string => {
  const url = match.url;
  const index = url.lastIndexOf('/');
  return url.substr(index + 1);
};

/*
 * Returns the type of the INDIVIDUAL explorer page. Should only be called from Individual Explorers.
 * (i.e. /explorer/courses/ics_111), NOT card explorers (i.e., explorer/plans, explorer/courses)
 */
export const getIndividualExplorerType = (match: IMatchProps): string => {
  const url = match.url;
  const index = url.lastIndexOf('/');
  return url.substr(index + 2);
};

export const getRoleByUrl = (match: IMatchProps): string => {
  const url = match.url;
  const username = getUsername(match);
  const indexUsername = url.indexOf(username);
  return url.substring(1, indexUsername - 1);
};

export const renderPageMenuWidget = (match: IMatchProps): JSX.Element => {
  const role = getRoleByUrl(match);
  switch (role) {
    case 'admin':
      return <AdminPageMenuWidget/>;
    case 'advisor':
      return <AdvisorPageMenuWidget/>;
    case 'alumni':
      return <AlumniPageMenuWidget/>;
    case 'faculty':
      return <FacultyPageMenuWidget/>;
    case 'mentor':
      return <MentorPageMenuWidget/>;
    case 'student':
      return <StudentPageMenuWidget/>;
    default:
      return <React.Fragment/>;
  }
};
