import * as React from 'react';
import { Menu, Header, Responsive, Button, Icon } from 'semantic-ui-react';
import { NavLink, withRouter, Link } from 'react-router-dom';
import * as _ from 'lodash';
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
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import * as Router from './RouterHelperFunctions';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';

type explorerInterfaces = IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity;

interface IExplorerMenuNonMobileWidgetProps {
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
class ExplorerMenuNonMobileWidget extends React.Component<IExplorerMenuNonMobileWidgetProps> {
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

  private isType = (typeToCheck: string): boolean => {
    const { type } = this.props;
    return type === typeToCheck;
  }

  // Determines whether or not we show a "check green circle outline icon" for an item
  private getItemStatus = (item: explorerInterfaces): string => {
    const { type } = this.props;
    switch (type) {
      case EXPLORER_TYPE.ACADEMICPLANS:
        return this.userPlans(item as IAcademicPlan);
      case EXPLORER_TYPE.CAREERGOALS:
        return this.userCareerGoals(item as ICareerGoal);
      case EXPLORER_TYPE.COURSES:
        return this.userCourses(item as ICourse);
      // case 'degrees': users currently cannot add a desired degree to their profile
      //   return this.userDegrees(item.item as DesiredDegree);
      case EXPLORER_TYPE.INTERESTS:
        return this.userInterests(item as IInterest);
      case EXPLORER_TYPE.OPPORTUNITIES:
        return this.userOpportunities(item as IOpportunity);
      case EXPLORER_TYPE.USERS: // do nothing
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
    const iconStyle: React.CSSProperties = {
      position: 'absolute',
      marginLeft: '-20px',
    };
    const marginTopStyle = { marginTop: '5px' };

    const baseUrl = this.props.match.url;
    const username = this.getUsername();
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}`;

    const { menuAddedList, menuCareerList } = this.props;
    const isStudent = this.isRoleStudent();
    const adminEmail = 'radgrad@hawaii.edu';
    return (
      <React.Fragment>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          {
            this.isType('plans') ?
              <React.Fragment>
                <Button as={Link} to={`${baseRoute}/explorer/${this.props.type}`} style={marginTopStyle}>
                  <Icon name="chevron circle left"/><br/>Back to {this.getTypeName()}
                </Button>
                {
                  isStudent ?
                    <Menu vertical={true} text={true}>
                      <Header as="h4" dividing={true}>MY ACADEMIC PLAN</Header>
                      {
                        menuAddedList.map((listItem, index) => (
                          <Menu.Item as={NavLink} key={index} exact={true}
                                     to={`${baseRoute}/explorer/plans/${this.slugName(listItem.item)}`}>
                            <i className={this.getItemStatus(listItem.item)} style={iconStyle}/>
                            {this.itemName(listItem)}
                          </Menu.Item>
                        ))
                      }
                    </Menu>
                    : ''
                }
              </React.Fragment>
              : ''
          }

          {
            this.isType('courses') ?
              <React.Fragment>
                <Button as={Link} to={`${baseRoute}/explorer/${this.props.type}`} style={marginTopStyle}>
                  <Icon name="chevron circle left"/><br/>Back to {this.getTypeName()}
                </Button>
                {
                  isStudent ?
                    <Menu vertical={true} text={true}>
                      <Header as="h4" dividing={true}>COURSES IN MY PLAN</Header>
                      {
                        menuAddedList.map((listItem, index) => (
                          <Menu.Item as={NavLink} key={index} exact={true}
                                     to={`${baseRoute}/explorer/courses/${this.slugName(listItem.item)}`}>
                            <i className={this.getItemStatus(listItem.item)} style={iconStyle}/>
                            {this.courseName(listItem as { item: ICourse, count: number })}
                          </Menu.Item>
                        ))
                      }
                    </Menu>
                    : ''
                }
              </React.Fragment>
              : ''
          }

          {
            this.isType('opportunities') ?
              <React.Fragment>
                <a href={`mailto:${adminEmail}?subject=New Opportunity Suggestion`}>Suggest a new Opportunity</a>
                <Button as={Link} to={`${baseRoute}/explorer/${this.props.type}`} style={marginTopStyle}>
                  <Icon name="chevron circle left"/><br/>Back to {this.getTypeName()}
                </Button>
                {
                  isStudent ?
                    <Menu vertical={true} text={true}>
                      <Header as="h4" dividing={true}>OPPORTUNITIES IN MY PLAN</Header>
                      {
                        menuAddedList.map((listItem, index) => (
                          <Menu.Item as={NavLink} key={index} exact={true}
                                     to={`${baseRoute}/explorer/opportunities/${this.slugName(listItem.item)}`}>
                            <i className={this.getItemStatus(listItem.item)} style={iconStyle}/>
                            {this.opportunityItemName(listItem as { item: IOpportunity, count: number })}
                          </Menu.Item>
                        ))
                      }
                    </Menu>
                    : ''
                }
              </React.Fragment>
              : ''
          }

          {/* Components renderable to STUDENTS, FACULTY, and MENTORS. But if we are FACULTY or MENTORS, make sure we
                don't map over menuAddedList or else we get undefined error. */}
          {
            this.isType('interests') ?
              <Menu vertical={true} text={true}>
                <a href={`mailto:${adminEmail}?subject=New Interest Suggestion`}>Suggest a new Interest</a>
                <Button as={Link} to={`${baseRoute}/explorer/${this.props.type}`} style={marginTopStyle}>
                  <Icon name="chevron circle left"/><br/>Back to {this.getTypeName()}
                </Button>
                <Header as="h4" dividing={true}>MY INTERESTS</Header>
                {
                  menuAddedList.map((listItem, index) => (
                    <Menu.Item as={NavLink} key={index} exact={true}
                               to={`${baseRoute}/explorer/interests/${this.slugName(listItem.item)}`}>
                      <i className={this.getItemStatus(listItem.item)} style={iconStyle}/>
                      {this.itemName(listItem)}
                    </Menu.Item>
                  ))
                }

                <Header as="h4" dividing={true}>CAREER GOAL INTERESTS</Header>
                {
                  menuCareerList.map((listItem, index) => (
                    <Menu.Item as={NavLink} key={index} exact={true}
                               to={`${baseRoute}/explorer/interests/${this.slugName(listItem.item)}`}>
                      <i className={this.getItemStatus(listItem.item)} style={iconStyle}/>
                      {this.itemName(listItem)}
                    </Menu.Item>
                  ))
                }
              </Menu>
              : ''
          }

          {
            this.isType('career-goals') ?
              <Menu vertical={true} text={true}>
                <a href={`mailto:${adminEmail}?subject=New Career Goal Suggestion`}>Suggest a new Career Goal</a>
                <Button as={Link} to={`${baseRoute}/explorer/${this.props.type}`} style={marginTopStyle}>
                  <Icon name="chevron circle left"/><br/>Back to {this.getTypeName()}
                </Button>
                <Header as="h4" dividing={true}>MY CAREER GOALS</Header>
                {
                  menuAddedList.map((listItem, index) => (
                    <Menu.Item as={NavLink} key={index} exact={true}
                               to={`${baseRoute}/explorer/career-goals/${this.slugName(listItem.item)}`}>
                      <i className={this.getItemStatus(listItem.item)} style={iconStyle}/>
                      {this.itemName(listItem)}
                    </Menu.Item>
                  ))
                }
              </Menu>
              : ''
          }

          {
            this.isType('degrees') ?
              <Button as={Link} to={`${baseRoute}/explorer/${this.props.type}`} style={marginTopStyle}>
                <Icon name="chevron circle left"/><br/>Back to {this.getTypeName()}
              </Button>
              : ''
          }
        </Responsive>
      </React.Fragment>
    );
  }
}

export const ExplorerMenuNonMobileWidgetCon = withTracker((props) => {
  const username = Router.getUsername(props.match);
  const profile = Users.getProfile(username);
  return {
    profile,
  };
})(ExplorerMenuNonMobileWidget);
export const ExplorerMenuNonMobileWidgetContainer = withRouter(ExplorerMenuNonMobileWidgetCon);
export default ExplorerMenuNonMobileWidgetContainer;
