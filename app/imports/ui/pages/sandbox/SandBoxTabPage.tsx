import React, { useState } from 'react';
import { Form, Menu, Radio, Tab } from 'semantic-ui-react';
import RadGradHeaderOptions from '../../components/shared/RadGradHeaderOptions';
import RadGradTabHeader from '../../components/shared/RadGradTabHeader';
import TabIceCircle from '../../components/shared/TabIceCircle';
import PageLayout from '../PageLayout';

const headerPaneTitle = 'SandBox: Tabs Design';
const headerPaneBody = 'Examples of RadGradTabHeader. (April, 2021)';
const headerPaneImage = 'images/header-panel/header-sandbox.png';

enum SortValues {
  ALPHA = 'Alphabetic',
  RECOMMENDED = 'Recommended',
  LUCKY = 'I\'m feeling lucky',
}

const SandBoxTabPage: React.FC = () => {
  const [checkState, setCheckState] = useState('100');
  const handleFormChange = (e, { value }) => setCheckState(value);

  const initialValue = SortValues.ALPHA;
  const [sortValue, setSortValue] = useState(initialValue);
  const handleSortChange = (newValue) => setSortValue(newValue);

  const tab1 = <RadGradTabHeader title='ex 1' />;
  const tab2 = <RadGradTabHeader title='ex 2' count={5} />;
  const tab3 = <RadGradTabHeader title='ex 3' icon='green star outline' />;
  const tab4 = <RadGradTabHeader title='ex 4' iconAlternative={<TabIceCircle earned={53} planned={92} type='exp'/>} />;

  const rightside =
    <Form style={{ marginTop: 16 }}>
      <Form.Group inline>
        <Form.Field control={Radio} label='100' value='100' checked={checkState === '100'} onChange={handleFormChange} />
        <Form.Field control={Radio} label='200' value='200' checked={checkState === '200'} onChange={handleFormChange} />
        <Form.Field control={Radio} label='300' value='300' checked={checkState === '300'} onChange={handleFormChange} />
        <Form.Field control={Radio} label='400' value='400' checked={checkState === '400'} onChange={handleFormChange} />
      </Form.Group>
    </Form>;

  const tab5 = <RadGradTabHeader title='ex 5' rightside={rightside}/>;

  const leftside = <RadGradHeaderOptions label='Sort by:' values={Object.values(SortValues)} initialValue={initialValue} handleChange={handleSortChange} />;

  const tab6 = <RadGradTabHeader title='ex 6' leftside={leftside} />;

  const panes = [
    {
      menuItem: <Menu.Item key='example 1'>{tab1}</Menu.Item>,
      render: () => <Tab.Pane>Example 1</Tab.Pane>,
    },
    {
      menuItem: <Menu.Item key='example 2'>{tab2}</Menu.Item>,
      render: () => <Tab.Pane>Example 2</Tab.Pane>,
    },
    {
      menuItem: <Menu.Item key='example 3'>{tab3}</Menu.Item>,
      render: () => <Tab.Pane>Example 3</Tab.Pane>,
    },
    {
      menuItem: <Menu.Item key='example 4'>{tab4}</Menu.Item>,
      render: () => <Tab.Pane>Example 4</Tab.Pane>,
    },
    {
      menuItem: <Menu.Item key='example 5'>{tab5}</Menu.Item>,
      render: () => <Tab.Pane>      <p>The selected radio button is available within the segment component and can be used to control the data that appears in the segment. For example, the current selected radio button is: {checkState}.</p>
      </Tab.Pane>,
    },
    {
      menuItem: <Menu.Item key='example 6'>{tab6}</Menu.Item>,
      render: () => <Tab.Pane>      <p>The selected radio button is available within the segment component and can be used to control the data that appears in the segment. For example, the current selected radio button is: {sortValue}.</p>
      </Tab.Pane>,
    },
  ];

  return (
    <PageLayout id='sandbox-tab-page' headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
      <Tab panes={panes} />
    </PageLayout>);
};

export default SandBoxTabPage;
