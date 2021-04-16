import React, { useState } from 'react';
import { Checkbox } from 'semantic-ui-react';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';

const SandboxSegment3: React.FC = () => {
  const [checkState, setCheckState] = useState(true);
  const handleChange = (e, { checked }) => setCheckState(checked);
  const checkStateValue = checkState ? 'Checked' : 'Not Checked';

  const rightside = <Checkbox onChange={handleChange} checked={checkState} label='Show all'/>;
  const header = <RadGradHeader title='Example Three'  icon='user' rightside={rightside} />;
  return (
    <RadGradSegment header={header}>
      <p>This is an example of a RadGrad segment with a dynamic right-side component: a checkbox.</p>

      <p>The value of the checkbox is available within the segment component and can be used to control the data that appears in the segment. For example, the value of the checkbox is: {checkStateValue}.</p>
    </RadGradSegment>
  );
};

export default SandboxSegment3;
