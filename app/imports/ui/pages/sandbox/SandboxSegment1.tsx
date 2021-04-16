import React from 'react';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';

const SandboxSegment1: React.FC = () => {
  const header = <RadGradHeader title='Example One' count={3} icon='graduation cap' />;
  return (
    <RadGradSegment header={header}>
      This is an example of a RadGrad segment containing a title, icon, and count.
    </RadGradSegment>
  );
};

export default SandboxSegment1;
