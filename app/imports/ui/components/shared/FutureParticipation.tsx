import React from 'react';
import { Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { RadGradProperties } from '../../../api/radgrad/RadGradProperties';
import { IAcademicTerm } from '../../../typings/radgrad';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { CourseScoreboard, OpportunityScoreboard } from '../../../startup/client/collections';

interface IFutureParticipationProps {
  academicTerms: IAcademicTerm[];
  type: string;
  item: any;
  scores: number;
}

const termName = (termID) => (AcademicTerms.getShortName(termID));

const columnColor = (count) => {
  if (count > 29) {
    return 'green';
  }
  if (count > 10) {
    return 'yellow';
  }
  return undefined;
};

const FutureParticipation = (props: IFutureParticipationProps) => (
  <Grid columns="equal" padded={false}>
    {_.map(props.academicTerms, (term, index) => (
      <Grid.Column
        key={term._id}
        color={columnColor(props.scores[index])}
      >
        <b>{termName(term._id)}</b>
        <br />
        {props.scores[index]}
      </Grid.Column>
))}
  </Grid>
);

export default withTracker((props) => {
  const quarter = RadGradProperties.getQuarterSystem();
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  // console.log(currentTerm);
  const numTerms = quarter ? 12 : 9;
  const academicTerms = AcademicTerms.findNonRetired({ termNumber: { $gte: currentTerm.termNumber } }, {
    sort: { termNumber: 1 },
    limit: numTerms,
  });
  const scores = [];
  _.forEach(academicTerms, (term: any) => {
    const id = `${props.item._id} ${term._id}`;
    if (props.type === 'courses') {
      const score: any[] = CourseScoreboard.find({ _id: id }).fetch();
      if (score.length > 0) {
        scores.push(score[0].count);
      } else {
        scores.push(0);
      }
    } else {
      const score: any[] = OpportunityScoreboard.find({ _id: id }).fetch();
      if (score.length > 0) {
        scores.push(score[0].count);
      } else {
        scores.push(0);
      }
    }
  });
  return {
    academicTerms,
    scores,
  };
})(FutureParticipation);
