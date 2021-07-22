import React from 'react';
import { Message } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { ButtonLink } from '../../shared/button/ButtonLink';
import * as Router from '../../shared/utilities/router';
import ProfileInternshipAccordion from './ProfileInternshipAccordion';

interface ProfileInternshipsProps {
  studentID: string;
  // internship: Internship;
  // internshipInstances: InternshipInstance[];
}

const ProfileInternships: React.FC<ProfileInternshipsProps> = ({ studentID }) => {
  const match = useRouteMatch();
  return (
    <Message>
      <Message.Header>Place holder</Message.Header>
      <Message.Content>
        <ProfileInternshipAccordion />
        <p>You can add internships to your profile in the explorer.</p>
        <ButtonLink url={Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERNSHIPS}`)} label="View in Explorer" rel="noopener noreferrer" size="medium" />
      </Message.Content>
    </Message>
  );
};

export default ProfileInternships;
