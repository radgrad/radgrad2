import React, { useState } from 'react';
import { Button, Grid, Modal } from 'semantic-ui-react';
import { Draggable } from 'react-beautiful-dnd';
import { useRouteMatch } from 'react-router-dom';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { CourseInstance } from '../../../../typings/radgrad';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import RadGradAlert from '../../../utilities/RadGradAlert';
import { ButtonAction } from '../../shared/button/ButtonAction';
import { ViewInExplorerButtonLink } from '../../shared/button/ViewInExplorerButtonLink';
import FutureParticipationButton from '../../shared/FutureParticipationButton';
import IceHeader from '../../shared/IceHeader';
import { cardStyle, DraggableColors, getDraggableCoursePillStyle } from './utilities/styles';
import NamePill from './NamePill';
import { Courses } from '../../../../api/course/CourseCollection';
import RemoveIt from './RemoveIt';

interface CourseInstancePillProps {
  instance: CourseInstance;
  index: number;
  inPast: boolean;
}

const getName = (courseInstance) => Courses.getName(courseInstance.courseID);

const DraggableCourseInstancePill: React.FC<CourseInstancePillProps> = ({ instance, index, inPast }) => {
  const [open, setOpen] = useState(false);
  const course = Courses.findDoc(instance.courseID);
  const courseName = Courses.getName(instance.courseID);
  const termName = AcademicTerms.getShortName(instance.termID);
  const handleRemove = () => {
    const collectionName = CourseInstances.getCollectionName();
    removeItMethod
      .callPromise({ collectionName, instance })
      .then(() => {
        RadGradAlert.success('Remove Succeeded');
      })
      .catch((error) => console.error(`Remove course instance ${instance} failed.`, error));
  };
  const match = useRouteMatch();
  const color = DraggableColors.COURSE;
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <div>
          <Draggable key={instance._id} draggableId={instance._id} index={index}>
            {(prov, snap) => (
              <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} style={getDraggableCoursePillStyle(snap.isDragging, prov.draggableProps.style)}>
                <Grid>
                  {inPast ? (
                    <Grid.Row style={{ paddingTop: 7, paddingBottom: 7 }}>
                      <Grid.Column width={16}>
                        <NamePill name={instance.note} color={color} icon='book' />
                      </Grid.Column>
                    </Grid.Row>
                  ) : (
                    <Grid.Row style={{ paddingTop: 7, paddingBottom: 7 }}>
                      <Grid.Column width={13}>
                        <NamePill name={instance.note} color={color} icon='book' />
                      </Grid.Column>
                      <Grid.Column width={3} verticalAlign="middle" textAlign="left">
                        <RemoveIt collectionName="CourseInstanceCollection" id={instance._id} name={getName(instance)} courseNumber={instance.note} />
                      </Grid.Column>
                    </Grid.Row>
                  )}
                </Grid>
              </div>
            )}
          </Draggable>
        </div>
      }
    >
      <Modal.Header>
        {courseName} <IceHeader ice={instance.ice} />
      </Modal.Header>
      <Modal.Content>
        {inPast ? (
          <p>
            <b>Taken:</b> {termName}
          </p>
        ) : (
          <React.Fragment>
            <p>
              <b>Scheduled:</b> {termName}
            </p>
            <FutureParticipationButton item={course} />
            <ButtonAction onClick={handleRemove} icon="trash alternate outline" label="Remove" style={cardStyle} size="mini" id='remove-course' />
          </React.Fragment>
        )}
        <ViewInExplorerButtonLink match={match} type={EXPLORER_TYPE.COURSES} item={course} size="mini" />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DraggableCourseInstancePill;
