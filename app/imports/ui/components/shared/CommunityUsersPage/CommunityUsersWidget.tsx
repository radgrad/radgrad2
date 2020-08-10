import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Grid, Message, SemanticWIDTHS, Tab } from 'semantic-ui-react';
import { getUsers } from '../explorer-helper-functions';
import { ROLE } from '../../../../api/role/Role';
import UserProfileCard from '../UserProfileCard';
import { IMatchProps } from '../RouterHelperFunctions';

interface ICommunityUsersWidgetProps {
  match: IMatchProps;
}

const CommunityUsersWidget = (props: ICommunityUsersWidgetProps) => {
  const { match } = props;
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

  const advisorRoleUsers = getUsers(ROLE.ADVISOR, match);
  const facultyRoleUsers = getUsers(ROLE.FACULTY, match);
  const mentorRoleUsers = getUsers(ROLE.MENTOR, match);
  const studentRoleUsers = getUsers(ROLE.STUDENT, match);
  const panes = [
    {
      menuItem: 'Advisors',
      render: () => (
        <Tab.Pane key="advisors">
          <Grid stackable>
            <Card.Group
              stackable
              itemsPerRow={advisorRoleUsers.length > 3 ? 3 : advisorRoleUsers.length as SemanticWIDTHS}
              style={userStackableCardsStyle}
            >
              {advisorRoleUsers.map((ele) => <UserProfileCard key={ele._id} item={ele} />)}
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
              itemsPerRow={facultyRoleUsers.length > 3 ? 3 : facultyRoleUsers.length as SemanticWIDTHS}
              style={userStackableCardsStyle}
            >
              {facultyRoleUsers.map((ele) => <UserProfileCard key={ele._id} item={ele} />)}
            </Card.Group>
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Mentors',
      render: () => (
        <Tab.Pane key="mentors">
          <Grid stackable>
            <Card.Group
              stackable
              itemsPerRow={mentorRoleUsers.length > 3 ? 3 : mentorRoleUsers.length as SemanticWIDTHS}
              style={userStackableCardsStyle}
            >
              {mentorRoleUsers.map((ele) => <UserProfileCard key={ele._id} item={ele} />)}
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
            <Grid.Row>
              <Grid.Column textAlign="center">
                <Message>Only showing students who have opted to share their information.</Message>
              </Grid.Column>
            </Grid.Row>
            <Card.Group
              stackable
              itemsPerRow={studentRoleUsers.length > 3 ? 3 : studentRoleUsers.length as SemanticWIDTHS}
              style={userStackableCardsStyle}
            >
              {studentRoleUsers.map((ele) => <UserProfileCard key={ele._id} item={ele} />)}
            </Card.Group>
          </Grid>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Tab panes={panes} defaultActiveIndex={3} style={tabPaneStyle} id="usersTab" />
  );
};

export default withRouter(CommunityUsersWidget);
