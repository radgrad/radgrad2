import React from 'react';
import Markdown from 'react-markdown';
import { useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { Grid, Header, Divider } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import * as Router from './utilities/router';
import { IHelpMessage } from '../../../typings/radgrad';

interface IHelpPanelWidgetProps {
  helpMessages: IHelpMessage[];
}

const HelpPanelWidget = (props: IHelpPanelWidgetProps) => {
  const { helpMessages } = props;
  const match = useRouteMatch();
  const helpMessage = _.find(helpMessages, (m) => m.routeName === match.path);
  const helpText = helpMessage ? `${helpMessage.text}` : '';
  return (helpMessage) ? (
    <Grid.Column>
      <Header as="h1">{helpMessage.title}</Header>
      <Markdown
        escapeHtml={false}
        source={helpText}
        renderers={{ link: (lProps) => Router.renderLink(lProps, match) }}
      />
      <Divider />
    </Grid.Column>
  ) : '';
};

const HelpPanelWidgetContainer = withTracker(() => {
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    helpMessages,
  };
})(HelpPanelWidget);
export default HelpPanelWidgetContainer;
