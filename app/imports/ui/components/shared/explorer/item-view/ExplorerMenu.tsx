import React from 'react';
import ExplorerMenuNonMobileWidget from './ExplorerMenuNonMobileWidget';
import ExplorerMenuMobileWidget from './ExplorerMenuMobileWidget';
import { EXPLORER_TYPE } from '../../../../layouts/utilities/route-constants';
import ExplorerNavDropdown from '../ExplorerNavDropdown';
import { ListItem } from './ExplorerMenuMobileItem';

interface ExplorerMenuProps {
  menuAddedList: ListItem[];
  menuCareerList?: ListItem[] | undefined;
  type: 'plans' | 'career-goals' | 'courses' | 'interests' | 'opportunities' | 'users'; // TODO should this be a defined type?
}

const getTypeName = (type: string): string => {
  const names = ['Career Goals', 'Courses', 'Interests', 'Opportunities', 'Users'];
  // TODO QA this feels terrible.
  switch (type) {
    case EXPLORER_TYPE.CAREERGOALS:
      return names[0];
    case EXPLORER_TYPE.COURSES:
      return names[1];
    case EXPLORER_TYPE.INTERESTS:
      return names[2];
    case EXPLORER_TYPE.OPPORTUNITIES:
      return names[3];
    default:
      return '';
  }
};

const ExplorerMenu: React.FC<ExplorerMenuProps> = ({ menuAddedList, menuCareerList, type }) => (
  <React.Fragment>
    <ExplorerNavDropdown text={getTypeName(type)} />
    <br />

    <ExplorerMenuNonMobileWidget menuAddedList={menuAddedList} menuCareerList={type && menuCareerList ? menuCareerList : undefined} type={type} />
    <ExplorerMenuMobileWidget menuAddedList={menuAddedList} menuCareerList={type && menuCareerList ? menuCareerList : undefined} type={type} />
  </React.Fragment>
);

export default ExplorerMenu;
