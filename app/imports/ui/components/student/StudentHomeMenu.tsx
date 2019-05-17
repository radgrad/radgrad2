import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Dropdown, Responsive } from 'semantic-ui-react';

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

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const username = this.props.match.params.username;
    return (
        <div>
          <Menu vertical={true} text={true}>
            <Menu.Item><Link to={`/student/${username}/home`}>Home </Link></Menu.Item>
            <Menu.Item><Link to={`/student/${username}/home/aboutme`}>About Me</Link></Menu.Item>
            <Menu.Item><Link to={`/student/${username}/home/ice`}>ICE Points</Link></Menu.Item>
            <Menu.Item><Link to={`/student/${username}/home/levels`}>Level</Link></Menu.Item>
            <Menu.Item><Link to={`/student/${username}/home/log`}>Advisor Log</Link></Menu.Item>
          </Menu>

          <Responsive {...Responsive.onlyMobile}>
            <Dropdown fluid={true}>
              <Menu>
                <Menu.Item><Link to={`/student/${username}/home`}>Home </Link></Menu.Item>
                <Menu.Item><Link to={`/student/${username}/home/aboutme`}>About Me</Link></Menu.Item>
                <Menu.Item><Link to={`/student/${username}/home/ice`}>ICE Points</Link></Menu.Item>
                <Menu.Item><Link to={`/student/${username}/home/levels`}>Level</Link></Menu.Item>
                <Menu.Item><Link to={`/student/${username}/home/log`}>Advisor Log</Link></Menu.Item>
              </Menu>
            </Dropdown>
          </Responsive>
        </div>
    );
  }
}

export default withRouter(StudentHomeMenu);
