import React from 'react';
import { Card, Icon, Statistic } from 'semantic-ui-react';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { AcademicTerm } from '../../../../typings/radgrad';
import AcademicTermLabel from '../label/AcademicTermLabel';

interface FutureParticipationCardProps {
  academicTerm: AcademicTerm;
  score: number;
}

const FutureParticipationCard: React.FC<FutureParticipationCardProps> = ({ academicTerm, score }) => {
  const slug = AcademicTerms.findSlugByID(academicTerm._id);
  const name = AcademicTerms.toString(academicTerm._id);
  return (
    <Card>
      <Card.Content>
        <Card.Header><AcademicTermLabel slug={slug} name={name} /></Card.Header>
        <Card.Description><Icon name="user" circular /> <Statistic label={score} /></Card.Description>
      </Card.Content>
    </Card>
  );
};

export default FutureParticipationCard;
