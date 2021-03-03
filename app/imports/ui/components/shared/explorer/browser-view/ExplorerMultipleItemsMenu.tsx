import React from 'react';
import { CareerGoal, Course, Interest, Opportunity } from '../../../../../typings/radgrad';
import { IExplorerTypes } from '../utilities/explorer';
import CardExplorerMenuNonMobileWidget from './ExplorerMultipleItemsMenuNonMobileWidget';
import CardExplorerMenuMobileWidget from './ExplorerMultipleItemsMenuMobileWidget';

type ExplorerInterfaces = CareerGoal | Course | Interest | Opportunity;

export interface ExplorerMenuItem {
  item: ExplorerInterfaces;
  count: number;
}

interface CardExplorerMenuProps {
  menuAddedList: ExplorerMenuItem[];
  type: IExplorerTypes;
}

const ExplorerMultipleItemsMenu: React.FC<CardExplorerMenuProps> = ({ menuAddedList, type }) => (
    <React.Fragment>
      <CardExplorerMenuNonMobileWidget menuAddedList={menuAddedList} type={type} />
      <CardExplorerMenuMobileWidget menuAddedList={menuAddedList} type={type} />
    </React.Fragment>
);

export default ExplorerMultipleItemsMenu;
