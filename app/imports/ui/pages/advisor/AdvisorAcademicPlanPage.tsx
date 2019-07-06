import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import withGlobalSubscription from '../../layouts/shared/GlobalSubscriptionsHOC';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import withInstanceSubscriptions from '../../layouts/shared/InstanceSubscriptionsHOC';
import AdvisorAcademicPlanTabs from '../../components/advisor/AdvisorAcademicPlanTabs';
import HelpPanelWidgetContainer from '../../components/shared/HelpPanelWidget';

const AdvisorAcademicPlanPage = () => {
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
        < Grid.Row>
          <Grid.Column width={16}>
            <AdvisorAcademicPlanTabs/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </
      div>
  );
};

const AdvisorAcademicPlanPageCon = withGlobalSubscription(AdvisorAcademicPlanPage);
const AdvisorAcademicPlanPageContainer = withInstanceSubscriptions(AdvisorAcademicPlanPageCon);

export default AdvisorAcademicPlanPageContainer;
