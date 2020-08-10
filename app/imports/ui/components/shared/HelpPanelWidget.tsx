import React from 'react';
import Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { Grid, Header } from 'semantic-ui-react';
import { IHelpDefine } from '../../../typings/radgrad';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import * as Router from './RouterHelperFunctions';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';

interface IHelpPanelWidgetProps {
  helpMessages: IHelpDefine[]
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const HelpPanelWidget = (props: IHelpPanelWidgetProps) => {
  const { match } = props;

  const helpMessage = _.find(props.helpMessages, (m) => m.routeName === match.path);
  const adminEmail = RadGradProperties.getAdminEmail();
  const helpText = helpMessage ? `${helpMessage.text}

#### Need more help?

If you have additional questions, please email [${adminEmail}](mailto:${adminEmail}).` : '';
  return (helpMessage) ? (
    <Grid.Column>
      <Header as="h1">{helpMessage.title}</Header>
      <p>
        <Markdown
          escapeHtml={false}
          source={helpText}
          renderers={{ link: (lProps) => Router.renderLink(lProps, match) }}
        />
      </p>
    </Grid.Column>
  ) : '';
};

export default withRouter(withTracker((props) => {
  const helpMessages = HelpMessages.findNonRetired({ routeName: props.match.path });
  return {
    helpMessages,
  };
})(HelpPanelWidget));
