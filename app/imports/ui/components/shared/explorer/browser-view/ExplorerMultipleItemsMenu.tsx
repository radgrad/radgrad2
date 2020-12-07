import React from 'react';
import {
  IAcademicPlan,
  ICareerGoal,
  ICourse,
  IInterest,
  IOpportunity,
} from '../../../../../typings/radgrad';
import { IExplorerTypes } from '../utilities/explorer';
import CardExplorerMenuNonMobileWidget from './ExplorerMultipleItemsMenuNonMobileWidget';
import CardExplorerMenuMobileWidget from './ExplorerMultipleItemsMenuMobileWidget';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';

type explorerInterfaces = IAcademicPlan | ICareerGoal | ICourse | IInterest | IOpportunity;

export interface IExplorerMenuItem {
  item: explorerInterfaces,
  count: number,
}

interface ICardExplorerMenuProps {
  menuAddedList: IExplorerMenuItem[];
  menuCareerList: { item: IInterest, count: number }[] | undefined;
  type: IExplorerTypes;
}

const ExplorerMultipleItemsMenu: React.FC<ICardExplorerMenuProps> = ({ menuAddedList, menuCareerList, type }) => {
  const isTypeInterest = type === EXPLORER_TYPE.INTERESTS;

  return (
    <React.Fragment>
      <CardExplorerMenuNonMobileWidget
        menuAddedList={menuAddedList}
        type={type}
        menuCareerList={isTypeInterest ? menuCareerList : undefined}
      />

      <CardExplorerMenuMobileWidget
        menuAddedList={menuAddedList}
        type={type}
        menuCareerList={isTypeInterest ? menuCareerList : undefined}
      />

    </React.Fragment>
  );
};

export default ExplorerMultipleItemsMenu;
