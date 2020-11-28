import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, Redirect } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { Users } from '../../../api/user/UserCollection';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import {
  USERINTERACTIONSNOTYPEDATA,
  UserInteractionsTypes,
} from '../../../api/analytic/UserInteractionsTypes';
import { IUserInteractionDefine } from '../../../typings/radgrad';
import { ROLE } from '../../../api/role/Role';

const RadGradLoginButtons: React.FC = () => {
  const [pathname, setPathname] = useState<string>('');
  const [redirectToRefererState, setRedirectToReferer] = useState<boolean>(false);

  const handleClick = (e, instance) => {
    e.preventDefault();
    const callback = function loginCallback(error) {
      if (error) {
        console.error('Error during CAS Login: ', error);
        instance.$('div .ui.error.message.hidden').text('You are not yet registered. Go see your Advisor.');
        instance.$('div .ui.error.message.hidden').removeClass('hidden');
      } else {
        const username = Meteor.user().username;
        const userId = Meteor.userId();
        let role = Roles.getRolesForUser(userId)[0];
        const isStudent = role.toLowerCase() === 'student';
        if (isStudent) {
          const profile = Users.findProfileFromUsername(username);
          if (profile.isAlumni) {
            role = 'Alumni';
          } else {
            // Track Student Login
            const interactionData: IUserInteractionDefine = {
              username,
              type: UserInteractionsTypes.LOGIN,
              typeData: [USERINTERACTIONSNOTYPEDATA],
            };
            userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
              if (userInteractionError) {
                console.error('Error creating UserInteraction.', userInteractionError);
              }
            });
          }
        }
        if (Roles.userIsInRole(userId, [ROLE.ADVISOR])) {
          setPathname(`/${ROLE.ADVISOR.toLowerCase}/${username}/home`);
        } else if (Roles.userIsInRole(userId, [ROLE.FACULTY])) {
          setPathname(`/${ROLE.FACULTY.toLowerCase()}/${username}/home`);
        } else if (Roles.userIsInRole(userId, [ROLE.STUDENT])) {
          setPathname(`/${ROLE.STUDENT.toLowerCase()}/${username}/home`);
        }
        localStorage.setItem('logoutEvent', 'false');
        setRedirectToReferer(true);
      }
    };
    Meteor.loginWithCas(callback);
  };

  const adminLabel = '... as admin';
  const advisorLabel = '... as advisor';
  const facultyLabel = '... as faculty';
  const studentLabel = '... as student';
  const development = Meteor.settings.public.development;

  // Redirection after logging in
  if (redirectToRefererState) {
    return <Redirect to={pathname} />;
  }

  return development ? (
    <Dropdown id="LOGIN" text="LOGIN" pointing="top right">
      <Dropdown.Menu>
        <Dropdown.Item id="student" text={studentLabel} as={Link} to="/signin" />
        <Dropdown.Item id="faculty" text={facultyLabel} as={Link} to="/signin" />
        <Dropdown.Item id="advisor" text={advisorLabel} as={Link} to="/signin" />
        <Dropdown.Item id="admin" text={adminLabel} as={Link} to="/signin" />
      </Dropdown.Menu>
    </Dropdown>
  ) : (
    <Dropdown id="LOGIN" text="LOGIN" pointing="top right">
      <Dropdown.Menu>
        <Dropdown.Item id="student" text={studentLabel} onClick={handleClick} />
        <Dropdown.Item id="faculty" text={facultyLabel} onClick={handleClick} />
        <Dropdown.Item id="advisor" text={advisorLabel} onClick={handleClick} />
        <Dropdown.Item id="admin" text={adminLabel} as={Link} to="/signin" />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default RadGradLoginButtons;
