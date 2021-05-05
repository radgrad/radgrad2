import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { AcademicTerms } from '../../../../../api/academic-term/AcademicTermCollection';

interface TermListProps {
  item: {
    termIDs?: string[];
  };
  size: SemanticSIZES;
}

const TermList: React.FC<TermListProps> = ({ size, item }) => {
  const academicTerms = item.termIDs.map((termID) => AcademicTerms.toString(termID));
  return (
    <Label.Group size={size}>
      {academicTerms.map((term) =><Label key={term} size={size} color='blue' >{term}</Label>)}
    </Label.Group>
  );
};

export default TermList;
