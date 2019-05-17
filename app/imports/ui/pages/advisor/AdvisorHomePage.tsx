import * as React from 'react';
import { Container, Segment } from 'semantic-ui-react';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import AdvisorStudentSelectorWidget from '../../components/advisor/AdvisorStudentSelectorWidget';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';

/** A simple static component to render some text for the landing page. */
class AdvisorHomePage extends React.Component {
  public render() {


      return (
          <div>
              <AdvisorPageMenuWidget/>
              <Container fluid={false}>
                  {/*Temporary Help Widget*/}
                  <Segment inverted color='green' tertiary content='HelpWidget Placeholder'/>

                  {/*TODO -- gbarcelo Temporary Component, must extract to its own .tsx file*/}
                  <AdvisorStudentSelectorWidget/>
              </Container>
          </div>
    );
  }
}

const AdvisorHomePageCon = withGlobalSubscription(AdvisorHomePage);
const AdvisorHomePageContainer = withInstanceSubscriptions(AdvisorHomePageCon);

export default AdvisorHomePageContainer;
