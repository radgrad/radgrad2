import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import AdvisorAcademicPlanTabs from '../../components/advisor/AdvisorAcademicPlanTabs';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';

const AdvisorAcademicPlanPage = () => (
  <div>
    <AdvisorPageMenuWidget/>
    <Grid container={true} stackable={true}>
      <Grid.Row>
        <HelpPanelWidget/>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={16}>
          <AdvisorAcademicPlanTabs/>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

const AdvisorAcademicPlanPageCon = withGlobalSubscription(AdvisorAcademicPlanPage);
const AdvisorAcademicPlanPageContainer = withInstanceSubscriptions(AdvisorAcademicPlanPageCon);

export default AdvisorAcademicPlanPageContainer;
