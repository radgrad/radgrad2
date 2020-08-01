import React from 'react';
<<<<<<< HEAD
import { withTracker } from 'meteor/react-meteor-data';
import { Menu, Header, Responsive, Button, Icon, Grid } from 'semantic-ui-react';
=======
import { Menu, Header, Responsive, Button } from 'semantic-ui-react';
>>>>>>> master
import { withRouter, Link } from 'react-router-dom';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import { IInterest } from '../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import ExplorerMenuNonMobileItem from './ExplorerMenuNonMobileItem';
import {
  explorerInterfaces,
  isType,
} from './explorer-helper-functions';
import { buildRouteName, isUrlRoleFaculty, isUrlRoleStudent } from './RouterHelperFunctions';
<<<<<<< HEAD
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import '../../../../client/style.css';
=======
>>>>>>> master

interface ICardExplorerMenuNonMobileWidgetProps {
  menuAddedList: { item: explorerInterfaces, count: number }[];
  menuCareerList: { item: IInterest, count: number }[] | undefined;
  // eslint-disable-next-line react/no-unused-prop-types
  type: 'plans' | 'career-goals' | 'courses' | 'degrees' | 'interests' | 'opportunities' | 'users';
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const CardExplorerMenuNonMobileWidget = (props: ICardExplorerMenuNonMobileWidgetProps) => {
  const { menuAddedList, menuCareerList } = props;
  const adminEmail = RadGradProperties.getAdminEmail();
  const isStudent = isUrlRoleStudent(props.match);
  const isFaculty = isUrlRoleFaculty(props.match);

  const addFacultyOpportunityButtonStyle: React.CSSProperties = { marginTop: '5px' };

  return (
    <React.Fragment>
      {/* ####### The Menu underneath the Dropdown for NON mobile  ####### */}
      {/* The following components are rendered ONLY for STUDENTS: Academic Plans, Courses, and Opportunities. However,
            FACULTY or MENTORS have a 'Suggest a Opportunity / Career Goal' mailto link. */}
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        {(isType(EXPLORER_TYPE.ACADEMICPLANS, props) && isStudent) ?
          (

            <Menu vertical text className="cardMenu">
              <Header as="h4" className="cardMenu_header">
                <Icon name="graduation cap" size="mini" />
                <Header.Content>MY ACADEMIC PLAN</Header.Content>
              </Header>
              {
                menuAddedList.map((listItem) => (
                  <ExplorerMenuNonMobileItem
                    listItem={listItem}
                    type={EXPLORER_TYPE.ACADEMICPLANS}
                    key={listItem.item._id}
                    match={props.match}
                  />
                ))
              }
            </Menu>
          )
          : ''}

        {(isType(EXPLORER_TYPE.COURSES, props) && isStudent) ?
          (
            <React.Fragment>
              <Menu vertical text className="cardMenu">
                <Header as="h4" className="cardMenu_header">
                  <Icon name="book" size="mini" />
                  <Header.Content>MY COURSES</Header.Content>
                </Header>
                {
                  menuAddedList.map((listItem) => (
                    <ExplorerMenuNonMobileItem
                      listItem={listItem}
                      type={EXPLORER_TYPE.COURSES}
                      key={listItem.item._id}
                      match={props.match}
                    />
                  ))
                }
              </Menu>
            </React.Fragment>
          )
          : ''}

        {isType(EXPLORER_TYPE.OPPORTUNITIES, props) ?
          (
            <React.Fragment>
              <a href={`mailto:${adminEmail}?subject=New Opportunity Suggestion`}>Suggest a new Opportunity</a>
              {isFaculty ?
                (
                  <Button
                    as={Link}
                    to={buildRouteName(props.match, '/manage-opportunities')}
                    size="small"
                    style={addFacultyOpportunityButtonStyle}
                  >
                    Add a Faculty Opportunity
                  </Button>
                )
                : ''}
              {isStudent ?
                (
                  <Menu vertical text className="cardMenu">
                    <Header as="h4" className="cardMenu_header">
                      <Icon name="handshake" size="mini" />
                      <Header.Content>MY OPPORTUNITIES</Header.Content>
                    </Header>
                    {
                      menuAddedList.map((listItem) => (
                        <ExplorerMenuNonMobileItem
                          listItem={listItem}
                          type={EXPLORER_TYPE.OPPORTUNITIES}
                          key={listItem.item._id}
                          match={props.match}
                        />
                      ))
                    }
                  </Menu>
                )
                : ''}
            </React.Fragment>
          )
          : ''}

        {/* Components renderable to STUDENTS, FACULTY, and MENTORS. But if we are FACULTY or MENTORS, make sure we
                don't map over menuAddedList or else we get undefined error. */}
        {isType(EXPLORER_TYPE.INTERESTS, props) ?
          (
            <Menu vertical text className="cardMenu">
              <Button icon positive className="cardMenu_btn" href={`mailto:${adminEmail}?subject=New Interest Suggestion`}>
                <Icon name="edit" />
                &nbsp;&nbsp;Suggest a NEW Interest</Button>
              <Header as="h4" className="cardMenu_header">
                <Icon name="favorite" size="mini" />
                <Header.Content>MY INTERESTS</Header.Content>
              </Header>
              {
                menuAddedList.map((listItem) => (
                  <ExplorerMenuNonMobileItem
                    listItem={listItem}
                    type={EXPLORER_TYPE.INTERESTS}
                    key={listItem.item._id}
                    match={props.match}
                  />
                ))
              }

              <Header as="h4" dividing>SUGGESTED CAREER GOAL INTERESTS</Header>
              {
                menuCareerList.map((listItem) => (
                  <ExplorerMenuNonMobileItem
                    listItem={listItem}
                    type={EXPLORER_TYPE.INTERESTS}
                    key={listItem.item._id}
                    match={props.match}
                  />
                ))
              }
            </Menu>
          )
          : ''}

        {isType(EXPLORER_TYPE.CAREERGOALS, props) ?
          (
            <Menu vertical text className="cardMenu">
              <Button icon positive className="cardMenu_btn" href={`mailto:${adminEmail}?subject=New Career Goal Suggestion`}>
                <Icon name="edit" />
                &nbsp;&nbsp;Suggest a NEW Career Goal</Button>
              <Header as="h4" className="cardMenu_header">
                <Icon name="briefcase" size="mini" />
                <Header.Content>MY CAREER GOALS</Header.Content>
              </Header>
              {menuAddedList.map((listItem) => (
                <ExplorerMenuNonMobileItem
                  listItem={listItem}
                  type={EXPLORER_TYPE.CAREERGOALS}
                  key={listItem.item._id}
                  match={props.match}
                />
              ))}
            </Menu>
          )
          : ''}
      </Responsive>
    </React.Fragment>
  );
};

export const CardExplorerMenuNonMobileWidgetContainer = withRouter(CardExplorerMenuNonMobileWidget);

export default CardExplorerMenuNonMobileWidgetContainer;
