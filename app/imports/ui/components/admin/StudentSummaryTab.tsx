import React, { useState } from 'react';
import { Accordion, Icon, Grid } from 'semantic-ui-react';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import StudentTimelineModal from './StudentTimelineModal';
import { IBehavior } from '../../../typings/radgrad';

interface IStudentSummaryTabProps {
  startDate: string;
  endDate: string;
  behaviors: IBehavior[];
  interactionsByUser: object;
}

const StudentSummaryTab = (props: IStudentSummaryTabProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

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
  const paddingStyle = {
    padding: 2,
  };
  return (
    <div>
      {
        props.behaviors.map((b, index) => {
          const key = `${b.type}-${index}`;
          return (
            <Accordion key={key}>
              <div>
                <Accordion.Title
                  active={activeIndex === index}
                  index={index}
                  onClick={handleClick}
                >
                  <Grid>
                    <Grid.Column width={1}>
                      <Icon name="dropdown" />
                    </Grid.Column>
                    <Grid.Column width={4}>
                      Behavior:
                      <div style={paddedLabelStyle}>{b.type}</div>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      Users:
                      <div style={paddedLabelStyle}>{b.count}</div>
                      <div style={paddedLabelStyle}>{`(${percent(b.count)} %)`}</div>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      Description:
                      <div style={paddedLabelStyle}>{b.description}</div>
                    </Grid.Column>
                  </Grid>
                </Accordion.Title>
                <Accordion.Content
                  active={activeIndex === index}
                >
                  <Grid stackable padded>
                    {b.users.map((u) => (
                      <Grid.Column width={3} style={paddingStyle} key={u}>
                        <StudentTimelineModal
                          username={u}
                          startDate={props.startDate}
                          endDate={props.endDate}
                          interactions={props.interactionsByUser[u]}
                        />
                      </Grid.Column>
                    ))}
                  </Grid>
                </Accordion.Content>
              </div>
            </Accordion>
          );
        })
      }
    </div>
  );
};

export default StudentSummaryTab;
