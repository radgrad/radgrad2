import React, { useState } from 'react';
import { Checkbox } from 'semantic-ui-react';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';

const SandboxStickyState1: React.FC = () => {
  const [checkState, setCheckState] = useState(true);
  const handleChange = (e, { checked }) => setCheckState(checked);
  const checkStateValue = checkState ? 'Checked' : 'Not Checked';

  const rightside = <Checkbox onChange={handleChange} checked={checkState} label='Show all'/>;
  const header = <RadGradHeader title='usestate() variables are not sticky'  icon='user' rightside={rightside} />;
  return (
    <RadGradSegment header={header}>
      <p>This is an example of a RadGrad segment with useState() to declare a state variable to manage the value of a checkbox. A call to useState() looks like this:</p>

      <code>const [checkState, setCheckState] = useState(true);</code>

      <p style={{ marginTop: '10px' }}>The value of the state variable (which corresponds to the checkbox value) is available within the segment component and can be used to control the data that appears in the segment. For example, the value of the checkbox is: {checkStateValue}.</p>

      <p>Unfortunately, the value of the state variable <b>is not</b> sticky. To see why, unclick it from its default value, then go to a different page in RadGrad, then press the back arrow to return to this one. You will see that the checkbox returns to its default value, indicating that the state variable is not sticky.</p>
    </RadGradSegment>
  );
};

export default SandboxStickyState1;
