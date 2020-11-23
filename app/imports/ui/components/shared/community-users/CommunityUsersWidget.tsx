import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Grid, Message, SemanticWIDTHS, Tab } from 'semantic-ui-react';
import { IAdvisorOrFacultyProfile, IStudentProfile } from '../../../../typings/radgrad';
import { URL_ROLES } from '../../../layouts/utilities/route-constants';
import UserProfileCard from './UserProfileCard';

interface ICommunityUsersWidgetProps {
  loggedInRole: string;
  advisors: IAdvisorOrFacultyProfile[];
  faculty: IAdvisorOrFacultyProfile[];
  students: IStudentProfile[];
}

const CommunityUsersWidget = (props: ICommunityUsersWidgetProps) => {
  const { advisors, faculty, loggedInRole, students } = props;
  const tabPaneStyle: React.CSSProperties = {
    overflowX: 'hidden',
    overflowY: 'hidden',
  };
  const userStackableCardsStyle: React.CSSProperties = {
    maxHeight: '750px',
    overflowY: 'auto',
    marginTop: '10px',
    paddingBottom: '10px',
  };
  const loggedInAsStudent = loggedInRole === URL_ROLES.STUDENT;
  const panes = [
    {
      menuItem: 'Advisors',
      render: () => (
        <Tab.Pane key="advisors">
          <Grid stackable>
            <Card.Group
              stackable
              itemsPerRow={advisors.length > 3 ? 3 : advisors.length as SemanticWIDTHS}
              style={userStackableCardsStyle}
            >
              {advisors.map((ele) => <UserProfileCard key={ele._id} item={ele} />)}
            </Card.Group>
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Faculty',
      render: () => (
        <Tab.Pane key="faculty">
          <Grid stackable>
            <Card.Group
              stackable
              itemsPerRow={faculty.length > 3 ? 3 : faculty.length as SemanticWIDTHS}
              style={userStackableCardsStyle}
            >
              {faculty.map((ele) => <UserProfileCard key={ele._id} item={ele} />)}
            </Card.Group>
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Students',
      render: () => (
        <Tab.Pane key="students">
          <Grid stackable>
            {loggedInAsStudent ? (
              <Grid.Row>
                <Grid.Column textAlign="center">
                  <Message>Only showing students who have opted to share their information.</Message>
                </Grid.Column>
              </Grid.Row>
            ) : ''}
            <Card.Group
              stackable
              itemsPerRow={students.length > 3 ? 3 : students.length as SemanticWIDTHS}
              style={userStackableCardsStyle}
            >
              {students.map((ele) => <UserProfileCard key={ele._id} item={ele} />)}
            </Card.Group>
          </Grid>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Tab panes={panes} defaultActiveIndex={2} style={tabPaneStyle} id="usersTab" />
  );
};

export default withRouter(CommunityUsersWidget);
