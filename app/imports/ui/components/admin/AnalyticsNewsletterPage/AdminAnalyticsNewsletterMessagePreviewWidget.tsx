import React from 'react';
import Markdown from 'react-markdown';

interface IAdminAnalyticsNewsletterWidget {
  message: string;
}

const AdminAnalyticsNewsletterMessagePreviewWidget = (props: IAdminAnalyticsNewsletterWidget) => (
  <div className="field">
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label htmlFor="example">Message Preview</label>
    <input type="hidden" id="example" />
    <p>Aloha Student</p>
    <div className="adminMessage">
      <Markdown source={props.message} />
    </div>
    <p>- The RadGrad Team</p>
  </div>
);

export default AdminAnalyticsNewsletterMessagePreviewWidget;
