import React from 'react';
import { Input } from 'semantic-ui-react';
import { useStickyState } from '../../../../utilities/StickyState';

interface SearchProps {
  explorerType: string;
}

const Search: React.FC<SearchProps> = ({ explorerType }) => {
  const [searchPhrase, setSearchPhrase] = useStickyState(`Search.${explorerType}`, '');
  console.log(searchPhrase);

  const handleChange = (type, value) => {
    setSearchPhrase(value);
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
