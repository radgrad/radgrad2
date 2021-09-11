import React from 'react';
import { SemanticSIZES } from 'semantic-ui-react';
import RadGradHeader from '../RadGradHeader';
import RadGradSegment from '../RadGradSegment';
import InterestInternshipCountList from './InterestInternshipCountList';

interface InterestInternshipCountProps {
  internshipCounts: [[string, number]];
  size: SemanticSIZES;
}

const InterestInternshipCount: React.FC<InterestInternshipCountProps> = ({ internshipCounts, size }) => {
  const title = 'Interest - Internship Counts';
  const icon = 'heart';
  const header = <RadGradHeader title={title} icon={icon} />;
  return (
    <RadGradSegment header={header}>
      <InterestInternshipCountList internshipCounts={internshipCounts} size={size} />
    </RadGradSegment>
  );
};

export default InterestInternshipCount;
