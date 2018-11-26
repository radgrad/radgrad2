import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Menu, SemanticWIDTHS } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import RadGradLogoText from '../../components/shared/RadGradLogoText';
import RadGradMenuProfile from '../../components/shared/RadGradMenuProfile';

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
  };
}

class SecondMenu extends React.Component<ISecondMenuProps> {

  public render() {
    const baseUrl = this.props.match.url;
    const baseIndex = baseUrl.indexOf(this.props.currentUser);
    const baseRoute = `${baseUrl.substring(0, baseIndex)}${this.props.currentUser}/`;
    // console.log(this.props, baseRoute);
    return (
      <Menu attached="top" borderless={true} widths={this.props.numItems} className="radgrad-second-menu mobile hidden">
        {this.props.menuItems.map((item, index) => (
          <Menu.Item key={index} as={NavLink} exact={true} to={`${baseRoute}${item.route}`}>
            {item.label}
          </Menu.Item>))
        }
      </Menu>
    );
  }
}

const SecondMenuContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(SecondMenu);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(SecondMenuContainer);
