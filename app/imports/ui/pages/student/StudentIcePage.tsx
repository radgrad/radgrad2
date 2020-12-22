import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import React from 'react';
import { Grid, Container } from 'semantic-ui-react';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import StudentPageMenuWidget from '../../components/student/StudentPageMenuWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import StudentIceWidget from '../../components/student/ice/StudentIceWidget';

import { Ice, CourseInstance, FavoriteInterest, HelpMessage, OpportunityInstance } from '../../../typings/radgrad';

import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Users } from '../../../api/user/UserCollection';
import { FavoriteInterests } from '../../../api/favorite/FavoriteInterestCollection';
import { CourseInstances } from '../../../api/course/CourseInstanceCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';

interface StudentIcePageProps {
  helpMessages: HelpMessage[];
  earnedICE: Ice;
  projectedICE: Ice;
  favoriteInterests: FavoriteInterest[];
  courseInstances: CourseInstance[];
  opportunityInstances: OpportunityInstance[];
}
const StudentIcePage: React.FC<StudentIcePageProps> = ({ helpMessages, earnedICE, projectedICE,
  favoriteInterests, courseInstances, opportunityInstances }) => (
    <div id="student-ice-points-page">
      <StudentPageMenuWidget />
      <Container>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={16}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16} stretched>
              <StudentIceWidget
                earnedICE={earnedICE}
                projectedICE={projectedICE}
                favoriteInterests={favoriteInterests}
                courseInstances={courseInstances}
                opportunityInstances={opportunityInstances}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <BackToTopButton />
      </Container>
    </div>
);

const StudentHomeIcePageContainer = withTracker(() => {
  const { username } = useParams();
  const studentID: IStudentProfile = Users.getProfile(username).userID;
  const earnedICE: Ice = StudentProfiles.getEarnedICE(username);
  const projectedICE: Ice = StudentProfiles.getProjectedICE(username);
  const helpMessages = HelpMessages.findNonRetired({});
  const favoriteInterests: FavoriteInterest[] = FavoriteInterests.findNonRetired({ userID: studentID });
  const courseInstances: CourseInstance[] = CourseInstances.findNonRetired({ studentID });
  const opportunityInstances: OpportunityInstance[] = OpportunityInstances.findNonRetired({ studentID });

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
