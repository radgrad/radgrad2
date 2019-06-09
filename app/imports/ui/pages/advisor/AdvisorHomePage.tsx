import * as React from 'react';
import {connect} from 'react-redux';
import {Container, Segment, Grid, Header} from 'semantic-ui-react';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import AdvisorStudentSelectorWidget from '../../components/advisor/AdvisorStudentSelectorWidget';
import AdvisorUpdateStudentWidget from '../../components/advisor/AdvisorUpdateStudentWidget';
import AdvisorLogEntryWidget from '../../components/advisor/AdvisorLogEntryWidget';
import AdvisorStarUploadWidget from '../../components/advisor/AdvisorStarUploadWidget';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import {withTracker} from "meteor/react-meteor-data";
import {withRouter} from 'react-router-dom';
import {StudentProfiles} from "../../../api/user/StudentProfileCollection";
import {Interests} from "../../../api/interest/InterestCollection";
import {CareerGoals} from "../../../api/career/CareerGoalCollection";
import {AdvisorLogs} from "../../../api/log/AdvisorLogCollection";

// Formatting for parameters
export interface IFilterStudents {
  firstName?: string;
  lastName?: string;
  username?: string;
  selectedUsername: string;
  usernameDoc: any;
  interests: any;
  careerGoals: any;
  advisorLogs: any;
  match: {
    params: {
      username: string;
    }
  }
}

const mapStateToProps = (state) => ({
  selectedUsername: state.page.advisor.home.selectedUsername,
})

/** A simple static component to render some text for the landing page. */
class AdvisorHomePage extends React.Component<IFilterStudents> {
  public render() {
    return (
      <div>
        <AdvisorPageMenuWidget/>
        <Container fluid={false}>
          <Grid stackable>
            <Grid.Column width={14}>
              <Grid.Row>
                <HelpPanelWidget/>
              </Grid.Row>
              <Grid.Row>
                <AdvisorStudentSelectorWidget/>
              </Grid.Row>
            </Grid.Column>
            {this.renderSelectedStudentWidgets()}
          </Grid>
        </Container>
      </div>
    );
  }
  
  public renderSelectedStudentWidgets() {
    if (this.props.selectedUsername === '') return;
    else {
      return (
        <Grid.Row>
          <Grid.Column width={9} stretched={true}>
            <AdvisorUpdateStudentWidget usernameDoc={this.props.usernameDoc}
                                        studentCollectionName={StudentProfiles.getCollectionName()}
                                        careerGoals={this.props.careerGoals}
                                        interests={this.props.interests}/>
          </Grid.Column>
          <Grid.Column width={5} stretched={true}>
            {console.log('advisorLogs', this.props.advisorLogs)}
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
}

const AdvisorHomePageCon = withGlobalSubscription(AdvisorHomePage);
const AdvisorHomePageContai = withInstanceSubscriptions(AdvisorHomePageCon);
const AdvisorHomePageContainer = withTracker((props) => {
  const usernameDoc = StudentProfiles.findByUsername(props.selectedUsername);
  const userID = usernameDoc ? usernameDoc.userID : '';
  console.log('usernameDoc', usernameDoc);
  return {
    usernameDoc: usernameDoc,
    interests: Interests.findNonRetired(),
    careerGoals: CareerGoals.findNonRetired(),
    advisorLogs: AdvisorLogs.findNonRetired({studentID: userID}, {sort: {createdOn: -1}})
  };
})(AdvisorHomePageContai);

export default connect(mapStateToProps)(withRouter(AdvisorHomePageContainer));
