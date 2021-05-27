import React from 'react';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';

const Task1: React.FC = ({}) => {
  const task1Header = <RadGradHeader title="TASK 1: HELLO WORLD" icon="globe america" />;
  return (
    <RadGradSegment header={task1Header}>
      Hello World
    </RadGradSegment>
  );
};

export default Task1;
