import React from 'react';
import { Button, Card } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CourseInstance } from '../../../../typings/radgrad';
import { AcademicTerms } from '../../../../api/academic-term/AcademicTermCollection';
import { DegreePlannerStateNames } from '../../../pages/student/StudentDegreePlannerPage';
import { useStickyState } from '../../../utilities/StickyState';
import { ViewInExplorerButtonLink } from '../../shared/button/ViewInExplorerButtonLink';
import FutureParticipationButton from '../../shared/FutureParticipationButton';
import IceHeader from '../../shared/IceHeader';
import { Courses } from '../../../../api/course/CourseCollection';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { removeItMethod } from '../../../../api/base/BaseCollection.methods';
import { TabbedProfileEntryNames } from './TabbedProfileEntries';
import { cardStyle, contentStyle } from './utilities/styles';

interface DetailCourseCardProps {
  instance: CourseInstance;
}

const handleRemove = (setSelectedCiID, setSelectedProfileTab, match) => (event, { value }) => {
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
  setSelectedCiID('');
  setSelectedProfileTab(TabbedProfileEntryNames.profileCourses);
};

const DetailCourseCard: React.FC<DetailCourseCardProps> = ({ instance  }) => {
  const [, setSelectedCiID] = useStickyState(DegreePlannerStateNames.selectedCiID, '');
  const [, setSelectedProfileTab] = useStickyState(DegreePlannerStateNames.selectedProfileTab, '');
  const match = useRouteMatch();
  const currentTerm = AcademicTerms.getCurrentAcademicTermDoc();
  const courseTerm = AcademicTerms.findDoc(instance.termID);
  const futureP = courseTerm.termNumber >= currentTerm.termNumber;
  const termName = AcademicTerms.getShortName(instance.termID);
  const course = Courses.findDoc(instance.courseID);

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
              <FutureParticipationButton item={course} />
              <Button floated="right" basic color="green" value={instance._id}
                      onClick={handleRemove(setSelectedCiID, setSelectedProfileTab, match)} size="tiny">
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
