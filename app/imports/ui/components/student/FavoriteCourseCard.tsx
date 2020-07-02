import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { withTracker } from 'meteor/react-meteor-data';
import { ICourse, ICourseInstance } from '../../../typings/radgrad';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import IceHeader from '../shared/IceHeader';
import { makeCourseICE } from '../../../api/ice/IceProcessor';
import { getInspectorDraggablePillStyle } from '../shared/StyleFunctions';
import NamePill from '../shared/NamePill';
import FutureParticipation from '../shared/FutureParticipation';
import { EXPLORER_TYPE } from '../../../startup/client/route-constants';
import { buildRouteName } from './DepUtilityFunctions';

interface IFavoriteCourseCardProps {
  match: any;
  course: ICourse;
  studentID: string;
  instances: ICourseInstance[];
}

const FavoriteCourseCard = (props: IFavoriteCourseCardProps) => {
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
        <FutureParticipation item={props.course} type="courses" />
      </Card.Content>
      <Card.Content>
        <p style={textAlignRight}>
          <Link
            to={buildRouteName(props.match, props.course, EXPLORER_TYPE.COURSES)}
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

export default withRouter(withTracker((props) => {
  const instances = CourseInstances.find({
    studentID: props.studentID,
    courseID: props.course._id,
  }).fetch();
  return {
    instances,
  };
})(FavoriteCourseCard));
