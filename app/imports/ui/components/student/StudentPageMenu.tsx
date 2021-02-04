import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { Grid, Menu } from 'semantic-ui-react';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { StudentProfile } from '../../../typings/radgrad';
import FirstMenu from '../shared/FirstMenu';
import { getUsername } from '../shared/utilities/router';

const StudentPageMenu: React.FC = () => {
  const match = useRouteMatch();
  const username = getUsername(match);
  const profile: StudentProfile = StudentProfiles.getProfile(username);
  const earnedIce = StudentProfiles.getEarnedICE(username);
  const projectedIce = StudentProfiles.getProjectedICE(username);
  const divStyle = { marginBottom: 30 };
  return (
    <div style={divStyle}>
      <FirstMenu profile={profile} displayLevelAndIce earnedICE={earnedIce} projectedICE={projectedIce} />
      <div className="radgrad-menu" id="menu">
        <Menu attached="top" borderless inverted stackable secondary pointing id="secondMenu">
          <Grid stackable doubling columns={12} container>
            <Grid.Column>
              <Menu.Item as={NavLink} exact to={`/student/${username}/checklists`}>
                Checklists
              </Menu.Item>
            </Grid.Column>
            <Grid.Column>
              <Menu.Item as={NavLink} exact to={`/student/${username}/explorer/interests`}>
                Interests
              </Menu.Item>
            </Grid.Column>
            <Grid.Column>
              <Menu.Item as={NavLink} exact to={`/student/${username}/explorer/career-goals`}>
                Careers
              </Menu.Item>
            </Grid.Column>
            <Grid.Column>
              <Menu.Item as={NavLink} exact to={`/student/${username}/explorer/courses`}>
                Courses
              </Menu.Item>
            </Grid.Column>
            <Grid.Column>
              <Menu.Item as={NavLink} exact to={`/student/${username}/explorer/opportunities`}>
                Opportunities
              </Menu.Item>
            </Grid.Column>
            <Grid.Column>
              <Menu.Item as={NavLink} exact to={`/student/${username}/degree-planner`}>
                Planner
              </Menu.Item>
            </Grid.Column>
            <Grid.Column>
              <Menu.Item as={NavLink} exact to={`/student/${username}/verifications`}>
                Verification
              </Menu.Item>
            </Grid.Column>
            <Grid.Column>
              <Menu.Item as={NavLink} exact to={`/student/${username}/privacy`}>
                Privacy
              </Menu.Item>
            </Grid.Column>
            <Grid.Column>
              <Menu.Item as={NavLink} exact to={`/student/${username}/home/ice`}>
                ICE
              </Menu.Item>
            </Grid.Column>
            <Grid.Column>
              <Menu.Item as={NavLink} exact to={`/student/${username}/home/levels`}>
                Levels
              </Menu.Item>
            </Grid.Column>
            <Grid.Column>
              <Menu.Item as={NavLink} exact to={`/student/${username}/reviews`}>
                Reviews
              </Menu.Item>
            </Grid.Column>
            <Grid.Column>
              <Menu.Item as={NavLink} exact to={`/student/${username}/news`}>
                News
              </Menu.Item>
            </Grid.Column>
          </Grid>
        </Menu>
      </div>
    </div>
  );
};

export default StudentPageMenu;
