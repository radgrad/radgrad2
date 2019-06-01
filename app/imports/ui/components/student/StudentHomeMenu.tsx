import * as React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Dropdown, Menu, Responsive } from 'semantic-ui-react';

interface IStudentHomeMenuProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

class StudentHomeMenu extends React.Component<IStudentHomeMenuProps> {
  constructor(props) {
    super(props);
  }

  private isActiveRoute = (routeToCheck) => {
    const url = this.props.match.url;
    switch (routeToCheck) {
      case 'home':
        return url.includes(routeToCheck);
      case 'aboutme':
        return url.includes(routeToCheck);
      case 'ice':
        return url.includes(routeToCheck);
      case 'levels':
        return url.includes(routeToCheck);
      case 'log':
        return url.includes(routeToCheck);
      default:
        return false;
    }
  }

  private buildRouteName = () => {
    const url = this.props.match.url;
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
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const username = this.props.match.params.username;
    const baseUrl = this.props.match.url;
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
          <Menu vertical={true} text={true}>
            {
              menuItems.map((item, index) => (<Menu.Item
                key={index}
                as={NavLink}
                exact={true}
                to={`${baseRoute}home/${item.route}`}
                active={this.isActiveRoute(item.route) ? true : undefined}
                content={item.key}/>))
            }
          </Menu>
        </Responsive>

        <Responsive {...Responsive.onlyMobile}>
          <Dropdown selection={true} fluid={true} options={menuMobileItems} text={this.buildRouteName()}/>
        </Responsive>
      </React.Fragment>
    );
  }
}

export default withRouter(StudentHomeMenu);
