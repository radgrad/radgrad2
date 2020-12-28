import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import { AdvisorProfiles } from '../../../api/user/AdvisorProfileCollection';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import AdvisorStudentSelectorWidget from '../../components/advisor/home/AdvisorStudentSelectorWidget';
import AdvisorUpdateStudentWidget from '../../components/advisor/home/AdvisorUpdateStudentWidget';
import AdvisorLogEntryWidget from '../../components/advisor/home/AdvisorLogEntryWidget';
import AdvisorStarUploadWidget from '../../components/advisor/home/AdvisorStarUploadWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
import { AdvisorLog, CareerGoal, HelpMessage, Interest, StudentProfile } from '../../../typings/radgrad';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { RootState } from '../../../redux/types';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';

export interface FilterStudents {
  selectedUsername: string;
  usernameDoc: StudentProfile;
  interests: Interest[];
  careerGoals: CareerGoal[];
  advisorLogs: AdvisorLog[];
  helpMessages: HelpMessage[];
  students: StudentProfile[],
  alumni: StudentProfile[],
}

const mapStateToProps = (state: RootState) => ({
  selectedUsername: state.advisor.home.selectedUsername,
});

const renderSelectedStudentWidgets = (selectedUsername: string, usernameDoc: StudentProfile, careerGoals: CareerGoal[], interests: Interest[], advisorLogs: AdvisorLog[], username: string) => {
  if (selectedUsername === '') {
    return undefined;
  }
  return (
    <Grid.Row>
      <Grid.Column width={1} />
      <Grid.Column width={9} stretched>
        <AdvisorUpdateStudentWidget
          usernameDoc={usernameDoc}
          studentCollectionName={StudentProfiles.getCollectionName()}
          careerGoals={careerGoals}
          interests={interests}
        />
      </Grid.Column>

      <Grid.Column width={5} stretched>
        <AdvisorLogEntryWidget
          usernameDoc={usernameDoc}
          advisorLogs={advisorLogs}
          advisorUsername={username}
        />
        <AdvisorStarUploadWidget
          usernameDoc={usernameDoc}
          advisorUsername={username}
        />

      </Grid.Column>
      <Grid.Column width={1} />
      <BackToTopButton />
    </Grid.Row>
  );
};

const AdvisorHomePage: React.FC<FilterStudents> = ({ helpMessages, advisorLogs, interests, careerGoals, usernameDoc, selectedUsername, students, alumni }) => {
  const { username } = useParams();
  return (
    <div id="advisor-home-page">
      <AdvisorPageMenuWidget />
      <div className="pusher">
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={1} />
            <Grid.Column width={14}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
            <Grid.Column width={1} />
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={1} />
            <Grid.Column width={14}>
              {/* TODO make this communicate, selecting a student doesn't change the form */}
              <AdvisorStudentSelectorWidget
                careerGoals={careerGoals}
                interests={interests}
                advisorUsername={username}
                students={students}
                alumni={alumni}
              />
            </Grid.Column>
            <Grid.Column width={1} />
          </Grid.Row>
          {renderSelectedStudentWidgets(selectedUsername, usernameDoc, careerGoals, interests, advisorLogs, username)}
        </Grid>
      </div>
    </div>
  );
};

const AdvisorHomePageTracker = withTracker(({ selectedUsername }) => {
  const usernameDoc = StudentProfiles.findByUsername(selectedUsername);
  const userID = usernameDoc ? usernameDoc.userID : '';
  const interests = Interests.findNonRetired({});
  const careerGoals = CareerGoals.findNonRetired({});
  const students = StudentProfiles.findNonRetired({ isAlumni: false }, { sort: { username: 1 } });
  const alumni = StudentProfiles.findNonRetired({ isAlumni: true }, { sort: { username: 1 } });
  const advisorLogs = AdvisorLogs.findNonRetired({ studentID: userID }, { sort: { createdOn: -1 } });
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    usernameDoc,
    interests,
    careerGoals,
    advisorLogs,
    helpMessages,
    students,
    alumni,
  };
})(AdvisorHomePage);

const AdvisorHomePageContainer = connect(mapStateToProps)(AdvisorHomePageTracker);

export default withListSubscriptions(AdvisorHomePageContainer, [
  AdvisorProfiles.getPublicationName(),
  StudentProfiles.getPublicationName(),
  Interests.getPublicationName(),
  CareerGoals.getPublicationName(),
  AdvisorLogs.getPublicationName(),
  HelpMessages.getPublicationName(),
]);
