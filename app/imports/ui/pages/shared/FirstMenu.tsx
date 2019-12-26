import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Dropdown, Header, Image, Menu } from 'semantic-ui-react';
import RadGradLogoText from '../../components/shared/RadGradLogoText';
import RadGradMenuProfile from '../../components/shared/RadGradMenuProfile';
import { getUsername } from '../../components/shared/RouterHelperFunctions';
import { firstMenu } from '../../components/shared/shared-widget-names';
import { IRadGradMatch } from '../../../typings/radgrad';

interface IFirstMenuProps {
  currentUser: string;
  iconName: string;
  match: IRadGradMatch;
}

const FirstMenu = (props: IFirstMenuProps) => {
  const username = getUsername(props.match);
  const imageStyle = { width: '50px' };
  const signoutStyle = { marginTop: '32px' };
  const flexStyle = { display: 'flex' };
  const noPadding = { paddingTop: 0, paddingBottom: 0 };
  return (
    <Menu attached="top" borderless className="radgrad-first-menu" id={`${firstMenu}`}>
      <Menu.Item as={NavLink} activeClassName="" exact to="/" style={noPadding}>
        <Image style={imageStyle} circular src="/images/radgrad_logo.png" />
        <div className="mobile hidden item">
          <Header as="h1">
            <RadGradLogoText />
          </Header>
        </div>
      </Menu.Item>

      <Menu.Item position="right" className="right menu" style={noPadding}>
        {props.currentUser === '' ? (
          <div>
            <Dropdown text="Login" pointing="top right" icon="user">
              <Dropdown.Menu>
                <Dropdown.Item icon="user" text="Sign In" as={NavLink} exact to="/signin" />
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ) : (
          <div style={flexStyle}>
            <RadGradMenuProfile userName={username} />
            <Dropdown
              text={props.currentUser}
              pointing="top right"
              icon={props.iconName}
              style={signoutStyle}
            >
              <Dropdown.Menu>
                <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact to="/signout" />
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
      </Menu.Item>
    </Menu>
  );
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const FirstMenuContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
  iconName: (Roles.userIsInRole(Meteor.userId(), ['ADMIN'])) ? 'user plus' : 'user',
}))(FirstMenu);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(FirstMenuContainer);
