import * as React from 'react';
import {connect} from 'react-redux';
import {Container, Segment, Grid} from 'semantic-ui-react';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import AdvisorStudentSelectorWidget from '../../components/advisor/AdvisorStudentSelectorWidget';
import AdvisorUpdateStudentWidget from '../../components/advisor/AdvisorUpdateStudentWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import {withTracker} from "meteor/react-meteor-data";
import {StudentProfiles} from "../../../api/user/StudentProfileCollection";
import {Interests} from "../../../api/interest/InterestCollection";
import {CareerGoals} from "../../../api/career/CareerGoalCollection";

// Formatting for parameters
export interface IFilterStudents {
  firstName?: string;
  lastName?: string;
  username?: string;
  selectedUsername: string;
  usernameDoc: any;
  interests: any;
  careerGoals: any;
}

const mapStateToProps = (state) => ({
  selectedUsername: state.page.advisor.home.selectedUsername,
})

/** A simple static component to render some text for the landing page. */
class AdvisorHomePage extends React.Component<IFilterStudents> {
  // constructor(props) {
  //     super(props);
  //     this.state = {};
  // }
  //
  // public updateFirstName = (firstName) => {
  //     this.setState({ firstName });
  // };
  //
  // public updateLastName = (lastName) => {
  //     this.setState({ lastName });
  // };
  //
  // public updateUserName = (userName) => {
  //     this.setState({ userName });
  // };
  
  public render() {
    
    
    return (
      <div>
        <AdvisorPageMenuWidget/>
        <Container fluid={false}>
          {/*Temporary Help Widget*/}
          <Segment inverted color='green' tertiary content='HelpWidget Placeholder'/>
          
          <AdvisorStudentSelectorWidget/>
          
          <Grid stackable>
            <Grid.Column width={9} stretched={true}>
              <AdvisorUpdateStudentWidget usernameDoc={this.props.usernameDoc}
                                          studentCollectionName={StudentProfiles.getCollectionName()}
                                          careerGoals={this.props.careerGoals}
                                          interests={this.props.interests}/>
            </Grid.Column>
          </Grid>
        </Container>
      </div>
    );
  }
}

const AdvisorHomePageCon = withGlobalSubscription(AdvisorHomePage);
const AdvisorHomePageContai = withInstanceSubscriptions(AdvisorHomePageCon);
const AdvisorHomePageContainer = withTracker((props) => {
  return {
    usernameDoc: StudentProfiles.findByUsername(props.selectedUsername),
    interests: Interests.findNonRetired(),
    careerGoals: CareerGoals.findNonRetired(),
  };
})(AdvisorHomePageContai);

export default connect(mapStateToProps)(AdvisorHomePageContainer);
// export default (AdvisorHomePageContainer);
