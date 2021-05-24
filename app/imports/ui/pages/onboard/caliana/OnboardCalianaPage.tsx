import React from 'react';
import { PAGEIDS } from '../../../utilities/PageIDs';
import PageLayout from '../../PageLayout';
import RadGradHeader from '../../../components/shared/RadGradHeader';
import RadGradSegment from '../../../components/shared/RadGradSegment';
import Task2 from './Task2';
import Task3 from './Task3';

const headerPaneTitle = "Caliana's Onboarding Sandbox";
const headerPaneBody = 'Page for display of onboarding component development practice';
const headerPaneImage = 'header-onboarding.png';

const headerTask1 = <RadGradHeader title='TASK 1: HELLO WORLD' icon='globe americas icon' dividing/>;

const OnboardCalianaPage: React.FC = () => (

    <PageLayout id={PAGEIDS.ONBOARD_CALIANA} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}
                headerPaneImage={headerPaneImage}>
        <RadGradSegment header={headerTask1}>
            Hello World
        </RadGradSegment>
        <Task2/>
        <Task3/>
    </PageLayout>
);

export default OnboardCalianaPage;
