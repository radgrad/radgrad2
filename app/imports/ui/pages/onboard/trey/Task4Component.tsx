import React from 'react';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';

const Task4Component: React.FC = () => {

  return (
    <RadGradSegment header={<RadGradHeader title='TASK 4: LABELS' icon='tags' dividing />}>
      Hello
    </RadGradSegment>
  );
};

export default Task4Component;