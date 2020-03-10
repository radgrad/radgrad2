import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { withTracker } from 'meteor/react-meteor-data';
import { IOpportunity, IOpportunityInstance } from '../../../typings/radgrad';
import IceHeader from '../shared/IceHeader';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import FutureParticipation from '../shared/FutureParticipation';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getInspectorDraggablePillStyle } from '../shared/StyleFunctions';
import NamePill from '../shared/NamePill';
import { buildRouteName } from './DepUtilityFunctions';

interface IFavoriteOpportunityCardProps {
  match: any;
  opportunity: IOpportunity;
  studentID: string;
  instances: IOpportunityInstance[];
}

const FavoriteOpportunityCard = (props: IFavoriteOpportunityCardProps) => {
  // console.log('FavoriteOpportunityCard', props);
  const instances = props.instances;
  const terms = _.map(instances, (i) => AcademicTerms.findDoc(i.termID));
  const termNames = _.map(terms, (t) => AcademicTerms.getShortName(t._id)).join(', ');
  const slug = Slugs.findDoc(props.opportunity.slugID).name;
  const textAlignRight: React.CSSProperties = {
    textAlign: 'right',
  };
  const droppableID = `${props.opportunity._id}`;
  return (
    <Card>
      <Card.Content>
        <IceHeader ice={props.opportunity.ice} />
        <Card.Header>{props.opportunity.name}</Card.Header>
      </Card.Content>
      <Card.Content>
        {instances.length > 0 ? (
          <React.Fragment>
            <b>In plan:</b>
            {' '}
            {termNames}
          </React.Fragment>
) : <b>Not in plan</b>}
        <Droppable droppableId={droppableID}>
          {(provided) => (
            <div
              ref={provided.innerRef}
            >
              <Draggable key={slug} draggableId={slug} index={0}>
                {(prov, snap) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    {...prov.dragHandleProps}
                    style={getInspectorDraggablePillStyle(
                      snap.isDragging,
                      prov.draggableProps.style,
                    )}
                  >
                    <NamePill name={props.opportunity.name} />
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
)}
        </Droppable>
      </Card.Content>
      <Card.Content>
        <FutureParticipation item={props.opportunity} type="opportunities" />
      </Card.Content>
      <Card.Content>
        <p style={textAlignRight}>
          <Link to={buildRouteName(props.match, props.opportunity, EXPLORER_TYPE.OPPORTUNITIES)} target="_blank">
            View
            in
            Explorer
            <Icon name="arrow right" />
          </Link>
        </p>
      </Card.Content>
    </Card>
  );
};

export default withRouter(withTracker((props) => {
  const instances = OpportunityInstances.findNonRetired({
    studentID: props.studentID,
    opportunityID: props.opportunity._id,
  });
  return {
    instances,
  };
})(FavoriteOpportunityCard));
