import React from 'react';
import { Container, Segment, Header, Item, Image } from 'semantic-ui-react';
import { IAdvisorLog, IBaseProfile } from '../../../../typings/radgrad';
import { Users } from '../../../../api/user/UserCollection';

export interface IStudentLogWidgetProps {
  advisorLogs: IAdvisorLog[];
}

const getAdvisorImage = (log: IAdvisorLog): IBaseProfile => Users.getProfile(log.advisorID).picture;

const getAdvisorName = (log: IAdvisorLog): IBaseProfile => Users.getProfile(log.advisorID).firstName;

const getDisplayDate = (log: IAdvisorLog): string => {
  const date = log.createdOn;
  return `${date.toDateString()}`;
};

const StudentLogWidget: React.FC<IStudentLogWidgetProps> = ({ advisorLogs }) => (
  <Container id="studentLogWidget">
    <Segment padded>
      <Header as="h4" dividing>ADVISOR MEETING LOG</Header>
      {
        advisorLogs ?
          advisorLogs.map((log) => {
            const advisorImage = getAdvisorImage(log);
            const advisorName = getAdvisorName(log);
            const displayDate = getDisplayDate(log);
            return (
              <Item.Group key={log._id} relaxed divided>
                <Item>
                  <Image size="tiny" src={advisorImage} />
                  <Item.Content>
                    <Item.Header>{displayDate}</Item.Header>
                    <Item.Meta>
                      <span>
                        Results from the meeting with {advisorName}:
                      </span>
                    </Item.Meta>
                    <Item.Description><p>{log.text}</p></Item.Description>
                  </Item.Content>
                </Item>
              </Item.Group>
            );
          })
          :
          <p><i>There are no advisor logs.</i></p>
      }
    </Segment>
  </Container>
);

export default StudentLogWidget;
