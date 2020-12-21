import React from 'react';
import { connect } from 'react-redux';
import { Message } from 'semantic-ui-react';
import DetailCourseCard from './DetailCourseCard';
import { CourseInstances } from '../../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../../api/opportunity/OpportunityInstanceCollection';
import DetailOpportunityCard from './DetailOpportunityCard';
import { CourseInstance, OpportunityInstance, VerificationRequest } from '../../../../typings/radgrad';
import { RootState } from '../../../../redux/types';

interface DepDetailsWidgetProps {
  selectedCourseInstanceID: string;
  selectedOpportunityInstanceID: string;
  verificationRequests: VerificationRequest[];
}

const mapStateToProps = (state: RootState) => ({
  selectedCourseInstanceID: state.student.degreePlanner.inspector.depInspector.selectedCourseInstanceID,
  selectedOpportunityInstanceID: state.student.degreePlanner.inspector.depInspector.selectedOpportunityInstanceID,
});

const DepDetailsWidget: React.FC<DepDetailsWidgetProps> = ({ selectedCourseInstanceID, selectedOpportunityInstanceID, verificationRequests }) => {
  const courseP = selectedCourseInstanceID !== '';
  const opportunityP = selectedOpportunityInstanceID !== '';
  let instance: (CourseInstance | OpportunityInstance);
  if (courseP) {
    instance = CourseInstances.findDoc(selectedCourseInstanceID);
  } else if (opportunityP) {
    instance = OpportunityInstances.findDoc(selectedOpportunityInstanceID);
  }
  if (!(courseP || opportunityP)) {
    return (
      <Message>
        No course or opportunity selected. Click on a course or opportunity from the degree planner.
      </Message>
    );
  }
  return (courseP ? <DetailCourseCard instance={instance} /> : <DetailOpportunityCard instance={instance} verificationRequests={verificationRequests} />);
};

export default connect(mapStateToProps, null)(DepDetailsWidget);
