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

export interface INavBarProps {
  currentUser: string;
  iconName: string;
}

/** The NavBar appears at the top of every page. Rendered by the App Layout component. */
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
        <Menu.Item  position="right"><Button onClick={this.onClick}>GUIDED TOURS</Button></Menu.Item>
        <Menu.Item>
          {this.props.currentUser === '' ? (
            <div>
              <RadGradLoginButtons/>
            </div>
          ) : (
            <Dropdown text={this.props.currentUser} pointing="top right" icon={this.props.iconName}>
              <Dropdown.Menu>
                <Dropdown.Item icon="sign out" text="Sign Out" as={NavLink} exact={true} to="/signout"/>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Menu.Item>
      </Menu>
    );
  }
}

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
const LandingNavBarContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
  iconName: (Roles.userIsInRole(Meteor.userId(), ['ADMIN'])) ? 'user plus' : 'user',
}))(LandingNavBar);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(LandingNavBarContainer);
