import React from 'react';
import Markdown from 'react-markdown';
import { useParams, useRouteMatch } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Grid } from 'semantic-ui-react';
import moment from 'moment';
import { Opportunities } from '../../../api/opportunity/OpportunityCollection';
import { CareerGoal, Course, Opportunity } from '../../../typings/radgrad';
import { Slugs } from '../../../api/slug/SlugCollection';
import LandingExplorerMenuContainer from '../../components/landing/explorer/LandingExplorerMenu';
import { Interests } from '../../../api/interest/InterestCollection';
import { CareerGoals } from '../../../api/career/CareerGoalCollection';
import { Courses } from '../../../api/course/CourseCollection';
import withListSubscriptions from '../../layouts/utilities/SubscriptionListHOC';
import LandingInterestList from '../../components/landing/LandingInterestList';
import LandingCareerGoalList from '../../components/landing/LandingCareerGoalList';
import LandingCourseList from '../../components/landing/LandingCourseList';
import { AcademicTerms } from '../../../api/academic-term/AcademicTermCollection';
import { Teasers } from '../../../api/teaser/TeaserCollection';
import * as Router from '../../components/shared/utilities/router';
import LandingExplorerMenuBar from '../../components/landing/explorer/LandingExplorerMenuBar';
import { PAGEIDS } from '../../utilities/PageIDs';
import PageLayout from '../PageLayout';
import RadGradSegment from '../../components/shared/RadGradSegment';
import RadGradHeader from '../../components/shared/RadGradHeader';
import { EXPLORER_TYPE_ICON } from '../../utilities/ExplorerUtils';
import TeaserVideo from '../../components/shared/TeaserVideo';
import { OpportunityTypes } from '../../../api/opportunity/OpportunityTypeCollection';

interface OpportunityExplorerProps {
  opportunity: Opportunity;
  relatedCareerGoals: CareerGoal[];
  relatedCourses: Course[];
}

const headerPaneTitle = 'The Opportunity Explorer';
const headerPaneBody = `
Opportunities are extracurricular activities that relate to this discipline. They are curated by the faculty to ensure that each Opportunity provides an educationally enriching experience.  Registered users can access reviews of (re-occuring) Opportunities to learn about the experiences of previous students. Registered users can also build community by finding other users who are interested in this Opportunity.

This public explorer does not provide information about community members or the reviews associated with Opportunities.
`;

const LandingOpportunityExplorerPage: React.FC<OpportunityExplorerProps> = ({ opportunity, relatedCourses, relatedCareerGoals }) => {
  const match = useRouteMatch();
  const teaser = Teasers.findNonRetired({ targetSlugID: opportunity.slugID });
  const hasTeaser = teaser.length > 0;
  const opportunityType = OpportunityTypes.findDoc(opportunity.opportunityTypeID).name;
  const dateStrings = [];
  if (opportunity.eventDate1) {
    dateStrings.push(moment(opportunity.eventDate1).format('MM/DD/YYYY'));
  }
  if (opportunity.eventDate2) {
    dateStrings.push(moment(opportunity.eventDate2).format('MM/DD/YYYY'));
  }
  if (opportunity.eventDate3) {
    dateStrings.push(moment(opportunity.eventDate3).format('MM/DD/YYYY'));
  }
  if (opportunity.eventDate4) {
    dateStrings.push(moment(opportunity.eventDate4).format('MM/DD/YYYY'));
  }
  const headerPaneImage = opportunity.picture;

  return (
    <div>
      <LandingExplorerMenuBar/>
      <PageLayout id={PAGEIDS.LANDING_OPPORTUNITY_EXPLORER} headerPaneTitle={headerPaneTitle}  headerPaneBody={headerPaneBody} headerPaneImage={headerPaneImage}>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <LandingExplorerMenuContainer />
            </Grid.Column>

            <Grid.Column width={13}>
              <RadGradSegment header={<RadGradHeader title={opportunity.name} dividing />}>
                {hasTeaser ? (<TeaserVideo id={teaser && teaser[0] && teaser[0].url} />) : ''}
                <React.Fragment>
                  <Grid stackable style={{ margin: '10px 0px' }}>
                    <Grid.Row columns={2}>
                      <Grid.Column>
                        <strong>Opportunity Type:</strong>&nbsp; { opportunityType }
                      </Grid.Column>
                      <Grid.Column>
                        <strong>Date: </strong>&nbsp; {opportunity.eventDate1 ? dateStrings.join(', ') : 'N/A'}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  {opportunity.description ? <Markdown escapeHtml source={opportunity.description} renderers={{ link: (localProps) => Router.renderLink(localProps, match) }} /> : 'N/A'}
                </React.Fragment>
              </RadGradSegment>
              <RadGradSegment header={<RadGradHeader title='Related Interests' icon={EXPLORER_TYPE_ICON.INTEREST} dividing/>}>{opportunity.interestIDs.length > 0 ? <LandingInterestList interestIDs={opportunity.interestIDs} size='small' /> : 'N/A'}</RadGradSegment>
              <RadGradSegment header={<RadGradHeader title="Related Career Goals" icon={EXPLORER_TYPE_ICON.CAREERGOAL} dividing />}>
                {relatedCareerGoals.length > 0 ? <LandingCareerGoalList careerGoals={relatedCareerGoals} size='small' /> : 'N/A'}
              </RadGradSegment>
              <RadGradSegment header={<RadGradHeader title="Related Courses" icon={EXPLORER_TYPE_ICON.COURSE} dividing />}>{relatedCourses.length > 0 ? <LandingCourseList courses={relatedCourses} size='small' /> : 'N/A'}</RadGradSegment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </PageLayout>
    </div>
  );
};

const LandingOpportunityExplorerContainer = withTracker(() => {
  const { opportunity } = useParams();
  const id = Slugs.getEntityID(opportunity, 'Opportunity');
  const opportunityDoc = Opportunities.findDoc(id);
  const relatedCareerGoals = Opportunities.findRelatedCareerGoals(opportunityDoc._id);
  const relatedCourses  = Opportunities.findRelatedCourses(opportunityDoc._id);
  return {
    opportunity: opportunityDoc,
    relatedCareerGoals,
    relatedCourses,
  };
})(LandingOpportunityExplorerPage);

export default withListSubscriptions(LandingOpportunityExplorerContainer, [
  AcademicTerms.getPublicationName(),
  Interests.getPublicationName(),
  Opportunities.getPublicationName(),
  CareerGoals.getPublicationName(),
  Courses.getPublicationName(),
  Slugs.getPublicationName(),
  Teasers.getPublicationName(),
  OpportunityTypes.getPublicationName(),
]);
