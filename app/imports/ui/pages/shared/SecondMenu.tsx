import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Menu, SemanticWIDTHS, Dropdown, Container } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import { secondMenu } from '../../components/shared/shared-widget-names';
import styles from '../../../../client/style';
import { getUsername } from '../../components/shared/RouterHelperFunctions';

interface IMenuItem {
  label: string;
  regex: string;
  route: string;
}

interface ISecondMenuProps {
  menuItems: IMenuItem[];
  numItems: SemanticWIDTHS;
  currentUser: string;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const SecondMenu = (props: ISecondMenuProps) => {
  const username = props.match.params.username;
  const baseUrl = props.match.url;
  const baseIndex = baseUrl.indexOf(username);
  const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}/`;
  // console.log(props, baseRoute);
  return (
    <div style={styles['radgrad-student-menu']}>
      <Container>
        <Menu
          attached="top"
          borderless
          widths={props.numItems}
          secondary
          pointing
          id={`${secondMenu}`}
          style={styles['radgrad-student-menu']}
        >
          <Menu.Item>
            Home
          </Menu.Item>
          <Dropdown item text="EXPLORE">
            <Dropdown.Menu>
              <Dropdown.Item>ACADEMIC PLANS</Dropdown.Item>
              <Dropdown.Item>CAREER GOALS</Dropdown.Item>
              <Dropdown.Item>COURSES</Dropdown.Item>
              <Dropdown.Item>INTERESTS</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item>
            OPPORTUNITIES
          </Menu.Item>
          <Menu.Item>
            DEGREE PLANNER
          </Menu.Item>
          <Dropdown item text="COMMUNITY">
            <Dropdown.Menu>
              <Dropdown.Item>Mentors</Dropdown.Item>
              <Dropdown.Item>Automotive</Dropdown.Item>
              <Dropdown.Item>Home</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Menu position="right">
            <Dropdown item text={props.currentUser} userName={username}>
              <Dropdown.Menu>
                <Dropdown.Item>About Me</Dropdown.Item>
                <Dropdown.Item>ICE Points</Dropdown.Item>
                <Dropdown.Item>Level</Dropdown.Item>
                <Dropdown.Item>Advisor Log</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
      </Container>
    </div>
  );
};

const SecondMenuContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(SecondMenu);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(SecondMenuContainer);
