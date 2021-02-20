import React from 'react';
import { connect } from 'react-redux';
import { Button, Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';
import AdvisorStudentSelectorWidget from '../../components/advisor/home/AdvisorStudentSelectorWidget';
import AdvisorUpdateStudentWidget from '../../components/advisor/home/AdvisorUpdateStudentWidget';
import AdvisorStarUploadWidget from '../../components/advisor/home/AdvisorStarUploadWidget';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { CareerGoal, HelpMessage, Interest, StudentProfile } from '../../../typings/radgrad';
import { RootState } from '../../../redux/types';
import PageLayout from '../PageLayout';
import { updateAllStudentLevelsMethod } from '../../../api/level/LevelProcessor.methods';

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
      <Grid.Column width={10} stretched>
        <AdvisorUpdateStudentWidget usernameDoc={usernameDoc} studentCollectionName={StudentProfiles.getCollectionName()} careerGoals={careerGoals} interests={interests} />
      </Grid.Column>

      <Grid.Column width={6} stretched>
        <AdvisorStarUploadWidget usernameDoc={usernameDoc} advisorUsername={username} />
      </Grid.Column>
    </Grid.Row>
  );
};

const headerPaneTitle = 'Manage students';
const headerPaneBody = `
Use this page to add students to RadGrad and/or help them during advising sessions.

For more details, please see [RadGrad Advisor User Guide](https://www.radgrad.org/docs/users/advisors/overview)
`;

const handleUpdateLevelButton = (event) => {
  event.preventDefault();
  updateAllStudentLevelsMethod.call((error, result) => {
    if (error) {
      console.error('There was an error updating the student levels', error);
    }
    console.log(result);
  });
};

const AdvisorManageStudentsPage: React.FC<FilterStudents> = ({ helpMessages, interests, careerGoals, usernameDoc, selectedUsername, students, alumni }) => {
  const { username } = useParams();
  const marginStyle = { margin: 10 };
  return (
    <PageLayout id="manage-students-page" headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={16}>
              {/* TODO make this communicate, selecting a student doesn't change the form */}
              <AdvisorStudentSelectorWidget careerGoals={careerGoals} interests={interests} advisorUsername={username} students={students} alumni={alumni} />
              <Button color="green" basic style={marginStyle} onClick={handleUpdateLevelButton}>
                Update Student Levels
              </Button>
            </Grid.Column>
          </Grid.Row>
          {renderSelectedStudentWidgets(selectedUsername, usernameDoc, careerGoals, interests, username)}
        </Grid>
    </PageLayout>
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
