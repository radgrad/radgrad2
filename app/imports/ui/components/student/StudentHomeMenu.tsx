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

  private getRouteName = () => {
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
    const studentPageRouteNames = ['Home', 'About Me', 'ICE Points', 'Levels', 'Advisor Log'];
    const studentPageRouteUrls = ['', 'aboutme', 'ice', 'levels', 'log'];
    const menuMobileOptions = studentPageRouteNames.map((name, index) => ({
      key: name,
      text: name,
      as: NavLink,
      exact: true,
      to: `/student/${username}/home/${studentPageRouteUrls[index]}`,
      style: { textDecoration: 'none' },
    }));

    return (
      <React.Fragment>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Menu vertical={true} text={true}>
            <Menu.Item as={NavLink} exact={true} to={`/student/${username}/home`}
                       className={this.isActiveRoute('home') ? 'active item' : undefined}>Home</Menu.Item>
            <Menu.Item as={NavLink} exact={true} to={`/student/${username}/home/aboutme`}
                       className={this.isActiveRoute('aboutme') ? 'active item' : undefined}>About Me</Menu.Item>
            <Menu.Item as={NavLink} exact={true} to={`/student/${username}/home/ice`}
                       className={this.isActiveRoute('ice') ? 'active item' : undefined}>ICE Points</Menu.Item>
            <Menu.Item as={NavLink} exact={true} to={`/student/${username}/home/levels`}
                       className={this.isActiveRoute('levels') ? 'active item' : undefined}>Levels</Menu.Item>
            <Menu.Item as={NavLink} exact={true} to={`/student/${username}/home/log`}
                       className={this.isActiveRoute('log') ? 'active item' : undefined}>Advisor Log </Menu.Item>
          </Menu>
        </Responsive>

        <Responsive {...Responsive.onlyMobile}>
          <Dropdown selection={true} fluid={true} options={menuMobileOptions} text={this.getRouteName()}/>
        </Responsive>
      </React.Fragment>
    );
  }
}

export default withRouter(StudentHomeMenu);
