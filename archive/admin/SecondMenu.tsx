import React from 'react';
import { Menu, SemanticWIDTHS } from 'semantic-ui-react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { buildRouteName } from '../shared/utilities/router';

interface MenuItem {
  label: string;
  id: string;
  route: string;
  regex?: string;
}

interface SecondMenuProps {
  menuItems: MenuItem[];
  numItems: SemanticWIDTHS;
}

const SecondMenu: React.FC<SecondMenuProps> = ({ menuItems, numItems }) => {
  const match = useRouteMatch();
  return (
    <Menu attached="top" borderless widths={numItems} secondary inverted pointing className="radgrad-second-menu mobile hidden" id="secondMenu">
      {menuItems.map((item) => (
        <Menu.Item id={item.id} key={item.label} as={NavLink} exact={false} to={buildRouteName(match, `/${item.route}`)}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default SecondMenu;
