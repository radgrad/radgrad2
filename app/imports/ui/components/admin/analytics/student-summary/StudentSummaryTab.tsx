import React, { useState } from 'react';
import { Accordion, Icon, Grid } from 'semantic-ui-react';
import { StudentProfiles } from '../../../../../api/user/StudentProfileCollection';
import StudentTimelineModal from './StudentTimelineModal';
import { StudentSummaryBehaviorCategory } from './utilities/student-summary';
import { IAdminAnalyticsUserInteraction } from '../../../../../redux/admin/analytics/reducers';

interface StudentSummaryTabProps {
  startDate: string;
  endDate: string;
  behaviors: StudentSummaryBehaviorCategory[];
  interactionsByUser: IAdminAnalyticsUserInteraction;
}

const StudentSummaryTab: React.FC<StudentSummaryTabProps> = ({ startDate, endDate, behaviors, interactionsByUser }) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const percent = (count) => ((count / StudentProfiles.find({ isAlumni: false }).fetch().length) * 100).toFixed(0);

  const paddedLabelStyle = {
    display: 'inline',
    color: '#6FBE44',
    paddingLeft: 5,
  };
  return (
    <div>
      {
        behaviors.map((behavior, index) => (
          <Accordion key={behavior.type}>
            <div>
              <Accordion.Title active={activeIndex === index} index={index} onClick={handleClick}>
                <Grid>
                  <Grid.Column width={1}>
                    <Icon name="dropdown" />
                  </Grid.Column>
                  <Grid.Column width={4}>
                    Behavior:
                    <div style={paddedLabelStyle}>{behavior.type}</div>
                  </Grid.Column>
                  <Grid.Column width={3}>
                    Users:
                    <div style={paddedLabelStyle}>{behavior.count}</div>
                    <div style={paddedLabelStyle}>{`(${percent(behavior.count)}%)`}</div>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    Description:
                    <div style={paddedLabelStyle}>{behavior.description}</div>
                  </Grid.Column>
                </Grid>
              </Accordion.Title>
              <Accordion.Content active={activeIndex === index}>
                <Grid stackable padded>
                  {behavior.users.map((user) => (
                    <StudentTimelineModal
                      key={user}
                      username={user}
                      startDate={startDate}
                      endDate={endDate}
                      interactions={interactionsByUser[user]}
                    />
                  ))}
                </Grid>
              </Accordion.Content>
            </div>
          </Accordion>
        ))
      }
    </div>
  );
};

export default StudentSummaryTab;
