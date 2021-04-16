import React from 'react';
import { Icon } from 'semantic-ui-react';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';

const SandboxSegment2: React.FC = () => {
  const rightside = <span><Icon name='exclamation triangle' color='red' /> You have unverified opportunities</span>;
  const header = <RadGradHeader title='Example Two' icon='history' rightside={rightside} />;
  return (
    <RadGradSegment header={header}>
      This is an example of a RadGrad segment with a static right-side component. Example taken from the Verification page.
    </RadGradSegment>
  );
};

export default SandboxSegment2;
