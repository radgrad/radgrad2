import React from 'react';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';

const Task1: React.FC = () => {
  const header = <RadGradHeader title='Task 1: Hello World' icon='globe americas' />;
  return (
    <RadGradSegment header={header}>
      Hello World
    </RadGradSegment>
  );
};

export default Task1;
