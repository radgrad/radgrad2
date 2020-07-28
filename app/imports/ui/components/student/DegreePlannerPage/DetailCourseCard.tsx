import React from 'react';
import { Button, Card, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  IAcademicTerm,
  ICourseInstance,
  IUserInteractionDefine,
} from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import IceHeader from '../../shared/IceHeader';
import { Courses } from '../../../../api/course/CourseCollection';
import FutureParticipation from '../../shared/FutureParticipation';
import { buildRouteName } from './DepUtilityFunctions';
import { EXPLORER_TYPE } from '../../../../startup/client/route-constants';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { degreePlannerActions } from '../../../../redux/student/degree-planner';
import { getUsername } from '../../shared/RouterHelperFunctions';
import { UserInteractionsTypes } from '../../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../../api/analytic/UserInteractionCollection.methods';

interface IDetailCourseCardProps {
  match: any;
  instance: ICourseInstance;
  // eslint-disable-next-line react/no-unused-prop-types
  selectCourseInstance: (courseInstanceID: string) => any;
}

const mapDispatchToProps = (dispatch) => ({
  selectCourseInstance: (courseInstanceID) => dispatch(degreePlannerActions.selectCourseInstance(courseInstanceID)),
});

const handleRemove = (props: IDetailCourseCardProps) => (event, { value }) => {
  event.preventDefault();
  const collectionName = CourseInstances.getCollectionName();
  const instance = value;
  const instanceObject: ICourseInstance = CourseInstances.findDoc({ _id: instance });
  const slugName = CourseInstances.getCourseSlug(instance);
  removeItMethod.call({ collectionName, instance }, (error) => {
    if (error) {
      console.error(`Remove courseInstance ${instance} failed.`, error);
    } else {
      Swal.fire({
        title: 'Remove succeeded',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      const academicTerm: IAcademicTerm = AcademicTerms.findDoc({ _id: instanceObject.termID });
      const interactionData: IUserInteractionDefine = {
        username: getUsername(props.match),
        type: UserInteractionsTypes.REMOVECOURSE,
        typeData: [academicTerm.term, academicTerm.year, slugName],
      };
      userInteractionDefineMethod.call(interactionData, (userInteractionError) => {
        if (userInteractionError) {
          console.error('Error creating UserInteraction.', userInteractionError);
        }
      });
    }
  });
  props.selectCourseInstance('');
};

const DetailCourseCard = (props: IDetailCourseCardProps) => {
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const courseTerm = AcademicTerms.findDoc(props.instance.termID);
  const futureP = courseTerm.termNumber >= currentTerm.termNumber;
  const termName = AcademicTerms.getShortName(props.instance.termID);
  const course = Courses.findDoc(props.instance.courseID);
  const textAlignRight: React.CSSProperties = {
    textAlign: 'right',
  };
  return (
    <Card.Group itemsPerRow={1}>
      <Card>
        <Card.Content>
          <IceHeader ice={props.instance.ice} />
          <Card.Header>
            <h4>
              {course.num}: {course.name}
            </h4>
          </Card.Header>
        </Card.Content>
        <Card.Content>
          {futureP ?
            (
              <React.Fragment>
                <p>
                  <b>Scheduled:</b> {termName}
                </p>
                <FutureParticipation item={course} type="courses" />
                <Button
                  floated="right"
                  basic
                  color="green"
                  value={props.instance._id}
                  onClick={handleRemove(props)}
                  size="tiny"
                >
                  Remove
                </Button>
              </React.Fragment>
            )
            :
            (
              <p>
                <b>Taken:</b> {termName}
              </p>
            )}
        </Card.Content>
        <Card.Content>
          <p style={textAlignRight}>
            <Link
              to={buildRouteName(props.match, course, EXPLORER_TYPE.COURSES)}
              rel="noopener noreferrer"
              target="_blank"
            >
              View in Explorer <Icon name="arrow right" />
            </Link>
          </p>
        </Card.Content>
      </Card>
    </Card.Group>
  );
};

const DetailCourseCardCon = withRouter(DetailCourseCard);
const DetailCourseCardConnected = connect(null, mapDispatchToProps)(DetailCourseCardCon);
export default DetailCourseCardConnected;
