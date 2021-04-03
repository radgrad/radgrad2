import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from '../../../../api/user/UserCollection';
import { EXPLORER_TYPE, URL_ROLES } from '../../../layouts/utilities/route-constants';
import { Slugs } from '../../../../api/slug/SlugCollection';

export interface MatchProps {
  isExact: boolean;
  path: string;
  url: string;
  params?: {
    username: string;
  };
}

export interface LocationProps {
  pathname: string;
  search: string;
  hash: string;
  state: any;
}

// Returns the USERNAME param based on React-Router's match object
export const getUsername = (match: MatchProps): string => match.params.username; // TODO should we use _.get here? What would we default to?

// Returns the User ID based off of the USERNAME param
export const getUserIdFromRoute = (match: MatchProps): string => {
  const username = getUsername(match);
  return username && Users.getID(username);
};

// Returns the URL based on React-Router's match object.
const getUrl = (match: MatchProps): string => match.url;

// Slits the URL into an array of parameter strings.
// i.e., /student/abi@hawaii.edu/explorer => ["", "student", "abi@hawaii.edu", "explorer"]
export const splitUrlIntoArray = (match: MatchProps): string[] => {
  const url = getUrl(match);
  return url.split('/');
};

// Returns the base route of the URL (role + username)
// i.e. /student/abi@hawaii.edu
// Note, this function does NOT add a ending forward slash.
export const getBaseRoute = (match: MatchProps): string => {
  const username = match.params.username;
  const baseUrl = match.url;
  const baseIndex = baseUrl.indexOf(username);
  return `${baseUrl.substring(0, baseIndex)}${username}`;
};

// Builds a route name and returns it. Make sure routeName is preceeded by a forward slash ('/').
// i.e., buildRouteName('/explorer/plans') => /role/:username/explorer/plans
export const buildRouteName = (match: MatchProps, routeName: string): string => {
  // I have commented the following code out because of an edge case with OpportunityCollection descriptions and renderLink.
  // OpportunityCollection description contains links with the following format [Title](some http link). Because of this,
  // this error always gets thrown.
  // const firstChar = routeName.charAt(0);
  // if (firstChar !== '/') {
  //   throw new Error('buildRouteName() function from router.tsx requires that the second parameter must have the forward slash (/) as the first character.');
  // }
  const baseRoute = getBaseRoute(match);
  return `${baseRoute}${routeName}`;
};

// Builds a route to the CARD page of an explorer based on the type
export const buildExplorerRoute = (match: MatchProps, type: string): string => {
  const baseExplorerRouteName = `/${EXPLORER_TYPE.HOME}`;
  let route = '';
  switch (type) {
    case EXPLORER_TYPE.CAREERGOALS:
      route = `${baseExplorerRouteName}/${EXPLORER_TYPE.CAREERGOALS}`;
      break;
    case EXPLORER_TYPE.COURSES:
      route = `${baseExplorerRouteName}/${EXPLORER_TYPE.COURSES}`;
      break;
    case EXPLORER_TYPE.INTERESTS:
      route = `${baseExplorerRouteName}/${EXPLORER_TYPE.INTERESTS}`;
      break;
    case EXPLORER_TYPE.OPPORTUNITIES:
      route = `${baseExplorerRouteName}/${EXPLORER_TYPE.OPPORTUNITIES}`;
      break;
    default:
      console.error(`Bad explorer type: ${type}`);
      break;
  }
  return buildRouteName(match, route);
};

// Builds a route to the INDIVIDUAL page of an explorer item based on the type and slug
// Use EXPLORER_TYPE constants for the type
export const buildExplorerSlugRoute = (match: MatchProps, type: string, slug: string): string => {
  if (!Slugs.isDefined(slug)) {
    console.error(`Bad slug: ${slug}`);
  } else {
    const baseExplorerRouteName = `/${EXPLORER_TYPE.HOME}`;
    let route = '';
    switch (type) {
      case EXPLORER_TYPE.CAREERGOALS:
        route = `${baseExplorerRouteName}/${EXPLORER_TYPE.CAREERGOALS}/${slug}`;
        break;
      case EXPLORER_TYPE.COURSES:
        route = `${baseExplorerRouteName}/${EXPLORER_TYPE.COURSES}/${slug}`;
        break;
      case EXPLORER_TYPE.INTERESTS:
        route = `${baseExplorerRouteName}/${EXPLORER_TYPE.INTERESTS}/${slug}`;
        break;
      case EXPLORER_TYPE.OPPORTUNITIES:
        route = `${baseExplorerRouteName}/${EXPLORER_TYPE.OPPORTUNITIES}/${slug}`;
        break;
      default:
        console.error(`Bad explorer type: ${type}`);
        break;
    }
    return buildRouteName(match, route);
  }
  return undefined;
};

// Returns the parameter by index (the parameters AFTER the base route)
// i.e., /student/abi@hawaii.edu/param1/param2/param3 (index = 1 returns param1, index = 2 returns param2, etc...)
export const getUrlParam = (match: MatchProps, index: number): string => {
  if (index <= 0) {
    throw new Error('getUrlParam() function from router.tsx requires index to be greater than 0');
  }
  const parameters = splitUrlIntoArray(match);
  const username = getUsername(match);
  const usernameIndex = parameters.indexOf(username);
  return parameters[usernameIndex + index];
};

// Returns all the parameters AFTER the base route based on the match object
// i.e., /student/abi@hawaii.edu/param1/param2/param3 => ["param1", "param2", "param3"]
export const getAllUrlParams = (match: MatchProps) => {
  const parameters = splitUrlIntoArray(match);
  const username = getUsername(match);
  const usernameIndex = parameters.indexOf(username);
  return parameters.slice(usernameIndex + 1);
};

// Returns all the parameters AFTER the base route based on the location object's pathname parameter
// This functions exactly at as getAllUrlParams() except it looks at the location.pathname as the url instead of match.url
// i.e., /student/abi@hawaii.edu/param1/param2/param3 => ["param1", "param2", "param3"]
export const getAllUrlParamsByLocationObject = (match: MatchProps, location: LocationProps) => {
  const parameters = location.pathname.split('/');
  const username = getUsername(match);
  const usernameIndex = parameters.indexOf(username);
  return parameters.slice(usernameIndex + 1);
};

// Returns the last param of the URL
// i.e., /student/abi@hawaii/edu/param1/param2/param3/param4 => param4
export const getLastUrlParam = (match: MatchProps): string => {
  const parameters = splitUrlIntoArray(match);
  return parameters[parameters.length - 1];
};

// Returns the role of the USERNAME of the url
// i.e., /advisor/someadvisor@hawaii.edu => advisor
export const getRoleByUrl = (match: MatchProps): string => {
  const url = match.url;
  const username = getUsername(match);
  const indexUsername = url.indexOf(username);
  return url.substring(1, indexUsername - 1);
};

// Returns if the role by URL is Admin
export const isUrlRoleAdmin = (match: MatchProps): boolean => {
  const role = getRoleByUrl(match);
  return role === URL_ROLES.ADMIN;
};

// Returns if the role by URL is Advisor
export const isUrlRoleAdvisor = (match: MatchProps): boolean => {
  const role = getRoleByUrl(match);
  return role === URL_ROLES.ADVISOR;
};

// Returns if the role by URL is Alumni
export const isUrlRoleAlumni = (match: MatchProps): boolean => {
  const role = getRoleByUrl(match);
  return role === URL_ROLES.ALUMNI;
};

// Returns if the role by URL is Faculty
export const isUrlRoleFaculty = (match: MatchProps): boolean => {
  const role = getRoleByUrl(match);
  return role === URL_ROLES.FACULTY;
};

// Returns if the role by URL is Student
export const isUrlRoleStudent = (match: MatchProps): boolean => {
  const role = getRoleByUrl(match);
  return role === URL_ROLES.STUDENT;
};

// To be used in <Markdown>s. This makes it so that any external links are opened in a new tab when clicked.
export const renderLink = (props: { href: string; children: React.ReactNode }, match: MatchProps): JSX.Element => {
  const isExternal = props.href.match(/^(https?:)?\/\//);
  const baseRoute = getBaseRoute(match);
  // External Links (aka non-radgrad links)
  if (isExternal) {
    return (
      <a href={props.href} target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
    );
  }
  // Viewing the Landing Explorers not logged in will cause the match.path to not have a ":username" param
  // Since baseRoute is calculated on the assumption that there is a ":username" param, we need to handle this case
  if (match.path.indexOf(':username') === -1) {
    return <Link to={`${props.href}`}>{props.children}</Link>;
  }
  return <Link to={`${baseRoute}${props.href}`}>{props.children}</Link>;
};
