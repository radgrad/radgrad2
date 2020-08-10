import React from 'react';
import { Icon } from 'semantic-ui-react';
import { IOpportunity } from '../../../typings/radgrad';
import { StudentParticipations } from '../../../api/public-stats/StudentParticipationCollection';

interface IStudentsFavoritedNumberWidgetProps {
  opportunity: IOpportunity;
}

const OpportunityStudentsParticipatingWidget = (props: IStudentsFavoritedNumberWidgetProps) => {
  const getNumberOfStudentsParticipating = (opportunity: IOpportunity): number => {
    const participatingStudents = StudentParticipations.findDoc({ itemID: opportunity._id });
    return participatingStudents.itemCount;
  };

  const numberOfStudentsParticipating = getNumberOfStudentsParticipating(props.opportunity);
  return (
    <>
      <Icon name="user circle" /> {numberOfStudentsParticipating}
    </>
  );
};

export default OpportunityStudentsParticipatingWidget;
