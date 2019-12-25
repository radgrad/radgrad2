import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Button, Header, Image, Menu } from 'semantic-ui-react';
import RadGradLogoText from '../shared/RadGradLogoText';
import RadGradLoginButtons from './RadGradLoginButtons';
import { ROLE } from '../../../api/role/Role';
import { Users } from '../../../api/user/UserCollection';

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
  if (Meteor.userId()) {
    const profile = Users.getProfile(Meteor.userId());
    if (profile.role === ROLE.ADMIN) {
      role = 'admin';
    }
    if (profile.role === ROLE.ADVISOR) {
      role = 'advisor';
    }
    if (profile.role === ROLE.ALUMNI) {
      role = 'alumni';
    }
    if (profile.role === ROLE.FACULTY) {
      role = 'faculty';
    }
    if (profile.role === ROLE.MENTOR) {
      role = 'mentor';
    }
    if (profile.role === ROLE.STUDENT) {
      role = 'student';
    }
  }
  return {
    currentUser: Meteor.user() ? Meteor.user().username : '',
    iconName: (role === 'admin') ? 'user plus' : 'user',
    role,
  };
})(LandingNavBar);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(LandingNavBarContainer);
