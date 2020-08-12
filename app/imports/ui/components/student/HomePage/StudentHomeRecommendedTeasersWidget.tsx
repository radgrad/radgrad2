import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';
import Markdown from 'react-markdown';
import { ICareerGoal, ICourse, IInterest, IOpportunity, ISlug, ITeaser } from '../../../../typings/radgrad';
import { Teasers } from '../../../../api/teaser/TeaserCollection';
import { Users } from '../../../../api/user/UserCollection';
import { buildRouteName, getUsername, IMatchProps, renderLink } from '../../shared/RouterHelperFunctions';
import { Interests } from '../../../../api/interest/InterestCollection';
import { docToShortDescription } from '../../shared/data-model-helper-functions';
import TeaserVideo from '../../shared/TeaserVideo';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { EXPLORER_TYPE } from '../../../../startup/client/route-constants';

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

  const getTeaserTitle = (teaser: ITeaser): string => {
    const slug: ISlug = Slugs.findOne({ _id: teaser.targetSlugID });
    let doc: ICareerGoal | ICourse | IInterest | IOpportunity;
    if (slug.entityName === CareerGoals.getType()) {
      doc = CareerGoals.findOne({ _id: slug.entityID });
    } else if (slug.entityName === Courses.getType()) {
      doc = Courses.findOne({ _id: slug.entityID });
    } else if (slug.entityName === Interests.getType()) {
      doc = Interests.findOne({ _id: slug.entityID });
    } else if (slug.entityName === Opportunities.getType()) {
      doc = Opportunities.findOne({ _id: slug.entityID });
    }
    return doc.name;
  };

  const getTeaserDescription = (teaser: ITeaser): string => {
    const slug: ISlug = Slugs.findOne({ _id: teaser.targetSlugID });
    let doc: ICareerGoal | ICourse | IInterest | IOpportunity;
    if (slug.entityName === CareerGoals.getType()) {
      doc = CareerGoals.findOne({ _id: slug.entityID });
    } else if (slug.entityName === Courses.getType()) {
      doc = Courses.findOne({ _id: slug.entityID });
    } else if (slug.entityName === Interests.getType()) {
      doc = Interests.findOne({ _id: slug.entityID });
    } else if (slug.entityName === Opportunities.getType()) {
      doc = Opportunities.findOne({ _id: slug.entityID });
    }
    return docToShortDescription(doc);
  };

  const getTeaserRoute = (teaser: ITeaser): string => {
    const slug: ISlug = Slugs.findOne({ _id: teaser.targetSlugID });
    switch (slug.entityName) {
      case CareerGoals.getType():
        return buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.CAREERGOALS}/${slug.name}`);
      case Courses.getType():
        return buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.COURSES}/${slug.name}`);
      case Interests.getType():
        return buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.INTERESTS}/${slug.name}`);
      case Opportunities.getType():
        return buildRouteName(match, `/${EXPLORER_TYPE.HOME}/${EXPLORER_TYPE.OPPORTUNITIES}/${slug.name}`);
      default:
        console.error(`Bad slug.entityName: ${slug.entityName}`);
    }
    return undefined;
  };

  const recommendedTeasers = getRecommendedTeasers().slice(0, 4);
  return (
    <>
      <Header>RECOMMENDED</Header>
      <Segment.Group>
        {recommendedTeasers.map((teaser) => (
          <div key={teaser._id}>
            <Segment.Group>
              <TeaserVideo id={teaser.url} />
            </Segment.Group>

            <Segment.Group>
              <Header>{getTeaserTitle(teaser)}</Header>
              <Markdown
                escapeHtml
                source={`${getTeaserDescription(teaser)}...`}
                renderers={{ link: (p) => renderLink(p, match) }}
              />
              <Link to={getTeaserRoute(teaser)}>
                VIEW MORE
              </Link>
            </Segment.Group>
          </div>
        ))}
      </Segment.Group>
    </>
  );
};

const StudentHomeRecommendedTeasersCon = withRouter(StudentHomeRecommendedTeasersWidget);
export default StudentHomeRecommendedTeasersCon;
