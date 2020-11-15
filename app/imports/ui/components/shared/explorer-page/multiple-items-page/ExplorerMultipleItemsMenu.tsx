import React from 'react';
import {
  IAcademicPlan,
  ICareerGoal,
  ICourse,
  IInterest,
  IOpportunity,
} from '../../../../../typings/radgrad';
import CardExplorerMenuNonMobileWidget from './ExplorerMultipleItemsMenuNonMobileWidget';
import CardExplorerMenuMobileWidget from './ExplorerMultipleItemsMenuMobileWidget';
import { EXPLORER_TYPE } from '../../../../../startup/client/route-constants';

type explorerInterfaces = IAcademicPlan | ICareerGoal | ICourse | IInterest | IOpportunity;

interface ICardExplorerMenuProps {
  menuAddedList: { item: explorerInterfaces, count: number }[];
  menuCareerList: { item: IInterest, count: number }[] | undefined;
  type: string;
  role: string;
}

const ExplorerMultipleItemsMenu = (props: ICardExplorerMenuProps) => {
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

export default ExplorerMultipleItemsMenu;
