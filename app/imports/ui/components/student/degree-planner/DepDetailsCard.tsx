import React from 'react';
import { Message } from 'semantic-ui-react';
import { DegreePlannerStateNames } from '../../../pages/student/StudentDegreePlannerPage';
import { useStickyState } from '../../../utilities/StickyState';
import DetailCourseCard from './DetailCourseCard';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import DetailOpportunityCard from './DetailOpportunityCard';
import { CourseInstance, OpportunityInstance, VerificationRequest } from '../../../../typings/radgrad';

interface DepDetailsWidgetProps {
  verificationRequests: VerificationRequest[];
}

const DepDetailsCard: React.FC<DepDetailsWidgetProps> = ({ verificationRequests }) => {
  const [selectedCourse] = useStickyState(DegreePlannerStateNames.selectedCiID, '');
  const [selectedOpportunity] = useStickyState(DegreePlannerStateNames.selectedOiID, '');
  const courseP = selectedCourse !== '';
  const opportunityP = selectedOpportunity !== '';
  let instance: CourseInstance | OpportunityInstance;
  if (courseP) {
    instance = CourseInstances.findDoc(selectedCourse);
  } else if (opportunityP) {
    instance = OpportunityInstances.findDoc(selectedOpportunity);
  }
  if (!(courseP || opportunityP)) {
    return <Message>No course or opportunity selected. Click on a course or opportunity from the degree planner.</Message>;
  }
  return courseP ? <DetailCourseCard instance={instance as CourseInstance} /> : <DetailOpportunityCard instance={instance as OpportunityInstance} verificationRequests={verificationRequests} />;
};

export default DepDetailsCard;
