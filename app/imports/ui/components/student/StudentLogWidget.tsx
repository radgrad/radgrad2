import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Segment, Header, Item, Image } from 'semantic-ui-react';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { IAdvisorLog, IBaseProfile } from '../../../typings/radgrad'; // eslint-disable-line
import { getUserIdFromRoute } from '../shared/RouterHelperFunctions';
import { Users } from '../../../api/user/UserCollection';

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

class StudentLogWidget extends React.Component<IStudentLogWidgetProps> {
  constructor(props) {
    super(props);
  }

  private getUserIdFromRoute = (): string => getUserIdFromRoute(this.props.match);

  private getAdvisorLogs = (): IAdvisorLog[] => AdvisorLogs.findNonRetired({ studentID: this.getUserIdFromRoute() }, { sort: { createdOn: -1 } });

  public getAdvisorImage = (log: IAdvisorLog): IBaseProfile => Users.getProfile(log.advisorID).picture;

  public getAdvisorName = (log: IAdvisorLog): IBaseProfile => Users.getProfile(log.advisorID).firstName;

  public displayDate = (log: IAdvisorLog): string => {
    const date = log.createdOn;
    return `${date.toDateString()}`;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const advisorLogs = this.getAdvisorLogs();

    return (
      <Container>
        <Segment padded={true}>
          <Header as="h4" dividing={true}>ADVISOR MEETING LOG</Header>
          {
            advisorLogs ?
              advisorLogs.map((log, index) => {
                const advisorImage = this.getAdvisorImage(log);
                const advisorName = this.getAdvisorName(log);
                const displayDate = this.displayDate(log);
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
  }
}

export default withRouter(StudentLogWidget);
