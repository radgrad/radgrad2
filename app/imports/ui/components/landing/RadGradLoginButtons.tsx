import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { NavLink, withRouter } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { Users } from '../../../api/user/UserCollection';

class RadGradLoginButtons extends React.Component {
  constructor(props) {
    super(props);
  }

  private static handleClick(e, instance) {
    console.log(e, instance, Random.id());
    e.preventDefault();
    const callback = function loginCallback(error) {
      if (error) {
        console.log('Error during CAS Login: ', error);
        instance.$('div .ui.error.message.hidden').text('You are not yet registered. Go see your Advisor.');
        instance.$('div .ui.error.message.hidden').removeClass('hidden');
      } else {
        const username = Meteor.user().username;
        const id = Meteor.userId();
        let role = Roles.getRolesForUser(id)[0];
        const studentp = role.toLowerCase() === 'student';
        if (studentp) {
          const profile = Users.findProfileFromUsername(username);
          if (profile.isAlumni) {
            role = 'Alumni';
          }
        }
      }
    };
    Meteor.loginWithCas(callback);

  }

  public render() {
    const adminLabel = '... as admin';
    const mentorLabel = '... as mentor';
    return (
      <Dropdown text="LOGIN" pointing={'top right'}>
        <Dropdown.Menu>
          <Dropdown.Item id={'student'} onClick={RadGradLoginButtons.handleClick}>... as student</Dropdown.Item>
          <Dropdown.Item id={'faculty'} text={'... as faculty'} onClick={RadGradLoginButtons.handleClick}/>
          <Dropdown.Item id={'mentor'} as={NavLink} to="/signin" text={mentorLabel}/>
          <Dropdown.Item id={'advisor'} text={'... as advisor'} onClick={RadGradLoginButtons.handleClick}/>
          <Dropdown.Item id={'admin'} as={NavLink} exact={true} to="/signin" text={adminLabel}/>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default withRouter(RadGradLoginButtons);
