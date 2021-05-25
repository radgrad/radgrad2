import React from 'react';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import RadGradHeader from '../../../components/shared/RadGradHeader';

const Task1: React.FC = () => (
  <div className='column'>
    <RadGradSegment header={<RadGradHeader title='TASK 1: HELLO WORLD' icon='globe americas'/>}>
      Hello World
    </RadGradSegment>
  </div>
);

export default Task1;
