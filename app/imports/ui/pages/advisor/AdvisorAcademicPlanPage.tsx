import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import AdvisorAcademicPlanTabs from '../../components/advisor/AdvisorAcademicPlanTabs';

const AdvisorAcademicPlanPage = () => {
  const moveDownStyle = {
    marginTop: 10,
  };
  return (
    <div>
      <AdvisorPageMenuWidget/>
      <Grid verticalAlign="middle" container={true} style={moveDownStyle}>
        <Grid.Row textAlign="left">
          <Grid.Column width={1}/>
          <Grid.Column width={14}>
            <HelpPanelWidget/>
          </Grid.Column>
          <Grid.Column width={1}/>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={1}/>
          <Grid.Column width={14}>
            <AdvisorAcademicPlanTabs/>
          </Grid.Column>
          <Grid.Column width={1}/>
        </Grid.Row>
      </Grid>
    </div>
  );
};

const AdvisorAcademicPlanPageCon = withGlobalSubscription(AdvisorAcademicPlanPage);
const AdvisorAcademicPlanPageContainer = withInstanceSubscriptions(AdvisorAcademicPlanPageCon);

export default AdvisorAcademicPlanPageContainer;
