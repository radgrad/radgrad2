import React from 'react';
import Markdown from 'react-markdown/with-html';
import { Grid } from 'semantic-ui-react';

interface ActionsBoxProps {
  description: string,
  children?: React.ReactNode
}

export const ActionsBox: React.FC<ActionsBoxProps> = ({ description, children }) => (
  <div>
    <Markdown source={description}/>
    <Grid>
      <Grid.Column>
        {children}
      </Grid.Column>
    </Grid>
  </div>
);
