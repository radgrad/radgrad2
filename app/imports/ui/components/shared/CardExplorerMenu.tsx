import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import { withTracker } from 'meteor/react-meteor-data';
import {
  IAcademicPlan, //eslint-disable-line
  ICareerGoal, //eslint-disable-line
  ICourse, //eslint-disable-line
  IDesiredDegree, //eslint-disable-line
  IInterest, //eslint-disable-line
  IOpportunity, //eslint-disable-line
} from '../../../typings/radgrad';
import CardExplorerMenuNonMobileWidget from './CardExplorerMenuNonMobileWidget';
import CardExplorerMenuMobileWidget from './CardExplorerMenuMobileWidget';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import * as Router from './RouterHelperFunctions';
import { Users } from '../../../api/user/UserCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import ExplorerNavDropdown from './ExplorerNavDropdown';

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
const CardExplorerMenu = (props: ICardExplorerMenuProps) => {
  const { menuAddedList, menuCareerList, match, type, role } = props;
  const isTypeInterest = props.type === EXPLORER_TYPE.INTERESTS;
  const typeName = getTypeName(props);

  return (
    <React.Fragment>
      <ExplorerNavDropdown match={match} text={typeName}/>
      <br/>

      <CardExplorerMenuNonMobileWidget menuAddedList={menuAddedList} type={type} role={role}
                                       menuCareerList={isTypeInterest ? menuCareerList : undefined}/>

      <CardExplorerMenuMobileWidget menuAddedList={menuAddedList} type={type} role={role}
                                    menuCareerList={isTypeInterest ? menuCareerList : undefined}/>
    </React.Fragment>
  );
};

export const CardExplorerMenuCon = withTracker((props) => {
  const username = Router.getUsername(props.match);
  const profile = Users.getProfile(username);
  const menuList = _.map(profile.careerGoalIDs, (c) => CareerGoals.findDoc(c).name);
  return {
    profile,
    menuList,
  };
})(CardExplorerMenu);
export default withRouter(CardExplorerMenuCon);
