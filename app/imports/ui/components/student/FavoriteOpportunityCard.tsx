import * as React from 'react';
import { Card, Icon, Menu, Segment, Tab } from 'semantic-ui-react';
import { _ } from 'meteor/erasaur:meteor-lodash';
import { Link, withRouter } from 'react-router-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { IOpportunity } from '../../../typings/radgrad';
import IceHeader from '../shared/IceHeader';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import FutureParticipation from '../shared/FutureParticipation';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import * as Router from '../shared/RouterHelperFunctions';
import { Slugs } from '../../../api/slug/SlugCollection';
import { getInspectorDraggablePillStyle } from '../shared/StyleFunctions';
import NamePill from '../shared/NamePill';

interface IFavoriteOpportunityCardProps {
  match: any;
  opportunity: IOpportunity;
  studentID: string;
}

const itemSlug = (item) => Slugs.findDoc(item.slugID).name;

const buildRouteName = (match, item, type) => {
  const itemName = itemSlug(item);
  let route = '';
  switch (type) {
    case EXPLORER_TYPE.COURSES:
      route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${itemName}`);
      break;
    case EXPLORER_TYPE.OPPORTUNITIES:
      route = Router.buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${itemName}`);
      break;
    default:
      route = '#';
      break;
  }
  return route;
};

const FavoriteOpportunityCard = (props: IFavoriteOpportunityCardProps) => {
  const instances = OpportunityInstances.findNonRetired({
    studentID: props.studentID,
    opportunityID: props.opportunity._id
  });
  const terms = _.map(instances, (i) => AcademicTerms.findDoc(i.academicTermID));
  const termNames = _.map(terms, (t) => AcademicTerms.toString(t._id, false)).join(', ');
  const itemSlug = Slugs.findDoc(props.opportunity.slugID).name;
  return (
    <Card>
      <Card.Content>
        <IceHeader ice={props.opportunity.ice}/>
        {props.opportunity.name}
      </Card.Content>
      <Card.Content>
        {instances.length > 0 ? (<b>In plan:</b>) : <b>Not in plan</b>}
        <Droppable droppableId={'inspector-course'}>
          {(provided) => (
            <div
              ref={provided.innerRef}
            >
              <Draggable key={itemSlug} draggableId={itemSlug} index={0}>
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
                    <NamePill name={props.opportunity.name}/>
                  </div>
                )}
              </Draggable>
            </div>)}
        </Droppable>
      </Card.Content>
      <Card.Content>
        <FutureParticipation item={props.opportunity} type='opportunities'/>
      </Card.Content>
      <Card.Content>
        <Link to={buildRouteName(props.match, props.opportunity, EXPLORER_TYPE.OPPORTUNITIES)} target="_blank">View in
          Explorer <Icon name="arrow right"/></Link>
      </Card.Content>
    </Card>
  );
};

export default withRouter(FavoriteOpportunityCard);
