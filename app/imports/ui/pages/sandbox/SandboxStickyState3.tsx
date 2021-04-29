import React  from 'react';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';
import { useStickyState } from '../../utilities/StickyState';

const SandboxStickyState3: React.FC = () => {
  const [checkState] = useStickyState('SandboxStickyState', true);
  const checkStateValue = checkState ? 'Checked' : 'Not Checked';

  const header = <RadGradHeader title='useStickyState() variables are available to other components'  icon='user'  />;
  return (
    <RadGradSegment header={header}>
      <p>Another cool thing about useStickyState() is that it defines a state variable that can be accessed by any component in the application.</p>

      <p>To access and manipulate a shared sticky (global) value, just use the same name when invoking useStickyState(). So, we use the same name in this component when declaring the state variable as we do in the above component:</p>

      <code>const [checkState, setCheckState] = useStickyState(&apos;SandboxStickyState&apos;, true);</code>

      <p style={{ marginTop: '10px' }}>Because we used the same name (SandboxStickyState), both this component and the othe one are accessing the same state variable. To see this, the value of the checkbox in the above component is: {checkStateValue}.</p>

      <p>Note that the initial value will depend upon which component accessing a shared StickyState variable is rendered first. If you do not want order-dependent behavior, be sure to use the same initial value in all invocations.</p>

      <p>If we wanted to, we could change the state variable in this component and it would be reflected in the other component.</p>

    </RadGradSegment>
  );
};

export default SandboxStickyState3;
