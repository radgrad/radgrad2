import * as React from 'react';
import { Label, SemanticSIZES, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { Users } from '../../../api/user/UserCollection';
import * as _ from 'lodash';
import { Interests } from '../../../api/interest/InterestCollection';

interface IInterestListProps {
  item: object;
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

class InterestList extends React.Component<IInterestListProps> {
  constructor(props) {
    super(props);
  }

  private matchingUserInterests = (course) => {
    try {
      return this.matchingUserInterestsHelper(course);
    } catch (err) {
      return null;
    }
  }

  private matchingUserInterestsHelper = (item) => {
    const username = this.props.match.params.username;
    const matchingInterests = [];
    const userInterestIDs = Users.getInterestIDsByType(username);
    const userInterests = _.map(userInterestIDs[0], (id) => Interests.findDoc(id));
    const itemInterests = _.map(item.interestIDs, (id) => Interests.findDoc(id));
    _.forEach(itemInterests, (itemInterest) => {
      _.forEach(userInterests, (userInterest) => {
        if (_.isEqual(itemInterest, userInterest)) {
          matchingInterests.push(userInterest);
        }
      });
    });
    return matchingInterests;
  }

  private interestName = (interest): string => {
    return interest.name;
  }

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const matchingUserInterests = this.matchingUserInterests(this.props.item);
    return (
        <Label.Group>
          {
            matchingUserInterests.map((interest, index) => (
                <Label key={index} as="a" size={this.props.size}>
                  TODO: href
                  <i className="fitted star icon"/> {this.interestName(interest)}
                </Label>
            ))
          }

          {
            'TODO: matchingCareerInterests'
          }

          {
            'TODO: otherInterests'
          }

        </Label.Group>
    );
  }
}

export default withRouter(InterestList);
