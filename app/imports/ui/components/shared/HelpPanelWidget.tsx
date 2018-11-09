import { Meteor } from 'meteor/meteor';
import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Card, Container, Grid, Header, Icon, Image, Loader, Segment } from 'semantic-ui-react';

interface IHelpPanelWidgetProps {
  ready: boolean;
  helpText: string;
  helpTitle: string;
}
class HelpPanelWidget extends React.Component<IHelpPanelWidgetProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Loading Help data</Loader>;
  }

  private renderPage() {
    return (this.props.helpText) ? (
      <div className="{{#if noHelpClass}} {{else}}radgrad-help{{/if}} sixteen wide column">
        <div className="ui info floating message">
          <div className="ui accordion">
            <div className="radgrad-help-title {{#if open}}active{{/if}} title header">
              <i className="dropdown icon"></i>
              <span>{this.props.helpTitle}</span>
            </div>
            <div className="{{#if open}}active{{/if}} content">
              {{#markdown}}{this.props.helpText}

              #### Need more help?
              If you have additional questions, please email [radgrad@hawaii.edu](mailto:radgrad@hawaii.edu).
              {{/markdown}}
                </div>
                </div>
                </div>
                </div>
                ) : '';
  }
}
