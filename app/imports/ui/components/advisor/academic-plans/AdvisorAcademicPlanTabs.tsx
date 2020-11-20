import React from 'react';
import { Segment, Tab } from 'semantic-ui-react';
import AdvisorAcademicPlanViewerWidget from './AdvisorAcademicPlanViewerWidget';
import AdvisorAPBuilderWidget from './AdvisorAPBuilderWidget';
interface IAdvisorAcademicPlanTabsProps {
  choices: IPlanChoiceDefine[],
  terms: IAcademicTerm[];
}
const AdvisorAcademicPlanTabs = (props: IAdvisorAcademicPlanTabsProps) => {
  const panes = [
    {
      menuItem: 'Viewer',
      render: () => ( // eslint-disable-line react/display-name
        <Tab.Pane><AdvisorAcademicPlanViewerWidget /></Tab.Pane>
      ),
    },
    {
      menuItem: 'Builder',
      render: () => ( // eslint-disable-line react/display-name
        <Tab.Pane><AdvisorAPBuilderWidget {...props}/></Tab.Pane>
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
