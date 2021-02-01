import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, Redirect } from 'react-router-dom';
import { Dropdown, Message } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { Users } from '../../../api/user/UserCollection';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';
import { USERINTERACTIONSNOTYPEDATA, UserInteractionsTypes } from '../../../api/analytic/UserInteractionsTypes';
import { UserInteractionDefine } from '../../../typings/radgrad';
import { ROLE } from '../../../api/role/Role';

const RadGradLoginButtons: React.FC = () => {
  const [pathname, setPathname] = useState<string>('');
  const [redirectToRefererState, setRedirectToReferer] = useState<boolean>(false);

  const handleClick = (e, instance) => {
    e.preventDefault();
    // console.log(instance);
    const callback = (error) => {
      if (error) {
        console.error('Error during CAS Login: ', error);
      } else {
        const username = Meteor.user().username;
        const userId = Meteor.userId();
        let role = Roles.getRolesForUser(userId)[0];
        // console.log(username, userId, Roles.getRolesForUser(userId), role);
        // console.log(Users.count(), Users.getProfile(userId));
        const isStudent = role.toLowerCase() === 'student';
        if (isStudent) {
          const profile = Users.findProfileFromUsername(username);
          if (profile.isAlumni) {
            role = 'Alumni';
          } else {
            // Track Student Login
            const interactionData: UserInteractionDefine = {
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
          setPathname(`/${ROLE.ADVISOR.toLowerCase()}/${username}/home`);
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
    <div>
      <Dropdown id="LOGIN" text="LOGIN" pointing="top right">
        <Dropdown.Menu>
          <Dropdown.Item id="student" text={studentLabel} as={Link} to="/signin" />
          <Dropdown.Item id="faculty" text={facultyLabel} as={Link} to="/signin" />
          <Dropdown.Item id="advisor" text={advisorLabel} as={Link} to="/signin" />
          <Dropdown.Item id="admin" text={adminLabel} as={Link} to="/signin" />
        </Dropdown.Menu>
      </Dropdown>
      <Message hidden negative>
        {`You are not yet registered. Send an email to ${Meteor.settings.public.adminProfile.username} to register.`}
      </Message>
    </div>
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
