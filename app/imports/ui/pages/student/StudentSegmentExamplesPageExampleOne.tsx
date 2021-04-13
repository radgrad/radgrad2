import React from 'react';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';

const StudentSegmentExamplesPageExampleOne: React.FC = () => {
  const header = <RadGradHeader title='Example One' count={3} icon='graduation cap' />;
  return (
    <RadGradSegment header={header}>
      This is an example of a RadGrad segment with a simple header and no right side component.
    </RadGradSegment>
  );
};

export default StudentSegmentExamplesPageExampleOne;
