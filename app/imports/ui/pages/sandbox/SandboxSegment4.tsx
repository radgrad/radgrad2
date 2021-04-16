import React, { useState } from 'react';
import { Form, Radio } from 'semantic-ui-react';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';

const SandboxSegment4: React.FC = () => {
  const [checkState, setCheckState] = useState('100');
  const handleChange = (e, { value }) => setCheckState(value);

  const rightside =
    <Form>
      <Form.Group inline>
        <Form.Field control={Radio} label='100' value='100' checked={checkState === '100'} onChange={handleChange} />
        <Form.Field control={Radio} label='200' value='200' checked={checkState === '200'} onChange={handleChange} />
        <Form.Field control={Radio} label='300' value='300' checked={checkState === '300'} onChange={handleChange} />
        <Form.Field control={Radio} label='400' value='400' checked={checkState === '400'} onChange={handleChange} />
      </Form.Group>
    </Form>;
  const header = <RadGradHeader title='Example Four' icon='cloud upload' rightside={rightside} />;
  return (
    <RadGradSegment header={header}>
      <p>This is an example of a RadGrad segment with a dynamic right-side component: a hand-rolled set of radio buttons.</p>

      <p>The selected radio button is available within the segment component and can be used to control the data that appears in the segment. For example, the current selected radio button is: {checkState}.</p>
    </RadGradSegment>
  );
};

export default SandboxSegment4;
