import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as Markdown from 'react-markdown';

interface IAdminAnalyticsNewsletterWidget {
  message: string;
}

class AdminAnalyticsNewsletterMessagePreviewWidget extends React.Component<IAdminAnalyticsNewsletterWidget> {

  public render() {
    return (
      <div className="field">

        <label htmlFor="example">Message Preview</label>
        <input type="hidden" id="example" />
        <p>Aloha Student</p>
        <Markdown source={this.props.message} />
        <p>- The RadGrad Team</p>
      </div>

    );
  }
}

export default withRouter(AdminAnalyticsNewsletterMessagePreviewWidget);
