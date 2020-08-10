import React from 'react';
import { withRouter } from 'react-router-dom';
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

const CardExplorerMenu = (props: ICardExplorerMenuProps) => {
  const { menuAddedList, menuCareerList, type, role } = props;
  const isTypeInterest = props.type === EXPLORER_TYPE.INTERESTS;

  return (
    <React.Fragment>
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

export default withRouter(CardExplorerMenu);
