import React from 'react';
import { Grid } from 'semantic-ui-react';
import { AcademicTerm } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';

interface FutureParticipationProps {
  academicTerms: AcademicTerm[];
  scores: number[];
}

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

const FutureParticipation: React.FC<FutureParticipationProps> = ({ academicTerms, scores }) => (
  <Grid columns="equal" padded={false}>
    {academicTerms.map((term, index) => (
      <Grid.Column key={term._id} color={columnColor(scores[index])}>
        <b>{termName(term._id)}</b>
        <br />
        {scores[index]}
      </Grid.Column>
    ))}
  </Grid>
);

export default FutureParticipation;
