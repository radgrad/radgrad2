import React from 'react';
import { Card, Grid, SemanticWIDTHS } from 'semantic-ui-react';
import { RadGradProperties } from '../../../../api/radgrad/RadGradProperties';
import { AcademicTerm } from '../../../../typings/radgrad';
import FutureParticipationCard from './FutureParticipationCard';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';

interface FutureParticipationProps {
  academicTerms: AcademicTerm[];
  scores: number[];
  narrow: boolean;
}

const itemsPerRow: SemanticWIDTHS = RadGradProperties.getQuarterSystem() ? 4 : 6;
const termName = (termID) => AcademicTerms.getShortName(termID);

const columnColor = (count) => {
  if (count > 29) {
    return 'green';
  }
  if (count > 10) {
    return 'yellow';
  }
  return undefined;
};

const FutureParticipation: React.FC<FutureParticipationProps> = ({ academicTerms, scores, narrow }) => {
  if (narrow) {
    let columns: SemanticWIDTHS = 3;
    if (RadGradProperties.getQuarterSystem()) {
      columns = 4;
    }
    return (
      <Grid columns={columns} padded={false} stackable>
        {academicTerms.map((term, index) => (
          <Grid.Column key={term._id} color={columnColor(scores[index])}>
            <b>{termName(term._id)}</b>
            <br />
            {scores[index]}
          </Grid.Column>
        ))}
      </Grid>
    );
  }
  return (
    <Card.Group itemsPerRow={itemsPerRow}>
      {academicTerms.map((term, index) => (
        <FutureParticipationCard academicTerm={term} score={scores[index]} key={term._id} />
      ))}
    </Card.Group>
  );
};

export default FutureParticipation;
