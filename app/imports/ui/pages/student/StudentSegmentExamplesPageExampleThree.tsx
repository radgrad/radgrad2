import React, { useState } from 'react';
import { Checkbox } from 'semantic-ui-react';
import RadGradHeader from '../../components/shared/header/RadGradHeader';
import RadGradSegment2 from '../../components/shared/RadGradSegment2';

const StudentSegmentExamplesPageExampleThree: React.FC = () => {
  const [checkState, setCheckState] = useState(true);
  const handleToggleChange = () => setCheckState(!checkState);
  const checkStateValue = checkState ? 'Checked' : 'Not Checked';

  const rightside = <Checkbox onChange={handleToggleChange} checked={checkState} label='Show all'/>;
  const header = <RadGradHeader title='Example Three' count={3} icon='graduation cap' rightside={rightside} />;
  return (
    <RadGradSegment2 header={header}>
      <p>This is an example of a RadGrad segment with a dynamic right-side component: a checkbox.</p>

      <p>The current value of the checkbox is: {checkStateValue}.</p>
    </RadGradSegment2>
  );
};

export default StudentSegmentExamplesPageExampleThree;
