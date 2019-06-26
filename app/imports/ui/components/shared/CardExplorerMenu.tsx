import * as React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import {
  IAcademicPlan, //eslint-disable-line
  ICareerGoal, //eslint-disable-line
  ICourse, //eslint-disable-line
  IDesiredDegree, //eslint-disable-line
  IInterest, //eslint-disable-line
  IOpportunity, //eslint-disable-line
} from '../../../typings/radgrad';
import { Users } from '../../../api/user/UserCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import CardExplorerMenuNonMobileWidget from './CardExplorerMenuNonMobileWidget';
import CardExplorerMenuMobileWidget from './CardExplorerMenuMobileWidget';

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
  private getUsername = (): string => this.props.match.params.username;

  private getUserIdFromRoute = (): string => {
    const username = this.getUsername();
    return username && Users.getID(username);
  }

  private isRoleStudent = (): boolean => this.props.role === 'student';

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

  private isType = (typeToCheck: string): boolean => {
    const { type } = this.props;
    return type === typeToCheck;
  }

  private equals = (a: string, b: string): boolean => {
    const listArg = b.split(',');
    if (listArg.indexOf(a) < 0) {
      return false;
    }
    return true;
  }

  // Determines whether or not we show a "check green circle outline icon" for an item
  private getItemStatus = (item: explorerInterfaces): string => {
    const { type } = this.props;
    switch (type) {
      case 'plans':
        return this.userPlans(item as IAcademicPlan);
      case 'career-goals':
        return this.userCareerGoals(item as ICareerGoal);
      case 'courses':
        return this.userCourses(item as ICourse);
      // case 'degrees': users currently cannot add a desired degree to their profile
      //   return this.userDegrees(item.item as DesiredDegree);
      case 'interests':
        return this.userInterests(item as IInterest);
      case 'opportunities':
        return this.userOpportunities(item as IOpportunity);
      case 'users': // do nothing
        return '';
      default:
        return '';
    }
  }

  private itemName = (item: { item: explorerInterfaces, count: number }): string => {
    const countStr = `x${item.count}`;
    if (item.count > 1) {
      return `${item.item.name} ${countStr}`;
    }
    return `${item.item.name}`;
  }

  private slugName = (item: { [key: string]: any }): string => Slugs.findDoc(item.slugID).name;

  /* ####################################### ACADEMIC PLANS HELPER FUNCTIONS ####################################### */
  private userPlans = (plan: IAcademicPlan): string => {
    let ret = '';
    const profile = Users.getProfile(this.getUsername());
    if (_.includes(profile.academicPlanID, plan._id)) {
      ret = 'check green circle outline icon';
    }
    return ret;
  }

  /* ####################################### CAREER GOALS HELPER FUNCTIONS ######################################### */
  private userCareerGoals = (careerGoal: ICareerGoal): string => {
    let ret = '';
    const profile = Users.getProfile(this.getUsername());
    if (_.includes(profile.careerGoalIDs, careerGoal._id)) {
      ret = 'check green circle outline icon';
    }
    return ret;
  }

  /* ####################################### COURSES HELPER FUNCTIONS ############################################## */
  private userCourses = (course: ICourse): string => {
    let ret = '';
    const ci = CourseInstances.find({
      studentID: this.getUserIdFromRoute(),
      courseID: course._id,
    }).fetch();
    if (ci.length > 0) {
      ret = 'check green circle outline icon';

    }
    return ret;
  }

  private courseName = (course: { item: ICourse, count: number }): string => {
    const countStr = `x${course.count}`;
    if (course.count > 1) {
      return `${course.item.shortName} ${countStr}`;
    }
    return `${course.item.shortName}`;
  }

  /* ####################################### INTERESTS HELPER FUNCTIONS ############################################ */
  private userInterests = (interest: IInterest): string => {
    let ret = '';
    const profile = Users.getProfile(this.getUsername());
    if (_.includes(Users.getInterestIDs(profile.userID), interest._id)) {
      ret = 'check green circle outline icon';
    }
    return ret;
  }

  /* ####################################### OPPORTUNITIES HELPER FUNCTIONS ######################################## */
  private userOpportunities = (opportunity: IOpportunity): string => {
    let ret = '';
    const oi = OpportunityInstances.find({
      studentID: this.getUserIdFromRoute(),
      opportunityID: opportunity._id,
    }).fetch();
    if (oi.length > 0) {
      ret = 'check green circle outline icon';

    }
    return ret;
  }

  private opportunityItemName = (item: { item: IOpportunity, count: number }): string => {
    const countStr = `x${item.count}`;
    const iceString = `(${item.item.ice.i}/${item.item.ice.c}/${item.item.ice.e})`;
    if (item.count > 1) {
      return `${item.item.name} ${iceString} ${countStr}`;
    }
    return `${item.item.name} ${iceString}`;
  }

  /* ####################################### MOBILE HELPER FUNCTIONS ############################################### */

  // These are functions to help build the Dropdown for mobile
  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const isTypeInterest = this.props.type === 'interests';

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
