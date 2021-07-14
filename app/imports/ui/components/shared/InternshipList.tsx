import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { Internship } from '../../../typings/radgrad';
import { Internships } from '../../../api/internship/InternshipCollection';
import * as Router from './utilities/router';
import InternshipLabel from './label/InternshipLabel';

interface InternshipListProps {
  internships: Internship[];
  size: SemanticSIZES;
}

export const InternshipList: React.FC<InternshipListProps> = ({ internships, size }) => {
  const match = useRouteMatch();
  const userID = Router.getUserIdFromRoute(match);
  const guid = internships.map((id) => Internships.findDoc(id).guid);
  return (
    <Label.Group size={size}>
      {guid.map((slug) => <InternshipLabel key={slug} slug={slug} userID={userID} size={size} />)}
    </Label.Group>
  );
};


export default InternshipList;