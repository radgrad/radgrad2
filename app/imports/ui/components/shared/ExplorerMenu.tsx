import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import {
  IAcademicPlan, //eslint-disable-line
  ICareerGoal, //eslint-disable-line
  ICourse, //eslint-disable-line
  IDesiredDegree, //eslint-disable-line
  IInterest, //eslint-disable-line
  IOpportunity, //eslint-disable-line
  IProfile, // eslint-disable-line
} from '../../../typings/radgrad';
import { Users } from '../../../api/user/UserCollection';
import * as Router from './RouterHelperFunctions';
import ExplorerMenuNonMobileWidget from './ExplorerMenuNonMobileWidget';
import ExplorerMenuMobileWidget from './ExplorerMenuMobileWidget';

type explorerInterfaces = IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity;

interface IExplorerMenuProps {
  menuAddedList: { item: explorerInterfaces, count: number }[];
  menuCareerList?: { item: IInterest, count: number }[] | undefined;
  type: 'plans' | 'career-goals' | 'courses' | 'degrees' | 'interests' | 'opportunities' | 'users';
  role: 'student' | 'faculty' | 'mentor';
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
  profile: IProfile;
}

// FIXME: Needs to be reactive
class ExplorerMenu extends React.Component<IExplorerMenuProps> {
  constructor(props) {
    super(props);
  }

  /* ####################################### GENERAL HELPER FUNCTIONS ############################################ */
  private getUsername = (): string => this.props.match.params.username;

  private getUserIdFromRoute = (): string => {
    const username = this.getUsername();
    return username && Users.getID(username);
  }

  private getTypeName = (): string => {
    const { type } = this.props;
    const names = ['Academic Plans', 'Career Goals', 'Courses', 'Degrees', 'Interests', 'Opportunities', 'Users'];
    switch (type) {
      case 'plans':
        return names[0];
      case 'career-goals':
        return names[1];
      case 'courses':
        return names[2];
      case 'degrees':
        return names[3];
      case 'interests':
        return names[4];
      case 'opportunities':
        return names[5];
      case 'users':
        return names[6];
      default:
        return '';
    }
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const menuItems = [
      { key: 'Academic Plans', route: 'plans' },
      { key: 'Career Goals', route: 'career-goals' },
      { key: 'Courses', route: 'courses' },
      { key: 'Degrees', route: 'degrees' },
      { key: 'Interests', route: 'interests' },
      { key: 'Opportunities', route: 'opportunities' },
      { key: 'Users', route: 'users' },
    ];

    const baseUrl = this.props.match.url;
    const username = this.getUsername();
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}`;
    const menuOptions = menuItems.map((item) => ({
      key: item.key,
      text: item.key,
      as: NavLink,
      exact: true,
      to: `${baseRoute}/explorer/${item.route}`,
      style: { textDecoration: 'none' },
    }));

    return (
      <React.Fragment>
        {/* ####### Main Dropdown Menu ####### */}
        <Dropdown selection={true} fluid={true} options={menuOptions} text={this.getTypeName()}/>
        <br/>
        <ExplorerMenuNonMobileWidget menuAddedList={this.props.menuAddedList}
                                     menuCareerList={this.props.type && this.props.menuCareerList ? this.props.menuCareerList : undefined}
                                     type={this.props.type}
                                     role={this.props.role}/>
        <ExplorerMenuMobileWidget menuAddedList={this.props.menuAddedList}
                                  menuCareerList={this.props.type && this.props.menuCareerList ? this.props.menuCareerList : undefined}
                                  type={this.props.type}
                                  role={this.props.role}/>
      </React.Fragment>
    );
  }
}

export const ExplorerMenuCon = withTracker((props) => {
  const username = Router.getUsername(props.match);
  const profile = Users.getProfile(username);
  return {
    profile,
  };
})(ExplorerMenu);
export const ExplorerMenuContainer = withRouter(ExplorerMenuCon);
export default ExplorerMenuContainer;
