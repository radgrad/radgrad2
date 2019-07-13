import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import AdvisorAcademicPlanTabs from '../../components/advisor/AdvisorAcademicPlanTabs';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';

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

    <BackToTopButton/>
  </div>
);

export default AdvisorAcademicPlanPage;
