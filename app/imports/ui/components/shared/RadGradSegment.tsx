import React from 'react';
import { Segment } from 'semantic-ui-react';

interface RadGradSegmentProps {
  header: React.ReactNode,
  style?: Record<string, unknown>;
  children?: React.ReactNode,
}

const RadGradSegment: React.FC<RadGradSegmentProps> = ({ header, style = {}, children }) => (
  <Segment>
    {header}
    <div style={{ marginTop: '1em' }}>
      {children}
    </div>
  </Segment>
);

export default RadGradSegment;
