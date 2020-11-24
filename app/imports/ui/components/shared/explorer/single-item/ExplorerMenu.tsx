import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import {
  IAcademicPlan,
  ICareerGoal,
  ICourse,
  IInterest,
  IOpportunity,
} from '../../../../../typings/radgrad';
import ExplorerMenuNonMobileWidget from './ExplorerMenuNonMobileWidget';
import ExplorerMenuMobileWidget from './ExplorerMenuMobileWidget';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import ExplorerNavDropdown from '../ExplorerNavDropdown';

type explorerInterfaces = IAcademicPlan | ICareerGoal | ICourse | IInterest | IOpportunity;

interface IExplorerMenuProps {
  menuAddedList: { item: explorerInterfaces, count: number }[];
  menuCareerList?: { item: IInterest, count: number }[] | undefined;
  type: 'plans' | 'career-goals' | 'courses' | 'interests' | 'opportunities' | 'users'; // TODO should this be a defined type?
  role: 'student' | 'faculty';
}

const getTypeName = (props: IExplorerMenuProps): string => {
  const { type } = props;
  const names = ['Academic Plans', 'Career Goals', 'Courses', 'Interests', 'Opportunities', 'Users'];
  // TODO this feels terrible.
  switch (type) {
    case EXPLORER_TYPE.ACADEMICPLANS:
      return names[0];
    case EXPLORER_TYPE.CAREERGOALS:
      return names[1];
    case EXPLORER_TYPE.COURSES:
      return names[2];
    case EXPLORER_TYPE.INTERESTS:
      return names[3];
    case EXPLORER_TYPE.OPPORTUNITIES:
      return names[4];
    default:
      return '';
  }
};

const ExplorerMenu = (props: IExplorerMenuProps) => {
  const { menuAddedList, menuCareerList, type, role } = props;
  const match = useRouteMatch();

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

export default ExplorerMenu;
