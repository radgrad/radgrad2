import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link, Redirect } from 'react-router-dom';
import { Button, Dropdown, Message, SemanticSIZES } from 'semantic-ui-react';
import { Roles } from 'meteor/alanning:roles';
import { Users } from '../../../api/user/UserCollection';
import { ROLE } from '../../../api/role/Role';
import { COMPONENTIDS } from '../../utilities/ComponentIDs';

interface RadGradLoginButtonsProps {
  size?: SemanticSIZES;
  instanceName?: string;
  inverted?: boolean;
}

const RadGradLoginButtons: React.FC<RadGradLoginButtonsProps> = ({ instanceName = '', size = 'medium', inverted = false }) => {
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
      <Button as = 'div' inverted={inverted} size={size} >
        <Dropdown id={COMPONENTIDS.LOGIN} text='LOGIN' pointing="top right" simple mode="contained" content={{ height:'100%', width: '100%' }}>
          <Dropdown.Menu>
            <Dropdown.Item id={COMPONENTIDS.STUDENT} text={studentLabel} as={Link} to="/signin" />
            <Dropdown.Item id={COMPONENTIDS.FACULTY} text={facultyLabel} as={Link} to="/signin" />
            <Dropdown.Item id={COMPONENTIDS.ADVISOR} text={advisorLabel} as={Link} to="/signin" />
            <Dropdown.Item id={COMPONENTIDS.ADMIN} text={adminLabel} as={Link} to="/signin" />
          </Dropdown.Menu>
        </Dropdown>
      </Button>
      <Message hidden negative>
        {`You are not yet registered. Send an email to ${Meteor.settings.public.adminProfile.username} to register.`}
      </Message>
    </div>
  ) : (
    <Button content={{ height:'100%', width: '100%' }} mode="contained" inverted={inverted} size={size}>
      <Dropdown id={COMPONENTIDS.LOGIN} text={`${instanceName} LOGIN FOR`} pointing="top right">
        <Dropdown.Menu>
          <Dropdown.Item id={COMPONENTIDS.STUDENT} text={studentLabel} onClick={handleClick} />
          <Dropdown.Item id={COMPONENTIDS.FACULTY} text={facultyLabel} onClick={handleClick} />
          <Dropdown.Item id={COMPONENTIDS.ADVISOR} text={advisorLabel} onClick={handleClick} />
          <Dropdown.Item id={COMPONENTIDS.ADMIN} text={adminLabel} as={Link} to="/signin" />
        </Dropdown.Menu>
      </Dropdown>
    </Button>
  );
};

export default RadGradLoginButtons;
