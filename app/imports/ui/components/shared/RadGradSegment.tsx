import React from 'react';
import { Segment } from 'semantic-ui-react';
import RadGradHeader from './header/RadGradHeader';

interface RadGradSegmentProps {
  title: string;
  count?: number;
  icon?: string;
  style?: Record<string, unknown>;
  children?: React.ReactNode,
}

const RadGradSegment: React.FC<RadGradSegmentProps> = ({ title, count, icon, style = {}, children }) => (
  <Segment>
    <RadGradHeader text={title} count={count} icon={icon} dividing style={style} />
    <div style={{ marginTop: '1em' }}>
      {children}
    </div>
  </Segment>
);

export default RadGradSegment;