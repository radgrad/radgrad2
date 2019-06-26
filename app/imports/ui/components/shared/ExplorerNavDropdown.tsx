import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import * as Router from './RouterHelperFunctions';

interface IExplorerNavDropdownProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params?: {
      username: string;
    }
  };
  text: string;
}

class ExplorerNavDropdown extends React.Component<IExplorerNavDropdownProps> {
  constructor(props) {
    super(props);
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const menuItems = [
      { key: 'Academic Plans', route: EXPLORER_TYPE.ACADEMICPLANS },
      { key: 'Career Goals', route: EXPLORER_TYPE.CAREERGOALS },
      { key: 'Courses', route: EXPLORER_TYPE.COURSES },
      { key: 'Degrees', route: EXPLORER_TYPE.DEGREES },
      { key: 'Interests', route: EXPLORER_TYPE.INTERESTS },
      { key: 'Opportunities', route: EXPLORER_TYPE.OPPORTUNITIES },
      { key: 'Users', route: EXPLORER_TYPE.USERS },
    ];

    const menuOptions = menuItems.map((item) => ({
      key: item.key,
      text: item.key,
      as: NavLink,
      exact: true,
      to: Router.buildRouteName(this.props.match, `/${EXPLORER_TYPE.HOME}/${item.route}`),
      style: { textDecoration: 'none' },
    }));
    return (
      <Dropdown selection={true} fluid={true} options={menuOptions} text={this.props.text}/>
    );
  }
}

export default ExplorerNavDropdown;
