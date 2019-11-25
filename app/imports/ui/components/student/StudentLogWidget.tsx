import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Segment, Header, Item, Image } from 'semantic-ui-react';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { IAdvisorLog, IBaseProfile } from '../../../typings/radgrad'; // eslint-disable-line
import { getUserIdFromRoute } from '../shared/RouterHelperFunctions';
import { Users } from '../../../api/user/UserCollection';
import { studentLogWidget } from './student-widget-names';

interface IStudentLogWidgetProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const getAdvisorLogs = (props: IStudentLogWidgetProps): IAdvisorLog[] => AdvisorLogs.findNonRetired({ studentID: getUserIdFromRoute(props.match) }, { sort: { createdOn: -1 } });

const getAdvisorImage = (log: IAdvisorLog): IBaseProfile => Users.getProfile(log.advisorID).picture;

const getAdvisorName = (log: IAdvisorLog): IBaseProfile => Users.getProfile(log.advisorID).firstName;

const getDisplayDate = (log: IAdvisorLog): string => {
  const date = log.createdOn;
  return `${date.toDateString()}`;
};


const StudentLogWidget = (props: IStudentLogWidgetProps) => {
  const advisorLogs = getAdvisorLogs(props);

  return (
    <Container id={`${studentLogWidget}`}>
      <Segment padded={true}>
        <Header as="h4" dividing={true}>ADVISOR MEETING LOG</Header>
        {
          advisorLogs ?
            advisorLogs.map((log, index) => {
              const advisorImage = getAdvisorImage(log);
              const advisorName = getAdvisorName(log);
              const displayDate = getDisplayDate(log);
              return (
                <Item.Group key={index} relaxed={true} divided={true}>
                  <Item>
                    <Image size="tiny" src={advisorImage}/>
                    <Item.Content>
                      <Item.Header>{displayDate}</Item.Header>
                      <Item.Meta><span>Results from the meeting with {advisorName}: </span></Item.Meta>
                      <Item.Description><p>{log.text}</p></Item.Description>
                    </Item.Content>
                  </Item>
                </Item.Group>);
            })
            :
            <p><i>There are no advisor logs.</i></p>
        }
      </Segment>
    </Container>
  );
};

export default withRouter(StudentLogWidget);
