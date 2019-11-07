import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { IBaseProfile } from '../../../typings/radgrad';
import * as Router from './RouterHelperFunctions';
import { docToName, itemToSlugName } from './data-model-helper-functions';
import { MatchingInterests } from '../../../api/interest/MatchingInterests';

interface IInterestListProps {
  item: {
    interestIDs: string[];
  }
  size: SemanticSIZES;
  match: {
    isExact: boolean;
    path: string;
    url: string;
    params: {
      username: string;
    }
  };
}

const InterestList = (props: IInterestListProps) => {
  const matchingUserInterests = MatchingInterests.matchingUserInterests(Router.getUsername(props.match), props.item);
  const matchingCareerInterests = MatchingInterests.matchingCareerGoalInterests(Router.getUsername(props.match), props.item);
  const otherInterests = MatchingInterests.notMatchingInterests(Router.getUsername(props.match), props.item);
  return (
    <Label.Group size={props.size}>
      {
        matchingUserInterests.map((interest) => {
          const interestSlug = itemToSlugName(interest);
          return (
            <Label as={Link} key={interest._id}
                   to={Router.buildRouteName(props.match, `/explorer/interests/${interestSlug}`)} size={props.size}>
              <i className="fitted star icon"/> {docToName(interest)}
            </Label>
          );
        })
      }

      {
        matchingCareerInterests.map((interest) => {
          const interestSlug = itemToSlugName(interest);
          return (
            <Label as={Link} key={interest._id}
                   to={Router.buildRouteName(props.match, `/explorer/interests/${interestSlug}`)} size={props.size}>
              <i className="fitted suitcase icon"/> {docToName(interest)}
            </Label>
          );
        })
      }

      {
        otherInterests.map((interest) => {
          const interestSlug = itemToSlugName(interest);
          return (
            <Label as={Link} key={interest._id}
                   to={Router.buildRouteName(props.match, `/explorer/interests/${interestSlug}`)} size={props.size}
                   color="grey">
              {docToName(interest)}
            </Label>
          );
        })
      }
    </Label.Group>
  );
};

export default withRouter(InterestList);
