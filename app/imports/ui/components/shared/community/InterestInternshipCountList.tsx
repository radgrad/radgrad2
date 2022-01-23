import React from 'react';
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { useRouteMatch } from 'react-router-dom';
import InterestLabel from '../label/InterestLabel';
import * as Router from '../utilities/router';

interface InterestInternshipCountListProps {
  internshipCounts: [string, number][];
  size: SemanticSIZES;
}

const InterestInternshipCountList: React.FC<InterestInternshipCountListProps> = ({ internshipCounts, size }) => {
  const match = useRouteMatch();
  const userID = Router.getUserIdFromRoute(match);
  return (
    <Label.Group size={size}>
      {internshipCounts.map((pair) => <InterestLabel key={pair[0]} slug={pair[0]} userID={userID} size={size} rightside={` (${pair[1]})`} />)}
    </Label.Group>);
};

export default InterestInternshipCountList;
