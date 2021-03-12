import React from 'react';
import Markdown from 'react-markdown/with-html';

interface ActionsBoxProps {
  description: string,
  children?: React.ReactNode
}

export const ActionsBox: React.FC<ActionsBoxProps> = ({ description, children }) => (
  <div>
    <Markdown source={description}/>
    {children}
  </div>
)
