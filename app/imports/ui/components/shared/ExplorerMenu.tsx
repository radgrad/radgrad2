import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import {
  IAcademicPlan,
  ICareerGoal,
  ICourse,
  IDesiredDegree,
  IInterest,
  IOpportunity,
  IProfile,
} from '../../../typings/radgrad';
import { Users } from '../../../api/user/UserCollection';
import * as Router from './RouterHelperFunctions';
import ExplorerMenuNonMobileWidget from './ExplorerMenuNonMobileWidget';
import ExplorerMenuMobileWidget from './ExplorerMenuMobileWidget';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import ExplorerNavDropdown from './ExplorerNavDropdown';

type explorerInterfaces = IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity;

interface IExplorerMenuProps {
  menuAddedList: { item: explorerInterfaces, count: number }[];
  menuCareerList?: { item: IInterest, count: number }[] | undefined;
  type: 'plans' | 'career-goals' | 'courses' | 'degrees' | 'interests' | 'opportunities' | 'users';
  role: 'student' | 'faculty' | 'mentor';
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  profile: IProfile;
}

const getTypeName = (props: IExplorerMenuProps): string => {
  const { type } = props;
  const names = ['Academic Plans', 'Career Goals', 'Courses', 'Degrees', 'Interests', 'Opportunities', 'Users'];
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      return names[0];
    case EXPLORER_TYPE.CAREERGOALS:
      return names[1];
    case EXPLORER_TYPE.COURSES:
      return names[2];
    case EXPLORER_TYPE.DEGREES:
      return names[3];
    case EXPLORER_TYPE.INTERESTS:
      return names[4];
    case EXPLORER_TYPE.OPPORTUNITIES:
      return names[5];
    case EXPLORER_TYPE.USERS:
      return names[6];
    default:
      return '';
  }
};

// FIXME: Needs to be reactive
const ExplorerMenu = (props: IExplorerMenuProps) => {
  const { menuAddedList, menuCareerList, match, type, role } = props;

  return (
    <React.Fragment>
      <ExplorerNavDropdown match={match} text={getTypeName(props)} />
      <br />

      <ExplorerMenuNonMobileWidget
        menuAddedList={menuAddedList}
        menuCareerList={type && menuCareerList ? menuCareerList : undefined}
        type={type}
        role={role}
      />
      <ExplorerMenuMobileWidget
        menuAddedList={menuAddedList}
        menuCareerList={type && menuCareerList ? menuCareerList : undefined}
        type={type}
        role={role}
      />
    </React.Fragment>
  );
};

export const ExplorerMenuCon = withTracker((props) => {
  const username = Router.getUsername(props.match);
  const profile = Users.getProfile(username);
  return {
    profile,
  };
})(ExplorerMenu);
export const ExplorerMenuContainer = withRouter(ExplorerMenuCon);
export default ExplorerMenuContainer;
