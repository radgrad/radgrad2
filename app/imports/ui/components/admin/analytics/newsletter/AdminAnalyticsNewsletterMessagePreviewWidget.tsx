import React from 'react';
import Markdown from 'react-markdown';

/** @namespace ui.components.admin.newsletter */

interface AdminAnalyticsNewsletterWidgetProps {
  message: string;
}

/**
 * Preview widget for the Admin message.
 * @param {string} message The admin's message. Can use markdown.
 * @return {JSX.Element}
 * @memberOf ui.components.admin.newsletter
 */
const AdminAnalyticsNewsletterMessagePreviewWidget: React.FC<AdminAnalyticsNewsletterWidgetProps> = ({ message }) => (
  <div className="field">
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label htmlFor="example">Message Preview</label>
    <input type="hidden" id="example" />
    <p>Aloha Student</p>
    <div className="adminMessage">
      <Markdown source={message} />
    </div>
    <p>- The RadGrad Team</p>
  </div>
);

export default AdminAnalyticsNewsletterMessagePreviewWidget;
