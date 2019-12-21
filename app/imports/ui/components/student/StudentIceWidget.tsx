import * as React from 'react';
import { Segment, Grid, Header } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Ice, IRadGradMatch } from '../../../typings/radgrad';
import MenuIceCircle from '../shared/MenuIceCircle';
import { getUsername } from '../shared/RouterHelperFunctions';
import StudentIceColumn from './StudentIceColumn';
import { studentIceWidget } from './student-widget-names';
import { Users } from '../../../api/user/UserCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { getEarnedICE, getProjectedICE } from '../../../api/ice/IceProcessor';

interface IStudentIceWidgetProps {
  match: IRadGradMatch;
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
            <MenuIceCircle earned={earnedICE.i} planned={projectedICE.i} type="innov" />
            <Header as="h3" textAlign="center" className="ice-innovation-color">INNOVATION</Header>
            <StudentIceColumn type="Innovation" />
          </Segment>
        </Grid.Column>

        <Grid.Column>
          <Segment basic>
            <MenuIceCircle earned={earnedICE.c} planned={projectedICE.c} type="comp" />
            <Header as="h3" textAlign="center" className="ice-competency-color">COMPETENCY</Header>
            <StudentIceColumn type="Competency" />
          </Segment>
        </Grid.Column>

        <Grid.Column style={experienceColumnStyle}>
          <Segment basic>
            <MenuIceCircle earned={earnedICE.e} planned={projectedICE.e} type="exp" />
            <Header as="h3" textAlign="center" className="ice-experience-color">Experience</Header>
            <StudentIceColumn type="Experience" />
          </Segment>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default withRouter(withTracker((props) => {
  const username = getUsername(props.match);
  const studentID = Users.getID(username);
  const courseDocs = CourseInstances.find({ studentID }).fetch();
  const oppDocs = OpportunityInstances.find({ studentID }).fetch();
  const earnedICE = getEarnedICE(courseDocs.concat(oppDocs));
  const projectedICE = getProjectedICE(courseDocs.concat(oppDocs));
  return {
    earnedICE,
    projectedICE,
  };
})(StudentIceWidget));
