import React from 'react';
import { Grid, Header, Divider, Segment } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import { useRouteMatch, Link } from 'react-router-dom';
import { CareerGoal, Course, Interest, Opportunity, Slug, Teaser } from '../../../../typings/radgrad';
import TeaserVideo from '../../shared/TeaserVideo';
import { Slugs } from '../../../../api/slug/SlugCollection';
import { CareerGoals } from '../../../../api/career/CareerGoalCollection';
import { Courses } from '../../../../api/course/CourseCollection';
import { Interests } from '../../../../api/interest/InterestCollection';
import { Opportunities } from '../../../../api/opportunity/OpportunityCollection';
import { docToShortDescription } from '../../shared/utilities/data-model';
import { buildExplorerSlugRoute, MatchProps, renderLink } from '../../shared/utilities/router';
import { EXPLORER_TYPE } from '../../../layouts/utilities/route-constants';

interface RecommendedItemInformationProps {
  teaser: Teaser;
}

const getTeaserTargetSlug = (teaser: Teaser): Slug => Slugs.findOne({ _id: teaser.targetSlugID });

const getTeaserTitle = (teaser: Teaser): string => {
  const slug: Slug = getTeaserTargetSlug(teaser);
  let doc: CareerGoal | Course | Interest | Opportunity;
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

const getTeaserDescription = (teaser: Teaser): string => {
  const slug: Slug = getTeaserTargetSlug(teaser);
  let doc: CareerGoal | Course | Interest | Opportunity;
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

const getTeaserRoute = (match: MatchProps, teaser: Teaser): string => {
  const slug: Slug = Slugs.findOne({ _id: teaser.targetSlugID });
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

const RecommendedItemInformation: React.FC<RecommendedItemInformationProps> = ({ teaser }) => {
  const match = useRouteMatch();

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

export default RecommendedItemInformation;
