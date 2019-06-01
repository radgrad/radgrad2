import * as React from 'react';
import * as Markdown from 'react-markdown';
import { withRouter } from 'react-router-dom';
import { Accordion, Grid, Icon, Message } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';

interface IHelpPanelWidgetProps {
  match: {
    path: string;
    parameters: {
      username: string;
    }
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
  }

  public render() {
    // console.log(this.props.match.path);
    const helpMessage = HelpMessages.findDoc({ routeName: this.props.match.path });
    // console.log(helpMessage);
    const helpText = `${helpMessage.text}
    #### Need more help?
If you have additional questions, please email [radgrad@hawaii.edu](mailto:radgrad@hawaii.edu).`;
    return (helpText) ? (
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
    ) : '';
  }
}

const HelpPanelWidgetContainer = withRouter(HelpPanelWidget);

export default HelpPanelWidgetContainer;
