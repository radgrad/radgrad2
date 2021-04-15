import React from 'react';
import { Grid } from 'semantic-ui-react';

interface DetailsBoxProps {
  description: string,
  children?: React.ReactNode
}

export const DetailsBox: React.FC<DetailsBoxProps> = ({ description, children }) => (
  <div className="highlightBox">
    <p>{description}</p>
    <Grid>
      <Grid.Column>
        {children}
      </Grid.Column>
    </Grid>
  </div>
);
