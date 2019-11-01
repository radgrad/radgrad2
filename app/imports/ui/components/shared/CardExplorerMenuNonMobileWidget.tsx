import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Menu, Header, Responsive } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { _ } from 'meteor/erasaur:meteor-lodash';
import * as Router from './RouterHelperFunctions';
import {
  IAcademicPlan, // eslint-disable-line no-unused-vars
  ICareerGoal, // eslint-disable-line no-unused-vars
  ICourse, // eslint-disable-line no-unused-vars
  IDesiredDegree, // eslint-disable-line no-unused-vars
  IInterest, // eslint-disable-line no-unused-vars
  IOpportunity, // eslint-disable-line no-unused-vars
} from '../../../typings/radgrad';
import { Users } from '../../../api/user/UserCollection';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import ExplorerMenuNonMobileItem from './ExplorerMenuNonMobileItem';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import {
  ICardExplorerMenuWidgetProps, // eslint-disable-line no-unused-vars
  isType,
} from './explorer-helper-functions';


// FIXME: Needs to be reactive
const CardExplorerMenuNonMobileWidget = (props: ICardExplorerMenuWidgetProps) => {
  const { menuAddedList, menuCareerList } = props;
  const isStudent = Router.isUrlRoleStudent(props.match);
  const adminEmail = 'radgrad@hawaii.edu';
  return (
    <React.Fragment>
      {/* ####### The Menu underneath the Dropdown for NON mobile  ####### */}
      {/* The following components are rendered ONLY for STUDENTS: Academic Plans, Courses, and Opportunities. However,
            FACULTY or MENTORS have a 'Suggest a Opportunity / Career Goal' mailto link. */}
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        {
          isType(EXPLORER_TYPE.ACADEMICPLANS, props) ?
            <React.Fragment>
              {
                isStudent ?
                  <Menu vertical={true} text={true}>
                    <Header as="h4" dividing={true}>MY FAVORITE ACADEMIC PLAN</Header>
                    {
                      menuAddedList.map((listItem, index) => (
                        <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.ACADEMICPLANS} key={index}
                                                   match={props.match}/>
                      ))
                    }
                  </Menu>
                  : ''
              }
            </React.Fragment>
            : ''
        }

        {
          isType(EXPLORER_TYPE.COURSES, props) ?
            <React.Fragment>
              {
                isStudent ?
                  <Menu vertical={true} text={true}>
                    <Header as="h4" dividing={true}>MY FAVORITE COURSES</Header>
                    {
                      menuAddedList.map((listItem, index) => (
                        <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.COURSES} key={index}
                                                   match={props.match}/>
                      ))
                    }
                  </Menu>
                  : ''
              }
            </React.Fragment>
            : ''
        }

          {
            isType(EXPLORER_TYPE.OPPORTUNITIES, props) ?
              <React.Fragment>
                <a href={`mailto:${adminEmail}?subject=New Opportunity Suggestion`}>Suggest a new Opportunity</a>
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
            isType(EXPLORER_TYPE.INTERESTS, props) ?
              <Menu vertical={true} text={true}>
                <a href={`mailto:${adminEmail}?subject=New Interest Suggestion`}>Suggest a new Interest</a>
                <Header as="h4" dividing={true}>MY FAVORITE INTERESTS</Header>
                {
                  menuAddedList.map((listItem, index) => (
                    <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.INTERESTS} key={index}
                                               match={props.match}/>
                  ))
                }

              <Header as="h4" dividing={true}>CAREER GOAL INTERESTS</Header>
              {
                menuCareerList.map((listItem, index) => (
                  <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.INTERESTS} key={index}
                                             match={props.match}/>
                ))
              }
            </Menu>
            : ''
        }

        {
          isType(EXPLORER_TYPE.CAREERGOALS, props) ?
            <Menu vertical={true} text={true}>
              <a href={`mailto:${adminEmail}?subject=New Career Goal Suggestion`}>Suggest a new Career Goal</a>
              <Header as="h4" dividing={true}>MY FAVORITE CAREER GOALS</Header>
              {
                menuAddedList.map((listItem, index) => (
                  <ExplorerMenuNonMobileItem listItem={listItem} type={EXPLORER_TYPE.CAREERGOALS} key={index}
                                             match={props.match}/>
                ))
              }
            </Menu>
            : ''
        }
      </Responsive>
    </React.Fragment>
  );
};

export const CardExplorerMenuNonMobileWidgetCon = withTracker((props) => {
  const username = Router.getUsername(props.match);
  const profile = Users.getProfile(username);
  const menuList = _.map(profile.careerGoalIDs, (c) => CareerGoals.findDoc(c).name);
  return {
    profile,
    menuList,
  };
})(CardExplorerMenuNonMobileWidget);
export const CardExplorerMenuNonMobileWidgetContainer = withRouter(CardExplorerMenuNonMobileWidgetCon);
export default CardExplorerMenuNonMobileWidgetContainer;
