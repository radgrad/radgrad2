import * as React from 'react';
import { Dropdown, Menu, Header, Responsive, Button, Icon } from 'semantic-ui-react';
import { NavLink, withRouter, Link } from 'react-router-dom';
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
    const iconStyle: React.CSSProperties = {
      position: 'absolute',
      marginLeft: '-20px',
    };
    const marginTopStyle = { marginTop: '5px' };

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

    const { menuAddedList, menuCareerList } = this.props;
    const isStudent = this.isRoleStudent();
    const adminEmail = 'radgrad@hawaii.edu';
    return (
      <React.Fragment>
        {/* ####### Main Dropdown Menu ####### */}
        <Dropdown selection={true} fluid={true} options={menuOptions} text={this.getTypeName()}/>
        <br/>

        {/* ####### The Menu underneath the Dropdown for NON mobile  ####### */}
        {/* The following components are rendered ONLY for STUDENTS: Academic Plans, Courses, and Opportunities. However,
            FACULTY or MENTORS have a 'Suggest a Opportunity / Career Goal' mailto link. */}
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

        {/* ####### The Menu underneath the Dropdown for MOBILE ONLY ####### */}
        {/* The following components are rendered ONLY for STUDENTS: Academic Plans, Courses, and Opportunities. */}
        <Responsive {...Responsive.onlyMobile}>
          {
            this.isType('plans') ?
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
                                           to={`${baseRoute}/explorer/plans/${this.slugName(listItem.item)}`}
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
            this.isType('courses') ?
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
                                           to={`${baseRoute}/explorer/courses/${this.slugName(listItem.item)}`}
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
            this.isType('opportunities') ?
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
                                           to={`${baseRoute}/explorer/opportunities/${this.slugName(listItem.item)}`}
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
            this.isType('interests') ?
              <Dropdown className="selection" fluid={true} text="Select Item" style={{ marginTop: '1rem' }}>
                <Dropdown.Menu>
                  <Dropdown.Header as="h4">MY INTERESTS</Dropdown.Header>
                  <Dropdown.Divider/>
                  {
                    menuAddedList.map((listItem, index) => (
                      <Dropdown.Item as={NavLink} key={index} exact={true}
                                     to={`${baseRoute}/explorer/interests/${this.slugName(listItem.item)}`}
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
                                     to={`${baseRoute}/explorer/interests/${this.slugName(listItem.item)}`}
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
            this.isType('career-goals') ?
              <Dropdown className="selection" fluid={true} text="Select Item" style={{ marginTop: '1rem' }}>
                <Dropdown.Menu>
                  <Dropdown.Header as="h4">MY CAREER GOALS</Dropdown.Header>
                  <Dropdown.Divider/>
                  {
                    menuAddedList.map((listItem, index) => (
                      <Dropdown.Item as={NavLink} key={index} exact={true}
                                     to={`${baseRoute}/explorer/career-goals/${this.slugName(listItem.item)}`}
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

export default withRouter(ExplorerMenu);
