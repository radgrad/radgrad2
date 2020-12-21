import React from 'react';
import { Segment, Tab } from 'semantic-ui-react';
import AdvisorAcademicPlanViewerWidget from './AdvisorAcademicPlanViewerWidget';
import AdvisorAPBuilderWidget from './AdvisorAPBuilderWidget';
import { AcademicPlan, PlanChoiceDefine, AcademicTerm } from '../../../../typings/radgrad';

interface AdvisorAcademicPlanTabsProps {
  choices: PlanChoiceDefine[],
  terms: AcademicTerm[],
  plans: AcademicPlan[],
}

const AdvisorAcademicPlanTabs: React.FC<AdvisorAcademicPlanTabsProps> = ({ plans, terms, choices }) => {
  const panes = [
    {
      menuItem: 'Viewer',
      render: () => (
        <Tab.Pane><AdvisorAcademicPlanViewerWidget plans={plans} /></Tab.Pane>
      ),
    },
    {
      menuItem: 'Builder',
      render: () => (
        <Tab.Pane><AdvisorAPBuilderWidget choices={choices} terms={terms} /></Tab.Pane>
      ),
    },
  ];
  return (
    <Segment padded>
      <Tab panes={panes} />
    </Segment>
  );
};

export default AdvisorAcademicPlanTabs;
