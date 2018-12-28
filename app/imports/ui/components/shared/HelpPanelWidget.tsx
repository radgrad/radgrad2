import { Meteor } from 'meteor/meteor';
import * as React from 'react';
import * as Markdown from 'react-markdown';
import { withTracker } from 'meteor/react-meteor-data';
import { Accordion, Grid, Icon, Loader, Message } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';

interface IHelpPanelWidgetProps {
  ready: boolean;
  helpText: string;
  helpTitle: string;
}

interface IHelpPanelWidgetState {
  activeIndex: number;
}

class HelpPanelWidget extends React.Component<IHelpPanelWidgetProps, IHelpPanelWidgetState> {
  public state: IHelpPanelWidgetState = { activeIndex: -1 };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick(e, titleProps) {
    e.preventDefault();
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }

  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Loading Help data</Loader>;
  }

  private renderPage() {
    const helpText = `${this.props.helpText}
#### Need more help?
If you have additional questions, please email [radgrad@hawaii.edu](mailto:radgrad@hawaii.edu).`;
    return (this.props.helpText) ? (
      <Grid>
        <Grid.Column width={'sixteen'}>
          <Message info={true}>
            <Accordion>
              <Accordion.Title active={this.state.activeIndex === 0} index={0} onClick={this.handleClick}>
                <Icon name="dropdown"/>
                <span>{this.props.helpTitle}</span>
              </Accordion.Title>
              <Accordion.Content active={this.state.activeIndex === 0}>
                <Markdown escapeHtml={true} source={helpText}/>
              </Accordion.Content>
            </Accordion>
          </Message>
        </Grid.Column>
      </Grid>
    ) : '';
  }
}

const HelpPanelWidgetContainer = withTracker((props) => {
  const sub = Meteor.subscribe(HelpMessages.getPublicationName());
  let doc;
  let helpTitle;
  let helpText;
  if (sub.ready()) {
    try {
      doc = HelpMessages.findDoc({ routeName: props.routeProps.pathname });
      helpTitle = doc.title;
      helpText = doc.text;
    } catch (e) {
      helpTitle = '';
      helpText = '';
    }
  }
  return {
    ready: sub.ready(),
    helpTitle,
    helpText,
  };
})(HelpPanelWidget);

export default HelpPanelWidgetContainer;
