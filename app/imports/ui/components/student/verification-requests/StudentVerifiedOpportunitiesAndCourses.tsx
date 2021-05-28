import React from 'react';
import { Grid, Menu, Segment, Tab } from 'semantic-ui-react';
import { CourseInstance, OpportunityInstance } from '../../../../typings/radgrad';
import RadGradHeader from '../../shared/RadGradHeader';
import StudentVerifiedCourseItem from '../shared/StudentVerifiedCourseItem';
import StudentVerifiedOpportunityItem from './StudentVerifiedOpportunityItem';

interface StudentVerifiedOpportunitiesAndCoursesProps {
  verifiedOpportunityInstances: OpportunityInstance[];
  verifiedCourseInstances: CourseInstance[];
}

const StudentVerifiedOpportunitiesAndCourses: React.FC<StudentVerifiedOpportunitiesAndCoursesProps> = ({
  verifiedCourseInstances,
  verifiedOpportunityInstances,
}) => {
  const panes = [
    {
      menuItem: <Menu.Item key='verified-opportunity-menu-item'><RadGradHeader title='verified opportunities' count={verifiedOpportunityInstances.length}
        icon='lightbulb outline' /></Menu.Item>,
      render: () => (
        <Tab.Pane key="Verified-Opportunities-pane">
          <Grid stackable>
            {verifiedOpportunityInstances.map((oi) => (
              <StudentVerifiedOpportunityItem opportunityInstance={oi} key={oi._id} />
            ))}
          </Grid>
        </Tab.Pane>
      ),
    },
    {
      menuItem: (<Menu.Item key='verified-course-menu-item'>
        <RadGradHeader title='verified courses' count={verifiedCourseInstances.length} icon='book' />
      </Menu.Item>),
      render: () => (
        <Tab.Pane key="Verified-Courses-pane">
          <Grid stackable>
            {verifiedCourseInstances.map((ci) => (
              <StudentVerifiedCourseItem courseInstance={ci} key={ci._id} />
            ))}
          </Grid>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Segment>
      <Tab panes={panes} defaultActiveIndex={0} />
    </Segment>
  );
};

export default StudentVerifiedOpportunitiesAndCourses;
