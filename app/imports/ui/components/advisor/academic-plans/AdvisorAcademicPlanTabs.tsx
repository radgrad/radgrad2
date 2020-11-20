import React from 'react';
import { Segment, Tab } from 'semantic-ui-react';
import AdvisorAcademicPlanViewerWidget from './AdvisorAcademicPlanViewerWidget';
import AdvisorAPBuilderWidget from './AdvisorAPBuilderWidget';
import { IAcademicPlan } from '../../../../typings/radgrad';

interface IAdvisorAcademicPlanTabsProps {
  choices: IPlanChoiceDefine[],
  terms: IAcademicTerm[],
  plans: IAcademicPlan[],
}
const AdvisorAcademicPlanTabs = (props: IAdvisorAcademicPlanTabsProps) => {
	console.log(props);
	console.log(props.plans);
  const panes = [
    {
      menuItem: 'Viewer',
      render: () => ( // eslint-disable-line react/display-name
        <Tab.Pane><AdvisorAcademicPlanViewerWidget plans=props.plans/></Tab.Pane>
      ),
    },
    {
      menuItem: 'Builder',
      render: () => ( // eslint-disable-line react/display-name
        <Tab.Pane><AdvisorAPBuilderWidget choices=props.choices, terms=props.terms/></Tab.Pane>
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
