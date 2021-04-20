import React, { useState } from 'react';
import RadGradHeader from '../../components/shared/RadGradHeader';
import RadGradSegment from '../../components/shared/RadGradSegment';
import RadGradHeaderOptions from '../../components/shared/RadGradHeaderOptions';

enum SortValues {
  ALPHA = 'Alphabetic',
  RECOMMENDED = 'Recommended',
  LUCKY = 'I\'m feeling lucky',
}

const SandboxSegment5: React.FC = () => {
  const initialValue = SortValues.ALPHA;
  const [sortValue, setSortValue] = useState(initialValue);
  const handleChange = (newValue) => setSortValue(newValue);

  const leftside = <RadGradHeaderOptions label='Sort by:' values={Object.values(SortValues)} initialValue={initialValue} handleChange={handleChange} />;

  const header = <RadGradHeader title='Example Five' icon='cloud upload' leftside={leftside} />;
  return (
    <RadGradSegment header={header}>
      <p>This is an example of a RadGrad segment with a dynamic leftside component. In this case, the component is the RadGradHeaderOptions component, which simplifies the creation and use of Radio Buttons as selectors.</p>

      <p>The selected radio button is available within the segment component and can be used to control the data that appears in the segment. For example, the current selected radio button is: {sortValue}.</p>
    </RadGradSegment>
  );
};

export default SandboxSegment5;
