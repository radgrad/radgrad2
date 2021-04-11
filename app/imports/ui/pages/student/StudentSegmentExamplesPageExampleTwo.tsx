import React from 'react';
import { Icon } from 'semantic-ui-react';
import RadGradHeader from '../../components/shared/header/RadGradHeader';
import RadGradSegment2 from '../../components/shared/RadGradSegment2';

const StudentSegmentExamplesPageExampleTwo: React.FC = () => {
  const rightside = <span><Icon name='exclamation triangle' color='red' /> You have unverified opportunities</span>;
  const header = <RadGradHeader title='Example Two' icon='history' rightside={rightside} />;
  return (
    <RadGradSegment2 header={header}>
      This is an example of a RadGrad segment with a static right-side component. Example taken from the Verification page.
    </RadGradSegment2>
  );
};

export default StudentSegmentExamplesPageExampleTwo;
