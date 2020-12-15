import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentIceWidget from '../../components/student/ice/StudentIceWidget';
import { Ice, ICourseInstance, IFavoriteInterest, IHelpMessage, IOpportunityInstance } from '../../../typings/radgrad';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';

interface IStudentIcePageProps {
  helpMessages: IHelpMessage[];
  earnedICE: Ice;
  projectedICE: Ice;
  favoriteInterests: IFavoriteInterest[];
  courseInstances: ICourseInstance[];
  opportunityInstances: IOpportunityInstance[];
}
// TODO deconstruct props should be { helpMessages, earnedICE, ... }
const StudentIcePage: React.FC<IStudentIcePageProps> = (props) => (
  <div id="student-ice-points-page">
    <StudentPageMenuWidget />
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}><HelpPanelWidget helpMessages={props.helpMessages} /></Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16} stretched>
            {/* TODO fix object spread */}
            <StudentIceWidget {...props} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <BackToTopButton />
    </Container>
  </div>
);

const StudentHomeIcePageContainer = withTracker(() => {
  const { username } = useParams();
  const studentID = Users.getProfile(username).userID; // TODO type this.
  const earnedICE: Ice = StudentProfiles.getEarnedICE(username);
  const projectedICE: Ice = StudentProfiles.getProjectedICE(username);
  const helpMessages = HelpMessages.findNonRetired({}); // TODO type this.
  const favoriteInterests: IFavoriteInterest[] = FavoriteInterests.findNonRetired({ userID: studentID });
  const courseInstances: ICourseInstance[] = CourseInstances.findNonRetired({ studentID });
  const opportunityInstances: IOpportunityInstance[] = OpportunityInstances.findNonRetired({ studentID });
  return {
    helpMessages,
    earnedICE,
    projectedICE,
    favoriteInterests,
    courseInstances,
    opportunityInstances,
  };
})(StudentIcePage);

export default StudentHomeIcePageContainer;
