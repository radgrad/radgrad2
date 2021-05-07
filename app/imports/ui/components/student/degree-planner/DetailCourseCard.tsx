import React, { useEffect, useState } from 'react';
import { Button, Card } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getFutureEnrollmentSingleMethod } from '../../../../api/utilities/FutureEnrollment.methods';
import { ENROLLMENT_TYPE, EnrollmentForecast } from '../../../../startup/both/RadGradForecasts';
import { CourseInstance } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { useStickyState } from '../../../utilities/StickyState';
import { ViewInExplorerButtonLink } from '../../shared/button/ViewInExplorerButtonLink';
import IceHeader from '../../shared/IceHeader';
import { Courses } from '../../../../api/course/CourseCollection';
import FutureParticipation from '../../shared/explorer/FutureParticipation';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { cardStyle, contentStyle } from './utilities/styles';

interface DetailCourseCardProps {
  instance: CourseInstance;
}

const handleRemove = (selectCourseInstance, match) => (event, { value }) => {
  event.preventDefault();
  const collectionName = CourseInstances.getCollectionName();
  const instance = value;
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
    }
  });
  selectCourseInstance('');
};

const DetailCourseCard: React.FC<DetailCourseCardProps> = ({ instance  }) => {
  const [selectedCourse] = useStickyState('Planner.selectedCourse', '');
  const match = useRouteMatch();
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const courseTerm = AcademicTerms.findDoc(instance.termID);
  const futureP = courseTerm.termNumber >= currentTerm.termNumber;
  const termName = AcademicTerms.getShortName(instance.termID);
  const course = Courses.findDoc(instance.courseID);
  const [data, setData] = useState<EnrollmentForecast>({});
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    // console.log('check for infinite loop');
    function fetchData() {
      getFutureEnrollmentSingleMethod.callPromise({ id: course._id, type: ENROLLMENT_TYPE.COURSE })
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
  }, [fetched, course._id]);
  let academicTerms = [];
  let scores = [];
  if (data?.enrollment) {
    academicTerms = data.enrollment.map((entry) => AcademicTerms.findDoc(entry.termID));
    scores = data.enrollment.map((entry) => entry.count);
  }

  return (
    <Card.Group itemsPerRow={1}>
      <Card style={cardStyle}>
        <Card.Content style={contentStyle}>
          <IceHeader ice={instance.ice} />
          <Card.Header>
            <h4>
              {course.num}: {course.name}
            </h4>
          </Card.Header>
        </Card.Content>
        <Card.Content style={contentStyle}>
          {futureP ? (
            <React.Fragment>
              <p>
                <b>Scheduled:</b> {termName}
              </p>
              <FutureParticipation academicTerms={academicTerms} scores={scores} narrow />
              <Button floated="right" basic color="green" value={instance._id}
                      onClick={handleRemove(selectedCourse, match)} size="tiny">
                Remove
              </Button>
            </React.Fragment>
          ) : (
            <p>
              <b>Taken:</b> {termName}
            </p>
          )}
        </Card.Content>
        <Card.Content style={contentStyle}>
          <ViewInExplorerButtonLink match={match} type={EXPLORER_TYPE.COURSES} item={course} />
        </Card.Content>
      </Card>
    </Card.Group>
  );
};

export default DetailCourseCard;
