import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { Link, useRouteMatch } from 'react-router-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { RadGradProperties } from '../../../../api/radgrad/RadGradProperties';
import { OpportunityScoreboard } from '../../../../startup/client/collections';
import { AcademicTerm, Opportunity, OpportunityInstance } from '../../../../typings/radgrad';
import IceHeader from '../../shared/IceHeader';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import FutureParticipation from '../../shared/explorer/FutureParticipation';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { getInspectorDraggablePillStyle } from './utilities/styles';
import NamePill from './NamePill';
import { buildRouteName } from './DepUtilityFunctions';

interface ProfileOpportunityCardProps {
  opportunity: Opportunity;
  studentID: string;
  opportunityInstances: OpportunityInstance[];
}

const ProfileOpportunityCard: React.FC<ProfileOpportunityCardProps> = ({ opportunity, opportunityInstances, studentID }) => {
  const match = useRouteMatch();
  const instances = _.filter(opportunityInstances, (i) => i.opportunityID === opportunity._id);
  const terms: AcademicTerm[] = _.map(instances, (i) => AcademicTerms.findDoc(i.termID));
  // Sort by ascending order
  terms.sort((a, b) => a.year - b.year);
  const termNames = _.map(terms, (t) => AcademicTerms.getShortName(t._id)).join(', ');
  const slug = Slugs.findDoc(opportunity.slugID).name;
  const textAlignRight: React.CSSProperties = {
    textAlign: 'right',
  };
  const droppableID = `${opportunity._id}`;

  const quarter = RadGradProperties.getQuarterSystem();
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const numTerms = quarter ? 12 : 9;
  const academicTerms = AcademicTerms.findNonRetired(
    { termNumber: { $gte: currentTerm.termNumber } },
    {
      sort: { termNumber: 1 },
      limit: numTerms,
    },
  );
  const scores = [];
  _.forEach(academicTerms, (term: AcademicTerm) => {
    const id = `${opportunity._id} ${term._id}`;
    const score = OpportunityScoreboard.find({ _id: id }).fetch() as { count: number }[];
    if (score.length > 0) {
      scores.push(score[0].count);
    } else {
      scores.push(0);
    }
  });

  return (
    <Card>
      <Card.Content>
        <IceHeader ice={opportunity.ice} />
        <Card.Header>{opportunity.name}</Card.Header>
      </Card.Content>
      <Card.Content>
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
                  <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={getInspectorDraggablePillStyle(snap.isDragging, prov.draggableProps.style)}>
                    <NamePill name={opportunity.name} />
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Card.Content>
      <Card.Content>
        <FutureParticipation academicTerms={academicTerms} scores={scores} />
      </Card.Content>
      <Card.Content>
        <p style={textAlignRight}>
          <Link to={buildRouteName(match, opportunity, EXPLORER_TYPE.OPPORTUNITIES)} rel="noopener noreferrer" target="_blank">
            View in Explorer <Icon name="arrow right" />
          </Link>
        </p>
      </Card.Content>
    </Card>
  );
};

export default ProfileOpportunityCard;