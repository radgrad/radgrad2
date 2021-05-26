import React from 'react';
import { PAGEIDS } from '../../../utilities/PageIDs';
import Task1 from './Task1';
import Task2 from './Task2';
import Task3 from './Task3';
import Task4 from './Task4';
import Task5 from './Task5';
import Task6 from './Task6';
import Task7 from './Task7';
import PageLayout from '../../PageLayout';

const headerPaneTitle = "Timothy's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const OnboardTimothyPage: React.FC = () => {

  const style = {
    marginBottom: 30,
  };

  return (
        <PageLayout id={PAGEIDS.ONBOARD_SHINYA} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}
                    headerPaneImage={headerPaneImage}>
          <div style={style}>
                <Task7/>
          </div>
          <div style={style}>
                <Task6/>
          </div>
          <div style={style}>
                <Task5/>
          </div>
            <div style={style}>
                <Task4/>
            </div>
            <div style={style}>
                <Task3/>
            </div>
            <div className='ui two column grid'>
                <Task1/>
                <Task2/>
            </div>
        </PageLayout>
  );
};

export default OnboardTimothyPage;
