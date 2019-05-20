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

  private interestName = (interest): string => {
    return interest.name;
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

  private matchingCareerInterests = (course) => {
    try {
      return this.matchingCareerInterestsHelper(course);
    } catch (err) {
      return null;
    }
  }

  private matchingCareerInterestsHelper = (item) => {
    const username = this.props.match.params.username;
    const matchingInterests = [];
    const userInterestIDs = Users.getInterestIDsByType(username);
    const userInterests = _.map(userInterestIDs[1], (id) => Interests.findDoc(id));
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

  private otherInterests = (course) => {
    try {
      const matchingInterests = this.matchingInterestsHelper(course);
      const courseInterests = _.map(course.interestIDs, (id) => Interests.findDoc(id));
      return _.filter(courseInterests, (courseInterest) => {
        let ret = true;
        _.forEach(matchingInterests, (matchingInterest) => {
          if (_.isEqual(courseInterest, matchingInterest)) {
            ret = false;
          }
        });
        return ret;
      });
    } catch (err) {
      return null;
    }
  }

  private matchingInterestsHelper = (item) => {
    const username = this.props.match.params.username;
    const matchingInterests = [];
    const userInterestIDs = Users.getInterestIDs(username);
    const userInterests = _.map(userInterestIDs, (id) => Interests.findDoc(id));
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

  public render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const matchingUserInterests = this.matchingUserInterests(this.props.item);
    const matchingCareerInterests = this.matchingCareerInterests(this.props.item);
    const otherInterests = this.otherInterests(this.props.item);
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
            matchingCareerInterests.map((interest, index) => (
                <Label key={index} as="a" size={this.props.size}>
                  TODO: href
                  <i className="fitted suitcase icon"/> {this.interestName(interest)}
                </Label>
            ))
          }

          {
            otherInterests.map((interest, index) => (
                <Label key={index} as="a" color="grey" size={this.props.size}>
                  TODO: href
                  {this.interestName(interest)}
                </Label>
            ))
          }

        </Label.Group>
    );
  }
}

export default withRouter(InterestList);
