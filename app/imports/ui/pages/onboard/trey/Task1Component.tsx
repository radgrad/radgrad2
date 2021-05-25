import React from 'react';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';

const Task1Component: React.FC = () => (
  <RadGradSegment header={<RadGradHeader title='TASK 1: HELLO WORLD' icon='globe americas' dividing />}>Hello World</RadGradSegment>
);


export default Task1Component;