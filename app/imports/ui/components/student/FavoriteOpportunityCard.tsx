import * as React from 'react';
import { Card, Icon, Menu, Segment, Tab } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { IOpportunity } from '../../../typings/radgrad';
import IceHeader from '../shared/IceHeader';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';

interface IFavoriteOpportunityCardProps {
  opportunity: IOpportunity;
  studentID: string;
}

const FavoriteOpportunityCard = (props: IFavoriteOpportunityCardProps) => {
  const instances = OpportunityInstances.findNonRetired({ studentID: props.studentID, opportunityID: props.opportunity._id });
  const terms = _.map(instances, (i) => AcademicTerms.findDoc(i.academicTermID));
  const termNames = _.map(terms, (t) => AcademicTerms.toString(t._id, false)).join(', ');
  console.log(instances, termNames);
  return (
    <Card>
      <Card.Content>
        <IceHeader ice={props.opportunity.ice}/>
        {props.opportunity.name}
      </Card.Content>
      <Card.Content>
        {instances.length > 0 ? (<b>In plan:</b>) : <b>Not in plan</b>}
      </Card.Content>
    </Card>
  )
}

export default FavoriteOpportunityCard;
