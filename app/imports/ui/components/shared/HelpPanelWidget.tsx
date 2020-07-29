import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { Accordion, Grid, Icon, Message } from 'semantic-ui-react';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import { IHelpDefine } from '../../../typings/radgrad';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import * as Router from './RouterHelperFunctions';
import { helpPanelWidget } from './shared-widget-names';

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
  const [activeIndexState, setActiveIndex] = useState(-1);

  const handleClick = (e, titleProps) => {
    e.preventDefault();
    const { index } = titleProps;
    const newIndex = activeIndexState === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const helpPanelWidgetTitleStyle: React.CSSProperties = {
    textTransform: 'uppercase',
    color: '#409178',
  };

  // eslint-disable-next-line react/prop-types
  const { match } = props;
  // eslint-disable-next-line react/prop-types
  const helpMessage = _.find(props.helpMessages, (m) => m.routeName === match.path);
  const adminEmail = RadGradProperties.getAdminEmail();
  const helpText = helpMessage ? `${helpMessage.text}

#### Need more help?

If you have additional questions, please email [${adminEmail}](mailto:${adminEmail}).` : '';
  return (helpMessage) ? (
    <Grid.Column id={`${helpPanelWidget}`}>
      <Message info floating>
        <Accordion>
          <Accordion.Title active={activeIndexState === 0} index={0} onClick={handleClick}>
            <Icon name="dropdown" />
            <span style={helpPanelWidgetTitleStyle}><strong>{helpMessage.title}</strong></span>
          </Accordion.Title>
          <Accordion.Content active={activeIndexState === 0}>
            <Markdown
              escapeHtml={false}
              source={helpText}
              renderers={{ link: (lProps) => Router.renderLink(lProps, match) }}
            />
          </Accordion.Content>
        </Accordion>
      </Message>
    </Grid.Column>
  ) : '';
};

export default withRouter(withTracker((props) => {
  const helpMessages = HelpMessages.findNonRetired({ routeName: props.match.path });
  return {
    helpMessages,
  };
})(HelpPanelWidget));
