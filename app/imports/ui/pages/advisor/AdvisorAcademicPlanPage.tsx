import * as React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';

/** A simple static component to render some text for the landing page. */
class AdvisorAcademicPlanPage extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  public render() {
    const moveDownStyle = {
      marginTop: 10,
    };
    return (
      <div>
        <AdvisorPageMenuWidget/>
        <Grid verticalAlign="middle" container={true} style={moveDownStyle}>
          <Grid.Row>
            <Grid.Column width={16}><HelpPanelWidgetContainer/></Grid.Column>
          </Grid.Row>

          <Grid.Column width={4}>
            <Image size="small" circular={true} src="/images/radgrad_logo.png"/>
          </Grid.Column>

          <Grid.Column width={8}>
            <h1>Advisor Academic Plan</h1>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const AdvisorAcademicPlanPageCon = withGlobalSubscription(AdvisorAcademicPlanPage);
const AdvisorAcademicPlanPageContainer = withInstanceSubscriptions(AdvisorAcademicPlanPageCon);

export default AdvisorAcademicPlanPageContainer;
