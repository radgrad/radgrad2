import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { PlanChoices } from '../../../api/degree-plan/PlanChoiceCollection';
import { HelpMessages } from '../../../api/help/HelpMessageCollection';

import AdvisorPageMenuWidget from '../../components/advisor/AdvisorPageMenuWidget';
import AdvisorAcademicPlanTabs from '../../components/advisor/academic-plans/AdvisorAcademicPlanTabs';
import HelpPanelWidget from '../../components/shared/HelpPanelWidget';
import BackToTopButton from '../../components/shared/BackToTopButton';
import { AcademicPlans } from '../../../api/degree-plan/AcademicPlanCollection';
import { IPlanChoiceDefine, IAcademicTerm, IAcademicPlan, IHelpMessage } from '../../../typings/radgrad';

interface IAdvisorAcademicPlanPageProps {
  choices: IPlanChoiceDefine[],
  terms: IAcademicTerm[],
  plans: IAcademicPlan[],
  helpMessages: IHelpMessage[];
}
const AdvisorAcademicPlanPage: React.FC<IAdvisorAcademicPlanPageProps> = ({ choices, terms, plans, helpMessages }) => (
  <div id="advisor-academic-plan-page">
    <AdvisorPageMenuWidget />
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}><HelpPanelWidget helpMessages={helpMessages} /></Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={1} />
        <Grid.Column width={14}>
          <AdvisorAcademicPlanTabs choices={choices} terms={terms} plans={plans} />
        </Grid.Column>
        <Grid.Column width={1} />
      </Grid.Row>
    </Grid>

    <BackToTopButton />
  </div>
);
const AdvisorAcademicPlanPageContainer = withTracker(() => {
  const terms = AcademicTerms.findNonRetired({}, { sort: { year: 1 } });
  const choices = PlanChoices.findNonRetired({}, { sort: { choice: 1 } });
  const plans = AcademicPlans.findNonRetired();
  const helpMessages = HelpMessages.findNonRetired({});
  return {
    terms,
    choices,
    plans,
    helpMessages,
  };
})(AdvisorAcademicPlanPage);

export default AdvisorAcademicPlanPageContainer;
