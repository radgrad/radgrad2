import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Menu, SemanticWIDTHS } from 'semantic-ui-react'; // eslint-disable-line
import { NavLink, withRouter } from 'react-router-dom';
import { secondMenu } from '../../components/shared/shared-widget-names';

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
    <Menu attached={'top'} borderless={true} widths={props.numItems} secondary={true} pointing={true}
          className="radgrad-second-menu mobile hidden" id={`${secondMenu}`}>
      {props.menuItems.map((item, index) => (
        <Menu.Item key={index} as={NavLink} exact={false} to={`${baseRoute}${item.route}`}>
          {item.label}
        </Menu.Item>))
      }
    </Menu>
  );
};

const SecondMenuContainer = withTracker(() => ({
  currentUser: Meteor.user() ? Meteor.user().username : '',
}))(SecondMenu);

/** Enable ReactRouter for this component. https://reacttraining.com/react-router/web/api/withRouter */
export default withRouter(SecondMenuContainer);
