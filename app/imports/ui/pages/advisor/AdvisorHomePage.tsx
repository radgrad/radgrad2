import * as React from 'react';
import {Container, Segment} from 'semantic-ui-react';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import AdvisorStudentSelectorWidget from '../../components/advisor/AdvisorStudentSelectorWidget';
import AdvisorUpdateStudentWidget from '../../components/advisor/AdvisorUpdateStudentWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';

// Formatting for parameters
export interface IFilterStudents {
  firstName?: string;
  lastName?: string;
  userName?: string;
}

/** A simple static component to render some text for the landing page. */
class AdvisorHomePage extends React.Component<{}, IFilterStudents> {
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
          
          <AdvisorUpdateStudentWidget/>
        </Container>
      </div>
    );
  }
}

const AdvisorHomePageCon = withGlobalSubscription(AdvisorHomePage);
const AdvisorHomePageContainer = withInstanceSubscriptions(AdvisorHomePageCon);

export default AdvisorHomePageContainer;
