import React from 'react';
import { Menu, SemanticWIDTHS } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import { secondMenu } from '../../components/shared/shared-widget-names';
import { buildRouteName } from '../../components/shared/RouterHelperFunctions';

interface IMenuItem {
  label: string;
  route: string;
  regex?: string;
}

interface ISecondMenuProps {
  menuItems: IMenuItem[];
  numItems: SemanticWIDTHS;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const SecondMenu = (props: ISecondMenuProps) => {
  const { match } = props;
  return (
    <Menu
      attached="top"
      borderless
      widths={props.numItems}
      secondary
      pointing
      className="radgrad-second-menu mobile hidden"
      id={`${secondMenu}`}
    >
      {props.menuItems.map((item) => (
        <Menu.Item key={item.label} as={NavLink} exact={false} to={buildRouteName(match, `/${item.route}`)}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default withRouter(SecondMenu);
