import React from 'react';
import Markdown from 'react-markdown';
import { useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { Grid, Header, Divider } from 'semantic-ui-react';
import * as Router from '../../app/imports/ui/components/shared/utilities/router';
import { HelpMessage } from '../../app/imports/typings/radgrad';

export interface HelpPanelWidgetProps {
  helpMessages: HelpMessage[];
}

const HelpPanelWidget: React.FC<HelpPanelWidgetProps> = ({ helpMessages }) => {
  const match = useRouteMatch();
  const helpMessage = _.find(helpMessages, (m: HelpMessage) => m.routeName === match.path);
  const helpText = helpMessage ? `${helpMessage.text}` : '';
  return helpMessage ? (
    <Grid.Column>
      <Header as="h1">{helpMessage.title}</Header>
      <Markdown escapeHtml={false} source={helpText} renderers={{ link: (lProps) => Router.renderLink(lProps, match) }} />
      <Divider />
    </Grid.Column>
  ) : (
    <React.Fragment />
  );
};

export default HelpPanelWidget;
