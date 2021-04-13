import React from 'react';
import RadGradHeader from '../RadGradHeader';
import RadGradSegment from '../RadGradSegment';

const UpcomingEvents: React.FC = () => {
  const header = <RadGradHeader title='Upcoming Events' icon='calendar alternate outline' />;
  return (
    <RadGradSegment header={header} >
      To be implemented: A feed of upcoming opportunities, ordered by event date.
    </RadGradSegment>
  );
};

export default UpcomingEvents;
