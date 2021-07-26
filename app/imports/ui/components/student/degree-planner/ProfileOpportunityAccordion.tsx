import React, { useState } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { AcademicTerm, Opportunity, OpportunityInstance } from '../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { ViewInExplorerButtonLink } from '../../shared/button/ViewInExplorerButtonLink';
import FutureParticipationButton from '../../shared/FutureParticipationButton';
import IceHeader from '../../shared/IceHeader';
import NamePill from './NamePill';
import { buttonStyle, DraggableColors, getDraggableOpportunityPillStyle } from './utilities/styles';

interface ProfileOpportunityAccordionProps {
  studentID: string;
  opportunity: Opportunity;
  opportunityInstances: OpportunityInstance[];
}

const ProfileOpportunityAccordion: React.FC<ProfileOpportunityAccordionProps> = ({ studentID, opportunity, opportunityInstances }) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  const match = useRouteMatch();
  const instances = opportunityInstances.filter((i) => i.opportunityID === opportunity._id);
  const terms: AcademicTerm[] = instances.map((i) => AcademicTerms.findDoc(i.termID));
  // Sort by ascending order
  terms.sort((a, b) => a.year - b.year);
  const termNames = terms.map((t) => AcademicTerms.getShortName(t._id)).join(', ');
  const slug = Slugs.findDoc(opportunity.slugID).name;
  const droppableID = `${opportunity._id}`;
  const color = DraggableColors.OPPORTUNITY;
  return (
    <Accordion fluid styled>
      <Accordion.Title active={active} onClick={handleClick}>
        <IceHeader ice={opportunity.ice} />
        {opportunity.name}
        <Icon name="dropdown" />
      </Accordion.Title>
      <Accordion.Content active={active}>
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
                  <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={getDraggableOpportunityPillStyle(snap.isDragging, prov.draggableProps.style)}>
                    <NamePill name={opportunity.name} color={color} />
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
              Drag into your plan
            </div>
          )}
        </Droppable>
        <FutureParticipationButton item={opportunity} style={buttonStyle} />
        <ViewInExplorerButtonLink match={match} type={EXPLORER_TYPE.OPPORTUNITIES} item={opportunity} size="mini"  style={buttonStyle}  />
      </Accordion.Content>
    </Accordion>
  );
};

export default ProfileOpportunityAccordion;
