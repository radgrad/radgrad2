import React from 'react';
import { Segment, Grid, Header } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Ice } from '../../../typings/radgrad';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { getUsername } from '../shared/RouterHelperFunctions';
import StudentIceColumn from './StudentIceColumn';
import { studentIceWidget } from './student-widget-names';
import PageIceCircle from './PageIceCircle';

interface IStudentIceWidgetProps {
  earnedICE: Ice;
  projectedICE: Ice;
}

const StudentIceWidget = (props: IStudentIceWidgetProps) => {
  const innovationColumnStyle = { paddingLeft: 0 };
  const experienceColumnStyle = { paddingRight: 0 };
  const { earnedICE, projectedICE } = props;

  return (
    <Segment padded id={`${studentIceWidget}`}>
      <Header as="h4" dividing>YOUR ICE POINTS</Header>
      <Grid stackable columns="equal" celled="internally">
        <Grid.Column style={innovationColumnStyle}>
          <Segment basic>
            <PageIceCircle earned={earnedICE.i} planned={projectedICE.i} type="innov" />
            <Header as="h3" textAlign="center" className="ice-innovation-color">INNOVATION</Header>
            <StudentIceColumn type="Innovation" />
          </Segment>
        </Grid.Column>

        <Grid.Column>
          <Segment basic>
            <PageIceCircle earned={earnedICE.c} planned={projectedICE.c} type="comp" />
            <Header as="h3" textAlign="center" className="ice-competency-color">COMPETENCY</Header>
            <StudentIceColumn type="Competency" />
          </Segment>
        </Grid.Column>

        <Grid.Column style={experienceColumnStyle}>
          <Segment basic>
            <PageIceCircle earned={earnedICE.e} planned={projectedICE.e} type="exp" />
            <Header as="h3" textAlign="center" className="ice-experience-color">Experience</Header>
            <StudentIceColumn type="Experience" />
          </Segment>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

const StudentIceWidgetCon = withTracker(({ match }) => {
  const username = getUsername(match);
  const earnedICE: Ice = StudentProfiles.getEarnedICE(username);
  const projectedICE: Ice = StudentProfiles.getProjectedICE(username);
  return {
    earnedICE,
    projectedICE,
  };
})(StudentIceWidget);
const StudentIceWidgetContainer = withRouter(StudentIceWidgetCon);

export default StudentIceWidgetContainer;
