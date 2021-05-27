import React from 'react';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';

const Task1: React.FC = () => (
  <RadGradSegment header={<RadGradHeader dividing title='Task 1: Hello World' icon='globe americas' />}>
    Hello World
  </RadGradSegment>
);

export default Task1;