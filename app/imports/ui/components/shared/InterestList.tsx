import * as React from 'react';
// eslint-disable-next-line no-unused-vars
import { Label, SemanticSIZES } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import { Users } from '../../../api/user/UserCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
// eslint-disable-next-line no-unused-vars
import { IBaseProfile } from '../../../typings/radgrad';
import * as Router from './RouterHelperFunctions';

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

class InterestList extends React.Component<IInterestListProps> {
  constructor(props) {
    super(props);
  }

  private getUsername = () => Router.getUsername(this.props.match);

  private interestName = (interest): string => interest.name;

  private matchingUserInterests = (course) => {
    try {
      return this.matchingUserInterestsHelper(course);
    } catch (err) {
      return null;
    }
  }

  private matchingUserInterestsHelper = (item) => {
    const matchingInterests = [];
    const userInterestIDs = Users.getInterestIDsByType(this.getUsername());
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
    const matchingInterests = [];
    const userInterestIDs = Users.getInterestIDsByType(this.getUsername());
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
    const matchingInterests = [];
    const userInterestIDs = Users.getInterestIDs(this.getUsername());
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

  private buildInterestsRouteName = (interest) => {
    const interestName = this.interestSlug(interest);
    const username = this.props.match.params.username;
    const baseUrl = this.props.match.url;
    const baseIndex = baseUrl.indexOf(username);
    const baseRoute = `${baseUrl.substring(0, baseIndex)}${username}/`;
    return `${baseRoute}explorer/interests/${interestName}`;
  }

  private interestSlug = (interest) => Slugs.findDoc(interest.slugID).name;

  public render():
    React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const matchingUserInterests = this.matchingUserInterests(this.props.item);
    const matchingCareerInterests = this.matchingCareerInterests(this.props.item);
    const otherInterests = this.otherInterests(this.props.item);
    return (
      <Label.Group size={this.props.size}>
        {
          matchingUserInterests.map((interest) => (
            <Label as={Link} key={interest._id} to={this.buildInterestsRouteName(interest)} size={this.props.size}>
              <i className="fitted star icon"/> {this.interestName(interest)}
            </Label>
          ))
        }

        {
          matchingCareerInterests.map((interest) => (
            <Label as={Link} key={interest._id} to={this.buildInterestsRouteName(interest)} size={this.props.size}>
              <i className="fitted suitcase icon"/> {this.interestName(interest)}
            </Label>
          ))
        }

        {
          otherInterests.map((interest) => (
            <Label as={Link} key={interest._id} to={this.buildInterestsRouteName(interest)} size={this.props.size}
                   color="grey">
              {this.interestName(interest)}
            </Label>
          ))
        }
      </Label.Group>
    );
  }
}

export default withRouter(InterestList);
