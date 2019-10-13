import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Dropdown, Responsive } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import * as Router from './RouterHelperFunctions';
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
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import ExplorerMenuMobileItem from './ExplorerMenuMobileItem';
import {
  userPlans,
  userCareerGoals,
} from './explorer-helper-functions';


type explorerInterfaces = IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity;

interface ICardExplorerMenuMobileWidgetProps {
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
const isType = (typeToCheck: string, props: ICardExplorerMenuMobileWidgetProps) => {
  const { type } = props;
  return type === typeToCheck;
};

// FIXME: Needs to be reactive
class CardExplorerMenuMobileWidget extends React.Component<ICardExplorerMenuMobileWidgetProps> {
  constructor(props) {
    super(props);
  }

  /* ####################################### GENERAL HELPER FUNCTIONS ############################################ */

  // Determines whether or not we show a "check green circle outline icon" for an item
  private getItemStatus = (item: explorerInterfaces): string => {
    const { type } = this.props;
    switch (type) {
      case EXPLORER_TYPE.ACADEMICPLANS:
        return userPlans(item as IAcademicPlan, this.props.match);
      case EXPLORER_TYPE.CAREERGOALS:
        return userCareerGoals(item as ICareerGoal, this.props.match);
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

  /* ####################################### COURSES HELPER FUNCTIONS ############################################## */
  private userCourses = (course: ICourse): string => {
    let ret = '';
    const ci = CourseInstances.find({
      studentID: Router.getUserIdFromRoute(this.props.match),
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
    const profile = Users.getProfile(Router.getUsername(this.props.match));
    if (_.includes(Users.getInterestIDs(profile.userID), interest._id)) {
      ret = 'check green circle outline icon';
    }
    return ret;
  }

  /* ####################################### OPPORTUNITIES HELPER FUNCTIONS ######################################## */
  private userOpportunities = (opportunity: IOpportunity): string => {
    let ret = '';
    const oi = OpportunityInstances.find({
      studentID: Router.getUserIdFromRoute(this.props.match),
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

  // These are functions to help build the Dropdown for mobile
  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

    const { menuAddedList, menuCareerList } = this.props;
    const isStudent = Router.isUrlRoleStudent(this.props.match);
    return (
      <React.Fragment>
        {/* ####### The Menu underneath the Dropdown for MOBILE ONLY ####### */}
        {/* The following components are rendered ONLY for STUDENTS: Academic Plans, Courses, and Opportunities. */}
        <Responsive {...Responsive.onlyMobile}>
          {
            isType(EXPLORER_TYPE.ACADEMICPLANS, this.props) ?
              <React.Fragment>
                {
                  isStudent ?
                    <Dropdown className="selection" fluid={true} text="Select Item" style={{ marginTop: '1rem' }}>
                      <Dropdown.Menu>
                        <Dropdown.Header as="h4">MY ACADEMIC PLAN</Dropdown.Header>
                        <Dropdown.Divider/>
                        {
                          menuAddedList.map((listItem, index) => (
                            <ExplorerMenuMobileItem type={EXPLORER_TYPE.ACADEMICPLANS} listItem={listItem} key={index} match={this.props.match}/>
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
            isType(EXPLORER_TYPE.COURSES, this.props) ?
              <React.Fragment>
                {
                  isStudent ?
                    <Dropdown className="selection" fluid={true} text="Select Item" style={{ marginTop: '1rem' }}>
                      <Dropdown.Menu>
                        <Dropdown.Header as="h4">COURSES IN MY PLAN</Dropdown.Header>
                        <Dropdown.Divider/>
                        {
                          menuAddedList.map((listItem, index) => (
                            <ExplorerMenuMobileItem type={EXPLORER_TYPE.COURSES} listItem={listItem} key={index} match={this.props.match}/>
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
            isType(EXPLORER_TYPE.OPPORTUNITIES, this.props) ?
              <React.Fragment>
                {
                  isStudent ?
                    <Dropdown className="selection" fluid={true} text="Select Item" style={{ marginTop: '1rem' }}>
                      <Dropdown.Menu>
                        <Dropdown.Header as="h4">OPPORTUNITIES IN MY PLAN</Dropdown.Header>
                        <Dropdown.Divider/>
                        {
                          menuAddedList.map((listItem, index) => (
                            <ExplorerMenuMobileItem type={EXPLORER_TYPE.OPPORTUNITIES} listItem={listItem} key={index} match={this.props.match}/>
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
            isType(EXPLORER_TYPE.INTERESTS, this.props) ?
              <Dropdown className="selection" fluid={true} text="Select Item" style={{ marginTop: '1rem' }}>
                <Dropdown.Menu>
                  <Dropdown.Header as="h4">MY INTERESTS</Dropdown.Header>
                  <Dropdown.Divider/>
                  {
                    menuAddedList.map((listItem, index) => (
                      <ExplorerMenuMobileItem type={EXPLORER_TYPE.INTERESTS} listItem={listItem} key={index} match={this.props.match}/>
                    ))
                  }

                  <Dropdown.Header as="h4">CAREER GOAL INTERESTS</Dropdown.Header>
                  <Dropdown.Divider/>
                  {
                    menuCareerList.map((listItem, index) => (
                      <ExplorerMenuMobileItem type={EXPLORER_TYPE.INTERESTS} listItem={listItem} key={index} match={this.props.match}/>
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
              : ''
          }

          {
            isType(EXPLORER_TYPE.CAREERGOALS, this.props) ?
              <Dropdown className="selection" fluid={true} text="Select Item" style={{ marginTop: '1rem' }}>
                <Dropdown.Menu>
                  <Dropdown.Header as="h4">MY CAREER GOALS</Dropdown.Header>
                  <Dropdown.Divider/>
                  {
                    menuAddedList.map((listItem, index) => (
                      <ExplorerMenuMobileItem type={EXPLORER_TYPE.CAREERGOALS} listItem={listItem} key={index} match={this.props.match}/>
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

export const CardExplorerMenuMobileWidgetCon = withTracker((props) => {
  const username = Router.getUsername(props.match);
  const profile = Users.getProfile(username);
  return {
    profile,
  };
})(CardExplorerMenuMobileWidget);
export const CardExplorerMenuMobileWidgetContainer = withRouter(CardExplorerMenuMobileWidgetCon);
export default CardExplorerMenuMobileWidgetContainer;
