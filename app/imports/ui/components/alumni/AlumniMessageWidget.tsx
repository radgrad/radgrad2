import React from 'react';
import Markdown from 'react-markdown';
import { Header, Message } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import RadGradLogoText from '../shared/RadGradLogoText';

const AdminMessageWidget: React.FC = () => {
  const adminEmail = RadGradProperties.getAdminEmail();
  const instanceName = Meteor.settings.public.instanceName;
  return (
    <Message attached="top">
      <Header dividing>WELCOME BACK</Header>
      <p />
      We think you have graduated and are now an Alumni. Since you have graduated,
      <RadGradLogoText instanceName={instanceName} /> no longer has any experiences for you.
      <Markdown escapeHtml={false} source={'#### Are we wrong?\n' + `If this is in error, please email [${adminEmail}](mailto:${adminEmail}).`} />
    </Message>
  );
};

export default AdminMessageWidget;
