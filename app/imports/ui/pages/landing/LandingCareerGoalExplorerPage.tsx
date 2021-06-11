import React from 'react';
import Markdown from 'react-markdown';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { CareerGoal } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Courses } from '../../../api/course/CourseCollection';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import LandingInterestList from '../../components/landing/LandingInterestList';
import LandingCourseList from '../../components/landing/LandingCourseList';
import LandingOpportunityList from '../../components/landing/LandingOpportunityList';
import * as Router from '../../components/shared/utilities/router';
import { PAGEIDS } from '../../utilities/PageIDs';
import { EXPLORER_TYPE_ICON } from '../../utilities/ExplorerUtils';
import PageLayout from '../PageLayout';
import RadGradSegment from '../../components/shared/RadGradSegment';
import RadGradHeader from '../../components/shared/RadGradHeader';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import TeaserVideo from '../../components/shared/TeaserVideo';

interface CareerGoalExplorerProps {
  careerGoal: CareerGoal;
}

const headerPaneTitle = 'The Career Goal Explorer';
const headerPaneBody = `
Career Goals are curated by the faculty to represent a good selection of the most promising career paths. Most career goals encompass several job titles. 

Registered users can add Career Goals to their profile which enables RadGrad to improve its ability to recommend extracurricular activities (called "Opportunities" in RadGrad). 

This page provides an overview of the Career Goals currently available in RadGrad. 
`;

const LandingCareerGoalExplorerPage: React.FC<CareerGoalExplorerProps> = ({ careerGoal }) => {
  const match = useRouteMatch();
  const careerGoalID = careerGoal._id;
  const relatedCourses = CareerGoals.findRelatedCourses(careerGoalID);
  const relatedOpportunities = CareerGoals.findRelatedOpportunities(careerGoalID);
  const teaser = Teasers.findNonRetired({ targetSlugID: careerGoal.slugID });
  const hasTeaser = teaser.length > 0;
  const headerPaneImage = careerGoal.picture;
  return (
    <div>
      <LandingExplorerMenuBar />
      <PageLayout id={PAGEIDS.LANDING_CAREER_GOAL_EXPLORER} headerPaneTitle={headerPaneTitle}
        headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
        <Grid stackable>
          <Grid.Column width={3}>
            <LandingExplorerMenuContainer />
          </Grid.Column>

          <Grid.Column width={13}>
            <RadGradSegment header={<RadGradHeader title={careerGoal.name} dividing />}>
              {hasTeaser ? (<TeaserVideo id={teaser && teaser[0] && teaser[0].url} />) : ''}
              <Markdown escapeHtml source={careerGoal.description}
                renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
            </RadGradSegment>
            <RadGradSegment header={<RadGradHeader title='Related Interests' icon={EXPLORER_TYPE_ICON.INTEREST} dividing />}>{careerGoal.interestIDs.length > 0 ? <LandingInterestList interestIDs={careerGoal.interestIDs} size='small' /> : 'N/A'}</RadGradSegment>
            <RadGradSegment header={<RadGradHeader title="Related Courses" icon={EXPLORER_TYPE_ICON.COURSE} dividing />}>{relatedCourses.length > 0 ? <LandingCourseList courses={relatedCourses} size='small' /> : 'N/A'}</RadGradSegment>
            <RadGradSegment header={<RadGradHeader title="Related Opportunities" icon={EXPLORER_TYPE_ICON.OPPORTUNITY} dividing />}>
              {relatedOpportunities.length > 0 ? <LandingOpportunityList opportunities={relatedOpportunities} size='small' /> : 'N/A'}
            </RadGradSegment>
          </Grid.Column>
        </Grid>
      </PageLayout>
    </div>
  );
};

const LandingCareerGoalExplorerContainer = withTracker(() => {
  const { careergoal } = useParams();
  const id = Slugs.getEntityID(careergoal, 'CareerGoal');
  const careerGoalDoc = CareerGoals.findDoc(id);
  return {
    careerGoal: careerGoalDoc,
  };
})(LandingCareerGoalExplorerPage);

export default withListSubscriptions(LandingCareerGoalExplorerContainer, [
  CareerGoals.getPublicationName(),
  Slugs.getPublicationName(),
  Interests.getPublicationName(),
  Courses.getPublicationName(),
  Opportunities.getPublicationName(),
  Teasers.getPublicationName(),
]);
