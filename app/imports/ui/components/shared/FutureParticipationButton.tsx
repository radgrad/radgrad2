import React, { useEffect, useState } from 'react';
import { Modal } from 'semantic-ui-react';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Courses } from '../../../api/course/CourseCollection';
import { getFutureEnrollmentSingleMethod } from '../../../api/utilities/FutureEnrollment.methods';
import { ENROLLMENT_TYPE, EnrollmentForecast } from '../../../startup/both/RadGradForecasts';
import { Course, Opportunity } from '../../../typings/radgrad';
import { ButtonAction } from './button/ButtonAction';
import FutureParticipation from './explorer/FutureParticipation';

interface FutureParticipationButtonProps {
  item: Course | Opportunity;
}

const FutureParticipationButton: React.FC<FutureParticipationButtonProps> = ({ item }) => {
  const isCourse = Courses.isDefined(item._id);
  const type = isCourse ? ENROLLMENT_TYPE.COURSE : ENROLLMENT_TYPE.OPPORTUNITY;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<EnrollmentForecast>({});
  const [fetched, setFetched] = useState(false);
  useEffect(() => {
    // console.log('check for infinite loop');
    function fetchData() {
      getFutureEnrollmentSingleMethod.callPromise({ id: item._id, type })
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
  }, [fetched, item._id, type]);
  let academicTerms = [];
  let scores = [];
  if (data?.enrollment) {
    academicTerms = data.enrollment.map((entry) => AcademicTerms.findDoc(entry.termID));
    scores = data.enrollment.map((entry) => entry.count);
  }

  return (
    <Modal key={`${item._id}-forecast-modal`}
           onClose={() => setOpen(false)}
           onOpen={() => setOpen(true)}
           open={open}
           trigger={<ButtonAction color='green' key={`${item._id}-view-button`} label='View Future Participation' onClick={() => setOpen(true)} size='mini' />}>
      <Modal.Header>Future Participation for {item.name}</Modal.Header>
      <Modal.Content>
        <FutureParticipation academicTerms={academicTerms} scores={scores} />
      </Modal.Content>
      <Modal.Actions>
        <ButtonAction color='green' onClick={() => setOpen(false)} label='CLOSE' icon='close'/>
      </Modal.Actions>
    </Modal>
  );
};

export default FutureParticipationButton;
