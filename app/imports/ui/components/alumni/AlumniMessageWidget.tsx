import * as React from 'react';
import * as Markdown from 'react-markdown';
import { Header, Message } from 'semantic-ui-react';
import RadGradLogoText from '../shared/RadGradLogoText';

const AdminMessageWidget = () => (
  <Message attached="top">
    <Header dividing>WELCOME BACK</Header>
    <p />
We think you have graduated and are now an Alumni. Since you have graduated,
    <RadGradLogoText />
    {' '}
no longer
    has
    any experiences for you.
    <Markdown
      escapeHtml={false}
      source={'#### Are we wrong?\n' +
    'If this is in error, please email [radgrad@hawaii.edu](mailto:radgrad@hawaii.edu).'}
    />
  </Message>
);

export default AdminMessageWidget;
