import React from 'react';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import {
  IAcademicPlan,
  ICareerGoal,
  ICourse,
  IDesiredDegree,
  IInterest,
  IOpportunity,
} from '../../../typings/radgrad';
import CardExplorerMenuNonMobileWidget from './CardExplorerMenuNonMobileWidget';
import CardExplorerMenuMobileWidget from './CardExplorerMenuMobileWidget';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import * as Router from './RouterHelperFunctions';
import { Users } from '../../../api/user/UserCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import ExplorerNavDropdown from './ExplorerNavDropdown';
import { FavoriteCareerGoals } from '../../../api/favorite/FavoriteCareerGoalCollection';

type explorerInterfaces = IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity;

interface ICardExplorerMenuProps {
  menuAddedList: { item: explorerInterfaces, count: number }[];
  menuCareerList: { item: IInterest, count: number }[] | undefined;
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
}

const getTypeName = (props: ICardExplorerMenuProps): string => {
  const names = ['Academic Plans', 'Career Goals', 'Courses', 'Degrees', 'Interests', 'Opportunities', 'Users'];
  switch (props.type) {
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

const CardExplorerMenu = (props: ICardExplorerMenuProps) => {
  const { menuAddedList, menuCareerList, match, type, role } = props;
  const isTypeInterest = props.type === EXPLORER_TYPE.INTERESTS;
  const typeName = getTypeName(props);

  return (
    <React.Fragment>
      <ExplorerNavDropdown match={match} text={typeName} />
      <br />

      <CardExplorerMenuNonMobileWidget
        menuAddedList={menuAddedList}
        type={type}
        role={role}
        menuCareerList={isTypeInterest ? menuCareerList : undefined}
      />

      <CardExplorerMenuMobileWidget
        menuAddedList={menuAddedList}
        type={type}
        role={role}
        menuCareerList={isTypeInterest ? menuCareerList : undefined}
      />
    </React.Fragment>
  );
};

export const CardExplorerMenuCon = withTracker((props) => {
  const username = Router.getUsername(props.match);
  const profile = Users.getProfile(username);
  const userID = profile.userID;
  const favCareerGoals = FavoriteCareerGoals.find({ userID }).fetch();
  const menuList = _.map(favCareerGoals, (fav) => CareerGoals.findDoc(fav.careerGoalID).name);
  return {
    profile,
    menuList,
  };
})(CardExplorerMenu);
export default withRouter(CardExplorerMenuCon);
