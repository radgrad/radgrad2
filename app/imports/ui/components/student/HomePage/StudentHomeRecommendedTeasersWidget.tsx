import React from 'react';
import { Header } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { ITeaser } from '../../../../typings/radgrad';
import { Teasers } from '../../../../api/teaser/TeaserCollection';
import { Users } from '../../../../api/user/UserCollection';
import { getUsername, IMatchProps } from '../../shared/RouterHelperFunctions';
import { Interests } from '../../../../api/interest/InterestCollection';
import TeaserInformationItem from './TeaserInformationItem';

interface IStudentHomeRecommendedTeasersProps {
  match: IMatchProps;
}

const StudentHomeRecommendedTeasersWidget = (props: IStudentHomeRecommendedTeasersProps) => {
  const { match } = props;
  const getRecommendedTeasers = (): ITeaser[] => {
    const allTeasers: ITeaser[] = Teasers.findNonRetired({});
    const matching = [];
    const username = getUsername(match);
    const profile = Users.getProfile(username);
    const userInterests = [];
    let teaserInterests = [];
    _.forEach(Users.getInterestIDs(profile.userID), (id) => {
      userInterests.push(Interests.findDoc(id));
    });
    _.forEach(allTeasers, (teaser) => {
      teaserInterests = [];
      _.forEach(teaser.interestIDs, (id) => {
        teaserInterests.push(Interests.findDoc(id));
        _.forEach(teaserInterests, (teaserInterest) => {
          _.forEach(userInterests, (userInterest) => {
            if (_.isEqual(teaserInterest, userInterest)) {
              if (!_.includes(matching, teaser)) {
                matching.push(teaser);
              }
            }
          });
        });
      });
    });
    return matching;
  };

  const numberOfTeasers = 4;
  const recommendedTeasers = getRecommendedTeasers().slice(0, numberOfTeasers);

  return (
    <>
      <Header>RECOMMENDED</Header>
      {recommendedTeasers.map((teaser) => (
        <TeaserInformationItem key={teaser._id} teaser={teaser} />
      ))}
    </>
  );
};

const StudentHomeRecommendedTeasersCon = withRouter(StudentHomeRecommendedTeasersWidget);
export default StudentHomeRecommendedTeasersCon;
