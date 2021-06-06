import React from 'react';
import RadGradSegment from '../../../app/imports/ui/components/shared/RadGradSegment';
import RadGradHeader from '../../../app/imports/ui/components/shared/RadGradHeader';

const Task1: React.FC = () => (
  <RadGradSegment header={<RadGradHeader title='TASK 1: HELLO WORLD' icon='globe americas'/>}>
      Hello World
  </RadGradSegment>
);

export default Task1;
