import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { Link, useRouteMatch } from 'react-router-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { withTracker } from 'meteor/react-meteor-data';
import { RadGradProperties } from '../../../../api/radgrad/RadGradProperties';
import { CourseScoreboard } from '../../../../startup/client/collections';
import { IAcademicTerm, ICourse, ICourseInstance } from '../../../../typings/radgrad';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { Slugs } from '../../../../api/slug/SlugCollection';
import IceHeader from '../../shared/IceHeader';
import { makeCourseICE } from '../../../../api/ice/IceProcessor';
import { getInspectorDraggablePillStyle } from '../../shared/academic-plan/utilities/styles';
import NamePill from '../../shared/academic-plan/NamePill';
import FutureParticipation from '../../shared/explorer/FutureParticipation';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { buildRouteName } from './DepUtilityFunctions';

interface IFavoriteCourseCardProps {
  course: ICourse;
  studentID: string;
  instances: ICourseInstance[];
}

const FavoriteCourseCard = (props: IFavoriteCourseCardProps) => {
  const match = useRouteMatch();
  const instances = props.instances;
  const terms = _.map(instances, (i) => AcademicTerms.findDoc(i.termID));
  // Sort by ascending order
  terms.sort((a, b) => a.year - b.year);
  const termNames = _.map(terms, (t) => AcademicTerms.getShortName(t._id)).join(', ');
  const slug = Slugs.findDoc(props.course.slugID).name;
  const ice = instances.length > 0 ? makeCourseICE(slug, instances[instances.length - 1].grade) : { i: 0, c: 0, e: 0 };
  const textAlignRight: React.CSSProperties = {
    textAlign: 'right',
  };
  const droppableID = `${props.course._id}`;

  const quarter = RadGradProperties.getQuarterSystem();
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const numTerms = quarter ? 12 : 9;
  const academicTerms = AcademicTerms.findNonRetired({ termNumber: { $gte: currentTerm.termNumber } }, {
    sort: { termNumber: 1 },
    limit: numTerms,
  });
  const scores = [];
  _.forEach(academicTerms, (term: IAcademicTerm) => {
    const id = `${props.course._id} ${term._id}`;
    const score = CourseScoreboard.find({ _id: id }).fetch() as { count: number }[];
    if (score.length > 0) {
      scores.push(score[0].count);
    } else {
      scores.push(0);
    }
  });

  return (
    <Card>
      <Card.Content>
        <IceHeader ice={ice} />
        <Card.Header>
          <h4>
            {props.course.num}: {props.course.name}
          </h4>
        </Card.Header>
      </Card.Content>
      <Card.Content>
        {instances.length > 0 ?
          (
            <React.Fragment>
              <b>Scheduled:</b> {termNames}
            </React.Fragment>
          )
          : <b>Not In Plan (Drag to move)</b>}
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
                    <NamePill name={props.course.num} />
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
          <Link
            to={buildRouteName(match, props.course, EXPLORER_TYPE.COURSES)}
            target="_blank"
            rel="noopener noreferrer"
          >
            View in Explorer <Icon name="arrow right" />
          </Link>
        </p>
      </Card.Content>
    </Card>
  );
};

export default withTracker((props) => {
  const instances = CourseInstances.findNonRetired({
    studentID: props.studentID,
    courseID: props.course._id,
  });
  return {
    instances,
  };
})(FavoriteCourseCard);
