import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import {
  IAcademicPlan, //eslint-disable-line
  ICareerGoal, //eslint-disable-line
  ICourse, //eslint-disable-line
  IDesiredDegree, //eslint-disable-line
  IInterest, //eslint-disable-line
  IOpportunity, //eslint-disable-line
} from '../../../typings/radgrad';
import CardExplorerMenuNonMobileWidget from './CardExplorerMenuNonMobileWidget';
import CardExplorerMenuMobileWidget from './CardExplorerMenuMobileWidget';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import * as Router from './RouterHelperFunctions';

type explorerInterfaces = IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity;

interface ICardExplorerMenuProps {
  menuAddedList: { item: explorerInterfaces, count: number }[];
  menuCareerList: { item: IInterest, count: number }[] | undefined;
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
}

// FIXME: Needs to be reactive
class CardExplorerMenu extends React.Component<ICardExplorerMenuProps> {
  constructor(props) {
    super(props);
  }

  /* ####################################### GENERAL HELPER FUNCTIONS ############################################ */
  private getUsername = (): string => Router.getUsername(this.props.match);

  private getTypeName = (): string => {
    const { type } = this.props;
    const names = ['Academic Plans', 'Career Goals', 'Courses', 'Degrees', 'Interests', 'Opportunities', 'Users'];
    switch (type) {
      case EXPLORER_TYPE.ACADEMICPLANS:
        return names[0];
      case EXPLORER_TYPE.CAREERGOALS:
        return names[1];
      case EXPLORER_TYPE.COURSES:
        return names[2];
      case EXPLORER_TYPE.DEGREES:
        return names[3];
      case EXPLORER_TYPE.INTERESTS:
        return names[4];
      case EXPLORER_TYPE.OPPORTUNITIES:
        return names[5];
      case EXPLORER_TYPE.USERS:
        return names[6];
      default:
        return '';
    }
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const isTypeInterest = this.props.type === EXPLORER_TYPE.INTERESTS;

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
        <CardExplorerMenuNonMobileWidget menuAddedList={this.props.menuAddedList}
                                         type={this.props.type}
                                         role={this.props.role}
                                         menuCareerList={isTypeInterest ? this.props.menuCareerList : undefined}/>
        <CardExplorerMenuMobileWidget menuAddedList={this.props.menuAddedList}
                                      type={this.props.type}
                                      role={this.props.role}
                                      menuCareerList={isTypeInterest ? this.props.menuCareerList : undefined}/>
      </React.Fragment>
    );
  }
}

export default withRouter(CardExplorerMenu);
