import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router-dom';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import AdvisorStudentSelectorWidget from '../../components/advisor/AdvisorStudentSelectorWidget';
import AdvisorUpdateStudentWidget from '../../components/advisor/AdvisorUpdateStudentWidget';
import AdvisorLogEntryWidget from '../../components/advisor/AdvisorLogEntryWidget';
import AdvisorStarUploadWidget from '../../components/advisor/AdvisorStarUploadWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
// eslint-disable-next-line no-unused-vars
import { IAdvisorLog, ICareerGoal, IInterest, IStudentProfile } from '../../../typings/radgrad';
import BackToTopButton from '../../components/shared/BackToTopButton';

// Formatting for parameters
export interface IFilterStudents {
  selectedUsername: string;
  usernameDoc: IStudentProfile;
  interests: IInterest[];
  careerGoals: ICareerGoal[];
  advisorLogs: IAdvisorLog[];
  match: {
    params: {
      username: string;
    }
  }
}

const mapStateToProps = (state) => ({
  selectedUsername: state.advisor.home.selectedUsername,
});

const renderSelectedStudentWidgets = (props: IFilterStudents) => {
  if (props.selectedUsername === '') {
    return undefined;
  }
  return (
    <Grid.Row>
      <Grid.Column width={1} />
      <Grid.Column width={9} stretched>
        <AdvisorUpdateStudentWidget
          usernameDoc={props.usernameDoc}
          studentCollectionName={StudentProfiles.getCollectionName()}
          careerGoals={props.careerGoals}
          interests={props.interests}
        />
      </Grid.Column>

      <Grid.Column width={5} stretched>
        <AdvisorLogEntryWidget
          usernameDoc={props.usernameDoc}
          advisorLogs={props.advisorLogs}
          advisorUsername={props.match.params.username}
        />
        <AdvisorStarUploadWidget
          usernameDoc={props.usernameDoc}
          advisorUsername={props.match.params.username}
        />

      </Grid.Column>
      <Grid.Column width={1} />
      <BackToTopButton />
    </Grid.Row>
  );
};

const AdvisorHomePage = (props: IFilterStudents) => (
  <div>
    <AdvisorPageMenuWidget />
    <div className="pusher">
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={1} />
          <Grid.Column width={14}>
            <AdvisorStudentSelectorWidget
              careerGoals={props.careerGoals}
              interests={props.interests}
              advisorUsername={props.match.params.username}
            />
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid.Row>
        {renderSelectedStudentWidgets(props)}
      </Grid>
    </div>
  </div>
    );


const AdvisorHomePageTracker = withTracker((props) => {
  const usernameDoc = StudentProfiles.findByUsername(props.selectedUsername);
  const userID = usernameDoc ? usernameDoc.userID : '';
  return {
    usernameDoc: usernameDoc,
    interests: Interests.findNonRetired(),
    careerGoals: CareerGoals.findNonRetired(),
    advisorLogs: AdvisorLogs.findNonRetired({ studentID: userID }, { sort: { createdOn: -1 } }),
  };
})(AdvisorHomePage);

export default connect(mapStateToProps)(withRouter(AdvisorHomePageTracker));
