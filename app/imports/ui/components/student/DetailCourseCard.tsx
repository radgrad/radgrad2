import * as React from 'react';
import { Button, Card, Icon } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
// import { Droppable, Draggable } from 'react-beautiful-dnd';
import { ICourse, ICourseInstance } from '../../../typings/radgrad'; // eslint-disable-line no-unused-vars
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import IceHeader from '../shared/IceHeader';
import { Courses } from '../../../api/course/CourseCollection';
import FutureParticipation from '../shared/FutureParticipation';
import { buildRouteName } from './DepUtilityFunctions';
import { EXPLORER_TYPE } from '../../../startup/client/routes-config';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { removeItMethod } from '../../../api/base/BaseCollection.methods';

interface IDetailCourseCardProps {
  match: any;
  instance: ICourseInstance;
}

const handleRemove = (event, { value }) => {
  event.preventDefault();
  // console.log(`Remove CI ${value}`);
  const collectionName = CourseInstances.getCollectionName();
  const instance = value;
  removeItMethod.call({ collectionName, instance }, (error) => {
    if (error) {
      console.error(`Remove courseInstance ${instance} failed.`, error);
    } else {
      Swal.fire({
        title: 'Remove succeeded',
        type: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      // TODO: UserInteraction remove planned course.
    }
  });
};

const DetailCourseCard = (props: IDetailCourseCardProps) => {
  // console.log('DetailCourseCard', props);
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const courseTerm = AcademicTerms.findDoc(props.instance.termID);
  const futureP = courseTerm.termNumber >= currentTerm.termNumber;
  const termName = AcademicTerms.getShortName(props.instance.termID);
  const course = Courses.findDoc(props.instance.courseID);
  const textAlignRight: React.CSSProperties = {
    textAlign: 'right',
  };
  const maxWidth: React.CSSProperties = {
    width: '100%',
  };
  return (
    <Card style={maxWidth}>
      <Card.Content>
        <IceHeader ice={props.instance.ice}/>
        <Card.Header><h4>{course.num}: {course.name}</h4></Card.Header>
      </Card.Content>
      <Card.Content>
        {futureP ? (<React.Fragment>
          <p><b>Scheduled:</b> {termName}</p>
          <FutureParticipation item={course} type='courses'/>
          <Button floated="right" basic={true} color="green" value={props.instance._id} onClick={handleRemove}
                  size="tiny">remove</Button>
        </React.Fragment>) : (<p><b>Taken:</b> {termName}</p>)}
      </Card.Content>
      <Card.Content>
        <p style={textAlignRight}><Link to={buildRouteName(props.match, course, EXPLORER_TYPE.COURSES)} target="_blank">View
          in
          Explorer <Icon name="arrow right"/></Link></p>
      </Card.Content>
    </Card>
  );
};

export default withRouter(DetailCourseCard);
