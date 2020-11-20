import React from 'react';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';

import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import AdvisorAcademicPlanTabs from '../../components/advisor/academic-plans/AdvisorAcademicPlanTabs';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
interface IAdvisorAcademicPlanPageProps {
  choices: IPlanChoiceDefine[],
  terms: IAcademicTerm[];
}
const AdvisorAcademicPlanPage = (props: IAdvisorAcademicPlanPageProps) => (
  <div id="advisor-academic-plan-page">
    <AdvisorPageMenuWidget />
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}><HelpPanelWidget /></Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}>
          <AdvisorAcademicPlanTabs choices=props.choices, terms=props.terms />
        </Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>
    </Grid>

    <BackToTopButton />
  </div>
);
const AdvisorAcademicPlanPageContainer=withTracker(() => {
  const terms = AcademicTerms.findNonRetired({}, { sort: { year: 1 } });
  const choices = PlanChoices.findNonRetired({}, { sort: { choice: 1 } });
  return {
    terms,
    choices,
  };
})(AdvisorAcademicPlanPage);

export default AdvisorAcademicPlanPageContainer;
