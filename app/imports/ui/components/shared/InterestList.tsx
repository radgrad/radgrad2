import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import { Interests } from '../../../api/interest/InterestCollection';
import InterestLabel from './label/InterestLabel';
import * as Router from './utilities/router';

interface InterestListProps {
  item: {
    interestIDs: string[];
  };
  size: SemanticSIZES;
}

const InterestList: React.FC<InterestListProps> = ({ size, item }) => {
  const match = useRouteMatch();
  const userID = Router.getUserIdFromRoute(match);
  const interestSlugs = item.interestIDs.map((id) => Interests.findSlugByID(id)).sort();
  return (
    <Label.Group size={size}>
      {interestSlugs.map((slug) => <InterestLabel key={slug} slug={slug} userID={userID} size={size} />)}
    </Label.Group>
  );
};

export default InterestList;
