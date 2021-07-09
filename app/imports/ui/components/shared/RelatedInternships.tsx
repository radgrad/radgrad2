import React from 'react';
import { Internship } from '../../../typings/radgrad';
import InternshipList from './InternshipList';
import RadGradHeader from './RadGradHeader';
import RadGradSegment from './RadGradSegment';
import { EXPLORER_TYPE_ICON } from '../../utilities/ExplorerUtils';

interface RelatedInternshipsProps {
  internships: Internship[];
  userID: string;
}

const RelatedInternships: React.FC<RelatedInternshipsProps> = ({ internships, userID }) => {
  const header = <RadGradHeader title='related internships' icon={EXPLORER_TYPE_ICON.INTERNSHIP} />;
  return (
    <RadGradSegment header={header}>
      <InternshipList userID={userID} size='medium' Internships={internships}/>
    </RadGradSegment>
  );
};

export default RelatedInternships;