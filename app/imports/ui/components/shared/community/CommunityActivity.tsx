import React from 'react';
import RadGradHeader from '../RadGradHeader';
import RadGradSegment from '../RadGradSegment';

const CommunityActivity: React.FC = () => {
  const header = <RadGradHeader title='Community Activity' icon='calendar alternate outline' />;
  return (
    <RadGradSegment header={header}>
      To be implemented: A feed of changes among users of RadGrad and other entities in the system.
    </RadGradSegment>
  );
};

export default CommunityActivity;
