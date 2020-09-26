import React from 'react';
import { Menu, Header, Responsive, Button, Icon } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import {
  IAcademicPlan,
  ICareerGoal,
  ICourse,
  IDesiredDegree,
  IInterest,
  IOpportunity,
} from '../../../typings/radgrad';
import * as Router from './RouterHelperFunctions';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import ExplorerMenuNonMobileItem from './ExplorerMenuNonMobileItem';
import { buildRouteName, isUrlRoleFaculty } from './RouterHelperFunctions';

type explorerInterfaces = IAcademicPlan | ICareerGoal | ICourse | IDesiredDegree | IInterest | IOpportunity;

interface IExplorerMenuNonMobileWidgetProps {
  menuAddedList: { item: explorerInterfaces, count: number }[];
  menuCareerList: { item: IInterest, count: number }[] | undefined;
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

const getTypeName = (props: IExplorerMenuNonMobileWidgetProps): string => {
  const { type } = props;
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
    default:
      return '';
  }
};

const isType = (typeToCheck: string, props: IExplorerMenuNonMobileWidgetProps): boolean => props.type === typeToCheck;

const ExplorerMenuNonMobileWidget = (props: IExplorerMenuNonMobileWidgetProps) => {
  // console.log('ExplorerMenuNonMobileWidget', props);
  const marginTopStyle = { marginTop: '5px' };

  const baseUrl = props.match.url;
  const username = Router.getUsername(props.match);
  const baseIndex = baseUrl.indexOf(username);
  const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}`;

  const { menuAddedList, menuCareerList } = props;
  const isStudent = Router.isUrlRoleStudent(props.match);
  const adminEmail = RadGradProperties.getAdminEmail();
  const isFaculty = isUrlRoleFaculty(props.match);

  const addFacultyOpportunityButtonStyle: React.CSSProperties = { marginTop: '5px' };

  return (
    <React.Fragment>
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        {isType(EXPLORER_TYPE.ACADEMICPLANS, props) ?
          (
            <React.Fragment>
              <Button as={Link} to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${props.type}`} style={marginTopStyle}>
                <Icon name="chevron circle left" />
                <br />
                Back to {getTypeName(props)}
              </Button>
              {isStudent ?
                (
                  <Menu vertical text>
                    <Header as="h4" dividing>MY FAVORITE ACADEMIC PLANS</Header>
                    {menuAddedList.map((listItem) => (
                      <ExplorerMenuNonMobileItem
                        listItem={listItem}
                        type={EXPLORER_TYPE.ACADEMICPLANS}
                        key={listItem.item._id}
                        match={props.match}
                      />
                    ))}
                  </Menu>
                )
                : ''}
            </React.Fragment>
          )
          : ''}

        {isType(EXPLORER_TYPE.COURSES, props) ?
          (
            <React.Fragment>
              <Button as={Link} to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${props.type}`} style={marginTopStyle}>
                <Icon name="chevron circle left" />
                <br />
                Back to {getTypeName(props)}
              </Button>
              {isStudent ?
                (
                  <Menu vertical text>
                    <Header as="h4" dividing>MY FAVORITE COURSES</Header>
                    {menuAddedList.map((listItem) => (
                      <ExplorerMenuNonMobileItem
                        listItem={listItem}
                        type={EXPLORER_TYPE.COURSES}
                        key={listItem.item._id}
                        match={props.match}
                      />
                    ))}
                  </Menu>
                )
                : ''}
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
              <Button as={Link} to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${props.type}`} style={marginTopStyle}>
                <Icon name="chevron circle left" />
                <br />
                Back to {getTypeName(props)}
              </Button>
              {isStudent ?
                (
                  <Menu vertical text>
                    <Header as="h4" dividing>MY FAVORITE OPPORTUNITIES</Header>
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

        {/* Components renderable to STUDENTS and FACULTY. But if we are FACULTY, make sure we
                don't map over menuAddedList or else we get undefined error. */}
        {isType(EXPLORER_TYPE.INTERESTS, props) ?
          (
            <Menu vertical text>
              <a href={`mailto:${adminEmail}?subject=New Interest Suggestion`}>Suggest a new Interest</a>
              <Button as={Link} to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${props.type}`} style={marginTopStyle}>
                <Icon name="chevron circle left" />
                <br />
                Back to {getTypeName(props)}
              </Button>
              <Header as="h4" dividing>MY FAVORITE INTERESTS</Header>
              {menuAddedList.map((listItem) => (
                <ExplorerMenuNonMobileItem
                  listItem={listItem}
                  type={EXPLORER_TYPE.INTERESTS}
                  key={listItem.item._id}
                  match={props.match}
                />
              ))}

              <Header as="h4" dividing>SUGGESTED CAREER GOAL INTERESTS</Header>
              {menuCareerList.map((listItem) => (
                <ExplorerMenuNonMobileItem
                  listItem={listItem}
                  type={EXPLORER_TYPE.INTERESTS}
                  key={listItem.item._id}
                  match={props.match}
                />
              ))}
            </Menu>
          )
          : ''}

        {isType(EXPLORER_TYPE.CAREERGOALS, props) ?
          (
            <Menu vertical text>
              <a href={`mailto:${adminEmail}?subject=New Career Goal Suggestion`}>Suggest a new Career Goal</a>
              <Button as={Link} to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${props.type}`} style={marginTopStyle}>
                <Icon name="chevron circle left" />
                <br />
                Back to {getTypeName(props)}
              </Button>
              <Header as="h4" dividing>MY FAVORITE CAREER GOALS</Header>
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

        {isType(EXPLORER_TYPE.DEGREES, props) ?
          (
            <Button as={Link} to={`${baseRoute}/${EXPLORER_TYPE.HOME}/${props.type}`} style={marginTopStyle}>
              <Icon name="chevron circle left" />
              <br />
              Back to {getTypeName(props)}
            </Button>
          )
          : ''}
      </Responsive>
    </React.Fragment>
  );
};

export const ExplorerMenuNonMobileWidgetContainer = withRouter(ExplorerMenuNonMobileWidget);

export default ExplorerMenuNonMobileWidgetContainer;
