import React, { useEffect, useState } from 'react';
import { Card } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { getFutureEnrollmentSingleMethod } from '../../../../api/utilities/FutureEnrollment.methods';
import { AcademicTerm, Opportunity, OpportunityInstance } from '../../../../typings/radgrad';
import { ViewInExplorerButtonLink } from '../../shared/button/ViewInExplorerButtonLink';
import IceHeader from '../../shared/IceHeader';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import FutureParticipation from '../../shared/explorer/FutureParticipation';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { cardStyle, contentStyle, getInspectorDraggablePillStyle } from './utilities/styles';
import NamePill from './NamePill';
import { ENROLLMENT_TYPE, EnrollmentForecast } from '../../../../startup/both/RadGradForecasts';

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
  const [data, setData] = useState<EnrollmentForecast>({});
  const [fetched, setFetched] = useState(false);
  useEffect(() => {
    // console.log('check for infinite loop');
    function fetchData() {
      getFutureEnrollmentSingleMethod.callPromise({ id: opportunity._id, type: ENROLLMENT_TYPE.OPPORTUNITY })
        .then((result) => setData(result))
        .catch((error) => {
          console.error(error);
          setData({});
        });
    }

    // Only fetch data if it hasn't been fetched before.
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  }, [fetched, opportunity._id]);

  // console.log(data);
  const match = useRouteMatch();
  const instances = opportunityInstances.filter((i) => i.opportunityID === opportunity._id);
  const terms: AcademicTerm[] = instances.map((i) => AcademicTerms.findDoc(i.termID));
  // Sort by ascending order
  terms.sort((a, b) => a.year - b.year);
  const termNames = terms.map((t) => AcademicTerms.getShortName(t._id)).join(', ');
  const slug = Slugs.findDoc(opportunity.slugID).name;
  const droppableID = `${opportunity._id}`;
  let academicTerms = [];
  let scores = [];
  if (data?.enrollment) {
    academicTerms = data.enrollment.map((entry) => AcademicTerms.findDoc(entry.termID));
    scores = data.enrollment.map((entry) => entry.count);
  }

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
                       style={getInspectorDraggablePillStyle(snap.isDragging, prov.draggableProps.style)}>
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
        <FutureParticipation academicTerms={academicTerms} scores={scores} narrow />
       </Card.Content>
       <Card.Content style={contentStyle}>
        <ViewInExplorerButtonLink match={match} type={EXPLORER_TYPE.OPPORTUNITIES} item={opportunity} size="mini" />
       </Card.Content>
    </Card>
  );
};

export default ProfileOpportunityCard;
