import React from 'react';
import { CareerGoal, Course, Interest, Opportunity } from '../../../../../typings/radgrad';
import { IExplorerTypes } from '../utilities/explorer';
import CardExplorerMenuNonMobileWidget from './ExplorerMultipleItemsMenuNonMobileWidget';
import CardExplorerMenuMobileWidget from './ExplorerMultipleItemsMenuMobileWidget';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';

type ExplorerInterfaces = CareerGoal | Course | Interest | Opportunity;

export interface ExplorerMenuItem {
  item: ExplorerInterfaces;
  count: number;
}

interface CardExplorerMenuProps {
  menuAddedList: ExplorerMenuItem[];
  menuCareerList: { item: Interest; count: number }[] | undefined;
  type: IExplorerTypes;
}

const ExplorerMultipleItemsMenu: React.FC<CardExplorerMenuProps> = ({ menuAddedList, menuCareerList, type }) => {
  const isTypeInterest = type === EXPLORER_TYPE.INTERESTS;

  return (
    <React.Fragment>
      <CardExplorerMenuNonMobileWidget menuAddedList={menuAddedList} type={type} menuCareerList={isTypeInterest ? menuCareerList : undefined} />

      <CardExplorerMenuMobileWidget menuAddedList={menuAddedList} type={type} menuCareerList={isTypeInterest ? menuCareerList : undefined} />
    </React.Fragment>
  );
};

export default ExplorerMultipleItemsMenu;
