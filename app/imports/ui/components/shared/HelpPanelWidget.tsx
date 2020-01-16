import React from 'react';
import Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { Accordion, Grid, Icon, Message } from 'semantic-ui-react';
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

interface IHelpPanelWidgetState {
  activeIndex: number;
}

class HelpPanelWidget extends React.Component<IHelpPanelWidgetProps, IHelpPanelWidgetState> {

  constructor(props) {
    super(props);
    // console.log('HelpPanelWidget props=%o', props);
    this.state = { activeIndex: -1 };
  }

  private handleClick = (e, titleProps) => {
    e.preventDefault();
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  public render() {
    const helpPanelWidgetTitleStyle: React.CSSProperties = {
      textTransform: 'uppercase',
      color: '#409178',
    };

    const { match } = this.props;
    const helpMessage = _.find(this.props.helpMessages, (m) => m.routeName === this.props.match.path);
    const helpText = helpMessage ? `${helpMessage.text}

#### Need more help?

If you have additional questions, please email [radgrad@hawaii.edu](mailto:radgrad@hawaii.edu).` : '';
    return (helpMessage) ? (
      <Grid.Column id={`${helpPanelWidget}`}>
        <Message info floating>
          <Accordion>
            <Accordion.Title active={this.state.activeIndex === 0} index={0} onClick={this.handleClick}>
              <Icon name="dropdown" />
              <span style={helpPanelWidgetTitleStyle}><strong>{helpMessage.title}</strong></span>
            </Accordion.Title>
            <Accordion.Content active={this.state.activeIndex === 0}>
              <Markdown
                escapeHtml={false}
                source={helpText}
                renderers={{ link: (props) => Router.renderLink(props, match) }}
              />
            </Accordion.Content>
          </Accordion>
        </Message>
      </Grid.Column>
    ) : '';
  }
}

export default withRouter(withTracker((props) => {
  const helpMessages = HelpMessages.findNonRetired({ routeName: props.match.path });
  return {
    helpMessages,
  };
})(HelpPanelWidget));
