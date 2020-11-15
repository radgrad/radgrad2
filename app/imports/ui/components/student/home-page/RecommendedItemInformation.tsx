import React from 'react';
import { Grid, Header, Divider, Segment } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { withRouter, Link } from 'react-router-dom';
import { ICareerGoal, ICourse, IInterest, IOpportunity, ISlug, ITeaser } from '../../../../typings/radgrad';
import TeaserVideo from '../../shared/TeaserVideo';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { docToShortDescription } from '../../shared/data-model-helper-functions';
import { buildExplorerSlugRoute, IMatchProps, renderLink } from '../../shared/router-helper-functions';
import { EXPLORER_TYPE } from '../../../../startup/client/route-constants';

interface IRecommendedItemInformationProps {
  match: IMatchProps;
  teaser: ITeaser;
}

const getTeaserTargetSlug = (teaser: ITeaser): ISlug => Slugs.findOne({ _id: teaser.targetSlugID });

const getTeaserTitle = (teaser: ITeaser): string => {
  const slug: ISlug = getTeaserTargetSlug(teaser);
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
  const slug: ISlug = getTeaserTargetSlug(teaser);
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
  const maxLengthDescription = 300;
  return docToShortDescription(doc, maxLengthDescription);
};

const getTeaserRoute = (match: IMatchProps, teaser: ITeaser): string => {
  const slug: ISlug = Slugs.findOne({ _id: teaser.targetSlugID });
  switch (slug.entityName) {
    case CareerGoals.getType():
      return buildExplorerSlugRoute(match, EXPLORER_TYPE.CAREERGOALS, slug.name);
    case Courses.getType():
      return buildExplorerSlugRoute(match, EXPLORER_TYPE.COURSES, slug.name);
    case Interests.getType():
      return buildExplorerSlugRoute(match, EXPLORER_TYPE.INTERESTS, slug.name);
    case Opportunities.getType():
      return buildExplorerSlugRoute(match, EXPLORER_TYPE.OPPORTUNITIES, slug.name);
    default:
      console.error(`Bad slug.entityName: ${slug.entityName}`);
  }
  return undefined;
};

const RecommendedItemInformation = (props: IRecommendedItemInformationProps) => {
  const { teaser, match } = props;

  const viewMoreButtonStyle: React.CSSProperties = {
    marginTop: '25px',
  };

  const teaserRoute = getTeaserRoute(match, teaser);
  return (
    <Grid.Row>
      <Segment>
        <Grid columns={2} stretched>
          {/* Teaser Video */}
          <Grid.Column width={8}>
            <TeaserVideo id={teaser.url} />
          </Grid.Column>

          {/* Teaser Information */}
          <Grid.Column width={8}>
            {/* Title */}
            <Grid.Row>
              <Header as="h3">{getTeaserTitle(teaser)}</Header>
            </Grid.Row>

            {/* Description */}
            <Grid.Row>
              <Markdown
                escapeHtml
                source={`${getTeaserDescription(teaser)}...`}
                renderers={{ link: (p) => renderLink(p, match) }}
              />
            </Grid.Row>

            {/* View More Button */}
            <Grid.Row style={viewMoreButtonStyle}>
              <Link to={teaserRoute}>
                <u>VIEW MORE</u>
              </Link>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Segment>
      <Divider hidden />
    </Grid.Row>
  );
};

export default withRouter(RecommendedItemInformation);
