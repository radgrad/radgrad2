import React from 'react';
import { Card, SemanticWIDTHS } from 'semantic-ui-react';
import { RadGradProperties } from '../../../../api/radgrad/RadGradProperties';
import { AcademicTerm } from '../../../../typings/radgrad';
import FutureParticipationCard from './FutureParticipationCard';

interface FutureParticipationProps {
  academicTerms: AcademicTerm[];
  scores: number[];
}

const itemsPerRow: SemanticWIDTHS = RadGradProperties.getQuarterSystem() ? 4 : 6;
const FutureParticipation: React.FC<FutureParticipationProps> = ({ academicTerms, scores }) => (
  <Card.Group itemsPerRow={itemsPerRow}>
    {academicTerms.map((term, index) => (
      <FutureParticipationCard academicTerm={term} score={scores[index]} key={term._id} />
    ))}
  </Card.Group>
);

export default FutureParticipation;
