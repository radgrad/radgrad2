import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { Grid, Header, Divider } from 'semantic-ui-react';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import { IHelpDefine } from '../../../typings/radgrad';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import * as Router from './RouterHelperFunctions';
// import { helpPanelWidget } from './shared-widget-names';

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

  // const handleClick = (e, titleProps) => {
  //   e.preventDefault();
  //   const { index } = titleProps;
  //   const newIndex = activeIndexState === index ? -1 : index;
  //   setActiveIndex(newIndex);
  // };

  const { match } = props;
  const helpMessage = _.find(props.helpMessages, (m) => m.routeName === props.match.path);
  const helpText = helpMessage ? `${helpMessage.text}` : '';
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
      <Divider />
    </Grid.Column>
  ) : '';
};

export default withRouter(withTracker((props) => {
  const helpMessages = HelpMessages.find({ routeName: props.match.path }).fetch();
  return {
    helpMessages,
  };
})(HelpPanelWidget));
