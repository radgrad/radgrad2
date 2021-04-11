import React, { useState } from 'react';
import { Form, Radio } from 'semantic-ui-react';
import RadGradHeader from '../../components/shared/header/RadGradHeader';
import RadGradSegment2 from '../../components/shared/RadGradSegment2';

const StudentSegmentExamplesPageExampleFour: React.FC = () => {
  const [checkState, setCheckState] = useState('100');
  const handleToggleChange = (e, { value }) => setCheckState(value);

  const rightside =
    <Form>
      <Form.Group inline>
        <Form.Field control={Radio} label='100' value='100' checked={checkState === '100'} onChange={handleToggleChange} />
        <Form.Field control={Radio} label='200' value='200' checked={checkState === '200'} onChange={handleToggleChange} />
        <Form.Field control={Radio} label='300' value='300' checked={checkState === '300'} onChange={handleToggleChange} />
        <Form.Field control={Radio} label='400' value='400' checked={checkState === '400'} onChange={handleToggleChange} />
      </Form.Group>
    </Form>;
  const header = <RadGradHeader title='Example Four' icon='cloud upload' rightside={rightside} />;
  return (
    <RadGradSegment2 header={header}>
      <p>This is an example of a RadGrad segment with a dynamic right-side component: a set of radio buttons.</p>

      <p>The selected radio button is available within the segment component and can be used to control the data that appears in the segment. For example, the current selected radio button is: {checkState}.</p>
    </RadGradSegment2>
  );
};

export default StudentSegmentExamplesPageExampleFour;
