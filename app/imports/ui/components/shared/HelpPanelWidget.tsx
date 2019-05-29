import * as React from 'react';
import * as Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Accordion, Grid, Icon, Message } from 'semantic-ui-react';
import { IHelpDefine } from '../../../typings/radgrad'; // eslint-disable-line
import { HelpMessages } from '../../../api/help/HelpMessageCollection';

interface IHelpPanelWidgetProps {
  helpMessages: IHelpDefine[]
  match: {
    path: string;
  }
}

interface IHelpPanelWidgetState {
  activeIndex: number;
}

class HelpPanelWidget extends React.Component<IHelpPanelWidgetProps, IHelpPanelWidgetState> {
  public state: IHelpPanelWidgetState = { activeIndex: -1 };

  constructor(props) {
    super(props);
    // console.log('HelpPanelWidget props=%o', props);
  }

  private handleClick = (e, titleProps) => {
    e.preventDefault();
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  public render() {
    const helpMessage = _.find(this.props.helpMessages, (m) => m.routeName === this.props.match.path);
    const helpText = helpMessage ? `${helpMessage.text}
#### Need more help?
If you have additional questions, please email [radgrad@hawaii.edu](mailto:radgrad@hawaii.edu).` : '';
    return (helpMessage) ? (
      <Grid>
        <Grid.Column width={'sixteen'}>
          <Message info={true}>
            <Accordion>
              <Accordion.Title active={this.state.activeIndex === 0} index={0} onClick={this.handleClick}>
                <Icon name="dropdown"/>
                <span>{helpMessage.title}</span>
              </Accordion.Title>
              <Accordion.Content active={this.state.activeIndex === 0}>
                <Markdown escapeHtml={false} source={helpText}/>
              </Accordion.Content>
            </Accordion>
          </Message>
        </Grid.Column>
      </Grid>
    ) : '';
  }
}


const HelpPanelWidgetContainer = withTracker((props) => {
  const helpMessages = HelpMessages.findNonRetired({ routeName: props.match.path });
  return {
    helpMessages,
  };
})(HelpPanelWidget);

export default withRouter(HelpPanelWidgetContainer);
