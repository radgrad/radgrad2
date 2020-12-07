import React from 'react';
import { Message } from 'semantic-ui-react';

interface IUploadMessageWidgetProps {
  message: string;
  error: boolean;
}

const UploadFixtureResultWidget: React.FC<IUploadMessageWidgetProps> = ({ error, message }) => {
  if (error) {
    return (
      <Message negative>
        <Message.Header>Error loading fixture</Message.Header>
        <p>{message}</p>
      </Message>
    );
  }
  return (
    <Message positive>
      <Message.Header>Success loading fixture</Message.Header>
      <p>{message}</p>
    </Message>
  );
};

export default UploadFixtureResultWidget;
