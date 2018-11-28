import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import * as React from 'react';
import { Roles } from 'meteor/alanning:roles';
import { NavLink, withRouter } from 'react-router-dom';
import { Button, Dropdown, Header, Image, Menu } from 'semantic-ui-react';
import RadGradLogoText from '../shared/RadGradLogoText';
import RadGradLoginButtons from './RadGradLoginButtons';
import LandingSection9 from './LandingSection9';
import RadGradMenuProfile from '../shared/RadGradMenuProfile';
import { ROLE } from '../../../api/role/Role';

export interface INavBarProps {
  currentUser: string;
  iconName: string;
  role: string;
}

/**
 * LandingNavBar rendered on each of the landing pages.
 */
class LandingNavBar extends React.Component<INavBarProps, object> {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  public onClick() {
    const el = document.getElementById('landing-section-9');
    window.scrollTo(0, el.offsetTop);
  }

  public render() {
    const imageStyle = { width: 45 };
    // console.log(this.props);
    const url = `/#/${this.props.role}/${this.props.currentUser}/home`;
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
        <Menu.Item position="right"><Button onClick={this.onClick}>GUIDED TOURS</Button></Menu.Item>
        <Menu.Item>
          {this.props.currentUser ? (
            <div>
              <Button basic={true} color="green" compact={true}><a href={url}>Home</a></Button>
            </div>
          ) : (
            <RadGradLoginButtons/>
          )}
        </Menu.Item>
      </Menu>
    );
  }
}

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const LandingNavBarContainer = withTracker(() => {
  const userID = Meteor.userId();
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
