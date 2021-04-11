import React from 'react';
import RadGradHeader from '../../components/shared/header/RadGradHeader';
import RadGradSegment2 from '../../components/shared/RadGradSegment2';

const StudentSegmentExamplesPageExampleOne: React.FC = () => {
  const header = <RadGradHeader title='Example One' count={3} icon='graduation cap' />;
  return (
    <RadGradSegment2 header={header}>
      This is an example of a RadGrad segment with a simple header with no right side component.
    </RadGradSegment2>
  );
};

export default StudentSegmentExamplesPageExampleOne;
