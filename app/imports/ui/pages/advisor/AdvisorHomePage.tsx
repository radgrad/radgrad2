import * as React from 'react';
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
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import { StudentProfiles } from '../../../api/user/StudentProfileCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { AdvisorLogs } from '../../../api/log/AdvisorLogCollection';
// eslint-disable-next-line no-unused-vars
import { IAdvisorLog, ICareerGoal, IInterest, IStudentProfile } from '../../../typings/radgrad';

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
  selectedUsername: state.page.advisor.home.selectedUsername,
});

/** A simple static component to render some text for the landing page. */
class AdvisorHomePage extends React.Component<IFilterStudents> {
  public render() {
    return (
      <div>
        <AdvisorPageMenuWidget/>
        <Grid container={true} stackable={true}>
          <Grid.Row>
            <HelpPanelWidget/>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <AdvisorStudentSelectorWidget careerGoals={this.props.careerGoals}
                                            interests={this.props.interests}
                                            advisorUsername={this.props.match.params.username}/>
            </Grid.Column>
          </Grid.Row>
          {this.renderSelectedStudentWidgets()}
        </Grid>
      </div>
    );
  }

  public renderSelectedStudentWidgets() {
    if (this.props.selectedUsername === '') {
      return undefined;
    }
    return (
      <Grid.Row>
        <Grid.Column width={10} stretched={true}>
          <AdvisorUpdateStudentWidget usernameDoc={this.props.usernameDoc}
                                      studentCollectionName={StudentProfiles.getCollectionName()}
                                      careerGoals={this.props.careerGoals}
                                      interests={this.props.interests}/>
        </Grid.Column>

        <Grid.Column width={6} stretched={true}>
          <AdvisorLogEntryWidget usernameDoc={this.props.usernameDoc}
                                 advisorLogs={this.props.advisorLogs}
                                 advisorUsername={this.props.match.params.username}/>
          <AdvisorStarUploadWidget usernameDoc={this.props.usernameDoc}
                                   advisorUsername={this.props.match.params.username}/>

        </Grid.Column>
      </Grid.Row>
    );
  }
}

const AdvisorHomePageGSub = withGlobalSubscription(AdvisorHomePage);
const AdvisorHomePageISub = withInstanceSubscriptions(AdvisorHomePageGSub);
const AdvisorHomePageTracker = withTracker((props) => {
  const usernameDoc = StudentProfiles.findByUsername(props.selectedUsername);
  const userID = usernameDoc ? usernameDoc.userID : '';
  return {
    usernameDoc: usernameDoc,
    interests: Interests.findNonRetired(),
    careerGoals: CareerGoals.findNonRetired(),
    advisorLogs: AdvisorLogs.findNonRetired({ studentID: userID }, { sort: { createdOn: -1 } }),
  };
})(AdvisorHomePageISub);

export default connect(mapStateToProps)(withRouter(AdvisorHomePageTracker));
