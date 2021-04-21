import React from 'react';
import RadGradHeader from '../RadGradHeader';
import RadGradSegment from '../RadGradSegment';

const CommunityActivity: React.FC = () => {
  const header = <RadGradHeader title="What's New?" icon='calendar alternate outline' />;
  return (
    <RadGradSegment header={header}>
      To be implemented: What&#39;s new in RadGrad.
    </RadGradSegment>
  );
};

export default CommunityActivity;
