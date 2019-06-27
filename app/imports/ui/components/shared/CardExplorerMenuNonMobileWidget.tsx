import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Menu, Header, Responsive } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
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
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import ExplorerMenuNonMobileItem from './ExplorerMenuNonMobileItem';

type explorerInterfaces = IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity;

interface ICardExplorerMenuNonMobileWidgetProps {
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
class CardExplorerMenuNonMobileWidget extends React.Component<ICardExplorerMenuNonMobileWidgetProps> {
  constructor(props) {
    super(props);
  }

  /* ####################################### GENERAL HELPER FUNCTIONS ############################################ */

  private isRoleStudent = (): boolean => Router.isUrlRoleStudent(this.props.match);

  private isType = (typeToCheck: string): boolean => {
    const { type } = this.props;
    return type === typeToCheck;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { menuAddedList, menuCareerList } = this.props;
    const isStudent = this.isRoleStudent();
    const adminEmail = 'radgrad@hawaii.edu';
    return (
      <React.Fragment>
        {/* ####### The Menu underneath the Dropdown for NON mobile  ####### */}
        {/* The following components are rendered ONLY for STUDENTS: Academic Plans, Courses, and Opportunities. However,
            FACULTY or MENTORS have a 'Suggest a Opportunity / Career Goal' mailto link. */}
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          {
            this.isType(EXPLORER_TYPE.ACADEMICPLANS) ?
              <React.Fragment>
                {
                  isStudent ?
                    <Menu vertical={true} text={true}>
                      <Header as="h4" dividing={true}>MY ACADEMIC PLAN</Header>
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
                {
                  isStudent ?
                    <Menu vertical={true} text={true}>
                      <Header as="h4" dividing={true}>COURSES IN MY PLAN</Header>
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
                {
                  isStudent ?
                    <Menu vertical={true} text={true}>
                      <Header as="h4" dividing={true}>OPPORTUNITIES IN MY PLAN</Header>
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
                <Header as="h4" dividing={true}>MY INTERESTS</Header>
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
                <Header as="h4" dividing={true}>MY CAREER GOALS</Header>
                {
                  menuAddedList.map((listItem, index) => (
                    <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.CAREERGOALS} key={index}
                                               match={this.props.match}/>
                  ))
                }
              </Menu>
              : ''
          }
        </Responsive>
      </React.Fragment>
    );
  }
}

export const CardExplorerMenuNonMobileWidgetCon = withTracker((props) => {
  const username = Router.getUsername(props.match);
  const profile = Users.getProfile(username);
  return {
    profile,
  };
})(CardExplorerMenuNonMobileWidget);
export const CardExplorerMenuNonMobileWidgetContainer = withRouter(CardExplorerMenuNonMobileWidgetCon);
export default CardExplorerMenuNonMobileWidgetContainer;
