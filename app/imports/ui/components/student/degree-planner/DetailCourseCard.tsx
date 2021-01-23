import _ from 'lodash';
import React from 'react';
import { Button, Card, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Link, useRouteMatch } from 'react-router-dom';
import Swal from 'sweetalert2';
import { RadGradProperties } from '../../../../api/radgrad/RadGradProperties';
import { CourseScoreboard } from '../../../../startup/client/collections';
import { AcademicTerm, CourseInstance, UserInteractionDefine } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import IceHeader from '../../shared/IceHeader';
import { Courses } from '../../../../api/course/CourseCollection';
import FutureParticipation from '../../shared/explorer/FutureParticipation';
import { buildRouteName } from './DepUtilityFunctions';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { degreePlannerActions } from '../../../../redux/student/degree-planner';
import { getUsername } from '../../shared/utilities/router';
import { UserInteractionsTypes } from '../../../../api/analytic/UserInteractionsTypes';
import { userInteractionDefineMethod } from '../../../../api/analytic/UserInteractionCollection.methods';

interface DetailCourseCardProps {
  instance: CourseInstance;
  selectCourseInstance: (courseInstanceID: string) => any;
}

const mapDispatchToProps = (dispatch) => ({
  selectCourseInstance: (courseInstanceID) => dispatch(degreePlannerActions.selectCourseInstance(courseInstanceID)),
});

const handleRemove = (selectCourseInstance, match) => (event, { value }) => {
  event.preventDefault();
  const collectionName = CourseInstances.getCollectionName();
  const instance = value;
  const instanceObject: CourseInstance = CourseInstances.findDoc({ _id: instance });
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
      const academicTerm: AcademicTerm = AcademicTerms.findDoc({ _id: instanceObject.termID });
      const interactionData: UserInteractionDefine = {
        username: getUsername(match),
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
  selectCourseInstance('');
};

const DetailCourseCard: React.FC<DetailCourseCardProps> = ({ instance, selectCourseInstance }) => {
  const match = useRouteMatch();
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const courseTerm = AcademicTerms.findDoc(instance.termID);
  const futureP = courseTerm.termNumber >= currentTerm.termNumber;
  const termName = AcademicTerms.getShortName(instance.termID);
  const course = Courses.findDoc(instance.courseID);
  const textAlignRight: React.CSSProperties = {
    textAlign: 'right',
  };

  const quarter = RadGradProperties.getQuarterSystem();
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
    const id = `${course._id} ${term._id}`;
    const score = CourseScoreboard.find({ _id: id }).fetch() as { count: number }[];
    if (score.length > 0) {
      scores.push(score[0].count);
    } else {
      scores.push(0);
    }
  });

  return (
    <Card.Group itemsPerRow={1}>
      <Card>
        <Card.Content>
          <IceHeader ice={instance.ice} />
          <Card.Header>
            <h4>
              {course.num}: {course.name}
            </h4>
          </Card.Header>
        </Card.Content>
        <Card.Content>
          {futureP ? (
            <React.Fragment>
              <p>
                <b>Scheduled:</b> {termName}
              </p>
              <FutureParticipation academicTerms={academicTerms} scores={scores} />
              <Button floated="right" basic color="green" value={instance._id} onClick={handleRemove(selectCourseInstance, match)} size="tiny">
                Remove
              </Button>
            </React.Fragment>
          ) : (
            <p>
              <b>Taken:</b> {termName}
            </p>
          )}
        </Card.Content>
        <Card.Content>
          <p style={textAlignRight}>
            <Link to={buildRouteName(match, course, EXPLORER_TYPE.COURSES)} rel="noopener noreferrer" target="_blank">
              View in Explorer <Icon name="arrow right" />
            </Link>
          </p>
        </Card.Content>
      </Card>
    </Card.Group>
  );
};

const DetailCourseCardConnected = connect(null, mapDispatchToProps)(DetailCourseCard);
export default DetailCourseCardConnected;
