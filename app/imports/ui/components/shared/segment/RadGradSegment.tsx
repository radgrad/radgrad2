import React from 'react';
import { Segment } from 'semantic-ui-react';
import RadGradHeader from '../header/RadGradHeader';

interface RadGradSegmentProps {
  text: string;
  count?: number;
  icon?: string;
}

const RadGradSegment: React.FC<RadGradSegmentProps> = ({ text, count, icon, children }) => (
  <Segment>
    <RadGradHeader text={text} count={count} dividing icon={icon} />
    {children}
  </Segment>
);

export default RadGradSegment;
