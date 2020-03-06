import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { NavLink, Redirect, withRouter } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { Users } from '../../../api/user/UserCollection';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import {
  USERINTERACTIONDATATYPE,
  USERINTERACTIONSNOTYPEDATA,
  USERINTERACTIONSTYPE,
} from '../../../api/analytic/UserInteractionsType';

interface IRadGradLoginButtonsState {
  justLoggedIn: boolean;
  homePage: string;
}

class RadGradLoginButtons extends React.Component<{}, IRadGradLoginButtonsState> {
  constructor(props) {
    super(props);
    this.state = { justLoggedIn: false, homePage: '' };
  }

  private handleClick = (e, instance) => {
    // console.log(e, instance);
    e.preventDefault();
    const inst = this;
    const callback = function loginCallback(error) {
      if (error) {
        console.log('Error during CAS Login: ', error);
        instance.$('div .ui.error.message.hidden').text('You are not yet registered. Go see your Advisor.');
        instance.$('div .ui.error.message.hidden').removeClass('hidden');
      } else {
        const username = Meteor.user().username;
        const id = Meteor.userId();
        let role = Roles.getRolesForUser(id)[0];
        const isStudent = role.toLowerCase() === 'student';
        if (isStudent) {
          const profile = Users.findProfileFromUsername(username);
          if (profile.isAlumni) {
            role = 'Alumni';
          } else {
            // Track Student Login
            const interactionData: USERINTERACTIONDATATYPE = {
              username,
              type: USERINTERACTIONSTYPE.LOGIN,
              typeData: USERINTERACTIONSNOTYPEDATA,
            };
            userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
              if (userInteractionError) {
                console.log('Error creating UserInteraction.', userInteractionError);
              }
            });
          }
        }
        const homePage = `/${role.toLowerCase()}/${username}/home`;
        inst.setState({ justLoggedIn: true, homePage });
      }
    };
    Meteor.loginWithCas(callback);

  }

  public render() {
    const adminLabel = '... as admin';
    const advisorLabel = '... as advisor';
    const facultyLabel = '... as faculty';
    const mentorLabel = '... as mentor';
    const studentLabel = '... as student';
    if (this.state.justLoggedIn) {
      return (
        <Redirect to={{
          pathname: this.state.homePage,
        }}
        />
      );
    }
    return (
      <Dropdown text="LOGIN" pointing="top right">
        <Dropdown.Menu>
          <Dropdown.Item id="student" text={studentLabel} onClick={this.handleClick} />
          <Dropdown.Item id="faculty" text={facultyLabel} onClick={this.handleClick} />
          <Dropdown.Item id="mentor" text={mentorLabel} as={NavLink} to="/signin" />
          <Dropdown.Item id="advisor" text={advisorLabel} onClick={this.handleClick} />
          <Dropdown.Item id="admin" as={NavLink} exact to="/signin" text={adminLabel} />
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default withRouter(RadGradLoginButtons);
