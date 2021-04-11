import React from 'react';
import RadGradHeader from '../RadGradHeader';
import RadGradSegment from '../RadGradSegment';

const LevelDistribution: React.FC = () => {
  const header = <RadGradHeader title='Radgrad Students' icon='graduation cap' />;
  return (
    <RadGradSegment header={header} >
      Students at various levels go here.
    </RadGradSegment>
  );
};

export default LevelDistribution;
