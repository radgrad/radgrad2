import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, withRouter } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { Users } from '../../../api/user/UserCollection';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import {
  UserInteractionsDataType,
  USERINTERACTIONSNOTYPEDATA,
  UserInteractionsTypes,
} from '../../../api/analytic/UserInteractionsTypes';

const RadGradLoginButtons = () => {
  const handleClick = (e, instance) => {
    // console.log(e, instance);
    e.preventDefault();
    const callback = function loginCallback(error) {
      if (error) {
        console.error('Error during CAS Login: ', error);
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
            const interactionData: UserInteractionsDataType = {
              username,
              type: UserInteractionsTypes.LOGIN,
              typeData: USERINTERACTIONSNOTYPEDATA,
            };
            userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
              if (userInteractionError) {
                console.error('Error creating UserInteraction.', userInteractionError);
              }
            });
          }
        }
      }
    };
    Meteor.loginWithCas(callback);
  };

  const adminLabel = '... as admin';
  const advisorLabel = '... as advisor';
  const facultyLabel = '... as faculty';
  const mentorLabel = '... as mentor';
  const studentLabel = '... as student';
  return (
    <Dropdown text="LOGIN" pointing="top right">
      <Dropdown.Menu>
        <Dropdown.Item id="student" text={studentLabel} onClick={handleClick} />
        <Dropdown.Item id="faculty" text={facultyLabel} onClick={handleClick} />
        <Dropdown.Item id="mentor" text={mentorLabel} as={Link} to="/signin" />
        <Dropdown.Item id="advisor" text={advisorLabel} onClick={handleClick} />
        <Dropdown.Item id="admin" text={adminLabel} as={Link} to="/signin" />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default withRouter(RadGradLoginButtons);
