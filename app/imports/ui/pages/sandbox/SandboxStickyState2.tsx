import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';
import { useStickyState } from '../../utilities/StickyState';

const SandboxStickyState2: React.FC = () => {
  const [checkState, setCheckState] = useStickyState('SandboxStickyState', true);
  const handleChange = (e, { checked }) => setCheckState(checked);
  const checkStateValue = checkState ? 'Checked' : 'Not Checked';

  const rightside = <Checkbox onChange={handleChange} checked={checkState} label='Show all'/>;
  const header = <RadGradHeader title='useStickyState() variables are sticky'  icon='user' rightside={rightside} />;
  return (
    <RadGradSegment header={header}>
      <p>This is an example of a RadGrad segment with useStickyState() to declare a sticky state variable to manage the value of a checkbox. A call to useStickyState() looks almost identical to useState():</p>

      <code>const [checkState, setCheckState] = useStickyState(&apos;SandboxStickyState&apos;, true);</code>

      <p style={{ marginTop: '10px' }}>The difference is that useStickyState requires a string as its first argument to uniquely identify the state variable of interest. The second argument is the initial value.</p>

      <p>Just like useState(), useStickyState() creates a state variable whose value is available within the segment component and can be used to control the data that appears in the segment. For example, the value of the checkbox is: {checkStateValue}.</p>

      <p>But with useStickyState(), the value of the state variable <b>is</b> sticky. To see why, unclick it from its default value, then go to a different page in RadGrad, then press the back arrow to return to this one. You will see that the checkbox retains its changed value, indicating that the state variable value was preserved even though the user navigated away from the page.</p>

      <p>Note that <b>refreshing</b> the page returns the checkbox to its default value. This is unavoidable, and is actually what we want to have happen when a page is refreshed.</p>
    </RadGradSegment>
  );
};

export default SandboxStickyState2;
