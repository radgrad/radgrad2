import React from 'react';
import { Card } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { AcademicTerm, Opportunity, OpportunityInstance } from '../../../../typings/radgrad';
import { DegreePlannerStateNames } from '../../../pages/student/StudentDegreePlannerPage';
import { useStickyState } from '../../../utilities/StickyState';
import { ViewInExplorerButtonLink } from '../../shared/button/ViewInExplorerButtonLink';
import FutureParticipationButton from '../../shared/FutureParticipationButton';
import IceHeader from '../../shared/IceHeader';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { cardStyle, contentStyle, getDraggablePillStyle } from './utilities/styles';
import NamePill from './NamePill';

interface ProfileOpportunityCardProps {
  opportunity: Opportunity;
  studentID: string;
  opportunityInstances: OpportunityInstance[];
}

const ProfileOpportunityCard: React.FC<ProfileOpportunityCardProps> = ({
  opportunity,
  opportunityInstances,
  studentID,
}) => {
  const match = useRouteMatch();
  const instances = opportunityInstances.filter((i) => i.opportunityID === opportunity._id);
  const terms: AcademicTerm[] = instances.map((i) => AcademicTerms.findDoc(i.termID));
  // Sort by ascending order
  terms.sort((a, b) => a.year - b.year);
  const termNames = terms.map((t) => AcademicTerms.getShortName(t._id)).join(', ');
  const slug = Slugs.findDoc(opportunity.slugID).name;
  const droppableID = `${opportunity._id}`;
  const [width] = useStickyState(DegreePlannerStateNames.draggablePillWidth, 0);
  const [height] = useStickyState(DegreePlannerStateNames.draggablePillHeight, 0);
  return (
    <Card style={cardStyle}>
      <Card.Content style={contentStyle}>
        <IceHeader ice={opportunity.ice} />
        <Card.Header>{opportunity.name}</Card.Header>
      </Card.Content>
      <Card.Content style={contentStyle}>
        {instances.length > 0 ? (
          <React.Fragment>
            <b>Scheduled:</b> {termNames}
          </React.Fragment>
        ) : (
          <b>Not In Plan (Drag to move)</b>
        )}
        <Droppable droppableId={droppableID}>
          {(provided) => (
            <div ref={provided.innerRef}>
              <Draggable key={slug} draggableId={slug} index={0}>
                {(prov, snap) => (
                  <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}
                    style={getDraggablePillStyle(snap.isDragging, prov.draggableProps.style, width, height)}>
                    <NamePill name={opportunity.name} />
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
              Drag into your plan
            </div>
          )}
        </Droppable>
      </Card.Content>
      <Card.Content style={contentStyle}>
        <FutureParticipationButton item={opportunity} />
      </Card.Content>
      <Card.Content style={contentStyle}>
        <ViewInExplorerButtonLink match={match} type={EXPLORER_TYPE.OPPORTUNITIES} item={opportunity} size="mini" />
      </Card.Content>
    </Card>
  );
};

export default ProfileOpportunityCard;
