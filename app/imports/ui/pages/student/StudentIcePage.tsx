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
const StudentIcePage = (props: IStudentIcePageProps) => (
  <div id="student-ice-points-page">
    <StudentPageMenuWidget />
    <Container>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}><HelpPanelWidget helpMessages={props.helpMessages} /></Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16} stretched>
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
  const studentID = Users.getProfile(username).userID;
  const earnedICE: Ice = StudentProfiles.getEarnedICE(username);
  const projectedICE: Ice = StudentProfiles.getProjectedICE(username);
  const helpMessages = HelpMessages.findNonRetired({});
  const favoriteInterests: IFavoriteInterest[] = FavoriteInterests.findNonRetired({ userID: studentID });
  const courseInstances: ICourseInstance[] = CourseInstances.findNonRetired({ studentID });
  const opportunityInstances: IOpportunityInstance[] = OpportunityInstances.findNonRetired({ studentID });
  console.log(favoriteInterests);
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
