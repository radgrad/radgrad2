import React from 'react';
import RadGradHeader from '../../components/shared/header/RadGradHeader';
import RadGradSegment2 from '../../components/shared/RadGradSegment2';

const StudentSegmentExamplesPageExampleOne: React.FC = () => {
  const header = <RadGradHeader title='Title' count={3} icon='graduation cap' />;
  return (
    <RadGradSegment2 header={header}>
      Students at various levels go here.
    </RadGradSegment2>
  );
};

export default StudentSegmentExamplesPageExampleOne;
