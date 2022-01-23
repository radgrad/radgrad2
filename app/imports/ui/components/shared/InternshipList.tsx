import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { Internship } from '../../../typings/radgrad';
import * as Router from './utilities/router';
import InternshipLabel from './label/InternshipLabel';

interface InternshipListProps {
  internships: Internship[];
  size: SemanticSIZES;
}

const InternshipList: React.FC<InternshipListProps> = ({ internships, size }) => {
  const match = useRouteMatch();
  const userID = Router.getUserIdFromRoute(match);
  const guids = internships.map((internship) => internship.guid);
  return (
    <Label.Group size={size}>
      {guids.map((slug) => <InternshipLabel key={slug} slug={slug} userID={userID} size={size} />)}
    </Label.Group>
  );
};


export default InternshipList;
