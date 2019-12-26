import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Dropdown, Menu, Responsive } from 'semantic-ui-react';
import { leftHandMenu } from '../shared/shared-widget-names';
import { IRadGradMatch } from '../../../typings/radgrad';

interface IStudentHomeMenuProps {
  match: IRadGradMatch;
}

const buildRouteName = (props: IStudentHomeMenuProps) => {
  const url = props.match.url;
  const splitUrl = url.split('/');
  const routeName = splitUrl[splitUrl.length - 1];
  switch (routeName) {
    case 'aboutme':
      return 'About Me';
    case 'ice':
      return 'ICE Points';
    case 'levels':
      return 'Levels';
    case 'log':
      return 'Advisor Log';
    default:
      return 'Home';
  }
};


const StudentHomeMenu = (props: IStudentHomeMenuProps) => {
  const username = props.match.params.username;
  const baseUrl = props.match.url;
  const baseIndex = baseUrl.indexOf(username);
  const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}/`;

  const menuItems = [
    { key: 'Home', route: '' },
    { key: 'About Me', route: 'aboutme' },
    { key: 'ICE Points', route: 'ice' },
    { key: 'Levels', route: 'levels' },
    { key: 'Advisor Log', route: 'log' },
  ];

  const menuMobileItems = menuItems.map((item) => ({
    key: item.key,
    text: item.key,
    as: NavLink,
    exact: true,
    to: `${baseRoute}home/${item.route}`,
    style: { textDecoration: 'none' },
  }));

  return (
    <React.Fragment>
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <Menu vertical id={`${leftHandMenu}`}>
          {
            menuItems.map((item, index) => (
              <Menu.Item
                key={item.key}
                as={NavLink}
                exact
                to={`${baseRoute}home/${item.route}`}
                content={item.key}
              />
))
          }
        </Menu>
      </Responsive>

      <Responsive {...Responsive.onlyMobile}>
        <Dropdown id="leftHandMenu" selection fluid options={menuMobileItems} text={buildRouteName(props)} />
      </Responsive>
    </React.Fragment>
  );
};

export default withRouter(StudentHomeMenu);
