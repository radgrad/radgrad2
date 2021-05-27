import React from 'react';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';

const Task1: React.FC = () => {
  const headerTask1 = <RadGradHeader title='TASK 1: HELLO WORLD' icon='globe americas icon' dividing/>;

  return (
    <RadGradSegment header={headerTask1}>
      Hello World
    </RadGradSegment>
  );
};

export default Task1;
