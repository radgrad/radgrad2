import React from 'react';
import Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { Grid, Header, Divider } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import * as Router from './RouterHelperFunctions';
import { IMatchProps } from './RouterHelperFunctions';
import { IHelpMessage } from '../../../typings/radgrad';

interface IHelpPanelWidgetProps {
  match: IMatchProps;
  helpMessages: IHelpMessage[];
}

const HelpPanelWidget = (props: IHelpPanelWidgetProps) => {
  // FIXME: These are giving an ESLint error saying these props are missing in props validation (react/prop-types)
  const { match, helpMessages } = props;

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

const HelpPanelWidgetCon = withRouter(HelpPanelWidget);
const HelpPanelWidgetContainer = withTracker((props) => {
  const helpMessages = HelpMessages.findNonRetired({ routeName: props.match.path });
  return {
    helpMessages,
  };
})(HelpPanelWidgetCon);
export default HelpPanelWidgetContainer;
