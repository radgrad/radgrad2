import * as React from 'react';
import { Dropdown, Responsive } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
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

interface IExplorerMenuMobileWidgetProps {
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
class ExplorerMenuMobileWidget extends React.Component<IExplorerMenuMobileWidgetProps> {
  constructor(props) {
    super(props);
  }

  /* ####################################### GENERAL HELPER FUNCTIONS ############################################ */
  private getUsername = (): string => Router.getUsername(this.props.match);

  private getUserIdFromRoute = (): string => Router.getUserIdFromRoute(this.props.match);

  private isRoleStudent = (): boolean => Router.isUrlRoleStudent(this.props.match);

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

    const baseUrl = this.props.match.url;
    const username = this.getUsername();
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}`;

    const { menuAddedList, menuCareerList } = this.props;
    const isStudent = this.isRoleStudent();
    return (
      <React.Fragment>
        <Responsive {...Responsive.onlyMobile}>
          {
            this.isType(EXPLORER_TYPE.ACADEMICPLANS) ?
              <React.Fragment>
                {
                  isStudent ?
                    <Dropdown className="selection" fluid={true} text="Select Item" style={{ marginTop: '1rem' }}>
                      <Dropdown.Menu>
                        <Dropdown.Header as="h4">MY ACADEMIC PLAN</Dropdown.Header>
                        <Dropdown.Divider/>
                        {
                          menuAddedList.map((listItem, index) => (
                            <Dropdown.Item as={NavLink} key={index} exact={true}
                                           to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.ACADEMICPLANS}/${this.slugName(listItem.item)}`}
                                           text={(
                                             <React.Fragment>
                                               <i className={this.getItemStatus(listItem.item)} style={iconStyle}/>
                                               {this.itemName(listItem)}
                                             </React.Fragment>
                                           )}/>
                          ))
                        }
                      </Dropdown.Menu>
                    </Dropdown>
                    : ''
                }
              </React.Fragment>
              : ''
          }

          {
            this.isType(EXPLORER_TYPE.COURSES) ?
              <React.Fragment>
                {
                  isStudent ?
                    <Dropdown className="selection" fluid={true} text="Select Item" style={{ marginTop: '1rem' }}>
                      <Dropdown.Menu>
                        <Dropdown.Header as="h4">COURSES IN MY PLAN</Dropdown.Header>
                        <Dropdown.Divider/>
                        {
                          menuAddedList.map((listItem, index) => (
                            <Dropdown.Item as={NavLink} key={index} exact={true}
                                           to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${this.slugName(listItem.item)}`}
                                           text={(
                                             <React.Fragment>
                                               <i className={this.getItemStatus(listItem.item)} style={iconStyle}/>
                                               {this.courseName(listItem as { item: ICourse, count: number })}
                                             </React.Fragment>
                                           )}/>
                          ))
                        }
                      </Dropdown.Menu>
                    </Dropdown>
                    : ''
                }
              </React.Fragment>
              : ''
          }

          {
            this.isType(EXPLORER_TYPE.OPPORTUNITIES) ?
              <React.Fragment>
                {
                  isStudent ?
                    <Dropdown className="selection" fluid={true} text="Select Item" style={{ marginTop: '1rem' }}>
                      <Dropdown.Menu>
                        <Dropdown.Header as="h4">OPPORTUNITIES IN MY PLAN</Dropdown.Header>
                        <Dropdown.Divider/>
                        {
                          menuAddedList.map((listItem, index) => (
                            <Dropdown.Item as={NavLink} key={index} exact={true}
                                           to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${this.slugName(listItem.item)}`}
                                           text={(
                                             <React.Fragment>
                                               <i className={this.getItemStatus(listItem.item)} style={iconStyle}/>
                                               {this.itemName(listItem)}
                                             </React.Fragment>
                                           )}/>
                          ))
                        }
                      </Dropdown.Menu>
                    </Dropdown>
                    : ''
                }
              </React.Fragment>
              : ''
          }

          {/* Components renderable to STUDENTS, FACULTY, and MENTORS. */}
          {
            this.isType(EXPLORER_TYPE.INTERESTS) ?
              <Dropdown className="selection" fluid={true} text="Select Item" style={{ marginTop: '1rem' }}>
                <Dropdown.Menu>
                  <Dropdown.Header as="h4">MY INTERESTS</Dropdown.Header>
                  <Dropdown.Divider/>
                  {
                    menuAddedList.map((listItem, index) => (
                      <Dropdown.Item as={NavLink} key={index} exact={true}
                                     to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${this.slugName(listItem.item)}`}
                                     text={(
                                       <React.Fragment>
                                         <i className={this.getItemStatus(listItem.item)} style={iconStyle}/>
                                         {this.itemName(listItem)}
                                       </React.Fragment>
                                     )}/>
                    ))
                  }

                  <Dropdown.Header as="h4">CAREER GOAL INTERESTS</Dropdown.Header>
                  <Dropdown.Divider/>
                  {
                    menuCareerList.map((listItem, index) => (
                      <Dropdown.Item as={NavLink} key={index} exact={true}
                                     to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${this.slugName(listItem.item)}`}
                                     text={(
                                       <React.Fragment>
                                         <i className={this.getItemStatus(listItem.item)} style={iconStyle}/>
                                         {this.itemName(listItem)}
                                       </React.Fragment>
                                     )}/>
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
              : ''
          }

          {
            this.isType(EXPLORER_TYPE.CAREERGOALS) ?
              <Dropdown className="selection" fluid={true} text="Select Item" style={{ marginTop: '1rem' }}>
                <Dropdown.Menu>
                  <Dropdown.Header as="h4">MY CAREER GOALS</Dropdown.Header>
                  <Dropdown.Divider/>
                  {
                    menuAddedList.map((listItem, index) => (
                      <Dropdown.Item as={NavLink} key={index} exact={true}
                                     to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${this.slugName(listItem.item)}`}
                                     text={(
                                       <React.Fragment>
                                         <i className={this.getItemStatus(listItem.item)} style={iconStyle}/>
                                         {this.itemName(listItem)}
                                       </React.Fragment>
                                     )}/>
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
              : ''
          }
        </Responsive>
      </React.Fragment>
    );
  }
}

export const ExplorerMenuMobileWidgetCon = withTracker((props) => {
  const username = Router.getUsername(props.match);
  const profile = Users.getProfile(username);
  return {
    profile,
  };
})(ExplorerMenuMobileWidget);
export const ExplorerMenuMobileWidgetContainer = withRouter(ExplorerMenuMobileWidgetCon);
export default ExplorerMenuMobileWidgetContainer;
