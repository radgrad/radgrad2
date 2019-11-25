import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Dropdown, Responsive } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
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
import ExplorerMenuMobileItem from './ExplorerMenuMobileItem';
import {
  ICardExplorerMenuWidgetProps, // eslint-disable-line no-unused-vars
  isType,
} from './explorer-helper-functions';


// FIXME: Needs to be reactive
const CardExplorerMenuMobileWidget = (props: ICardExplorerMenuWidgetProps) => {
  const { menuAddedList, menuCareerList } = props;
  const isStudent = Router.isUrlRoleStudent(props.match);
  return (
    <React.Fragment>
      {/* ####### The Menu underneath the Dropdown for MOBILE ONLY ####### */}
      {/* The following components are rendered ONLY for STUDENTS: Academic Plans, Courses, and Opportunities. */}
      <Responsive {...Responsive.onlyMobile}>
        {
          isType(EXPLORER_TYPE.ACADEMICPLANS, props) ?
            <React.Fragment>
              {
                isStudent ?
                  <Dropdown className="selection" fluid={true} text="Select Item" style={{ marginTop: '1rem' }}>
                    <Dropdown.Menu>
                      <Dropdown.Header as="h4">MY ACADEMIC PLAN</Dropdown.Header>
                      <Dropdown.Divider/>
                      {
                        menuAddedList.map((listItem, index) => (
                          <ExplorerMenuMobileItem type={EXPLORER_TYPE.ACADEMICPLANS} listItem={listItem} key={index}
                                                  match={props.match}/>
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
          isType(EXPLORER_TYPE.COURSES, props) ?
            <React.Fragment>
              {
                isStudent ?
                  <Dropdown className="selection" fluid={true} text="Select Item" style={{ marginTop: '1rem' }}>
                    <Dropdown.Menu>
                      <Dropdown.Header as="h4">FAVORITE COURSES</Dropdown.Header>
                      <Dropdown.Divider/>
                      {
                        menuAddedList.map((listItem, index) => (
                          <ExplorerMenuMobileItem type={EXPLORER_TYPE.COURSES} listItem={listItem} key={index}
                                                  match={props.match}/>
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
          isType(EXPLORER_TYPE.OPPORTUNITIES, props) ?
            <React.Fragment>
              {
                isStudent ?
                  <Dropdown className="selection" fluid={true} text="Select Item" style={{ marginTop: '1rem' }}>
                    <Dropdown.Menu>
                      <Dropdown.Header as="h4">FAVORITE OPPORTUNITIES</Dropdown.Header>
                      <Dropdown.Divider/>
                      {
                        menuAddedList.map((listItem, index) => (
                          <ExplorerMenuMobileItem type={EXPLORER_TYPE.OPPORTUNITIES} listItem={listItem} key={index}
                                                  match={props.match}/>
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
          isType(EXPLORER_TYPE.INTERESTS, props) ?
            <Dropdown className="selection" fluid={true} text="Select Item" style={{ marginTop: '1rem' }}>
              <Dropdown.Menu>
                <Dropdown.Header as="h4">MY FAVORITE INTERESTS</Dropdown.Header>
                <Dropdown.Divider/>
                {
                  menuAddedList.map((listItem, index) => (
                    <ExplorerMenuMobileItem type={EXPLORER_TYPE.INTERESTS} listItem={listItem} key={index}
                                            match={props.match}/>
                  ))
                }

                <Dropdown.Header as="h4">CAREER GOAL INTERESTS</Dropdown.Header>
                <Dropdown.Divider/>
                {
                  menuCareerList.map((listItem, index) => (
                    <ExplorerMenuMobileItem type={EXPLORER_TYPE.INTERESTS} listItem={listItem} key={index}
                                            match={props.match}/>
                  ))
                }
              </Dropdown.Menu>
            </Dropdown>
            : ''
        }

        {
          isType(EXPLORER_TYPE.CAREERGOALS, props) ?
            <Dropdown className="selection" fluid={true} text="Select Item" style={{ marginTop: '1rem' }}>
              <Dropdown.Menu>
                <Dropdown.Header as="h4">MY CAREER GOALS</Dropdown.Header>
                <Dropdown.Divider/>
                {
                  menuAddedList.map((listItem, index) => (
                    <ExplorerMenuMobileItem type={EXPLORER_TYPE.CAREERGOALS} listItem={listItem} key={index}
                                            match={props.match}/>
                  ))
                }
              </Dropdown.Menu>
            </Dropdown>
            : ''
        }
      </Responsive>
    </React.Fragment>
  );
};

export const CardExplorerMenuMobileWidgetCon = withTracker((props) => {
  const username = Router.getUsername(props.match);
  const profile = Users.getProfile(username);
  return {
    profile,
  };
})(CardExplorerMenuMobileWidget);
export const CardExplorerMenuMobileWidgetContainer = withRouter(CardExplorerMenuMobileWidgetCon);
export default CardExplorerMenuMobileWidgetContainer;
