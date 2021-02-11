import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import AdvisorPageMenu from '../../components/advisor/AdvisorPageMenu';
import AdvisorStudentSelectorWidget from '../../components/advisor/home/AdvisorStudentSelectorWidget';
import AdvisorUpdateStudentWidget from '../../components/advisor/home/AdvisorUpdateStudentWidget';
import AdvisorStarUploadWidget from '../../components/advisor/home/AdvisorStarUploadWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { CareerGoal, HelpMessage, Interest, StudentProfile } from '../../../typings/radgrad';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { RootState } from '../../../redux/types';

export interface FilterStudents {
  selectedUsername: string;
  usernameDoc: StudentProfile;
  interests: Interest[];
  careerGoals: CareerGoal[];
  helpMessages: HelpMessage[];
  students: StudentProfile[];
  alumni: StudentProfile[];
}

const mapStateToProps = (state: RootState) => ({
  selectedUsername: state.advisor.home.selectedUsername,
});

const renderSelectedStudentWidgets = (selectedUsername: string, usernameDoc: StudentProfile, careerGoals: CareerGoal[], interests: Interest[], username: string) => {
  if (selectedUsername === '') {
    return undefined;
  }
  return (
    <Grid.Row>
      <Grid.Column width={1} />
      <Grid.Column width={9} stretched>
        <AdvisorUpdateStudentWidget usernameDoc={usernameDoc} studentCollectionName={StudentProfiles.getCollectionName()} careerGoals={careerGoals} interests={interests} />
      </Grid.Column>

      <Grid.Column width={5} stretched>
        <AdvisorStarUploadWidget usernameDoc={usernameDoc} advisorUsername={username} />
      </Grid.Column>
      <Grid.Column width={1} />
      <BackToTopButton />
    </Grid.Row>
  );
};

const AdvisorManageStudentsPage: React.FC<FilterStudents> = ({ helpMessages, interests, careerGoals, usernameDoc, selectedUsername, students, alumni }) => {
  const { username } = useParams();
  return (
    <div id="advisor-home-page">
      <AdvisorPageMenu />
      <div className="pusher">
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={1} />
            <Grid.Column width={14}>
              <HelpPanelWidget helpMessages={helpMessages} />
            </Grid.Column>
            <Grid.Column width={1} />
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={1} />
            <Grid.Column width={14}>
              {/* TODO make this communicate, selecting a student doesn't change the form */}
              <AdvisorStudentSelectorWidget careerGoals={careerGoals} interests={interests} advisorUsername={username} students={students} alumni={alumni} />
            </Grid.Column>
            <Grid.Column width={1} />
          </Grid.Row>
          {renderSelectedStudentWidgets(selectedUsername, usernameDoc, careerGoals, interests, username)}
        </Grid>
      </div>
    </div>
  );
};

const AdvisorManageStudentsTracker = withTracker(({ selectedUsername }) => {
  const usernameDoc = StudentProfiles.findByUsername(selectedUsername);
  const interests = Interests.findNonRetired({});
  const careerGoals = CareerGoals.findNonRetired({});
  const students = StudentProfiles.findNonRetired({ isAlumni: false }, { sort: { username: 1 } });
  const alumni = StudentProfiles.findNonRetired({ isAlumni: true }, { sort: { username: 1 } });
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    usernameDoc,
    interests,
    careerGoals,
    helpMessages,
    students,
    alumni,
  };
})(AdvisorManageStudentsPage);

export default connect(mapStateToProps)(AdvisorManageStudentsTracker);
