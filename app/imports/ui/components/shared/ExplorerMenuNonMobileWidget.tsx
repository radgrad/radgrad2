import * as React from 'react';
import { Menu, Header, Responsive, Button, Icon } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
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
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import ExplorerMenuNonMobileItem from './ExplorerMenuNonMobileItem';

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

// FIXME: Needs to be reactive.
class ExplorerMenuNonMobileWidget extends React.Component<IExplorerMenuNonMobileWidgetProps> {
  constructor(props) {
    super(props);
  }

  /* ####################################### GENERAL HELPER FUNCTIONS ############################################ */
  private getUsername = (): string => Router.getUsername(this.props.match);

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

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
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
            this.isType(EXPLORER_TYPE.ACADEMICPLANS) ?
              <React.Fragment>
                <Button as={Link} to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${this.props.type}`} style={marginTopStyle}>
                  <Icon name="chevron circle left"/><br/>Back to {this.getTypeName()}
                </Button>
                {
                  isStudent ?
                    <Menu vertical={true} text={true}>
                      <Header as="h4" dividing={true}>MY FAVORITE ACADEMIC PLANS</Header>
                      {
                        menuAddedList.map((listItem, index) => (
                          <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.ACADEMICPLANS} key={index}
                                                     match={this.props.match}/>
                        ))
                      }
                    </Menu>
                    : ''
                }
              </React.Fragment>
              : ''
          }

          {
            this.isType(EXPLORER_TYPE.COURSES) ?
              <React.Fragment>
                <Button as={Link} to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${this.props.type}`} style={marginTopStyle}>
                  <Icon name="chevron circle left"/><br/>Back to {this.getTypeName()}
                </Button>
                {
                  isStudent ?
                    <Menu vertical={true} text={true}>
                      <Header as="h4" dividing={true}>MY FAVORITE COURSES</Header>
                      {
                        menuAddedList.map((listItem, index) => (
                          <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.COURSES} key={index}
                                                     match={this.props.match}/>
                        ))
                      }
                    </Menu>
                    : ''
                }
              </React.Fragment>
              : ''
          }

          {
            this.isType(EXPLORER_TYPE.OPPORTUNITIES) ?
              <React.Fragment>
                <a href={`mailto:${adminEmail}?subject=New Opportunity Suggestion`}>Suggest a new Opportunity</a>
                <Button as={Link} to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${this.props.type}`} style={marginTopStyle}>
                  <Icon name="chevron circle left"/><br/>Back to {this.getTypeName()}
                </Button>
                {
                  isStudent ?
                    <Menu vertical={true} text={true}>
                      <Header as="h4" dividing={true}>MY FAVORITE OPPORTUNITIES</Header>
                      {
                        menuAddedList.map((listItem, index) => (
                          <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.OPPORTUNITIES} key={index}
                                                     match={this.props.match}/>
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
            this.isType(EXPLORER_TYPE.INTERESTS) ?
              <Menu vertical={true} text={true}>
                <a href={`mailto:${adminEmail}?subject=New Interest Suggestion`}>Suggest a new Interest</a>
                <Button as={Link} to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${this.props.type}`} style={marginTopStyle}>
                  <Icon name="chevron circle left"/><br/>Back to {this.getTypeName()}
                </Button>
                <Header as="h4" dividing={true}>MY FAVORITE INTERESTS</Header>
                {
                  menuAddedList.map((listItem, index) => (
                    <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.INTERESTS} key={index}
                                               match={this.props.match}/>
                  ))
                }

                <Header as="h4" dividing={true}>CAREER GOAL INTERESTS</Header>
                {
                  menuCareerList.map((listItem, index) => (
                    <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.INTERESTS} key={index}
                                               match={this.props.match}/>
                  ))
                }
              </Menu>
              : ''
          }

          {
            this.isType(EXPLORER_TYPE.CAREERGOALS) ?
              <Menu vertical={true} text={true}>
                <a href={`mailto:${adminEmail}?subject=New Career Goal Suggestion`}>Suggest a new Career Goal</a>
                <Button as={Link} to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${this.props.type}`} style={marginTopStyle}>
                  <Icon name="chevron circle left"/><br/>Back to {this.getTypeName()}
                </Button>
                <Header as="h4" dividing={true}>MY FAVORITE CAREER GOALS</Header>
                {
                  menuAddedList.map((listItem, index) => (
                    <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.CAREERGOALS} key={index}
                                               match={this.props.match}/>
                  ))
                }
              </Menu>
              : ''
          }

          {
            this.isType(EXPLORER_TYPE.DEGREES) ?
              <Button as={Link} to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${this.props.type}`} style={marginTopStyle}>
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
