import React from 'react';
import { Menu, SemanticWIDTHS } from 'semantic-ui-react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { secondMenu } from '../shared/shared-widget-names';
import { buildRouteName } from '../shared/utilities/router';

interface IMenuItem {
  label: string;
  id: string;
  route: string;
  regex?: string;
}

interface ISecondMenuProps {
  menuItems: IMenuItem[];
  numItems: SemanticWIDTHS;
}

const SecondMenu = (props: ISecondMenuProps) => {
  const match = useRouteMatch();
  return (
    <Menu
      attached="top"
      borderless
      widths={props.numItems}
      secondary
      inverted
      pointing
      className="radgrad-second-menu mobile hidden"
      id={`${secondMenu}`}
    >
      {props.menuItems.map((item) => (
        <Menu.Item id={item.id} key={item.label} as={NavLink} exact={false} to={buildRouteName(match, `/${item.route}`)}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default SecondMenu;
