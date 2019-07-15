import * as React from 'react';
import { Segment, Grid, Header } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { Ice } from '../../../typings/radgrad'; // eslint-disable-line
import MenuIceCircle from '../shared/MenuIceCircle';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { getUsername } from '../shared/RouterHelperFunctions';
import StudentIceColumn from './StudentIceColumn';

interface IStudentIceWidgetProps {
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
      opportunity: string;
    }
  };
}

class StudentIceWidget extends React.Component<IStudentIceWidgetProps> {
  constructor(props) {
    super(props);
  }

  private getUsername = (): string => getUsername(this.props.match);

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const innovationColumnStyle = { paddingLeft: 0 };
    const experienceColumnStyle = { paddingRight: 0 };

    const username = this.getUsername();
    const earnedICE: Ice = StudentProfiles.getEarnedICE(username);
    const projectedICE: Ice = StudentProfiles.getProjectedICE(username);

    return (
      <Segment padded={true}>
        <Header as="h4" dividing={true}>YOUR ICE POINTS</Header>
        <Grid stackable={true} columns="equal" celled="internally">
          <Grid.Column style={innovationColumnStyle}>
            <Segment basic={true}>
              <MenuIceCircle earned={earnedICE.i} planned={projectedICE.i} type="innov"/>
              <Header as="h3" textAlign="center" className="ice-innovation-color">INNOVATION</Header>
              <StudentIceColumn type="Innovation"/>
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment basic={true}>
              <MenuIceCircle earned={earnedICE.c} planned={projectedICE.c} type="comp"/>
              <Header as="h3" textAlign="center" className="ice-competency-color">COMPETENCY</Header>
              <StudentIceColumn type="Competency"/>
            </Segment>
          </Grid.Column>

          <Grid.Column style={experienceColumnStyle}>
            <Segment basic={true}>
              <MenuIceCircle earned={earnedICE.e} planned={projectedICE.e} type="exp"/>
              <Header as="h3" textAlign="center" className="ice-experience-color">Experience</Header>
              <StudentIceColumn type="Experience"/>
            </Segment>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default withRouter(StudentIceWidget);
