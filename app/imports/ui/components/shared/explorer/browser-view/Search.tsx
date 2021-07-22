import React from 'react';
import { Input } from 'semantic-ui-react';
import { useStickyState } from '../../../../utilities/StickyState';

interface SearchProps {
  explorerType: string;
}

const Search: React.FC<SearchProps> = ({ explorerType }) => {
  // Not using deconstruction since the value is not used in this file
  const searchState = useStickyState(`Search.${explorerType}`, '');

  const handleChange = (type, value) => {
    searchState[1](value);
  };

  return (
    <div>
      <Input
        onChange={handleChange}
        placeholder='Search...'
      />
    </div>
  );
};

export default Search;
