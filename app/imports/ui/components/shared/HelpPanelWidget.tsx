import React from 'react';
import Markdown from 'react-markdown';
import { useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { Grid, Header, Divider } from 'semantic-ui-react';
import * as Router from './utilities/router';
import { IHelpMessage } from '../../../typings/radgrad';

export interface IHelpPanelWidgetProps {
  helpMessages: IHelpMessage[];
}

const HelpPanelWidget: React.FC<IHelpPanelWidgetProps> = ({ helpMessages }) => {
  const match = useRouteMatch();
  const helpMessage = _.find(helpMessages, (m: IHelpMessage) => m.routeName === match.path);
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
  ) : <React.Fragment />;
};

export default HelpPanelWidget;
