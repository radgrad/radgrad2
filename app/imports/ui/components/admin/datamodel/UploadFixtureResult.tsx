import React from 'react';
import { Message } from 'semantic-ui-react';

interface UploadMessageWidgetProps {
  message: string;
  error: boolean;
}

const UploadFixtureResult: React.FC<UploadMessageWidgetProps> = ({ error, message }) => {
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

export default UploadFixtureResult;
