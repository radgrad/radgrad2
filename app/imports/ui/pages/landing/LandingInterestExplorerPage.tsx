import React from 'react';
import Markdown from 'react-markdown';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import { Course, Interest, Opportunity } from '../../../typings/radgrad';
import { Courses } from '../../../api/course/CourseCollection';
import { Interests } from '../../../api/interest/InterestCollection';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import * as Router from '../../components/shared/utilities/router';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import LandingOpportunityList from '../../components/landing/LandingOpportunityList';
import LandingCourseList from '../../components/landing/LandingCourseList';
import RadGradSegment from '../../components/shared/RadGradSegment';
import RadGradHeader from '../../components/shared/RadGradHeader';
import { EXPLORER_TYPE_ICON } from '../../utilities/ExplorerUtils';

interface InterestExplorerProps {
  currentUser: string;
  interest: Interest;
  courses: Course[];
  opportunities: Opportunity[];
}

const headerPaneTitle = 'The Interest Explorer';
const headerPaneBody = `
Interests are curated by the faculty to provide information about topic areas important to the discipline and future career goals.  Interests are used by RadGrad to recommend courses and opportunities relevant to the user. Interests are also used to build community by allowing registered users to find others with matching interests.

This public explorer does not provide information about community members.
`;

const LandingInterestExplorerPage: React.FC<InterestExplorerProps> = ({ currentUser, opportunities, courses, interest }) => {
  const match = useRouteMatch();
  return (
    <div>
      <LandingExplorerMenuBar />
      <PageLayout id={PAGEIDS.LANDING_INTEREST_EXPLORER} headerPaneTitle={headerPaneTitle} headerPaneBody={headerPaneBody}>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <LandingExplorerMenuContainer />
            </Grid.Column>
            <Grid.Column width={13}>
              <RadGradSegment header={<RadGradHeader title={interest.name} dividing />}>
                <b>Description:</b>
                <Markdown escapeHtml source={interest.description} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} />
              </RadGradSegment>
              <RadGradSegment header={<RadGradHeader title="Related Courses" icon={EXPLORER_TYPE_ICON.COURSE} dividing />}>{courses.length > 0 ? <LandingCourseList courses={courses} size='small' /> : 'N/A'}</RadGradSegment>
              <RadGradSegment header={<RadGradHeader title="Related Opportunities" icon={EXPLORER_TYPE_ICON.OPPORTUNITY} dividing />}>
                {opportunities.length > 0 ? <LandingOpportunityList opportunities={opportunities} size='small' /> : 'N/A'}
              </RadGradSegment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </PageLayout>
    </div>
  );
};

const LandingInterestExplorerContainer = withTracker(() => {
  const { interest } = useParams();
  const id = Slugs.getEntityID(interest, 'Interest');
  const interestDoc = Interests.findDoc(id);
  const courses = Courses.findNonRetired({ interestIDs: id });
  const opportunities = Opportunities.findNonRetired({ interestIDs: id });
  return {
    interest: interestDoc,
    courses,
    opportunities,
  };
})(LandingInterestExplorerPage);

export default withListSubscriptions(LandingInterestExplorerContainer, [Courses.getPublicationName(), Interests.getPublicationName(), Opportunities.getPublicationName(), Slugs.getPublicationName()]);
