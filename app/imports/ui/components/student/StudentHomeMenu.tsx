import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
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
    console.log(splitUrl);
    const routeName = splitUrl[splitUrl.length - 1];
    console.log(routeName);
    switch (routeName) {
      case 'home':
        return 'Home';
      case 'aboutme':
        return 'About Me';
      case 'ice':
        return 'ICE Points';
      case 'levels':
        return 'Levels';
      case 'log':
        return 'Advisor Log';
      default:
        return 'Menu';
    }
  }


  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const username = this.props.match.params.username;
    // TODO: Mobile version
    // const menuMobileOptions = [
    //   {
    //     key: 'Home',
    //     text: 'Home',
    //     value: 'Home',
    //   },
    // ];

    return (
      <React.Fragment>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <Menu vertical={true} text={true}>
            <Menu.Item active={this.isActiveRoute('home') ? true : undefined}><Link
              to={`/student/${username}/home`}>Home </Link></Menu.Item>
            <Menu.Item active={this.isActiveRoute('aboutme') ? true : undefined}><Link
              to={`/student/${username}/home/aboutme`}>About Me</Link></Menu.Item>
            <Menu.Item active={this.isActiveRoute('ice') ? true : undefined}><Link to={`/student/${username}/home/ice`}>ICE
              Points</Link></Menu.Item>
            <Menu.Item active={this.isActiveRoute('levels') ? true : undefined}><Link
              to={`/student/${username}/home/levels`}>Level</Link></Menu.Item>
            <Menu.Item active={this.isActiveRoute('log') ? true : undefined}><Link to={`/student/${username}/home/log`}>Advisor
              Log</Link></Menu.Item>
          </Menu>
        </Responsive>

        <Responsive {...Responsive.onlyMobile}>
          <Dropdown selection={true} fluid={true} icon="dropdown">
            <span>{this.getRouteName()}</span>
            <Menu>
              <Menu.Item><Link to={`/student/${username}/home`}>Home </Link></Menu.Item>
              <Menu.Item><Link to={`/student/${username}/home/aboutme`}>About Me</Link></Menu.Item>
              <Menu.Item><Link to={`/student/${username}/home/ice`}>ICE Points</Link></Menu.Item>
              <Menu.Item><Link to={`/student/${username}/home/levels`}>Level</Link></Menu.Item>
              <Menu.Item><Link to={`/student/${username}/home/log`}>Advisor Log</Link></Menu.Item>
            </Menu>
          </Dropdown>
        </Responsive>
      </React.Fragment>
    );
  }
}

export default withRouter(StudentHomeMenu);
