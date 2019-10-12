import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import * as React from 'react';
import { Roles } from 'meteor/alanning:roles';
import { NavLink, withRouter } from 'react-router-dom';
import { Button, Header, Image, Menu } from 'semantic-ui-react';
import RadGradLogoText from '../shared/RadGradLogoText';
import RadGradLoginButtons from './RadGradLoginButtons';
import { ROLE } from '../../../api/role/Role';

export interface INavBarProps {
  currentUser: string;
  iconName: string;
  role: string;
}

const onClick = () => {
  const el = document.getElementById('landing-section-9'); // eslint-disable-line
  window.scrollTo(0, el.offsetTop); // eslint-disable-line
};

/**
 * LandingNavBar rendered on each of the landing pages.
 */
const LandingNavBar = (props: INavBarProps) => {
  const imageStyle = { width: 45 };
  // console.log(props);
  const url = `/#/${props.role}/${props.currentUser}/home`;
  return (
    <Menu attached="top" borderless={true} size="small">
      <Menu.Item as={NavLink} activeClassName="" exact={true} to="/">
        <Image style={imageStyle} circular={true} src="/images/radgrad_logo.png"/>
        <div className="mobile hidden item">
          <Header as="h2">
            <RadGradLogoText/>
          </Header>
        </div>
      </Menu.Item>
      <Menu.Item position="right"><Button onClick={onClick}>GUIDED TOURS</Button></Menu.Item>
      <Menu.Item>
        {props.currentUser ? (
          <div>
            <Button basic={true} color="green" compact={true}><a href={url}>Home</a></Button>
          </div>
        ) : (
          <RadGradLoginButtons/>
        )}
      </Menu.Item>
    </Menu>
  );
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const LandingNavBarContainer = withTracker(() => {
  let role;
  if (Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN])) {
    role = 'admin';
  }
  if (Roles.userIsInRole(Meteor.userId(), [ROLE.ADVISOR])) {
    role = 'advisor';
  }
  if (Roles.userIsInRole(Meteor.userId(), [ROLE.ALUMNI])) {
    role = 'alumni';
  }
  if (Roles.userIsInRole(Meteor.userId(), [ROLE.FACULTY])) {
    role = 'faculty';
  }
  if (Roles.userIsInRole(Meteor.userId(), [ROLE.MENTOR])) {
    role = 'mentor';
  }
  if (Roles.userIsInRole(Meteor.userId(), [ROLE.STUDENT])) {
    role = 'student';
  }
  return {
    currentUser: Meteor.user() ? Meteor.user().username : '',
    iconName: (Roles.userIsInRole(Meteor.userId(), ['ADMIN'])) ? 'user plus' : 'user',
    role,
  };
})(LandingNavBar);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(LandingNavBarContainer);
